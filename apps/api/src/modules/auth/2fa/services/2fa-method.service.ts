import { encode } from 'hi-base32'
import { randomBytes } from 'node:crypto'
import { TOTP } from 'otpauth'
import * as QRCode from 'qrcode'

import { APP_NAME } from '@/core/config'
import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { MailService, SmsService } from '@/modules/libs'
import { NotificationService } from '@/modules/notification'
import { HashUtil } from '@/shared/utils'
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	UnauthorizedException,
} from '@nestjs/common'
import { E2FAMethod, ESecurityEvent, ESecuritySeverity, Prisma, type User } from '@prisma/__generated__'

import { AUDIT_ACTIONS, OTP_CONFIG, QR_CODE_OPTIONS, REDIS_KEYS, TOTP_CONFIG, TWO_FA_CONFIG } from '../constants'
import type {
	CompleteTotpSetupInput,
	RegenerateBackupCodesInput,
	Remove2FAMethodInput,
	SendOtpCodeInput,
	SetupOtpInput,
	Update2FAMethodInput,
	VerifyOtpSetupInput,
} from '../dtos'
import type { IOtpEmailMethodData, IOtpSmsMethodData, ITotpMethodData } from '../types'
import { EncryptionUtil } from '../utils'

import { BackupCodeService } from './backup-code.service'
import { SecurityEventService } from './security-event.service'

/**
 * Main 2FA Method Service
 * Orchestrates all 2FA operations across different methods
 */
@Injectable()
export class TwoFactorMethodService extends CoreService {
	private readonly logger = new Logger(TwoFactorMethodService.name)

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly backupCodeService: BackupCodeService,
		private readonly securityEventService: SecurityEventService,
		private readonly mailService: MailService,
		private readonly smsService: SmsService,
		private readonly notificationService: NotificationService,
	) {
		super(i18n, prisma, redis)
	}

	// ==================== TOTP Methods ====================

	/**
	 * Generate TOTP setup (QR code + secret)
	 */
	async generateTotpSetup(user: User, name: string | undefined, lng: Language) {
		// Check if user already has max methods
		await this.checkMethodLimits(user.id, lng)

		// Generate secret
		const secret = this.generateTotpSecret()

		// Create TOTP instance
		const totp = this.createTOTP(user.email, secret)
		const otpAuthUrl = totp.toString()

		// Generate QR code
		const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl, QR_CODE_OPTIONS)

		// Store temporary secret in Redis (10 minutes)
		const tempKey = REDIS_KEYS.TOTP_TEMP_SECRET(user.id)
		await this.rSetJSON(tempKey, { secret, name }, 600)

		this.logger.log(`TOTP setup generated for user ${user.id}`)

		return {
			methodId: 'temp', // Temporary ID until verified
			qrCodeUrl,
			manualEntryKey: secret,
			issuer: APP_NAME,
			accountName: user.email,
		}
	}

	/**
	 * Complete TOTP setup after user scans QR and enters code
	 */
	async completeTotpSetup(user: User, input: CompleteTotpSetupInput, lng: Language) {
		// Get temporary secret
		const tempKey = REDIS_KEYS.TOTP_TEMP_SECRET(user.id)
		const cached = await this.rGetJSON<{ secret: string; name?: string }>(tempKey)

		if (!cached?.secret) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.setup_expired', {
					lng,
					defaultValue: 'TOTP setup has expired. Please start again.',
				}),
			)
		}

		if (cached.secret !== input.secret) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.invalid_secret', { lng, defaultValue: 'Invalid TOTP secret' }),
			)
		}

		// Verify code
		const isValid = this.verifyTotpCode(user.email, input.secret, input.code)
		if (!isValid) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.invalid_code', { lng, defaultValue: 'Invalid verification code' }),
			)
		}

		// Encrypt secret
		const encryptedSecret = EncryptionUtil.encrypt(input.secret)

		// Prepare method data
		const methodData: ITotpMethodData = {
			secret: encryptedSecret,
			algorithm: TOTP_CONFIG.ALGORITHM,
			digits: TOTP_CONFIG.DIGITS,
			period: TOTP_CONFIG.PERIOD,
			issuer: APP_NAME,
			accountName: user.email,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}

		// Create method and backup codes in transaction
		const result = await this.prisma.$transaction(async tx => {
			// Check if this should be primary (first method)
			const existingMethods = await tx.authenticationMethod.count({
				where: { userId: user.id, isActive: true },
			})
			const isPrimary = existingMethods === 0

			// Create authentication method
			const method = await tx.authenticationMethod.create({
				data: {
					userId: user.id,
					method: E2FAMethod.TOTP,
					data: methodData as unknown as Prisma.JsonValue,
					name: input.name || cached.name || 'TOTP Authenticator',
					isPrimary,
					isActive: true,
				},
			})

			// Enable 2FA on user if this is first method
			if (isPrimary) {
				await tx.user.update({
					where: { id: user.id },
					data: {
						is2FAEnabled: true,
						preferred2FAMethod: E2FAMethod.TOTP,
					},
				})
			}

			// Log audit
			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: AUDIT_ACTIONS.TOTP_SETUP_COMPLETED,
					category: 'SECURITY',
					success: true,
					metadata: { methodId: method.id } as Prisma.InputJsonValue,
				},
			})

			return method
		})

		// Generate backup codes (outside transaction for better error handling)
		const backupCodes = await this.backupCodeService.generateBackupCodes(user.id, E2FAMethod.TOTP, result.id)

		await this.securityEventService.logEvent({
			userId: user.id,
			event: ESecurityEvent.TWO_FA_METHOD_ADDED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: {
				methodId: result.id,
				methodType: result.method,
				timestamp: new Date().toISOString(),
			},
		})

		// ✅ NOTIFICATION CALL
		await this.notificationService.notify2FAMethodAdded(user, E2FAMethod.TOTP, result.name, lng)

		// Clear temp secret
		await this.rDel(tempKey)

		this.logger.log(`TOTP setup completed for user ${user.id}, method ${result.id}`)

		return {
			success: true,
			methodId: result.id,
			backupCodes,
			message: this.i18n.t('auth.setup.2fa.backup_codes_warning', {
				lng,
				defaultValue: 'Save these backup codes in a secure place. Each code can only be used once.',
			}),
		}
	}

	// ==================== OTP Methods ====================

	/**
	 * Setup OTP (Email or SMS)
	 */
	async setupOtp(user: User, input: SetupOtpInput, lng: Language) {
		await this.checkMethodLimits(user.id, lng)

		// Validate input
		if (input.method === E2FAMethod.OTP_EMAIL && !input.email && !user.email) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.email_required', { lng, defaultValue: 'Email is required for OTP_EMAIL' }),
			)
		}

		if (input.method === E2FAMethod.OTP_SMS && !input.phone && !user.phone) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.phone_required', { lng, defaultValue: 'Phone is required for OTP_SMS' }),
			)
		}

		// Prepare method data
		let methodData: IOtpEmailMethodData | IOtpSmsMethodData

		if (input.method === E2FAMethod.OTP_EMAIL) {
			const email = input.email || user.email
			methodData = {
				email,
				sentCount: 0,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}
		} else {
			const phone = input.phone || user.phone
			methodData = {
				phone,
				sentCount: 0,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}
		}

		// Create method
		const existingMethods = await this.prisma.authenticationMethod.count({
			where: { userId: user.id, isActive: true },
		})
		const isPrimary = existingMethods === 0

		const method = await this.prisma.authenticationMethod.create({
			data: {
				userId: user.id,
				method: input.method,
				data: methodData as unknown as Prisma.JsonValue,
				name: input.name || `${input.method === E2FAMethod.OTP_EMAIL ? 'Email' : 'SMS'} OTP`,
				isPrimary,
				isActive: false, // Inactive until verified
			},
		})

		// Enable 2FA if first method
		if (isPrimary) {
			await this.prisma.user.update({
				where: { id: user.id },
				data: {
					is2FAEnabled: true,
					preferred2FAMethod: input.method,
				},
			})
		}

		this.logger.log(`OTP setup created for user ${user.id}, method ${method.id}`)

		return {
			methodId: method.id,
			destination:
				input.method === E2FAMethod.OTP_EMAIL
					? (methodData as IOtpEmailMethodData).email
					: (methodData as IOtpSmsMethodData).phone,
			message: this.i18n.t('auth.setup.2fa.otp_created', {
				lng,
				defaultValue: 'OTP method created. Please verify with a code.',
			}),
		}
	}

	/**
	 * Send OTP code to user
	 */
	async sendOtpCode(user: User, input: SendOtpCodeInput, lng: Language) {
		const method = input.methodId
			? await this.prisma.authenticationMethod.findUnique({
					where: { id: input.methodId },
				})
			: await this.prisma.authenticationMethod.findFirst({
					where: {
						userId: user.id,
						method: { in: [E2FAMethod.OTP_EMAIL, E2FAMethod.OTP_SMS] },
						isPrimary: true,
					},
				})

		if (!method) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.method_not_found', { lng, defaultValue: 'OTP method not found' }),
			)
		}

		// Generate code
		const code = this.generateOtpCode()
		const hashedCode = await HashUtil.hash(code)

		// Store in Redis
		const codeKey = REDIS_KEYS.OTP_CODE(user.id)
		await this.rSetJSON(
			codeKey,
			{
				code: hashedCode,
				methodId: method.id,
				expiresAt: Date.now() + OTP_CONFIG.CODE_EXPIRY * 1000,
			},
			OTP_CONFIG.CODE_EXPIRY,
		)

		const methodData = method.data as unknown as IOtpEmailMethodData | IOtpSmsMethodData

		try {
			if (method.method === E2FAMethod.OTP_EMAIL) {
				const data = methodData as IOtpEmailMethodData
				// NOTE: We may need a new method in MailService to send a simple code.
				// For now, we'll adapt an existing one or assume it exists.
				await this.mailService.sendOtpCodeEmail(data.email, code, lng) // Assuming this method exists or will be created.
				this.logger.log(`OTP code sent to ${data.email}`)
			} else {
				const data = methodData as IOtpSmsMethodData
				await this.smsService.sendOtpSMS(data.phone, code, lng)
				this.logger.log(`OTP code sent to ${data.phone}`)
			}
		} catch (error) {
			this.logger.error(`Failed to send OTP for user ${user.id} via ${method.method}`, error)
			throw new InternalServerErrorException(
				this.i18n.t('auth.errors.2fa.send_failed', {
					lng,
					defaultValue: 'Failed to send the verification code.',
				}),
			)
		}

		return {
			success: true,
			message: this.i18n.t('auth.success.2fa.otp_sent', { lng, defaultValue: 'OTP code sent successfully' }),
		}
	}

	/**
	 * Verify OTP code during setup
	 */
	async verifyOtpSetup(user: User, input: VerifyOtpSetupInput, lng: Language) {
		// Get stored code
		const codeKey = REDIS_KEYS.OTP_CODE(user.id)
		const cached = await this.rGetJSON<{ code: string; methodId: string; expiresAt: number }>(codeKey)

		if (!cached) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.code_expired', { lng, defaultValue: 'OTP code has expired' }),
			)
		}

		if (cached.methodId !== input.methodId) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.method_mismatch', { lng, defaultValue: 'Code does not match method' }),
			)
		}

		// Verify code
		const isValid = await HashUtil.verify(cached.code, input.code)
		if (!isValid) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.invalid_code', { lng, defaultValue: 'Invalid OTP code' }),
			)
		}

		// Activate method and generate backup codes
		const result = await this.prisma.$transaction(async tx => {
			const method = await tx.authenticationMethod.update({
				where: { id: input.methodId },
				data: { isActive: true },
			})

			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: AUDIT_ACTIONS.OTP_SETUP_COMPLETED,
					category: 'SECURITY',
					success: true,
					metadata: { methodId: method.id } as Prisma.InputJsonValue,
				},
			})

			return method
		})

		// Log security event
		await this.securityEventService.logEvent({
			userId: user.id,
			event: ESecurityEvent.TWO_FA_METHOD_ADDED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: { methodId: result.id, methodType: result.method, timestamp: new Date().toISOString() },
		})

		await this.securityEventService.logEvent({
			userId: user.id,
			event: ESecurityEvent.TWO_FA_METHOD_ADDED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: {
				methodId: result.id,
				methodType: result.method,
				timestamp: new Date().toISOString(),
			},
		})

		const backupCodes = await this.backupCodeService.generateBackupCodes(user.id, result.method, result.id)
		await this.rDel(codeKey)

		// ✅ NOTIFICATION CALL
		await this.notificationService.notify2FAMethodAdded(user, result.method, result.name, lng)

		return {
			success: true,
			methodId: result.id,
			backupCodes,
			message: this.i18n.t('auth.setup.2fa.backup_codes_warning', {
				lng,
				defaultValue: 'Save these backup codes securely.',
			}),
		}
	}

	// ==================== Method Management ====================

	/**
	 * Get all user's 2FA methods
	 */
	async getUserMethods(userId: string) {
		const methods = await this.prisma.authenticationMethod.findMany({
			where: { userId, isActive: true },
			orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
		})

		const primary = methods.find(m => m.isPrimary)
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: { is2FAEnabled: true },
		})

		return {
			methods: methods.map(m => ({
				id: m.id,
				method: m.method,
				name: m.name,
				isActive: m.isActive,
				isPrimary: m.isPrimary,
				lastUsedAt: m.lastUsedAt,
				useCount: m.useCount,
				createdAt: m.createdAt,
			})),
			primary: primary
				? {
						id: primary.id,
						method: primary.method,
						name: primary.name,
						isActive: primary.isActive,
						isPrimary: primary.isPrimary,
						lastUsedAt: primary.lastUsedAt,
						useCount: primary.useCount,
						createdAt: primary.createdAt,
					}
				: undefined,
			totalActive: methods.length,
			is2FAEnabled: user?.is2FAEnabled || false,
		}
	}

	/**
	 * Update 2FA method
	 */
	async updateMethod(userId: string, input: Update2FAMethodInput, lng: Language) {
		const method = await this.prisma.authenticationMethod.findFirst({
			where: { id: input.methodId, userId },
		})

		if (!method) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.method_not_found', { lng, defaultValue: 'Method not found' }),
			)
		}

		// If setting as primary, unset other primary methods
		if (input.isPrimary) {
			await this.prisma.authenticationMethod.updateMany({
				where: { userId, isPrimary: true },
				data: { isPrimary: false },
			})
		}

		await this.prisma.authenticationMethod.update({
			where: { id: input.methodId },
			data: {
				name: input.name,
				isPrimary: input.isPrimary,
				isActive: input.isActive,
			},
		})

		return { success: true }
	}

	/**
	 * Remove 2FA method
	 */
	async removeMethod(user: User, input: Remove2FAMethodInput, lng: Language) {
		// Verify password
		const isPasswordValid = await HashUtil.verify(user.password, input.password)
		if (!isPasswordValid) {
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.password.invalid', { lng, defaultValue: 'Invalid password' }),
			)
		}

		const method = await this.prisma.authenticationMethod.findFirst({
			where: { id: input.methodId, userId: user.id },
		})

		if (!method) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.method_not_found', { lng, defaultValue: 'Method not found' }),
			)
		}

		// If removing last method, require additional confirmation
		const activeMethods = await this.prisma.authenticationMethod.count({
			where: { userId: user.id, isActive: true },
		})

		if (activeMethods === 1 && !input.code) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.last_method_code_required', {
					lng,
					defaultValue: 'Code required to remove last 2FA method',
				}),
			)
		}

		// Delete method and backup codes
		await this.prisma.$transaction(async tx => {
			await tx.authenticationMethod.delete({
				where: { id: input.methodId },
			})

			await tx.backupCode.deleteMany({
				where: { authMethodId: input.methodId },
			})

			// If this was the last method, disable 2FA
			if (activeMethods === 1) {
				await tx.user.update({
					where: { id: user.id },
					data: {
						is2FAEnabled: false,
						preferred2FAMethod: null,
					},
				})
			}
		})

		// Log security event
		await this.securityEventService.logEvent({
			userId: user.id,
			event: activeMethods === 1 ? ESecurityEvent.TWO_FA_DISABLED : ESecurityEvent.TWO_FA_METHOD_REMOVED,
			severity: ESecuritySeverity.HIGH,
			metadata: { methodId: input.methodId, methodType: method.method, timestamp: new Date().toISOString() },
		})

		// ✅ NOTIFICATION CALL
		if (activeMethods === 1) {
			// Last method removed - 2FA completely disabled
			await this.notificationService.notify2FADisabled(user, lng)
		} else {
			await this.notificationService.notify2FAMethodRemoved(user, method.method, method.name, lng)
		}

		return { success: true }
	}

	/**
	 * Regenerate backup codes
	 */
	async regenerateBackupCodes(user: User, input: RegenerateBackupCodesInput, lng: Language) {
		// Verify password
		const isPasswordValid = await HashUtil.verify(user.password, input.password)
		if (!isPasswordValid) {
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.password.invalid', { lng, defaultValue: 'Invalid password' }),
			)
		}

		let backupCodes: string[]

		if (input.methodId) {
			const method = await this.prisma.authenticationMethod.findFirst({
				where: { id: input.methodId, userId: user.id },
			})

			if (!method) {
				throw new BadRequestException(
					this.i18n.t('auth.errors.2fa.method_not_found', { lng, defaultValue: 'Method not found' }),
				)
			}

			backupCodes = await this.backupCodeService.regenerateBackupCodes(user.id, method.method, method.id)
		} else {
			// Regenerate for all methods
			const methods = await this.prisma.authenticationMethod.findMany({
				where: { userId: user.id, isActive: true },
			})

			backupCodes = []
			for (const method of methods) {
				const codes = await this.backupCodeService.regenerateBackupCodes(user.id, method.method, method.id)
				backupCodes.push(...codes)
			}
		}

		// ✅ NOTIFICATION CALL
		await this.notificationService.notifyBackupCodesRegenerated(user, lng)

		await this.securityEventService.logEvent({
			userId: user.id,
			event: ESecurityEvent.TWO_FA_BACKUP_CODES_REGENERATED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: {
				methodId: input.methodId || 'all',
				methodType: 'BACKUP_CODE',
				timestamp: new Date().toISOString(),
			},
		})

		return {
			success: true,
			backupCodes,
			message: this.i18n.t('auth.setup.2fa.backup_codes_warning', {
				lng,
				defaultValue: 'Save these backup codes securely.',
			}),
		}
	}

	// ... (после regenerateBackupCodes)

	// ==================== Method Verification ====================

	/**
	 * Verifies a TOTP code against the encrypted secret.
	 * This method is public to be accessible from the resolver.
	 *
	 * @param email - User's email (for TOTP label).
	 * @param encryptedSecret - The encrypted secret from the database.
	 * @param code - The 6-digit code from the user.
	 * @returns {boolean} - True if the code is valid.
	 */
	public verifyTotpCode(email: string, encryptedSecret: string, code: string): boolean {
		try {
			const secret = EncryptionUtil.decrypt(encryptedSecret)
			const totp = this.createTOTP(email, secret) // createTOTP остается private
			const delta = totp.validate({ token: code, window: TOTP_CONFIG.WINDOW })
			return delta !== null
		} catch (error) {
			this.logger.error(`TOTP code verification failed: ${(error as Error).message}`)
			return false
		}
	}

	/**
	 * Verifies a one-time code (Email/SMS) against the value stored in Redis.
	 * This method is public to be accessible from the resolver.
	 *
	 * @param userId - The ID of the user.
	 * @param methodId - The ID of the OTP method being verified.
	 * @param code - The 6-digit code from the user.
	 * @param lng - The language for error messages.
	 * @returns {Promise<boolean>} - True if the code is valid.
	 */
	public async verifyOneTimeCode(userId: string, methodId: string, code: string, lng: Language): Promise<boolean> {
		const codeKey = REDIS_KEYS.OTP_CODE(userId)
		const cached = await this.rGetJSON<{ code: string; methodId: string; expiresAt: number }>(codeKey)

		if (!cached) {
			// Не выбрасываем ошибку здесь, чтобы резолвер мог обработать это как "неверный код"
			return false
		}

		// Проверяем, что код предназначен для этого метода
		if (cached.methodId !== methodId) {
			return false
		}

		const isValid = await HashUtil.verify(cached.code, code)
		if (isValid) {
			// Prevent code reuse by deleting it after successful verification.
			await this.rDel(codeKey)
		}
		return isValid
	}

	// ==================== Private Helpers ====================

	private async checkMethodLimits(userId: string, lng: Language): Promise<void> {
		const count = await this.prisma.authenticationMethod.count({
			where: { userId, isActive: true },
		})

		if (count >= TWO_FA_CONFIG.MAX_METHODS_PER_USER) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.max_methods', {
					lng,
					defaultValue: `Maximum ${TWO_FA_CONFIG.MAX_METHODS_PER_USER} methods allowed`,
					max: TWO_FA_CONFIG.MAX_METHODS_PER_USER,
				}),
			)
		}
	}

	private generateTotpSecret(): string {
		return encode(randomBytes(15)).replace(/=/g, '').substring(0, TOTP_CONFIG.SECRET_LENGTH)
	}

	private createTOTP(email: string, secret: string): TOTP {
		return new TOTP({
			issuer: APP_NAME,
			label: email,
			algorithm: TOTP_CONFIG.ALGORITHM,
			digits: TOTP_CONFIG.DIGITS,
			period: TOTP_CONFIG.PERIOD,
			secret,
		})
	}

	private generateOtpCode(): string {
		return Math.floor(100000 + Math.random() * 900000).toString()
	}
}
