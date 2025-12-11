# File: modules\auth\account\__tests__\account.service.spec.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/account/__tests__/account.service.spec.ts`

## Category
Backend

## File Type
TS (account.service.spec.ts)

## Size
8321 characters, 219 lines

## Full Code

```typescript
// src/modules/auth/account/account.service.spec.ts
import type { Request } from 'express'

import { I18nService } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { ERiskLevel, IRiskAssessment, IRiskFactor, RiskCalculatorUtil, RiskMapperUtil } from '@/modules/auth/2fa'
import { AccountLockService } from '@/modules/security'
import { SecurityEventService } from '@/modules/security-event'
import { HashUtil } from '@/shared/utils/hash.util'
import * as sessionMetadataUtil from '@/shared/utils/session-metadata.util'
import { BadRequestException, ConflictException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ESecurityEvent, ESecuritySeverity, EUserRole, type User } from '@prisma/__generated__'

import { SessionService } from '../../session'
import { VerificationService } from '../../verification'
import { AccountService } from '../account.service'

// --- Mocks ---

const mockI18nService = { t: jest.fn(key => key) }
const mockPrismaService = {
	user: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
}
const mockVerificationService = { sendEmailVerificationToken: jest.fn() }
const mockSessionService = { invalidateUserSessions: jest.fn() }
const mockSecurityEventService = { create: jest.fn() }

// ✅ Полный, типобезопасный mockUser
const mockUser: User = {
	id: 'user-id-123',
	fullName: 'Test User',
	firstName: 'Test',
	lastName: 'User',
	email: 'test@example.com',
	phone: '+1234567890',
	password: 'hashed-old-password',
	avatar: null,
	bio: null,
	roles: [EUserRole.USER],
	isEmailVerified: true,
	emailVerifiedAt: new Date(),
	isUnsubscribed: false,
	emailBouncedAt: null,
	isPhoneVerified: false,
	phoneVerifiedAt: null,
	phoneBouncedAt: null,
	is2FAEnabled: false,
	preferred2FAMethod: null,
	require2FA: false,
	lastLoginAt: new Date(),
	lastLoginIp: '127.0.0.1',
	passwordChangedAt: new Date(),
	riskScore: 0,
	lastRiskAssessAt: null,
	deletedAt: null,
	createdAt: new Date(),
	updatedAt: new Date(),
}

describe('AccountService', () => {
	let service: AccountService

	beforeEach(async () => {
		jest.clearAllMocks()

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AccountLockService,
				{ provide: I18nService, useValue: mockI18nService },
				{ provide: PrismaService, useValue: mockPrismaService },
				{ provide: VerificationService, useValue: mockVerificationService },
				{ provide: SessionService, useValue: mockSessionService },
				{ provide: SecurityEventService, useValue: mockSecurityEventService },
			],
		}).compile()

		service = module.get<AccountService>(AccountService)
	})

	describe('create', () => {
		it('should create a new user, hash password, and send verification email', async () => {
			const input = {
				fullName: 'New User',
				email: 'new@example.com',
				password: 'password123',
				phone: '+19876543210',
			}
			const hashedPassword = 'hashed-new-password'

			jest.spyOn(HashUtil, 'hash').mockResolvedValue(hashedPassword)
			mockPrismaService.user.create.mockResolvedValue({ ...mockUser, ...input, password: hashedPassword })

			const result = await service.create(input, 'en')

			jest.spyOn(HashUtil, 'hash').mockImplementation(async plaintext => {
				expect(plaintext).toBe('password123')
				return hashedPassword
			})
			expect(mockPrismaService.user.create).toHaveBeenCalledWith({
				data: { ...input, email: 'new@example.com', password: hashedPassword },
			})
			expect(mockVerificationService.sendEmailVerificationToken).toHaveBeenCalled()
			expect(result.email).toBe('new@example.com')
		})

		it('should throw ConflictException if email already exists', async () => {
			const input = {
				fullName: 'New User',
				email: 'test@example.com',
				password: 'password123',
				phone: '+19876543210',
			}
			const prismaError = { name: 'PrismaClientKnownRequestError', code: 'P2002' }
			mockPrismaService.user.create.mockRejectedValue(prismaError)

			await expect(service.create(input, 'en')).rejects.toThrow(ConflictException)
		})
	})

	describe('changePassword', () => {
		const mockRequest = { session: { id: 'current-session-id' }, ip: '192.168.1.1' } as unknown as Request
		const input = { oldPassword: 'old-password', newPassword: 'new-password' }

		beforeEach(() => {
			// Мокаем утилиты, чтобы изолировать тест
			jest.spyOn(HashUtil, 'verify').mockResolvedValue(true)
			jest.spyOn(HashUtil, 'hash').mockResolvedValue('hashed-new-password')
			jest.spyOn(sessionMetadataUtil, 'getSessionMetadata').mockReturnValue({
				ip: '192.168.1.1',
				device: { browser: 'Chrome', os: 'macOS', type: 'desktop' },
				location: { city: 'Test City', country: 'Test Country', latitude: 0, longitude: 0 },
			})
		})

		it('should change password, invalidate sessions, and log security event', async () => {
			mockSessionService.invalidateUserSessions.mockResolvedValue(3) // 3 other sessions
			// Мокаем результат RiskCalculatorUtil
			const mockRiskAssessment: IRiskAssessment = {
				score: 35,
				level: ERiskLevel.MEDIUM,
				factors: [
					{
						type: 'multiple_sessions_invalidated',
						score: 15,
						weight: 1.0,
						description: 'Invalidated 3 other sessions.',
					} as IRiskFactor,
				],
				recommendations: [],
				require2FA: true,
				blockAccess: false,
				assessedAt: new Date(),
			}
			jest.spyOn(RiskCalculatorUtil, 'assessPasswordChange').mockReturnValue(mockRiskAssessment)
			// ✅ Мокаем маппер, так как он теперь вызывается в сервисе
			jest.spyOn(RiskMapperUtil, 'mapLevelToSeverity').mockReturnValue(ESecuritySeverity.MEDIUM)

			const result = await service.changePassword(mockRequest, mockUser, input, 'user-agent', 'en')

			jest.spyOn(HashUtil, 'verify').mockImplementation(async (hash, plaintext) => {
				// Можно добавить ассерты прямо здесь, если нужно
				return hash === 'hashed-old-password' && plaintext === 'old-password'
			})
			expect(mockPrismaService.user.update).toHaveBeenCalledWith({
				where: { id: mockUser.id },
				data: { password: 'hashed-new-password', passwordChangedAt: expect.any(Date) },
			})
			expect(mockSessionService.invalidateUserSessions).toHaveBeenCalledWith(mockUser.id, 'current-session-id')
			expect(mockSecurityEventService.create).toHaveBeenCalledWith(
				expect.objectContaining({
					userId: mockUser.id,
					event: ESecurityEvent.PASSWORD_CHANGED,
					severity: ESecuritySeverity.MEDIUM,
					riskScore: 35,
				}),
			)
			expect(result).toEqual({ success: true, sessionsInvalidated: 3 })
		})

		it('should throw BadRequestException for incorrect old password', async () => {
			jest.spyOn(HashUtil, 'verify').mockResolvedValue(false)

			await expect(service.changePassword(mockRequest, mockUser, input, 'ua', 'en')).rejects.toThrow(
				BadRequestException,
			)
			expect(mockPrismaService.user.update).not.toHaveBeenCalled()
			expect(mockSecurityEventService.create).not.toHaveBeenCalled()
		})

		it('should throw BadRequestException if new password is the same as the old one', async () => {
			await expect(
				service.changePassword(mockRequest, mockUser, { ...input, newPassword: 'old-password' }, 'ua', 'en'),
			).rejects.toThrow(BadRequestException)
		})
	})

	describe('changeEmail', () => {
		it('should successfully change email and send new verification token', async () => {
			const input = { email: 'new-email@example.com' }
			mockPrismaService.user.update.mockResolvedValue({ ...mockUser, email: input.email, isEmailVerified: false })

			const result = await service.changeEmail(mockUser, input, 'en')

			expect(mockPrismaService.user.update).toHaveBeenCalledWith({
				where: { id: mockUser.id },
				data: { email: 'new-email@example.com', isEmailVerified: false, emailVerifiedAt: null },
			})
			expect(mockVerificationService.sendEmailVerificationToken).toHaveBeenCalled()
			expect(result).toBe(true)
		})

		it('should throw BadRequestException if new email is the same as the old one', async () => {
			const input = { email: mockUser.email } // Same email
			await expect(service.changeEmail(mockUser, input, 'en')).rejects.toThrow(BadRequestException)
		})
	})
})

```

## Description

This file is part of the MedicHub API (NestJS) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.344Z*
