/* eslint-disable @typescript-eslint/unbound-method */
import { hash } from 'argon2'
import type { Request } from 'express'

import { I18nService } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { MailService,} from '@/core/provider'
import { SecurityEventService } from '@/modules/security-event'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ESecurityEvent, ESecuritySeverity, ETokenType } from '@prisma/__generated__'

import { RecoveryService } from '../recovery.service'

// Mock argon2 module
jest.mock('argon2', () => ({
	hash: jest.fn(),
	verify: jest.fn(),
}))

const mockHash = hash as jest.MockedFunction<typeof hash>

describe('RecoveryService', () => {
	let service: RecoveryService
	let prismaService: PrismaService
	let mailService: MailService
	let securityEventService: SecurityEventService

	const mockPrismaService = {
		user: {
			findUnique: jest.fn(),
			update: jest.fn(),
		},
		token: {
			findUnique: jest.fn(),
			upsert: jest.fn(),
			delete: jest.fn(),
		},
		$transaction: jest.fn(),
	}

	const mockI18nService = {
		t: jest.fn((key: string) => key),
	}

	const mockMailService = {
		sendPasswordResetToken: jest.fn(),
		sendPasswordResetConfirmation: jest.fn(),
	}

	const mockSecurityEventService = {
		create: jest.fn(),
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RecoveryService,
				{ provide: PrismaService, useValue: mockPrismaService },
				{ provide: I18nService, useValue: mockI18nService },
				{ provide: MailService, useValue: mockMailService },
				{ provide: SecurityEventService, useValue: mockSecurityEventService },
			],
		}).compile()

		service = module.get<RecoveryService>(RecoveryService)
		prismaService = module.get<PrismaService>(PrismaService)
		mailService = module.get<MailService>(MailService)
		securityEventService = module.get<SecurityEventService>(SecurityEventService)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('resetPassword', () => {
		const mockReq = {
			ip: '192.168.1.1',
			headers: { 'user-agent': 'Mozilla/5.0' },
		} as unknown as Request

		it('should send reset email for existing user', async () => {
			const email = 'user@example.com'
			const mockUser = { id: 'user-123', email }
			const mockToken = {
				id: 'token-123',
				token: 'reset-token-uuid',
				type: ETokenType.PASSWORD_RESET,
				expiresIn: new Date(Date.now() + 3600000),
			}

			mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
			mockPrismaService.token.upsert.mockResolvedValue(mockToken)
			mockMailService.sendPasswordResetToken.mockResolvedValue(undefined)
			mockSecurityEventService.create.mockResolvedValue({})

			const result = await service.resetPassword(mockReq, { email }, 'Mozilla/5.0', 'en')

			expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
				where: { email },
				select: { id: true, email: true },
			})
			expect(mockMailService.sendPasswordResetToken).toHaveBeenCalledWith(
				email,
				'reset-token-uuid',
				expect.any(Object),
				'en',
			)
			expect(mockSecurityEventService.create).toHaveBeenCalledWith({
				userId: 'user-123',
				event: ESecurityEvent.PASSWORD_RESET_REQUESTED,
				severity: ESecuritySeverity.MEDIUM,
				ip: '192.168.1.1',
				userAgent: 'Mozilla/5.0',
				country: undefined,
				city: undefined,
				metadata: expect.objectContaining({
					email,
					tokenId: 'token-123',
				}),
			})
			expect(result).toBe(true)
		})

		it('should return true for non-existent user (enumeration protection)', async () => {
			const email = 'nonexistent@example.com'

			mockPrismaService.user.findUnique.mockResolvedValue(null)
			mockSecurityEventService.create.mockResolvedValue({})

			const result = await service.resetPassword(mockReq, { email }, 'Mozilla/5.0', 'en')

			expect(mockSecurityEventService.create).toHaveBeenCalledWith({
				userId: 'unknown',
				event: ESecurityEvent.PASSWORD_RESET_REQUESTED,
				severity: ESecuritySeverity.LOW,
				ip: '192.168.1.1',
				userAgent: 'Mozilla/5.0',
				country: undefined,
				city: undefined,
				metadata: {
					email,
					userExists: false,
					reason: 'email_enumeration_protection',
				},
			})
			expect(mockMailService.sendPasswordResetToken).not.toHaveBeenCalled()
			expect(result).toBe(true)
		})

		it('should not fail if email sending fails', async () => {
			const email = 'user@example.com'
			const mockUser = { id: 'user-123', email }
			const mockToken = {
				id: 'token-123',
				token: 'reset-token-uuid',
				type: ETokenType.PASSWORD_RESET,
				expiresIn: new Date(Date.now() + 3600000),
			}

			mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
			mockPrismaService.token.upsert.mockResolvedValue(mockToken)
			mockMailService.sendPasswordResetToken.mockRejectedValue(new Error('SMTP Error'))
			mockSecurityEventService.create.mockResolvedValue({})

			const result = await service.resetPassword(mockReq, { email }, 'Mozilla/5.0', 'en')

			expect(result).toBe(true) // Should still return true (non-blocking)
		})
	})

	describe('newPassword', () => {
		it('should reset password with valid token', async () => {
			const input = {
				token: 'valid-token-uuid',
				password: 'new_password_123',
			}

			const mockToken = {
				id: 'token-123',
				type: ETokenType.PASSWORD_RESET,
				expiresIn: new Date(Date.now() + 3600000),
				userId: 'user-123',
			}

			const mockUser = {
				id: 'user-123',
				email: 'user@example.com',
			}

			mockPrismaService.token.findUnique.mockResolvedValue(mockToken)
			mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
			mockHash.mockResolvedValue('hashed-new-password')
			mockPrismaService.$transaction.mockResolvedValue([{}, {}])
			mockSecurityEventService.create.mockResolvedValue({})
			mockMailService.sendPasswordResetConfirmation.mockResolvedValue(undefined)

			const result = await service.newPassword(input, 'en')

			expect(mockPrismaService.token.findUnique).toHaveBeenCalledWith({
				where: { token: input.token },
				select: { id: true, type: true, expiresIn: true, userId: true },
			})
			expect(mockHash).toHaveBeenCalledWith('new_password_123')
			expect(mockPrismaService.$transaction).toHaveBeenCalled()
			expect(mockSecurityEventService.create).toHaveBeenCalledWith({
				userId: 'user-123',
				event: ESecurityEvent.PASSWORD_RESET_COMPLETED,
				severity: ESecuritySeverity.HIGH,
				ip: 'unknown',
				userAgent: 'unknown',
				metadata: expect.objectContaining({
					tokenId: 'token-123',
				}),
			})
			expect(mockMailService.sendPasswordResetConfirmation).toHaveBeenCalledWith(
				'user@example.com',
				{
					ip: 'unknown',
					location: undefined,
					device: undefined,
				},
				'en',
			)
			expect(result).toBe(true)
		})

		it('should throw NotFoundException for invalid token', async () => {
			const input = {
				token: 'invalid-token',
				password: 'new_password_123',
			}

			mockPrismaService.token.findUnique.mockResolvedValue(null)

			await expect(service.newPassword(input, 'en')).rejects.toThrow(NotFoundException)

			expect(mockHash).not.toHaveBeenCalled()
			expect(mockPrismaService.$transaction).not.toHaveBeenCalled()
		})

		it('should throw NotFoundException for wrong token type', async () => {
			const input = {
				token: 'email-verify-token',
				password: 'new_password_123',
			}

			const mockToken = {
				id: 'token-123',
				type: ETokenType.EMAIL_VERIFY, // Wrong type
				expiresIn: new Date(Date.now() + 3600000),
				userId: 'user-123',
			}

			mockPrismaService.token.findUnique.mockResolvedValue(mockToken)

			await expect(service.newPassword(input, 'en')).rejects.toThrow(NotFoundException)

			expect(mockHash).not.toHaveBeenCalled()
		})

		it('should throw BadRequestException for expired token', async () => {
			const input = {
				token: 'expired-token',
				password: 'new_password_123',
			}

			const mockToken = {
				id: 'token-123',
				type: ETokenType.PASSWORD_RESET,
				expiresIn: new Date(Date.now() - 3600000), // Expired 1 hour ago
				userId: 'user-123',
			}

			mockPrismaService.token.findUnique.mockResolvedValue(mockToken)

			await expect(service.newPassword(input, 'en')).rejects.toThrow(BadRequestException)

			expect(mockHash).not.toHaveBeenCalled()
		})

		it('should not fail if confirmation email fails', async () => {
			const input = {
				token: 'valid-token-uuid',
				password: 'new_password_123',
			}

			const mockToken = {
				id: 'token-123',
				type: ETokenType.PASSWORD_RESET,
				expiresIn: new Date(Date.now() + 3600000),
				userId: 'user-123',
			}

			const mockUser = {
				id: 'user-123',
				email: 'user@example.com',
			}

			mockPrismaService.token.findUnique.mockResolvedValue(mockToken)
			mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
			mockHash.mockResolvedValue('hashed-new-password')
			mockPrismaService.$transaction.mockResolvedValue([{}, {}])
			mockSecurityEventService.create.mockResolvedValue({})
			mockMailService.sendPasswordResetConfirmation.mockRejectedValue(new Error('SMTP Error'))

			const result = await service.newPassword(input, 'en')

			expect(result).toBe(true) // Should still succeed despite email error
		})
	})
})
