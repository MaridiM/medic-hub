import { randomBytes, randomInt } from 'crypto'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { HashUtil } from '@/shared/utils/hash.util'
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { EBackupCodeType, type User } from '@prisma/__generated__'

import { VerificationService } from '../verification'

import {
	createOtpAuditMetadata,
	OTP_AUDIT_ACTIONS,
	OTP_BACKUP_CODE_BYTES,
	OTP_BACKUP_CODES_COUNT,
	OTP_CHANNELS,
	OTP_CODE_EXPIRY,
	OTP_CODE_LENGTH,
	OTP_CODE_REUSE_WINDOW,
	OTP_CODE_TTL,
	OTP_COOLDOWN,
	OTP_MAX_ATTEMPTS_PER_CODE,
	OTP_MAX_REQUESTS_PER_HOUR,
	OTP_RATE_LIMIT_WINDOW,
	OTP_REDIS_KEY_PREFIX,
	OtpAuditMetadata,
	type OtpCodeCache,
} from './constants'
import { DisableOtpInput, EnableOtpInput, VerifyOtpInput } from './dtos'
import { SendOtpInput } from './dtos/send-otp.dto'
import { OtpBackupCodesStatusModel, OtpEnabledModel, OtpSentModel } from './models'

@Injectable()
export class OtpService extends CoreService {
	private readonly logger = new Logger(OtpService.name)

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly verification: VerificationService,
	) {
		super(i18n, prisma, redis)
	}

	/**
	 * Включение OTP для пользователя
	 */
	async enable(user: User, input: EnableOtpInput, lng: Language): Promise<OtpEnabledModel> {
		await this.checkRateLimit(user.id, 'enable', lng)

		if (user.isOtpEnabled) {
			throw new BadRequestException(
				this.msg('auth.errors.otp.already_enabled', 'OTP is already enabled', { lng }),
			)
		}

		// Валидация канала
		if (input.channel === OTP_CHANNELS.SMS && !input.phone && !user.phone) {
			throw new BadRequestException(
				this.msg('auth.errors.otp.phone_required', 'Phone number is required for SMS channel', { lng }),
			)
		}

		// Обновляем телефон если предоставлен
		if (input.phone && input.phone !== user.phone) {
			await this.prisma.user.update({
				where: { id: user.id },
				data: { phone: input.phone },
			})
		}

		// Генерируем backup коды
		const backupCodes = this.generateBackupCodes()
		const hashedBackupCodes = await Promise.all(backupCodes.map(code => HashUtil.hash(code)))

		await this.prisma.$transaction(async tx => {
			await tx.user.update({
				where: { id: user.id },
				data: {
					isOtpEnabled: true,
				},
			})

			await tx.backupCode.createMany({
				data: hashedBackupCodes.map(hash => ({
					userId: user.id,
					type: EBackupCodeType.OTP,
					code: hash,
				})),
			})

			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: OTP_AUDIT_ACTIONS.ENABLED,
					metadata: createOtpAuditMetadata({
						channel: input.channel,
					}),
				},
			})
		})

		await this.clearRateLimit(user.id, 'enable')

		this.logger.log(`OTP enabled for user ${user.id} via ${input.channel}`)

		return {
			success: true,
			backupCodes,
			message: this.msg(
				'auth.errors.otp.backup_codes_warning',
				'Save these backup codes in a secure place. Each code can only be used once',
				{ lng },
			),
		}
	}

	/**
	 * Отключение OTP
	 */
	async disable(user: User, input: DisableOtpInput, lng: Language): Promise<boolean> {
		await this.checkRateLimit(user.id, 'disable', lng)

		if (!user.isOtpEnabled) {
			throw new BadRequestException(this.msg('auth.errors.otp.not_enabled', 'OTP is not enabled', { lng }))
		}

		// Проверяем пароль
		const isPasswordValid = await HashUtil.verify(user.password, input.password)

		if (!isPasswordValid) {
			await this.incrementFailedAttempts(user.id, 'disable')
			throw new UnauthorizedException(this.msg('auth.errors.password.invalid', 'Invalid password', { lng }))
		}

		// Проверяем OTP код
		const isCodeValid = await this.verifyCode(user.id, input.code, lng)

		if (!isCodeValid) {
			await this.incrementFailedAttempts(user.id, 'disable')
			throw new BadRequestException(this.msg('auth.errors.otp.invalid_code', 'Invalid OTP code', { lng }))
		}

		await this.prisma.$transaction(async tx => {
			await tx.user.update({
				where: { id: user.id },
				data: {
					isOtpEnabled: false,
				},
			})

			await tx.backupCode.deleteMany({
				where: {
					userId: user.id,
					type: EBackupCodeType.OTP,
				},
			})

			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: OTP_AUDIT_ACTIONS.DISABLED,
					metadata: createOtpAuditMetadata(),
				},
			})
		})

		// Очищаем Redis
		await this.clearOtpData(user.id)
		await this.clearRateLimit(user.id, 'disable')

		this.logger.warn(`OTP disabled for user ${user.id}`)

		return true
	}

	/**
	 * Отправка OTP кода
	 */
	async send(user: User, input: SendOtpInput, lng: Language): Promise<OtpSentModel> {
		await this.checkRateLimit(user.id, 'send', lng)

		if (!user.isOtpEnabled) {
			throw new BadRequestException(this.msg('auth.errors.otp.not_enabled', 'OTP is not enabled', { lng }))
		}

		// Проверяем cooldown
		await this.checkCooldown(user.id, lng)

		// Валидация канала
		if (input.channel === OTP_CHANNELS.SMS && !user.phone) {
			throw new BadRequestException(
				this.msg('auth.errors.otp.phone_not_set', 'Phone number is not set for this user', { lng }),
			)
		}

		// Генерируем код
		const code = this.generateOtpCode()
		const hashedCode = await HashUtil.hash(code)

		// Сохраняем в Redis
		const cacheData: OtpCodeCache = {
			code: hashedCode,
			channel: input.channel,
			expiresAt: Date.now() + OTP_CODE_TTL * 1000,
		}

		const codeKey = OTP_REDIS_KEY_PREFIX.CODE(user.id)
		await this.rSetJSON(codeKey, cacheData, OTP_CODE_TTL)

		// Устанавливаем cooldown
		const cooldownKey = OTP_REDIS_KEY_PREFIX.COOLDOWN(user.id)
		await this.rSet(cooldownKey, '1', OTP_COOLDOWN)

		// Отправляем код
		try {
			if (input.channel === OTP_CHANNELS.EMAIL) {
				await this.verification.sendEmailVerificationOtpToken(user, lng)
				// await this.verification.sendEmail(user.email, code, lng)
			} else if (input.channel === OTP_CHANNELS.SMS && user.phone) {
				await this.verification.sendSmsVerificationOtpToken(user, lng)
				// await this.verification.sendSms(user.phone, code, lng)
			}
		} catch (error) {
			this.logger.error(`Failed to send OTP to user ${user.id}: ${error}`)
			throw new BadRequestException(this.msg('auth.errors.otp.send_failed', 'Failed to send OTP code', { lng }))
		}

		// Логируем
		await this.prisma.auditLog.create({
			data: {
				userId: user.id,
				action: OTP_AUDIT_ACTIONS.SENT,
				metadata: createOtpAuditMetadata({ channel: input.channel }),
			},
		})

		this.logger.log(`OTP sent to user ${user.id} via ${input.channel}`)

		return {
			success: true,
			channel: input.channel,
			expiresIn: OTP_CODE_EXPIRY,
			message: this.msg('auth.errors.otp.sent', `OTP code sent to your ${input.channel}`, { lng }),
		}
	}

	/**
	 * Верификация OTP кода
	 */
	async verify(user: User, input: VerifyOtpInput, lng: Language): Promise<boolean> {
		return this.verifyCode(user.id, input.code, lng)
	}

	/**
	 * Проверка OTP кода (внутренний метод)
	 */
	private async verifyCode(userId: string, code: string, lng: Language): Promise<boolean> {
		await this.checkRateLimit(userId, 'verify', lng)

		// Получаем сохраненный код
		const codeKey = OTP_REDIS_KEY_PREFIX.CODE(userId)
		const cached = await this.rGetJSON<OtpCodeCache>(codeKey)

		if (!cached) {
			throw new BadRequestException(
				this.msg('auth.errors.otp.not_found', 'OTP code not found or expired', { lng }),
			)
		}

		// Проверяем истечение
		if (Date.now() > cached.expiresAt) {
			await this.rDel(codeKey)
			throw new BadRequestException(this.msg('auth.errors.otp.expired', 'OTP code has expired', { lng }))
		}

		// Проверяем количество попыток
		const attemptsKey = OTP_REDIS_KEY_PREFIX.ATTEMPTS(userId)
		const attempts = (await this.rGetNumber(attemptsKey)) || 0

		if (attempts >= OTP_MAX_ATTEMPTS_PER_CODE) {
			await this.rDel(codeKey)
			await this.logAudit(userId, OTP_AUDIT_ACTIONS.MAX_ATTEMPTS, { attempts })
			throw new BadRequestException(
				this.msg('auth.errors.otp.max_attempts', 'Maximum verification attempts exceeded', { lng }),
			)
		}

		// Проверяем код с защитой от timing attacks
		const isValid = await HashUtil.verify(cached.code, code)

		// Инкрементируем попытки
		await this.rIncr(attemptsKey, OTP_CODE_TTL)

		if (!isValid) {
			await this.incrementFailedAttempts(userId, 'verify')
			await this.logAudit(userId, OTP_AUDIT_ACTIONS.FAILED, { attempts: attempts + 1 })
			throw new BadRequestException(this.msg('auth.errors.otp.invalid_code', 'Invalid OTP code', { lng }))
		}

		// Проверяем повторное использование
		const usedKey = OTP_REDIS_KEY_PREFIX.USED_CODE(userId, code)
		const isUsed = await this.rExists(usedKey)

		if (isUsed) {
			throw new BadRequestException(
				this.msg('auth.errors.otp.already_used', 'This code has already been used', { lng }),
			)
		}

		// Отмечаем как использованный
		await this.rSet(usedKey, '1', OTP_CODE_REUSE_WINDOW)

		// Очищаем данные
		await this.rDel(codeKey)
		await this.rDel(attemptsKey)
		await this.clearRateLimit(userId, 'verify')

		// Логируем успех
		await this.logAudit(userId, OTP_AUDIT_ACTIONS.VERIFIED)

		this.logger.log(`OTP verified for user ${userId}`)

		return true
	}

	/**
	 * Верификация backup кода
	 */
	async verifyBackupCode(user: User, backupCode: string, lng: Language): Promise<boolean> {
		if (!user.isOtpEnabled) {
			throw new BadRequestException(this.msg('auth.errors.otp.not_enabled', 'OTP is not enabled', { lng }))
		}

		const normalizedCode = backupCode.replace(/\s/g, '').toUpperCase()

		const backupCodes = await this.prisma.backupCode.findMany({
			where: {
				userId: user.id,
				type: EBackupCodeType.OTP,
				usedAt: null,
			},
		})

		for (const backup of backupCodes) {
			const isMatch = await HashUtil.verify(backup.code, normalizedCode)

			if (isMatch) {
				await this.prisma.$transaction(async tx => {
					await tx.backupCode.update({
						where: { id: backup.id },
						data: { usedAt: new Date() },
					})

					await tx.auditLog.create({
						data: {
							userId: user.id,
							action: OTP_AUDIT_ACTIONS.BACKUP_CODE_VERIFIED,
							metadata: createOtpAuditMetadata(),
						},
					})
				})

				this.logger.log(`Backup code used for user ${user.id}`)
				return true
			}
		}

		throw new BadRequestException(
			this.msg('auth.errors.otp.invalid_backup_code', 'Invalid or already used backup code', { lng }),
		)
	}

	/**
	 * Получение статуса backup кодов
	 */
	async getBackupCodesStatus(user: User, lng: Language): Promise<OtpBackupCodesStatusModel> {
		if (!user.isOtpEnabled) {
			throw new BadRequestException(this.msg('auth.errors.otp.not_enabled', 'OTP is not enabled', { lng }))
		}

		const allCodes = await this.prisma.backupCode.count({
			where: {
				userId: user.id,
				type: EBackupCodeType.OTP,
			},
		})

		const usedCodes = await this.prisma.backupCode.count({
			where: {
				userId: user.id,
				type: EBackupCodeType.OTP,
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
	async regenerateBackupCodes(user: User, password: string, lng: Language): Promise<OtpEnabledModel> {
		if (!user.isOtpEnabled) {
			throw new BadRequestException(this.msg('auth.errors.otp.not_enabled', 'OTP is not enabled', { lng }))
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
					type: EBackupCodeType.OTP,
				},
			})

			await tx.backupCode.createMany({
				data: hashedBackupCodes.map(hash => ({
					userId: user.id,
					type: EBackupCodeType.OTP,
					code: hash,
				})),
			})

			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: OTP_AUDIT_ACTIONS.BACKUP_CODES_REGENERATED,
					metadata: createOtpAuditMetadata(),
				},
			})
		})

		this.logger.log(`Backup codes regenerated for user ${user.id}`)

		return {
			success: true,
			backupCodes,
			message: this.msg(
				'auth.errors.otp.backup_codes_warning',
				'Save these backup codes in a secure place. Each code can only be used once',
				{ lng },
			),
		}
	}

	// ==================== Приватные методы ====================

	/**
	 * Генерация 6-значного OTP кода
	 */
	private generateOtpCode(): string {
		return randomInt(0, 999999).toString().padStart(OTP_CODE_LENGTH, '0')
	}

	/**
	 * Генерация секрета (для дополнительной безопасности)
	 */
	private generateSecret(): string {
		return randomBytes(32).toString('hex')
	}

	/**
	 * Генерация backup кодов
	 */
	private generateBackupCodes(): string[] {
		return Array.from({ length: OTP_BACKUP_CODES_COUNT }, () =>
			randomBytes(OTP_BACKUP_CODE_BYTES).toString('hex').toUpperCase(),
		)
	}

	/**
	 * Проверка rate limit
	 */
	private async checkRateLimit(userId: string, action: string, lng: Language): Promise<void> {
		const key = OTP_REDIS_KEY_PREFIX.RATE_LIMIT(userId, action)
		const attempts = await this.rGetNumber(key)

		if (attempts !== null && attempts >= OTP_MAX_REQUESTS_PER_HOUR) {
			const ttl = await this.rTTL(key)
			const minutesLeft = Math.ceil(ttl / 60)

			throw new BadRequestException(
				this.msg(
					'auth.errors.otp.rate_limit_exceeded',
					`Too many attempts. Try again in ${minutesLeft} minutes`,
					{ lng, minutes: minutesLeft },
				),
			)
		}
	}

	/**
	 * Проверка cooldown
	 */
	private async checkCooldown(userId: string, lng: Language): Promise<void> {
		const key = OTP_REDIS_KEY_PREFIX.COOLDOWN(userId)
		const cooldown = await this.rExists(key)

		if (cooldown) {
			const ttl = await this.rTTL(key)
			throw new BadRequestException(
				this.msg('auth.errors.otp.cooldown', `Please wait ${ttl} seconds before requesting a new code`, {
					lng,
					seconds: ttl,
				}),
			)
		}
	}

	/**
	 * Инкремент неудачных попыток
	 */
	private async incrementFailedAttempts(userId: string, action: string): Promise<void> {
		const key = OTP_REDIS_KEY_PREFIX.RATE_LIMIT(userId, action)
		await this.rIncr(key, OTP_RATE_LIMIT_WINDOW)
	}

	/**
	 * Очистка rate limit
	 */
	private async clearRateLimit(userId: string, action: string): Promise<void> {
		const key = OTP_REDIS_KEY_PREFIX.RATE_LIMIT(userId, action)
		await this.rDel(key)
	}

	/**
	 * Очистка всех OTP данных пользователя
	 */
	private async clearOtpData(userId: string): Promise<void> {
		const keys = [
			OTP_REDIS_KEY_PREFIX.CODE(userId),
			OTP_REDIS_KEY_PREFIX.ATTEMPTS(userId),
			OTP_REDIS_KEY_PREFIX.COOLDOWN(userId),
		]

		await Promise.all(keys.map(key => this.rDel(key)))
	}

	/**
	 * Логирование в audit log
	 */
	private async logAudit(userId: string, action: string, metadata?: any): Promise<void> {
		await this.prisma.auditLog.create({
			data: {
				userId,
				action,
				metadata: createOtpAuditMetadata(
					metadata as Partial<Omit<OtpAuditMetadata, 'timestamp'>> & { timestamp?: string },
				),
			},
		})
	}
}
