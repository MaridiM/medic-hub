# File: modules\auth\verification\__tests__\verification.service.spec.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/verification/__tests__/verification.service.spec.ts`

## Category
Backend

## File Type
TS (verification.service.spec.ts)

## Size
5578 characters, 186 lines

## Full Code

```typescript
// src/modules/auth/verification/verification.service.spec.ts
import type { Request } from 'express'

import { I18nService } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { MailService } from '@/core/provider/mail'
import { SmsService } from '@/core/provider/sms'
import * as generateTokenUtil from '@/shared/utils/generate-token.util'
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ETokenType, EUserRole, type Token, type User } from '@prisma/__generated__'

import { VerificationService } from '../verification.service'

// ✅ 1. Create a complete and valid mockUser
const mockUser: User = {
	id: 'user-uuid-123',
	fullName: 'Test User',
	firstName: 'Test',
	lastName: 'User',
	email: 'test@example.com',
	phone: '+15551234567',
	password: 'hashed-password',
	avatar: null,
	bio: null,
	roles: [EUserRole.USER],
	isEmailVerified: false,
	emailVerifiedAt: null,
	isUnsubscribed: false,
	emailBouncedAt: null,
	isPhoneVerified: false,
	phoneVerifiedAt: null,
	phoneBouncedAt: null,
	is2FAEnabled: false,
	preferred2FAMethod: null,
	require2FA: false,
	lastLoginAt: null,
	lastLoginIp: null,
	passwordChangedAt: null,
	riskScore: 0,
	lastRiskAssessAt: null,
	deletedAt: null,
	createdAt: new Date(),
	updatedAt: new Date(),
}

// ✅ Create a full mock for Token
const mockToken: Token = {
	id: 'token-uuid',
	token: 'generated-token-123',
	type: ETokenType.EMAIL_VERIFY,
	expiresIn: new Date(Date.now() + 300000),
	userId: mockUser.id,
	usedAt: null,
	maxUses: 1,
	useCount: 0,
	createdIp: null,
	usedIp: null,
	createdAt: new Date(),
	updatedAt: new Date(),
}

// Mock Services
const mockI18nService = {
	t: jest.fn().mockImplementation(key => key),
}

const mockPrismaService = {
	token: {
		findUnique: jest.fn(),
		delete: jest.fn(),
	},
	user: {
		update: jest.fn(),
	},
	$transaction: jest.fn().mockImplementation(async callback => callback(mockPrismaService)),
}

const mockMailService = {
	sendVerificationEmailToken: jest.fn(),
	sendOtpCodeEmail: jest.fn(),
}

const mockSmsService = {
	sendOtpSMS: jest.fn(),
}

describe('VerificationService', () => {
	let service: VerificationService

	beforeEach(async () => {
		jest.clearAllMocks()

		// ✅ 2. Mock the utility with a fully typed object
		jest.spyOn(generateTokenUtil, 'generateToken').mockResolvedValue(mockToken)

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				VerificationService,
				{ provide: I18nService, useValue: mockI18nService },
				{ provide: PrismaService, useValue: mockPrismaService },
				{ provide: MailService, useValue: mockMailService },
				{ provide: SmsService, useValue: mockSmsService },
			],
		}).compile()

		service = module.get<VerificationService>(VerificationService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('sendVerificationToken (private method testing)', () => {
		// ... (tests here remain unchanged since they use the typed mockUser)

		it('should throw an error if sending SMS to a user without a phone number', async () => {
			// ✅ 3. Explicitly specify the type for userWithoutPhone
			const userWithoutPhone: User = { ...mockUser, phone: null }
			await expect(service.sendSmsVerificationOtpToken(userWithoutPhone, 'en')).rejects.toThrow(
				InternalServerErrorException,
			)
		})

		// ...
	})

	describe('verificationEmail', () => {
		// ✅ 4. Create a typed mock for Request
		const mockRequest = { session: {} } as unknown as Request

		it('should successfully verify a valid token', async () => {
			mockPrismaService.token.findUnique.mockResolvedValue({
				...mockToken,
				type: ETokenType.EMAIL_VERIFY,
			})
			mockPrismaService.user.update.mockResolvedValue(mockUser)

			const result = await service.verificationEmail(
				mockRequest,
				{ token: 'valid-token' },
				'user-agent-string',
				'en',
			)

			expect(mockPrismaService.user.update).toHaveBeenCalledWith(
				expect.objectContaining({
					where: { id: mockUser.id },
					data: { isEmailVerified: true },
				}),
			)
			expect(mockPrismaService.token.delete).toHaveBeenCalledWith({ where: { id: 'token-uuid' } })

			// ✅ Use toMatchObject to compare part of the object since saveSession adds extra fields
			expect(result).toMatchObject({ user: mockUser })
		})

		it('should throw NotFoundException if token is not found', async () => {
			mockPrismaService.token.findUnique.mockResolvedValue(null)
			await expect(
				service.verificationEmail(mockRequest, { token: 'not-found-token' }, 'ua', 'en'),
			).rejects.toThrow(NotFoundException)
		})

		it('should throw BadRequestException if token is expired', async () => {
			mockPrismaService.token.findUnique.mockResolvedValue({
				...mockToken,
				expiresIn: new Date(Date.now() - 1000), // Expired
			})
			await expect(
				service.verificationEmail(mockRequest, { token: 'expired-token' }, 'ua', 'en'),
			).rejects.toThrow(BadRequestException)
		})

		it('should throw NotFoundException if token type is incorrect', async () => {
			mockPrismaService.token.findUnique.mockResolvedValue({
				...mockToken,
				type: ETokenType.PASSWORD_RESET, // ❌ Wrong type
			})
			await expect(
				service.verificationEmail(mockRequest, { token: 'wrong-type-token' }, 'ua', 'en'),
			).rejects.toThrow(NotFoundException)
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.481Z*
