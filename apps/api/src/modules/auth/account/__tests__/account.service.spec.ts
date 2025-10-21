/* eslint-disable @typescript-eslint/unbound-method */
import type { Request } from 'express'

import { I18nService } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { SecurityEventService } from '@/modules/security-event'
import { HashUtil } from '@/shared/utils/hash.util'
import { BadRequestException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ESecurityEvent, ESecuritySeverity, User } from '@prisma/__generated__'

import { SessionService } from '../../session'
import { VerificationService } from '../../verification'
import { AccountService } from '../account.service'

// Mock HashUtil module
jest.mock('@/shared/utils/hash.util', () => ({
	HashUtil: {
		hash: jest.fn(),
		verify: jest.fn(),
		needsRehash: jest.fn(),
	},
}))

// Type assertion for mocked HashUtil
const mockHashUtil = HashUtil as jest.Mocked<typeof HashUtil>

describe('AccountService', () => {
	let service: AccountService
	let prismaService: PrismaService
	let sessionService: SessionService
	let securityEventService: SecurityEventService

	const mockPrismaService = {
		user: {
			findUnique: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
		},
	}

	const mockI18nService = {
		t: jest.fn((key: string) => key),
	}

	const mockVerificationService = {
		sendEmailVerificationToken: jest.fn(),
	}

	const mockSessionService = {
		invalidateUserSessions: jest.fn(),
	}

	const mockSecurityEventService = {
		create: jest.fn(),
		calculateRiskScore: jest.fn(),
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AccountService,
				{ provide: PrismaService, useValue: mockPrismaService },
				{ provide: I18nService, useValue: mockI18nService },
				{ provide: VerificationService, useValue: mockVerificationService },
				{ provide: SessionService, useValue: mockSessionService },
				{ provide: SecurityEventService, useValue: mockSecurityEventService },
			],
		}).compile()

		service = module.get<AccountService>(AccountService)
		prismaService = module.get<PrismaService>(PrismaService)
		sessionService = module.get<SessionService>(SessionService)
		securityEventService = module.get<SecurityEventService>(SecurityEventService)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('changePassword', () => {
		const mockUser: User = {
			id: 'user-123',
			email: 'test@example.com',
			password: 'hashed-old-password',
			fullName: 'Test User',
		} as User

		const mockReq = {
			ip: '192.168.1.1',
			headers: { 'user-agent': 'Mozilla/5.0' },
			session: { id: 'session-current' },
		} as unknown as Request

		it('should change password and invalidate other sessions', async () => {
			const input = { oldPassword: 'oldpass123', newPassword: 'newpass456' }

			mockHashUtil.verify.mockResolvedValue(true)
			mockHashUtil.hash.mockResolvedValue('hashed-new-password')

			mockPrismaService.user.update.mockResolvedValue(mockUser)
			mockSessionService.invalidateUserSessions.mockResolvedValue(3)
			mockSecurityEventService.calculateRiskScore.mockReturnValue(35)
			mockSecurityEventService.create.mockResolvedValue({})

			const result = await service.changePassword(mockReq, mockUser, input, 'Mozilla/5.0', 'en')

			expect(mockHashUtil.verify).toHaveBeenCalledWith('hashed-old-password', 'oldpass123')
			expect(mockHashUtil.hash).toHaveBeenCalledWith('newpass456')
			expect(mockPrismaService.user.update).toHaveBeenCalledWith({
				where: { id: 'user-123' },
				data: {
					password: 'hashed-new-password',
					passwordChangedAt: expect.any(Date),
				},
			})
			expect(mockSessionService.invalidateUserSessions).toHaveBeenCalledWith('user-123', 'session-current')
			expect(mockSecurityEventService.create).toHaveBeenCalledWith({
				userId: 'user-123',
				event: ESecurityEvent.PASSWORD_CHANGED,
				severity: ESecuritySeverity.MEDIUM,
				ip: '192.168.1.1',
				userAgent: 'Mozilla/5.0',
				country: undefined,
				city: undefined,
				riskScore: 35,
				riskFactors: expect.any(Array),
				metadata: {
					sessionsInvalidated: 3,
					browser: undefined,
					os: undefined,
				},
			})
			expect(result).toEqual({
				success: true,
				sessionsInvalidated: 3,
			})
		})

		it('should throw BadRequestException if old password is invalid', async () => {
			const input = { oldPassword: 'wrongpass', newPassword: 'newpass456' }

			mockHashUtil.verify.mockResolvedValue(false)

			await expect(service.changePassword(mockReq, mockUser, input, 'Mozilla/5.0', 'en')).rejects.toThrow(
				BadRequestException,
			)

			expect(mockHashUtil.verify).toHaveBeenCalledWith('hashed-old-password', 'wrongpass')
			expect(mockHashUtil.hash).not.toHaveBeenCalled()
			expect(mockSessionService.invalidateUserSessions).not.toHaveBeenCalled()
			expect(mockSecurityEventService.create).not.toHaveBeenCalled()
		})

		it('should throw BadRequestException if new password equals old password', async () => {
			const input = { oldPassword: 'samepass123', newPassword: 'samepass123' }

			mockHashUtil.verify.mockResolvedValue(true)

			await expect(service.changePassword(mockReq, mockUser, input, 'Mozilla/5.0', 'en')).rejects.toThrow(
				BadRequestException,
			)

			expect(mockHashUtil.verify).toHaveBeenCalledWith('hashed-old-password', 'samepass123')
			expect(mockHashUtil.hash).not.toHaveBeenCalled()
			expect(mockSessionService.invalidateUserSessions).not.toHaveBeenCalled()
			expect(mockSecurityEventService.create).not.toHaveBeenCalled()
		})

		it('should calculate higher severity for high risk scores', async () => {
			const input = { oldPassword: 'oldpass123', newPassword: 'newpass456' }

			mockHashUtil.verify.mockResolvedValue(true)
			mockHashUtil.hash.mockResolvedValue('hashed-new-password')

			mockPrismaService.user.update.mockResolvedValue(mockUser)
			mockSessionService.invalidateUserSessions.mockResolvedValue(5)
			mockSecurityEventService.calculateRiskScore.mockReturnValue(55)
			mockSecurityEventService.create.mockResolvedValue({})

			await service.changePassword(mockReq, mockUser, input, 'Mozilla/5.0', 'en')

			expect(mockSecurityEventService.create).toHaveBeenCalledWith(
				expect.objectContaining({
					severity: ESecuritySeverity.HIGH,
					riskScore: 55,
				}),
			)
		})

		it('should invalidate 0 sessions if user has only current session', async () => {
			const input = { oldPassword: 'oldpass123', newPassword: 'newpass456' }

			mockHashUtil.verify.mockResolvedValue(true)
			mockHashUtil.hash.mockResolvedValue('hashed-new-password')

			mockPrismaService.user.update.mockResolvedValue(mockUser)
			mockSessionService.invalidateUserSessions.mockResolvedValue(0)
			mockSecurityEventService.calculateRiskScore.mockReturnValue(20)
			mockSecurityEventService.create.mockResolvedValue({})

			const result = await service.changePassword(mockReq, mockUser, input, 'Mozilla/5.0', 'en')

			expect(result).toEqual({
				success: true,
				sessionsInvalidated: 0,
			})

			expect(mockSecurityEventService.create).toHaveBeenCalledWith(
				expect.objectContaining({
					severity: ESecuritySeverity.LOW,
					riskScore: 20,
					metadata: expect.objectContaining({
						sessionsInvalidated: 0,
					}),
				}),
			)
		})
	})
})
