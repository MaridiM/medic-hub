// src/modules/otp/constants/otp.constants.ts
import type { Prisma } from '@prisma/__generated__'

/**
 * Константы для OTP модуля
 */

// ===== OTP ПАРАМЕТРЫ =====

export const OTP_CODE_LENGTH = 6
export const OTP_CODE_EXPIRY = 300 // 5 минут
export const OTP_MAX_ATTEMPTS = 3

// ===== DELIVERY CHANNELS =====

export const OTP_CHANNELS = Object.freeze({
	EMAIL: 'email',
	SMS: 'sms',
}) as Readonly<{
	EMAIL: 'email'
	SMS: 'sms'
}>

export type OtpChannel = (typeof OTP_CHANNELS)[keyof typeof OTP_CHANNELS]

// ===== BACKUP КОДЫ =====

export const OTP_BACKUP_CODES_COUNT = 10
export const OTP_BACKUP_CODE_BYTES = 4

// ===== TTL (TIME TO LIVE) =====

export const OTP_CODE_TTL = 300 // 5 минут
export const OTP_COOLDOWN = 60 // 1 минута между отправками
export const OTP_RATE_LIMIT_WINDOW = 3600 // 1 час
export const OTP_CODE_REUSE_WINDOW = 90 // 90 секунд защита от повторного использования

// ===== RATE LIMITING =====

export const OTP_MAX_REQUESTS_PER_HOUR = 5
export const OTP_MAX_ATTEMPTS_PER_CODE = 3

export const OTP_RATE_LIMIT_ACTIONS = Object.freeze({
	ENABLE: 'enable',
	DISABLE: 'disable',
	SEND: 'send',
	VERIFY: 'verify',
	REGENERATE: 'regenerate',
}) as Readonly<{
	ENABLE: 'enable'
	DISABLE: 'disable'
	SEND: 'send'
	VERIFY: 'verify'
	REGENERATE: 'regenerate'
}>

export type OtpAction = (typeof OTP_RATE_LIMIT_ACTIONS)[keyof typeof OTP_RATE_LIMIT_ACTIONS]

// ===== REDIS KEYS =====

export const OTP_REDIS_KEY_PREFIX = Object.freeze({
	CODE: (userId: string): string => `otp:code:${userId}`,
	USED_CODE: (userId: string, code: string): string => `otp:used:${userId}:${code}`,
	ATTEMPTS: (userId: string): string => `otp:attempts:${userId}`,
	RATE_LIMIT: (userId: string, action: string): string => `otp:rate:${userId}:${action}`,
	COOLDOWN: (userId: string): string => `otp:cooldown:${userId}`,
}) as Readonly<{
	CODE: (userId: string) => string
	USED_CODE: (userId: string, code: string) => string
	ATTEMPTS: (userId: string) => string
	RATE_LIMIT: (userId: string, action: string) => string
	COOLDOWN: (userId: string) => string
}>

// ===== AUDIT LOG ACTIONS =====

export const OTP_AUDIT_ACTIONS = Object.freeze({
	ENABLED: 'OTP_ENABLED',
	DISABLED: 'OTP_DISABLED',
	SENT: 'OTP_SENT',
	VERIFIED: 'OTP_VERIFIED',
	FAILED: 'OTP_FAILED',
	MAX_ATTEMPTS: 'OTP_MAX_ATTEMPTS',
	BACKUP_CODE_VERIFIED: 'OTP_BACKUP_CODE_VERIFIED',
	BACKUP_CODES_REGENERATED: 'OTP_BACKUP_CODES_REGENERATED',
}) as Readonly<{
	ENABLED: 'OTP_ENABLED'
	DISABLED: 'OTP_DISABLED'
	SENT: 'OTP_SENT'
	VERIFIED: 'OTP_VERIFIED'
	FAILED: 'OTP_FAILED'
	MAX_ATTEMPTS: 'OTP_MAX_ATTEMPTS'
	BACKUP_CODE_VERIFIED: 'OTP_BACKUP_CODE_VERIFIED'
	BACKUP_CODES_REGENERATED: 'OTP_BACKUP_CODES_REGENERATED'
}>

export type OtpAuditAction = (typeof OTP_AUDIT_ACTIONS)[keyof typeof OTP_AUDIT_ACTIONS]

// ===== VALIDATION PATTERNS =====

export const OTP_VALIDATION_PATTERNS = Object.freeze({
	OTP_CODE: /^\d{6}$/,
	BACKUP_CODE: /^[A-F0-9]{8}$/,
	PHONE: /^\+[1-9]\d{1,14}$/, // E.164 format
}) as Readonly<{
	OTP_CODE: RegExp
	BACKUP_CODE: RegExp
	PHONE: RegExp
}>

// ===== EXPORTED TYPES =====

export interface OtpCodeCache {
	code: string
	channel: OtpChannel
	expiresAt: number
}

export type OtpAuditMetadata = Prisma.JsonObject & {
	channel?: OtpChannel
	timestamp: string
	ip?: string
	userAgent?: string
	attempts?: number
}

export const createOtpAuditMetadata = (
	data: Partial<Omit<OtpAuditMetadata, 'timestamp'>> & { timestamp?: string } = {},
): Prisma.InputJsonObject => {
	return {
		timestamp: new Date().toISOString(),
		...data,
	}
}
