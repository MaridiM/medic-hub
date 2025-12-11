# File: modules\notification\constants\notification.constants.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/notification/constants/notification.constants.ts`

## Category
Backend

## File Type
TS (notification.constants.ts)

## Size
2449 characters, 82 lines

## Full Code

```typescript
import { ENotificationChannel, ENotificationPriority } from '../types'

/**
 * Default notification settings
 */
export const NOTIFICATION_DEFAULTS = {
	/** Default channel if none specified */
	DEFAULT_CHANNEL: ENotificationChannel.EMAIL,

	/** Default priority */
	DEFAULT_PRIORITY: ENotificationPriority.NORMAL,

	/** Default language */
	DEFAULT_LANGUAGE: 'en' as const,

	/** Retry attempts for failed notifications */
	MAX_RETRY_ATTEMPTS: 3,

	/** Retry delay in milliseconds */
	RETRY_DELAY_MS: 5000,
} as const

/**
 * Priority-based channel preferences
 * Higher priority notifications use more channels
 */
export const PRIORITY_CHANNELS: Record<ENotificationPriority, ENotificationChannel[]> = {
	[ENotificationPriority.LOW]: [ENotificationChannel.EMAIL],
	[ENotificationPriority.NORMAL]: [ENotificationChannel.EMAIL],
	[ENotificationPriority.HIGH]: [ENotificationChannel.EMAIL, ENotificationChannel.SMS],
	[ENotificationPriority.CRITICAL]: [ENotificationChannel.EMAIL, ENotificationChannel.SMS],
}

/**
 * Security notification settings
 */
export const SECURITY_NOTIFICATION_CONFIG = {
	/** Enable/disable security notifications globally */
	ENABLED: process.env.SECURITY_NOTIFICATIONS_ENABLED !== 'false',

	/** Require email verification to send notifications */
	REQUIRE_VERIFIED_EMAIL: true,

	/** Require phone verification for SMS notifications */
	REQUIRE_VERIFIED_PHONE: true,

	/** Check email reputation before sending */
	CHECK_EMAIL_REPUTATION: true,

	/** Log all notification attempts */
	LOG_ALL_ATTEMPTS: true,
} as const

/**
 * Rate limiting for notifications
 */
export const NOTIFICATION_RATE_LIMITS = {
	/** Max notifications per user per hour */
	MAX_PER_HOUR: 10,

	/** Max notifications per user per day */
	MAX_PER_DAY: 50,

	/** Cooldown between duplicate notifications (seconds) */
	DUPLICATE_COOLDOWN: 300, // 5 minutes
} as const

/**
 * Redis keys for notification tracking
 */
export const NOTIFICATION_REDIS_KEYS = {
	/** Track sent notifications */
	SENT: (userId: string, type: string) => `notification:sent:${userId}:${type}`,

	/** Rate limiting */
	RATE_LIMIT_HOUR: (userId: string) => `notification:rate:hour:${userId}`,
	RATE_LIMIT_DAY: (userId: string) => `notification:rate:day:${userId}`,

	/** Duplicate detection */
	DUPLICATE: (userId: string, hash: string) => `notification:dup:${userId}:${hash}`,
} as const

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.489Z*
