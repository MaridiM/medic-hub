import { randomBytes } from 'crypto'
import { encode } from 'hi-base32'
import { TOTP } from 'otpauth'
import * as QRCode from 'qrcode'

import { APP_NAME } from '@/core/config'
import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { HashUtil } from '@/shared/utils/hash.util'
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { EBackupCodeType, type User } from '@prisma/__generated__'

import {
	BACKUP_CODE_BYTES,
	BACKUP_CODES_COUNT,
	CODE_REUSE_WINDOW,
	createAuditMetadata,
	MAX_ATTEMPTS,
	QR_CODE_OPTIONS,
	RATE_LIMIT_WINDOW,
	REDIS_KEY_PREFIX,
	TEMP_SECRET_TTL,
	type TempSecretCache,
	TOTP_ALGORITHM,
	TOTP_AUDIT_ACTIONS,
	TOTP_DIGITS,
	TOTP_PERIOD,
	TOTP_SECRET_LENGTH,
	TOTP_WINDOW,
} from './constants'
import { DisableTotpInput, EnableTotpInput } from './dtos'
import { BackupCodesStatusModel, TotpEnabledModel, TotpModel } from './models'
import { CryptoUtil } from './utils/crypto.util'

@Injectable()
export class TotpService extends CoreService {
	private readonly logger = new Logger(TotpService.name)

	constructor(i18n: I18nService, prisma: PrismaService, redis: RedisService) {
		super(i18n, prisma, redis)
	}

	/**
	 * Генерация TOTP секрета и QR-кода
	 */
	async generate(user: User, lng: Language): Promise<TotpModel> {
		await this.checkRateLimit(user.id, 'generate', lng)

		if (user.isTotpEnabled) {
			throw new BadRequestException(
				this.msg('auth.errors.totp.already_enabled', 'Two-factor authentication is already enabled', { lng }),
			)
		}

		const secret = this.generateSecret()
		const totp = this.createTOTP(user.email, secret)
		const otpAuthUrl = totp.toString()
		const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl, QR_CODE_OPTIONS)

		// ✅ Используем функцию напрямую
		const tempKey = REDIS_KEY_PREFIX.TEMP_SECRET(user.id)
		const cacheData: TempSecretCache = { secret }
		await this.rSetJSON(tempKey, cacheData, TEMP_SECRET_TTL)

		this.logger.log(`TOTP secret generated for user ${user.id}`)

		return {
			qrCodeUrl,
			manualEntryKey: secret,
			issuer: APP_NAME,
			accountName: user.email,
		}
	}

	/**
	 * Включение TOTP с backup кодами
	 */
	async enable(user: User, input: EnableTotpInput, lng: Language): Promise<TotpEnabledModel> {
		await this.checkRateLimit(user.id, 'enable', lng)

		if (user.isTotpEnabled) {
			throw new BadRequestException(
				this.msg('auth.errors.totp.already_enabled', 'Two-factor authentication is already enabled', { lng }),
			)
		}

		// ✅ Используем функцию напрямую
		const tempKey = REDIS_KEY_PREFIX.TEMP_SECRET(user.id)
		const cached = await this.rGetJSON<TempSecretCache>(tempKey)

		if (!cached?.secret) {
			throw new BadRequestException(
				this.msg('auth.errors.totp.secret_expired', 'TOTP secret has expired. Please generate a new one', {
					lng,
				}),
			)
		}

		if (cached.secret !== input.secret) {
			throw new BadRequestException(this.msg('auth.errors.totp.invalid_secret', 'Invalid TOTP secret', { lng }))
		}

		const isValid = await this.validateCode(user.email, input.secret, input.code)

		if (!isValid) {
			await this.incrementFailedAttempts(user.id, 'enable')
			throw new BadRequestException(
				this.msg('auth.errors.totp.invalid_code', 'Invalid verification code', { lng }),
			)
		}

		const backupCodes = this.generateBackupCodes()
		const hashedBackupCodes = await Promise.all(backupCodes.map(code => HashUtil.hash(code)))
		const encryptedSecret = CryptoUtil.encrypt(input.secret)

		await this.prisma.$transaction(async tx => {
			await tx.user.update({
				where: { id: user.id },
				data: {
					isTotpEnabled: true,
					totpSecret: encryptedSecret,
				},
			})

			await tx.backupCode.createMany({
				data: hashedBackupCodes.map(hash => ({
					userId: user.id,
					type: EBackupCodeType.TOTP,
					code: hash,
				})),
			})

			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: TOTP_AUDIT_ACTIONS.ENABLED,
					metadata: createAuditMetadata({ email: user.email }),
				},
			})
		})

		await this.rDel(tempKey)
		await this.clearRateLimit(user.id, 'enable')

		this.logger.log(`TOTP enabled for user ${user.id}`)

		return {
			success: true,
			backupCodes,
			message: this.msg(
				'auth.errors.totp.backup_codes_warning',
				'Save these backup codes in a secure place. Each code can only be used once',
				{ lng },
			),
		}
	}

	/**
	 * Отключение TOTP с верификацией
	 */
	async disable(user: User, input: DisableTotpInput, lng: Language): Promise<boolean> {
		await this.checkRateLimit(user.id, 'disable', lng)

		if (!user.isTotpEnabled) {
			throw new BadRequestException(
				this.msg('auth.errors.totp.not_enabled', 'Two-factor authentication is not enabled', { lng }),
			)
		}

		const isPasswordValid = await HashUtil.verify(user.password, input.password)

		if (!isPasswordValid) {
			await this.incrementFailedAttempts(user.id, 'disable')
			throw new UnauthorizedException(this.msg('auth.errors.password.invalid', 'Invalid password', { lng }))
		}

		const decryptedSecret = CryptoUtil.decrypt(user.totpSecret)
		const isCodeValid = await this.validateCode(user.email, decryptedSecret, input.code)

		if (!isCodeValid) {
			await this.incrementFailedAttempts(user.id, 'disable')
			throw new BadRequestException(
				this.msg('auth.errors.totp.invalid_code', 'Invalid verification code', { lng }),
			)
		}

		await this.prisma.$transaction(async tx => {
			await tx.user.update({
				where: { id: user.id },
				data: {
					isTotpEnabled: false,
					totpSecret: null,
				},
			})

			await tx.backupCode.deleteMany({
				where: {
					userId: user.id,
					type: EBackupCodeType.TOTP,
				},
			})

			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: TOTP_AUDIT_ACTIONS.DISABLED,
					metadata: createAuditMetadata({ email: user.email }),
				},
			})
		})

		await this.clearRateLimit(user.id, 'disable')

		this.logger.warn(`TOTP disabled for user ${user.id}`)

		return true
	}

	/**
	 * Верификация TOTP кода (для логина)
	 */
	async verify(user: User, code: string, lng: Language): Promise<boolean> {
		await this.checkRateLimit(user.id, 'verify', lng)

		if (!user.isTotpEnabled || !user.totpSecret) {
			throw new BadRequestException(
				this.msg('auth.errors.totp.not_enabled', 'Two-factor authentication is not enabled', { lng }),
			)
		}

		const normalizedCode = code.replace(/\s/g, '').toUpperCase()

		// ✅ Используем функцию напрямую с правильными параметрами
		const usedKey = REDIS_KEY_PREFIX.USED_CODE(user.id, normalizedCode)
		const isUsed = await this.rExists(usedKey)

		if (isUsed) {
			await this.incrementFailedAttempts(user.id, 'verify')
			throw new BadRequestException(
				this.msg('auth.errors.totp.code_already_used', 'This code has already been used', { lng }),
			)
		}

		const decryptedSecret = CryptoUtil.decrypt(user.totpSecret)
		const isValid = await this.validateCode(user.email, decryptedSecret, code)

		if (isValid) {
			await this.rSet(usedKey, '1', CODE_REUSE_WINDOW)
			await this.clearRateLimit(user.id, 'verify')
			await this.logSuccessfulVerification(user.id)
			return true
		}

		const isBackupValid = await this.validateBackupCode(user.id, normalizedCode)

		if (isBackupValid) {
			await this.clearRateLimit(user.id, 'verify')
			await this.logSuccessfulVerification(user.id, true)
			return true
		}

		await this.incrementFailedAttempts(user.id, 'verify')
		throw new BadRequestException(this.msg('auth.errors.totp.invalid_code', 'Invalid verification code', { lng }))
	}

	/**
	 * Получение статуса backup кодов
	 */
	async getBackupCodesStatus(user: User, lng: Language): Promise<BackupCodesStatusModel> {
		if (!user.isTotpEnabled) {
			throw new BadRequestException(
				this.msg('auth.errors.totp.not_enabled', 'Two-factor authentication is not enabled', { lng }),
			)
		}

		const allCodes = await this.prisma.backupCode.count({
			where: {
				userId: user.id,
				type: EBackupCodeType.TOTP,
			},
		})

		const usedCodes = await this.prisma.backupCode.count({
			where: {
				userId: user.id,
				type: EBackupCodeType.TOTP,
				usedAt: { not: null },
			},
		})

		return {
			total: allCodes,
			remaining: allCodes - usedCodes,
			used: usedCodes,
		}
	}

	/**
	 * Регенерация backup кодов
	 */
	async regenerateBackupCodes(user: User, password: string, lng: Language): Promise<TotpEnabledModel> {
		if (!user.isTotpEnabled) {
			throw new BadRequestException(
				this.msg('auth.errors.totp.not_enabled', 'Two-factor authentication is not enabled', { lng }),
			)
		}

		const isPasswordValid = await HashUtil.verify(user.password, password)

		if (!isPasswordValid) {
			throw new UnauthorizedException(this.msg('auth.errors.password.invalid', 'Invalid password', { lng }))
		}

		const backupCodes = this.generateBackupCodes()
		const hashedBackupCodes = await Promise.all(backupCodes.map(code => HashUtil.hash(code)))

		await this.prisma.$transaction(async tx => {
			await tx.backupCode.deleteMany({
				where: {
					userId: user.id,
					type: EBackupCodeType.TOTP,
				},
			})

			await tx.backupCode.createMany({
				data: hashedBackupCodes.map(hash => ({
					userId: user.id,
					type: EBackupCodeType.TOTP,
					code: hash,
				})),
			})

			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: TOTP_AUDIT_ACTIONS.BACKUP_CODES_REGENERATED,
					metadata: createAuditMetadata(),
				},
			})
		})

		this.logger.log(`Backup codes regenerated for user ${user.id}`)

		return {
			success: true,
			backupCodes,
			message: this.msg(
				'auth.errors.totp.backup_codes_warning',
				'Save these backup codes in a secure place. Each code can only be used once',
				{ lng },
			),
		}
	}

	// ==================== Приватные методы ====================

	private generateSecret(): string {
		return encode(randomBytes(15)).replace(/=/g, '').substring(0, TOTP_SECRET_LENGTH)
	}

	private createTOTP(email: string, secret: string): TOTP {
		return new TOTP({
			issuer: APP_NAME,
			label: email,
			algorithm: TOTP_ALGORITHM,
			digits: TOTP_DIGITS,
			period: TOTP_PERIOD,
			secret,
		})
	}

	private async validateCode(email: string, secret: string, code: string): Promise<boolean> {
		const totp = this.createTOTP(email, secret)
		const delta = totp.validate({
			token: code,
			window: TOTP_WINDOW,
		})
		return Promise.resolve(delta !== null)
	}

	private generateBackupCodes(): string[] {
		return Array.from({ length: BACKUP_CODES_COUNT }, () =>
			randomBytes(BACKUP_CODE_BYTES).toString('hex').toUpperCase(),
		)
	}

	private async validateBackupCode(userId: string, code: string): Promise<boolean> {
		const backupCodes = await this.prisma.backupCode.findMany({
			where: {
				userId,
				type: EBackupCodeType.TOTP,
				usedAt: null,
			},
		})

		for (const backup of backupCodes) {
			const isMatch = await HashUtil.verify(backup.code, code)

			if (isMatch) {
				await this.prisma.backupCode.update({
					where: { id: backup.id },
					data: { usedAt: new Date() },
				})

				this.logger.log(`Backup code used for user ${userId}`)
				return true
			}
		}

		return false
	}

	private async checkRateLimit(userId: string, action: string, lng: Language): Promise<void> {
		// ✅ Используем функцию напрямую
		const key = REDIS_KEY_PREFIX.RATE_LIMIT(userId, action)
		const attempts = await this.rGetNumber(key)

		if (attempts !== null && attempts >= MAX_ATTEMPTS) {
			const ttl = await this.rTTL(key)
			const minutesLeft = Math.ceil(ttl / 60)

			throw new BadRequestException(
				this.msg(
					'auth.errors.totp.rate_limit_exceeded',
					`Too many attempts. Try again in ${minutesLeft} minutes`,
					{ lng, minutes: minutesLeft },
				),
			)
		}
	}

	private async incrementFailedAttempts(userId: string, action: string): Promise<void> {
		// ✅ Используем функцию напрямую
		const key = REDIS_KEY_PREFIX.RATE_LIMIT(userId, action)
		await this.rIncr(key, RATE_LIMIT_WINDOW)
	}

	private async clearRateLimit(userId: string, action: string): Promise<void> {
		// ✅ Используем функцию напрямую
		const key = REDIS_KEY_PREFIX.RATE_LIMIT(userId, action)
		await this.rDel(key)
	}

	private async logSuccessfulVerification(userId: string, isBackupCode: boolean = false): Promise<void> {
		await this.prisma.auditLog.create({
			data: {
				userId,
				action: isBackupCode ? TOTP_AUDIT_ACTIONS.BACKUP_CODE_VERIFIED : TOTP_AUDIT_ACTIONS.VERIFIED,
				metadata: createAuditMetadata(),
			},
		})
	}
}
