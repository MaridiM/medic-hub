import { ERiskLevel } from '../types'

/**
 * Risk assessment and scoring constants
 */

// ===== RISK THRESHOLDS =====

export const RISK_THRESHOLDS = {
	[ERiskLevel.VERY_LOW]: { min: 0, max: 20 },
	[ERiskLevel.LOW]: { min: 21, max: 40 },
	[ERiskLevel.MEDIUM]: { min: 41, max: 60 },
	[ERiskLevel.HIGH]: { min: 61, max: 80 },
	[ERiskLevel.CRITICAL]: { min: 81, max: 100 },
} as const

// ===== RISK FACTOR WEIGHTS =====

export const RISK_WEIGHTS = {
	// Location factors
	NEW_COUNTRY: 20,
	NEW_CITY: 15,
	IMPOSSIBLE_TRAVEL: 40, // Too fast travel between locations
	HIGH_RISK_COUNTRY: 25,
	VPN_DETECTED: 10,

	// Device factors
	NEW_DEVICE: 15,
	UNTRUSTED_DEVICE: 20,
	DEVICE_ANOMALY: 25,

	// Behavioral factors
	UNUSUAL_TIME: 10,
	UNUSUAL_DAY: 5,
	RAPID_REQUESTS: 30,
	MULTIPLE_FAILED_ATTEMPTS: 35,

	// Account factors
	NEW_ACCOUNT: 10, // < 7 days old
	YOUNG_ACCOUNT: 5, // < 30 days old
	DORMANT_ACCOUNT: 15, // No activity > 90 days

	// Pattern factors
	DEVIATION_FROM_PATTERN: 20,
	SUSPICIOUS_USER_AGENT: 15,
	BOT_DETECTED: 50,

	// Authentication factors
	PASSWORD_CHANGE: 10,
	MULTIPLE_SESSIONS_INVALIDATED: 15,
} as const

// ===== VELOCITY CHECKS =====

export const VELOCITY_CONFIG = {
	/** Maximum distance in km to travel in 1 hour (by plane) */
	MAX_TRAVEL_SPEED_KMH: 900,

	/** Time window for velocity check (seconds) */
	VELOCITY_WINDOW: 3600, // 1 hour

	/** Max login attempts per minute */
	MAX_ATTEMPTS_PER_MINUTE: 5,

	/** Max sessions per hour */
	MAX_SESSIONS_PER_HOUR: 10,
} as const

// ===== HIGH-RISK INDICATORS =====

export const HIGH_RISK_INDICATORS = {
	/** Countries with higher fraud rates (ISO codes) */
	HIGH_RISK_COUNTRIES: ['RU', 'CN', 'NG', 'VN', 'IN'],

	/** Suspicious user agent patterns */
	SUSPICIOUS_UA_PATTERNS: [/bot/i, /crawler/i, /spider/i, /scraper/i, /curl/i, /wget/i],

	/** Known VPN/proxy ASNs */
	VPN_ASNS: [
		// Common VPN providers
		'AS14061', // DigitalOcean
		'AS16509', // Amazon (often used for proxies)
		// Add more as needed
	],
} as const

// ===== ACTIONS BY RISK LEVEL =====

export const RISK_ACTIONS = {
	[ERiskLevel.VERY_LOW]: {
		require2FA: false,
		blockAccess: false,
		logEvent: false,
		notifyUser: false,
	},
	[ERiskLevel.LOW]: {
		require2FA: false,
		blockAccess: false,
		logEvent: true,
		notifyUser: false,
	},
	[ERiskLevel.MEDIUM]: {
		require2FA: true,
		blockAccess: false,
		logEvent: true,
		notifyUser: false,
	},
	[ERiskLevel.HIGH]: {
		require2FA: true,
		blockAccess: false,
		logEvent: true,
		notifyUser: true,
	},
	[ERiskLevel.CRITICAL]: {
		require2FA: true,
		blockAccess: true,
		logEvent: true,
		notifyUser: true,
	},
} as const

// ===== CACHE SETTINGS =====

export const RISK_CACHE = {
	/** Risk score TTL (seconds) */
	SCORE_TTL: 300, // 5 minutes

	/** Risk factors TTL (seconds) */
	FACTORS_TTL: 600, // 10 minutes

	/** Location history TTL (seconds) */
	LOCATION_HISTORY_TTL: 86400, // 24 hours
} as const
