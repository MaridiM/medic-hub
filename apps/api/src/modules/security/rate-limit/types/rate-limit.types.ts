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
