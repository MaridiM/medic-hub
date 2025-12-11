# File: modules\security\account-lock\constants\account-lock.constants.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/security/account-lock/constants/account-lock.constants.ts`

## Category
Backend

## File Type
TS (account-lock.constants.ts)

## Size
1401 characters, 43 lines

## Full Code

```typescript
/**
 * Configuration for account lockout mechanism.
 */
export const ACCOUNT_LOCK_CONFIG = {
	/**
	 * Maximum number of failed login attempts before locking the account.
	 */
	MAX_FAILED_ATTEMPTS: parseInt(process.env.ACCOUNT_LOCK_MAX_ATTEMPTS || '5', 10),

	/**
	 * Duration of the account lock in seconds.
	 * Default: 900 seconds (15 minutes).
	 */
	LOCKOUT_DURATION_SECONDS: parseInt(process.env.ACCOUNT_LOCK_DURATION_SECONDS || '900', 10),

	/**
	 * TTL for the failed attempts counter in Redis (in seconds).
	 * Should be equal to or greater than the lockout duration.
	 */
	FAILED_ATTEMPTS_TTL_SECONDS: parseInt(process.env.ACCOUNT_LOCK_COUNTER_TTL_SECONDS || '900', 10),
} as const

/**
 * Configuration for progressive delays.
 * This introduces an artificial delay after a certain number of failed attempts
 * to slow down brute-force attacks before a full lockout.
 */
export const PROGRESSIVE_DELAYS = [
	{ attempts: 3, delayMs: 1000 }, // After 3 failures, wait 1 second
	{ attempts: 4, delayMs: 2000 }, // After 4 failures, wait 2 seconds
] as const

/**
 * Redis key prefixes for account lockout.
 */
export const ACCOUNT_LOCK_REDIS_KEYS = {
	/**
	 * Stores the count of failed login attempts for a user.
	 * e.g., 'account-lock:attempts:user-uuid'
	 */
	FAILED_LOGIN_ATTEMPTS: (userId: string) => `account-lock:attempts:${userId}`,
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.549Z*
