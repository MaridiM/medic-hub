// src/modules/auth/2fa/services/2fa-method.service.spec.ts
import { I18nService } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { MailService, SmsService } from '@/core/provider'
import { RedisService } from '@/core/redis'
import { NotificationService } from '@/modules/notification'
import { BadRequestException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { E2FAMethod, User } from '@prisma/__generated__'

import { BackupCodeService, SecurityEventService, TwoFactorMethodService } from '../../services'
import { EncryptionUtil } from '../../utils'

type PrismaTransactionClient = {
	authenticationMethod: {
		count: jest.Mock
		create: jest.Mock
	}
	user: {
		update: jest.Mock
	}
	auditLog: {
		create: jest.Mock
	}
}

describe('TwoFactorMethodService - Encryption', () => {
	let service: TwoFactorMethodService
	let prismaService: PrismaService

	// Mock services
	const mockPrismaService = {
		authenticationMethod: {
			count: jest.fn(),
			create: jest.fn(),
			findUnique: jest.fn(),
			findFirst: jest.fn(),
		},
		user: {
			update: jest.fn(),
		},
		$transaction: jest.fn(),
	}

	const mockRedisService = {
		getJSON: jest.fn(),
		setJSON: jest.fn(),
		del: jest.fn(),
	}

	const mockI18nService = {
		t: jest.fn((key: string) => key),
	}

	const mockBackupCodeService = {
		generateBackupCodes: jest.fn().mockResolvedValue(['CODE1', 'CODE2']),
	}

	const mockSecurityEventService = {
		logEvent: jest.fn().mockResolvedValue(undefined),
	}

	const mockMailService = {
		sendOtpCodeEmail: jest.fn().mockResolvedValue(undefined),
	}

	const mockSmsService = {
		sendOtpSMS: jest.fn().mockResolvedValue(undefined),
	}

	const mockNotificationService = {
		notify2FAMethodAdded: jest.fn().mockResolvedValue(undefined),
	}

	beforeEach(async () => {
		jest.clearAllMocks()

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TwoFactorMethodService,
				{ provide: PrismaService, useValue: mockPrismaService },
				{ provide: RedisService, useValue: mockRedisService },
				{ provide: I18nService, useValue: mockI18nService },
				{ provide: BackupCodeService, useValue: mockBackupCodeService },
				{ provide: SecurityEventService, useValue: mockSecurityEventService },
				{ provide: MailService, useValue: mockMailService },
				{ provide: SmsService, useValue: mockSmsService },
				{ provide: NotificationService, useValue: mockNotificationService },
			],
		}).compile()

		service = module.get<TwoFactorMethodService>(TwoFactorMethodService)
		prismaService = module.get<PrismaService>(PrismaService)
	})

	describe('TOTP Setup - Encryption', () => {
		const mockUser = {
			id: 'user-123',
			email: 'test@example.com',
			password: 'hashed',
			is2FAEnabled: false,
		}

		it('should encrypt TOTP method data before saving to database', async () => {
			// Arrange
			const encryptSpy = jest.spyOn(EncryptionUtil, 'encryptJSON')

			mockRedisService.getJSON.mockResolvedValue({
				secret: 'JBSWY3DPEHPK3PXP',
				name: 'My Authenticator',
			})

			mockPrismaService.authenticationMethod.count.mockResolvedValue(0)

			// ✅ Type-safe transaction mock
			mockPrismaService.$transaction.mockImplementation(
				<T>(callback: (prisma: PrismaTransactionClient) => Promise<T>): Promise<T> => {
					const mockTxClient: PrismaTransactionClient = {
						authenticationMethod: {
							count: jest.fn().mockResolvedValue(0),
							create: jest.fn().mockResolvedValue({
								id: 'method-123',
								userId: 'user-123',
								method: E2FAMethod.TOTP,
								name: 'My Authenticator',
								isPrimary: true,
								isActive: true,
								data: 'encrypted-data-string',
								createdAt: new Date(),
							}),
						},
						user: {
							update: jest.fn().mockResolvedValue(mockUser),
						},
						auditLog: {
							create: jest.fn().mockResolvedValue({}),
						},
					}
					return callback(mockTxClient)
				},
			)

			// Act
			await service.completeTotpSetup(
				mockUser as User,
				{
					secret: 'JBSWY3DPEHPK3PXP',
					code: '123456',
					name: 'My Authenticator',
				},
				'en',
			)

			// Assert
			expect(encryptSpy).toHaveBeenCalledTimes(1)
			expect(encryptSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					secret: 'JBSWY3DPEHPK3PXP',
					algorithm: 'SHA1',
					digits: 6,
					period: 30,
				}),
			)

			encryptSpy.mockRestore()
		})
	})

	describe('OTP Setup - Encryption', () => {
		const mockUser = {
			id: 'user-123',
			email: 'test@example.com',
			phone: '+1234567890',
			is2FAEnabled: false,
		}

		it('should encrypt OTP Email method data before saving to database', async () => {
			// Arrange
			const encryptSpy = jest.spyOn(EncryptionUtil, 'encryptJSON')

			mockPrismaService.authenticationMethod.count.mockResolvedValue(0)
			mockPrismaService.authenticationMethod.create.mockResolvedValue({
				id: 'method-456',
				userId: 'user-123',
				method: E2FAMethod.OTP_EMAIL,
				name: 'Email OTP',
				data: 'encrypted-email-data',
				isPrimary: true,
				isActive: false,
			})

			// Act
			await service.setupOtp(
				mockUser as User,
				{
					method: E2FAMethod.OTP_EMAIL,
					email: 'test@example.com',
					name: 'Email OTP',
				},
				'en',
			)

			// Assert
			expect(encryptSpy).toHaveBeenCalledTimes(1)
			expect(encryptSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					email: 'test@example.com',
					sentCount: 0,
				}),
			)

			encryptSpy.mockRestore()
		})

		it('should encrypt OTP SMS method data before saving to database', async () => {
			// Arrange
			const encryptSpy = jest.spyOn(EncryptionUtil, 'encryptJSON')

			mockPrismaService.authenticationMethod.count.mockResolvedValue(0)
			mockPrismaService.authenticationMethod.create.mockResolvedValue({
				id: 'method-789',
				userId: 'user-123',
				method: E2FAMethod.OTP_SMS,
				name: 'SMS OTP',
				data: 'encrypted-sms-data',
				isPrimary: true,
				isActive: false,
			})

			// Act
			await service.setupOtp(
				mockUser as User,
				{
					method: E2FAMethod.OTP_SMS,
					phone: '+1234567890',
					name: 'SMS OTP',
				},
				'en',
			)

			// Assert
			expect(encryptSpy).toHaveBeenCalledTimes(1)
			expect(encryptSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					phone: '+1234567890',
					sentCount: 0,
				}),
			)

			encryptSpy.mockRestore()
		})
	})

	describe('Data Reading - Decryption', () => {
		const mockUser = {
			id: 'user-123',
			email: 'test@example.com',
		}

		it('should decrypt TOTP data when verifying code', () => {
			// Arrange
			const decryptSpy = jest.spyOn(EncryptionUtil, 'decryptJSON')
			const encryptedData = EncryptionUtil.encryptJSON({
				secret: 'JBSWY3DPEHPK3PXP',
				algorithm: 'SHA1',
				digits: 6,
				period: 30,
				issuer: 'TestApp',
				accountName: 'test@example.com',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			})

			// Act
			service.verifyTotpCode('test@example.com', encryptedData, '123456')

			// Assert
			expect(decryptSpy).toHaveBeenCalledTimes(1)
			expect(decryptSpy).toHaveBeenCalledWith(encryptedData)

			decryptSpy.mockRestore()
		})

		it('should decrypt OTP data when sending code', async () => {
			// Arrange
			const decryptSpy = jest.spyOn(EncryptionUtil, 'decryptJSON')
			const encryptedData = EncryptionUtil.encryptJSON({
				email: 'test@example.com',
				sentCount: 0,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			})

			mockPrismaService.authenticationMethod.findFirst.mockResolvedValue({
				id: 'method-123',
				userId: 'user-123',
				method: E2FAMethod.OTP_EMAIL,
				data: encryptedData,
				isPrimary: true,
			})

			// Act
			await service.sendOtpCode(mockUser as User, {}, 'en')

			// Assert
			expect(decryptSpy).toHaveBeenCalledTimes(1)

			decryptSpy.mockRestore()
		})
	})

	describe('Error Handling - Corrupted Data', () => {
		const mockUser = {
			id: 'user-123',
			email: 'test@example.com',
		}

		it('should return false when decrypting corrupted TOTP data', () => {
			// Arrange
			const corruptedData = 'invalid-encrypted-string-!!!@@@'

			// Act
			const result = service.verifyTotpCode('test@example.com', corruptedData, '123456')

			// Assert
			expect(result).toBe(false)
		})

		it('should throw BadRequestException when decrypting corrupted OTP data', async () => {
			// Arrange
			mockPrismaService.authenticationMethod.findFirst.mockResolvedValue({
				id: 'method-123',
				method: E2FAMethod.OTP_EMAIL,
				data: 'corrupted-data-###',
			})

			// Act & Assert
			await expect(service.sendOtpCode(mockUser as User, {}, 'en')).rejects.toThrow(BadRequestException)
		})
	})

	describe('Legacy Data Compatibility', () => {
		it('should handle unencrypted data gracefully (legacy format)', async () => {
			// Arrange
			const legacyData = {
				email: 'test@example.com',
				sentCount: 5,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}

			mockPrismaService.authenticationMethod.findFirst.mockResolvedValue({
				id: 'method-legacy',
				method: E2FAMethod.OTP_EMAIL,
				data: legacyData,
			})

			// Act
			const result = await service.sendOtpCode({ id: 'user-123', email: 'test@example.com' } as User, {}, 'en')

			// Assert
			expect(result.success).toBe(true)
			expect(mockMailService.sendOtpCodeEmail).toHaveBeenCalledWith('test@example.com', expect.any(String), 'en')
		})
	})
})
