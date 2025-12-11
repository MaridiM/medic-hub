# File: modules\security\rate-limit\types\rate-limit.types.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/security/rate-limit/types/rate-limit.types.ts`

## Category
Backend

## File Type
TS (rate-limit.types.ts)

## Size
896 characters, 42 lines

## Full Code

```typescript
/**
 * Rate limit options for configuring endpoint-specific limits
 */
export interface RateLimitOptions {
	/** Maximum number of requests allowed in the time window */
	points: number

	/** Time window duration in seconds */
	duration: number

	/** Custom error message when limit is exceeded */
	errorMessage?: string

	/** Custom key prefix for Redis storage */
	keyPrefix?: string
}

/**
 * Rate limit check result
 */
export interface RateLimitResponse {
	/** Whether the request is allowed */
	isAllowed: boolean

	/** Number of requests remaining in current window */
	remaining: number

	/** Milliseconds until next request is allowed */
	msBeforeNext: number

	/** Total points consumed in current window */
	consumed: number
}

/**
 * Rate limit key type (IP-based or User-based)
 */
export enum RateLimitKeyType {
	IP = 'ip',
	USER = 'user',
}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.589Z*
