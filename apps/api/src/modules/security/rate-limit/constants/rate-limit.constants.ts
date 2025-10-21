/**
 * Metadata keys for rate limit decorators
 */
export const RATE_LIMIT_KEY = 'rate_limit_options'
export const SKIP_RATE_LIMIT_KEY = 'skip_rate_limit'

/**
 * Redis key prefixes for rate limiting
 */
export const RATE_LIMIT_PREFIX = {
	IP: 'rate-limit:ip:',
	USER: 'rate-limit:user:',
	GLOBAL: 'rate-limit:global:',
} as const

/**
 * Default rate limit configuration
 * Applied globally unless overridden by @RateLimit decorator
 */
export const DEFAULT_RATE_LIMIT = {
	/** Default: 60 requests per minute */
	POINTS: parseInt(process.env.RATE_LIMIT_POINTS || '60', 10),
	/** Default: 60 seconds window */
	DURATION: parseInt(process.env.RATE_LIMIT_DURATION || '60', 10),
	/** Default error message */
	ERROR_MESSAGE: 'Too many requests. Please try again later.',
} as const

/**
 * Whitelist/Blacklist configuration
 */
export const RATE_LIMIT_LISTS = {
	/** IPs that bypass rate limiting */
	WHITELIST_KEY: 'rate-limit:whitelist',
	/** IPs that are permanently blocked */
	BLACKLIST_KEY: 'rate-limit:blacklist',
} as const
