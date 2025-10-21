# Full App Code (excluding imports, tests, i18n, extra core) - Part 1 of 6

`src/core/core.module.ts`


```typescript
@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true,
			validate: config => config,
		}),
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			imports: [ConfigModule],
			useFactory: getGraphQLConfig,
			inject: [ConfigService],
		}),
		ScheduleModule.forRoot(),

		// Core
		I18nModule,
		RedisModule,
		PrismaModule,

		// Libs
		SmsModule,
		MailModule,

		// Modules
		// Auth
		AccountModule,
		RecoveryModule,
		SessionModule,
		TwoFactorModule,
		VerificationModule,

		// Notification
		NotificationModule,

		// Security Event
		SecurityEventModule,

		// RBAC
		RbacModule,
	],
	providers: [
		I18nValidationPipe, // регистрируем сам пайп
		{ provide: APP_PIPE, useExisting: I18nValidationPipe },
	],
})
export class CoreModule {}

```



`src/core/core.service.ts`


```typescript
/**
 * Base application service with shared dependencies and helpers.
 * Extend this class in your feature services to get typed access
 * to Prisma, Redis, Config and i18n utilities.
 */
@Injectable()
export abstract class CoreService {
	constructor(
		protected readonly i18n?: I18nService,
		protected readonly prisma?: PrismaService,
		protected readonly redis?: RedisService,
		protected readonly config?: ConfigService,
	) {}

	/**
	 * Safe translate with fallback: returns translated string if available,
	 * otherwise returns provided fallback or the original key.
	 *
	 * @param key - i18n key (dot path notation)
	 * @param fallback - fallback message when translation is missing
	 * @param opts - additional i18next options
	 * @returns translated string or fallback
	 *  @example
	 * ```typescript
	 * // With autocomplit
	 * this.msg('totp.invalid_code')
	 *
	 * // With fallback
	 * this.msg('totp.invalid_code', 'Invalid code')
	 *
	 * // With language
	 * this.msg('totp.invalid_code', {lng: 'en'})
	 *
	 * // With params
	 * this.msg('totp.rate_limit_exceeded', undefined, {
	 *   args: { minutes: 5 }
	 * })
	 * ```
	 */
	protected msg<K extends LeafKeys<Res>>(key: K, fallback?: string, opts?: StrOptions): string
	protected msg(key: string, fallback?: string, opts?: StrOptions): string
	protected msg(key: string, fallback?: string, opts?: StrOptions): string {
		if (!this.i18n?.t) {
			return fallback ?? key
		}

		try {
			const val = this.i18n.t(key as LeafKeys<Res>, { ...opts })
			return typeof val === 'string' ? val : (fallback ?? key)
		} catch {
			return fallback ?? key
		}
	}

	/** Convenience getter for ConfigService. */
	protected get cfg() {
		return this.config
	}

	/** Convenience getter for a raw Redis client (if your RedisService exposes it). */
	protected get redisClient() {
		return this.redis?.getClient?.()
	}

	/**
	 * Build a namespaced Redis key.
	 * @param prefix namespace/prefix
	 * @param id tail identifier
	 */
	protected rKey(prefix: string, id: string): string {
		return `${prefix}${id}`
	}

	/**
	 * Read a JSON value from Redis and parse it.
	 * @template T parsed type
	 * @param key redis key
	 * @returns parsed JSON or null
	 */
	protected rGetJSON<T>(key: string) {
		return this.redis?.getJSON<T>(key)
	}

	/**
	 * Stringify and write a JSON value to Redis (optionally with TTL).
	 * @template T value type (must be an object)
	 * @param key redis key
	 * @param value object to store
	 * @param ttlSec optional TTL in seconds
	 */
	protected rSetJSON<T extends object>(key: string, value: T, ttlSec?: number) {
		return this.redis?.setJSON<T>(key, value, ttlSec)
	}

	// ===== ДОПОЛНИТЕЛЬНЫЕ ХЕЛПЕРЫ ДЛЯ TOTP =====

	/**
	 * Get string value from Redis
	 */
	protected async rGet(key: string): Promise<string | null> {
		return this.redis?.get(key) ?? null
	}

	/**
	 * Set string value in Redis
	 */
	protected async rSet(key: string, value: string, ttlSec?: number): Promise<void> {
		await this.redis?.set(key, value, ttlSec)
	}

	/**
	 * Delete key from Redis
	 */
	protected async rDel(key: string): Promise<number> {
		return (await this.redis?.del(key)) ?? 0
	}

	/**
	 * Check if key exists in Redis
	 */
	protected async rExists(key: string): Promise<boolean> {
		return (await this.redis?.exists(key)) ?? false
	}

	/**
	 * Get TTL of a key in seconds
	 */
	protected async rTTL(key: string): Promise<number> {
		return (await this.redis?.ttl(key)) ?? -2
	}

	/**
	 * Increment value in Redis with optional TTL
	 */
	protected async rIncr(key: string, ttlSec?: number): Promise<number> {
		if (ttlSec) {
			return (await this.redis?.incrWithExpire(key, ttlSec)) ?? 0
		}
		return (await this.redis?.incr(key)) ?? 0
	}

	/**
	 * Get numeric value from Redis
	 */
	protected async rGetNumber(key: string): Promise<number | null> {
		const value = await this.rGet(key)
		if (value === null) return null
		const num = parseInt(value, 10)
		return isNaN(num) ? null : num
	}

	/**
	 * Set numeric value in Redis
	 */
	protected async rSetNumber(key: string, value: number, ttlSec?: number): Promise<void> {
		await this.rSet(key, value.toString(), ttlSec)
	}

	/**
	 * Set TTL for existing key in Redis
	 * @param key Redis key
	 * @param ttlSec TTL in seconds
	 * @returns true if TTL was set, false otherwise
	 */
	protected async rExpire(key: string, ttlSec: number): Promise<boolean> {
		return (await this.redis?.expire(key, ttlSec)) ?? false
	}
}

```



`src/main.ts`


```typescript
const myEnv = dotenv.config({ path: 'backend/.env' })
dotenvExpand.expand(myEnv)

async function bootstrap() {
	await initI18n()

	const app = await NestFactory.create(CoreModule, { rawBody: true })

	const config = app.get(ConfigService)
	const redis = app.get(RedisService)

	// ✅ i18n middleware (добавляет req.i18n, req.language)
	app.use(i18nextMiddleware.handle(i18n))

	// ✅ JSON + выставляем язык, если вдруг отсутствует
	app.use(json({ limit: '1mb', type: 'application/json' }))
	app.use((req: Request, res: Response, next: NextFunction) => {
		req.language =
			req.language ||
			req.i18n?.language ||
			String(req.headers['accept-language'] || '').split(',')[0] ||
			DEFAULT_LANGUAGE
		next()
	})

	// ✅ Cookie / file upload / global pipes
	app.use(cookieParser(config.get<string>('COOKIES_SECRET')))
	app.use(config.get<string>('GRAPHQL_PREFIX') || '/graphql', graphqlUploadExpress())
	app.useGlobalPipes(new ValidationPipe({ transform: true }))

	// ✅ Сессии через Redis
	app.use(sessionConfig(config, redis))

	// ✅ CORS
	const clientUrl = config.get<string>('CLIENT_URL') || 'http://localhost:3000'
	app.enableCors({
		origin: [clientUrl, 'http://localhost:3000'],
		credentials: true,
		exposedHeaders: ['set-cookie'],
	})

	// ✅ Старт
	const port = Number(config.get<string>('SERVER_PORT')) || 8000
	await app.listen(port)
}

bootstrap().catch(err => {
	// Можно заменить на ваш логгер
	console.error('Nest bootstrap failed:', err)
	process.exit(1)
})

```



`src/modules/auth/2fa/2fa.module.ts`


```typescript
/**
 * Two-Factor Authentication Module
 *
 * Provides enterprise-grade 2FA functionality:
 * - Multiple 2FA methods (TOTP, OTP Email/SMS, WebAuthn, Passkeys)
 * - Backup codes management
 * - Device trust scoring
 * - Security event logging
 * - Risk-based authentication
 * - Administrative management (NEW)
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [TwoFactorModule],
 * })
 * export class AppModule {}
 * ```
 */
@Module({
	imports: [ScheduleModule.forRoot()],
	providers: [
		// GraphQL Resolvers
		TwoFactorResolver,
		AdminTwoFactorResolver,

		// Core Services
		TwoFactorMethodService,
		BackupCodeService,
		DeviceTrustService,
		SecurityEventService,
		AdminTwoFactorService,
		TwoFactorCronService,
		WebAuthnService,

		// Guards
		TwoFactorVerifiedGuard,

		// Notifications
		NotificationService,
	],
})
export class TwoFactorModule {}

```



`src/modules/auth/2fa/constants/2fa.constants.ts`


```typescript
/**
 * Core 2FA configuration constants
 */

// ===== GENERAL 2FA SETTINGS =====

export const TWO_FA_CONFIG = {
	/** Maximum number of 2FA methods per user */
	MAX_METHODS_PER_USER: 5,

	/** Maximum number of active sessions requiring 2FA */
	MAX_ACTIVE_SESSIONS: 10,

	/** Allow backup codes as fallback */
	ALLOW_BACKUP_CODES: true,

	/** Force 2FA for admin users */
	FORCE_ADMIN_2FA: true,

	/** Session lifetime after 2FA verification (seconds) */
	SESSION_LIFETIME_AFTER_2FA: 86400, // 24 hours

	/** Remember device duration (seconds) */
	REMEMBER_DEVICE_DURATION: 2592000, // 30 days
} as const

// ===== TOTP SETTINGS =====

export const TOTP_CONFIG = {
	/** Allowed time window drift (±N periods) */
	WINDOW: 1,

	/** Default algorithm */
	ALGORITHM: 'SHA1' as const,

	/** Code length */
	DIGITS: 6,

	/** Time step in seconds */
	PERIOD: 30,

	/** Secret length in bytes */
	SECRET_LENGTH: 20,

	/** QR code size */
	QR_CODE_SIZE: 300,

	/** QR code error correction */
	QR_ERROR_CORRECTION: 'H' as const,
} as const

/**
 * QR Code Settings
 */
export const QR_CODE_OPTIONS = {
	errorCorrectionLevel: 'H' as const,
	margin: 1,
	width: 300,
	type: 'image/png' as const,
	color: {
		dark: '#000000',
		light: '#FFFFFF',
	},
} as const

// ===== OTP SETTINGS =====

export const OTP_CONFIG = {
	/** Code length */
	CODE_LENGTH: 6,

	/** Code expiry (seconds) */
	CODE_EXPIRY: 300, // 5 minutes

	/** Max verification attempts per code */
	MAX_ATTEMPTS: 3,

	/** Cooldown between sends (seconds) */
	SEND_COOLDOWN: 60, // 1 minute

	/** Max sends per hour */
	MAX_SENDS_PER_HOUR: 5,

	/** Code reuse prevention window (seconds) */
	REUSE_PREVENTION_WINDOW: 90,
} as const

// ===== BACKUP CODES =====

export const BACKUP_CODE_CONFIG = {
	/** Number of codes to generate */
	COUNT: 10,

	/** Code length in bytes */
	BYTES: 4,

	/** Code format */
	FORMAT: 'HEX' as const,

	/** Expiration (null = never expire) */
	EXPIRY_DAYS: null as number | null,

	/** Minimum remaining codes before warning */
	LOW_CODES_THRESHOLD: 3,
} as const

// ===== RATE LIMITING =====

export const RATE_LIMIT_CONFIG = {
	/** Window duration (seconds) */
	WINDOW: 300, // 5 minutes

	/** Max attempts per window */
	MAX_ATTEMPTS: 5,

	/** Account lock duration after max attempts (seconds) */
	LOCK_DURATION: 900, // 15 minutes

	/** Progressive lock multiplier */
	PROGRESSIVE_LOCK_MULTIPLIER: 2,
} as const

// ===== REDIS KEYS =====

export const REDIS_KEYS = {
	// 2FA codes
	OTP_CODE: (userId: string) => `2fa:otp:code:${userId}`,
	OTP_ATTEMPTS: (userId: string) => `2fa:otp:attempts:${userId}`,
	OTP_COOLDOWN: (userId: string) => `2fa:otp:cooldown:${userId}`,
	OTP_USED: (userId: string, code: string) => `2fa:otp:used:${userId}:${code}`,

	// TOTP
	TOTP_TEMP_SECRET: (userId: string) => `2fa:totp:temp:${userId}`,
	TOTP_USED: (userId: string, code: string) => `2fa:totp:used:${userId}:${code}`,

	// Rate limiting
	RATE_LIMIT: (userId: string, action: string) => `2fa:rate:${userId}:${action}`,

	// Device trust
	DEVICE_FINGERPRINT: (deviceId: string) => `2fa:device:fp:${deviceId}`,
	DEVICE_TRUST: (userId: string, deviceId: string) => `2fa:device:trust:${userId}:${deviceId}`,

	// Risk
	RISK_SCORE: (userId: string) => `2fa:risk:score:${userId}`,
	RISK_FACTORS: (userId: string) => `2fa:risk:factors:${userId}`,

	// WebAuthn
	WEBAUTHN_CHALLENGE: (challengeId: string) => `webauthn:challenge:${challengeId}`,
	WEBAUTHN_REGISTRATION: (userId: string) => `webauthn:registration:${userId}`,
	WEBAUTHN_AUTHENTICATION: (userId: string) => `webauthn:authentication:${userId}`,
} as const

// ===== AUDIT ACTIONS =====

export const AUDIT_ACTIONS = {
	// Method management
	METHOD_ADDED: '2FA_METHOD_ADDED',
	METHOD_REMOVED: '2FA_METHOD_REMOVED',
	METHOD_UPDATED: '2FA_METHOD_UPDATED',
	PRIMARY_METHOD_CHANGED: '2FA_PRIMARY_METHOD_CHANGED',

	// Verification
	VERIFICATION_SUCCESS: '2FA_VERIFICATION_SUCCESS',
	VERIFICATION_FAILED: '2FA_VERIFICATION_FAILED',
	BACKUP_CODE_USED: '2FA_BACKUP_CODE_USED',

	// Setup
	TOTP_SETUP_STARTED: '2FA_TOTP_SETUP_STARTED',
	TOTP_SETUP_COMPLETED: '2FA_TOTP_SETUP_COMPLETED',
	OTP_SETUP_COMPLETED: '2FA_OTP_SETUP_COMPLETED',

	// WebAuthn
	WEBAUTHN_REGISTERED: '2FA_WEBAUTHN_REGISTERED',
	WEBAUTHN_VERIFIED: '2FA_WEBAUTHN_VERIFIED',
	PASSKEY_CREATED: '2FA_PASSKEY_CREATED',
	PASSKEY_USED: '2FA_PASSKEY_USED',

	// Backup codes
	BACKUP_CODES_GENERATED: '2FA_BACKUP_CODES_GENERATED',
	BACKUP_CODES_REGENERATED: '2FA_BACKUP_CODES_REGENERATED',
	BACKUP_CODES_VIEWED: '2FA_BACKUP_CODES_VIEWED',

	// Device trust
	DEVICE_TRUSTED: '2FA_DEVICE_TRUSTED',
	DEVICE_UNTRUSTED: '2FA_DEVICE_UNTRUSTED',

	// System
	ENABLED: '2FA_ENABLED',
	DISABLED: '2FA_DISABLED',
	FORCED: '2FA_FORCED',
} as const

export type T2FAAuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS]

// ===== HELPER FUNCTIONS =====

/**
 * Create standardized audit metadata
 */
export const createAuditMetadata = (
	data: Partial<{ timestamp?: string }> & Record<string, unknown> = {},
): Prisma.InputJsonObject => {
	return {
		timestamp: new Date().toISOString(),
		...data,
	}
}

/**
 * Validation patterns
 */
export const VALIDATION_PATTERNS = {
	TOTP_CODE: /^\d{6}$/,
	OTP_CODE: /^\d{6}$/,
	BACKUP_CODE: /^[A-F0-9]{8}$/,
	PHONE_E164: /^\+[1-9]\d{7,14}$/,
	DEVICE_ID: /^[a-f0-9]{64}$/,
} as const

```



`src/modules/auth/2fa/constants/device.constants.ts`


```typescript
/**
 * Device trust and fingerprinting constants
 */

// ===== TRUST SCORING =====

export const DEVICE_TRUST = {
	/** Initial trust score for new devices */
	INITIAL_SCORE: 0,

	/** Minimum score to be considered trusted */
	TRUST_THRESHOLD: 75,

	/** Score increment per successful login */
	SUCCESS_INCREMENT: 5,

	/** Score decrement per failed attempt */
	FAILURE_DECREMENT: 10,

	/** Maximum trust score */
	MAX_SCORE: 100,

	/** Minimum trust score */
	MIN_SCORE: 0,

	/** Score decay per day of inactivity */
	DECAY_PER_DAY: 1,

	/** Days of inactivity before decay starts */
	DECAY_GRACE_PERIOD: 7,
} as const

// ===== DEVICE LIFETIME =====

export const DEVICE_LIFETIME = {
	/** Default device trust duration (seconds) */
	DEFAULT_DURATION: 2592000, // 30 days

	/** Maximum device trust duration (seconds) */
	MAX_DURATION: 7776000, // 90 days

	/** Minimum device trust duration (seconds) */
	MIN_DURATION: 86400, // 1 day

	/** Auto-revoke after inactivity (seconds) */
	AUTO_REVOKE_AFTER: 15552000, // 180 days
} as const

// ===== FINGERPRINTING =====

export const FINGERPRINT_CONFIG = {
	/** Fingerprint hash algorithm */
	ALGORITHM: 'sha256' as const,

	/** Minimum components required for valid fingerprint */
	MIN_COMPONENTS: 5,

	/** Fingerprint similarity threshold (0-1) */
	SIMILARITY_THRESHOLD: 0.8,

	/** Enable canvas fingerprinting */
	USE_CANVAS: true,

	/** Enable WebGL fingerprinting */
	USE_WEBGL: true,

	/** Enable audio fingerprinting */
	USE_AUDIO: false, // More invasive

	/** Enable font detection */
	USE_FONTS: true,
} as const

// ===== DEVICE LIMITS =====

export const DEVICE_LIMITS = {
	/** Maximum trusted devices per user */
	MAX_TRUSTED_DEVICES: 10,

	/** Maximum devices to keep in history */
	MAX_DEVICE_HISTORY: 50,

	/** Auto-cleanup devices older than (days) */
	CLEANUP_AFTER_DAYS: 365,
} as const

// ===== REDIS KEYS =====

export const DEVICE_REDIS_KEYS = {
	FINGERPRINT: (deviceId: string) => `device:fp:${deviceId}`,
	TRUST_SCORE: (userId: string, deviceId: string) => `device:trust:${userId}:${deviceId}`,
	LAST_SEEN: (deviceId: string) => `device:seen:${deviceId}`,
	LOCATION: (deviceId: string) => `device:location:${deviceId}`,
} as const

```



`src/modules/auth/2fa/constants/index.ts`


```typescript
export * from './2fa.constants'
export * from './device.constants'
export * from './risk.constants'
export * from './webauthn.constants'

```



`src/modules/auth/2fa/constants/risk.constants.ts`


```typescript
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

```



`src/modules/auth/2fa/constants/webauthn.constants.ts`


```typescript
/**
 * WebAuthn and Passkey configuration constants
 * Following FIDO2 and WebAuthn Level 2 specifications
 */

// ===== RELYING PARTY (RP) CONFIGURATION =====

export const WEBAUTHN_RP = {
	/** Relying Party name (your app name) */
	NAME: process.env.APP_NAME || 'MyApp',

	/** Relying Party ID (your domain) */
	ID: process.env.WEBAUTHN_RP_ID || 'localhost',

	/** Origin (full URL) */
	ORIGIN: process.env.WEBAUTHN_ORIGIN || 'http://localhost:3000',
} as const

// ===== AUTHENTICATOR SELECTION =====

export const AUTHENTICATOR_SELECTION = {
	/** Authenticator attachment: 'platform', 'cross-platform', or undefined (both) */
	AUTHENTICATOR_ATTACHMENT: undefined as 'platform' | 'cross-platform' | undefined,

	/** Require resident key (for passwordless) */
	RESIDENT_KEY: 'preferred' as const,

	/** User verification */
	USER_VERIFICATION: 'preferred' as const,
} as const

// ===== ATTESTATION =====

export const ATTESTATION_CONFIG = {
	/** Attestation conveyance */
	CONVEYANCE: 'none' as const,

	/** Verify attestation (requires attestation metadata) */
	VERIFY_ATTESTATION: false,

	/** Allowed attestation formats */
	ALLOWED_FORMATS: ['packed', 'fido-u2f', 'android-safetynet', 'apple', 'none'] as const,
} as const

// ===== CREDENTIAL PARAMETERS =====

export const CREDENTIAL_PARAMS = {
	/** Supported algorithms (ES256, RS256) */
	PUB_KEY_CRED_PARAMS: [
		{ type: 'public-key' as const, alg: -7 }, // ES256 (recommended)
		{ type: 'public-key' as const, alg: -257 }, // RS256
	],

	/** Challenge length (bytes) */
	CHALLENGE_LENGTH: 32,

	/** Timeout for user interaction (milliseconds) */
	TIMEOUT: 60000, // 60 seconds
} as const

// ===== VALIDATION =====

export const VALIDATION_CONFIG = {
	/** Maximum allowed counter resets */
	MAX_COUNTER_RESETS: 0,

	/** Verify user presence (UP flag) */
	REQUIRE_USER_PRESENCE: true,

	/** Verify user verification (UV flag) */
	REQUIRE_USER_VERIFICATION: false,

	/** Check backup eligibility flag */
	CHECK_BACKUP_ELIGIBILITY: true,
} as const

// ===== STORAGE =====

export const WEBAUTHN_STORAGE = {
	/** Challenge TTL in Redis (seconds) */
	CHALLENGE_TTL: 300, // 5 minutes

	/** Credential TTL (null = forever) */
	CREDENTIAL_TTL: null as number | null,

	/** Maximum credentials per user */
	MAX_CREDENTIALS_PER_USER: 10,
} as const

// ===== COMBINED CONFIG EXPORT =====

export const WEBAUTHN_CONFIG = {
	AUTHENTICATOR_SELECTION,
	ATTESTATION_CONFIG,
	CREDENTIAL_PARAMS,
	VALIDATION_CONFIG,
} as const

```



`src/modules/auth/2fa/dtos/admin-2fa.dto.ts`


```typescript
/**
 * Input for disabling a user's 2FA
 */
@InputType('DisableUser2FAInput')
export class DisableUser2FAInput {
	@Field(() => String, { description: 'User ID whose 2FA should be disabled' })
	@IsUUID()
	@IsNotEmpty()
	userId: string

	@Field(() => String, { description: 'Reason for disabling 2FA' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(500)
	reason: string

	@Field(() => Boolean, {
		nullable: true,
		defaultValue: true,
		description: 'Whether to notify the user via email',
	})
	@IsOptional()
	@IsBoolean()
	notifyUser?: boolean
}

/**
 * Input for revoking a user's device
 */
@InputType('RevokeUserDeviceInput')
export class RevokeUserDeviceInput {
	@Field(() => String, { description: 'User ID' })
	@IsUUID()
	@IsNotEmpty()
	userId: string

	@Field(() => String, { description: 'Device ID to revoke' })
	@IsString()
	@IsNotEmpty()
	deviceId: string

	@Field(() => String, { description: 'Reason for revoking device' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(500)
	reason: string
}

/**
 * Input for revoking all user devices
 */
@InputType('RevokeAllUserDevicesInput')
export class RevokeAllUserDevicesInput {
	@Field(() => String, { description: 'User ID' })
	@IsUUID()
	@IsNotEmpty()
	userId: string

	@Field(() => String, { description: 'Reason for revoking all devices' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(500)
	reason: string
}

/**
 * Input for getting user security events
 */
@InputType('GetUserSecurityEventsInput')
export class GetUserSecurityEventsInput {
	@Field(() => String, { description: 'User ID' })
	@IsUUID()
	@IsNotEmpty()
	userId: string

	@Field(() => Int, { nullable: true, defaultValue: 50, description: 'Number of events to return' })
	@IsOptional()
	limit?: number

	@Field(() => [String], {
		nullable: true,
		description: 'Filter by event types',
	})
	@IsOptional()
	@IsEnum(ESecurityEvent, { each: true })
	events?: ESecurityEvent[]

	@Field(() => [String], {
		nullable: true,
		description: 'Filter by severity levels',
	})
	@IsOptional()
	@IsEnum(ESecuritySeverity, { each: true })
	severities?: ESecuritySeverity[]
}

```



`src/modules/auth/2fa/dtos/index.ts`


```typescript
export * from './admin-2fa.dto'
export * from './setup-totp.dto'
export * from './setup-otp.dto'
export * from './verify-2fa.dto'
export * from './manage-methods.dto'
export * from './webauthn.dto'

```



`src/modules/auth/2fa/dtos/manage-methods.dto.ts`


```typescript
/**
 * Input for updating 2FA method
 */
@InputType('Update2FAMethodInput')
export class Update2FAMethodInput {
	@Field(() => String, { description: 'Method ID to update' })
	@IsString()
	@IsNotEmpty()
	methodId: string

	@Field(() => String, { nullable: true, description: 'New name for the method' })
	@IsOptional()
	@IsString()
	name?: string

	@Field(() => Boolean, { nullable: true, description: 'Set as primary method' })
	@IsOptional()
	@IsBoolean()
	isPrimary?: boolean

	@Field(() => Boolean, { nullable: true, description: 'Activate/deactivate method' })
	@IsOptional()
	@IsBoolean()
	isActive?: boolean
}

/**
 * Input for removing 2FA method
 */
@InputType('Remove2FAMethodInput')
export class Remove2FAMethodInput {
	@Field(() => String, { description: 'Method ID to remove' })
	@IsString()
	@IsNotEmpty()
	methodId: string

	@Field(() => String, { description: 'Password for confirmation' })
	@IsString()
	@IsNotEmpty()
	password: string

	@Field(() => String, { nullable: true, description: '2FA code for additional security' })
	@IsOptional()
	@IsString()
	code?: string
}

/**
 * Input for regenerating backup codes
 */
@InputType('RegenerateBackupCodesInput')
export class RegenerateBackupCodesInput {
	@Field(() => String, { nullable: true, description: 'Specific method ID (regenerates for all if not specified)' })
	@IsOptional()
	@IsString()
	methodId?: string

	@Field(() => String, { description: 'Password for confirmation' })
	@IsString()
	@IsNotEmpty()
	password: string
}

```



`src/modules/auth/2fa/dtos/setup-otp.dto.ts`


```typescript
registerEnumType(E2FAMethod, {
	name: 'E2FAMethod', // имя enum в схеме GraphQL
	description: 'Allowed OTP methods for setup (email or SMS).',
	valuesMap: {
		TOTP: { deprecationReason: 'Not allowed in SetupOtpInput' },
		WEBAUTHN: { deprecationReason: 'Not allowed in SetupOtpInput' },
		PASSKEY: { deprecationReason: 'Not allowed in SetupOtpInput' },
		BACKUP_CODE: { deprecationReason: 'Not allowed in SetupOtpInput' },
	},
})

/**
 * Input for setting up OTP (Email or SMS)
 */
@InputType('SetupOtpInput')
export class SetupOtpInput {
	@Field(() => E2FAMethod, {
		description: 'OTP method: OTP_EMAIL or OTP_SMS',
		defaultValue: E2FAMethod.OTP_EMAIL,
	})
	@IsOptional()
	@IsEnum(E2FAMethod)
	@IsIn([E2FAMethod.OTP_EMAIL, E2FAMethod.OTP_SMS], {
		message: 'method must be OTP_EMAIL or OTP_SMS',
	})
	method!: E2FAMethod

	@Field({ nullable: true, description: 'Email destination (required for OTP_EMAIL)' })
	@IsOptional()
	@ValidateIf(o => o.method === E2FAMethod.OTP_EMAIL)
	@IsEmail()
	email?: string

	@Field({ nullable: true, description: 'Phone in E.164, required for OTP_SMS' })
	@IsOptional()
	@ValidateIf(o => o.method === E2FAMethod.OTP_SMS)
	@Matches(VALIDATION_PATTERNS.PHONE_E164, {
		message: 'phone must be a valid E.164 number (e.g. +1234567890)',
	})
	phone?: string

	@Field({ nullable: true, description: 'Optional display name for the method' })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	name?: string
}

/**
 * Input for sending OTP code
 */
@InputType('SendOtpCodeInput')
export class SendOtpCodeInput {
	@Field(() => String, { nullable: true, description: 'Method ID to send code to (uses primary if not specified)' })
	@IsOptional()
	@IsString()
	methodId?: string
}

/**
 * Input for verifying OTP code during setup
 */
@InputType('VerifyOtpSetupInput')
export class VerifyOtpSetupInput {
	@Field(() => String, { description: 'Method ID from setup' })
	@IsString()
	@IsNotEmpty()
	methodId: string

	@Field(() => String, { description: '6-digit OTP code' })
	@IsString()
	@IsNotEmpty()
	@Matches(VALIDATION_PATTERNS.OTP_CODE, { message: 'Code must be exactly 6 digits' })
	code: string
}

```



`src/modules/auth/2fa/dtos/setup-totp.dto.ts`


```typescript
/**
 * Input for generating TOTP setup (QR code)
 */
@InputType('GenerateTotpSetupInput')
export class GenerateTotpSetupInput {
	@Field(() => String, { nullable: true, description: 'Optional custom name for this method' })
	@IsOptional()
	@IsString()
	name?: string
}

/**
 * Input for completing TOTP setup
 */
@InputType('CompleteTotpSetupInput')
export class CompleteTotpSetupInput {
	@Field(() => String, { description: 'TOTP secret from generation step' })
	@IsString()
	@IsNotEmpty()
	@Length(TOTP_CONFIG.SECRET_LENGTH, TOTP_CONFIG.SECRET_LENGTH, {
		message: `Secret must be exactly ${TOTP_CONFIG.SECRET_LENGTH} characters`,
	})
	secret: string

	@Field(() => String, { description: '6-digit TOTP code for verification' })
	@IsString()
	@IsNotEmpty()
	@Matches(VALIDATION_PATTERNS.TOTP_CODE, { message: 'Code must be exactly 6 digits' })
	code: string

	@Field(() => String, { nullable: true, description: 'Optional custom name' })
	@IsOptional()
	@IsString()
	name?: string
}

```



`src/modules/auth/2fa/dtos/verify-2fa.dto.ts`


```typescript
/**
 * Generic 2FA verification input
 * Supports TOTP codes, OTP codes, and backup codes
 */
@InputType('Verify2FAInput')
export class Verify2FAInput {
	@Field(() => String, { description: '6-digit code or 8-character backup code' })
	@IsString()
	@IsNotEmpty()
	code: string

	@Field(() => String, {
		nullable: true,
		description: 'Specific method ID to verify (uses primary if not specified)',
	})
	@IsOptional()
	@IsString()
	methodId?: string

	@Field(() => Boolean, { nullable: true, description: 'Remember this device for future logins' })
	@IsOptional()
	@IsBoolean()
	trustDevice?: boolean
}

/**
 * Backup code verification input
 */
@InputType('VerifyBackupCodeInput')
export class VerifyBackupCodeInput {
	@Field(() => String, { description: '8-character backup code' })
	@IsString()
	@IsNotEmpty()
	@Matches(VALIDATION_PATTERNS.BACKUP_CODE, { message: 'Invalid backup code format' })
	backupCode: string

	@Field(() => String, { nullable: true, description: 'Method ID this code is for' })
	@IsOptional()
	@IsString()
	methodId?: string
}

```



`src/modules/auth/2fa/dtos/webauthn.dto.ts`


```typescript
/**
 * Input for starting WebAuthn registration
 */
@InputType('StartWebAuthnRegistrationInput', {
	description: 'Input for initiating WebAuthn credential registration (passkey or security key)',
})
export class StartWebAuthnRegistrationInput {
	@Field(() => String, {
		nullable: true,
		description: 'Custom name for the authenticator (e.g., "YubiKey 5C", "iPhone 15 Pro")',
	})
	@IsOptional()
	@IsString()
	@MaxLength(100)
	authenticatorName?: string

	@Field(() => String, {
		nullable: true,
		description:
			'Authenticator attachment: "platform" (TouchID, FaceID, Windows Hello) or "cross-platform" (YubiKey, external USB key)',
		defaultValue: undefined,
	})
	@IsOptional()
	@IsString()
	authenticatorAttachment?: 'platform' | 'cross-platform'

	@Field(() => Boolean, {
		nullable: true,
		description: 'Prefer platform authenticators (built-in biometrics) over external keys',
		defaultValue: true,
	})
	@IsOptional()
	@IsBoolean()
	preferPlatform?: boolean
}

/**
 * Input for completing WebAuthn registration
 */
@InputType('CompleteWebAuthnRegistrationInput', {
	description: 'Input for completing WebAuthn registration with authenticator response',
})
export class CompleteWebAuthnRegistrationInput {
	@Field(() => String, {
		description: 'Challenge ID from registration options (used to verify this response)',
	})
	@IsString()
	@IsNotEmpty()
	challengeId: string

	@Field(() => GraphQLJSON, {
		description:
			'RegistrationResponseJSON from @simplewebauthn/browser startRegistration(). Contains id, rawId, response.attestationObject, response.clientDataJSON, type, and optional fields.',
	})
	@IsNotEmpty()
	response: RegistrationResponseJSON

	@Field(() => String, {
		nullable: true,
		description: 'Custom name for this authenticator (overrides name from StartWebAuthnRegistrationInput)',
	})
	@IsOptional()
	@IsString()
	@MaxLength(100)
	authenticatorName?: string
}

/**
 * Input for starting WebAuthn authentication
 */
@InputType('StartWebAuthnAuthenticationInput', {
	description: 'Input for initiating WebAuthn authentication challenge',
})
export class StartWebAuthnAuthenticationInput {
	@Field(() => String, {
		nullable: true,
		description:
			'Specific credential ID to use for authentication (if null, user picks from available credentials)',
	})
	@IsOptional()
	@IsString()
	credentialId?: string

	@Field(() => String, {
		nullable: true,
		description: 'User email for authentication (required if user is not already logged in)',
	})
	@IsOptional()
	@IsString()
	email?: string
}

/**
 * Input for completing WebAuthn authentication
 */
@InputType('CompleteWebAuthnAuthenticationInput', {
	description: 'Input for completing WebAuthn authentication with authenticator response',
})
export class CompleteWebAuthnAuthenticationInput {
	@Field(() => String, {
		description: 'Challenge ID from authentication options (used to verify this response)',
	})
	@IsString()
	@IsNotEmpty()
	challengeId: string

	@Field(() => GraphQLJSON, {
		description:
			'AuthenticationResponseJSON from @simplewebauthn/browser startAuthentication(). Contains id, rawId, response.authenticatorData, response.clientDataJSON, response.signature, response.userHandle, and type.',
	})
	@IsNotEmpty()
	response: AuthenticationResponseJSON
}

/**
 * Input for removing WebAuthn credential
 */
@InputType('RemoveWebAuthnCredentialInput', {
	description: 'Input for removing a registered WebAuthn credential (requires password confirmation)',
})
export class RemoveWebAuthnCredentialInput {
	@Field(() => String, {
		description: 'Credential ID (base64url) or authentication method ID to remove',
	})
	@IsString()
	@IsNotEmpty()
	credentialId: string

	@Field(() => String, {
		description: 'User password for confirmation (security measure to prevent unauthorized removal)',
	})
	@IsString()
	@IsNotEmpty()
	password: string
}

```



`src/modules/auth/2fa/guards/2fa-verified.guard.ts`


```typescript
/**
 * Metadata key for 2FA verification requirement
 */
export const REQUIRE_2FA_VERIFICATION = 'require_2fa_verification'

/**
 * Guard to ensure user has verified 2FA for current session
 * Use this for sensitive operations that require fresh 2FA verification
 */
@Injectable()
export class TwoFactorVerifiedGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly prisma: PrismaService,
		private readonly i18n: I18nService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// Check if route requires 2FA verification
		const require2FA = this.reflector.getAllAndOverride<boolean>(REQUIRE_2FA_VERIFICATION, [
			context.getHandler(),
			context.getClass(),
		])

		if (!require2FA) {
			return true // Route doesn't require 2FA
		}

		const ctx = GqlExecutionContext.create(context)
		const gqlContext = ctx.getContext()
		const user = gqlContext.req?.user

		if (!user) {
			throw new UnauthorizedException(
				this.i18n.t('common.errors.auth.user_not_authorized', { defaultValue: 'User not authorized' }),
			)
		}

		// Check if user has 2FA enabled
		const userData = await this.prisma.user.findUnique({
			where: { id: user.id },
			select: { is2FAEnabled: true },
		})

		if (!userData?.is2FAEnabled) {
			return true // User doesn't have 2FA, so no verification needed
		}

		// Check session 2FA verification status
		const sessionToken =
			gqlContext.req?.cookies?.sessionToken || gqlContext.req?.headers?.authorization?.replace('Bearer ', '')

		if (!sessionToken) {
			throw new UnauthorizedException(
				this.i18n.t('common.errors.auth.user_not_authorized', { defaultValue: 'Session not found' }),
			)
		}

		const session = await this.prisma.session.findUnique({
			where: { token: sessionToken },
			select: { is2FAVerified: true, verified2FAAt: true },
		})

		if (!session?.is2FAVerified) {
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.2fa.verification_required', { defaultValue: '2FA verification required' }),
			)
		}

		// Optional: Check if verification is recent (e.g., within last 5 minutes)
		const VERIFICATION_VALIDITY = 5 * 60 * 1000 // 5 minutes
		if (session.verified2FAAt) {
			const timeSinceVerification = Date.now() - session.verified2FAAt.getTime()
			if (timeSinceVerification > VERIFICATION_VALIDITY) {
				throw new UnauthorizedException(
					this.i18n.t('auth.errors.2fa.verification_expired', {
						defaultValue: '2FA verification has expired. Please verify again.',
					}),
				)
			}
		}

		return true
	}
}

/**
 * Decorator to require 2FA verification for a route.
 * Can be applied to a class or a method.
 */
export const Require2FAVerification = (): ((
	target: any,
	propertyKey?: string | symbol,
	descriptor?: PropertyDescriptor,
) => void) => {
	return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
		if (descriptor) {
			Reflect.defineMetadata(REQUIRE_2FA_VERIFICATION, true, descriptor.value)
		} else {
			Reflect.defineMetadata(REQUIRE_2FA_VERIFICATION, true, target)
		}
	}
}

```



`src/modules/auth/2fa/guards/index.ts`


```typescript
export * from './2fa-verified.guard'

```



`src/modules/auth/2fa/index.ts`


```typescript
// Module
export * from './2fa.module'
export * from './resolvers'
export * from './services'
export * from './dtos'
export * from './models'
export * from './guards'
export * from './types'
export * from './constants'
export * from './utils'

```



`src/modules/auth/2fa/models/2fa-method.model.ts`


```typescript
/**
 * 2FA Method response model
 */
@ObjectType('TwoFactorMethod')
export class TwoFactorMethodModel {
	@Field(() => String, { description: 'Method ID' })
	id: string

	@Field(() => E2FAMethod, { description: 'Method type' })
	method: E2FAMethod

	@Field(() => String, { nullable: true, description: 'User-provided name' })
	name?: string

	@Field(() => Boolean, { description: 'Whether method is active' })
	isActive: boolean

	@Field(() => Boolean, { description: 'Whether this is the primary method' })
	isPrimary: boolean

	@Field(() => Date, { nullable: true, description: 'Last time this method was used' })
	lastUsedAt?: Date

	@Field(() => Int, { description: 'Number of times used' })
	useCount: number

	@Field(() => Date, { description: 'When method was created' })
	createdAt: Date
}

/**
 * 2FA Methods list with status
 */
@ObjectType('TwoFactorMethodsList')
export class TwoFactorMethodsListModel {
	@Field(() => [TwoFactorMethodModel], { description: 'Available 2FA methods' })
	methods: TwoFactorMethodModel[]

	@Field(() => TwoFactorMethodModel, { nullable: true, description: 'Primary method' })
	primary?: TwoFactorMethodModel

	@Field(() => Int, { description: 'Total number of active methods' })
	totalActive: number

	@Field(() => Boolean, { description: 'Whether user has 2FA enabled' })
	is2FAEnabled: boolean
}

/**
 * Backup codes status
 */
@ObjectType('BackupCodesStatus')
export class BackupCodesStatusModel {
	@Field(() => Int, { description: 'Total backup codes generated' })
	total: number

	@Field(() => Int, { description: 'Codes already used' })
	used: number

	@Field(() => Int, { description: 'Remaining unused codes' })
	remaining: number

	@Field(() => Int, { description: 'Expired codes' })
	expired: number

	@Field(() => Boolean, { description: 'Whether running low on codes' })
	isLow: boolean
}

```



`src/modules/auth/2fa/models/2fa-setup.model.ts`


```typescript
/**
 * TOTP setup response (QR code + secret)
 */
@ObjectType('TotpSetup')
export class TotpSetupModel {
	@Field(() => String, { description: 'Method ID (temporary until verified)' })
	methodId: string

	@Field(() => String, { description: 'QR code as data URL' })
	qrCodeUrl: string

	@Field(() => String, { description: 'Manual entry key (same as in QR code)' })
	manualEntryKey: string

	@Field(() => String, { description: 'Issuer name (app name)' })
	issuer: string

	@Field(() => String, { description: 'Account name (user email)' })
	accountName: string
}

/**
 * OTP setup response
 */
@ObjectType('OtpSetup')
export class OtpSetupModel {
	@Field(() => String, { description: 'Method ID' })
	methodId: string

	@Field(() => String, { description: 'Where codes will be sent' })
	destination: string

	@Field(() => String, { description: 'Success message' })
	message: string
}

/**
 * 2FA setup completion response
 */
@ObjectType('TwoFactorSetupComplete')
export class TwoFactorSetupCompleteModel {
	@Field(() => Boolean, { description: 'Success status' })
	success: boolean

	@Field(() => String, { description: 'Method ID' })
	methodId: string

	@Field(() => [String], { description: 'Backup recovery codes (show only once!)' })
	backupCodes: string[]

	@Field(() => String, { description: 'Warning message about backup codes' })
	message: string
}

/**
 * Backup codes regeneration response
 */
@ObjectType('BackupCodesRegenerated')
export class BackupCodesRegeneratedModel {
	@Field(() => Boolean, { description: 'Success status' })
	success: boolean

	@Field(() => [String], { description: 'New backup codes' })
	backupCodes: string[]

	@Field(() => String, { description: 'Warning message' })
	message: string
}

/**
 * Generic success response
 */
@ObjectType('TwoFactorSuccess')
export class TwoFactorSuccessModel {
	@Field(() => Boolean, { description: 'Success status' })
	success: boolean

	@Field(() => String, { nullable: true, description: 'Success message' })
	message?: string
}

```



`src/modules/auth/2fa/models/admin-2fa.model.ts`


```typescript
/**
 * Admin action success response
 */
@ObjectType('AdminActionSuccess')
export class AdminActionSuccessModel {
	@Field(() => Boolean, { description: 'Operation success status' })
	success: boolean

	@Field(() => String, { description: 'Success message' })
	message: string

	@Field(() => String, { description: 'Affected user ID' })
	affectedUserId: string

	@Field(() => String, { nullable: true, description: 'Admin action ID for audit trail' })
	auditLogId?: string
}

/**
 * User 2FA status for admin view
 */
@ObjectType('User2FAStatus')
export class User2FAStatusModel {
	@Field(() => String, { description: 'User ID' })
	userId: string

	@Field(() => String, { description: 'User email' })
	email: string

	@Field(() => Boolean, { description: 'Whether 2FA is enabled' })
	is2FAEnabled: boolean

	@Field(() => String, { nullable: true, description: 'Preferred 2FA method' })
	preferred2FAMethod?: E2FAMethod

	@Field(() => [TwoFactorMethodSummary], { description: 'Active 2FA methods' })
	methods: TwoFactorMethodSummary[]

	@Field(() => [TrustedDeviceSummary], { description: 'Trusted devices' })
	trustedDevices: TrustedDeviceSummary[]

	@Field(() => Int, { description: 'Number of backup codes remaining' })
	backupCodesRemaining: number

	@Field(() => Float, { nullable: true, description: 'User risk score' })
	riskScore?: number

	@Field(() => [SecurityEventSummary], { description: 'Recent security events' })
	recentEvents: SecurityEventSummary[]
}

/**
 * 2FA method summary for admin view
 */
@ObjectType('TwoFactorMethodSummary')
export class TwoFactorMethodSummary {
	@Field(() => String, { description: 'Method ID' })
	id: string

	@Field(() => String, { description: 'Method type' })
	method: E2FAMethod

	@Field(() => String, { nullable: true, description: 'Method name' })
	name?: string

	@Field(() => Boolean, { description: 'Is active' })
	isActive: boolean

	@Field(() => Boolean, { description: 'Is primary' })
	isPrimary: boolean

	@Field(() => Date, { nullable: true, description: 'Last used' })
	lastUsedAt?: Date

	@Field(() => Int, { description: 'Use count' })
	useCount: number

	@Field(() => Date, { description: 'Created at' })
	createdAt: Date
}

/**
 * Trusted device summary for admin view
 */
@ObjectType('TrustedDeviceSummary')
export class TrustedDeviceSummary {
	@Field(() => String, { description: 'Device ID' })
	id: string

	@Field(() => String, { description: 'Device identifier' })
	deviceId: string

	@Field(() => String, { nullable: true, description: 'Device name' })
	name?: string

	@Field(() => String, { nullable: true, description: 'Browser' })
	browser?: string

	@Field(() => String, { nullable: true, description: 'Operating system' })
	os?: string

	@Field(() => Float, { description: 'Trust score' })
	trustScore: number

	@Field(() => String, { nullable: true, description: 'Last IP' })
	lastIp?: string

	@Field(() => String, { nullable: true, description: 'Last country' })
	lastCountry?: string

	@Field(() => Date, { description: 'Last seen' })
	lastSeenAt: Date

	@Field(() => Boolean, { description: 'Is active' })
	isActive: boolean
}

/**
 * Security event summary for admin view
 */
@ObjectType('SecurityEventSummary')
export class SecurityEventSummary {
	@Field(() => String, { description: 'Event ID' })
	id: string

	@Field(() => String, { description: 'Event type' })
	event: ESecurityEvent

	@Field(() => String, { description: 'Severity' })
	severity: ESecuritySeverity

	@Field(() => String, { nullable: true, description: 'IP address' })
	ip?: string

	@Field(() => String, { nullable: true, description: 'Country' })
	country?: string

	@Field(() => String, { nullable: true, description: 'City' })
	city?: string

	@Field(() => Boolean, { description: 'Resolved status' })
	resolved: boolean

	@Field(() => Date, { description: 'Event timestamp' })
	createdAt: Date
}

```



`src/modules/auth/2fa/models/index.ts`


```typescript
export * from './2fa-method.model'
export * from './2fa-setup.model'
export * from './admin-2fa.model'
export * from './webauthn.model'

```



`src/modules/auth/2fa/models/webauthn.model.ts`


```typescript
/**
 * WebAuthn registration options response
 * Contains all data needed to create a new WebAuthn credential
 */
@ObjectType('WebAuthnRegistrationOptions', {
	description: 'WebAuthn registration options for creating a new passkey or security key',
})
export class WebAuthnRegistrationOptionsModel {
	@Field(() => String, {
		description: 'Unique challenge identifier for this registration session (used to verify response)',
	})
	challengeId: string

	@Field(() => GraphQLJSON, {
		description:
			'PublicKeyCredentialCreationOptions as JSON. Pass this to @simplewebauthn/browser startRegistration() or navigator.credentials.create({ publicKey: options })',
	})
	options: Record<string, any>

	@Field(() => String, {
		description: 'Relying Party name displayed to user (e.g., "MedicHub")',
	})
	rpName: string

	@Field(() => String, {
		description: 'Relying Party ID - domain name (e.g., "medichub.com")',
	})
	rpId: string

	@Field(() => String, {
		description: 'User display name shown in authenticator UI (e.g., "John Doe <john@example.com>")',
	})
	userDisplayName: string
}

/**
 * WebAuthn registration complete response
 * Returned after successful credential creation
 */
@ObjectType('WebAuthnRegistrationComplete', {
	description: 'Response after successful WebAuthn credential registration',
})
export class WebAuthnRegistrationCompleteModel {
	@Field(() => Boolean, {
		description: 'Whether registration was successful',
	})
	success: boolean

	@Field(() => String, {
		description: 'Unique authentication method ID (stored in database)',
	})
	methodId: string

	@Field(() => String, {
		description: 'WebAuthn credential ID (base64url encoded, used for authentication)',
	})
	credentialId: string

	@Field(() => String, {
		nullable: true,
		description: 'User-provided authenticator name (e.g., "YubiKey 5C", "iPhone 15 Pro")',
	})
	authenticatorName?: string

	@Field(() => Boolean, {
		description: 'Whether this is a platform authenticator (TouchID, FaceID, Windows Hello)',
	})
	isPlatform: boolean

	@Field(() => Boolean, {
		description: 'Whether credential is backed up to cloud (iCloud Keychain, Google Password Manager)',
	})
	isBackedUp: boolean

	@Field(() => [String], {
		description: 'Backup recovery codes for emergency access (store securely, shown only once)',
	})
	backupCodes: string[]

	@Field(() => String, {
		description: 'Human-readable success message for UI display',
	})
	message: string
}

/**
 * WebAuthn authentication options response
 * Contains data needed to verify an existing credential
 */
@ObjectType('WebAuthnAuthenticationOptions', {
	description: 'WebAuthn authentication options for verifying a passkey or security key',
})
export class WebAuthnAuthenticationOptionsModel {
	@Field(() => String, {
		description: 'Unique challenge identifier for this authentication session (used to verify response)',
	})
	challengeId: string

	@Field(() => GraphQLJSON, {
		description:
			'PublicKeyCredentialRequestOptions as JSON. Pass this to @simplewebauthn/browser startAuthentication() or navigator.credentials.get({ publicKey: options })',
	})
	options: Record<string, any>

	@Field(() => String, {
		description: 'Relying Party ID - must match registration domain',
	})
	rpId: string

	@Field(() => Int, {
		description: 'Number of registered WebAuthn credentials for this user',
	})
	credentialCount: number
}

/**
 * WebAuthn authentication complete response
 * Returned after successful authentication
 */
@ObjectType('WebAuthnAuthenticationComplete', {
	description: 'Response after successful WebAuthn credential verification',
})
export class WebAuthnAuthenticationCompleteModel {
	@Field(() => Boolean, {
		description: 'Whether authentication was successful',
	})
	success: boolean

	@Field(() => String, {
		description: 'Credential ID that was used for authentication (base64url encoded)',
	})
	credentialId: string

	@Field(() => String, {
		nullable: true,
		description: 'Name of the authenticator that was used (e.g., "YubiKey 5C")',
	})
	authenticatorName?: string

	@Field(() => Int, {
		description: 'Updated signature counter (detects cloned authenticators if counter decreases)',
	})
	counter: number

	@Field(() => String, {
		description: 'Human-readable success message for UI display',
	})
	message: string
}

/**
 * WebAuthn credential info
 * Represents a registered security key or passkey
 */
@ObjectType('WebAuthnCredential', {
	description: 'Registered WebAuthn credential (security key or passkey)',
})
export class WebAuthnCredentialModel {
	@Field(() => String, {
		description: 'Unique authentication method ID (database primary key)',
	})
	id: string

	@Field(() => String, {
		description: 'WebAuthn credential ID (base64url encoded, unique per credential)',
	})
	credentialId: string

	@Field(() => String, {
		nullable: true,
		description: 'User-provided name for this credential (e.g., "Work YubiKey", "Personal iPhone")',
	})
	name?: string

	@Field(() => Boolean, {
		description: 'Platform authenticator (TouchID, FaceID, Windows Hello) vs cross-platform (YubiKey, USB key)',
	})
	isPlatform: boolean

	@Field(() => Boolean, {
		description: 'Whether credential is synced to cloud (iCloud Keychain, Google Password Manager)',
	})
	isBackedUp: boolean

	@Field(() => [String], {
		description: 'Supported transports (usb, nfc, ble, internal, hybrid)',
	})
	transports: string[]

	@Field(() => Date, {
		nullable: true,
		description: 'Timestamp of last successful authentication with this credential',
	})
	lastUsedAt?: Date

	@Field(() => Int, {
		description: 'Total number of successful authentications with this credential',
	})
	useCount: number

	@Field(() => Date, {
		description: 'Credential registration timestamp',
	})
	createdAt: Date
}

```



`src/modules/auth/2fa/resolvers/2fa.resolver.ts`


```typescript
/**
 * GraphQL Resolver for 2FA operations
 * Provides complete API for Two-Factor Authentication management
 */
@Resolver('TwoFactor')
export class TwoFactorResolver {
	constructor(
		private readonly prisma: PrismaService,
		private readonly i18n: I18nService,
		private readonly twoFactorService: TwoFactorMethodService,
		private readonly backupCodeService: BackupCodeService,
		private readonly deviceTrustService: DeviceTrustService,
		private readonly securityEventService: SecurityEventService,
		private readonly webauthnService: WebAuthnService,
	) {}

	// ==================== TOTP Operations ====================

	/**
	 * Generate TOTP setup (QR code + manual entry key)
	 * Step 1 of TOTP setup flow
	 */
	@Authorization()
	@Query(() => TotpSetupModel, {
		name: 'generateTotpSetup',
		description: 'Generate TOTP QR code and secret for setup',
	})
	async generateTotpSetup(
		@Authorized() user: User,
		@Args('data', { nullable: true }) input: GenerateTotpSetupInput = {},
		@Lang() lng: Language,
	): Promise<TotpSetupModel> {
		return this.twoFactorService.generateTotpSetup(user, input.name, lng)
	}

	/**
	 * Complete TOTP setup after scanning QR code
	 * Step 2 of TOTP setup flow (final step)
	 */
	@Authorization()
	@Mutation(() => TwoFactorSetupCompleteModel, {
		name: 'completeTotpSetup',
		description: 'Complete TOTP setup by verifying code and receive backup codes',
	})
	async completeTotpSetup(
		@Authorized() user: User,
		@Args('data') input: CompleteTotpSetupInput,
		@Lang() lng: Language,
	): Promise<TwoFactorSetupCompleteModel> {
		return this.twoFactorService.completeTotpSetup(user, input, lng)
	}

	// ==================== OTP Operations ====================

	/**
	 * Setup OTP method (Email or SMS)
	 * Step 1 of OTP setup flow
	 */
	@Authorization()
	@Mutation(() => OtpSetupModel, {
		name: 'setupOtp',
		description: 'Setup OTP method (Email or SMS)',
	})
	async setupOtp(
		@Authorized() user: User,
		@Args('data') input: SetupOtpInput,
		@Lang() lng: Language,
	): Promise<OtpSetupModel> {
		return this.twoFactorService.setupOtp(user, input, lng)
	}

	/**
	 * Send OTP code to user
	 * Step 2a of OTP setup flow (can be repeated)
	 */
	@Authorization()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'sendOtpCode',
		description: 'Send OTP verification code',
	})
	async sendOtpCode(
		@Authorized() user: User,
		@Args('data', { nullable: true }) input: SendOtpCodeInput = {},
		@Lang() lng: Language,
	): Promise<TwoFactorSuccessModel> {
		return this.twoFactorService.sendOtpCode(user, input, lng)
	}

	/**
	 * Verify OTP code during setup
	 * Step 2b of OTP setup flow (final step)
	 */
	@Authorization()
	@Mutation(() => TwoFactorSetupCompleteModel, {
		name: 'verifyOtpSetup',
		description: 'Verify OTP code during setup and receive backup codes',
	})
	async verifyOtpSetup(
		@Authorized() user: User,
		@Args('data') input: VerifyOtpSetupInput,
		@Lang() lng: Language,
	): Promise<TwoFactorSetupCompleteModel> {
		return this.twoFactorService.verifyOtpSetup(user, input, lng)
	}

	// ==================== Universal Verification ====================

	/**
	 * Verify 2FA code (works for TOTP, OTP, or backup codes)
	 * Used during login or for sensitive operations
	 */
	@Authorization()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'verify2FA',
		description: 'Verify 2FA code (TOTP/OTP/backup code)',
	})
	async verify2FA(
		@Authorized() user: User,
		@Args('data') input: Verify2FAInput,
		@Context() context: GqlContext,
		@Lang() lng: Language,
	): Promise<TwoFactorSuccessModel> {
		const session = getSessionMetadata(context.req, context.req.headers['user-agent'] || 'Unknown')

		// Determine if code is backup code (8 chars) or regular (6 digits)
		const isBackupCode = /^[A-F0-9]{8}$/i.test(input.code)

		if (isBackupCode) {
			// --- Handle Backup Code Verification ---
			const method = input.methodId
				? await this.twoFactorService['prisma'].authenticationMethod.findUnique({
						where: { id: input.methodId },
					})
				: await this.twoFactorService['prisma'].authenticationMethod.findFirst({
						where: { userId: user.id, isPrimary: true },
					})

			if (!method) {
				throw new BadRequestException(
					this.i18n.t('auth.errors.2fa.method_not_found', { lng, defaultValue: '2FA method not found' }),
				)
			}

			try {
				await this.backupCodeService.verifyBackupCode(user, input.code, method.method, lng, session.ip)
				await this.securityEventService.log2FASuccess(user.id, 'BACKUP_CODE', session)
			} catch (error) {
				await this.securityEventService.log2FAFailed(user.id, 'BACKUP_CODE', session, 1)
				throw error
			}
		} else {
			// --- Handle TOTP/OTP Code Verification ---
			const method = input.methodId
				? await this.prisma.authenticationMethod.findFirst({
						where: { id: input.methodId, userId: user.id },
					})
				: await this.prisma.authenticationMethod.findFirst({
						where: { userId: user.id, isPrimary: true },
					})

			if (!method) {
				throw new BadRequestException(
					this.i18n.t('auth.errors.2fa.method_not_found', { lng, defaultValue: '2FA method not found' }),
				)
			}

			let isCodeValid = false

			switch (method.method) {
				case E2FAMethod.TOTP: {
					const totpData = method.data as unknown as ITotpMethodData
					isCodeValid = this.twoFactorService.verifyTotpCode(user.email, totpData.secret, input.code)
					break
				}

				case E2FAMethod.OTP_EMAIL:
				case E2FAMethod.OTP_SMS: {
					isCodeValid = await this.twoFactorService.verifyOneTimeCode(user.id, method.id, input.code, lng)
					break
				}

				default: {
					throw new BadRequestException(
						`Verification for method type ${method.method} is not supported here.`,
					)
				}
			}

			if (!isCodeValid) {
				await this.securityEventService.log2FAFailed(user.id, method.method, session, 1)
				throw new UnauthorizedException(
					this.i18n.t('auth.errors.2fa.invalid_code', { lng, defaultValue: 'Invalid 2FA code' }),
				)
			}

			await this.securityEventService.log2FASuccess(user.id, method.method, session)

			// For now, return success
			await this.securityEventService.log2FASuccess(user.id, method.method, session)
		}

		// If trustDevice is true, register device as trusted
		if (input.trustDevice) {
			const deviceId = await this.deviceTrustService.registerDevice(user.id, session, lng)
			await this.deviceTrustService.trustDevice(user.id, deviceId)
		}

		// Update session as 2FA verified
		const sessionToken = context.req.cookies?.sessionToken
		if (sessionToken) {
			await this.twoFactorService['prisma'].session.updateMany({
				where: { token: sessionToken, userId: user.id },
				data: {
					is2FAVerified: true,
					verified2FAAt: new Date(),
				},
			})
		}

		return {
			success: true,
			message: '2FA verified successfully',
		}
	}

	/**
	 * Verify backup code explicitly
	 */
	@Authorization()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'verifyBackupCode',
		description: 'Verify backup recovery code',
	})
	async verifyBackupCode(
		@Authorized() user: User,
		@Args('data') input: VerifyBackupCodeInput,
		@Context() context: GqlContext,
		@Lang() lng: Language,
	): Promise<TwoFactorSuccessModel> {
		const session = getSessionMetadata(context.req, context.req.headers['user-agent'] || 'Unknown')

		const method = input.methodId
			? await this.twoFactorService['prisma'].authenticationMethod.findUnique({
					where: { id: input.methodId },
				})
			: await this.twoFactorService['prisma'].authenticationMethod.findFirst({
					where: { userId: user.id, isPrimary: true },
				})

		if (!method) {
			throw new Error('2FA method not found')
		}

		await this.backupCodeService.verifyBackupCode(user, input.backupCode, method.method, lng)
		await this.securityEventService.log2FASuccess(user.id, 'BACKUP_CODE', session)

		return {
			success: true,
			message: 'Backup code verified successfully',
		}
	}

	// ==================== Method Management ====================

	/**
	 * Get all user's 2FA methods
	 */
	@Authorization()
	@Query(() => TwoFactorMethodsListModel, {
		name: 'my2FAMethods',
		description: "Get user's 2FA methods",
	})
	async getMy2FAMethods(@Authorized() user: User): Promise<TwoFactorMethodsListModel> {
		return this.twoFactorService.getUserMethods(user.id)
	}

	/**
	 * Update 2FA method
	 */
	@Authorization()
	@UseGuards(TwoFactorVerifiedGuard)
	@Require2FAVerification()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'update2FAMethod',
		description: 'Update 2FA method (name, primary status, etc.)',
	})
	async update2FAMethod(
		@Authorized() user: User,
		@Args('data') input: Update2FAMethodInput,
		@Lang() lng: Language,
	): Promise<TwoFactorSuccessModel> {
		return this.twoFactorService.updateMethod(user.id, input, lng)
	}

	/**
	 * Remove 2FA method
	 */
	@Authorization()
	@UseGuards(TwoFactorVerifiedGuard)
	@Require2FAVerification()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'remove2FAMethod',
		description: 'Remove 2FA method (requires password confirmation)',
	})
	async remove2FAMethod(
		@Authorized() user: User,
		@Args('data') input: Remove2FAMethodInput,
		@Lang() lng: Language,
	): Promise<TwoFactorSuccessModel> {
		return this.twoFactorService.removeMethod(user, input, lng)
	}

	// ==================== Backup Codes ====================

	/**
	 * Get backup codes status
	 */
	@Authorization()
	@Query(() => BackupCodesStatusModel, {
		name: 'backupCodesStatus',
		description: 'Get status of backup codes',
	})
	async getBackupCodesStatus(
		@Authorized() user: User,
		@Args('methodId', { nullable: true }) methodId?: string,
	): Promise<BackupCodesStatusModel> {
		const method = methodId
			? await this.twoFactorService['prisma'].authenticationMethod.findUnique({
					where: { id: methodId },
				})
			: await this.twoFactorService['prisma'].authenticationMethod.findFirst({
					where: { userId: user.id, isPrimary: true },
				})

		if (!method) {
			throw new Error('2FA method not found')
		}

		const status = await this.backupCodeService.getBackupCodesStatus(user.id, method.method)

		return {
			total: status.total,
			used: status.used,
			remaining: status.remaining,
			expired: status.expired,
			isLow: status.remaining <= 3,
		}
	}

	/**
	 * Regenerate backup codes
	 */
	@Authorization()
	@UseGuards(TwoFactorVerifiedGuard)
	@Require2FAVerification()
	@Mutation(() => BackupCodesRegeneratedModel, {
		name: 'regenerateBackupCodes',
		description: 'Regenerate backup codes (requires password)',
	})
	async regenerateBackupCodes(
		@Authorized() user: User,
		@Args('data') input: RegenerateBackupCodesInput,
		@Lang() lng: Language,
	): Promise<BackupCodesRegeneratedModel> {
		return this.twoFactorService.regenerateBackupCodes(user, input, lng)
	}

	// ==================== Device Trust ====================

	/**
	 * Get trusted devices
	 */
	@Authorization()
	@Query(() => [TwoFactorMethodModel], {
		name: 'myTrustedDevices',
		description: "Get user's trusted devices",
	})
	async getMyTrustedDevices(@Authorized() user: User) {
		const devices = await this.deviceTrustService.getUserDevices(user.id)
		return devices.map(d => ({
			id: d.id,
			deviceId: d.deviceId,
			name: d.name,
			browser: d.browser,
			os: d.os,
			device: d.device,
			trustScore: d.trustScore,
			lastCountry: d.lastCountry,
			lastCity: d.lastCity,
			isActive: d.isActive,
			lastSeenAt: d.lastSeenAt,
			expiresAt: d.expiresAt,
			createdAt: d.createdAt,
		}))
	}

	/**
	 * Revoke device trust
	 */
	@Authorization()
	@UseGuards(TwoFactorVerifiedGuard)
	@Require2FAVerification()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'revokeDeviceTrust',
		description: 'Revoke trust for a device',
	})
	async revokeDeviceTrust(
		@Authorized() user: User,
		@Args('deviceId') deviceId: string,
	): Promise<TwoFactorSuccessModel> {
		await this.deviceTrustService.revokeDevice(user.id, deviceId)
		return {
			success: true,
			message: 'Device trust revoked successfully',
		}
	}

	// ==================== Utility ====================

	/**
	 * Check if user has 2FA enabled
	 */
	@Authorization()
	@Query(() => Boolean, {
		name: 'is2FAEnabled',
		description: 'Check if user has 2FA enabled',
	})
	async is2FAEnabled(@Authorized() user: User): Promise<boolean> {
		const userData = await this.twoFactorService['prisma'].user.findUnique({
			where: { id: user.id },
			select: { is2FAEnabled: true },
		})
		return userData?.is2FAEnabled || false
	}

	/**
	 * Check if current session is 2FA verified
	 */
	@Authorization()
	@Query(() => Boolean, {
		name: 'isSession2FAVerified',
		description: 'Check if current session is 2FA verified',
	})
	async isSession2FAVerified(@Context() context: GqlContext): Promise<boolean> {
		const sessionToken = context.req.cookies?.sessionToken
		if (!sessionToken) return false

		const session = await this.twoFactorService['prisma'].session.findUnique({
			where: { token: sessionToken },
			select: { is2FAVerified: true },
		})

		return session?.is2FAVerified || false
	}

	// ==================== WebAuthn Operations ====================

	/**
	 * Start WebAuthn registration process
	 */
	@Authorization()
	@Mutation(() => WebAuthnRegistrationOptionsModel, {
		name: 'startWebAuthnRegistration',
		description: 'Generate WebAuthn registration options for adding a security key or passkey',
	})
	async startWebAuthnRegistration(
		@Authorized() user: User,
		@Args('data', { nullable: true }) input: StartWebAuthnRegistrationInput = {},
		@Lang() lng: Language,
	): Promise<WebAuthnRegistrationOptionsModel> {
		const { challengeId, options } = await this.webauthnService.generateRegistrationOptions(
			user,
			input.authenticatorAttachment,
			lng,
		)

		return {
			challengeId,
			options, // Type conversion for GraphQL
			rpName: options.rp.name,
			rpId: options.rp.id,
			userDisplayName: options.user.displayName,
		}
	}

	/**
	 * Complete WebAuthn registration
	 */
	@Authorization()
	@Mutation(() => WebAuthnRegistrationCompleteModel, {
		name: 'completeWebAuthnRegistration',
		description: 'Verify and save WebAuthn credential',
	})
	async completeWebAuthnRegistration(
		@Authorized() user: User,
		@Args('data') input: CompleteWebAuthnRegistrationInput,
		@Lang() lng: Language,
	): Promise<WebAuthnRegistrationCompleteModel> {
		const result = await this.webauthnService.verifyRegistrationResponse(
			user,
			input.challengeId,
			input.response,
			input.authenticatorName,
			lng,
		)

		// Get credential details
		const method = await this.prisma.authenticationMethod.findUnique({
			where: { credentialId: result.credentialId },
		})

		const data = method?.data as any

		return {
			success: result.success,
			methodId: result.methodId,
			credentialId: result.credentialId,
			authenticatorName: input.authenticatorName,
			isPlatform: method?.method === 'PASSKEY',
			isBackedUp: data?.backedUp || false,
			backupCodes: result.backupCodes,
			message: this.i18n.t('auth.success.2fa.webauthn_registered', {
				lng,
				defaultValue: 'Security key registered successfully',
			}),
		}
	}

	/**
	 * Start WebAuthn authentication
	 */
	@Query(() => WebAuthnAuthenticationOptionsModel, {
		name: 'startWebAuthnAuthentication',
		description: 'Generate WebAuthn authentication options',
	})
	async startWebAuthnAuthentication(
		@Args('data', { nullable: true }) input: StartWebAuthnAuthenticationInput = {},
		@Context() context: GqlContext,
	): Promise<WebAuthnAuthenticationOptionsModel> {
		// Try to get user ID from session or input
		const userId =
			context.req.user?.id ||
			(input.email
				? (
						await this.prisma.user.findUnique({
							where: { email: input.email },
							select: { id: true },
						})
					)?.id
				: undefined)

		const { challengeId, options, credentialCount } = await this.webauthnService.generateAuthenticationOptions(
			userId,
			input.credentialId,
		)

		return {
			challengeId,
			options,
			rpId: options.rpId,
			credentialCount,
		}
	}

	/**
	 * Complete WebAuthn authentication
	 */
	@Mutation(() => WebAuthnAuthenticationCompleteModel, {
		name: 'completeWebAuthnAuthentication',
		description: 'Verify WebAuthn authentication response',
	})
	async completeWebAuthnAuthentication(
		@Args('data') input: CompleteWebAuthnAuthenticationInput,
		@Context() context: GqlContext,
		@Lang() lng: Language,
	): Promise<WebAuthnAuthenticationCompleteModel> {
		const result = await this.webauthnService.verifyAuthenticationResponse(input.challengeId, input.response, lng)

		// Get credential details
		const method = await this.prisma.authenticationMethod.findUnique({
			where: { credentialId: result.credentialId },
			select: { name: true, data: true },
		})

		// Mark session as 2FA verified
		const sessionToken = context.req.cookies?.sessionToken
		if (sessionToken) {
			await this.prisma.session.updateMany({
				where: { token: sessionToken, userId: result.userId },
				data: {
					is2FAVerified: true,
					verified2FAAt: new Date(),
				},
			})
		}

		const data = method?.data as any

		return {
			success: result.success,
			credentialId: result.credentialId,
			authenticatorName: method?.name,
			counter: data?.counter || 0,
			message: this.i18n.t('auth.success.2fa.webauthn_verified', {
				lng,
				defaultValue: 'Authentication successful',
			}),
		}
	}

	/**
	 * Get user's WebAuthn credentials
	 */
	@Authorization()
	@Query(() => [WebAuthnCredentialModel], {
		name: 'myWebAuthnCredentials',
		description: "Get user's registered WebAuthn credentials",
	})
	async getMyWebAuthnCredentials(@Authorized() user: User): Promise<WebAuthnCredentialModel[]> {
		return this.webauthnService.getUserCredentials(user.id)
	}

	/**
	 * Remove WebAuthn credential
	 */
	@Authorization()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'removeWebAuthnCredential',
		description: 'Remove a WebAuthn credential',
	})
	async removeWebAuthnCredential(
		@Authorized() user: User,
		@Args('data') input: RemoveWebAuthnCredentialInput,
		@Lang() lng: Language,
	): Promise<TwoFactorSuccessModel> {
		await this.webauthnService.removeCredential(user, input.credentialId, input.password, lng)

		return {
			success: true,
			message: this.i18n.t('auth.success.2fa.credential_removed', {
				lng,
				defaultValue: 'Security key removed successfully',
			}),
		}
	}
}

```



`src/modules/auth/2fa/resolvers/admin-2fa.resolver.ts`


```typescript
/**
 * Administrative resolver for 2FA management.
 * All operations require SUPER_ADMIN role and are heavily audited.
 */
@Resolver('Admin2FA')
@Authorization() // Require authentication for all operations
@Roles(EUserRole.SUPER_ADMIN) // Require SUPER_ADMIN role
@UseGuards(RolesGuard) // Apply role checking
export class AdminTwoFactorResolver {
	constructor(
		private readonly adminService: AdminTwoFactorService,
		private readonly deviceTrustService: DeviceTrustService,
	) {}

	// ==================== Queries ====================

	/**
	 * Get comprehensive 2FA status for any user
	 */
	@Query(() => User2FAStatusModel, {
		name: 'adminGetUser2FAStatus',
		description: '[Admin] Get comprehensive 2FA status for a user',
	})
	async getUser2FAStatus(@Args('userId') userId: string): Promise<User2FAStatusModel> {
		return this.adminService.getUser2FAStatus(userId)
	}

	/**
	 * Get security events for a user
	 */
	@Query(() => [SecurityEventSummary], {
		name: 'adminGetUserSecurityEvents',
		description: '[Admin] Get security events for a user',
	})
	async getUserSecurityEvents(@Args('input') input: GetUserSecurityEventsInput): Promise<SecurityEventSummary[]> {
		const events = await this.adminService.getUserSecurityEvents(input)

		return events.map(e => ({
			id: e.id,
			event: e.event,
			severity: e.severity,
			ip: e.ip,
			country: e.country,
			city: e.city,
			resolved: e.resolved,
			createdAt: e.createdAt,
		}))
	}

	/**
	 * Get all trusted devices for a user
	 */
	@Query(() => [TrustedDeviceSummary], {
		name: 'adminGetUserTrustedDevices',
		description: '[Admin] Get all trusted devices for a user',
	})
	async getUserTrustedDevices(@Args('userId') userId: string): Promise<TrustedDeviceSummary[]> {
		const devices = await this.deviceTrustService.getUserDevices(userId)

		return devices.map(d => ({
			id: d.id,
			deviceId: d.deviceId,
			name: d.name,
			browser: d.browser,
			os: d.os,
			trustScore: d.trustScore,
			lastIp: d.lastIp,
			lastCountry: d.lastCountry,
			lastSeenAt: d.lastSeenAt,
			isActive: d.isActive,
		}))
	}

	// ==================== Mutations ====================

	/**
	 * Disable 2FA for a user (emergency access)
	 */
	@Mutation(() => AdminActionSuccessModel, {
		name: 'adminDisableUser2FA',
		description: '[Admin] Disable 2FA for a user in emergency situations',
	})
	async disableUser2FA(
		@Authorized() adminUser: User,
		@Args('input') input: DisableUser2FAInput,
	): Promise<AdminActionSuccessModel> {
		return this.adminService.disableUser2FA(adminUser, input)
	}

	/**
	 * Revoke a specific device for a user
	 */
	@Mutation(() => AdminActionSuccessModel, {
		name: 'adminRevokeUserDevice',
		description: '[Admin] Revoke a specific trusted device for a user',
	})
	async revokeUserDevice(
		@Authorized() adminUser: User,
		@Args('input') input: RevokeUserDeviceInput,
	): Promise<AdminActionSuccessModel> {
		return this.adminService.revokeUserDevice(adminUser, input)
	}

	/**
	 * Revoke all devices for a user (emergency)
	 */
	@Mutation(() => AdminActionSuccessModel, {
		name: 'adminRevokeAllUserDevices',
		description: '[Admin] Revoke all trusted devices and sessions for a user',
	})
	async revokeAllUserDevices(
		@Authorized() adminUser: User,
		@Args('input') input: RevokeAllUserDevicesInput,
	): Promise<AdminActionSuccessModel> {
		return this.adminService.revokeAllUserDevices(adminUser, input)
	}
}

```



`src/modules/auth/2fa/resolvers/index.ts`


```typescript
export * from './2fa.resolver'
export * from './admin-2fa.resolver'

```


