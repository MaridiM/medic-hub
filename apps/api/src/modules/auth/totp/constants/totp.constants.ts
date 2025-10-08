import type { Prisma } from '@prisma/__generated__'

/**
 * Константы для TOTP модуля
 */

// ===== TOTP ПАРАМЕТРЫ =====

export const TOTP_WINDOW = 1
export const TOTP_ALGORITHM = 'SHA1' as const
export const TOTP_DIGITS = 6
export const TOTP_PERIOD = 30
export const TOTP_SECRET_LENGTH = 24

// ===== BACKUP КОДЫ =====

export const BACKUP_CODES_COUNT = 10
export const BACKUP_CODE_BYTES = 4

// ===== TTL (TIME TO LIVE) =====

export const TEMP_SECRET_TTL = 600
export const CODE_REUSE_WINDOW = 90
export const RATE_LIMIT_WINDOW = 300

// ===== RATE LIMITING =====

export const MAX_ATTEMPTS = 5

export const RATE_LIMIT_ACTIONS = Object.freeze({
	ENABLE: 'enable',
	DISABLE: 'disable',
	VERIFY: 'verify',
	REGENERATE: 'regenerate',
	GENERATE: 'generate',
}) as Readonly<{
	ENABLE: 'enable'
	DISABLE: 'disable'
	VERIFY: 'verify'
	REGENERATE: 'regenerate'
	GENERATE: 'generate'
}>

export type TotpAction = (typeof RATE_LIMIT_ACTIONS)[keyof typeof RATE_LIMIT_ACTIONS]

// ===== REDIS KEYS =====

export const REDIS_KEY_PREFIX = Object.freeze({
	TEMP_SECRET: (userId: string): string => `totp:temp:${userId}`,
	USED_CODE: (userId: string, code: string): string => `totp:used:${userId}:${code}`,
	RATE_LIMIT: (userId: string, action: string): string => `totp:rate:${userId}:${action}`,
}) as Readonly<{
	TEMP_SECRET: (userId: string) => string
	USED_CODE: (userId: string, code: string) => string
	RATE_LIMIT: (userId: string, action: string) => string
}>

// ===== AUDIT LOG ACTIONS =====

export const TOTP_AUDIT_ACTIONS = Object.freeze({
	ENABLED: 'TOTP_ENABLED',
	DISABLED: 'TOTP_DISABLED',
	VERIFIED: 'TOTP_VERIFIED',
	BACKUP_CODE_VERIFIED: 'TOTP_BACKUP_CODE_VERIFIED',
	BACKUP_CODES_REGENERATED: 'TOTP_BACKUP_CODES_REGENERATED',
}) as Readonly<{
	ENABLED: 'TOTP_ENABLED'
	DISABLED: 'TOTP_DISABLED'
	VERIFIED: 'TOTP_VERIFIED'
	BACKUP_CODE_VERIFIED: 'TOTP_BACKUP_CODE_VERIFIED'
	BACKUP_CODES_REGENERATED: 'TOTP_BACKUP_CODES_REGENERATED'
}>

export type TotpAuditAction = (typeof TOTP_AUDIT_ACTIONS)[keyof typeof TOTP_AUDIT_ACTIONS]

// ===== QR CODE НАСТРОЙКИ =====

/**
 * Настройки генерации QR кода
 */
export const QR_CODE_OPTIONS = Object.freeze({
	errorCorrectionLevel: 'H' as const,
	margin: 1,
	width: 300,
	type: 'image/png' as const,
	color: {
		dark: '#000000',
		light: '#FFFFFF',
	},
}) as Readonly<{
	errorCorrectionLevel: 'H'
	margin: number
	width: number
	type: 'image/png'
	color: {
		dark: string
		light: string
	}
}>

// ===== VALIDATION PATTERNS =====

export const VALIDATION_PATTERNS = Object.freeze({
	TOTP_CODE: /^\d{6}$/,
	BACKUP_CODE: /^[A-F0-9]{8}$/,
	TOTP_SECRET: /^[A-Z2-7]{16,}$/,
	TOTP_OR_BACKUP: /^(\d{6}|[A-F0-9]{8})$/,
}) as Readonly<{
	TOTP_CODE: RegExp
	BACKUP_CODE: RegExp
	TOTP_SECRET: RegExp
	TOTP_OR_BACKUP: RegExp
}>

// ===== EXPORTED TYPES =====

export interface TempSecretCache {
	secret: string
}

export type TotpAuditMetadata = Prisma.JsonObject & {
	email?: string
	timestamp: string
	ip?: string
	userAgent?: string
}

export const createAuditMetadata = (
	data: Partial<Omit<TotpAuditMetadata, 'timestamp'>> & { timestamp?: string } = {},
): Prisma.InputJsonObject => {
	return {
		timestamp: new Date().toISOString(),
		...data,
	}
}
