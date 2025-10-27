# Full App Code (excluding imports, tests, i18n)

`src/core/config/app.config.ts`

```typescript
export const CLIENT_URL = String(process.env.CLIENT_URL) || 'http://localhost:3000'
export const COMPANY_NAME = String(process.env.COMPANY_NAME) || 'MedicHub Inc.'
export const APP_NAME = String(process.env.APP_NAME) || 'DoctorLab'
export const SUPPORT_EMAIL = String(process.env.SUPPORT_EMAIL) || 'maridim.dev@gmail.com'

// RATE LIMITING
export const RATE_LIMIT_LOGIN_POINTS = Number(process.env.RATE_LIMIT_LOGIN_POINTS) || 5
export const RATE_LIMIT_LOGIN_WINDOW_MS = Number(process.env.RATE_LIMIT_LOGIN_WINDOW_MS) || 900 // 15 minutes

export const RATE_LIMIT_RESET_PASSWORD_POINTS = Number(process.env.RATE_LIMIT_RESET_PASSWORD_POINTS) || 3
export const RATE_LIMIT_RESET_PASSWORD_WINDOW_MS = Number(process.env.RATE_LIMIT_RESET_PASSWORD_WINDOW_MS) || 3600 // 3 hours

export const RATE_LIMIT_NEW_PASSWORD_POINTS = Number(process.env.RATE_LIMIT_NEW_PASSWORD_POINTS) || 5
export const RATE_LIMIT_NEW_PASSWORD_WINDOW_MS = Number(process.env.RATE_LIMIT_NEW_PASSWORD_WINDOW_MS) || 900 // 15 minutes

export const RATE_LIMIT_2FA_POINTS = Number(process.env.RATE_LIMIT_2FA_POINTS) || 5
export const RATE_LIMIT_2FA_WINDOW_MS = Number(process.env.RATE_LIMIT_2FA_WINDOW_MS) || 300 // 5 minutes

export const RATE_LIMIT_CHANGE_PASSWORD_POINTS = Number(process.env.RATE_LIMIT_CHANGE_PASSWORD_POINTS) || 5
export const RATE_LIMIT_CHANGE_PASSWORD_WINDOW_MS = Number(process.env.RATE_LIMIT_CHANGE_PASSWORD_WINDOW_MS) || 3600 // 3 hours

export const RATE_LIMIT_VERIFICATION_EMAIL_POINTS = Number(process.env.RATE_LIMIT_VERIFICATION_EMAIL_POINTS) || 5
export const RATE_LIMIT_VERIFICATION_EMAIL_WINDOW_MS =
	Number(process.env.RATE_LIMIT_VERIFICATION_EMAIL_WINDOW_MS) || 3600 // 3 hours
```

`src/core/config/graphql.config.ts`

```typescript
export function getGraphQLConfig(configService: ConfigService): ApolloDriverConfig {
	const path = configService.getOrThrow<string>('GRAPHQL_PREFIX')
	const autoSchemaFile = join(process.cwd(), 'src/core/graphql/schema.gql')

	return {
		path,
		autoSchemaFile,
		sortSchema: true,
		context: ({ req, res }: { req: Request; res: Response }) => ({
			req,
			res,
			language: req.language || DEFAULT_LANGUAGE,
		}),
		installSubscriptionHandlers: true,
	}
}
```

`src/core/config/helmet.config.ts`

```typescript
/**
 * Helmet.js configuration for enhancing application security through HTTP headers.
 * This configuration sets up a strict Content Security Policy (CSP) and other
 * security-related headers.
 *
 * @see https://helmetjs.github.io/
 */
export const helmetConfig: HelmetOptions = {
	/**
	 * Content Security Policy (CSP)
	 * Helps prevent cross-site scripting (XSS) and other injection attacks.
	 * This policy is strict by default and should be customized for your application's needs.
	 */
	contentSecurityPolicy: {
		directives: {
			/** Default source for all content types */
			defaultSrc: ["'self'"],

			/** Defines valid sources for scripts */
			scriptSrc: ["'self'", "'unsafe-inline'"], // 'unsafe-inline' is often needed for GraphQL Playground, remove for production if possible

			/** Defines valid sources for styles */
			styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],

			/** Defines valid sources for images */
			imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'], // Allow self, data URIs, and Cloudinary

			/** Defines valid sources for fonts */
			fontSrc: ["'self'", 'https://fonts.gstatic.com'],

			/** Defines valid sources for frames */
			frameSrc: ["'none'"], // Disallow framing by default

			/** Defines valid sources for workers and nested browsing contexts */
			childSrc: ["'self'"],

			/** Defines valid sources for connections (e.g., WebSockets, fetch) */
			connectSrc: ["'self'"],

			/** Defines valid sources for object, embed, and applet elements */
			objectSrc: ["'none'"], // Disallow plugins like Flash

			/** Instructs user agents to report CSP violations */
			// reportUri: ['/csp-violation-report-endpoint'], // Uncomment and set up a reporting endpoint if needed
		},
	},

	/**
	 * HTTP Strict Transport Security (HSTS)
	 * Enforces secure (HTTPS) connections to the server.
	 * Make sure your site is fully served over HTTPS before enabling.
	 */
	strictTransportSecurity: {
		maxAge: 31536000, // 1 year in seconds
		includeSubDomains: true,
		preload: true,
	},

	/**
	 * X-Content-Type-Options
	 * Prevents browsers from MIME-sniffing a response away from the declared content-type.
	 */
	xContentTypeOptions: true,

	/**
	 * X-Frame-Options
	 * Provides clickjacking protection. 'DENY' prevents the page from being displayed in a frame.
	 */
	xFrameOptions: {
		action: 'deny',
	},

	/**
	 * Cross-Origin-Embedder-Policy
	 * Prevents a document from loading any cross-origin resources that don't explicitly grant permission.
	 */
	crossOriginEmbedderPolicy: false, // Set to false to avoid issues with some CDNs/scripts unless specifically needed

	/**
	 * Cross-Origin-Opener-Policy
	 * Prevents other domains from opening your page in a new window and gaining access to it.
	 */
	crossOriginOpenerPolicy: {
		policy: 'same-origin', // Recommended default
	},

	/**
	 * Cross-Origin-Resource-Policy
	 * Controls which cross-origin requests are allowed to your resources.
	 */
	crossOriginResourcePolicy: {
		policy: 'same-origin', // Good default
	},

	/**
	 * Referrer-Policy
	 * Controls how much referrer information (sent via the Referer header) should be included with requests.
	 * 'strict-origin-when-cross-origin' is a good default for privacy.
	 */
	referrerPolicy: {
		policy: 'strict-origin-when-cross-origin',
	},

	/**
	 * Permissions-Policy
	 * Allows you to control which features and APIs can be used in the browser.
	 */
	// ❌ Удаляем проблемную опцию
	// permissionsPolicy: {
	// 	features: {
	// 		geolocation: ["'none'"],
	// 		microphone: ["'none'"],
	// 		camera: ["'none'"],
	// 		payment: ["'none'"],
	// 	},
	// },
}
```

`src/core/config/i18n.config.ts`

```typescript
export async function initI18n() {
	await i18next
		.use(Backend)
		.use(LanguageDetector.LanguageDetector)
		.init({
			fallbackLng: DEFAULT_LANGUAGE,
			preload: LANGUAGES,
			nsSeparator: '.',
			keySeparator: '.',
			ns: NAMESPACES,
			defaultNS: 'auth',
			backend: {
				loadPath: LOCALE_FILE_PATH,
			},
			detection: {
				order: ['querystring', 'cookie', 'header'],
				caches: ['cookie'],
			},
			saveMissing: IS_DEV_ENV,
			missingKeyHandler: IS_DEV_ENV ? missingKeyHandler : undefined,
		})
}

function missingKeyHandler(lngs: readonly string[], ns: string | string[], key: string, fallbackValue: string): void {
	const nsStr = Array.isArray(ns) ? ns[0] : ns
	const fallback = fallbackValue ?? ''

	for (const lang of LANGUAGES) {
		I18nLogger.log(I18nLogType.MISSING, key, nsStr, lang)

		const filePath = path.join(process.cwd(), 'src/core/i18n/locales', lang, `${nsStr}.json`)
		try {
			// ensure we don't assign `any` from JSON.parse directly
			let content: Record<string, string> = {}
			if (fs.existsSync(filePath)) {
				const raw = fs.readFileSync(filePath, 'utf-8')
				try {
					content = JSON.parse(raw) as Record<string, string>
				} catch {
					// if the file contains invalid JSON, fallback to empty object
					content = {}
				}
			}

			// use hasOwnProperty to avoid overwriting existing falsy values
			if (!Object.prototype.hasOwnProperty.call(content, key)) {
				content[key] = fallback
				fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8')
			}
		} catch (err) {
			console.error(`[i18n] Failed to write key: ${err}`)
		}
	}
}

export const i18n = i18next
```

`src/core/config/index.ts`

```typescript
export * from './app.config'
export * from './graphql.config'
export * from './helmet.config'
export * from './i18n.config'
export * from './mailer.config'
export * from './paths.config'
export * from './session.config'
```

`src/core/config/mailer.config.ts`

```typescript
export function getMailerConfig(configService: ConfigService): MailerOptions {
	return {
		transport: {
			host: configService.getOrThrow<string>('MAIL_HOST'),
			port: configService.getOrThrow<number>('MAIL_PORT'),
			secure: false, // Использовать true для SSL (порт 465)
			auth: {
				user: configService.getOrThrow<string>('MAIL_LOGIN'),
				pass: configService.getOrThrow<string>('MAIL_PASSWORD'),
			},
		},
	}
}
```

`src/core/config/paths.config.ts`

```typescript
export const PATHS = {
	VERIFY_EMAIL: (domain: string, token: string) => `${domain}/auth/verify?token=${token}`,
	RECOVERY_PASSWORD: (domain: string) => `${domain}/auth/recovery`,
	RESET_PASSWORD: (domain: string, token: string) => `${domain}/auth/recovery/${token}`,
}
```

`src/core/config/session.config.ts`

```typescript
export const sessionConfig = (config: ConfigService, redis: RedisService) => {
	const redisClient = redis.getClient()

	const store = new RedisStore({
		client: redisClient,
		prefix: config.getOrThrow<string>('SESSION_FOLDER') || 'sessions:',
		ttl: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
	})

	return session({
		store,
		secret: config.getOrThrow<string>('SESSION_SECRET'),
		name: config.getOrThrow<string>('SESSION_NAME'),
		resave: false,
		saveUninitialized: false,
		cookie: {
			domain: config.getOrThrow<string>('SESSION_DOMAIN') || 'localhost',
			maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
			httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
			secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
			sameSite: 'lax' as const,
		},
	})
}
```

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
		ProviderModule,

		// Modules
		SecurityModule,

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
		{ provide: APP_GUARD, useClass: RateLimitGuard },
	],
})
export class CoreModule {}
```

`src/core/core.service.ts`

```typescript
export interface CoreServiceDependencies {
	i18n?: I18nService
	prisma?: PrismaService
	redis?: RedisService
	config?: ConfigService
}

/**
 * Base application service with shared dependencies and helpers.
 * Extend this class in your feature services to get typed access
 * to Prisma, Redis, Config and i18n utilities.
 */
@Injectable()
export abstract class CoreService {
	protected readonly i18n?: I18nService
	protected readonly prisma?: PrismaService
	protected readonly redis?: RedisService
	protected readonly config?: ConfigService

	constructor(dependencies: CoreServiceDependencies) {
		this.i18n = dependencies.i18n
		this.prisma = dependencies.prisma
		this.redis = dependencies.redis
		this.config = dependencies.config
	}
	// constructor(
	// 	protected readonly i18n?: I18nService,
	// 	protected readonly prisma?: PrismaService,
	// 	protected readonly redis?: RedisService,
	// 	protected readonly config?: ConfigService,
	// ) {}

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

	// ===== ХЕЛПЕРЫ ДЛЯ REDIS SETS И ZSETS =====

	/** Add one or more members to a Redis set */
	protected async rSAdd(key: string, members: string | string[]): Promise<number> {
		return (await this.redis?.sAdd(key, members)) ?? 0
	}

	/** Remove one or more members from a Redis set */
	protected async rSRem(key: string, members: string | string[]): Promise<number> {
		return (await this.redis?.sRem(key, members)) ?? 0
	}

	/** Check if a member exists in a Redis set */
	protected async rSIsMember(key: string, member: string): Promise<boolean> {
		return (await this.redis?.sIsMember(key, member)) ?? false
	}
}
```

`src/core/graphql/schema.gql`

```graphql
# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------

type AdminActionSuccess {
  """Affected user ID"""
  affectedUserId: String!

  """Admin action ID for audit trail"""
  auditLogId: String

  """Success message"""
  message: String!

  """Operation success status"""
  success: Boolean!
}

type BackupCodesRegenerated {
  """New backup codes"""
  backupCodes: [String!]!

  """Warning message"""
  message: String!

  """Success status"""
  success: Boolean!
}

type BackupCodesStatus {
  """Expired codes"""
  expired: Int!

  """Whether running low on codes"""
  isLow: Boolean!

  """Remaining unused codes"""
  remaining: Int!

  """Total backup codes generated"""
  total: Int!

  """Codes already used"""
  used: Int!
}

"""Input data for changing user email address"""
input ChangeEmailInput {
  """New email address (must be unique and different from current)"""
  email: String!
}

"""Input data for changing user password"""
input ChangePasswordInput {
  """New password (minimum 8 characters, must differ from old)"""
  newPassword: String!

  """Current password (for verification)"""
  oldPassword: String!
}

"""Response after successful password change"""
type ChangePasswordResponse {
  """Number of other sessions invalidated (logged out from other devices)"""
  sessionsInvalidated: Float!

  """Whether the password change was successful"""
  success: Boolean!
}

input CompleteTotpSetupInput {
  """6-digit TOTP code for verification"""
  code: String!

  """Optional custom name"""
  name: String

  """TOTP secret from generation step"""
  secret: String!
}

"""
Input for completing WebAuthn authentication with authenticator response
"""
input CompleteWebAuthnAuthenticationInput {
  """
  Challenge ID from authentication options (used to verify this response)
  """
  challengeId: String!

  """
  AuthenticationResponseJSON from @simplewebauthn/browser startAuthentication(). Contains id, rawId, response.authenticatorData, response.clientDataJSON, response.signature, response.userHandle, and type.
  """
  response: JSON!
}

"""Input for completing WebAuthn registration with authenticator response"""
input CompleteWebAuthnRegistrationInput {
  """
  Custom name for this authenticator (overrides name from StartWebAuthnRegistrationInput)
  """
  authenticatorName: String

  """Challenge ID from registration options (used to verify this response)"""
  challengeId: String!

  """
  RegistrationResponseJSON from @simplewebauthn/browser startRegistration(). Contains id, rawId, response.attestationObject, response.clientDataJSON, type, and optional fields.
  """
  response: JSON!
}

"""Input data for creating a new user account"""
input CreateAccountInput {
  """Email address (must be unique)"""
  email: String!

  """Full name (alphanumeric with hyphens allowed)"""
  fullName: String!

  """Password (minimum 8 characters)"""
  password: String!

  """Phone number in E.164 format (e.g., +1234567890)"""
  phone: String!
}

"""
A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format.
"""
scalar DateTime

"""Device information parsed from User-Agent header"""
type Device {
  """Browser name and version (e.g., "Chrome 120.0")"""
  browser: String!

  """Operating system (e.g., "macOS 14.0")"""
  os: String!

  """Device type (desktop, mobile, tablet)"""
  type: String!
}

input DisableUser2FAInput {
  """Whether to notify the user via email"""
  notifyUser: Boolean = true

  """Reason for disabling 2FA"""
  reason: String!

  """User ID whose 2FA should be disabled"""
  userId: String!
}

"""Available two-factor authentication methods"""
enum E2FAMethod {
  """Backup recovery codes for emergency access"""
  BACKUP_CODE

  """One-time password sent via email"""
  OTP_EMAIL

  """One-time password sent via SMS"""
  OTP_SMS

  """Passkeys using biometrics (TouchID, FaceID, Windows Hello)"""
  PASSKEY

  """Time-based one-time password (Google Authenticator, Authy, 1Password)"""
  TOTP

  """WebAuthn/FIDO2 hardware security keys (YubiKey, Titan)"""
  WEBAUTHN
}

"""User role for access control and permissions"""
enum EUserRole {
  """Super administrator with full system access"""
  SUPER_ADMIN

  """Regular user with standard permissions"""
  USER
}

input GenerateTotpSetupInput {
  """Optional custom name for this method"""
  name: String
}

input GetUserSecurityEventsInput {
  """Filter by event types"""
  events: [String!]

  """Number of events to return"""
  limit: Int = 50

  """Filter by severity levels"""
  severities: [String!]

  """User ID"""
  userId: String!
}

"""
The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
"""
scalar JSON

"""Geographic location information derived from IP address"""
type Location {
  """City name (e.g., "New York")"""
  city: String!

  """Country name (e.g., "United States")"""
  country: String!

  """Latitude coordinate"""
  latitude: Float!

  """Longitude coordinate"""
  longitude: Float!
}

"""User credentials for authentication"""
input LoginInput {
  """User email address"""
  email: String!

  """User password (min 8 characters)"""
  password: String!
}

"""Response after successful authentication"""
  type LoginResponse {
    """Authenticated user data"""
    user: User
}

type Mutation {
  """[Admin] Disable 2FA for a user in emergency situations"""
  adminDisableUser2FA(input: DisableUser2FAInput!): AdminActionSuccess!

  """[Admin] Revoke all trusted devices and sessions for a user"""
  adminRevokeAllUserDevices(input: RevokeAllUserDevicesInput!): AdminActionSuccess!

  """[Admin] Revoke a specific trusted device for a user"""
  adminRevokeUserDevice(input: RevokeUserDeviceInput!): AdminActionSuccess!

  """
  Change current user email address. Resets verification status and sends new verification email.
  """
  changeEmail(data: ChangeEmailInput!): Boolean!

  """
  Change current user password. Verifies old password, invalidates all other sessions, logs security event, and updates passwordChangedAt timestamp.
  """
  changePassword(data: ChangePasswordInput!): ChangePasswordResponse!

  """Clear session cookie from client (does not invalidate Redis session)."""
  clearSessionCookie: Boolean!

  """Complete TOTP setup by verifying code and receive backup codes"""
  completeTotpSetup(data: CompleteTotpSetupInput!): TwoFactorSetupComplete!

  """Verify WebAuthn authentication response"""
  completeWebAuthnAuthentication(data: CompleteWebAuthnAuthenticationInput!): WebAuthnAuthenticationComplete!

  """Verify and save WebAuthn credential"""
  completeWebAuthnRegistration(data: CompleteWebAuthnRegistrationInput!): WebAuthnRegistrationComplete!

  """
  Create a new user account. Normalizes email, hashes password with Argon2id, and sends verification email.
  """
  createAccount(data: CreateAccountInput!): User!

  """
  Authenticate user with email and password. Creates session cookie and tracks login metadata (IP, device, location).
  """
  login(data: LoginInput!): LoginResponse!

  """Destroy current session and clear session cookie."""
  logout: Boolean!

  """
  Complete password reset: validate token, set a new password, consume the token, and send confirmation email.
  """
  newPassword(
    """Payload with the reset token and the new password."""
    data: NewPasswordInput!
  ): Boolean!

  """Regenerate backup codes (requires password)"""
  regenerateBackupCodes(data: RegenerateBackupCodesInput!): BackupCodesRegenerated!

  """Remove 2FA method (requires password confirmation)"""
  remove2FAMethod(data: Remove2FAMethodInput!): TwoFactorSuccess!

  """Remove specific session by ID (cannot remove current session)."""
  removeSession(id: String!): Boolean!

  """Remove a WebAuthn credential"""
  removeWebAuthnCredential(data: RemoveWebAuthnCredentialInput!): TwoFactorSuccess!

  """
  Initiate password reset: generate a one-time token and send a reset link to the user's email. Always returns true to prevent email enumeration.
  """
  resetPassword(
    """Payload with the email address that requests a password reset."""
    data: ResetPasswordInput!
  ): Boolean!

  """Revoke trust for a device"""
  revokeDeviceTrust(deviceId: String!): TwoFactorSuccess!

  """Send OTP verification code"""
  sendOtpCode(data: SendOtpCodeInput): TwoFactorSuccess!

  """Setup OTP method (Email or SMS)"""
  setupOtp(data: SetupOtpInput!): OtpSetup!

  """
  Generate WebAuthn registration options for adding a security key or passkey
  """
  startWebAuthnRegistration(data: StartWebAuthnRegistrationInput): WebAuthnRegistrationOptions!

  """Update 2FA method (name, primary status, etc.)"""
  update2FAMethod(data: Update2FAMethodInput!): TwoFactorSuccess!

  """
  Send a verification email with a one-time token and return delivery/meta info.
  """
  verificationEmail(data: VerificationInput!): VerificationResponse!

  """Verify 2FA code (TOTP/OTP/backup code)"""
  verify2FA(data: Verify2FAInput!): TwoFactorSuccess!

  """Verify backup recovery code"""
  verifyBackupCode(data: VerifyBackupCodeInput!): TwoFactorSuccess!

  """Verify OTP code during setup and receive backup codes"""
  verifyOtpSetup(data: VerifyOtpSetupInput!): TwoFactorSetupComplete!
}

input NewPasswordInput {
  password: String!
  token: String!
}

type OtpSetup {
  """Where codes will be sent"""
  destination: String!

  """Success message"""
  message: String!

  """Method ID"""
  methodId: String!
}

type Query {
  """[Admin] Get comprehensive 2FA status for a user"""
  adminGetUser2FAStatus(userId: String!): User2FAStatus!

  """[Admin] Get security events for a user"""
  adminGetUserSecurityEvents(input: GetUserSecurityEventsInput!): [SecurityEventSummary!]!

  """[Admin] Get all trusted devices for a user"""
  adminGetUserTrustedDevices(userId: String!): [TrustedDeviceSummary!]!

  """Get status of backup codes"""
  backupCodesStatus(methodId: String): BackupCodesStatus!

  """
  Get current session metadata including device, location, and security status.
  """
  currentSession: Session

  """Generate TOTP QR code and secret for setup"""
  generateTotpSetup(data: GenerateTotpSetupInput): TotpSetup!

  """Check if user has 2FA enabled"""
  is2FAEnabled: Boolean!

  """Check if current session is 2FA verified"""
  isSession2FAVerified: Boolean!

  """Get user's 2FA methods"""
  my2FAMethods: TwoFactorMethodsList!

  """Get user's trusted devices"""
  myTrustedDevices: [TwoFactorMethod!]!

  """Get user's registered WebAuthn credentials"""
  myWebAuthnCredentials: [WebAuthnCredential!]!

  """
  Get the currently authenticated user profile. Returns safe projection without sensitive data.
  """
  profile: User!

  """Generate WebAuthn authentication options"""
  startWebAuthnAuthentication(data: StartWebAuthnAuthenticationInput): WebAuthnAuthenticationOptions!

  """
  List all active sessions for current user (sorted by creation time, current session excluded).
  """
  userSessions: [Session!]!
}

input RegenerateBackupCodesInput {
  """Specific method ID (regenerates for all if not specified)"""
  methodId: String

  """Password for confirmation"""
  password: String!
}

input Remove2FAMethodInput {
  """2FA code for additional security"""
  code: String

  """Method ID to remove"""
  methodId: String!

  """Password for confirmation"""
  password: String!
}

"""
Input for removing a registered WebAuthn credential (requires password confirmation)
"""
input RemoveWebAuthnCredentialInput {
  """Credential ID (base64url) or authentication method ID to remove"""
  credentialId: String!

  """
  User password for confirmation (security measure to prevent unauthorized removal)
  """
  password: String!
}

input ResetPasswordInput {
  email: String!
}

input RevokeAllUserDevicesInput {
  """Reason for revoking all devices"""
  reason: String!

  """User ID"""
  userId: String!
}

input RevokeUserDeviceInput {
  """Device ID to revoke"""
  deviceId: String!

  """Reason for revoking device"""
  reason: String!

  """User ID"""
  userId: String!
}

type SecurityEventSummary {
  """City"""
  city: String

  """Country"""
  country: String

  """Event timestamp"""
  createdAt: DateTime!

  """Event type"""
  event: String!

  """Event ID"""
  id: String!

  """IP address"""
  ip: String

  """Resolved status"""
  resolved: Boolean!

  """Severity"""
  severity: String!
}

input SendOtpCodeInput {
  """Method ID to send code to (uses primary if not specified)"""
  methodId: String
}

"""Active user session with security tracking"""
type Session {
  """Session creation timestamp (ISO 8601 string)"""
  createdAt: String!

  """Unique session identifier (used for session management)"""
  id: ID!

  """Whether 2FA has been verified for this session"""
  is2FAVerified: Boolean

  """Whether this session is from a trusted device (reduces 2FA friction)"""
  isTrusted: Boolean

  """Session metadata (location, device, IP)"""
  metadata: SessionMetadata!

  """Risk score for this session (0-100): 0 = safe, 100 = suspicious"""
  riskScore: Float

  """User ID associated with this session"""
  userId: String!

  """Timestamp when 2FA was successfully verified"""
  verified2FAAt: DateTime
}

"""Session metadata including location, device, and network information"""
type SessionMetadata {
  """Device information"""
  device: Device!

  """IP address (IPv4 or IPv6)"""
  ip: String!

  """Geographic location of the session"""
  location: Location!
}

input SetupOtpInput {
  """Email destination (required for OTP_EMAIL)"""
  email: String

  """OTP method: OTP_EMAIL or OTP_SMS"""
  method: E2FAMethod! = OTP_EMAIL

  """Optional display name for the method"""
  name: String

  """Phone in E.164, required for OTP_SMS"""
  phone: String
}

"""Input for initiating WebAuthn authentication challenge"""
input StartWebAuthnAuthenticationInput {
  """
  Specific credential ID to use for authentication (if null, user picks from available credentials)
  """
  credentialId: String

  """
  User email for authentication (required if user is not already logged in)
  """
  email: String
}

"""
Input for initiating WebAuthn credential registration (passkey or security key)
"""
input StartWebAuthnRegistrationInput {
  """
  Authenticator attachment: "platform" (TouchID, FaceID, Windows Hello) or "cross-platform" (YubiKey, external USB key)
  """
  authenticatorAttachment: String

  """
  Custom name for the authenticator (e.g., "YubiKey 5C", "iPhone 15 Pro")
  """
  authenticatorName: String

  """
  Prefer platform authenticators (built-in biometrics) over external keys
  """
  preferPlatform: Boolean = true
}

type TotpSetup {
  """Account name (user email)"""
  accountName: String!

  """Issuer name (app name)"""
  issuer: String!

  """Manual entry key (same as in QR code)"""
  manualEntryKey: String!

  """Method ID (temporary until verified)"""
  methodId: String!

  """QR code as data URL"""
  qrCodeUrl: String!
}

type TrustedDeviceSummary {
  """Browser"""
  browser: String

  """Device identifier"""
  deviceId: String!

  """Device ID"""
  id: String!

  """Is active"""
  isActive: Boolean!

  """Last country"""
  lastCountry: String

  """Last IP"""
  lastIp: String

  """Last seen"""
  lastSeenAt: DateTime!

  """Device name"""
  name: String

  """Operating system"""
  os: String

  """Trust score"""
  trustScore: Float!
}

type TwoFactorMethod {
  """When method was created"""
  createdAt: DateTime!

  """Method ID"""
  id: String!

  """Whether method is active"""
  isActive: Boolean!

  """Whether this is the primary method"""
  isPrimary: Boolean!

  """Last time this method was used"""
  lastUsedAt: DateTime

  """Method type"""
  method: E2FAMethod!

  """User-provided name"""
  name: String

  """Number of times used"""
  useCount: Int!
}

type TwoFactorMethodSummary {
  """Created at"""
  createdAt: DateTime!

  """Method ID"""
  id: String!

  """Is active"""
  isActive: Boolean!

  """Is primary"""
  isPrimary: Boolean!

  """Last used"""
  lastUsedAt: DateTime

  """Method type"""
  method: String!

  """Method name"""
  name: String

  """Use count"""
  useCount: Int!
}

type TwoFactorMethodsList {
  """Whether user has 2FA enabled"""
  is2FAEnabled: Boolean!

  """Available 2FA methods"""
  methods: [TwoFactorMethod!]!

  """Primary method"""
  primary: TwoFactorMethod

  """Total number of active methods"""
  totalActive: Int!
}

type TwoFactorSetupComplete {
  """Backup recovery codes (show only once!)"""
  backupCodes: [String!]!

  """Warning message about backup codes"""
  message: String!

  """Method ID"""
  methodId: String!

  """Success status"""
  success: Boolean!
}

type TwoFactorSuccess {
  """Success message"""
  message: String

  """Success status"""
  success: Boolean!
}

input Update2FAMethodInput {
  """Activate/deactivate method"""
  isActive: Boolean

  """Set as primary method"""
  isPrimary: Boolean

  """Method ID to update"""
  methodId: String!

  """New name for the method"""
  name: String
}

"""User account with profile, security, and authentication settings"""
type User {
  """Avatar image URL (optional)"""
  avatar: String

  """User biography or description (optional)"""
  bio: String

  """Account creation timestamp"""
  createdAt: DateTime!

  """Soft delete timestamp (null if account is active)"""
  deletedAt: DateTime

  """Email address (unique, used for login and notifications)"""
  email: String!

  """Timestamp of last email bounce (for reputation tracking)"""
  emailBouncedAt: DateTime

  """Timestamp when email was verified (null if not verified)"""
  emailVerifiedAt: DateTime

  """First name (optional, parsed from fullName)"""
  firstName: String

  """Full name of the user (displayed in UI)"""
  fullName: String!

  """Unique user identifier (UUID v4)"""
  id: ID!

  """Global 2FA status - true if user has at least one active 2FA method"""
  is2FAEnabled: Boolean!

  """Whether the email address has been verified"""
  isEmailVerified: Boolean!

  """Whether the phone number has been verified"""
  isPhoneVerified: Boolean!

  """Whether user has unsubscribed from email notifications"""
  isUnsubscribed: Boolean

  """Timestamp of last successful login"""
  lastLoginAt: DateTime

  """IP address of last successful login"""
  lastLoginIp: String

  """Last name (optional, parsed from fullName)"""
  lastName: String

  """Timestamp when risk score was last calculated"""
  lastRiskAssessAt: DateTime

  """Timestamp when password was last changed"""
  passwordChangedAt: DateTime

  """Phone number in E.164 format (optional, used for SMS 2FA)"""
  phone: String

  """Timestamp of last SMS delivery failure (for reputation tracking)"""
  phoneBouncedAt: DateTime

  """Timestamp when phone was verified (null if not verified)"""
  phoneVerifiedAt: DateTime

  """User preferred 2FA method used by default during login"""
  preferred2FAMethod: E2FAMethod

  """Whether 2FA is mandatory for this user (admin-enforced for compliance)"""
  require2FA: Boolean!

  """
  User risk score (0-100): 0 = trusted, 100 = high risk. Based on login patterns and behavior.
  """
  riskScore: Float

  """User roles for access control (can have multiple roles)"""
  roles: [EUserRole!]!

  """Account last update timestamp (auto-updated)"""
  updatedAt: DateTime!
}

type User2FAStatus {
  """Number of backup codes remaining"""
  backupCodesRemaining: Int!

  """User email"""
  email: String!

  """Whether 2FA is enabled"""
  is2FAEnabled: Boolean!

  """Active 2FA methods"""
  methods: [TwoFactorMethodSummary!]!

  """Preferred 2FA method"""
  preferred2FAMethod: String

  """Recent security events"""
  recentEvents: [SecurityEventSummary!]!

  """User risk score"""
  riskScore: Float

  """Trusted devices"""
  trustedDevices: [TrustedDeviceSummary!]!

  """User ID"""
  userId: String!
}

input VerificationInput {
  token: String!
}

type VerificationResponse {
  user: User
}

input Verify2FAInput {
  """6-digit code or 8-character backup code"""
  code: String!

  """Specific method ID to verify (uses primary if not specified)"""
  methodId: String

  """Remember this device for future logins"""
  trustDevice: Boolean
}

input VerifyBackupCodeInput {
  """8-character backup code"""
  backupCode: String!

  """Method ID this code is for"""
  methodId: String
}

input VerifyOtpSetupInput {
  """6-digit OTP code"""
  code: String!

  """Method ID from setup"""
  methodId: String!
}

"""Response after successful WebAuthn credential verification"""
type WebAuthnAuthenticationComplete {
  """Name of the authenticator that was used (e.g., "YubiKey 5C")"""
  authenticatorName: String

  """
  Updated signature counter (detects cloned authenticators if counter decreases)
  """
  counter: Int!

  """Credential ID that was used for authentication (base64url encoded)"""
  credentialId: String!

  """Human-readable success message for UI display"""
  message: String!

  """Whether authentication was successful"""
  success: Boolean!
}

"""
WebAuthn authentication options for verifying a passkey or security key
"""
type WebAuthnAuthenticationOptions {
  """
  Unique challenge identifier for this authentication session (used to verify response)
  """
  challengeId: String!

  """Number of registered WebAuthn credentials for this user"""
  credentialCount: Int!

  """
  PublicKeyCredentialRequestOptions as JSON. Pass this to @simplewebauthn/browser startAuthentication() or navigator.credentials.get({ publicKey: options })
  """
  options: JSON!

  """Relying Party ID - must match registration domain"""
  rpId: String!
}

"""Registered WebAuthn credential (security key or passkey)"""
type WebAuthnCredential {
  """Credential registration timestamp"""
  createdAt: DateTime!

  """WebAuthn credential ID (base64url encoded, unique per credential)"""
  credentialId: String!

  """Unique authentication method ID (database primary key)"""
  id: String!

  """
  Whether credential is synced to cloud (iCloud Keychain, Google Password Manager)
  """
  isBackedUp: Boolean!

  """
  Platform authenticator (TouchID, FaceID, Windows Hello) vs cross-platform (YubiKey, USB key)
  """
  isPlatform: Boolean!

  """Timestamp of last successful authentication with this credential"""
  lastUsedAt: DateTime

  """
  User-provided name for this credential (e.g., "Work YubiKey", "Personal iPhone")
  """
  name: String

  """Supported transports (usb, nfc, ble, internal, hybrid)"""
  transports: [String!]!

  """Total number of successful authentications with this credential"""
  useCount: Int!
}

"""Response after successful WebAuthn credential registration"""
type WebAuthnRegistrationComplete {
  """User-provided authenticator name (e.g., "YubiKey 5C", "iPhone 15 Pro")"""
  authenticatorName: String

  """
  Backup recovery codes for emergency access (store securely, shown only once)
  """
  backupCodes: [String!]!

  """WebAuthn credential ID (base64url encoded, used for authentication)"""
  credentialId: String!

  """
  Whether credential is backed up to cloud (iCloud Keychain, Google Password Manager)
  """
  isBackedUp: Boolean!

  """
  Whether this is a platform authenticator (TouchID, FaceID, Windows Hello)
  """
  isPlatform: Boolean!

  """Human-readable success message for UI display"""
  message: String!

  """Unique authentication method ID (stored in database)"""
  methodId: String!

  """Whether registration was successful"""
  success: Boolean!
}

"""
WebAuthn registration options for creating a new passkey or security key
"""
type WebAuthnRegistrationOptions {
  """
  Unique challenge identifier for this registration session (used to verify response)
  """
  challengeId: String!

  """
  PublicKeyCredentialCreationOptions as JSON. Pass this to @simplewebauthn/browser startRegistration() or navigator.credentials.create({ publicKey: options })
  """
  options: JSON!

  """Relying Party ID - domain name (e.g., "medichub.com")"""
  rpId: String!

  """Relying Party name displayed to user (e.g., "MedicHub")"""
  rpName: String!

  """
  User display name shown in authenticator UI (e.g., "John Doe <john@example.com>")
  """
  userDisplayName: String!
}
```

`src/core/prisma/index.ts`

```typescript
export * from './prisma.service'
export * from './prisma.module'
```

`src/core/prisma/prisma.module.ts`

```typescript
@Global()
@Module({
	providers: [PrismaService],
	exports: [PrismaService],
})
export class PrismaModule {}
```

`src/core/prisma/prisma.seed.ts`

```typescript
const prisma = new PrismaClient({
	transactionOptions: {
		maxWait: 5000,
		timeout: 15000,
		isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
	},
})

async function main() {
	try {
		Logger.log('☑️ Seeding database...')

		// Clear existing data for a clean seed
		await prisma.$transaction([prisma.user.deleteMany()])
		Logger.log('🧹 Cleaned existing users')

		// Hash passwords
		const superAdminPassword = await HashUtil.hash('SuperAdmin123!')
		const regularUserPassword = await HashUtil.hash('12345678')

		// Create Super Admin
		const superAdmin = await prisma.user.upsert({
			where: { email: 'maridim.dev@gmail.com' },
			update: {
				roles: [EUserRole.USER, EUserRole.SUPER_ADMIN],
				password: superAdminPassword,
			},
			create: {
				email: 'maridim.dev@gmail.com',
				fullName: 'Super Admin',
				firstName: 'Admin',
				lastName: 'Super',
				password: superAdminPassword,
				isEmailVerified: true,
				roles: [EUserRole.USER, EUserRole.SUPER_ADMIN],
			},
		})

		Logger.log(`✅ Created Super Admin: ${superAdmin.email}`)

		// Create Regular User for testing
		const regularUser = await prisma.user.upsert({
			where: { email: 'user@example.com' },
			update: {
				roles: [EUserRole.USER],
			},
			create: {
				email: 'user@example.com',
				fullName: 'John Doe',
				firstName: 'John',
				lastName: 'Doe',
				password: regularUserPassword,
				isEmailVerified: true,
				roles: [EUserRole.USER],
			},
		})

		Logger.log(`✅ Created Regular User: ${regularUser.email}`)

		// Display credentials
		Logger.log('\n========== Login Credentials ==========')
		Logger.log('👤 Super Admin:')
		Logger.log('   📧 Email: maridim.dev@gmail.com')
		Logger.log('   🔑 Password: SuperAdmin123!')
		Logger.log('   👑 Roles: USER, SUPER_ADMIN')
		Logger.log('')
		Logger.log('👤 Regular User:')
		Logger.log('   📧 Email: user@example.com')
		Logger.log('   🔑 Password: 12345678')
		Logger.log('   👤 Roles: USER')
		Logger.log('=======================================\n')
	} catch (error) {
		Logger.error(error)
		throw new BadRequestException('❌ Error seeding database')
	} finally {
		Logger.log('☑️ Closing database connection...')
		await prisma.$disconnect()
		Logger.log('☑️ Database connection closed successfully')
	}
}

main().catch(e => {
	console.error('❌ Seed failed:', e)
	process.exit(1)
})
```

`src/core/prisma/prisma.service.ts`

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	// Connect with db
	async onModuleInit(): Promise<void> {
		await this.$connect()
	}
	// Disconnect with db
	async onModuleDestroy(): Promise<void> {
		await this.$disconnect()
	}
}
```

`src/core/provider/index.ts`

```typescript
export * from './mail'
export * from './sms'
export * from './provider.module'
```

`src/core/provider/mail/index.ts`

```typescript
export * from './mail.module'
export * from './mail.service'
```

`src/core/provider/mail/mail.module.ts`

```typescript
//Factory for change email service
const emailProviderFactory: Provider = {
	provide: IEmailProvider,
	useFactory: (config: ConfigService, brevo: BrevoService, sendgrid: SendgridService, smtp: SmtpService) => {
		const mailService = config.get<string>('MAIL_USE_SERVICE')?.toLowerCase()
		switch (mailService) {
			case 'brevo':
				return brevo
			case 'sendgrid':
				return sendgrid
			default:
				return smtp
		}
	},
	inject: [ConfigService, BrevoService, SendgridService, SmtpService],
}

@Global()
@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getMailerConfig,
			inject: [ConfigService],
		}),
	],
	providers: [MailService, SmtpService, emailProviderFactory, BrevoService, SendgridService],
	exports: [MailService, emailProviderFactory],
})
export class MailModule {}
```

`src/core/provider/mail/providers/brevo/brevo.service.ts`

```typescript
@Injectable()
export class BrevoService implements IEmailProvider {
	private apiInstance: brevo.TransactionalEmailsApi

	constructor(private readonly configService: ConfigService) {
		this.apiInstance = new brevo.TransactionalEmailsApi()
		this.apiInstance.setApiKey(
			brevo.TransactionalEmailsApiApiKeys.apiKey,
			this.configService.getOrThrow<string>('MAIL_BREVO_API_KEY'),
		)
	}

	/**
	 * Send mail method from Brove
	 * -- need verify email domain gmail don't support
	 * @param email - email address to
	 * @param subject - subject for email
	 * @param html - React, html email template
	 * @returns - send mail
	 */
	async sendMail(email: string, subject: string, html: string) {
		const sendSmtpEmail: brevo.SendSmtpEmail = new brevo.SendSmtpEmail()

		sendSmtpEmail.subject = subject
		sendSmtpEmail.htmlContent = html
		sendSmtpEmail.sender = {
			name: COMPANY_NAME,
			email: this.configService.getOrThrow<string>('MAIL_BREVO_SENDER'),
		}
		sendSmtpEmail.to = [{ email }]

		try {
			const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail)
			return response.body
		} catch (error) {
			console.log('[BREVO_ERROR] - ', error)
			throw new BadRequestException('Ошибка отправки сообщения')
		}
	}
}
```

`src/core/provider/mail/providers/brevo/index.ts`

```typescript
export * from './brevo.service'
```

`src/core/provider/mail/providers/email.provider.interface.ts`

```typescript
export const IEmailProvider = Symbol('IEmailProvider')

export interface IEmailProvider {
	sendMail(email: string, subject: string, html: string): Promise<unknown>
}
```

`src/core/provider/mail/providers/index.ts`

```typescript
export * from './brevo'
export * from './sendgrid'
export * from './email.provider.interface'
export * from './smtp.service'
```

`src/core/provider/mail/providers/sendgrid/index.ts`

```typescript
export * from './sendgrid.service'
```

`src/core/provider/mail/providers/sendgrid/sendgrid.service.ts`

```typescript
@Injectable()
export class SendgridService implements IEmailProvider {
	private sgMail: typeof sgMail

	constructor(
		private readonly config: ConfigService,
		private readonly i18n: I18nService,
	) {
		const apiKey = this.config.getOrThrow<string>('MAIL_SENDGRID_API_KEY')
		if (!apiKey) {
			throw new Error('API key is missing.')
		}
		sgMail.setApiKey(apiKey)
		this.sgMail = sgMail
	}

	/**
	 * Send mail method from Brove
	 * @param email - email address to
	 * @param subject - subject for email
	 * @param html - React, html email template
	 * @param lng - current language of user
	 * @returns - send mail
	 */
	async sendMail(email: string, subject: string, html: string, lng?: string): Promise<boolean> {
		try {
			await this.sgMail.send({
				to: email,
				from: `"${COMPANY_NAME}" <${this.config.getOrThrow<string>('MAIL_SENDGRID_SENDER')}>`,
				subject,
				html,
			})
			return true
		} catch (error) {
			console.log('[SENDGRID_ERROR] - ', error)
			throw new BadRequestException(
				this.i18n.t('mail.errors.message_send_failed', { lng }) || 'Failed to send the message.',
			)
		}
	}
}
```

`src/core/provider/mail/providers/smtp.service.ts`

```typescript
@Injectable()
export class SmtpService implements IEmailProvider {
	constructor(
		private readonly mailer: MailerService,
		private readonly config: ConfigService,
	) {}

	async sendMail(email: string, subject: string, html: string): Promise<unknown> {
		return this.mailer.sendMail({
			from: `"${COMPANY_NAME}" <${this.config.getOrThrow<string>('MAIL_LOGIN')}>`,
			to: email,
			subject,
			html,
		})
	}
}
```

`src/core/provider/mail/templates/2fa-security/2fa-disabled-by-admin.template.tsx`

```tsx
interface IProps {
	supportUrl: string
	settingsUrl: string
	i18n?: I18nService
	lng?: string
	adminEmail: string
	reason: string
	timestamp: string
}

export function TwoFADisabledByAdminTemplate({
	supportUrl,
	settingsUrl,
	i18n,
	lng = 'en',
	adminEmail,
	reason,
	timestamp,
}: IProps) {
	const t = i18n.t('mail.2fa_disabled_by_admin', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	return (
		<TemplateWrapper template="2fa_disabled_by_admin" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center text-purple-600">
						{t('title') || '👤 2FA Disabled by Administrator'}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME }) ||
							`An administrator has disabled two-factor authentication on your ${APP_NAME} account.`}
					</Text>

					<Section className="mb-4 mt-4 rounded-lg bg-purple-50 p-6 text-left">
						<Heading className="text-xl font-semibold text-purple-700">
							{t('action_details.title') || 'Administrative Action Details:'}
						</Heading>
						<ul className="mt-2 list-inside list-disc text-black">
							<li>
								{t('action_details.admin', { admin: adminEmail }) || `👤 Administrator: ${adminEmail}`}
							</li>
							<li>
								{t('action_details.action') || '🔓 Action: Two-Factor Authentication Disabled'}
							</li>
							<li>
								{t('action_details.time', { time: timestamp }) || `⏰ Time: ${timestamp}`}
							</li>
						</ul>
					</Section>

					<Section className="mb-4 rounded-lg bg-blue-50 p-4">
						<Heading className="text-lg font-semibold text-blue-700">
							{t('reason.title') || 'Reason Provided:'}
						</Heading>
						<Text className="mt-2 rounded bg-white p-3 italic text-gray-700">
							"{reason}"
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg bg-orange-50 p-4">
						<Text className="m-0 font-semibold text-orange-700">
							⚠️ {t('security_impact.title') || 'Security Impact'}
						</Text>
						<Text className="mt-2 text-gray-700">
							{t('security_impact.message') ||
								'Your account security has been reduced. We recommend re-enabling 2FA as soon as possible.'}
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg bg-gray-100 p-4">
						<Heading className="text-lg font-semibold text-gray-700">
							{t('questions.title') || 'Have Questions?'}
						</Heading>
						<Text className="mt-2 text-gray-700">
							{t('questions.message') ||
								'If you have questions about this action or believe it was made in error, please contact our support team.'}
						</Text>
					</Section>
				</Section>

				<div className="flex justify-center gap-4">
					<Button
						className="box-border w-fit rounded-lg bg-[#2B7AFF] px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
						href={settingsUrl}
					>
						{t('cta') || 'Re-Enable 2FA'}
					</Button>

					<Button
						className="box-border w-fit rounded-lg bg-gray-600 px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
						href={supportUrl}
					>
						{t('cta_secondary') || 'Contact Support'}
					</Button>
				</div>

				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint') || 'Security settings:'}
					</Text>
					<Link href={settingsUrl} className="w-full text-center text-sm font-sans tracking-[0px]">
						{settingsUrl}
					</Link>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}
```

`src/core/provider/mail/templates/2fa-security/2fa-disabled.template.tsx`

```tsx
interface IProps {
	settingsUrl: string
	i18n?: I18nService
	lng?: string
	timestamp: string
}

export function TwoFADisabledTemplate({ settingsUrl, i18n, lng = 'en', timestamp }: IProps) {
	const t = i18n.t('mail.2fa_disabled', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	return (
		<TemplateWrapper template="2fa_disabled" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center text-red-600">
						{t('title') || '🚨 Two-Factor Authentication Disabled'}
					</Heading>

					<Text className="text-center font-semibold">
						{t('intro', { app: APP_NAME }) ||
							`Two-factor authentication has been completely disabled on your ${APP_NAME} account.`}
					</Text>

					<Section className="mb-4 mt-4 rounded-lg border-2 border-red-500 bg-red-50 p-6">
						<Heading className="text-xl font-bold text-red-700">
							⚠️ {t('critical_warning.title') || 'CRITICAL SECURITY ALERT'}
						</Heading>
						<Text className="mt-2 text-red-900">
							{t('critical_warning.message') ||
								'Your account is now significantly less secure. We strongly recommend re-enabling 2FA immediately.'}
						</Text>
						<ul className="mt-2 list-inside list-disc text-red-800">
							<li>{t('risks')[0] || 'Your account can now be accessed with just a password'}</li>
							<li>{t('risks')[1] || 'Unauthorized access is much easier for attackers'}</li>
							<li>{t('risks')[2] || 'Your data and privacy are at increased risk'}</li>
						</ul>
					</Section>

					<Section className="mb-4 rounded-lg bg-gray-100 p-4">
						<Text className="m-0 text-sm text-gray-600">
							{t('timestamp', { time: timestamp }) || `⏰ Disabled at: ${timestamp}`}
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg bg-yellow-50 p-4">
						<Text className="m-0 font-semibold text-orange-700">
							{t('legalNote')[0] || "If you didn't disable 2FA, your account may be compromised!"}
						</Text>
						<Text className="mt-2 text-gray-700">
							{t('legalNote')[1] || 'Take immediate action: change your password and re-enable 2FA now.'}
						</Text>
					</Section>
				</Section>

				<Button
					className="m-auto box-border w-fit rounded-lg bg-red-600 px-6 py-3 text-center font-sans font-bold tracking-wider text-white"
					href={settingsUrl}
				>
					{t('cta') || 'Re-Enable 2FA Now'}
				</Button>

				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint') || 'Or paste this link into your browser:'}
					</Text>
					<Link href={settingsUrl} className="w-full text-center text-sm font-sans tracking-[0px]">
						{settingsUrl}
					</Link>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}
```

`src/core/provider/mail/templates/2fa-security/2fa-method-added.template.tsx`

```tsx
interface IProps {
	settingsUrl: string
	i18n?: I18nService
	lng?: string
	methodType: E2FAMethod
	methodName?: string
	timestamp: string
}

export function TwoFAMethodAddedTemplate({ settingsUrl, i18n, lng = 'en', methodType, methodName, timestamp }: IProps) {
	const t = i18n.t('mail.2fa_method_added', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	const methodDisplay = methodName || methodType

	return (
		<TemplateWrapper template="2fa_method_added" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center">
						{t('title') || '🔐 New 2FA Method Added'}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME, method: methodDisplay }) ||
							`A new two-factor authentication method (${methodDisplay}) was added to your ${APP_NAME} account.`}
					</Text>

					<Section className="mb-4 mt-4 rounded-lg bg-blue-50 p-6 text-left">
						<Heading className="text-xl font-semibold text-[#2B7AFF]">{t('details.title') || 'Method Details:'}</Heading>
						<ul className="mt-2 list-inside list-disc text-black">
							<li>{t('details.type', { type: methodType }) || `🔑 Type: ${methodType}`}</li>
							{methodName && <li>{t('details.name', { name: methodName }) || `📝 Name: ${methodName}`}</li>}
							<li>{t('details.timestamp', { time: timestamp }) || `⏰ Added: ${timestamp}`}</li>
						</ul>
					</Section>

					<Section className="mb-4 mt-4 rounded-lg bg-yellow-50 p-4">
						<Text className="m-0 font-semibold text-orange-700">
							⚠️ {t('legalNote') || "If you didn't make this change, your account may be compromised."}
						</Text>
						<Text className="mt-2 text-gray-700">
							{t('warning.action') ||
								'Please review your security settings immediately and remove any unauthorized methods.'}
						</Text>
					</Section>
				</Section>

				<Button
					className="m-auto box-border w-fit rounded-lg bg-[#2B7AFF] px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
					href={settingsUrl}
				>
					{t('cta') || 'Manage 2FA Settings'}
				</Button>

				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint') || 'Or paste this link into your browser:'}
					</Text>
					<Link href={settingsUrl} className="w-full text-center text-sm font-sans tracking-[0px]">
						{settingsUrl}
					</Link>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}
```

`src/core/provider/mail/templates/2fa-security/2fa-method-removed.template.tsx`

```tsx
interface IProps {
	settingsUrl: string
	i18n?: I18nService
	lng?: string
	methodType: E2FAMethod
	methodName?: string
	timestamp: string
}

export function TwoFAMethodRemovedTemplate({
	settingsUrl,
	i18n,
	lng = 'en',
	methodType,
	methodName,
	timestamp,
}: IProps) {
	const t = i18n.t('mail.2fa_method_removed', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	const methodDisplay = methodName || methodType

	return (
		<TemplateWrapper template="2fa_method_removed" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center">
						{t('title') || '🔓 2FA Method Removed'}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME, method: methodDisplay }) ||
							`A two-factor authentication method (${methodDisplay}) was removed from your ${APP_NAME} account.`}
					</Text>

					<Section className="mb-4 mt-4 rounded-lg bg-gray-100 p-6 text-left">
						<Heading className="text-xl font-semibold text-[#2B7AFF]">{t('details.title') || 'Removed Method:'}</Heading>
						<ul className="mt-2 list-inside list-disc text-black">
							<li>{t('details.type', { type: methodType }) || `🔑 Type: ${methodType}`}</li>
							{methodName && <li>{t('details.name', { name: methodName }) || `📝 Name: ${methodName}`}</li>}
							<li>{t('details.timestamp', { time: timestamp }) || `⏰ Removed: ${timestamp}`}</li>
						</ul>
					</Section>

					<Section className="mb-4 mt-4 rounded-lg bg-red-50 p-4">
						<Text className="m-0 font-semibold text-red-700">
							⚠️ {t('warning.message') || 'Removing 2FA methods reduces your account security.'}
						</Text>
						<Text className="mt-2 text-gray-700">
							{t('warning.action') ||
								"If you didn't remove this method, please secure your account immediately and add it back."}
						</Text>
					</Section>
				</Section>

				<Button
					className="m-auto box-border w-fit rounded-lg bg-[#2B7AFF] px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
					href={settingsUrl}
				>
					{t('cta') || 'Review Security Settings'}
				</Button>

				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint') || 'Or paste this link into your browser:'}
					</Text>
					<Link href={settingsUrl} className="w-full text-center text-sm font-sans tracking-[0px]">
						{settingsUrl}
					</Link>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}
```

`src/core/provider/mail/templates/2fa-security/backup-codes-regenerated.template.tsx`

```tsx
interface IProps {
	settingsUrl: string
	i18n?: I18nService
	lng?: string
	timestamp: string
}

export function BackupCodesRegeneratedTemplate({ settingsUrl, i18n, lng = 'en', timestamp }: IProps) {
	const t = i18n.t('mail.backup_codes_regenerated', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	return (
		<TemplateWrapper template="backup_codes_regenerated" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center">
						{t('title') || '✅ Backup Codes Regenerated'}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME }) || `Your ${APP_NAME} backup codes have been successfully regenerated.`}
					</Text>

					<Section className="mb-4 mt-4 rounded-lg bg-green-50 p-6 text-center">
						<div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-green-200">
							<Text className="m-0 text-4xl">✅</Text>
						</div>
						<Text className="m-0 text-lg font-semibold text-green-700">
							{t('success_message') || 'New backup codes generated successfully'}
						</Text>
						<Text className="mt-2 text-sm text-gray-600">
							{t('timestamp', { time: timestamp }) || `Generated at: ${timestamp}`}
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg border-2 border-red-500 bg-red-50 p-4">
						<Text className="m-0 font-bold text-red-700">🚨 {t('important.title') || 'IMPORTANT NOTICE'}</Text>
						<Text className="mt-2 text-red-900">
							{t('legalNote') || 'All your previous backup codes are now INVALID and cannot be used.'}
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg bg-blue-50 p-4">
						<Heading className="text-lg font-semibold text-blue-700">
							{t('next_steps.title') || 'Next Steps:'}
						</Heading>
						<ol className="mt-2 list-inside list-decimal text-gray-700">
							<li>{t('next_steps.steps')[0] || 'Log in to your account to view your new codes'}</li>
							<li>{t('next_steps.steps')[1] || 'Download or print them immediately'}</li>
							<li>{t('next_steps.steps')[2] || 'Store them in a secure location (password manager, safe)'}</li>
							<li>{t('next_steps.steps')[3] || 'Never share them with anyone'}</li>
						</ol>
					</Section>

					<Section className="mb-4 rounded-lg bg-yellow-50 p-4">
						<Text className="m-0 font-semibold text-orange-700">
							⚠️ {t('security_reminder.title') || 'Security Reminder'}
						</Text>
						<Text className="mt-2 text-gray-700">
							{t('security_reminder.message') ||
								'Each backup code can only be used once. Once used, it becomes invalid permanently.'}
						</Text>
					</Section>
				</Section>

				<Button
					className="m-auto box-border w-fit rounded-lg bg-[#2B7AFF] px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
					href={settingsUrl}
				>
					{t('cta') || 'View New Backup Codes'}
				</Button>

				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint') || 'Or paste this link into your browser:'}
					</Text>
					<Link href={settingsUrl} className="w-full text-center text-sm font-sans tracking-[0px]">
						{settingsUrl}
					</Link>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}
```

`src/core/provider/mail/templates/2fa-security/device-revoked-by-admin.template.tsx`

```tsx
interface IProps {
	supportUrl: string
	securityUrl: string
	i18n?: I18nService
	lng?: string
	deviceName: string
	adminEmail: string
	reason: string
	timestamp: string
}

export function DeviceRevokedByAdminTemplate({
	supportUrl,
	securityUrl,
	i18n,
	lng = 'en',
	deviceName,
	adminEmail,
	reason,
	timestamp,
}: IProps) {
	const t = i18n.t('mail.device_revoked_by_admin', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	return (
		<TemplateWrapper template="device_revoked_by_admin" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center text-purple-600">
						{t('title') || '🚫 Device Revoked by Administrator'}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME, device: deviceName }) ||
							`An administrator has revoked device "${deviceName}" from your ${APP_NAME} account.`}
					</Text>

					<Section className="mb-4 mt-4 rounded-lg bg-purple-50 p-6 text-left">
						<Heading className="text-xl font-semibold text-purple-700">
							{t('action_details.title') || 'Administrative Action Details:'}
						</Heading>
						<ul className="mt-2 list-inside list-disc text-black">
							<li>
								{t('action_details.admin', { admin: adminEmail }) || `👤 Administrator: ${adminEmail}`}
							</li>
							<li>
								{t('action_details.device', { device: deviceName }) || `📱 Device: ${deviceName}`}
							</li>
							<li>
								{t('action_details.action') || '🚫 Action: Device Revoked'}
							</li>
							<li>
								{t('action_details.time', { time: timestamp }) || `⏰ Time: ${timestamp}`}
							</li>
						</ul>
					</Section>

					<Section className="mb-4 rounded-lg bg-blue-50 p-4">
						<Heading className="text-lg font-semibold text-blue-700">
							{t('reason.title') || 'Reason Provided:'}
						</Heading>
						<Text className="mt-2 rounded bg-white p-3 italic text-gray-700">
							"{reason}"
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg bg-red-50 p-4">
						<Text className="m-0 font-semibold text-red-700">
							⚠️ {t('impact.title') || 'What this means:'}
						</Text>
						<ul className="mt-2 list-inside list-disc text-gray-700">
							<li>{t('impact.items')[0] || 'This device is no longer trusted for your account'}</li>
							<li>{t('impact.items')[1] || 'All active sessions from this device have been terminated'}</li>
							<li>{t('impact.items')[2] || 'You will need to log in again from this device'}</li>
							<li>{t('impact.items')[3] || '2FA verification will be required on next login'}</li>
						</ul>
					</Section>

					<Section className="mb-4 rounded-lg bg-yellow-50 p-4">
						<Text className="m-0 font-semibold text-orange-700">
							💡 {t('next_steps.title') || 'What should you do?'}
						</Text>
						<ul className="mt-2 list-inside list-disc text-gray-700">
							<li>{t('next_steps.items')[0] || 'Review your recent security activity'}</li>
							<li>{t('next_steps.items')[1] || 'Contact support if you believe this was done in error'}</li>
							<li>{t('next_steps.items')[2] || 'Update your security settings if needed'}</li>
						</ul>
					</Section>
				</Section>

				<div className="flex justify-center gap-4">
					<Button
						className="box-border w-fit rounded-lg bg-[#2B7AFF] px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
						href={securityUrl}
					>
						{t('cta') || 'Review Security'}
					</Button>

					<Button
						className="box-border w-fit rounded-lg bg-gray-600 px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
						href={supportUrl}
					>
						{t('cta_secondary') || 'Contact Support'}
					</Button>
				</div>

				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint') || 'Security page:'}
					</Text>
					<Link href={securityUrl} className="w-full text-center text-sm font-sans tracking-[0px]">
						{securityUrl}
					</Link>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}
```

`src/core/provider/mail/templates/2fa-security/index.ts`

```typescript
// 2FA Security Notifications
export * from './2fa-method-added.template'
export * from './2fa-method-removed.template'
export * from './2fa-disabled.template'

// Device & Login
export * from './2fa-disabled.template'
export * from './suspicious-activity.template'

// Backup Codes
export * from './new-device-login.template'
export * from './low-backup-codes.template'
export * from './backup-codes-regenerated.template'

// Admin Actions
export * from './2fa-disabled-by-admin.template'
export * from './backup-codes-regenerated.template'
export * from './device-revoked-by-admin.template'
```

`src/core/provider/mail/templates/2fa-security/low-backup-codes.template.tsx`

```tsx
interface IProps {
	settingsUrl: string
	i18n?: I18nService
	lng?: string
	remaining: number
	threshold: number
}

export function LowBackupCodesTemplate({ settingsUrl, i18n, lng = 'en', remaining, threshold }: IProps) {
	const t = i18n.t('mail.low_backup_codes', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	return (
		<TemplateWrapper template="low_backup_codes" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center text-orange-600">
						{t('title') || '⚠️ Running Low on Backup Codes'}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME, remaining }) ||
							`Your ${APP_NAME} account has only ${remaining} backup codes remaining.`}
					</Text>

					<Section className="mb-4 mt-4 rounded-lg bg-orange-50 p-6 text-center">
						<div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-orange-200">
							<Text className="m-0 text-4xl font-bold text-orange-700">{remaining}</Text>
						</div>
						<Text className="m-0 text-lg font-semibold text-orange-700">
							{t('remaining_label', { count: remaining }) || `${remaining} codes left`}
						</Text>
						<Text className="mt-2 text-sm text-gray-600">
							{t('threshold_info', { threshold }) || `Warning threshold: ${threshold} codes`}
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg bg-blue-50 p-4">
						<Heading className="text-lg font-semibold text-blue-700">
							{t('what_are.title') || 'What are backup codes?'}
						</Heading>
						<Text className="mt-2 text-gray-700">
							{t('what_are.description') ||
								'Backup codes are one-time use codes that allow you to access your account if you lose access to your 2FA device.'}
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg bg-yellow-50 p-4">
						<Text className="m-0 font-semibold text-orange-700">
							⚠️ {t('recommendation.title') || 'Action Required'}
						</Text>
						<Text className="mt-2 text-gray-700">
							{t('recommendation.message') ||
								'We recommend regenerating your backup codes before you run out. Each code can only be used once.'}
						</Text>
						<ul className="mt-2 list-inside list-disc text-gray-700">
							<li>{t('recommendation.steps')[0] || 'Generate new backup codes'}</li>
							<li>{t('recommendation.steps')[1] || 'Save them in a secure location'}</li>
							<li>{t('recommendation.steps')[2] || 'Old codes will be invalidated'}</li>
						</ul>
					</Section>
				</Section>

				<Button
					className="m-auto box-border w-fit rounded-lg bg-orange-600 px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
					href={settingsUrl}
				>
					{t('cta') || 'Regenerate Backup Codes'}
				</Button>

				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint') || 'Or paste this link into your browser:'}
					</Text>
					<Link href={settingsUrl} className="w-full text-center text-sm font-sans tracking-[0px]">
						{settingsUrl}
					</Link>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}
```

`src/core/provider/mail/templates/2fa-security/new-device-login.template.tsx`

```tsx
interface IProps {
	securityUrl: string
	i18n?: I18nService
	lng?: string
	metadata: ISessionMetadataDTO
	timestamp: string
}

export function NewDeviceLoginTemplate({ securityUrl, i18n, lng = 'en', metadata, timestamp }: IProps) {
	const t = i18n.t('mail.new_device_login', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	return (
		<TemplateWrapper template="new_device_login" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center">
						{t('title') || '🔐 New Device Login Detected'}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME }) ||
							`We detected a login to your ${APP_NAME} account from a new device or location.`}
					</Text>

					<Section className="mb-4 mt-4 rounded-lg bg-blue-50 p-6 text-left">
						<Heading className="text-xl font-semibold text-[#2B7AFF]">{t('login_details.title') || 'Login Details:'}</Heading>
						<ul className="mt-2 list-inside list-disc text-black">
							<li>
								{t('login_details.location', {
									country: metadata.location.country,
									city: metadata.location.city,
								}) || `🌍 Location: ${metadata.location.country}, ${metadata.location.city}`}
							</li>
							<li>
								{t('login_details.device', { device: metadata.device.type }) || `📱 Device: ${metadata.device.type}`}
							</li>
							<li>{t('login_details.os', { os: metadata.device.os }) || `💻 OS: ${metadata.device.os}`}</li>
							<li>
								{t('login_details.browser', { browser: metadata.device.browser }) ||
									`🌐 Browser: ${metadata.device.browser}`}
							</li>
							<li>{t('login_details.ip', { ip: metadata.ip }) || `🔢 IP: ${metadata.ip}`}</li>
							<li>{t('login_details.time', { time: timestamp }) || `⏰ Time: ${timestamp}`}</li>
						</ul>
					</Section>

					<Section className="mb-4 rounded-lg bg-green-50 p-4">
						<Text className="m-0 font-semibold text-green-700">
							✅ {t('recognized.title') || 'Was this you?'}
						</Text>
						<Text className="mt-2 text-gray-700">
							{t('recognized.message') || 'If you recognize this activity, no action is needed.'}
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg bg-red-50 p-4">
						<Text className="m-0 font-semibold text-red-700">
							⚠️ {t('unrecognized.title') || "Wasn't you?"}
						</Text>
						<Text className="mt-2 text-gray-700">
							{t('unrecognized.message') ||
								'If you did NOT perform this login, your account may be compromised. Secure it immediately!'}
						</Text>
					</Section>
				</Section>

				<Button
					className="m-auto box-border w-fit rounded-lg bg-[#2B7AFF] px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
					href={securityUrl}
				>
					{t('cta') || 'Review Security Activity'}
				</Button>

				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint') || 'Or paste this link into your browser:'}
					</Text>
					<Link href={securityUrl} className="w-full text-center text-sm font-sans tracking-[0px]">
						{securityUrl}
					</Link>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}
```

`src/core/provider/mail/templates/2fa-security/suspicious-activity.template.tsx`

```tsx
interface IProps {
	securityUrl: string
	lockAccountUrl: string
	i18n?: I18nService
	lng?: string
	eventDescription: string
	riskScore: number
	timestamp: string
}

export function SuspiciousActivityTemplate({
	securityUrl,
	lockAccountUrl,
	i18n,
	lng = 'en',
	eventDescription,
	riskScore,
	timestamp,
}: IProps) {
	const t = i18n.t('mail.suspicious_activity', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	const riskLevel = riskScore >= 80 ? 'CRITICAL' : riskScore >= 60 ? 'HIGH' : 'MEDIUM'
	const riskColor = riskLevel === 'CRITICAL' ? 'red' : riskLevel === 'HIGH' ? 'orange' : 'yellow'

	return (
		<TemplateWrapper template="suspicious_activity" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center text-red-600">
						{t('title') || '🚨 Suspicious Activity Detected'}
					</Heading>

					<Text className="text-center font-semibold">
						{t('intro', { app: APP_NAME }) ||
							`We detected suspicious activity on your ${APP_NAME} account that requires your attention.`}
					</Text>

					<Section className={`mb-4 mt-4 rounded-lg border-2 border-${riskColor}-500 bg-${riskColor}-50 p-6`}>
						<Heading className={`text-xl font-bold text-${riskColor}-700`}>
							⚠️ {t('alert.title', { level: riskLevel }) || `${riskLevel} RISK DETECTED`}
						</Heading>
						<Text className={`mt-2 text-${riskColor}-900`}>
							{eventDescription}
						</Text>
						<div className="mt-4 rounded bg-white p-3">
							<Text className="m-0 text-sm font-semibold text-gray-700">
								{t('risk_score') || 'Risk Score:'}
							</Text>
							<div className="mt-2 h-4 w-full overflow-hidden rounded-full bg-gray-200">
								<div
									className={`h-full bg-${riskColor}-600`}
									style={{ width: `${riskScore}%` }}
								/>
							</div>
							<Text className="mt-1 text-right text-xs text-gray-600">
								{riskScore}/100
							</Text>
						</div>
					</Section>

					<Section className="mb-4 rounded-lg bg-gray-100 p-4">
						<Text className="m-0 text-sm text-gray-600">
							{t('timestamp', { time: timestamp }) || `⏰ Detected at: ${timestamp}`}
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg bg-blue-50 p-4">
						<Heading className="text-lg font-semibold text-blue-700">
							{t('what_to_do.title') || 'What should you do?'}
						</Heading>
						<ol className="mt-2 list-inside list-decimal text-gray-700">
							<li>{t('what_to_do.steps')[0] || 'Review your recent security activity'}</li>
							<li>{t('what_to_do.steps')[1] || 'Change your password if you suspect unauthorized access'}</li>
							<li>{t('what_to_do.steps')[2] || 'Enable 2FA if not already enabled'}</li>
							<li>{t('what_to_do.steps')[3] || 'Lock your account if you did not perform this action'}</li>
						</ol>
					</Section>
				</Section>

				<div className="flex justify-center gap-4">
					<Button
						className="box-border w-fit rounded-lg bg-[#2B7AFF] px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
						href={securityUrl}
					>
						{t('cta') || 'Review Activity'}
					</Button>

					<Button
						className="box-border w-fit rounded-lg bg-red-600 px-6 py-3 text-center font-sans font-bold tracking-wider text-white"
						href={lockAccountUrl}
					>
						{t('cta_secondary') || 'Lock My Account'}
					</Button>
				</div>

				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint') || 'Security review link:'}
					</Text>
					<Link href={securityUrl} className="w-full text-center text-sm font-sans tracking-[0px]">
						{securityUrl}
					</Link>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}
```

`src/core/provider/mail/templates/authentication/index.ts`

```typescript
export * from './otp-code.template'
export * from './password-changed.template'
export * from './password-reset-confirmation.template'
export * from './reset-password.template'
export * from './verification-email.template'
```

`src/core/provider/mail/templates/authentication/otp-code.template.tsx`

```tsx
interface IProps {
  code: string;
  i18n?: I18nService;
  lng?: string;
}

export function OtpCodeTemplate({ code, i18n, lng = 'en' }: IProps) {
  const t = i18n.t('mail.otp_code', { lng });

  return (
    <TemplateWrapper template='otp_code' lng={lng} i18n={i18n}>
      <Tailwind>
        <Section className="font-sans text-center mb-4 px-2">
          <Heading as="h2" className="text-2xl font-bold">
            {t('title') || "Your Verification Code"}
          </Heading>
          <Text className="text-base text-gray-600">
            {t('intro') || "Use the following code to complete your verification. This code is valid for 5 minutes."}
          </Text>
        </Section>
        
        <Section className="text-center my-8">
          <Text className="inline-block bg-gray-100 px-8 py-4 rounded-lg text-4xl font-bold tracking-widest">
            {code}
          </Text>
        </Section>
      </Tailwind>
    </TemplateWrapper>
  );
}
```

`src/core/provider/mail/templates/authentication/password-changed.template.tsx`

```tsx
interface IPasswordChangedProps {
	metadata: ISessionMetadataDTO
	i18n: I18nService
	lng?: string
}

export function PasswordChangedTemplate({ metadata, i18n, lng = 'en' }: IPasswordChangedProps) {
	const t = i18n.t('mail.password_changed', { lng })

	const securityUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/security/activity`
	const supportUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/support`

	const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US', {
		dateStyle: 'long',
		timeStyle: 'short',
	})

	return (
		<TemplateWrapper template="password_changed" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center">
						{t('title') || '🔒 Password Changed Successfully'}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME }) ||
							`This is to let you know that the password for your ${APP_NAME} account was changed successfully.`}
					</Text>
				</Section>

				{/* Security Details */}
				<Section className="mb-4 rounded-lg border border-[#e0e0e0] bg-[#f9f9f9] px-4 py-3">
					<Text className="mb-2 font-semibold text-[#333]">
						{t('details.title') || 'Change Details:'}
					</Text>

					<Text className="m-0 text-sm text-[#555]">
						⏰ <strong>{t('details.timestamp') || 'Time'}:</strong> {timestamp}
					</Text>

					{metadata.ip && (
						<Text className="m-0 text-sm text-[#555]">
							💻 <strong>{t('details.ip') || 'IP Address'}:</strong> {metadata.ip}
						</Text>
					)}

					{metadata.location && (
						<Text className="m-0 text-sm text-[#555]">
							🌍 <strong>{t('details.location') || 'Location'}:</strong>{' '}
							{metadata.location.city}, {metadata.location.country}
						</Text>
					)}

					{metadata.device && (
						<>
							<Text className="m-0 text-sm text-[#555]">
								🌐 <strong>{t('details.browser') || 'Browser'}:</strong> {metadata.device.browser}
							</Text>
							<Text className="m-0 text-sm text-[#555]">
								📱 <strong>{t('details.os') || 'Operating System'}:</strong> {metadata.device.os}
							</Text>
						</>
					)}
				</Section>

				{/* Warning Section */}
				<Section className="mb-4 rounded-lg border-l-4 border-[#ffc107] bg-[#fff3cd] px-4 py-3">
					<Text className="m-0 text-sm font-semibold text-[#856404]">
						⚠️ {t('warning.title') || "Wasn't you?"}
					</Text>
					<Text className="m-0 text-sm text-[#856404]">
						{t('warning.message') ||
							'If you did not make this change, your account may be compromised. Please contact support immediately.'}
					</Text>
				</Section>

				{/* Action Buttons */}
				<Section className="text-center">
					<Button
						className="m-auto box-border w-fit rounded-lg bg-[#007bff] px-6 py-3 text-center font-sans font-normal text-white traking-wider"
						href={securityUrl}
					>
						{t('cta.security') || 'View Security Activity'}
					</Button>
				</Section>

				<Section className="mt-4 text-center">
					<Button
						className="m-auto box-border w-fit rounded-lg bg-[#6c757d] px-6 py-3 text-center font-sans font-normal text-white traking-wider"
						href={supportUrl}
					>
						{t('cta.support') || 'Contact Support'}
					</Button>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}
```

`src/core/provider/mail/templates/authentication/password-reset-confirmation.template.tsx`

```tsx
export interface IPasswordResetConfirmationProps {
    enable2faUrl: string
    securityUrl: string
    timestamp: string
    metadata: ISessionMetadataDTO
	i18n: I18nService
	lng?: string
}

export function PasswordResetConfirmationTemplate({
    enable2faUrl,
    securityUrl,
    timestamp,
	metadata,
	i18n,
	lng = 'en',
}: IPasswordResetConfirmationProps) {
	const t = i18n.t('mail.password_reset_confirmation', { lng })

	

	return (
		<TemplateWrapper template="password_reset_confirmation" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center">
						{t('title', { defaultValue: '✅ Password Reset Successful' })}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME, defaultValue: `Your password reset request has been completed successfully. You can now log in with your new password.` }) }
					</Text>
				</Section>

				{/* Success Banner */}
				<Section className="mb-4 rounded-lg border-l-4 border-[#28a745] bg-[#d4edda] px-4 py-3">
					<Text className="m-0 text-sm font-semibold text-[#155724]">
						✅ {t('success.title', { defaultValue: 'Password Reset Successful' })}
					</Text>
					<Text className="m-0 text-sm text-[#155724]">
						{t('success.message', { defaultValue: 'Your password has been reset and you can now log in with your new password.'}) }
					</Text>
				</Section>

				{/* Reset Details */}
				<Section className="mb-4 rounded-lg border border-[#e0e0e0] bg-[#f9f9f9] px-4 py-3">
					<Text className="mb-2 font-semibold text-[#333]">
						{t('details.title', { defaultValue: '🔍 Password Reset Details' })}
					</Text>

					<Text className="m-0 text-sm text-[#555]">
						⏰ <strong>{t('details.timestamp', { defaultValue: 'Reset Time' })}:</strong> {timestamp}
					</Text>

					{metadata.ip && (
						<Text className="m-0 text-sm text-[#555]">
							💻 <strong>{t('details.ip', { defaultValue: 'IP Address'})}:</strong> {metadata.ip}
						</Text>
					)}

					{metadata.location && (
						<Text className="m-0 text-sm text-[#555]">
							🌍 <strong>{t('details.location', { defaultValue: 'Location'})}:</strong>{' '}
							{metadata.location.city}, {metadata.location.country}
						</Text>
					)}

					{metadata.device && (
						<>
							<Text className="m-0 text-sm text-[#555]">
								🌐 <strong>{t('details.browser', { defaultValue: 'Browser' })}:</strong> {metadata.device.browser}
							</Text>
							<Text className="m-0 text-sm text-[#555]">
								📱 <strong>{t('details.os', { defaultValue: 'Operating System' })}:</strong> {metadata.device.os}
							</Text>
						</>
					)}
				</Section>

				{/* Security Recommendations */}
				<Section className="mb-4 rounded-lg border-l-4 border-[#007bff] bg-[#e7f3ff] px-4 py-3">
					<Text className="mb-2 font-semibold text-[#004085]">
						🔐 {t('recommendations.title', { defaultValue: 'Security Recommendations' })}
					</Text>
					<ul className="m-0 pl-5 text-sm text-[#004085]">
						<li>
							{t('recommendations.enable_2fa', { defaultValue: 'Enable two-factor authentication (2FA) for additional security' })}
						</li>
						<li>
							{t('recommendations.unique_password', { defaultValue: 'Use a unique password that you don\'t use on other websites' })}
						</li>
						<li>
							{t('recommendations.review_activity', { defaultValue: 'Review your recent security activity regularly' })}
						</li>
						<li>{t('recommendations.never_share', { defaultValue: 'Never share your password with anyone' })}</li>
					</ul>
				</Section>

				{/* Action Buttons */}
				<Section className="text-center">
					<Button
						className="m-auto box-border w-fit rounded-lg bg-[#28a745] px-6 py-3 text-center font-sans font-normal text-white traking-wider"
						href={enable2faUrl}
					>
						{t('cta.enable_2fa', { defaultValue: 'Enable 2FA Now' })}
					</Button>
				</Section>

				<Section className="mt-4 text-center">
					<Text className="m-0 text-sm">
						<a href={securityUrl} className="text-[#007bff] no-underline">
							{t('cta.security', { defaultValue: 'View Security Activity' })}
						</a>
					</Text>
				</Section>

				{/* Warning Footer */}
				<Section className="mt-4 px-2">
					<Text className="m-0 text-center text-xs text-[#656565]">
						{t('warning', { defaultValue: "If you did not request this password reset, please contact support immediately." })
}
					</Text>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}
```

`src/core/provider/mail/templates/authentication/reset-password.template.tsx`

```tsx
export interface IResetPasswordProps {
	url: string
	metadata: ISessionMetadataDTO
	i18n: I18nService
	lng?: string
}

export function ResetPasswordTemplate({ url, metadata, i18n, lng = 'en' }: IResetPasswordProps) {
	const t = i18n.t('mail.reset_password', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US', {
		dateStyle: 'long',
		timeStyle: 'short',
	})

	return (
		<TemplateWrapper template="reset_password" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center">
						{t('title', { defaultValue: 'Reset your password' })}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME, defaultValue: `We received a request to reset the password for your ${APP_NAME} account. If this was you, click the button below to choose a new password.`})}
					</Text>
				</Section>

				{/* Main CTA Button */}
				<Section className="text-center">
					<Button
						className="m-auto box-border w-fit rounded-lg bg-[#2B7AFF] px-6 py-3 text-center font-sans font-normal text-white traking-wider"
						href={url}
					>
						{t('cta', { defaultValue: 'Create new password' })}
					</Button>
				</Section>

				{/* Link fallback */}
				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans text-sm font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint', { defaultValue: 'Or paste this link into your browser:' })}
					</Text>
					<Link href={url} className="w-full text-center text-sm font-sans tracking-[0px]">
						{url}
					</Link>
				</Section>

				{/* Request Details */}
				<Section className="mt-6 mb-4 rounded-lg border border-[#e0e0e0] bg-[#f9f9f9] px-4 py-3">
					<Text className="mb-2 font-semibold text-[#333]">
						{t('request_info.title', { defaultValue: 'Request details:' })}
					</Text>

					<Text className="m-0 text-sm text-[#555]">
						⏰ <strong>{t('time', { ip: metadata.ip, defaultValue: `💻 IP address: ${metadata.ip}` })}:</strong> {timestamp}
					</Text>

					{metadata.ip && (
						<Text className="m-0 text-sm text-[#555]">
							{t('request_info.ip', { ip: metadata.ip, defaultValue: `💻 IP address: ${metadata.ip}` }) }
						</Text>
					)}

					{metadata.location && (
						<Text className="m-0 text-sm text-[#555]">
							{t('request_info.location', {
								country: metadata.location.country,
								city: metadata.location.city,
								defaultValue: `🌍 Location: ${metadata.location.city}, ${metadata.location.country}`,
							})}
						</Text>
					)}

					{metadata.device?.browser && (
						<Text className="m-0 text-sm text-[#555]">
							{t('request_info.browser', { browser: metadata.device.browser, defaultValue: `🌐 Browser: ${metadata.device.browser}` })}
						</Text>
					)}

					{metadata.device?.os && (
						<Text className="m-0 text-sm text-[#555]">
							{t('request_info.os', { os: metadata.device.os,  defaultValue: `📱 Operating system: ${metadata.device.os}`})}
						</Text>
					)}
				</Section>

				{/* Warning if user didn't request */}
				<Section className="mb-4 rounded-lg border-l-4 border-[#ffc107] bg-[#fff3cd] px-4 py-3">
					<Text className="m-0 text-sm font-semibold text-[#856404]">
						⚠️ {t('wasnt_you', { defaultValue: 'Wasn’t you?' })}
					</Text>
					<Text className="m-0 text-sm text-[#856404]">
						{t('request_info.note', { defaultValue: "If you didn't initiate this request, please ignore this message." })}
					</Text>
				</Section>

				{/* Token expiry notice */}
				<Section className="mt-4 px-2">
					<Text className="m-0 text-center text-xs text-[#656565]">
						 {t('valid_link', { defaultValue: 'This link is valid for 1 hour.' })}
					</Text>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}
```

`src/core/provider/mail/templates/components/index.ts`

```typescript
export * from './template-wrapper'
```

`src/core/provider/mail/templates/components/template-wrapper.tsx`

```tsx
type TTemplateName =
	| 'verification_email'
	| 'otp_code'
	| '2fa_method_added'
	| '2fa_method_removed'
	| '2fa_disabled'
	| 'new_device_login'
	| 'suspicious_activity'
	| 'low_backup_codes'
	| 'backup_codes_regenerated'
	| '2fa_disabled_by_admin'
	| 'device_revoked_by_admin'
	| 'password_changed'
	| 'reset_password'
	| 'password_reset_confirmation'

export interface IProps {
	template: TTemplateName
	i18n?: I18nService
	lng?: string
}

export function TemplateWrapper({ template, children, i18n, lng = 'en' }: PropsWithChildren<IProps>) {
	const currentYear: number = new Date().getFullYear()
	const t = i18n.t(`mail.${template}`, { lng })
	const tTemp = i18n.t(`mail.template`, { lng })

	return (
		<Html lang={lng}>
			<Preview>{t('preview')}</Preview>
			<Tailwind>
				<Head />
				<Body className="m-auto max-w-[600px] bg-[#efefef] px-3 py-3">
					{/* Логотип */}
					<div className="h-fit space-y-4 rounded-md bg-white px-4 py-6 text-center">
						<Section>
							{/*[if mso]><div style="font-family:Segoe UI, Arial, sans-serif; font-size:20px; font-weight:700; color:#143394">{companyName}</div><![endif]*/}
							<div className="flex h-12 items-center justify-center" role="svg" aria-label={COMPANY_NAME}>
								<Img
									src="https://res.cloudinary.com/dki4lxdki/image/upload/v1759181992/doctorlab/app/logo-full.png"
									width="180"
									height="44"
									alt={COMPANY_NAME}
									style={{ display: 'block', margin: '0 auto', border: '0', outline: 'none', textDecoration: 'none' }}
								/>
							</div>
						</Section>

						{children}
					</div>

					<Section className="px-1 pt-4">
						<Text className="m-0 text-xs text-[#656565]">
							{tTemp('signature')[0] || 'Regards, the'}{' '}
							<span className="font-semibold text-[#143394]">
								{tTemp('signature', { company: COMPANY_NAME })[1] || `${COMPANY_NAME} team`}
							</span>
						</Text>
						<Text className="mt-2 text-xs text-[#656565]">
							{tTemp('supportNote') || 'This is an automated message; please do not reply. Contact support: '}
							<Link href={`mailto:${SUPPORT_EMAIL}`} className="text-[#656565] underline">
								{SUPPORT_EMAIL}
							</Link>
						</Text>
						<Text className="mb-2 font-sans text-xs font-normal leading-[14px] text-[#656565]">
							{t('legalNote', { app: APP_NAME }) ||
								`You're receiving this email because you created a ${APP_NAME} account. If you didn't request this, you can safely ignore this email.`}
						</Text>
					</Section>

					<Section className="px-2 text-center">
						<Text className="mb-4 font-sans text-xs font-normal tracking-wide text-[#656565]">
							{tTemp('copyright', { year: currentYear, company: APP_NAME }) ||
								`© ${currentYear} ${APP_NAME}. All rights reserved.`}
						</Text>
						{/*[if mso]><div style="font-family:Segoe UI, Arial, sans-serif; font-size:20px; font-weight:700; color:#143394">{companyName}</div><![endif]*/}
						<div className="m-auto flex size-12 items-center justify-center" role="img" aria-label={COMPANY_NAME}>
							<Img
								src="https://res.cloudinary.com/dki4lxdki/image/upload/v1759181993/doctorlab/app/logo-mini.png"
								width="44"
								height="44"
								alt={COMPANY_NAME}
								style={{ display: 'block', margin: '0 auto', border: '0', outline: 'none', textDecoration: 'none' }}
							/>
						</div>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	)
}
```

`src/core/provider/mail/templates/index.ts`

```typescript
// Authentication
export * from './authentication'

// 2FA Security Notifications
export * from './2fa-security'
```

`src/core/provider/provider.module.ts`

```typescript
/**
 * Global Communication Module
 *
 * This module bundles all external communication channels, such as email and SMS.
 * By making it global, services like MailService and SmsService are available
 * for dependency injection throughout the application without needing to import
 * this module in feature modules.
 */
@Global()
@Module({
	imports: [MailModule, SmsModule],
	exports: [MailModule, SmsModule], // Export modules to make their services (MailService, SmsService) available
})
export class ProviderModule {}
```

`src/core/provider/sms/index.ts`

```typescript
export * from './sms.module'
export * from './sms.service'
```

`src/core/provider/sms/sms.module.ts`

```typescript
@Global()
@Module({
	providers: [SmsService],
	exports: [SmsService],
})
export class SmsModule {}
```

`src/core/provider/sms/sms.service.ts`

```typescript
interface TwilioError {
	message: string
	code?: number
	status?: number
	moreInfo?: string
	[key: string]: unknown
}

@Injectable()
export class SmsService extends CoreService {
	private readonly logger: Logger = new Logger(SmsService.name)
	private readonly twilioClient: Twilio
	private readonly defaultFrom: string

	constructor(i18n: I18nService, config: ConfigService) {
		super({ i18n, config })

		const accountSid: string = this.config.getOrThrow<string>('TWILIO_SID')
		const authToken: string = this.config.getOrThrow<string>('TWILIO_TOKEN')
		this.defaultFrom = this.config.getOrThrow<string>('TWILIO_PHONE')

		this.twilioClient = twilio(accountSid, authToken)
	}

	/**
	 * Checks if an SMS can and should be sent to a given phone number.
	 */
	async canSendSms(phone: string): Promise<{ canSend: boolean; reason?: string }> {
		// 1. Format validation (E.164)
		if (!isPhoneNumber(phone, undefined)) {
			// Using undefined region to enforce E.164
			return { canSend: false, reason: 'invalid_phone_format' }
		}
		// 2. Internal database check (bounce tracking)
		const userState = await this.prisma.user.findUnique({
			where: { phone },
			select: { phoneBouncedAt: true },
		})
		if (userState?.phoneBouncedAt) {
			return { canSend: false, reason: 'phone_hard_bounced' }
		}
		// 3. (Optional) External lookup via Twilio Lookup API
		try {
			const lookup = await this.twilioClient.lookups.v2.phoneNumbers(phone).fetch()
			if (!lookup.valid || lookup.lineTypeIntelligence?.type === 'voip') {
				return { canSend: false, reason: `invalid_line_type:${lookup.lineTypeIntelligence?.type}` }
			}
		} catch (error) {
			this.logger.error(`Twilio Lookup failed for ${phone}:`, error)
			// Decide if we should proceed or fail on lookup error
		}
		return { canSend: true }
	}

	async sendSMS(to: string, body: string, from?: string): Promise<boolean> {
		await this.ensureCanSend(to)
		try {
			await this.twilioClient.messages.create({ body, to, from: from ?? this.defaultFrom })
			return true
		} catch (error: unknown) {
			this.logError(error)
			// Here we could update user's `phoneBouncedAt` if the error indicates a permanent failure
			return false
		}
	}

	/**
	 * Send verification sms with code
	 * @param to recipient phone address
	 * @param code verification code
	 * @returns boolean true if successful, false if not sent
	 */
	async sendVerificationPhoneSMS(to: string, code: string, lng: Language): Promise<boolean> {
		const message = this.i18n.t('sms.verification.phone', {
			lng,
			defaultValue: `Your verification code: ${code}`,
			args: { code },
		})
		return this.sendSMS(to, message)
	}
	/**
	 * Send verification OTP sms with code
	 * @param to recipient phone address
	 * @param code verification code
	 * @returns boolean true if successful, false if not sent
	 */
	async sendOtpSMS(to: string, code: string, lng: Language): Promise<boolean> {
		const message = this.i18n.t('sms.verification.otp', {
			lng,
			defaultValue: `Your verification code: ${code}`,
			args: { code },
		})
		return this.sendSMS(to, message)
	}

	private async ensureCanSend(phone: string) {
		const check = await this.canSendSms(phone)
		if (!check.canSend) {
			const message = `Skipping SMS to ${phone}. Reason: ${check.reason}`
			this.logger.warn(message)
			throw new BadRequestException(message)
		}
	}

	private isTwilioError(error: unknown): error is TwilioError {
		return (
			typeof error === 'object' &&
			error !== null &&
			'message' in error &&
			typeof (error as TwilioError).message === 'string'
		)
	}

	private logError(error: unknown): void {
		if (this.isTwilioError(error)) {
			const codeInfo: string = error.code ? ` (code: ${error.code})` : ''
			const statusInfo: string = error.status ? ` (status: ${error.status})` : ''

			this.logger.error(`Twilio SMS send failed${codeInfo}${statusInfo}: ${error.message}`)
			this.logger.debug(`Twilio error payload: ${JSON.stringify(error)}`)
		} else if (error instanceof Error) {
			this.logger.error(`Twilio SMS send failed: ${error.message}`)
		} else {
			this.logger.error('Twilio SMS send failed: Unknown error')
		}
	}
}
```

`src/core/redis/index.ts`

```typescript
export * from './redis.service'
export * from './redis.module'
```

`src/core/redis/redis.module.ts`

```typescript
@Global()
@Module({
	providers: [RedisService],
	exports: [RedisService],
})
export class RedisModule {}
```

`src/core/redis/redis.service.ts`

```typescript
/**
 * RedisService provides a robust, type-safe interface for interacting with Redis.
 * It encapsulates the `redis` (v4) client, handles connection management,
 * and offers convenient helper methods for common operations like JSON serialization
 * and working with various data structures.
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
	private client: RedisClientType
	private readonly logger = new Logger(RedisService.name)

	constructor(private readonly config: ConfigService) {
		this.client = createClient({ url: this.config.getOrThrow<string>('REDIS_URL') })
		this.client.on('error', (err: unknown) => {
			logUnknownError(this.logger, 'Redis client error', err, RedisService.name)
		})
		this.client.connect().catch((err: unknown) => {
			logUnknownError(this.logger, 'Redis connect error', err, RedisService.name)
		})
	}

	/**
	 * Gracefully disconnects the Redis client when the module is destroyed.
	 */
	async onModuleDestroy() {
		if (this.client.isOpen) {
			await this.client.disconnect()
		}
	}

	/**
	 * Returns the raw `redis` client instance.
	 * @returns The underlying Redis client instance.
	 */
	getClient(): RedisClientType {
		return this.client
	}

	// ===== BASIC OPERATIONS =====

	/**
	 * Get a string value by key.
	 * @param key - The Redis key.
	 * @returns The string value or null if the key does not exist.
	 */
	async get(key: string): Promise<string | null> {
		const res = await this.client.get(key)
		return typeof res === 'string' ? res : null
	}

	/**
	 * Set a string value by key, with an optional TTL.
	 * @param key - The Redis key.
	 * @param value - The string value to set.
	 * @param ttlSeconds - Optional time-to-live in seconds.
	 */
	async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
		if (ttlSeconds && ttlSeconds > 0) {
			await this.client.set(key, value, { EX: ttlSeconds })
		} else {
			await this.client.set(key, value)
		}
	}

	/**
	 * Delete one or more keys.
	 * @param key - The key or keys to delete.
	 * @returns The number of keys that were removed.
	 */
	async del(key: string | string[]): Promise<number> {
		return this.client.del(key)
	}

	/**
	 * Set a timeout on a key.
	 * @param key - The Redis key.
	 * @param ttlSeconds - The time-to-live in seconds.
	 * @returns `true` if the timeout was set, `false` otherwise.
	 */
	async expire(key: string, ttlSeconds: number): Promise<boolean> {
		const n = await this.client.expire(key, ttlSeconds)
		return n === 1
	}

	/**
	 * Check if a key exists.
	 * @param key - The Redis key.
	 * @returns `true` if the key exists, `false` otherwise.
	 */
	async exists(key: string): Promise<boolean> {
		return (await this.client.exists(key)) > 0
	}

	/**
	 * Get the remaining time to live of a key in seconds.
	 * @param key - The Redis key.
	 * @returns The time to live in seconds, or a negative value if the key does not exist or has no TTL.
	 */
	async ttl(key: string): Promise<number> {
		return this.client.ttl(key)
	}

	/**
	 * Increment the integer value of a key by one.
	 * @param key - The Redis key.
	 * @returns The value of the key after the increment.
	 */
	async incr(key: string): Promise<number> {
		return this.client.incr(key)
	}

	/**
	 * Decrement the integer value of a key by one.
	 * @param key - The Redis key.
	 * @returns The value of the key after the decrement.
	 */
	async decr(key: string): Promise<number> {
		return this.client.decr(key)
	}

	/**
	 * Increment a key and set a TTL on the first increment.
	 * @param key - The Redis key.
	 * @param ttlSeconds - The time-to-live in seconds to set if the key is new.
	 * @returns The value of the key after the increment.
	 */
	async incrWithExpire(key: string, ttlSeconds: number): Promise<number> {
		const value = await this.client.incr(key)
		if (value === 1) {
			// Set TTL without waiting for it to complete (fire-and-forget)
			this.client.expire(key, ttlSeconds).catch(err => {
				this.logger.warn(`Failed to set TTL on new key "${key}" after INCR:`, err)
			})
		}
		return value
	}

	// ===== JSON HELPERS =====

	/**
	 * Serialize an object to JSON and store it in Redis.
	 * @template T - The type of the object.
	 * @param key - The Redis key.
	 * @param value - The object to store.
	 * @param ttlSeconds - Optional time-to-live in seconds.
	 */
	async setJSON<T extends object>(key: string, value: T, ttlSeconds?: number): Promise<void> {
		const raw = JSON.stringify(value)
		await this.set(key, raw, ttlSeconds)
	}

	/**
	 * Retrieve a JSON-serialized object from Redis and parse it.
	 * @template T - The expected type of the object.
	 * @param key - The Redis key.
	 * @returns The parsed object or null if not found or on parse error.
	 */
	async getJSON<T = unknown>(key: string): Promise<T | null> {
		const raw = await this.get(key)
		if (raw == null) return null
		try {
			return JSON.parse(raw) as T
		} catch {
			this.logger.warn(`Failed to parse JSON for key: ${key}`)
			return null
		}
	}

	// ===== KEY ENUMERATION =====

	/**
	 * Find all keys matching the given pattern.
	 * Warning: `KEYS` can be a blocking operation; use `SCAN` in production for large datasets.
	 * @param pattern - The glob-style pattern.
	 * @returns An array of keys matching the pattern.
	 */
	async keys(pattern: string): Promise<string[]> {
		return this.client.keys(pattern)
	}

	/**
	 * Delete all keys matching the given pattern.
	 * @param pattern - The glob-style pattern.
	 * @returns The number of keys that were removed.
	 */
	async delPattern(pattern: string): Promise<number> {
		const keysToDelete = await this.keys(pattern)
		if (keysToDelete.length === 0) return 0
		return this.client.del(keysToDelete)
	}

	// ===== ADVANCED OPERATIONS =====

	/**
	 * Set a value only if the key does not exist.
	 * @param key - The Redis key.
	 * @param value - The string value.
	 * @param ttlSeconds - Optional time-to-live in seconds.
	 * @returns `true` if the key was set, `false` otherwise.
	 */
	async setNX(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
		const result = ttlSeconds
			? await this.client.set(key, value, { NX: true, EX: ttlSeconds })
			: await this.client.set(key, value, { NX: true })
		return result === 'OK'
	}

	/**
	 * Atomically get the value of a key and delete it.
	 * @param key - The Redis key.
	 * @returns The value of the key, or null if the key does not exist.
	 */
	async getdel(key: string): Promise<string | null> {
		const result = await this.client.getDel(key)
		return result === null || typeof result !== 'string' ? null : result
	}

	// ===== SETS & ZSETS =====

	/**
	 * Add one or more members to a set.
	 * @param key - The key of the set.
	 * @param members - A single member or an array of members to add.
	 * @returns The number of elements that were added to the set.
	 */
	async sAdd(key: string, members: string | string[]): Promise<number> {
		return this.client.sAdd(key, members)
	}

	/**
	 * Remove one or more members from a set.
	 * @param key - The key of the set.
	 * @param members - A single member or an array of members to remove.
	 * @returns The number of members that were removed from the set.
	 */
	async sRem(key: string, members: string | string[]): Promise<number> {
		return this.client.sRem(key, members)
	}

	/**
	 * Check if a member exists in a set.
	 * @param key - The key of the set.
	 * @param member - The member to check for.
	 * @returns `true` if the member is an element of the set, `false` otherwise.
	 */
	async sIsMember(key: string, member: string): Promise<boolean> {
		const result = await this.client.sIsMember(key, member)
		return result === 1
	}

	/**
	 * Add an element to a sorted set.
	 * @param key - The key of the sorted set.
	 * @param score - The score of the element.
	 * @param member - The member to add.
	 * @returns The number of elements added to the sorted set.
	 */
	async zAdd(key: string, score: number, member: string): Promise<number> {
		return this.client.zAdd(key, { score, value: member })
	}

	/**
	 * Remove all members in a sorted set within a given range of scores.
	 * @param key - The key of the sorted set.
	 * @param min - The minimum score.
	 * @param max - The maximum score.
	 * @returns The number of elements removed.
	 */
	async zRemRangeByScore(key: string, min: number | string, max: number | string): Promise<number> {
		return this.client.zRemRangeByScore(key, min, max)
	}

	/**
	 * Get the number of members in a sorted set.
	 * @param key - The key of the sorted set.
	 * @returns The cardinality (number of elements) of the sorted set.
	 */
	async zCard(key: string): Promise<number> {
		return this.client.zCard(key)
	}

	/**
	 * Get a range of members from a sorted set.
	 * @param key - The key of the sorted set.
	 * @param min - The starting index.
	 * @param max - The ending index.
	 * @param options - Optional parameters, e.g., { REV: true } for reverse order.
	 * @returns An array of members in the specified range.
	 */
	async zRange(key: string, min: number, max: number, options?: { REV: boolean }): Promise<string[]> {
		return this.client.zRange(key, min, max, options)
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

	// ✅ Security Headers (Helmet) - apply first!
	app.use(helmet(helmetConfig as Readonly<HelmetOptions>))

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

`src/modules/auth/2fa/resolvers/index.ts`

```typescript
export * from './2fa.resolver'
export * from './admin-2fa.resolver'
```

`src/modules/auth/2fa/services/2fa-cron.service.ts`

```typescript
/**
 * Automated maintenance service for 2FA system.
 * Handles cleanup of expired data and enforcement of limits.
 */
@Injectable()
export class TwoFactorCronService {
	private readonly logger = new Logger(TwoFactorCronService.name)

	constructor(
		private readonly backupCodeService: BackupCodeService,
		private readonly deviceTrustService: DeviceTrustService,
		private readonly securityEventService: SecurityEventService,
		private readonly schedulerRegistry: SchedulerRegistry,
	) {
		this.logger.log('🤖 2FA Cron Service initialized')
		this.logScheduledJobs()
	}

	/**
	 * Clean up expired backup codes
	 * Runs daily at 2:00 AM
	 */
	@Cron(process.env.CRON_CLEANUP_BACKUP_CODES || '0 2 * * *', {
		name: 'cleanup-backup-codes',
		timeZone: process.env.TZ || 'UTC',
	})
	async cleanupExpiredBackupCodes(): Promise<void> {
		const startTime = Date.now()
		this.logger.log('🧹 Starting expired backup codes cleanup...')

		try {
			const result = await this.backupCodeService.cleanupExpiredCodes()
			const duration = Date.now() - startTime

			this.logger.log(
				`✅ Backup codes cleanup completed: ${result.deleted} codes removed, ` +
					`${result.affected} users affected (${duration}ms)`,
			)

			// Log metrics for monitoring
			await this.logCronMetrics('cleanup_backup_codes', {
				success: true,
				itemsProcessed: result.deleted,
				usersAffected: result.affected,
				duration,
			})
		} catch (error) {
			const duration = Date.now() - startTime
			this.logger.error(
				`❌ Backup codes cleanup failed after ${duration}ms: ${(error as Error).message}`,
				(error as Error).stack,
			)

			await this.logCronMetrics('cleanup_backup_codes', {
				success: false,
				error: (error as Error).message,
				duration,
			})
		}
	}

	/**
	 * Clean up old and inactive devices
	 * Runs daily at 3:00 AM
	 */
	@Cron(process.env.CRON_CLEANUP_DEVICES || '0 3 * * *', {
		name: 'cleanup-devices',
		timeZone: process.env.TZ || 'UTC',
	})
	async cleanupOldDevices(): Promise<void> {
		const startTime = Date.now()
		this.logger.log('🧹 Starting old devices cleanup...')

		try {
			const result = await this.deviceTrustService.cleanupDevices()
			const duration = Date.now() - startTime

			this.logger.log(
				`✅ Devices cleanup completed: ${result.deleted} devices removed, ` +
					`${result.sessionsInvalidated} sessions invalidated (${duration}ms)`,
			)

			await this.logCronMetrics('cleanup_devices', {
				success: true,
				itemsProcessed: result.deleted,
				sessionsInvalidated: result.sessionsInvalidated,
				duration,
			})
		} catch (error) {
			const duration = Date.now() - startTime
			this.logger.error(
				`❌ Devices cleanup failed after ${duration}ms: ${(error as Error).message}`,
				(error as Error).stack,
			)

			await this.logCronMetrics('cleanup_devices', {
				success: false,
				error: (error as Error).message,
				duration,
			})
		}
	}

	/**
	 * Archive old security events
	 * Runs weekly on Sunday at 4:00 AM
	 */
	@Cron(process.env.CRON_CLEANUP_EVENTS || '0 4 * * 0', {
		name: 'cleanup-security-events',
		timeZone: process.env.TZ || 'UTC',
	})
	async cleanupOldSecurityEvents(): Promise<void> {
		const startTime = Date.now()
		this.logger.log('🧹 Starting old security events cleanup...')

		try {
			const result = await this.securityEventService.archiveOldEvents()
			const duration = Date.now() - startTime

			this.logger.log(
				`✅ Security events cleanup completed: ${result.archived} events archived, ` +
					`${result.deleted} events deleted (${duration}ms)`,
			)

			await this.logCronMetrics('cleanup_security_events', {
				success: true,
				archived: result.archived,
				deleted: result.deleted,
				duration,
			})
		} catch (error) {
			const duration = Date.now() - startTime
			this.logger.error(
				`❌ Security events cleanup failed after ${duration}ms: ${(error as Error).message}`,
				(error as Error).stack,
			)

			await this.logCronMetrics('cleanup_security_events', {
				success: false,
				error: (error as Error).message,
				duration,
			})
		}
	}

	/**
	 * Enforce device limits for all users
	 * Runs every 6 hours
	 */
	@Cron(process.env.CRON_ENFORCE_DEVICE_LIMITS || '0 */6 * * *', {
		name: 'enforce-device-limits',
		timeZone: process.env.TZ || 'UTC',
	})
	async enforceDeviceLimits(): Promise<void> {
		const startTime = Date.now()
		this.logger.log('🔒 Starting device limits enforcement...')

		try {
			const result = await this.deviceTrustService.enforceAllUsersDeviceLimits()
			const duration = Date.now() - startTime

			if (result.devicesRevoked > 0) {
				this.logger.warn(
					`⚠️ Device limits enforced: ${result.devicesRevoked} devices revoked ` +
						`from ${result.usersAffected} users (${duration}ms)`,
				)
			} else {
				this.logger.log(`✅ Device limits check completed: All users within limits (${duration}ms)`)
			}

			await this.logCronMetrics('enforce_device_limits', {
				success: true,
				devicesRevoked: result.devicesRevoked,
				usersAffected: result.usersAffected,
				usersChecked: result.usersChecked,
				duration,
			})
		} catch (error) {
			const duration = Date.now() - startTime
			this.logger.error(
				`❌ Device limits enforcement failed after ${duration}ms: ${(error as Error).message}`,
				(error as Error).stack,
			)

			await this.logCronMetrics('enforce_device_limits', {
				success: false,
				error: (error as Error).message,
				duration,
			})
		}
	}

	/**
	 * Log cron job metrics for monitoring
	 */
	private async logCronMetrics(jobName: string, metrics: Record<string, any>): Promise<void> {
		// In production, you would send these metrics to your monitoring service
		// For now, we'll just log them
		this.logger.debug(`📊 Cron metrics for ${jobName}:`, metrics)

		// Example: Send to monitoring service
		// await this.monitoringService.recordCronExecution(jobName, metrics)
	}

	/**
	 * Log all scheduled jobs on startup
	 */
	private logScheduledJobs(): void {
		const jobs = this.schedulerRegistry.getCronJobs()

		this.logger.log('📅 Scheduled cron jobs:')
		jobs.forEach((job, name) => {
			const nextDate = job.nextDate()
			this.logger.log(`  - ${name}: Next run at ${nextDate.toISO()}`)
		})
	}

	/**
	 * Manually trigger a specific job (for testing/admin purposes)
	 */
	async triggerJob(jobName: string): Promise<void> {
		const job = this.schedulerRegistry.getCronJob(jobName)

		if (!job) {
			throw new Error(`Job ${jobName} not found`)
		}

		this.logger.warn(`⚡ Manually triggering job: ${jobName}`)

		// Fix: Use void operator for fire-and-forget or handle the promise
		void job.fireOnTick()
		// Alternative if fireOnTick returns a promise and you want to wait:
		// await Promise.resolve(job.fireOnTick())
	}

	/**
	 * Get status of all cron jobs
	 */
	getCronJobsStatus(): Array<{ name: string; running: boolean; nextRun: Date | null }> {
		const jobs = this.schedulerRegistry.getCronJobs()
		const status: Array<{ name: string; running: boolean; nextRun: Date | null }> = []

		jobs.forEach((job, name) => {
			try {
				// CronJob from 'cron' package doesn't have 'running' property
				// Check if job has lastDate (it was executed) as proxy for running state
				const lastDate = job.lastDate()
				const nextDate = job.nextDate()

				status.push({
					name,
					running: false, // We can't reliably determine if running
					nextRun: nextDate ? nextDate.toJSDate() : null,
				})
			} catch (error) {
				this.logger.error(`Failed to get status for job ${name}:`, error)
				status.push({
					name,
					running: false,
					nextRun: null,
				})
			}
		})

		return status
	}

	/**
	 * Alternative implementation with better type safety
	 */
	getCronJobsStatusSafe(): Array<{
		name: string
		lastDate: Date | null
		nextDate: Date | null
	}> {
		const jobs = this.schedulerRegistry.getCronJobs()
		const status: Array<{
			name: string
			lastDate: Date | null
			nextDate: Date | null
		}> = []

		jobs.forEach((job, name) => {
			try {
				status.push({
					name,
					lastDate: job.lastDate() || null,
					nextDate: job.nextDate()?.toJSDate() || null,
				})
			} catch (error) {
				this.logger.error(`Failed to get status for job ${name}:`, error)
				status.push({
					name,
					lastDate: null,
					nextDate: null,
				})
			}
		})

		return status
	}
}
```

`src/modules/auth/2fa/services/backup-code.service.ts`

```typescript
/**
 * Backup Code Service
 * Manages generation, validation, and lifecycle of backup codes
 */
@Injectable()
export class BackupCodeService extends CoreService {
	private readonly logger = new Logger(BackupCodeService.name)

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly notificationService: NotificationService,
	) {
		super({ i18n, prisma, redis })
	}

	/**
	 * Generate backup codes for a 2FA method
	 * @param userId User ID
	 * @param methodType 2FA method type
	 * @param authMethodId Optional specific auth method ID
	 * @returns Array of plain text backup codes (show only once!)
	 */
	async generateBackupCodes(userId: string, methodType: E2FAMethod, authMethodId?: string): Promise<string[]> {
		const codes = this.generateCodes()
		const hashedCodes = await Promise.all(codes.map(code => HashUtil.hash(code)))

		const expiresAt = BACKUP_CODE_CONFIG.EXPIRY_DAYS
			? new Date(Date.now() + BACKUP_CODE_CONFIG.EXPIRY_DAYS * 24 * 60 * 60 * 1000)
			: null

		await this.prisma.backupCode.createMany({
			data: hashedCodes.map(hash => ({
				userId,
				authMethodId: authMethodId || null,
				type: methodType,
				code: hash,
				expiresAt,
			})),
		})

		this.logger.log(`Generated ${codes.length} backup codes for user ${userId}, method ${methodType}`)

		return codes
	}

	/**
	 * Generate random backup codes
	 */
	private generateCodes(): string[] {
		const codes: string[] = []
		const format = BACKUP_CODE_CONFIG.FORMAT

		for (let i = 0; i < BACKUP_CODE_CONFIG.COUNT; i++) {
			const code = randomBytes(BACKUP_CODE_CONFIG.BYTES).toString('hex').toUpperCase()

			if (format === 'HEX') {
				codes.push(code)
			} else if (format === 'BASE32') {
				// Convert to base32 if needed
				codes.push(this.toBase32(code))
			} else {
				// Numeric format
				const numeric = parseInt(code, 16).toString().slice(0, 8)
				codes.push(numeric.padStart(8, '0'))
			}
		}

		return codes
	}

	/**
	 * Simple hex to base32 conversion
	 */
	private toBase32(hex: string): string {
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
		let bits = ''
		let result = ''

		for (const char of hex) {
			bits += parseInt(char, 16).toString(2).padStart(4, '0')
		}

		for (let i = 0; i < bits.length; i += 5) {
			const chunk = bits.slice(i, i + 5).padEnd(5, '0')
			result += alphabet[parseInt(chunk, 2)]
		}

		return result.slice(0, 8)
	}

	/**
	 * Verify backup code
	 * @param user User object
	 * @param code Plain text backup code
	 * @param methodType 2FA method type
	 * @param lng Language for error messages
	 * @param ip Optional IP address for auditing
	 * @returns true if valid
	 */
	async verifyBackupCode(
		user: User,
		code: string,
		methodType: E2FAMethod,
		lng: Language,
		ip?: string,
	): Promise<boolean> {
		const normalizedCode = code.replace(/\s/g, '').toUpperCase()

		// Find unused backup codes for this user and method
		const backupCodes = await this.prisma.backupCode.findMany({
			where: {
				userId: user.id,
				type: methodType,
				usedAt: null,
				OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
			},
		})

		if (backupCodes.length === 0) {
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.2fa.no_backup_codes', {
					lng,
					defaultValue: 'No valid backup codes available',
				}),
			)
		}

		// Try to find matching code
		for (const backup of backupCodes) {
			const isMatch = await HashUtil.verify(backup.code, normalizedCode)

			if (isMatch) {
				// Mark as used
				await this.prisma.backupCode.update({
					where: { id: backup.id },
					data: {
						usedAt: new Date(),
						usedIp: ip, // Assuming you pass IP to this method
					},
				})
				this.logger.log(`Backup code used for user ${user.id}, method ${methodType}`)

				// Warn if running low
				const remaining = backupCodes.length - 1
				if (remaining <= BACKUP_CODE_CONFIG.LOW_CODES_THRESHOLD) {
					this.logger.warn(`User ${user.id} has only ${remaining} backup codes remaining`)
					// ✅ NOTIFICATION CALL
					await this.notificationService.notifyLowBackupCodes(user, remaining, lng)
				}

				return true
			}
		}

		throw new UnauthorizedException(
			this.i18n.t('auth.errors.2fa.invalid_backup_code', {
				lng,
				defaultValue: 'Invalid or already used backup code',
			}),
		)
	}

	/**
	 * Get backup codes status
	 */
	async getBackupCodesStatus(userId: string, methodType: E2FAMethod) {
		const total = await this.prisma.backupCode.count({
			where: {
				userId,
				type: methodType,
			},
		})

		const used = await this.prisma.backupCode.count({
			where: {
				userId,
				type: methodType,
				usedAt: { not: null },
			},
		})

		const expired = await this.prisma.backupCode.count({
			where: {
				userId,
				type: methodType,
				expiresAt: { lt: new Date() },
				usedAt: null,
			},
		})

		return {
			total,
			used,
			remaining: total - used - expired,
			expired,
		}
	}

	/**
	 * Regenerate backup codes (delete old, create new)
	 */
	async regenerateBackupCodes(userId: string, methodType: E2FAMethod, authMethodId?: string): Promise<string[]> {
		await this.prisma.backupCode.deleteMany({
			where: {
				userId,
				type: methodType,
				authMethodId: authMethodId || null,
			},
		})

		return this.generateBackupCodes(userId, methodType, authMethodId)
	}

	/**
	 * Delete all backup codes for user/method
	 */
	async deleteBackupCodes(userId: string, methodType: E2FAMethod): Promise<void> {
		await this.prisma.backupCode.deleteMany({
			where: {
				userId,
				type: methodType,
			},
		})

		this.logger.log(`Deleted all backup codes for user ${userId}, method ${methodType}`)
	}

	/**
	 * Cleanup expired backup codes (cron job)
	 * Returns metrics about the cleanup operation
	 */
	async cleanupExpiredCodes(): Promise<{ deleted: number; affected: number }> {
		// First, get count for metrics
		const expiredCodes = await this.prisma.backupCode.findMany({
			where: {
				expiresAt: { lt: new Date() },
				usedAt: null, // Don't delete already used codes for audit trail
			},
			select: {
				userId: true,
			},
		})

		const affectedUserIds = new Set(expiredCodes.map(c => c.userId))

		// Delete expired codes
		const result = await this.prisma.backupCode.deleteMany({
			where: {
				expiresAt: { lt: new Date() },
				usedAt: null,
			},
		})

		this.logger.log(`Cleaned up ${result.count} expired backup codes affecting ${affectedUserIds.size} users`)

		return {
			deleted: result.count,
			affected: affectedUserIds.size,
		}
	}
}
```

`src/modules/auth/2fa/services/device-trust.service.ts`

```typescript
/**
 * Device Trust Service
 * Manages trusted devices and calculates trust scores
 */
@Injectable()
export class DeviceTrustService extends CoreService {
	private readonly logger = new Logger(DeviceTrustService.name)

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly notificationService: NotificationService,
	) {
		super({ i18n, prisma, redis })
	}

	/**
	 * Register or update a device
	 * @param userId User ID
	 * @param session Session metadata
	 * @param fingerprint Optional full fingerprint
	 * @param name Optional user-provided device name
	 * @returns Device ID
	 */
	async registerDevice(
		userId: string,
		session: ISessionMetadataDTO,
		lng: Language,
		fingerprint?: IDeviceFingerprint,
		name?: string,
	): Promise<string> {
		// Generate device ID from fingerprint or session data
		const deviceId = fingerprint
			? FingerprintUtil.generateDeviceId(fingerprint)
			: FingerprintUtil.generateQuickDeviceId(
					`${session.device.browser}:${session.device.os}:${session.device.type}`,
					session.ip,
				)

		// Check if device already exists
		const existing = await this.prisma.trustedDevice.findUnique({
			where: { deviceId },
		})

		if (existing) {
			// Update last seen
			await this.prisma.trustedDevice.update({
				where: { id: existing.id },
				data: {
					lastSeenAt: new Date(),
					lastIp: session.ip,
					lastCountry: session.location.country,
					lastCity: session.location.city,
				},
			})

			return deviceId
		}

		// Create new device
		const expiresAt = addSeconds(new Date(), DEVICE_LIFETIME.DEFAULT_DURATION)

		await this.prisma.trustedDevice.create({
			data: {
				userId,
				deviceId,
				fingerprint: (fingerprint || {}) as Prisma.InputJsonValue,
				name,
				userAgent: `${session.device.browser} on ${session.device.os}`,
				browser: session.device.browser,
				os: session.device.os,
				device: session.device.type,
				trustScore: DEVICE_TRUST.INITIAL_SCORE,
				lastIp: session.ip,
				lastCountry: session.location.country,
				lastCity: session.location.city,
				expiresAt,
			},
		})

		this.logger.log(`Registered new device ${deviceId} for user ${userId}`)

		// ✅ NOTIFICATION CALL (just for new devices)
		const user = await this.prisma.user.findUnique({ where: { id: userId } })
		if (user) {
			await this.notificationService.notifyNewDeviceLogin(user, session, lng)
		}

		return deviceId
	}

	/**
	 * Get device by ID
	 */
	async getDevice(deviceId: string) {
		return this.prisma.trustedDevice.findUnique({
			where: { deviceId },
		})
	}

	/**
	 * Get all devices for user
	 */
	async getUserDevices(userId: string) {
		return this.prisma.trustedDevice.findMany({
			where: {
				userId,
				isActive: true,
				OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
			},
			orderBy: { lastSeenAt: 'desc' },
		})
	}

	/**
	 * Calculate trust score for a device
	 * @param deviceId Device ID
	 * @returns Trust score (0-100)
	 */
	async calculateTrustScore(deviceId: string): Promise<number> {
		const device = await this.getDevice(deviceId)
		if (!device) return 0

		const factors = await this.getTrustFactors(device.userId, deviceId)
		let score: number = DEVICE_TRUST.INITIAL_SCORE

		// Increase score for successful logins
		score += Math.min(factors.successfulLogins * DEVICE_TRUST.SUCCESS_INCREMENT, 40)

		// Decrease for failed attempts
		score -= factors.failedAttempts * DEVICE_TRUST.FAILURE_DECREMENT

		// Bonus for explicitly trusted devices
		if (factors.explicitlyTrusted) {
			score += 20
		}

		// Bonus for long-term devices
		if (factors.daysSinceFirstSeen > 90) {
			score += 15
		} else if (factors.daysSinceFirstSeen > 30) {
			score += 10
		}

		// Bonus for location consistency
		score += factors.locationConsistency * 0.1

		// Apply decay for inactivity
		if (factors.daysSinceFirstSeen > DEVICE_TRUST.DECAY_GRACE_PERIOD) {
			const inactiveDays = factors.daysSinceFirstSeen - DEVICE_TRUST.DECAY_GRACE_PERIOD
			score -= inactiveDays * DEVICE_TRUST.DECAY_PER_DAY
		}

		// Clamp to valid range
		score = Math.max(DEVICE_TRUST.MIN_SCORE, Math.min(DEVICE_TRUST.MAX_SCORE, score))

		// Update in database
		await this.prisma.trustedDevice.update({
			where: { deviceId },
			data: { trustScore: score },
		})

		// Cache in Redis
		await this.rSet(DEVICE_REDIS_KEYS.TRUST_SCORE(device.userId, deviceId), score.toString(), 3600)

		return score
	}

	/**
	 * Get trust factors for score calculation
	 */
	private async getTrustFactors(userId: string, deviceId: string): Promise<IDeviceTrustFactors> {
		const device = await this.getDevice(deviceId)
		if (!device) {
			return {
				successfulLogins: 0,
				failedAttempts: 0,
				daysSinceFirstSeen: 0,
				locationConsistency: 0,
				timePatternConsistency: 0,
				explicitlyTrusted: false,
			}
		}

		// Count successful sessions from this device
		const successfulLogins = await this.prisma.session.count({
			where: {
				userId,
				deviceId,
				revokedAt: null,
			},
		})

		// Count failed login attempts (from audit logs)
		const failedAttempts = await this.prisma.auditLog.count({
			where: {
				userId,
				action: 'LOGIN_FAILED',
				success: false,
				metadata: {
					path: ['deviceId'],
					equals: deviceId,
				},
			},
		})

		const daysSinceFirstSeen = Math.floor((Date.now() - device.createdAt.getTime()) / (1000 * 60 * 60 * 24))

		// Calculate location consistency (same country/city)
		const sessions = await this.prisma.session.findMany({
			where: { userId, deviceId },
			select: { country: true, city: true },
			take: 20,
		})

		const uniqueCountries = new Set(sessions.map(s => s.country)).size
		const locationConsistency = sessions.length > 0 ? (1 - uniqueCountries / sessions.length) * 100 : 0

		return {
			successfulLogins,
			failedAttempts,
			daysSinceFirstSeen,
			locationConsistency,
			timePatternConsistency: 0,
			explicitlyTrusted: device.trustScore >= DEVICE_TRUST.TRUST_THRESHOLD,
		}
	}

	/**
	 * Check if device is trusted
	 */
	async isTrusted(deviceId: string): Promise<boolean> {
		const device = await this.getDevice(deviceId)
		if (!device || !device.isActive) return false
		if (device.expiresAt && device.expiresAt < new Date()) return false
		if (device.revokedAt) return false

		return device.trustScore >= DEVICE_TRUST.TRUST_THRESHOLD
	}

	/**
	 * Mark device as explicitly trusted by user
	 */
	async trustDevice(userId: string, deviceId: string, duration?: number): Promise<void> {
		const expiresAt = duration
			? addSeconds(new Date(), duration)
			: addSeconds(new Date(), DEVICE_LIFETIME.DEFAULT_DURATION)

		await this.prisma.trustedDevice.updateMany({
			where: { userId, deviceId },
			data: {
				trustScore: DEVICE_TRUST.MAX_SCORE,
				expiresAt,
			},
		})

		this.logger.log(`Device ${deviceId} explicitly trusted by user ${userId}`)
	}

	/**
	 * Revoke trust for a device
	 */
	async revokeDevice(userId: string, deviceId: string): Promise<void> {
		await this.prisma.trustedDevice.updateMany({
			where: { userId, deviceId },
			data: {
				isActive: false,
				revokedAt: new Date(),
			},
		})

		// Invalidate all sessions from this device
		await this.prisma.session.updateMany({
			where: { userId, deviceId },
			data: { revokedAt: new Date() },
		})

		this.logger.warn(`Device ${deviceId} revoked for user ${userId}`)
	}

	/**
	 * Get trust level enum from score
	 */
	getTrustLevel(score: number): EDeviceTrustLevel {
		if (score >= 75) return EDeviceTrustLevel.VERIFIED
		if (score >= 50) return EDeviceTrustLevel.TRUSTED
		if (score >= 25) return EDeviceTrustLevel.PARTIAL
		if (score > 0) return EDeviceTrustLevel.RECOGNIZED
		return EDeviceTrustLevel.UNKNOWN
	}

	/**
	 * Cleanup old/expired devices (cron job)
	 * Returns metrics about the cleanup operation
	 */
	async cleanupDevices(): Promise<{ deleted: number; sessionsInvalidated: number }> {
		const cutoffDate = new Date(Date.now() - DEVICE_LIMITS.CLEANUP_AFTER_DAYS * 24 * 60 * 60 * 1000)

		// Get devices to be deleted for metrics
		const devicesToDelete = await this.prisma.trustedDevice.findMany({
			where: {
				OR: [
					{ expiresAt: { lt: new Date() } },
					{ lastSeenAt: { lt: cutoffDate } },
					{
						isActive: false,
						revokedAt: { lt: cutoffDate },
					},
				],
			},
			select: {
				deviceId: true,
				userId: true,
			},
		})

		const deviceIds = devicesToDelete.map(d => d.deviceId)

		// Invalidate sessions from these devices
		const sessionsResult = await this.prisma.session.updateMany({
			where: {
				deviceId: { in: deviceIds },
				revokedAt: null,
			},
			data: {
				revokedAt: new Date(),
			},
		})

		// Delete the devices
		const devicesResult = await this.prisma.trustedDevice.deleteMany({
			where: {
				OR: [
					{ expiresAt: { lt: new Date() } },
					{ lastSeenAt: { lt: cutoffDate } },
					{
						isActive: false,
						revokedAt: { lt: cutoffDate },
					},
				],
			},
		})

		this.logger.log(
			`Cleaned up ${devicesResult.count} old devices and invalidated ${sessionsResult.count} sessions`,
		)

		return {
			deleted: devicesResult.count,
			sessionsInvalidated: sessionsResult.count,
		}
	}

	/**
	 * Enforce device limits per user
	 */
	async enforceDeviceLimits(userId: string): Promise<void> {
		const devices = await this.prisma.trustedDevice.findMany({
			where: { userId, isActive: true },
			orderBy: { lastSeenAt: 'desc' },
		})

		if (devices.length > DEVICE_LIMITS.MAX_TRUSTED_DEVICES) {
			const toRevoke = devices.slice(DEVICE_LIMITS.MAX_TRUSTED_DEVICES)

			for (const device of toRevoke) {
				await this.revokeDevice(userId, device.deviceId)
			}

			this.logger.log(`Revoked ${toRevoke.length} devices for user ${userId} (limit exceeded)`)
		}
	}

	/**
	 * Enforce device limits for all users
	 * Returns metrics about enforcement actions
	 */
	async enforceAllUsersDeviceLimits(): Promise<{
		usersChecked: number
		usersAffected: number
		devicesRevoked: number
	}> {
		// Get all users with their device counts
		const usersWithDevices = await this.prisma.user.findMany({
			where: {
				trustedDevices: {
					some: {
						isActive: true,
					},
				},
			},
			select: {
				id: true,
				email: true,
				trustedDevices: {
					where: { isActive: true },
					orderBy: { lastSeenAt: 'desc' },
					select: {
						id: true,
						deviceId: true,
						lastSeenAt: true,
					},
				},
			},
		})

		let usersAffected = 0
		let totalDevicesRevoked = 0

		for (const user of usersWithDevices) {
			if (user.trustedDevices.length > DEVICE_LIMITS.MAX_TRUSTED_DEVICES) {
				const devicesToRevoke = user.trustedDevices.slice(DEVICE_LIMITS.MAX_TRUSTED_DEVICES)

				for (const device of devicesToRevoke) {
					await this.revokeDevice(user.id, device.deviceId)
					totalDevicesRevoked++
				}

				usersAffected++

				this.logger.warn(
					`User ${user.email} exceeded device limit. Revoked ${devicesToRevoke.length} oldest devices`,
				)
			}
		}

		return {
			usersChecked: usersWithDevices.length,
			usersAffected,
			devicesRevoked: totalDevicesRevoked,
		}
	}
}
```

`src/modules/auth/2fa/services/index.ts`

```typescript
export * from './security-event.service'
export * from './backup-code.service'
export * from './device-trust.service'
export * from './2fa-method.service'
export * from './admin-2fa.service'
export * from './2fa-cron.service'
export * from './webauthn.service'
```

`src/modules/auth/2fa/services/security-event.service.ts`

```typescript
/**
 * Security Event Service
 * Centralized logging and management of security events
 */
@Injectable()
export class SecurityEventService extends CoreService {
	private readonly logger = new Logger(SecurityEventService.name)

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly notificationService: NotificationService,
	) {
		super({ i18n, prisma, redis })
	}

	/**
	 * Log a security event
	 * @param input Event data
	 */
	async logEvent(input: ICreateSecurityEventInput): Promise<void> {
		try {
			await this.prisma.securityEvent.create({
				data: {
					userId: input.userId,
					event: input.event,
					severity: input.severity,
					ip: input.metadata.ip,
					userAgent: input.metadata.userAgent,
					country: input.metadata.country,
					city: input.metadata.city,
					deviceId: input.metadata.deviceId,
					riskScore: input.riskScore,
					riskFactors: input.riskFactors as Prisma.JsonValue,
					metadata: input.metadata as unknown as Prisma.JsonObject,
				},
			})

			// Log to application logger for critical events
			if (input.severity === ESecuritySeverity.CRITICAL || input.severity === ESecuritySeverity.HIGH) {
				this.logger.warn(
					`Security event [${input.severity}]: ${input.event} for user ${input.userId}`,
					input.metadata,
				)
			}

			// Also log to audit log for compliance
			await this.prisma.auditLog.create({
				data: {
					userId: input.userId,
					action: input.event,
					category: EAuditCategory.SECURITY,
					success: input.severity !== ESecuritySeverity.CRITICAL,
					ip: input.metadata.ip,
					userAgent: input.metadata.userAgent,
					country: input.metadata.country,
					city: input.metadata.city,
					metadata: input.metadata as unknown as Prisma.JsonObject,
				},
			})
		} catch (error) {
			this.logger.error(`Failed to log security event: ${(error as Error).message}`, error)
			// Don't throw - logging failure shouldn't break the flow
		}
	}

	/**
	 * Log successful login
	 */
	async logLoginSuccess(userId: string, session: ISessionMetadataDTO, riskScore?: number): Promise<void> {
		await this.logEvent({
			userId,
			event: ESecurityEvent.LOGIN_SUCCESS,
			severity: ESecuritySeverity.LOW,
			metadata: {
				timestamp: new Date().toISOString(),
				ip: session.ip,
				userAgent: `${session.device.browser} on ${session.device.os}`,
				country: session.location.country,
				city: session.location.city,
			},
			riskScore,
		})
	}

	/**
	 * Log failed login attempt
	 */
	async logLoginFailed(userId: string, session: ISessionMetadataDTO, reason: string, riskScore?: number): Promise<void> {
		await this.logEvent({
			userId,
			event: ESecurityEvent.LOGIN_FAILED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: {
				timestamp: new Date().toISOString(),
				ip: session.ip,
				userAgent: `${session.device.browser} on ${session.device.os}`,
				country: session.location.country,
				city: session.location.city,
				reason,
			},
			riskScore,
		})
	}

	/**
	 * Log 2FA verification success
	 */
	async log2FASuccess(userId: string, methodType: string, session: ISessionMetadataDTO): Promise<void> {
		await this.logEvent({
			userId,
			event: ESecurityEvent.TWO_FA_VERIFIED,
			severity: ESecuritySeverity.LOW,
			metadata: {
				timestamp: new Date().toISOString(),
				methodType,
				ip: session.ip,
				userAgent: `${session.device.browser} on ${session.device.os}`,
				country: session.location.country,
				city: session.location.city,
			},
		})
	}

	/**
	 * Log 2FA verification failure
	 */
	async log2FAFailed(userId: string, methodType: string, session: ISessionMetadataDTO, attempts: number): Promise<void> {
		const severity = attempts >= 3 ? ESecuritySeverity.HIGH : ESecuritySeverity.MEDIUM

		await this.logEvent({
			userId,
			event: ESecurityEvent.TWO_FA_FAILED,
			severity,
			metadata: {
				timestamp: new Date().toISOString(),
				methodType,
				attempts,
				ip: session.ip,
				userAgent: `${session.device.browser} on ${session.device.os}`,
				country: session.location.country,
				city: session.location.city,
			},
		})
	}

	/**
	 * Log suspicious activity
	 */
	async logSuspiciousActivity(
		userId: string,
		session: ISessionMetadataDTO,
		reason: string,
		riskScore: number,
		lng: Language,
	): Promise<void> {
		await this.logEvent({
			userId,
			event: ESecurityEvent.SUSPICIOUS_LOGIN,
			severity: ESecuritySeverity.HIGH,
			metadata: {
				timestamp: new Date().toISOString(),
				reason,
				ip: session.ip,
				userAgent: `${session.device.browser} on ${session.device.os}`,
				country: session.location.country,
				city: session.location.city,
			},
			riskScore,
		})

		const user = await this.prisma.user.findUnique({ where: { id: userId } })
		if (user) {
			await this.notificationService.notifySuspiciousActivity(user, reason, riskScore, lng)
		}
	}

	/**
	 * Get security events for user
	 */
	async getEvents(filter: ISecurityEventFilter) {
		const where: Prisma.SecurityEventWhereInput = {}

		if (filter.userId) where.userId = filter.userId
		if (filter.events) where.event = { in: filter.events }
		if (filter.severities) where.severity = { in: filter.severities }
		if (filter.resolved !== undefined) where.resolved = filter.resolved

		if (filter.dateFrom || filter.dateTo) {
			where.createdAt = {}
			if (filter.dateFrom) where.createdAt.gte = filter.dateFrom
			if (filter.dateTo) where.createdAt.lte = filter.dateTo
		}

		return this.prisma.securityEvent.findMany({
			where,
			take: filter.limit || 50,
			skip: filter.offset || 0,
			orderBy: { createdAt: 'desc' },
		})
	}

	/**
	 * Mark event as resolved
	 */
	async resolveEvent(eventId: string, resolvedBy: string): Promise<void> {
		await this.prisma.securityEvent.update({
			where: { id: eventId },
			data: {
				resolved: true,
				resolvedAt: new Date(),
				resolvedBy,
			},
		})
	}

	/**
	 * Get unresolved high-severity events
	 */
	async getUnresolvedCriticalEvents(userId?: string) {
		return this.prisma.securityEvent.findMany({
			where: {
				userId,
				resolved: false,
				severity: { in: [ESecuritySeverity.HIGH, ESecuritySeverity.CRITICAL] },
			},
			orderBy: { createdAt: 'desc' },
			take: 20,
		})
	}

	/**
	 * Archive old security events
	 * Moves old events to archive table or deletes based on retention policy
	 */
	async archiveOldEvents(): Promise<{ archived: number; deleted: number }> {
		const retentionDays = parseInt(process.env.SECURITY_EVENTS_RETENTION_DAYS || '90')
		const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000)

		// For now, we'll just delete old resolved events
		// In production, you might want to move them to an archive table first

		// Delete old resolved events
		const deletedResolved = await this.prisma.securityEvent.deleteMany({
			where: {
				createdAt: { lt: cutoffDate },
				resolved: true,
			},
		})

		// Keep unresolved events for longer (double retention)
		const extendedCutoff = new Date(Date.now() - retentionDays * 2 * 24 * 60 * 60 * 1000)
		const deletedUnresolved = await this.prisma.securityEvent.deleteMany({
			where: {
				createdAt: { lt: extendedCutoff },
				resolved: false,
				severity: { in: [ESecuritySeverity.LOW, ESecuritySeverity.MEDIUM] },
			},
		})

		const totalDeleted = deletedResolved.count + deletedUnresolved.count

		this.logger.log(
			`Archived/deleted ${totalDeleted} old security events ` +
				`(${deletedResolved.count} resolved, ${deletedUnresolved.count} unresolved)`,
		)

		return {
			archived: 0, // Would be used if we implement archiving
			deleted: totalDeleted,
		}
	}
}
```

`src/modules/auth/2fa/types/device.types.ts`

```typescript
/**
 * Device fingerprint components
 * Used to uniquely identify a device
 */
export interface IDeviceFingerprint {
	// Browser fingerprint
	userAgent: string
	language: string
	languages: string[]
	platform: string
	screenResolution: string
	availableScreenResolution: string
	colorDepth: number
	pixelRatio: number
	timezone: string
	timezoneOffset: number

	// Hardware
	hardwareConcurrency: number
	deviceMemory?: number
	maxTouchPoints: number

	// Canvas fingerprint
	canvasFingerprint?: string

	// WebGL fingerprint
	webglVendor?: string
	webglRenderer?: string

	// Audio fingerprint
	audioFingerprint?: string

	// Fonts
	installedFonts?: string[]

	// Plugins
	plugins?: string[]

	// Additional
	doNotTrack?: string
	cookieEnabled: boolean
	localStorage: boolean
	sessionStorage: boolean
	indexedDB: boolean
}

/**
 * Re-export session metadata from shared types
 * This is what we get from getSessionMetadata()
 */
export type { ISessionMetadataDTO }

/**
 * Extended device metadata with fingerprint
 */
export interface IDeviceMetadata extends ISessionMetadataDTO {
	/** Unique device ID generated from fingerprint */
	deviceId: string
	/** Full fingerprint data */
	fingerprint?: IDeviceFingerprint
}

/**
 * Device trust level
 */
export enum EDeviceTrustLevel {
	/** Unknown device, never seen before */
	UNKNOWN = 0,
	/** Seen before but not trusted */
	RECOGNIZED = 25,
	/** Partially trusted, some successful logins */
	PARTIAL = 50,
	/** Trusted device, many successful logins */
	TRUSTED = 75,
	/** Fully trusted, whitelisted device */
	VERIFIED = 100,
}

/**
 * Device trust score factors
 */
export interface IDeviceTrustFactors {
	/** Number of successful authentications */
	successfulLogins: number
	/** Number of failed attempts */
	failedAttempts: number
	/** Days since first seen */
	daysSinceFirstSeen: number
	/** Location consistency */
	locationConsistency: number
	/** Time pattern consistency */
	timePatternConsistency: number
	/** Is device explicitly trusted by user */
	explicitlyTrusted: boolean
}
```

`src/modules/auth/2fa/types/index.ts`

```typescript
export * from './method-data.types'
export * from './device.types'
export * from './risk.types'
export * from './security-event.types'

/**
 * Common response types
 */

export interface ISuccessResponse {
	success: true
	message?: string
}

export interface IErrorResponse {
	success: false
	error: string
	code?: string
}

export type TApiResponse<T = void> = T extends void
	? ISuccessResponse | IErrorResponse
	: (ISuccessResponse & { data: T }) | IErrorResponse

/**
 * Pagination
 */
export interface IPaginationParams {
	page: number
	limit: number
}

export interface IPaginatedResponse<T> {
	data: T[]
	total: number
	page: number
	limit: number
	totalPages: number
}
```

`src/modules/auth/2fa/types/method-data.types.ts`

```typescript
/**
 * Base interface for all 2FA method data
 * All method-specific data extends this
 */
export interface I2FAMethodDataBase {
	/** ISO timestamp of creation */
	createdAt: string
	/** ISO timestamp of last update */
	updatedAt: string
	/** Additional metadata */
	metadata?: Record<string, unknown>
}

/**
 * TOTP method data (Google Authenticator, Authy, etc.)
 */
export interface ITotpMethodData extends I2FAMethodDataBase {
	/** Encrypted TOTP secret (AES-256-GCM) */
	secret: string
	/** Hash algorithm: SHA1, SHA256, SHA512 */
	algorithm: 'SHA1' | 'SHA256' | 'SHA512'
	/** Number of digits in code (6 or 8) */
	digits: 6 | 8
	/** Time step in seconds (usually 30) */
	period: 30 | 60
	/** Issuer name (app name) */
	issuer: string
	/** Account name (usually email) */
	accountName: string
	/** QR code provisioning URI (optional, for re-provisioning) */
	provisioningUri?: string
}

/**
 * OTP Email method data
 */
export interface IOtpEmailMethodData extends I2FAMethodDataBase {
	/** Email address where codes are sent */
	email: string
	/** Timestamp of last code sent */
	lastSentAt?: string
	/** Number of codes sent in current window */
	sentCount: number
	/** Template ID for emails (if using template service) */
	templateId?: string
}

/**
 * OTP SMS method data
 */
export interface IOtpSmsMethodData extends I2FAMethodDataBase {
	/** Phone number in E.164 format */
	phone: string
	/** Timestamp of last code sent */
	lastSentAt?: string
	/** Number of codes sent in current window */
	sentCount: number
	/** SMS provider used (twilio, vonage, etc.) */
	provider?: string
}

/**
 * WebAuthn hardware key data (YubiKey, Titan Key)
 */
export interface IWebAuthnMethodData extends I2FAMethodDataBase {
	/** Public key (base64url encoded) */
	publicKey: string
	/** Signature counter for replay protection */
	counter: number
	/** Credential ID (base64url encoded) */
	credentialId: string
	/** Supported transports: usb, nfc, ble, internal */
	transports: ('usb' | 'nfc' | 'ble' | 'internal')[]
	/** AAGUID (Authenticator Attestation GUID) */
	aaguid?: string
	/** Attestation format (none, packed, fido-u2f, etc.) */
	attestationFormat?: string
	/** Whether authenticator supports user verification */
	userVerified: boolean
	/** Backup eligibility (can be backed up to cloud) */
	backupEligible: boolean
	/** Currently backed up to cloud */
	backedUp: boolean
}

/**
 * Passkey data (TouchID, FaceID, Windows Hello)
 * Similar to WebAuthn but with sync capabilities
 */
export interface IPasskeyMethodData extends I2FAMethodDataBase {
	/** Public key (base64url encoded) */
	publicKey: string
	/** Signature counter for replay protection */
	counter: number
	/** Credential ID (base64url encoded) */
	credentialId: string
	/** Supported transports */
	transports: ('usb' | 'nfc' | 'ble' | 'internal' | 'hybrid')[]
	/** AAGUID */
	aaguid?: string
	/** Whether passkey is synced across devices */
	isSynced: boolean
	/** Platform: ios, android, windows, macos */
	platform?: string
	/** User verification method: fingerprint, face, pin */
	uvMethod?: 'fingerprint' | 'face' | 'pin' | 'pattern'
	/** Backup eligibility */
	backupEligible: boolean
	/** Currently backed up */
	backedUp: boolean
}

/**
 * Backup code method data
 */
export interface IBackupCodeMethodData extends I2FAMethodDataBase {
	/** Total number of codes generated */
	totalCodes: number
	/** Number of codes already used */
	usedCodes: number
	/** Remaining codes */
	remainingCodes: number
	/** Format: HEX, BASE32, NUMERIC */
	format: 'HEX' | 'BASE32' | 'NUMERIC'
	/** Code length */
	codeLength: number
}

/**
 * Discriminated union of all method data types
 * Provides type safety when working with different methods
 */
export type T2FAMethodData =
	| { method: typeof E2FAMethod.TOTP; data: ITotpMethodData }
	| { method: typeof E2FAMethod.OTP_EMAIL; data: IOtpEmailMethodData }
	| { method: typeof E2FAMethod.OTP_SMS; data: IOtpSmsMethodData }
	| { method: typeof E2FAMethod.WEBAUTHN; data: IWebAuthnMethodData }
	| { method: typeof E2FAMethod.PASSKEY; data: IPasskeyMethodData }
	| { method: typeof E2FAMethod.BACKUP_CODE; data: IBackupCodeMethodData }

/**
 * Helper type to extract data type for specific method
 */
export type TMethodDataForType<T extends E2FAMethod> = Extract<T2FAMethodData, { method: T }>['data']

/**
 * Method setup input for API
 */
export interface I2FAMethodSetupInput {
	method: E2FAMethod
	name?: string
	isPrimary?: boolean
	data: Record<string, unknown>
}

/**
 * Method verification input
 */
export interface I2FAMethodVerifyInput {
	methodId: string
	code: string
	trustDevice?: boolean
}
```

`src/modules/auth/2fa/types/risk.types.ts`

```typescript
/**
 * Risk level categories
 */
export enum ERiskLevel {
	/** Very low risk, trusted pattern */
	VERY_LOW = 'VERY_LOW',
	/** Low risk, normal behavior */
	LOW = 'LOW',
	/** Medium risk, some anomalies */
	MEDIUM = 'MEDIUM',
	/** High risk, suspicious activity */
	HIGH = 'HIGH',
	/** Critical risk, likely attack */
	CRITICAL = 'CRITICAL',
}

/**
 * Individual risk factor
 */
export interface IRiskFactor {
	/** Factor name */
	name: string
	/** Risk score contribution (0-100) */
	score: number
	/** Factor weight in final calculation */
	weight: number
	/** Human-readable description */
	description: string
	/** Evidence/details */
	details?: Record<string, unknown>
}

/**
 * Complete risk assessment result
 */
export interface IRiskAssessment {
	/** Overall risk score (0-100) */
	score: number
	/** Risk level category */
	level: ERiskLevel
	/** Individual risk factors */
	factors: IRiskFactor[]
	/** Recommended actions */
	recommendations: string[]
	/** Whether to require 2FA */
	require2FA: boolean
	/** Whether to block access */
	blockAccess: boolean
	/** Assessment timestamp */
	assessedAt: Date
}

/**
 * Anomaly detection result
 */
export interface IAnomaly {
	type: 'location' | 'time' | 'device' | 'behavior' | 'velocity'
	severity: 'low' | 'medium' | 'high' | 'critical'
	description: string
	score: number
	details: Record<string, unknown>
}

/**
 * Re-export session metadata for convenience
 */
export type { ISessionMetadataDTO }
```

`src/modules/auth/2fa/types/security-event.types.ts`

```typescript
/**
 * Base security event metadata
 */
export interface ISecurityEventMetadata {
	timestamp: string
	ip?: string
	userAgent?: string
	country?: string
	city?: string
	deviceId?: string
}

/**
 * Authentication event metadata
 */
export interface IAuthEventMetadata extends ISecurityEventMetadata {
	method?: '2fa' | 'password' | 'session'
	success: boolean
	failureReason?: string
	attempts?: number
}

/**
 * 2FA event metadata
 */
export interface I2FAEventMetadata extends ISecurityEventMetadata {
	methodType: string
	methodId?: string
	success: boolean
	failureReason?: string
	backupCodeUsed?: boolean
}

/**
 * Device event metadata
 */
export interface IDeviceEventMetadata extends ISecurityEventMetadata {
	deviceId: string
	deviceName?: string
	deviceType?: string
	trustScore?: number
	fingerprint?: Record<string, unknown>
}

/**
 * Suspicious activity metadata
 */
export interface ISuspiciousActivityMetadata extends ISecurityEventMetadata {
	reason: string
	anomalies?: Array<{
		type: string
		severity: string
		description: string
	}>
	riskScore: number
	blocked: boolean
}

/**
 * Administrative action metadata
 * Used when admins perform actions on user accounts
 */
export interface IAdminActionMetadata extends ISecurityEventMetadata {
	/** Admin who performed the action */
	adminId: string
	/** Admin's email for quick identification */
	adminEmail?: string
	/** Reason provided by admin */
	reason: string
	/** Target user affected by action */
	targetUserId?: string
	/** Target user's email */
	targetEmail?: string
	/** Additional action-specific fields */
	[key: string]: any
}

/**
 * Union type for all security event metadata types
 */
export type TSecurityEventMetadata =
	| ISecurityEventMetadata
	| IAuthEventMetadata
	| I2FAEventMetadata
	| IDeviceEventMetadata
	| ISuspiciousActivityMetadata
	| IAdminActionMetadata // ✅ Added admin action type

/**
 * Security event creation input
 */
export interface ICreateSecurityEventInput {
	userId: string
	event: ESecurityEvent
	severity: ESecuritySeverity
	metadata: TSecurityEventMetadata
	riskScore?: number
	riskFactors?: Record<string, number>
}

/**
 * Security event filter
 */
export interface ISecurityEventFilter {
	userId?: string
	events?: ESecurityEvent[]
	severities?: ESecuritySeverity[]
	dateFrom?: Date
	dateTo?: Date
	resolved?: boolean
	limit?: number
	offset?: number
}
```

`src/modules/auth/2fa/utils/encryption.util.ts`

```typescript
/**
 * Encryption utility for 2FA sensitive data
 * Uses AES-256-GCM for authenticated encryption
 */
export class EncryptionUtil {
	private static readonly ALGORITHM = 'aes-256-gcm'
	private static readonly IV_LENGTH = 16
	private static readonly AUTH_TAG_LENGTH = 16
	private static readonly KEY_LENGTH = 32

	/**
	 * Get encryption key from environment
	 * @throws Error if key is not configured
	 */
	private static getKey(): Buffer {
		const key = process.env.TWO_FA_ENCRYPTION_KEY

		if (!key) {
			throw new Error('TWO_FA_ENCRYPTION_KEY is not defined in environment')
		}

		// Expect hex-encoded 256-bit key (64 characters)
		if (key.length !== 64) {
			throw new Error('TWO_FA_ENCRYPTION_KEY must be 64 hex characters (256 bits)')
		}

		return Buffer.from(key, 'hex')
	}

	/**
	 * Encrypt plaintext using AES-256-GCM
	 * @param plaintext Data to encrypt
	 * @returns Encrypted string in format: iv:authTag:ciphertext (all hex-encoded)
	 */
	static encrypt(plaintext: string): string {
		try {
			const key = this.getKey()
			const iv = randomBytes(this.IV_LENGTH)

			const cipher = createCipheriv(this.ALGORITHM, key, iv)

			let encrypted = cipher.update(plaintext, 'utf8', 'hex')
			encrypted += cipher.final('hex')

			const authTag = cipher.getAuthTag()

			// Format: iv:authTag:ciphertext
			return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
		} catch (error) {
			throw new Error(`Encryption failed: ${(error as Error).message}`)
		}
	}

	/**
	 * Decrypt ciphertext using AES-256-GCM
	 * @param encryptedData Encrypted string in format iv:authTag:ciphertext
	 * @returns Decrypted plaintext
	 */
	static decrypt(encryptedData: string): string {
		try {
			const key = this.getKey()
			const parts = encryptedData.split(':')

			if (parts.length !== 3) {
				throw new Error('Invalid encrypted data format')
			}

			const [ivHex, authTagHex, ciphertextHex] = parts

			const iv = Buffer.from(ivHex, 'hex')
			const authTag = Buffer.from(authTagHex, 'hex')
			const ciphertext = Buffer.from(ciphertextHex, 'hex')

			const decipher = createDecipheriv(this.ALGORITHM, key, iv)
			decipher.setAuthTag(authTag)

			let decrypted = decipher.update(ciphertext)
			decrypted = Buffer.concat([decrypted, decipher.final()])

			return decrypted.toString('utf8')
		} catch (error) {
			throw new Error(`Decryption failed: ${(error as Error).message}`)
		}
	}

	/**
	 * Encrypt JSON object
	 * @param data Object to encrypt
	 * @returns Encrypted string
	 */
	static encryptJSON<T>(data: T): string {
		return this.encrypt(JSON.stringify(data))
	}

	/**
	 * Decrypt to JSON object
	 * @param encryptedData Encrypted string
	 * @returns Decrypted object
	 */
	static decryptJSON<T>(encryptedData: string): T {
		const decrypted = this.decrypt(encryptedData)
		return JSON.parse(decrypted) as T
	}

	/**
	 * Generate a new encryption key (for initial setup)
	 * @returns Hex-encoded 256-bit key
	 */
	static generateKey(): string {
		return randomBytes(this.KEY_LENGTH).toString('hex')
	}
}
```

`src/modules/auth/2fa/utils/fingerprint.util.ts`

```typescript
/**
 * Device fingerprinting utility
 * Generates unique device identifiers based on browser/system characteristics
 */
export class FingerprintUtil {
	/**
	 * Generate device ID from fingerprint components
	 * Uses SHA-256 hash of normalized fingerprint data
	 * @param fingerprint Device fingerprint data
	 * @returns Hex-encoded device ID (64 characters)
	 */
	static generateDeviceId(fingerprint: IDeviceFingerprint): string {
		const normalized = this.normalizeFingerprint(fingerprint)
		const data = JSON.stringify(normalized)

		return createHash('sha256').update(data).digest('hex')
	}

	/**
	 * Generate device ID from user agent only (quick method)
	 * Less unique but faster, useful for basic device tracking
	 * @param userAgent User-Agent string
	 * @param ip Optional IP address for additional entropy
	 * @returns Hex-encoded device ID
	 */
	static generateQuickDeviceId(userAgent: string, ip?: string): string {
		const data = ip ? `${userAgent}:${ip}` : userAgent

		return createHash('sha256').update(data).digest('hex')
	}

	/**
	 * Normalize fingerprint data for consistent hashing
	 * Sorts keys and removes volatile fields
	 * @param fingerprint Raw fingerprint data
	 * @returns Normalized fingerprint
	 */
	private static normalizeFingerprint(fingerprint: IDeviceFingerprint): Partial<IDeviceFingerprint> {
		// Remove highly volatile fields that change frequently
		const {
			// Remove timezone offset (changes with DST)
			timezoneOffset,
			// Keep stable fields only
			...stable
		} = fingerprint

		// Sort object keys for consistent stringification
		const sorted = Object.keys(stable)
			.sort()
			.reduce(
				(acc, key) => {
					acc[key] = stable[key as keyof typeof stable]
					return acc
				},
				{} as Record<string, unknown>,
			)

		return sorted as Partial<IDeviceFingerprint>
	}

	/**
	 * Calculate similarity between two fingerprints (0-1)
	 * Used to detect if a device has slightly changed (browser update, etc.)
	 * @param fp1 First fingerprint
	 * @param fp2 Second fingerprint
	 * @returns Similarity score (0 = completely different, 1 = identical)
	 */
	static calculateSimilarity(fp1: IDeviceFingerprint, fp2: IDeviceFingerprint): number {
		const keys = new Set([...Object.keys(fp1), ...Object.keys(fp2)])

		let matches = 0
		let total = 0

		for (const key of keys) {
			total++
			const val1 = fp1[key as keyof IDeviceFingerprint]
			const val2 = fp2[key as keyof IDeviceFingerprint]

			if (val1 === val2) {
				matches++
			} else if (typeof val1 === 'string' && typeof val2 === 'string') {
				// Partial match for strings (e.g., browser version change)
				const similarity = this.stringSimilarity(val1, val2)
				matches += similarity
			}
		}

		return total > 0 ? matches / total : 0
	}

	/**
	 * Compare two device metadata objects
	 * Uses session metadata for comparison (browser, OS, device type)
	 * @param device1 First device metadata
	 * @param device2 Second device metadata
	 * @returns Similarity score (0-1)
	 */
	static compareDevices(device1: IDeviceMetadata, device2: IDeviceMetadata): number {
		let score = 0
		let maxScore = 0

		// Compare browser
		maxScore += 30
		if (device1.device.browser === device2.device.browser) {
			score += 30
		}

		// Compare OS
		maxScore += 30
		if (device1.device.os === device2.device.os) {
			score += 30
		}

		// Compare device type
		maxScore += 20
		if (device1.device.type === device2.device.type) {
			score += 20
		}

		// Compare country
		maxScore += 10
		if (device1.location.country === device2.location.country) {
			score += 10
		}

		// Compare city
		maxScore += 10
		if (device1.location.city === device2.location.city) {
			score += 10
		}

		return maxScore > 0 ? score / maxScore : 0
	}

	/**
	 * Calculate similarity between two strings using Levenshtein distance
	 * @param str1 First string
	 * @param str2 Second string
	 * @returns Similarity score (0-1)
	 */
	private static stringSimilarity(str1: string, str2: string): number {
		const longer = str1.length > str2.length ? str1 : str2
		const shorter = str1.length > str2.length ? str2 : str1

		if (longer.length === 0) {
			return 1.0
		}

		const editDistance = this.levenshteinDistance(longer, shorter)
		return (longer.length - editDistance) / longer.length
	}

	/**
	 * Levenshtein distance algorithm
	 * @param str1 First string
	 * @param str2 Second string
	 * @returns Edit distance
	 */
	private static levenshteinDistance(str1: string, str2: string): number {
		const matrix: number[][] = []

		for (let i = 0; i <= str2.length; i++) {
			matrix[i] = [i]
		}

		for (let j = 0; j <= str1.length; j++) {
			matrix[0][j] = j
		}

		for (let i = 1; i <= str2.length; i++) {
			for (let j = 1; j <= str1.length; j++) {
				if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
					matrix[i][j] = matrix[i - 1][j - 1]
				} else {
					matrix[i][j] = Math.min(
						matrix[i - 1][j - 1] + 1, // substitution
						matrix[i][j - 1] + 1, // insertion
						matrix[i - 1][j] + 1, // deletion
					)
				}
			}
		}

		return matrix[str2.length][str1.length]
	}

	/**
	 * Validate fingerprint has minimum required components
	 * @param fingerprint Fingerprint to validate
	 * @returns Whether fingerprint is valid
	 */
	static isValidFingerprint(fingerprint: IDeviceFingerprint): boolean {
		const requiredFields: (keyof IDeviceFingerprint)[] = ['userAgent', 'platform', 'screenResolution', 'timezone']

		return requiredFields.every(
			field => fingerprint[field] !== undefined && fingerprint[field] !== null && fingerprint[field] !== '',
		)
	}

	/**
	 * Create minimal fingerprint from user agent only
	 * Useful when full fingerprint is not available
	 * @param userAgent User-Agent string
	 * @returns Minimal fingerprint object
	 */
	static createMinimalFingerprint(userAgent: string): Partial<IDeviceFingerprint> {
		return {
			userAgent,
			platform: 'unknown',
			language: 'unknown',
			languages: [],
			screenResolution: 'unknown',
			availableScreenResolution: 'unknown',
			colorDepth: 0,
			pixelRatio: 1,
			timezone: 'unknown',
			timezoneOffset: 0,
			hardwareConcurrency: 0,
			maxTouchPoints: 0,
			cookieEnabled: true,
			localStorage: true,
			sessionStorage: true,
			indexedDB: true,
		}
	}
}
```

`src/modules/auth/2fa/utils/index.ts`

```typescript
export * from './encryption.util'
export * from './fingerprint.util'
export * from './risk-calculator.util'
```

`src/modules/auth/2fa/utils/risk-calculator.util.ts`

```typescript
/**
 * Risk context for assessment
 * Extended version of ISessionMetadata with additional context
 */
export interface IRiskContext {
	// Current session
	session: ISessionMetadataDTO

	// User context
	userId: string
	userRiskScore?: number
	accountAge: number // days

	// Device context
	isNewDevice: boolean
	deviceTrustScore: number
	failedAttemptsRecent: number

	// Historical data
	previousLocations: Array<{
		country: string
		city: string
		latitude: number
		longitude: number
		timestamp: Date
	}>

	// Time context
	loginTime: Date
	userTimezone?: string

	// Behavioral patterns (optional)
	typicalLoginHours?: number[]
	typicalLoginDays?: number[]
}

/**
 * Risk assessment and scoring utility
 * Calculates risk scores based on multiple factors
 */
export class RiskCalculatorUtil {
	/**
	 * Perform complete risk assessment
	 * @param context Assessment context
	 * @returns Complete risk assessment with score, level, and recommendations
	 */
	static assess(context: IRiskContext): IRiskAssessment {
		const factors = this.calculateFactors(context)
		const score = this.calculateScore(factors)
		const level = this.getRiskLevel(score)
		const anomalies = this.detectAnomalies(context)
		const recommendations = this.generateRecommendations(level, anomalies)

		return {
			score,
			level,
			factors,
			recommendations,
			require2FA: score >= RISK_THRESHOLDS[ERiskLevel.MEDIUM].min,
			blockAccess: level === ERiskLevel.CRITICAL,
			assessedAt: new Date(),
		}
	}

	/**
	 * Calculate individual risk factors
	 * @param context Assessment context
	 * @returns Array of risk factors
	 */
	private static calculateFactors(context: IRiskContext): IRiskFactor[] {
		const factors: IRiskFactor[] = []

		// Location-based risks
		factors.push(...this.assessLocationRisk(context))

		// Device-based risks
		factors.push(...this.assessDeviceRisk(context))

		// Behavioral risks
		factors.push(...this.assessBehavioralRisk(context))

		// Account age risks
		factors.push(...this.assessAccountRisk(context))

		// Authentication history risks
		factors.push(...this.assessAuthenticationRisk(context))

		return factors.filter(f => f.score > 0)
	}

	/**
	 * Assess location-based risks
	 */
	private static assessLocationRisk(context: IRiskContext): IRiskFactor[] {
		const factors: IRiskFactor[] = []
		const currentCountry = context.session.location.country

		// Check high-risk country
		if (
			HIGH_RISK_INDICATORS.HIGH_RISK_COUNTRIES.includes(
				currentCountry as (typeof HIGH_RISK_INDICATORS.HIGH_RISK_COUNTRIES)[number],
			)
		) {
			factors.push({
				name: 'high_risk_country',
				score: RISK_WEIGHTS.HIGH_RISK_COUNTRY,
				weight: 1.0,
				description: 'Login from high-risk country',
				details: { country: currentCountry },
			})
		}

		// Check new country
		const isNewCountry = !context.previousLocations.some(loc => loc.country === currentCountry)
		if (isNewCountry && context.previousLocations.length > 0) {
			factors.push({
				name: 'new_country',
				score: RISK_WEIGHTS.NEW_COUNTRY,
				weight: 0.8,
				description: 'First login from this country',
				details: { country: currentCountry },
			})
		}

		// Check new city
		const currentCity = context.session.location.city
		const isNewCity = !context.previousLocations.some(loc => loc.city === currentCity)
		if (isNewCity && context.previousLocations.length > 0 && !isNewCountry) {
			factors.push({
				name: 'new_city',
				score: RISK_WEIGHTS.NEW_CITY,
				weight: 0.6,
				description: 'First login from this city',
				details: { city: currentCity },
			})
		}

		// Check impossible travel
		const impossibleTravel = this.detectImpossibleTravel(context)
		if (impossibleTravel) {
			factors.push({
				name: 'impossible_travel',
				score: RISK_WEIGHTS.IMPOSSIBLE_TRAVEL,
				weight: 1.2,
				description: 'Impossible travel detected',
				details: impossibleTravel,
			})
		}

		return factors
	}

	/**
	 * Detect impossible travel (too fast between locations)
	 */
	private static detectImpossibleTravel(context: IRiskContext): Record<string, unknown> | null {
		if (context.previousLocations.length === 0) return null

		const lastLocation = context.previousLocations[0]

		// Note: Using latitude/longitude from ISessionMetadata (with typo)
		const currentLat: number = context.session.location.latitude
		const currentLon: number = context.session.location.longitude

		if (!lastLocation.latitude || !lastLocation.longitude || !currentLat || !currentLon) {
			return null
		}

		const distance = this.calculateDistance(lastLocation.latitude, lastLocation.longitude, currentLat, currentLon)

		const timeDiff = differenceInHours(context.loginTime, lastLocation.timestamp)

		if (timeDiff <= 0) return null

		const speed = distance / timeDiff

		if (speed > VELOCITY_CONFIG.MAX_TRAVEL_SPEED_KMH) {
			return {
				distance,
				timeDiff,
				speed,
				maxSpeed: VELOCITY_CONFIG.MAX_TRAVEL_SPEED_KMH,
				from: `${lastLocation.city}, ${lastLocation.country}`,
				to: `${context.session.location.city}, ${context.session.location.country}`,
			}
		}

		return null
	}

	/**
	 * Calculate distance between two coordinates using Haversine formula
	 * @returns Distance in kilometers
	 */
	private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
		const R = 6371 // Earth's radius in km
		const dLat = this.toRad(lat2 - lat1)
		const dLon = this.toRad(lon2 - lon1)

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
		return R * c
	}

	private static toRad(degrees: number): number {
		return degrees * (Math.PI / 180)
	}

	/**
	 * Assess device-based risks
	 */
	private static assessDeviceRisk(context: IRiskContext): IRiskFactor[] {
		const factors: IRiskFactor[] = []

		// New device
		if (context.isNewDevice) {
			factors.push({
				name: 'new_device',
				score: RISK_WEIGHTS.NEW_DEVICE,
				weight: 0.9,
				description: 'First login from this device',
			})
		}

		// Untrusted device
		if (context.deviceTrustScore < 50) {
			factors.push({
				name: 'untrusted_device',
				score: RISK_WEIGHTS.UNTRUSTED_DEVICE,
				weight: 1.0,
				description: 'Device has low trust score',
				details: { trustScore: context.deviceTrustScore },
			})
		}

		return factors
	}

	/**
	 * Assess behavioral risks
	 */
	private static assessBehavioralRisk(context: IRiskContext): IRiskFactor[] {
		const factors: IRiskFactor[] = []

		// Check suspicious user agent
		// Note: device.browser and device.os come from device-detector-js
		const deviceInfo = `${context.session.device.browser} ${context.session.device.os}`.toLowerCase()
		const isSuspicious = HIGH_RISK_INDICATORS.SUSPICIOUS_UA_PATTERNS.some(pattern => pattern.test(deviceInfo))
		if (isSuspicious) {
			factors.push({
				name: 'suspicious_user_agent',
				score: RISK_WEIGHTS.SUSPICIOUS_USER_AGENT,
				weight: 1.1,
				description: 'Suspicious user agent detected',
				details: {
					browser: context.session.device.browser,
					os: context.session.device.os,
				},
			})
		}

		// Check unusual time
		if (context.typicalLoginHours) {
			const hour = context.loginTime.getHours()
			if (!context.typicalLoginHours.includes(hour)) {
				factors.push({
					name: 'unusual_time',
					score: RISK_WEIGHTS.UNUSUAL_TIME,
					weight: 0.5,
					description: 'Login at unusual time',
					details: { hour, typical: context.typicalLoginHours },
				})
			}
		}

		// Check unusual day
		if (context.typicalLoginDays) {
			const day = context.loginTime.getDay()
			if (!context.typicalLoginDays.includes(day)) {
				factors.push({
					name: 'unusual_day',
					score: RISK_WEIGHTS.UNUSUAL_DAY,
					weight: 0.3,
					description: 'Login on unusual day',
					details: { day, typical: context.typicalLoginDays },
				})
			}
		}

		return factors
	}

	/**
	 * Assess account-related risks
	 */
	private static assessAccountRisk(context: IRiskContext): IRiskFactor[] {
		const factors: IRiskFactor[] = []

		// New account
		if (context.accountAge < 7) {
			factors.push({
				name: 'new_account',
				score: RISK_WEIGHTS.NEW_ACCOUNT,
				weight: 0.7,
				description: 'Account is less than 7 days old',
				details: { age: context.accountAge },
			})
		} else if (context.accountAge < 30) {
			factors.push({
				name: 'young_account',
				score: RISK_WEIGHTS.YOUNG_ACCOUNT,
				weight: 0.4,
				description: 'Account is less than 30 days old',
				details: { age: context.accountAge },
			})
		}

		return factors
	}

	/**
	 * Assess authentication history risks
	 */
	private static assessAuthenticationRisk(context: IRiskContext): IRiskFactor[] {
		const factors: IRiskFactor[] = []

		// Multiple failed attempts
		if (context.failedAttemptsRecent > 0) {
			const score = Math.min(RISK_WEIGHTS.MULTIPLE_FAILED_ATTEMPTS, context.failedAttemptsRecent * 10)
			factors.push({
				name: 'failed_attempts',
				score,
				weight: 1.0,
				description: 'Recent failed login attempts',
				details: { attempts: context.failedAttemptsRecent },
			})
		}

		return factors
	}

	/**
	 * Calculate final risk score from factors
	 */
	private static calculateScore(factors: IRiskFactor[]): number {
		if (factors.length === 0) return 0

		const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0)
		const weightedScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0)

		const score = totalWeight > 0 ? weightedScore / totalWeight : 0

		// Clamp to 0-100
		return Math.max(0, Math.min(100, Math.round(score)))
	}

	/**
	 * Get risk level from score
	 */
	private static getRiskLevel(score: number): ERiskLevel {
		for (const [level, range] of Object.entries(RISK_THRESHOLDS)) {
			if (score >= range.min && score <= range.max) {
				return level as ERiskLevel
			}
		}
		return ERiskLevel.LOW
	}

	/**
	 * Detect specific anomalies
	 */
	private static detectAnomalies(context: IRiskContext): IAnomaly[] {
		const anomalies: IAnomaly[] = []

		const impossibleTravel = this.detectImpossibleTravel(context)
		if (impossibleTravel) {
			anomalies.push({
				type: 'velocity',
				severity: 'critical',
				description: 'Impossible travel detected',
				score: RISK_WEIGHTS.IMPOSSIBLE_TRAVEL,
				details: impossibleTravel,
			})
		}

		return anomalies
	}

	/**
	 * Generate recommendations based on risk level
	 */
	private static generateRecommendations(level: ERiskLevel, anomalies: IAnomaly[]): string[] {
		const recommendations: string[] = []

		switch (level) {
			case ERiskLevel.CRITICAL:
				recommendations.push('Block access immediately')
				recommendations.push('Notify user of suspicious activity')
				recommendations.push('Require password reset')
				recommendations.push('Invalidate all sessions')
				break
			case ERiskLevel.HIGH:
				recommendations.push('Require 2FA verification')
				recommendations.push('Send security alert to user')
				recommendations.push('Log detailed audit trail')
				break
			case ERiskLevel.MEDIUM:
				recommendations.push('Require 2FA verification')
				recommendations.push('Monitor closely')
				break
			case ERiskLevel.LOW:
				recommendations.push('Log for analytics')
				break
			case ERiskLevel.VERY_LOW:
				// No action needed
				break
		}

		if (anomalies.length > 0) {
			recommendations.push(`Investigate ${anomalies.length} detected anomalies`)
		}

		return recommendations
	}
}
```

`src/modules/auth/account/account.module.ts`

```typescript
// Import enums registration

@Module({
	providers: [
		AccountService,
		AccountResolver,
		VerificationService,
		SecurityEventService,
		SessionService,
		AccountLockService,
		NotificationService,
	],
})
export class AccountModule {}
```

`src/modules/auth/account/account.resolver.ts`

```typescript
/**
 * Response type for password change operation
 */
@ObjectType('ChangePasswordResponse', {
	description: 'Response after successful password change',
})
export class ChangePasswordResponse {
	@Field({
		description: 'Whether the password change was successful',
	})
	success: boolean

	@Field({
		description: 'Number of other sessions invalidated (logged out from other devices)',
	})
	sessionsInvalidated: number
}

@Resolver(() => User)
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	/**
	 * Returns the currently authenticated user's profile (safe projection).
	 */
	@Authorization()
	@Query(() => User, {
		name: 'profile',
		description: 'Get the currently authenticated user profile. Returns safe projection without sensitive data.',
	})
	async me(@Authorized('id') id: string): Promise<User> {
		return this.accountService.me(id)
	}

	/**
	 * Creates a new user account and sends an email verification token.
	 */
	@Mutation(() => User, {
		name: 'createAccount',
		description:
			'Create a new user account. Normalizes email, hashes password with Argon2id, and sends verification email.',
	})
	create(@Args('data') input: CreateAccountInput, @Lang() lng: Language): Promise<User> {
		return this.accountService.create(input, lng)
	}

	/**
	 * Changes the email of the authenticated user and re-sends a verification email.
	 */
	@Authorization()
	@Mutation(() => Boolean, {
		name: 'changeEmail',
		description: 'Change current user email address. Resets verification status and sends new verification email.',
	})
	async changeEmail(
		@Authorized() user: User,
		@Args('data') input: ChangeEmailInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.accountService.changeEmail(user, input, lng)
	}

	/**
	 * Changes the password of the authenticated user with enterprise security features.
	 * Invalidates all other sessions and logs security event.
	 */
	@RateLimit({ points: RATE_LIMIT_CHANGE_PASSWORD_POINTS, duration: RATE_LIMIT_CHANGE_PASSWORD_WINDOW_MS }) // ✅ 5 attempts per hour
	@Authorization()
	@Mutation(() => ChangePasswordResponse, {
		name: 'changePassword',
		description:
			'Change current user password. Verifies old password, invalidates all other sessions, logs security event, and updates passwordChangedAt timestamp.',
	})
	async changePassword(
		@Context() { req }: GqlContext,
		@Authorized() user: User,
		@Args('data') input: ChangePasswordInput,
		@UserAgent() userAgent: string,
		@Lang() lng: Language,
	): Promise<ChangePasswordResponse> {
		return this.accountService.changePassword(req, user, input, userAgent, lng)
	}
}
```

`src/modules/auth/account/account.service.ts`

```typescript
/**
 * AccountService
 * Handles user profile operations:
 * - Profile reading
 * - Account creation with email verification
 * - Email change with re-verification
 * - Password change with security features:
 *   - Session invalidation (logout from all other devices)
 *   - Security event logging
 *   - Risk assessment
 *   - passwordChangedAt tracking
 *
 * All user-facing messages are internationalized via I18nService.
 */
@Injectable()
export class AccountService extends CoreService {
	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		private readonly verification: VerificationService,
		private readonly session: SessionService,
		private readonly securityEvent: SecurityEventService,
	) {
		super({ i18n, prisma })
	}

	/**
	 * Normalize email for uniqueness checks (trim + lowercase).
	 * @param email - Raw email input
	 * @returns Normalized email
	 */
	private normalizeEmail(email: string): string {
		return email.trim().toLowerCase()
	}

	/**
	 * Get current user profile (safe projection without password).
	 *
	 * @param id - User ID
	 * @returns User profile or null if not found
	 */
	async me(id: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { id },
		})

		return user as unknown as User | null
	}

	/**
	 * Create a new user account.
	 * - Normalizes email
	 * - Hashes password with Argon2id
	 * - Sends email verification token
	 * - Handles unique constraint violations (P2002)
	 *
	 * @param input - Account creation payload
	 * @param lng - Language code for i18n
	 * @returns Newly created user (safe projection)
	 * @throws ConflictException if email already exists
	 * @throws InternalServerErrorException on unexpected errors
	 */
	async create(input: CreateAccountInput, lng: Language): Promise<User> {
		const email = this.normalizeEmail(input.email)
		const hashedPassword = await HashUtil.hash(input.password)

		try {
			const user = await this.prisma.user.create({
				data: {
					...input,
					email,
					password: hashedPassword,
				},
			})

			// Send verification email (non-blocking)
			await this.verification.sendEmailVerificationToken(user, lng).catch(() => {
				// Log error but don't fail account creation
			})

			return user as unknown as User
		} catch (e) {
			if (isPrismaError(e, 'P2002')) {
				throw new ConflictException(
					this.i18n.t('auth.errors.user.already_exists', {
						lng,
						defaultValue: 'This email is already in use',
					}),
				)
			}
			throw new InternalServerErrorException(
				this.i18n.t('common.errors.unexpected', { lng, defaultValue: 'Unexpected error' }),
			)
		}
	}

	/**
	 * Change user email address.
	 * - Normalizes email
	 * - Rejects if new email equals current email
	 * - Resets email verification status
	 * - Sends new verification email
	 * - Handles unique constraint violations
	 *
	 * @param user - Current authenticated user
	 * @param input - New email input
	 * @param lng - Language code for i18n
	 * @returns true if successful
	 * @throws BadRequestException if email is the same as current
	 * @throws ConflictException if email is already taken
	 * @throws InternalServerErrorException on unexpected errors
	 */
	async changeEmail(user: User, input: ChangeEmailInput, lng: Language): Promise<boolean> {
		const email = this.normalizeEmail(input.email)

		if (email === this.normalizeEmail(user.email)) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.user.same_email', {
					lng,
					defaultValue: 'This email is already your current email',
				}),
			)
		}

		try {
			const updated = await this.prisma.user.update({
				where: { id: user.id },
				data: {
					email,
					isEmailVerified: false,
					emailVerifiedAt: null,
				},
			})

			// Send verification email
			await this.verification.sendEmailVerificationToken(updated, lng).catch(() => {})

			return true
		} catch (e) {
			if (isPrismaError(e, 'P2002')) {
				throw new ConflictException(
					this.i18n.t('auth.errors.user.already_exists', {
						lng,
						defaultValue: 'This email is already in use',
					}),
				)
			}
			throw new InternalServerErrorException(
				this.i18n.t('common.errors.unexpected', { lng, defaultValue: 'Unexpected error' }),
			)
		}
	}

	/**
	 * Change user password with enterprise security features.
	 *
	 * Security measures:
	 * - Verifies old password with Argon2id
	 * - Rejects if new password equals old password
	 * - Hashes new password with Argon2id
	 * - Updates passwordChangedAt timestamp
	 * - **Invalidates all sessions except current one** (logout from other devices)
	 * - **Logs security event** with risk assessment
	 * - Calculates risk score based on factors (new device, unusual location, etc.)
	 *
	 * @param req - HTTP request object (for session and metadata extraction)
	 * @param user - Current authenticated user
	 * @param input - Password change payload
	 * @param userAgent - User agent string
	 * @param lng - Language code for i18n
	 * @returns Object with success status and number of invalidated sessions
	 * @throws BadRequestException if old password is invalid or passwords match
	 * @throws InternalServerErrorException on database errors
	 *
	 * @example
	 * ```typescript
	 * const result = await accountService.changePassword(
	 *   req,
	 *   user,
	 *   { oldPassword: 'old123', newPassword: 'new456' },
	 *   req.headers['user-agent'],
	 *   'en'
	 * )
	 * // Returns: { success: true, sessionsInvalidated: 2 }
	 * ```
	 */
	async changePassword(
		req: Request,
		user: User,
		input: ChangePasswordInput,
		userAgent: string,
		lng: Language,
	): Promise<{ success: boolean; sessionsInvalidated: number }> {
		const { oldPassword, newPassword } = input

		// Verify old password
		const isValidOld = await HashUtil.verify(user.password, oldPassword)
		if (!isValidOld) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.password.invalid', { lng, defaultValue: 'Invalid password' }),
			)
		}

		// Forbid setting the same password
		if (oldPassword === newPassword) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.password.same', {
					lng,
					defaultValue: 'New password must differ from the old one',
				}),
			)
		}

		try {
			// Extract session metadata for security event
			const meta = getSessionMetadata(req, userAgent)
			const currentSessionId = req.session?.id

			// Hash new password
			const hashed = await HashUtil.hash(newPassword)

			// Update password in database
			await this.prisma.user.update({
				where: { id: user.id },
				data: {
					password: hashed,
					passwordChangedAt: new Date(),
				},
			})

			// Invalidate all sessions except current one (logout from other devices)
			const sessionsInvalidated = await this.session.invalidateUserSessions(user.id, currentSessionId)

			// Calculate risk score based on factors
			const riskFactors = []

			// Factor: Password change from new device
			// TODO: Implement device trust checking
			// For now, assign moderate risk
			riskFactors.push({
				type: 'password_change',
				description: 'User-initiated password change',
				weight: 20,
			})

			// Factor: Multiple sessions invalidated (potential compromise)
			if (sessionsInvalidated > 2) {
				riskFactors.push({
					type: 'multiple_sessions',
					description: `${sessionsInvalidated} sessions invalidated`,
					weight: 15,
				})
			}

			const riskScore = this.securityEvent.calculateRiskScore(riskFactors)

			// Determine severity based on risk score
			let severity: ESecuritySeverity = ESecuritySeverity.LOW
			if (riskScore >= 50) severity = ESecuritySeverity.HIGH
			else if (riskScore >= 30) severity = ESecuritySeverity.MEDIUM

			// Log security event
			await this.securityEvent.create({
				userId: user.id,
				event: ESecurityEvent.PASSWORD_CHANGED,
				severity,
				ip: meta.ip,
				userAgent,
				country: meta.location?.country,
				city: meta.location?.city,
				riskScore,
				riskFactors,
				metadata: {
					sessionsInvalidated,
					browser: meta.device?.browser,
					os: meta.device?.os,
				},
			})

			// TODO: Send email notification about password change
			// await this.mail.sendPasswordChangedNotification(user.email, meta, lng)

			return {
				success: true,
				sessionsInvalidated,
			}
		} catch {
			throw new InternalServerErrorException(
				this.i18n.t('auth.errors.password.change_failed', {
					lng,
					defaultValue: 'Failed to change password',
				}),
			)
		}
	}
}
```

`src/modules/auth/account/dtos/change-email.dto.ts`

```typescript
/**
 * Email change input
 */
@InputType('ChangeEmailInput', {
	description: 'Input data for changing user email address',
})
export class ChangeEmailInput {
	@Field({
		description: 'New email address (must be unique and different from current)',
	})
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string
}
```

`src/modules/auth/account/dtos/change-password.dto.ts`

```typescript
/**
 * Password change input
 */
@InputType('ChangePasswordInput', {
	description: 'Input data for changing user password',
})
export class ChangePasswordInput {
	@Field({
		description: 'Current password (for verification)',
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	oldPassword: string

	@Field({
		description: 'New password (minimum 8 characters, must differ from old)',
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	newPassword: string
}
```

`src/modules/auth/account/dtos/create.dto.ts`

```typescript
/**
 * Account creation input
 */
@InputType('CreateAccountInput', {
	description: 'Input data for creating a new user account',
})
export class CreateAccountInput {
	@Field({
		description: 'Full name (alphanumeric with hyphens allowed)',
	})
	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
	fullName: string

	@Field({
		description: 'Email address (must be unique)',
	})
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string

	@Field({
		description: 'Password (minimum 8 characters)',
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string

	@Field({
		description: 'Phone number in E.164 format (e.g., +1234567890)',
	})
	@IsString()
	@IsNotEmpty()
	@IsPhoneNumber()
	phone: string
}
```

`src/modules/auth/account/dtos/index.ts`

```typescript
export * from './change-email.dto'
export * from './change-password.dto'
export * from './create.dto'
```

`src/modules/auth/account/index.ts`

```typescript
// Ensure enums are registered before anything else

export * from './account.module'
export * from './account.service'
export * from './models'
```

`src/modules/auth/account/models/enums.ts`

```typescript
/**
 * Register Prisma enums for GraphQL
 * Must be imported before any models that use these enums
 */

registerEnumType(EUserRole, {
	name: 'EUserRole',
	description: 'User role for access control and permissions',
	valuesMap: {
		USER: {
			description: 'Regular user with standard permissions',
		},
		SUPER_ADMIN: {
			description: 'Super administrator with full system access',
		},
	},
})

registerEnumType(E2FAMethod, {
	name: 'E2FAMethod',
	description: 'Available two-factor authentication methods',
	valuesMap: {
		TOTP: {
			description: 'Time-based one-time password (Google Authenticator, Authy, 1Password)',
		},
		OTP_EMAIL: {
			description: 'One-time password sent via email',
		},
		OTP_SMS: {
			description: 'One-time password sent via SMS',
		},
		WEBAUTHN: {
			description: 'WebAuthn/FIDO2 hardware security keys (YubiKey, Titan)',
		},
		PASSKEY: {
			description: 'Passkeys using biometrics (TouchID, FaceID, Windows Hello)',
		},
		BACKUP_CODE: {
			description: 'Backup recovery codes for emergency access',
		},
	},
})

export { EUserRole, E2FAMethod }
```

`src/modules/auth/account/models/index.ts`

```typescript
// Register enums FIRST before importing User model

export * from './enums'
export * from './user.model'
```

`src/modules/auth/account/models/user.model.ts`

```typescript
/**
 * User GraphQL model
 * Represents a user account with security features and profile information
 * Password field is hidden from GraphQL schema for security
 */
@ObjectType('User', {
	description: 'User account with profile, security, and authentication settings',
})
export class User {
	// ===== Identity =====

	@Field(() => ID, {
		description: 'Unique user identifier (UUID v4)',
	})
	id: string

	// ===== Profile Fields =====

	@Field({
		description: 'Full name of the user (displayed in UI)',
	})
	fullName: string

	@Field({
		nullable: true,
		description: 'First name (optional, parsed from fullName)',
	})
	firstName?: string

	@Field({
		nullable: true,
		description: 'Last name (optional, parsed from fullName)',
	})
	lastName?: string

	@Field({
		description: 'Email address (unique, used for login and notifications)',
	})
	email: string

	@Field({
		nullable: true,
		description: 'Phone number in E.164 format (optional, used for SMS 2FA)',
	})
	phone?: string

	@Field({
		nullable: true,
		description: 'Avatar image URL (optional)',
	})
	avatar?: string

	@Field({
		nullable: true,
		description: 'User biography or description (optional)',
	})
	bio?: string

	// ===== Password (Hidden) =====

	@HideField()
	password: string

	// ===== Role-Based Access Control =====

	@Field(() => [EUserRole], {
		description: 'User roles for access control (can have multiple roles)',
	})
	roles: EUserRole[]

	// ===== Email Verification =====

	@Field({
		description: 'Whether the email address has been verified',
	})
	isEmailVerified: boolean

	@Field({
		nullable: true,
		description: 'Timestamp when email was verified (null if not verified)',
	})
	emailVerifiedAt?: Date

	@Field({
		nullable: true,
		description: 'Whether user has unsubscribed from email notifications',
	})
	isUnsubscribed?: boolean

	@Field({
		nullable: true,
		description: 'Timestamp of last email bounce (for reputation tracking)',
	})
	emailBouncedAt?: Date

	// ===== Phone Verification =====

	@Field({
		description: 'Whether the phone number has been verified',
	})
	isPhoneVerified: boolean

	@Field({
		nullable: true,
		description: 'Timestamp when phone was verified (null if not verified)',
	})
	phoneVerifiedAt?: Date

	@Field({
		nullable: true,
		description: 'Timestamp of last SMS delivery failure (for reputation tracking)',
	})
	phoneBouncedAt?: Date

	// ===== Unified 2FA System =====

	@Field({
		description: 'Global 2FA status - true if user has at least one active 2FA method',
	})
	is2FAEnabled: boolean

	@Field(() => E2FAMethod, {
		nullable: true,
		description: 'User preferred 2FA method used by default during login',
	})
	preferred2FAMethod?: E2FAMethod

	@Field({
		description: 'Whether 2FA is mandatory for this user (admin-enforced for compliance)',
	})
	require2FA: boolean

	// ===== Account Security =====

	@Field({
		nullable: true,
		description: 'Timestamp of last successful login',
	})
	lastLoginAt?: Date

	@Field({
		nullable: true,
		description: 'IP address of last successful login',
	})
	lastLoginIp?: string

	@Field({
		nullable: true,
		description: 'Timestamp when password was last changed',
	})
	passwordChangedAt?: Date

	// ===== Risk Assessment =====

	@Field({
		nullable: true,
		description: 'User risk score (0-100): 0 = trusted, 100 = high risk. Based on login patterns and behavior.',
	})
	riskScore?: number

	@Field({
		nullable: true,
		description: 'Timestamp when risk score was last calculated',
	})
	lastRiskAssessAt?: Date

	// ===== Soft Delete =====

	@Field({
		nullable: true,
		description: 'Soft delete timestamp (null if account is active)',
	})
	deletedAt?: Date

	// ===== Timestamps =====

	@Field({
		description: 'Account creation timestamp',
	})
	createdAt: Date

	@Field({
		description: 'Account last update timestamp (auto-updated)',
	})
	updatedAt: Date
}
```

`src/modules/auth/index.ts`

```typescript
export * from './2fa'
export * from './account'
export * from './recovery'
export * from './session'
export * from './verification'
```

`src/modules/auth/recovery/dtos/index.ts`

```typescript
export * from './new-password.dto'
export * from './reset-password.dto'
```

`src/modules/auth/recovery/dtos/new-password.dto.ts`

```typescript
@InputType()
export class NewPasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string

	@Field(() => String)
	@IsUUID(4)
	@IsNotEmpty()
	token: string
}
```

`src/modules/auth/recovery/dtos/reset-password.dto.ts`

```typescript
@InputType()
export class ResetPasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string
}
```

`src/modules/auth/recovery/index.ts`

```typescript
export * from './recovery.module'
export * from './recovery.service'
```

`src/modules/auth/recovery/recovery.module.ts`

```typescript
@Module({
	providers: [RecoveryResolver, RecoveryService, SecurityEventService],
})
export class RecoveryModule {}
```

`src/modules/auth/recovery/recovery.service.ts`

```typescript
/**
 * RecoveryService
 *
 * Handles password recovery operations:
 * - Password reset request (email with token)
 * - Password reset completion (token validation and new password)
 * - Security event logging for all operations
 * - Email notifications for password changes
 *
 * Security features:
 * - Email enumeration protection (always returns success)
 * - Security event tracking with risk assessment
 * - Email notifications for password reset confirmation
 * - Token-based one-time password reset
 */
@Injectable()
export class RecoveryService extends CoreService {
	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		private readonly mail: MailService,
		private readonly securityEvent: SecurityEventService,
	) {
		super({ i18n, prisma })
	}

	/** Normalize email for uniqueness checks (trim + lower-case). */
	private normalizeEmail(email: string): string {
		return email.trim().toLowerCase()
	}

	/**
	 * Start password reset flow:
	 * 1) Normalize email and check that the user exists
	 * 2) Generate a one-time PASSWORD_RESET token
	 * 3) Send reset email (non-blocking: mail errors won't fail the flow)
	 * 4) Log security event for audit trail
	 * 5) Always return true (email enumeration protection)
	 *
	 * @param req - Express request (for IP/geo/browser meta)
	 * @param input - ResetPasswordInput { email }
	 * @param userAgent - Raw User-Agent header
	 * @param lng - Language code for i18n
	 * @returns true if the flow was initiated
	 * @throws NotFoundException if user is not found
	 * @throws InternalServerErrorException on unexpected DB errors
	 */
	async resetPassword(req: Request, input: ResetPasswordInput, userAgent: string, lng: Language): Promise<boolean> {
		const email = this.normalizeEmail(input.email)

		// Extract metadata early for security event logging
		const meta = getSessionMetadata(req, userAgent)

		// 1) Check user existence with minimal projection
		const user = await this.prisma.user.findUnique({
			where: { email },
			select: { id: true, email: true },
		})

		// Email enumeration protection: log event but don't reveal if user exists
		if (!user) {
			// Log attempted reset for non-existent user (potential reconnaissance)
			await this.securityEvent.create({
				userId: 'unknown', // Special marker for non-existent users
				event: ESecurityEvent.PASSWORD_RESET_REQUESTED,
				severity: ESecuritySeverity.LOW,
				ip: meta.ip,
				userAgent,
				country: meta.location?.country,
				city: meta.location?.city,
				metadata: {
					email,
					userExists: false,
					reason: 'email_enumeration_protection',
				},
			})

			// Return success to prevent email enumeration
			return true
		}

		try {
			// 2) Generate/reset token for this user
			const token = await generateToken(this.prisma, user as User, ETokenType.PASSWORD_RESET)

			// 3) Send email (do not fail the flow if mailer throws)
			try {
				await this.mail.sendPasswordResetToken(user.email, token.token, meta, lng)
			} catch (err) {
				// Log mailer error but don't block the flow
				// Error is already logged in MailService
			}

			// 4) Log security event
			await this.securityEvent.create({
				userId: user.id,
				event: ESecurityEvent.PASSWORD_RESET_REQUESTED,
				severity: ESecuritySeverity.MEDIUM,
				ip: meta.ip,
				userAgent,
				country: meta.location?.country,
				city: meta.location?.city,
				metadata: {
					email: user.email,
					tokenId: token.id,
					browser: meta.device?.browser,
					os: meta.device?.os,
				},
			})

			// 5) Indicate success to the client
			return true
		} catch {
			// Wrap any unexpected persistence errors
			throw new InternalServerErrorException(
				this.i18n.t('common.errors.unexpected', { lng, defaultValue: 'Unexpected error' }),
			)
		}
	}

	/**
	 * Set a new password by reset token:
	 * - Validates token existence and type
	 * - Checks expiration
	 * - Hashes and saves the new password
	 * - Removes the used token
	 * - Logs security event
	 * - Sends confirmation email (non-blocking)
	 *
	 * Note: Request context (IP, userAgent) is not available in this method
	 * because it's called without authentication. Metadata will be logged
	 * as 'unknown' in security events.
	 *
	 * @param input - DTO with `token` and `password`
	 * @param lng - i18n language code
	 * @returns `true` on success
	 * @throws NotFoundException if token not found
	 * @throws BadRequestException if token expired
	 */
	async newPassword(input: NewPasswordInput, lng: Language): Promise<boolean> {
		const { password, token } = input

		// token is unique in the schema -> find by token only
		const t = await this.prisma.token.findUnique({
			where: { token },
			select: { id: true, type: true, expiresIn: true, userId: true },
		})

		if (!t || t.type !== ETokenType.PASSWORD_RESET) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.token.not_found', { lng, defaultValue: 'Token not found' }),
			)
		}

		if (new Date(t.expiresIn) < new Date()) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.token.expired', { lng, defaultValue: 'Token expired' }),
			)
		}

		try {
			const hashed = await hash(password)

			// Get user email for notification
			const user = await this.prisma.user.findUnique({
				where: { id: t.userId },
				select: { id: true, email: true },
			})

			if (!user) {
				throw new NotFoundException(
					this.i18n.t('auth.errors.user.not_found', { lng, defaultValue: 'User not found' }),
				)
			}

			// Update password and consume the token
			await this.prisma.$transaction([
				this.prisma.user.update({
					where: { id: t.userId },
					data: { password: hashed, passwordChangedAt: new Date() },
					select: { id: true },
				}),
				this.prisma.token.delete({ where: { id: t.id } }),
			])

			// Log security event (without detailed metadata since no req context)
			await this.securityEvent.create({
				userId: user.id,
				event: ESecurityEvent.PASSWORD_RESET_COMPLETED,
				severity: ESecuritySeverity.HIGH,
				ip: 'unknown', // No request context available
				userAgent: 'unknown',
				metadata: {
					tokenId: t.id,
					method: 'password_reset_token',
				},
			})

			// Send confirmation email (non-blocking)
			// Note: metadata will have 'unknown' values since we don't have request context
			await this.mail
				.sendPasswordResetConfirmation(
					user.email,
					{
						ip: 'unknown',
						location: undefined,
						device: undefined,
					},
					lng,
				)
				.catch(err => {
					// Email failure should not fail password reset
					// Error is already logged in MailService
				})

			return true
		} catch (error) {
			// If it's one of our known errors, re-throw it
			if (error instanceof NotFoundException || error instanceof BadRequestException) {
				throw error
			}

			// Otherwise wrap in generic error
			throw new InternalServerErrorException(
				this.i18n.t('auth.errors.password.change_failed', { lng, defaultValue: 'Failed to change password' }),
			)
		}
	}
}
```

`src/modules/auth/session/dtos/index.ts`

```typescript
export * from './login.dto'
```

`src/modules/auth/session/dtos/login.dto.ts`

```typescript
/**
 * Login credentials input
 */
@InputType('LoginInput', {
	description: 'User credentials for authentication',
})
export class LoginInput {
	@Field({
		description: 'User email address',
	})
	email: string

	@Field({
		description: 'User password (min 8 characters)',
	})
	password: string
}

/**
 * Login response with user data
 */
@ObjectType('LoginResponse', {
	description: 'Response after successful authentication',
})
export class LoginResponse {
	@Field(() => User, {
		nullable: true,
		description: 'Authenticated user data',
	})
	user?: User
}
```

`src/modules/auth/session/index.ts`

```typescript
export * from './session.module'
export * from './session.service'
```

`src/modules/auth/session/models/index.ts`

```typescript
export * from './session.model'
```

`src/modules/auth/session/models/session.model.ts`

```typescript
/**
 * Geographic location information for a session
 */
@ObjectType('Location', {
	description: 'Geographic location information derived from IP address',
})
export class Location {
	@Field({
		description: 'Country name (e.g., "United States")',
	})
	country: string

	@Field({
		description: 'City name (e.g., "New York")',
	})
	city: string

	@Field({
		description: 'Latitude coordinate',
	})
	latitude: number

	@Field({
		description: 'Longitude coordinate',
	})
	longitude: number
}

/**
 * Device information parsed from User-Agent
 */
@ObjectType('Device', {
	description: 'Device information parsed from User-Agent header',
})
export class Device {
	@Field({
		description: 'Browser name and version (e.g., "Chrome 120.0")',
	})
	browser: string

	@Field({
		description: 'Operating system (e.g., "macOS 14.0")',
	})
	os: string

	@Field({
		description: 'Device type (desktop, mobile, tablet)',
	})
	type: string
}

/**
 * Session metadata including location, device, and IP
 */
@ObjectType('SessionMetadata', {
	description: 'Session metadata including location, device, and network information',
})
export class SessionMetadata {
	@Field(() => Location, {
		description: 'Geographic location of the session',
	})
	location: Location

	@Field(() => Device, {
		description: 'Device information',
	})
	device: Device

	@Field({
		description: 'IP address (IPv4 or IPv6)',
	})
	ip: string
}

/**
 * User session representing an active login
 */
@ObjectType('Session', {
	description: 'Active user session with security tracking',
})
export class Session {
	@Field(() => ID, {
		description: 'Unique session identifier (used for session management)',
	})
	id: string

	@Field({
		description: 'User ID associated with this session',
	})
	userId: string

	@Field(() => SessionMetadata, {
		description: 'Session metadata (location, device, IP)',
	})
	metadata: SessionMetadata

	@Field({
		nullable: true,
		description: 'Whether this session is from a trusted device (reduces 2FA friction)',
	})
	isTrusted?: boolean

	@Field({
		nullable: true,
		description: 'Risk score for this session (0-100): 0 = safe, 100 = suspicious',
	})
	riskScore?: number

	@Field({
		nullable: true,
		description: 'Whether 2FA has been verified for this session',
	})
	is2FAVerified?: boolean

	@Field({
		nullable: true,
		description: 'Timestamp when 2FA was successfully verified',
	})
	verified2FAAt?: Date

	@Field({
		description: 'Session creation timestamp (ISO 8601 string)',
	})
	createdAt: string
}
```

`src/modules/auth/session/session.module.ts`

```typescript
@Module({
	providers: [
		SessionResolver,
		SessionService,
		VerificationService,
		SecurityEventService,
		AccountLockService,
		NotificationService,
	],
})
export class SessionModule {}
```

`src/modules/auth/session/session.resolver.ts`

```typescript
@Resolver(() => Session)
export class SessionResolver {
	constructor(private readonly sessionService: SessionService) {}

	/**
	 * Authenticate the user and create a server session.
	 */
	@RateLimit({
		points: RATE_LIMIT_LOGIN_POINTS,
		duration: RATE_LIMIT_LOGIN_WINDOW_MS,
		errorMessage: `Too many login attempts. Please try again in ${RATE_LIMIT_LOGIN_WINDOW_MS / 1000 / 60} minutes.`,
	}) // ✅ 5 attempts per 15 minutes
	@Mutation(() => LoginResponse, {
		name: 'login',
		description:
			'Authenticate user with email and password. Creates session cookie and tracks login metadata (IP, device, location).',
	})
	login(
		@Context() { req }: GqlContext,
		@Args('data') data: LoginInput,
		@UserAgent() userAgent: string,
		@Lang() lng: Language,
	): Promise<LoginResponse> {
		return this.sessionService.login(req, userAgent, data, lng)
	}

	/**
	 * Destroy the current session (logout).
	 */
	@Authorization()
	@Mutation(() => Boolean, {
		name: 'logout',
		description: 'Destroy current session and clear session cookie.',
	})
	logout(@Context() { req }: GqlContext): Promise<boolean> {
		return this.sessionService.logout(req)
	}

	/**
	 * Read the current session object.
	 */
	@Authorization()
	@Query(() => Session, {
		name: 'currentSession',
		description: 'Get current session metadata including device, location, and security status.',
		nullable: true,
	})
	findCurrent(@Context() { req }: GqlContext): Promise<Session | null> {
		return this.sessionService.findCurrent(req)
	}

	/**
	 * List all active sessions for the current user (excluding current).
	 */
	@Authorization()
	@Query(() => [Session], {
		name: 'userSessions',
		description: 'List all active sessions for current user (sorted by creation time, current session excluded).',
	})
	findByUser(@Context() { req }: GqlContext, @Lang() lng: Language): Promise<Session[]> {
		return this.sessionService.findByUser(req, lng)
	}

	/**
	 * Clear the session cookie from the response.
	 */
	@Authorization()
	@Mutation(() => Boolean, {
		name: 'clearSessionCookie',
		description: 'Clear session cookie from client (does not invalidate Redis session).',
	})
	clearSession(@Context() { req }: GqlContext): boolean {
		return this.sessionService.clear(req)
	}

	/**
	 * Remove a specific session by id.
	 */
	@Authorization()
	@Mutation(() => Boolean, {
		name: 'removeSession',
		description: 'Remove specific session by ID (cannot remove current session).',
	})
	removeSession(@Context() { req }: GqlContext, @Args('id') id: string, @Lang() lng: Language): Promise<boolean> {
		return this.sessionService.remove(req, id, lng)
	}
}
```

`src/modules/auth/verification/dtos/index.ts`

```typescript
export * from './verification.dto'
```

`src/modules/auth/verification/dtos/verification.dto.ts`

```typescript
@InputType()
export class VerificationInput {
	@Field(() => String)
	@IsUUID(4)
	@IsNotEmpty()
	token: string
}

@ObjectType()
export class VerificationResponse {
	@Field(() => User, { nullable: true })
	user?: User
}
```

`src/modules/auth/verification/index.ts`

```typescript
export * from './verification.module'
export * from './verification.service'
```

`src/modules/auth/verification/verification.module.ts`

```typescript
@Module({
	providers: [VerificationResolver, VerificationService],
})
export class VerificationModule {}
```

`src/modules/auth/verification/verification.resolver.ts`

```typescript
@Resolver('Verification')
export class VerificationResolver {
	constructor(private readonly verificationService: VerificationService) {}

	/**
	 * Send a verification email with a one-time token.
	 * The token is persisted and can be used to confirm the account.
	 */
	@RateLimit({ points: RATE_LIMIT_VERIFICATION_EMAIL_POINTS, duration: RATE_LIMIT_VERIFICATION_EMAIL_WINDOW_MS }) // ✅ 5 attempts per hour
	@Mutation(() => VerificationResponse, {
		name: 'verificationEmail',
		description: 'Send a verification email with a one-time token and return delivery/meta info.',
	})
	verificationEmail(
		@Context() { req }: GqlContext,
		@Args('data') input: VerificationInput,
		@UserAgent() userAgent: string,
		@Lang() lng: Language,
	): Promise<VerificationResponse> {
		return this.verificationService.verificationEmail(req, input, userAgent, lng)
	}
}
```

`src/modules/auth/verification/verification.service.ts`

```typescript
@Injectable()
export class VerificationService extends CoreService {
	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		private readonly mail: MailService,
		private readonly sms: SmsService,
	) {
		super({ i18n, prisma })
	}

	/**
	 * Verify a user's email by one-time token, consume the token, and start a session.
	 *
	 * Flow:
	 * 1) Fetch token by value (unique). Reject if missing/wrong type/expired.
	 * 2) Atomically: mark user as verified and delete the token.
	 * 3) Build session metadata and persist session (cookie/redis).
	 *
	 * @param req Express request (to save session/cookies)
	 * @param input GraphQL input containing the token
	 * @param userAgent Raw User-Agent header (for session metadata)
	 * @param lng Language code for i18n
	 * @returns VerificationResponse (session info)
	 * @throws NotFoundException if token not found or wrong type
	 * @throws BadRequestException if token expired
	 * @throws InternalServerErrorException for unexpected DB/mail issues
	 */
	async verificationEmail(
		req: Request,
		input: VerificationInput,
		userAgent: string,
		lng: Language,
	): Promise<VerificationResponse> {
		const { token } = input

		// 1) Load token by unique value
		const t = await this.prisma.token.findUnique({
			where: { token },
			select: { id: true, type: true, expiresIn: true, userId: true },
		})

		if (!t || t.type !== ETokenType.EMAIL_VERIFY) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.token.not_found', { lng, defaultValue: 'Token not found' }),
			)
		}

		if (new Date(t.expiresIn) < new Date()) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.token.expired', { lng, defaultValue: 'Token expired' }),
			)
		}

		// 2) Atomically verify and consume the token
		const [updatedUser] = await this.prisma.$transaction([
			this.prisma.user.update({
				where: { id: t.userId },
				data: { isEmailVerified: true },
				// select минимален, но достаточно для saveSession
				select: {
					id: true,
					email: true,
					fullName: true,
					firstName: true,
					lastName: true,
					isEmailVerified: true,
					createdAt: true,
					updatedAt: true,
				},
			}),
			this.prisma.token.delete({ where: { id: t.id } }),
		])

		// 3) Create session
		const meta = getSessionMetadata(req, userAgent)
		return saveSession(req, updatedUser as User, meta)
	}

	/**
	 * Generate and send a fresh verification token to user's email.
	 *
	 * @param user The target user
	 * @param lng Language code for email templates
	 * @returns true on success
	 * @throws InternalServerErrorException if sending email fails
	 */
	async sendEmailVerificationToken(user: User, lng: Language): Promise<boolean> {
		const verificationToken = await generateToken(this.prisma, user, ETokenType.EMAIL_VERIFY)

		try {
			await this.mail.sendVerificationEmailToken(user.email, verificationToken.token, lng)
			return true
		} catch {
			// If mailer fails — surface a clear error (you may log internally as well)
			throw new InternalServerErrorException(
				this.i18n.t('mail.errors.message_send_failed', {
					lng,
					defaultValue: 'Failed to send the message.',
				}),
			)
		}
	}

	/**
	 * Generate and send a fresh verification token to user's email.
	 *
	 * @param user The target user
	 * @param lng Language code for email templates
	 * @returns true on success
	 * @throws InternalServerErrorException if sending email fails
	 */
	async sendEmailVerificationOtpToken(user: User, lng: Language): Promise<boolean> {
		const verificationOtpToken = await generateToken(this.prisma, user, ETokenType.EMAIL_VERIFY, false)

		try {
			await this.mail.sendOtpCodeEmail(user.email, verificationOtpToken.token, lng)
			return true
		} catch {
			// If mailer fails — surface a clear error (you may log internally as well)
			throw new InternalServerErrorException(
				this.i18n.t('mail.errors.message_send_failed', {
					lng,
					defaultValue: 'Failed to send the message.',
				}),
			)
		}
	}

	/**
	 * Generate and send a fresh verification token to user's email.
	 *
	 * @param user The target user
	 * @param lng Language code for email templates
	 * @returns true on success
	 * @throws InternalServerErrorException if sending email fails
	 */
	async sendSmsVerificationOtpToken(user: User, lng: Language): Promise<boolean> {
		const verificationOtpToken = await generateToken(this.prisma, user, ETokenType.EMAIL_VERIFY, false)

		try {
			await this.sms.sendOtpSMS(user.email, verificationOtpToken.token, lng)
			return true
		} catch {
			// If mailer fails — surface a clear error (you may log internally as well)
			throw new InternalServerErrorException(
				this.i18n.t('sms.errors.message_send_failed', {
					lng,
					defaultValue: 'Failed to send the message.',
				}),
			)
		}
	}
}
```

`src/modules/notification/constants/index.ts`

```typescript
export * from './notification.constants'
```

`src/modules/notification/constants/notification.constants.ts`

```typescript
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

`src/modules/notification/index.ts`

```typescript
export * from './notification.module'
export * from './notification.service'
export * from './types'
export * from './constants'
```

`src/modules/notification/notification.module.ts`

```typescript
/**
 * Global Notification Module
 *
 * Provides centralized notification services for the entire application.
 * Registered as a global module, making NotificationService available
 * everywhere without explicit imports.
 *
 * @remarks
 * - Supports multiple delivery channels (Email, SMS, Push)
 * - Handles rate limiting and duplicate detection
 * - Tracks delivery success/failure
 * - Respects user preferences and reputation
 *
 * @example
 * ```typescript
 * // No need to import in other modules, automatically available
 * @Injectable()
 * export class MyService {
 *   constructor(private readonly notificationService: NotificationService) {}
 *
 *   async doSomething() {
 *     await this.notificationService.notify2FAMethodAdded(user, 'TOTP', 'My App', 'en')
 *   }
 * }
 * ```
 */
@Global()
@Module({
	providers: [NotificationService],
})
export class NotificationModule {}
```

`src/modules/notification/types/index.ts`

```typescript
export * from './notification.types'
```

`src/modules/notification/types/notification.types.ts`

```typescript
/**
 * Notification category for grouping
 */
export enum ENotificationCategory {
	/** Security-related notifications (2FA, login alerts, etc.) */
	SECURITY = 'SECURITY',
	/** Authentication events (password reset, email verification) */
	AUTHENTICATION = 'AUTHENTICATION',
	/** User account changes (profile updates, settings) */
	USER = 'USER',
	/** Administrative actions (account suspension, etc.) */
	ADMIN = 'ADMIN',
	/** System notifications (maintenance, updates) */
	SYSTEM = 'SYSTEM',
}

/**
 * Notification delivery channel
 */
export enum ENotificationChannel {
	/** Email notification */
	EMAIL = 'EMAIL',
	/** SMS notification */
	SMS = 'SMS',
	/** Push notification (future) */
	PUSH = 'PUSH',
	/** In-app notification (future) */
	IN_APP = 'IN_APP',
}

/**
 * Notification priority level
 */
export enum ENotificationPriority {
	/** Low priority - informational */
	LOW = 'LOW',
	/** Normal priority - standard notifications */
	NORMAL = 'NORMAL',
	/** High priority - important security events */
	HIGH = 'HIGH',
	/** Critical priority - immediate action required */
	CRITICAL = 'CRITICAL',
}

/**
 * Base notification data
 */
export interface INotificationBase {
	/** Recipient user */
	user: User
	/** User's language preference */
	language: Language
	/** Notification category */
	category: ENotificationCategory
	/** Priority level */
	priority: ENotificationPriority
	/** Delivery channels to use */
	channels?: ENotificationChannel[]
}

/**
 * Security notification specific data
 */
export interface ISecurityNotificationData extends INotificationBase {
	category: ENotificationCategory.SECURITY
}

/**
 * 2FA method change notification data
 */
export interface I2FAMethodNotificationData extends ISecurityNotificationData {
	methodType: E2FAMethod
	methodName?: string
	action: '2fa_method_added' | '2fa_method_removed' | '2fa_disabled'
}

/**
 * Device login notification data
 */
export interface IDeviceLoginNotificationData extends ISecurityNotificationData {
	device: ISessionMetadataDTO 
}

/**
 * Backup codes notification data
 */
export interface IBackupCodesNotificationData extends ISecurityNotificationData {
	remaining?: number
	action: 'low_codes' | 'codes_regenerated'
}

/**
 * Suspicious activity notification data
 */
export interface ISuspiciousActivityNotificationData extends ISecurityNotificationData {
	eventDescription: string
	riskScore: number
}

/**
 * Admin action notification data
 */
export interface IAdminActionNotificationData extends INotificationBase {
	category: ENotificationCategory.ADMIN
	adminEmail: string
	reason: string
	action: '2fa_disabled' | 'device_revoked' | 'account_suspended'
	deviceName?: string
}

/**
 * Notification result
 */
export interface INotificationResult {
	success: boolean
	channel: ENotificationChannel
	sentAt?: Date
	error?: string
}
```

`src/modules/rbac/decorators/index.ts`

```typescript
export * from './roles.decorator'
```

`src/modules/rbac/decorators/roles.decorator.ts`

```typescript
/**
 * Decorator to assign required roles to a GraphQL resolver or REST endpoint.
 * Used in conjunction with RolesGuard to enforce role-based access control.
 *
 * @param {...EUserRole[]} roles - One or more roles that are allowed to access the resource.
 * @returns {MethodDecorator & ClassDecorator} A decorator function.
 *
 * @example
 * ```typescript
 * // Single role requirement
 * @Roles(EUserRole.SUPER_ADMIN)
 * @UseGuards(RolesGuard)
 * async deleteUser() { ... }
 *
 * // Multiple roles (user must have at least one)
 * @Roles(EUserRole.SUPER_ADMIN, EUserRole.MODERATOR)
 * @UseGuards(RolesGuard)
 * async moderateContent() { ... }
 * ```
 */
export const Roles = (...roles: EUserRole[]): MethodDecorator & ClassDecorator => SetMetadata(ROLES_KEY, roles)
```

`src/modules/rbac/guards/index.ts`

```typescript
export * from './roles.guard'
```

`src/modules/rbac/guards/roles.guard.ts`

```typescript
/**
 * Guard that checks if the current user has the required roles to access a resource.
 * Fetches the user's current roles from the database to ensure data freshness.
 *
 * @class RolesGuard
 * @implements {CanActivate}
 */
@Injectable()
export class RolesGuard implements CanActivate {
	private readonly logger = new Logger(RolesGuard.name)

	constructor(
		private readonly reflector: Reflector,
		private readonly prisma: PrismaService,
	) {}

	/**
	 * Determines if the current user is authorized to access the resource.
	 *
	 * @param {ExecutionContext} context - The execution context.
	 * @returns {Promise<boolean>} True if the user has the required roles, false otherwise.
	 * @throws {ForbiddenException} If the user lacks the required roles.
	 */
	async canActivate(context: ExecutionContext): Promise<boolean> {
		// Get required roles from decorator metadata
		const requiredRoles = this.reflector.getAllAndOverride<RequiredRoles>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		])

		// If no roles are required, allow access
		if (!requiredRoles || requiredRoles.length === 0) {
			return true
		}

		// Extract user from GraphQL context
		const gqlContext = GqlExecutionContext.create(context)
		const request = gqlContext.getContext().req
		const user = request?.user

		// User must be authenticated
		if (!user?.id) {
			this.logger.warn('RolesGuard: No authenticated user found in request')
			throw new ForbiddenException('Authentication required to access this resource')
		}

		// Fetch fresh roles from database
		const dbUser = await this.prisma.user.findUnique({
			where: { id: user.id },
			select: {
				id: true,
				email: true,
				roles: true,
			},
		})

		if (!dbUser) {
			this.logger.error(`RolesGuard: User ${user.id} not found in database`)
			throw new ForbiddenException('User not found')
		}

		// Check if user has at least one of the required roles
		const hasRequiredRole = requiredRoles.some(role => dbUser.roles.includes(role))

		if (!hasRequiredRole) {
			this.logger.warn(
				`RolesGuard: User ${dbUser.email} lacks required roles. ` +
					`Has: [${dbUser.roles.join(', ')}], Needs one of: [${requiredRoles.join(', ')}]`,
			)
			throw new ForbiddenException(
				'Insufficient permissions. You need one of the following roles: ' + requiredRoles.join(', '),
			)
		}

		this.logger.debug(`RolesGuard: User ${dbUser.email} authorized with roles [${dbUser.roles.join(', ')}]`)

		return true
	}
}
```

`src/modules/rbac/index.ts`

```typescript
export * from './rbac.module'
export * from './guards'
export * from './decorators'
export * from './types/rbac.types'
```

`src/modules/rbac/rbac.module.ts`

```typescript
/**
 * Global module providing Role-Based Access Control (RBAC) functionality.
 * Exports guards and utilities for role-based authorization across the application.
 *
 * @module RbacModule
 */
@Global()
@Module({
	providers: [RolesGuard],
	exports: [RolesGuard],
})
export class RbacModule {}
```

`src/modules/rbac/rbac.service.ts`

```typescript
@Injectable()
export class RbacService {}
```

`src/modules/rbac/types/index.ts`

```typescript
export * from './rbac.types'
```

`src/modules/rbac/types/rbac.types.ts`

```typescript
/**
 * @fileoverview Type definitions for the RBAC (Role-Based Access Control) system.
 * @module rbac/types
 */

/**
 * Metadata key used to store required roles on a resolver or controller method.
 * This key is used by the @Roles decorator and RolesGuard.
 * @constant
 */
export const ROLES_KEY = 'roles'

/**
 * Re-export the user roles enum from Prisma for convenience.
 * This ensures consistency across the application.
 */
export { EUserRole }

/**
 * Type representing an array of roles required for access.
 */
export type RequiredRoles = EUserRole[]
```

`src/modules/security-event/index.ts`

```typescript
export * from './security-event.module'
export * from './security-event.service'
```

`src/modules/security-event/security-event.module.ts`

```typescript
/**
 * SecurityEventModule
 *
 * Global module providing centralized security event tracking across the entire platform.
 * Automatically available in all modules without explicit imports.
 *
 * Used by: Auth, 2FA, Session, Account, Recovery, WebAuthn, Passkeys, Device Management, etc.
 */
@Global()
@Module({
	providers: [SecurityEventService],
	exports: [SecurityEventService],
})
export class SecurityEventModule {}
```

`src/modules/security-event/security-event.service.ts`

```typescript
/**
 * Risk factor data structure for security event analysis
 */
export interface RiskFactor {
	/** Risk factor type (e.g., "new_device", "unusual_location") */
	type: string
	/** Risk factor description */
	description: string
	/** Risk weight (0-100) */
	weight: number
}

/**
 * Input data for creating a security event
 */
export interface CreateSecurityEventInput {
	/** User ID associated with the event */
	userId: string
	/** Type of security event */
	event: ESecurityEvent
	/** Event severity level (defaults to LOW if not provided) */
	severity?: ESecuritySeverity
	/** IP address of the request */
	ip?: string
	/** User agent string */
	userAgent?: string
	/** Geographic country */
	country?: string
	/** Geographic city */
	city?: string
	/** Device fingerprint ID */
	deviceId?: string
	/** Calculated risk score (0-100) */
	riskScore?: number
	/** Array of risk factors contributing to the score */
	riskFactors?: RiskFactor[]
	/** Additional metadata as JSON */
	metadata?: Prisma.JsonValue
}

/**
 * SecurityEventService
 *
 * Platform-wide centralized security event tracking and audit system.
 * Used across all modules (Auth, 2FA, Session, WebAuthn, Passkeys, etc.)
 * for comprehensive security monitoring and compliance.
 *
 * Enterprise features:
 * - Risk scoring with detailed factor analysis
 * - Severity-based event classification
 * - Comprehensive metadata tracking (IP, location, device)
 * - Query filtering by event type, severity, resolution status
 * - Real-time security monitoring support
 */
@Injectable()
export class SecurityEventService extends CoreService {
	constructor(i18n: I18nService, prisma: PrismaService) {
		super({ i18n, prisma })
	}

	/**
	 * Create a new security event with full metadata tracking.
	 *
	 * This method records critical security events for audit trails and real-time monitoring.
	 * All events are stored with timestamps, location data, device fingerprints, and risk analysis.
	 *
	 * @param input - Security event creation data
	 * @returns Created security event record
	 *
	 * @example
	 * ```typescript
	 * await securityEventService.create({
	 *   userId: user.id,
	 *   event: ESecurityEvent.PASSWORD_CHANGED,
	 *   severity: ESecuritySeverity.MEDIUM,
	 *   ip: req.ip,
	 *   userAgent: req.headers['user-agent'],
	 *   country: meta.location.country,
	 *   city: meta.location.city,
	 *   deviceId: meta.deviceId,
	 *   riskScore: 25,
	 *   riskFactors: [
	 *     { type: 'new_device', description: 'First time from this device', weight: 25 }
	 *   ],
	 *   metadata: { reason: 'user_initiated' }
	 * })
	 * ```
	 */
	async create(input: CreateSecurityEventInput) {
		const {
			userId,
			event,
			severity = ESecuritySeverity.LOW,
			ip,
			userAgent,
			country,
			city,
			deviceId,
			riskScore,
			riskFactors,
			metadata,
		} = input

		return this.prisma.securityEvent.create({
			data: {
				userId,
				event,
				severity,
				ip,
				userAgent,
				country,
				city,
				deviceId,
				riskScore,
				riskFactors: riskFactors ? (riskFactors as unknown as Prisma.JsonValue) : undefined,
				metadata,
			},
		})
	}

	/**
	 * Retrieve security events for a specific user with optional filtering.
	 *
	 * Supports filtering by:
	 * - Event type (login, 2FA, password operations, etc.)
	 * - Severity level (LOW, MEDIUM, HIGH, CRITICAL)
	 * - Resolution status (resolved vs. unresolved)
	 * - Date range
	 *
	 * Results are ordered by creation time (newest first) and can be paginated.
	 *
	 * @param userId - User ID to query events for
	 * @param options - Query filters and pagination
	 * @param options.event - Filter by specific event type
	 * @param options.severity - Filter by severity level
	 * @param options.resolved - Filter by resolution status
	 * @param options.take - Maximum number of results (default: 50)
	 * @param options.skip - Number of results to skip (for pagination)
	 * @returns Array of security events matching the criteria
	 *
	 * @example
	 * ```typescript
	 * // Get all unresolved high-severity events
	 * const criticalEvents = await securityEventService.findByUser(userId, {
	 *   severity: ESecuritySeverity.HIGH,
	 *   resolved: false,
	 *   take: 20
	 * })
	 *
	 * // Get password-related events
	 * const passwordEvents = await securityEventService.findByUser(userId, {
	 *   event: ESecurityEvent.PASSWORD_CHANGED
	 * })
	 * ```
	 */
	async findByUser(
		userId: string,
		options?: {
			event?: ESecurityEvent
			severity?: ESecuritySeverity
			resolved?: boolean
			take?: number
			skip?: number
		},
	) {
		const { event, severity, resolved, take = 50, skip = 0 } = options || {}

		return this.prisma.securityEvent.findMany({
			where: {
				userId,
				...(event && { event }),
				...(severity && { severity }),
				...(resolved !== undefined && { resolved }),
			},
			orderBy: {
				createdAt: 'desc',
			},
			take,
			skip,
		})
	}

	/**
	 * Mark a security event as resolved.
	 *
	 * Used by administrators or automated systems to acknowledge and resolve
	 * security events after investigation.
	 *
	 * @param eventId - Security event ID
	 * @param resolvedBy - User ID of the resolver (admin or system)
	 * @returns Updated security event
	 *
	 * @example
	 * ```typescript
	 * await securityEventService.resolve(eventId, adminUserId)
	 * ```
	 */
	async resolve(eventId: string, resolvedBy?: string) {
		return this.prisma.securityEvent.update({
			where: { id: eventId },
			data: {
				resolved: true,
				resolvedAt: new Date(),
				resolvedBy,
			},
		})
	}

	/**
	 * Calculate risk score based on multiple risk factors.
	 *
	 * This is a utility method to help compute aggregate risk scores from individual factors.
	 * The score is capped at 100 (maximum risk).
	 *
	 * @param factors - Array of risk factors with weights
	 * @returns Total risk score (0-100)
	 *
	 * @example
	 * ```typescript
	 * const score = securityEventService.calculateRiskScore([
	 *   { type: 'new_device', description: '...', weight: 30 },
	 *   { type: 'unusual_location', description: '...', weight: 40 }
	 * ])
	 * // Returns: 70
	 * ```
	 */
	calculateRiskScore(factors: RiskFactor[]): number {
		const total = factors.reduce((sum, factor) => sum + factor.weight, 0)
		return Math.min(total, 100) // Cap at 100
	}
}
```

`src/modules/security/account-lock/account-lock.module.ts`

```typescript
/**
 * Account Lock Module
 * Provides services for account lockout and progressive delay mechanisms.
 */
@Module({
	providers: [AccountLockService, SecurityEventService, NotificationService],
})
export class AccountLockModule {}
```

`src/modules/security/account-lock/account-lock.service.ts`

```typescript
/**
 * Account Lockout Service
 *
 * Manages account locking based on failed login attempts.
 * - Tracks failures using a Redis counter.
 * - Implements progressive delays to slow down attacks.
 * - Creates a persistent lock record in the database.
 * - Notifies the user about the lockout.
 */
@Injectable()
export class AccountLockService extends CoreService {
	private readonly logger = new Logger(AccountLockService.name)

	constructor(
		private readonly securityEventService: SecurityEventService,
		private readonly notificationService: NotificationService,
	) {
		super({})
	}

	/**
	 * Checks if an account is currently locked.
	 * @param userId - The ID of the user to check.
	 * @returns A promise that resolves to `true` if the account is locked, `false` otherwise.
	 */
	async isAccountLocked(userId: string): Promise<boolean> {
		const lock = await this.prisma.accountLock.findFirst({
			where: {
				userId,
				unlockedAt: null, // Lock is not manually unlocked
				OR: [
					{ expiresAt: null }, // Permanent lock
					{ expiresAt: { gt: new Date() } }, // Temporary lock has not expired
				],
			},
		})
		return !!lock
	}

	/**
	 * Increments the failed login attempt counter for a user.
	 * Applies progressive delays and triggers a lockout if the threshold is reached.
	 *
	 * @param user - The user object.
	 * @param ip - The IP address of the failed attempt.
	 * @param userAgent - The user agent of the failed attempt.
	 * @param lng - The user's language for notifications.
	 */
	async incrementFailedAttempts(user: User, ip: string, userAgent: string | undefined, lng: Language): Promise<void> {
		const key = ACCOUNT_LOCK_REDIS_KEYS.FAILED_LOGIN_ATTEMPTS(user.id)

		// Apply progressive delay if needed
		const currentAttempts = (await this.rGetNumber(key)) || 0
		const delayConfig = PROGRESSIVE_DELAYS.find(d => d.attempts === currentAttempts + 1)
		if (delayConfig) {
			this.logger.debug(`Applying progressive delay of ${delayConfig.delayMs}ms for user ${user.id}`)
			await new Promise(resolve => setTimeout(resolve, delayConfig.delayMs))
		}

		// Increment the counter
		const newAttemptCount = await this.rIncr(key, ACCOUNT_LOCK_CONFIG.FAILED_ATTEMPTS_TTL_SECONDS)

		// Check if lockout threshold is reached
		if (newAttemptCount >= ACCOUNT_LOCK_CONFIG.MAX_FAILED_ATTEMPTS) {
			this.logger.warn(`Lockout threshold reached for user ${user.id}. Locking account.`)
			await this.lockAccount(user, ip, userAgent, newAttemptCount, lng)
		}
	}

	/**
	 * Clears the failed login attempt counter for a user upon successful login.
	 * @param userId - The ID of the user.
	 */
	async clearFailedAttempts(userId: string): Promise<void> {
		const key = ACCOUNT_LOCK_REDIS_KEYS.FAILED_LOGIN_ATTEMPTS(userId)
		await this.rDel(key)
	}

	/**
	 * Locks a user account by creating a record in the database.
	 * Also logs a critical security event and notifies the user.
	 *
	 * @param user - The user to lock.
	 * @param ip - The IP address triggering the lock.
	 * @param userAgent - The user agent triggering the lock.
	 * @param failedAttempts - The final count of failed attempts.
	 * @param lng - The user's language for notifications.
	 */
	private async lockAccount(
		user: User,
		ip: string,
		userAgent: string | undefined,
		failedAttempts: number,
		lng: Language,
	): Promise<void> {
		const expiresAt = addSeconds(new Date(), ACCOUNT_LOCK_CONFIG.LOCKOUT_DURATION_SECONDS)

		await this.prisma.accountLock.create({
			data: {
				userId: user.id,
				reason: `Exceeded ${ACCOUNT_LOCK_CONFIG.MAX_FAILED_ATTEMPTS} failed login attempts.`,
				failedAttempts,
				expiresAt,
				ip,
				userAgent,
			},
		})

		// Log a critical security event
		await this.securityEventService.create({
			userId: user.id,
			event: ESecurityEvent.ACCOUNT_LOCKED,
			severity: ESecuritySeverity.CRITICAL,
			ip,
			userAgent,
			metadata: {
				reason: 'brute_force_protection',
				failedAttempts,
				lockDuration: ACCOUNT_LOCK_CONFIG.LOCKOUT_DURATION_SECONDS,
			},
		})

		// TODO: Notify the user about the account lockout.
		// This requires a new notification type and template.
		// await this.notificationService.notifyAccountLocked(user, lng);

		// Clear the Redis counter as the lock is now persistent in the DB
		await this.clearFailedAttempts(user.id)
	}
}
```

`src/modules/security/account-lock/constants/account-lock.constants.ts`

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

`src/modules/security/account-lock/constants/index.ts`

```typescript
export * from './account-lock.constants'
```

`src/modules/security/account-lock/index.ts`

```typescript
export * from './account-lock.module'
export * from './account-lock.service'
export * from './constants'
```

`src/modules/security/index.ts`

```typescript
export * from './account-lock'
export * from './rate-limit'
export * from './security.module'
```

`src/modules/security/rate-limit/constants/index.ts`

```typescript
export * from './rate-limit.constants'
```

`src/modules/security/rate-limit/constants/rate-limit.constants.ts`

```typescript
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
```

`src/modules/security/rate-limit/decorators/index.ts`

```typescript
export * from './rate-limit.decorator'
export * from './skip-rate-limit.decorator'
```

`src/modules/security/rate-limit/decorators/rate-limit.decorator.ts`

```typescript
/**
 * Rate limit decorator for endpoint-specific throttling.
 *
 * Overrides global rate limit settings for specific resolvers/mutations.
 *
 * @param options - Rate limit configuration
 *
 * @example
 * ```typescript
 * @RateLimit({ points: 5, duration: 900 }) // 5 requests per 15 minutes
 * @Mutation(() => Boolean)
 * async login(@Args('data') input: LoginInput) {
 *   // ...
 * }
 * ```
 */
export const RateLimit = (options: RateLimitOptions) => SetMetadata(RATE_LIMIT_KEY, options)
```

`src/modules/security/rate-limit/decorators/skip-rate-limit.decorator.ts`

```typescript
/**
 * Skip rate limit decorator.
 *
 * Excludes specific endpoints from global rate limiting.
 * Use sparingly - only for public health checks or internal endpoints.
 *
 * @example
 * ```typescript
 * @SkipRateLimit()
 * @Query(() => String)
 * async healthCheck() {
 *   return 'OK'
 * }
 * ```
 */
export const SkipRateLimit = () => SetMetadata(SKIP_RATE_LIMIT_KEY, true)
```

`src/modules/security/rate-limit/guards/index.ts`

```typescript
export * from './rate-limit.guard'
```

`src/modules/security/rate-limit/guards/rate-limit.guard.ts`

```typescript
/**
 * Global Rate Limit Guard
 *
 * Automatically protects all GraphQL resolvers and REST endpoints.
 * Uses IP-based throttling for unauthenticated requests,
 * User-based throttling for authenticated requests.
 *
 * Priority:
 * 1. @SkipRateLimit() - bypass completely
 * 2. @RateLimit({ ... }) - custom limits
 * 3. Global defaults from environment
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
	private readonly logger = new Logger(RateLimitGuard.name)

	constructor(
		private readonly reflector: Reflector,
		@Inject(forwardRef(() => RateLimitService))
		private readonly rateLimitService: RateLimitService,
		@Inject(forwardRef(() => SecurityEventService))
		private readonly securityEventService: SecurityEventService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// 1. Check @SkipRateLimit decorator
		const skipRateLimit = this.reflector.getAllAndOverride<boolean>(SKIP_RATE_LIMIT_KEY, [
			context.getHandler(),
			context.getClass(),
		])

		if (skipRateLimit) {
			return true
		}

		// 2. Extract request context
		const gqlContext = GqlExecutionContext.create(context)
		const ctx = gqlContext.getContext<GqlContext>()
		const request = ctx.req

		// 3. Extract IP and user info
		const ip = this.extractIP(request)
		const userId = request.user?.id

		// 4. Check blacklist/whitelist
		if (await this.rateLimitService.isBlacklisted(ip)) {
			this.logger.warn(`Blocked blacklisted IP: ${ip}`)
			throw new HttpException('Access denied', HttpStatus.FORBIDDEN)
		}

		if (await this.rateLimitService.isWhitelisted(ip)) {
			return true // Bypass rate limiting for whitelisted IPs
		}

		// 5. Get rate limit options (custom or default)
		const customOptions = this.reflector.getAllAndOverride<RateLimitOptions>(RATE_LIMIT_KEY, [
			context.getHandler(),
			context.getClass(),
		])

		const options: RateLimitOptions = customOptions || {
			points: DEFAULT_RATE_LIMIT.POINTS,
			duration: DEFAULT_RATE_LIMIT.DURATION,
			errorMessage: DEFAULT_RATE_LIMIT.ERROR_MESSAGE,
		}

		// 6. Determine rate limit key (user-based or IP-based)
		const key = userId ? `user:${userId}` : `ip:${ip}`

		// 7. Consume rate limit
		const result = await this.rateLimitService.consume(key, options.points, options.duration)

		// 8. Handle rate limit exceeded
		if (!result.isAllowed) {
			const retryAfter = Math.ceil(result.msBeforeNext / 1000)

			// Log security event
			await this.logRateLimitExceeded(userId, ip, request.headers['user-agent'], key, options)

			throw new HttpException(
				{
					statusCode: HttpStatus.TOO_MANY_REQUESTS,
					message: options.errorMessage || DEFAULT_RATE_LIMIT.ERROR_MESSAGE,
					retryAfter,
				},
				HttpStatus.TOO_MANY_REQUESTS,
			)
		}

		// 9. Add rate limit info to response headers (optional)
		if (request.res) {
			request.res.setHeader('X-RateLimit-Limit', options.points.toString())
			request.res.setHeader('X-RateLimit-Remaining', result.remaining.toString())
			request.res.setHeader('X-RateLimit-Reset', new Date(Date.now() + options.duration * 1000).toISOString())
		}

		return true
	}

	/**
	 * Extract real IP address from request
	 * Handles proxies and load balancers
	 */
	private extractIP(request: Request): string {
		return (
			(request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
			(request.headers['x-real-ip'] as string) ||
			request.connection?.remoteAddress ||
			request.socket?.remoteAddress ||
			'unknown'
		)
	}

	/**
	 * Log rate limit exceeded event
	 */
	private async logRateLimitExceeded(
		userId: string | undefined,
		ip: string,
		userAgent: string | undefined,
		key: string,
		options: RateLimitOptions,
	): Promise<void> {
		try {
			await this.securityEventService.create({
				userId: userId || 'unknown',
				event: ESecurityEvent.BRUTE_FORCE_DETECTED,
				severity: ESecuritySeverity.MEDIUM,
				ip,
				userAgent,
				metadata: {
					rateLimitKey: key,
					points: options.points,
					duration: options.duration,
					timestamp: new Date().toISOString(),
				},
			})

			this.logger.warn(`Rate limit exceeded: ${key} (${options.points}/${options.duration}s)`)
		} catch (error) {
			this.logger.error('Failed to log rate limit event:', error)
		}
	}
}
```

`src/modules/security/rate-limit/index.ts`

```typescript
export * from './constants'
export * from './decorators'
export * from './guards'
export * from './rate-limit.service'
export * from './rate-limit.module'
export * from './types'
```

`src/modules/security/rate-limit/rate-limit.module.ts`

```typescript
/**
 * Global Rate Limiting Module
 *
 * Provides application-wide request throttling with Redis backend.
 * Automatically registered as APP_GUARD in CoreModule.
 *
 * @example
 * ```typescript
 * // In your resolver:
 * @RateLimit({ points: 5, duration: 300 })
 * @Mutation(() => Boolean)
 * async sensitiveOperation() {
 *   // ...
 * }
 * ```
 */
@Global()
@Module({
	providers: [RateLimitService, RateLimitGuard, SecurityEventService],
	exports: [RateLimitService],
})
export class RateLimitModule {}
```

`src/modules/security/rate-limit/rate-limit.service.ts`

```typescript
/**
 * Rate Limiting Service
 *
 * Implements Redis-backed sliding window algorithm for request throttling.
 * Provides high-performance (<5ms) rate limit checks with configurable limits.
 *
 * @example
 * ```typescript
 * const result = await rateLimitService.consume(
 *   'user:123',
 *   5,  // points
 *   300 // duration (5 minutes)
 * )
 *
 * if (!result.isAllowed) {
 *   throw new ThrottlerException()
 * }
 * ```
 */
@Injectable()
export class RateLimitService extends CoreService {
	private readonly logger = new Logger(RateLimitService.name)

	constructor(@Inject(RedisService) redis: RedisService) {
		super({ redis })
	}

	/**
	 * Consume points for a specific key using sliding window algorithm.
	 *
	 * This method implements a Redis-backed sliding window counter:
	 * 1. Stores each request timestamp in a ZSET
	 * 2. Removes expired entries (older than duration)
	 * 3. Counts remaining entries in current window
	 * 4. Allows request if count < points
	 *
	 * @param key - Unique identifier (e.g., 'ip:192.168.1.1' or 'user:uuid')
	 * @param points - Maximum requests allowed in window
	 * @param duration - Time window in seconds
	 * @param keyPrefix - Optional Redis key prefix (defaults to global namespace)
	 * @returns Rate limit check result
	 *
	 * @performance Target: <5ms per check
	 */
	async consume(
		key: string,
		points: number,
		duration: number,
		keyPrefix: string = RATE_LIMIT_PREFIX.GLOBAL,
	): Promise<RateLimitResponse> {
		const now = Date.now()
		const windowStart = now - duration * 1000
		const redisKey = `${keyPrefix}${key}`

		try {
			const client = this.redisClient

			// 1. Remove expired entries (older than window start)
			await client.zRemRangeByScore(redisKey, 0, windowStart)

			// 2. Get current count in window
			const currentCount = await client.zCard(redisKey)

			// 3. Check if limit exceeded
			if (currentCount >= points) {
				// Get oldest entry to calculate retry time
				const oldestEntries = await client.zRange(redisKey, 0, 0, { REV: false })
				const oldestTimestamp = oldestEntries.length > 0 ? parseInt(oldestEntries[0], 10) : now
				const msBeforeNext = Math.max(0, oldestTimestamp + duration * 1000 - now)

				return {
					isAllowed: false,
					remaining: 0,
					msBeforeNext,
					consumed: currentCount,
				}
			}

			// 4. Add current request timestamp
			await client.zAdd(redisKey, { score: now, value: `${now}` })

			// 5. Set expiration on key (cleanup)
			await client.expire(redisKey, duration)

			const consumed = currentCount + 1

			return {
				isAllowed: true,
				remaining: Math.max(0, points - consumed),
				msBeforeNext: 0,
				consumed,
			}
		} catch (error) {
			this.logger.error(`Rate limit check failed for key ${key}:`, error)

			// Fail-open strategy: allow request on Redis errors to prevent service disruption
			return {
				isAllowed: true,
				remaining: points,
				msBeforeNext: 0,
				consumed: 0,
			}
		}
	}

	/**
	 * Check if IP is whitelisted (bypasses rate limiting)
	 */
	async isWhitelisted(ip: string): Promise<boolean> {
		try {
			return (await this.redis?.sIsMember(RATE_LIMIT_LISTS.WHITELIST_KEY, ip)) ?? false
		} catch {
			return false
		}
	}

	/**
	 * Check if IP is blacklisted (permanently blocked)
	 */
	async isBlacklisted(ip: string): Promise<boolean> {
		try {
			return (await this.redis?.sIsMember(RATE_LIMIT_LISTS.BLACKLIST_KEY, ip)) ?? false
		} catch {
			return false
		}
	}

	/**
	 * Add IP to whitelist
	 */
	async addToWhitelist(ip: string): Promise<void> {
		await this.redis?.sAdd(RATE_LIMIT_LISTS.WHITELIST_KEY, ip)
		this.logger.log(`IP ${ip} added to whitelist`)
	}

	/**
	 * Add IP to blacklist
	 */
	async addToBlacklist(ip: string): Promise<void> {
		await this.redis?.sAdd(RATE_LIMIT_LISTS.BLACKLIST_KEY, ip)
		this.logger.warn(`IP ${ip} added to blacklist`)
	}

	/**
	 * Remove IP from whitelist
	 */
	async removeFromWhitelist(ip: string): Promise<void> {
		await this.redis?.sRem(RATE_LIMIT_LISTS.WHITELIST_KEY, ip)
	}

	/**
	 * Remove IP from blacklist
	 */
	async removeFromBlacklist(ip: string): Promise<void> {
		await this.redis?.sRem(RATE_LIMIT_LISTS.BLACKLIST_KEY, ip)
	}
}
```

`src/modules/security/rate-limit/types/index.ts`

```typescript
export * from './rate-limit.types'
```

`src/modules/security/rate-limit/types/rate-limit.types.ts`

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

`src/modules/security/security.module.ts`

```typescript
/**
 * Main Security Module (Global)
 *
 * This module bundles all security-related features, making them available
 * application-wide. It includes:
 * - RateLimitModule: For request throttling and brute-force protection.
 * - AccountLockModule: For account lockout mechanisms.
 *
 * Being global, its providers (like services and guards) are available for
 * dependency injection in any other module without needing to import SecurityModule.
 */
@Global()
@Module({
	imports: [RateLimitModule, AccountLockModule],
	exports: [RateLimitModule, AccountLockModule],
})
export class SecurityModule {}
```

`src/shared/decorators/auth.decorator.ts`

```typescript
export function Authorization() {
	return applyDecorators(UseGuards(GqlAuthGuard))
}
```

`src/shared/decorators/authorized.decorator.ts`

```typescript
export const Authorized = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
	let user: User

	if (ctx.getType() === 'http') {
		const req = ctx.switchToHttp().getRequest<{ user: User }>()
		user = req.user
	} else {
		const context = GqlExecutionContext.create(ctx)
		const gqlContext = context.getContext<{ req: { user: User } }>()
		user = gqlContext.req.user

		if (!user) return null
	}

	return data ? user[data] : user
})
```

`src/shared/decorators/index.ts`

```typescript
export * from './auth.decorator'
export * from './authorized.decorator'
export * from './user-agent.decorator'
```

`src/shared/decorators/user-agent.decorator.ts`

```typescript
export const UserAgent = createParamDecorator((data: unknown, context: ExecutionContext) => {
	if (context.getType() === 'http') {
		const request = context.switchToHttp().getRequest<Request>()

		return request.headers['user-agent']
	} else {
		const ctx = GqlExecutionContext.create(context)
		const gqlContext = ctx.getContext<{ req?: Request }>()

		return gqlContext.req?.headers['user-agent'] ?? null
	}
})
```

`src/shared/guards/gql-auth.guard.ts`

```typescript
@Injectable()
export class GqlAuthGuard implements CanActivate {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly i18n: I18nService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const gqlContext = ctx.getContext<{ req: { session: { userId?: string }; language?: string; user?: any } }>()
		const request = gqlContext.req
		const lang = request.language || DEFAULT_LANGUAGE

		const user_not_authorized: string =
			this.i18n.t('common.errors.auth.user_not_authorized', { lng: lang }) || 'User not authorized'

		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException(user_not_authorized)
		}

		const user = await this.prismaService.user.findUnique({
			where: { id: request.session.userId },
		})

		if (!user) {
			throw new UnauthorizedException(user_not_authorized)
		}

		request.user = user

		return true
	}
}
```

`src/shared/guards/index.ts`

```typescript
export * from './gql-auth.guard'
```

`src/shared/middlewares/index.ts`

```typescript
export * from './raw-body.middleware'
```

`src/shared/middlewares/raw-body.middleware.ts`

```typescript
@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
	constructor(private readonly i18n: I18nService) {}
	use(req: Request, res: Response, next: NextFunction) {
		const lang = req.language || DEFAULT_LANGUAGE
		if (!req.readable) {
			const message =
				this.i18n.t('common.errors.request.invalid_data', { lng: lang }) || 'Invalid data from request'
			return next(new BadRequestException(message))
		}

		getRawBody(req, { encoding: 'utf-8' })
			.then(rawBody => {
				req.body = rawBody
				next()
			})
			.catch(() => {
				const message =
					this.i18n.t('common.errors.request.error_getting_raw_body', { lng: lang }) ||
					'Error getting raw body'
				return next(new InternalServerErrorException(message))
			})
	}
}
```

`src/shared/pipes/file-validation.pipe.ts`

```typescript
/** Минимальный контракт GraphQL Upload (graphql-upload) */
export type GqlUpload = {
	filename: string
	mimetype?: string
	encoding?: string
	createReadStream: () => Readable
}

/** Тайп-гарда для аплоада */
function isGqlUpload(x: unknown): x is GqlUpload {
	if (typeof x !== 'object' || x === null) return false
	const o = x as Record<string, unknown>
	if (!('filename' in o) || !('createReadStream' in o)) return false

	const filename = o.filename
	const createReadStream = o.createReadStream

	return typeof filename === 'string' && typeof createReadStream === 'function'
}

/** Расширенный тип: тот же объект, но с «переписанным» createReadStream на буфер */
export type BufferedUpload = Omit<GqlUpload, 'createReadStream'> & {
	createReadStream: () => Readable
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
	constructor(private readonly i18n: I18nService) {}

	async transform(value: unknown, _metadata: ArgumentMetadata): Promise<BufferedUpload> {
		// 1) Проверяем форму входа
		if (!isGqlUpload(value)) {
			const message =
				this.i18n.t('common.errors.file.not_loaded', { lng: DEFAULT_LANGUAGE }) ??
				'File not loaded or invalid structure'
			throw new BadRequestException(message)
		}

		const { filename, createReadStream } = value

		// 2) Проверяем формат по расширению (или можно по mimetype, если он приходит)
		const allowedExt: Array<'jpg' | 'jpeg' | 'png' | 'webp' | 'gif'> = ['jpg', 'jpeg', 'png', 'webp', 'gif']
		const okFormat = validateFileFormat(filename, allowedExt)
		if (!okFormat) {
			const message =
				this.i18n.t('common.errors.file.unsupported_format', { lng: DEFAULT_LANGUAGE }) ??
				'Unsupported file format'
			throw new BadRequestException(message)
		}

		// 3) Считываем в буфер и проверяем размер
		const originalStream = createReadStream()
		const fileBuffer = await streamToBuffer(originalStream)

		const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
		if (fileBuffer.length > MAX_SIZE_BYTES) {
			const message =
				this.i18n.t('common.errors.file.size_exceeded_10mb', { lng: DEFAULT_LANGUAGE }) ??
				'File size exceeds 10 MB'
			throw new BadRequestException(message)
		}

		// 4) Подменяем stream на «буферный» (чтобы можно было читать повторно)
		const buffered: BufferedUpload = {
			...value,
			createReadStream: () => bufferToStream(fileBuffer),
		}

		return buffered
	}
}

// import { DEFAULT_LANGUAGE, I18nService } from '@/core'
// import { type ArgumentMetadata, BadRequestException, Injectable, type PipeTransform } from '@nestjs/common'

// import { bufferToStream, streamToBuffer, validateFileFormat } from '../utils'

// @Injectable()
// export class FileValidationPipe implements PipeTransform {
// 	constructor(private readonly i18n: I18nService) {}

// 	async transform(value: any, _metadata: ArgumentMetadata) {
// 		if (!value?.filename || typeof value.createReadStream !== 'function') {
// 			// Преобразуем текущий контекст в ArgumentsHost

// 			// Пытаемся получить язык (если его явно не передали — fallback)
// 			const message =
// 				this.i18n.t('common.errors.file.not_loaded', { lng: DEFAULT_LANGUAGE }) ||
// 				'File not loaded or invalid structure'
// 			throw new BadRequestException(message)
// 		}

// 		const { filename, createReadStream } = value

// 		const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif']
// 		const isFileFormatValid = validateFileFormat(filename, allowedFormats)
// 		if (!isFileFormatValid) {
// 			const message =
// 				this.i18n.t('common.errors.file.unsupported_format', { lng: DEFAULT_LANGUAGE }) ||
// 				'Unsupported file format'
// 			throw new BadRequestException(message)
// 		}

// 		const originalStream = createReadStream()
// 		const fileBuffer = await streamToBuffer(originalStream)

// 		// Check file size (less 10 MB)
// 		const maxSize = 10 * 1024 * 1024
// 		if (fileBuffer.length > maxSize) {
// 			const message =
// 				this.i18n.t('common.errors.file.size_exceeded_10mb', { lng: DEFAULT_LANGUAGE }) ||
// 				'File size exceeds 10 MB'
// 			throw new BadRequestException(message)
// 		}

// 		value.createReadStream = () => bufferToStream(fileBuffer)

// 		return value
// 	}
// }
```

`src/shared/pipes/index.ts`

```typescript
export * from './file-validation.pipe'
```

`src/shared/types/express-session.d.ts`

```typescript
// Предполагается, что этот тип существует. Если нет, замените на `any` или создайте его.

/**
 * @fileoverview Extends the default express-session SessionData interface
 * to include custom properties for our application.
 * This uses TypeScript's declaration merging feature.
 */

declare module 'express-session' {
	interface SessionData {
		/** The unique identifier of the logged-in user */
		userId?: string

		/** The timestamp when the session was created */
		createdAt?: Date

		/** Additional metadata about the session */
		metadata?: ISessionMetadata

		/** Flag indicating if 2FA has been verified for this session */
		is2FAVerified?: boolean

		/** When 2FA was verified */
		verified2FAAt?: Date
	}
}

export {}
```

`src/shared/types/express.d.ts`

```typescript
declare global {
	namespace Express {
		interface Request {
			/**
			 * Preferred language (i18n middleware may set this)
			 */
			language?: string
		}
	}
}
```

`src/shared/types/gql-context.types.ts`

```typescript
/**
 * The authenticated user object attached to the request,
 * with sensitive fields like 'password' omitted.
 * Using a `type` alias is the correct approach for transformations like Omit.
 */
export type AuthenticatedUser = Omit<PrismaUser, 'password'>

/**
 * Extends the base Express Request interface to include our custom properties,
 * ensuring type safety throughout the application.
 */
export interface AuthenticatedRequest extends Request {
	/**
	 * The authenticated user object, attached by an authentication guard/middleware.
	 */
	user?: AuthenticatedUser

	/**
	 * The session object, now correctly typed with our custom fields
	 * thanks to declaration merging in `session.types.ts`.
	 */
	session: Request['session']
}

/**
 * The GraphQL context object, providing typed access to the request and response.
 */
export interface GqlContext {
	req: AuthenticatedRequest
	res: Response
}
```

`src/shared/types/index.ts`

```typescript
export * from './gql-context.types'
export * from './session-metadata.types'
```

`src/shared/types/session-metadata.types.ts`

```typescript
export interface ILocation {
	country: string
	city: string
	latitude: number
	longitude: number
}

export interface IDevice {
	browser: string
	os: string
	type: string
}

export interface ISessionMetadata {
	location: ILocation
	device: IDevice
	ip: string
}
```

`src/shared/utils/errors/error.ts`

```typescript
/**
 * Тип JSON-примитива, который гарантированно сериализуем в строку без вложенных структур.
 */
type JsonPrimitive = string | number | boolean | null

/**
 * Узкий тайп-гарда для проверки, что значение — экземпляр Error.
 * @param x Любое значение неизвестного типа.
 * @returns true, если x — Error.
 */
function isError(x: unknown): x is Error {
	return x instanceof Error
}

/**
 * Тайп-гарда: является ли значение непустым объектом (Record).
 * Массивы и функции не исключаются — это ожидаемое поведение для JSON.stringify.
 * @param x Любое значение.
 * @returns true, если x — объект и не null.
 */
function isRecord(x: unknown): x is Record<string, unknown> {
	return typeof x === 'object' && x !== null
}

/**
 * Безопасно сериализует «что угодно» в строку для логов:
 * - Для `Error` формирует JSON c `name`, `message`, `stack` и рекурсивно сериализует `cause`;
 * - Для примитивов (string/number/boolean/null/undefined) возвращает строковое представление;
 * - Для объектов пытается `JSON.stringify` с защитой от циклов и поддержкой BigInt;
 * - В крайнем случае возвращает тег вида `"[object Something]"`.
 *
 * Гарантирует возвращаемый тип `string` и не использует небезопасных приведения типов.
 *
 * @param x Любое значение (обычно то, что пришло в `catch` как `unknown`).
 * @returns Строка, пригодная для логгирования.
 *
 * @example
 * serializeUnknown(new Error('boom'))
 * // => '{"name":"Error","message":"boom","stack":"..."}'
 *
 * serializeUnknown({ a: 1, self: ref })
 * // => '{"a":1,"self":"[Circular]"}'
 */
export function serializeUnknown(x: unknown): string {
	if (isError(x)) {
		const base: Record<string, JsonPrimitive> = {
			name: x.name,
			message: x.message,
			stack: x.stack ?? null,
		}
		const maybeCause = (x as { cause?: unknown }).cause
		if (typeof maybeCause !== 'undefined') {
			base.cause = serializeUnknown(maybeCause)
		}
		return JSON.stringify(base)
	}

	if (typeof x === 'string') return x
	if (typeof x === 'number') return `${x}`
	if (typeof x === 'boolean') return x ? 'true' : 'false'
	if (x === null) return 'null'
	if (x === undefined) return 'undefined'

	try {
		const json = JSON.stringify(x, createCycleReplacer())
		if (typeof json === 'string') return json
	} catch {
		// ignore
	}
	return objectTag(x) // ← всегда string, без no-unsafe-return
}

/**
 * Создаёт `replacer` для `JSON.stringify`, который:
 * 1) защищает от циклических ссылок, подставляя строку "[Circular]";
 * 2) сериализует BigInt как строку (по умолчанию JSON не умеет BigInt).
 *
 * Используется внутри `serializeUnknown` и `safeStringify`.
 *
 * @returns Функция-заменитель, совместимая с параметром `replacer` JSON.stringify.
 */
function createCycleReplacer() {
	const seen = new WeakSet<object>()
	return (_key: string, value: unknown) => {
		if (isRecord(value)) {
			if (seen.has(value)) return '[Circular]'
			seen.add(value)
		}
		if (typeof value === 'bigint') return value.toString()
		return value
	}
}

/**
 * Упрощённая версия безопасной сериализации для «обычных» значений.
 * Отличается от `serializeUnknown` тем, что не разбирает Error детально,
 * а пытается получить JSON-строку или отдаёт тег вида `"[object Something]"`.
 *
 * Полезно, когда не нужен подробный разбор ошибок, а достаточно «что-то логопригодное».
 *
 * @param x Любое значение.
 * @returns Строка (гарантированно).
 *
 * @example
 * safeStringify({a:1})         // '{"a":1}'
 * safeStringify(new Set([1]))  // '"[object Set]"' (если JSON не справился)
 */
export function safeStringify(x: unknown): string {
	if (typeof x === 'string') return x
	try {
		const json = JSON.stringify(x, createCycleReplacer()) // string | undefined
		if (typeof json === 'string') return json
	} catch {
		// ignore
	}
	return objectTag(x) // ← строго string
}
```

`src/shared/utils/errors/index.ts`

```typescript
export * from './error'
export * from './log'
export * from './prisma-errors'
export * from './tag'
```

`src/shared/utils/errors/log.ts`

```typescript
/**
 * Логирует ошибку неизвестного типа в формате, корректном для Nest `Logger`.
 *
 * - Если `err` — экземпляр `Error`, стек передаётся **отдельным аргументом**,
 *   чтобы логгер отформатировал его нативно (со стэктрейсом).
 * - Если `err` не `Error` (строка, число, объект, `null`/`undefined` и т.п.),
 *   значение сериализуется через `safeStringify` (c защитой от циклов/BigInt).
 *
 * @param logger  Экземпляр Nest `Logger` (например, `new Logger(RedisService.name)`).
 * @param prefix  Короткий префикс/сообщение (контекст ошибки), например: `"Redis connect error"`.
 * @param err     Любое значение из `catch` (тип `unknown`).
 * @param context Необязательный контекст для Nest Logger (обычно имя класса/сервиса).
 *
 * @example
 * const logger = new Logger(RedisService.name)
 * try {
 *   await client.connect()
 * } catch (e) {
 *   logUnknownError(logger, 'Redis connect error', e, RedisService.name)
 * }
 *
 * // Вывод:
 * // [Error] Redis connect error
 * // <stack trace>  // если err instanceof Error
 * //
 * // или
 * // Redis connect error: {"foo":"bar"}  // для произвольных значений
 */
export function logUnknownError(logger: Logger, prefix: string, err: unknown, context?: string): void {
	if (err instanceof Error) {
		logger.error(prefix, err.stack, context)
	} else {
		logger.error(`${prefix}: ${safeStringify(err)}`, undefined, context)
	}
}
```

`src/shared/utils/errors/prisma-errors.ts`

```typescript
export function isPrismaError(e: unknown, code?: string): e is Prisma.PrismaClientKnownRequestError {
	const err = e as Prisma.PrismaClientKnownRequestError
	return !!err && err.name === 'PrismaClientKnownRequestError' && (code ? err.code === code : true)
}
```

`src/shared/utils/errors/tag.ts`

```typescript
/**
 * Типобезопасная обёртка над `Object.prototype.toString.call(v)`.
 * Нужна, чтобы избежать предупреждений `no-unsafe-return`/`no-unsafe-call` и
 * всегда возвращать строго `string`.
 *
 * @example
 * objectTag(123)            // "[object Number]"
 * objectTag(new Date())     // "[object Date]"
 */
export const objectTag = (v: unknown): string => {
	// call() действительно возвращает any — сузим тип локально
	const s = Object.prototype.toString.call(v) as string
	return s
}
```

`src/shared/utils/file.util.ts`

```typescript
/**
 * Checks if the uploaded file format is valid
 * @param filename - the file's name
 * @param allowedFileFormats - an array of allowed file extensions (e.g., ['jpg','png','gif'])
 * @returns true if the extension is allowed, otherwise false
 */
export function validateFileFormat(filename: string, allowedFileFormats: string[]) {
	const fileParts = filename.split('.')
	const extension = fileParts[fileParts.length - 1]?.toLowerCase()

	return allowedFileFormats.includes(extension)
}

/**
 * Converts a Readable stream into a single Buffer by collecting all chunks.
 * @param stream - The Readable stream to be consumed
 * @returns A Promise that resolves to a Buffer containing all the data from the stream
 */
export function streamToBuffer(stream: Readable): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = []

		stream.on('data', chunk => {
			chunks.push(chunk)
		})

		stream.on('end', () => {
			resolve(Buffer.concat(chunks))
		})

		stream.on('error', err => {
			reject(err)
		})
	})
}

/**
 * Creates a new Readable stream from a given Buffer.
 * @param buffer - The Buffer to be converted into a stream
 * @returns A Readable stream that will emit the contents of the buffer
 */
export function bufferToStream(buffer: Buffer): Readable {
	const readable = new Readable()
	readable.push(buffer)
	readable.push(null) // Signifies the end of the stream
	return readable
}
```

`src/shared/utils/generate-token.util.ts`

```typescript
const TOKEN_TTL_MS = 5 * 60 * 1000 // 5 минут

/**
 * Function for generation uuid or numeric code
 * Генерация токена (UUID или 6-значный код) и сохранение в БД.
 * Если для пары (userId, type) токен уже существует — заменяем на новый.
 * @param prisma - prisma service
 * @param user - current user
 * @param type - token type
 * @param isUUID - if true then generate uuid if false (default) generate numeric code from 6 letters
 * @returns return new token
 *
 * Требования к схеме (рекомендовано):
 *   - уникальный составной индекс: @@unique([userId, type], name: "token_user_type_unique")
 */
export async function generateToken(
	prisma: PrismaService,
	user: User,
	type: ETokenType,
	isUUID: boolean = true,
): Promise<Token> {
	const token = isUUID ? randomUUID() : generateNumericCode(6)
	const expiresIn = new Date(Date.now() + TOKEN_TTL_MS)

	// Если в схеме есть @@unique([userId, type]) — используем upsert.
	// Иначе — можешь оставить delete/create как было.
	return prisma.token.upsert({
		where: { userId_type: { userId: user.id, type } }, // <- имя поля под твой @@unique
		update: { token, expiresIn },
		create: {
			token,
			expiresIn,
			type,
			user: { connect: { id: user.id } },
		},
	})
}

/** Генератор криптографически стойкого числового кода нужной длины. */
function generateNumericCode(length: number): string {
	if (length <= 0) return ''
	// Диапазон: [10^(len-1), 10^len - 1]
	const min = 10 ** (length - 1)
	const max = 10 ** length - 1
	// randomInt(min, max + 1) — включительно сверху
	return String(randomInt(min, max + 1))
}
```

`src/shared/utils/hash.util.ts`

```typescript
/**
 * Утилита для хеширования с использованием Argon2id
 * Argon2id - рекомендуемый вариант, объединяющий защиту от GPU и side-channel атак
 */
export class HashUtil {
	// Конфигурация Argon2id (OWASP рекомендации 2023)
	private static readonly config = {
		memoryCost: 19456, // 19 MiB (в KiB)
		timeCost: 2, // 2 итерации
		parallelism: 1, // Количество потоков
	}

	/**
	 * Хеширование строки
	 * @param plaintext - Исходная строка
	 * @returns Хешированная строка в формате Argon2
	 */
	static async hash(plaintext: string): Promise<string> {
		return Promise.resolve(
			hash(plaintext, {
				memoryCost: this.config.memoryCost,
				timeCost: this.config.timeCost,
				parallelism: this.config.parallelism,
			}),
		)
	}

	/**
	 * Верификация строки
	 * @param hash - Хеш для проверки
	 * @param plaintext - Исходная строка
	 * @returns true если совпадает
	 */
	static async verify(hash: string, plaintext: string): Promise<boolean> {
		try {
			return verify(hash, plaintext)
		} catch {
			// Если хеш некорректный, возвращаем false
			return false
		}
	}

	/**
	 * Проверка необходимости rehash (если параметры устарели)
	 * @param hash - Текущий хеш
	 * @returns true если нужен rehash
	 */
	static needsRehash(hash: string): boolean {
		try {
			// Формат Argon2: $argon2id$v=19$m=19456,t=2,p=1$...
			const params = hash.split('$')
			if (params.length < 5) return true

			const config = params[3]
			if (!config) return true

			const configParts = config.split(',')

			const m = parseInt(configParts[0]?.split('=')[1] ?? '0', 10)
			const t = parseInt(configParts[1]?.split('=')[1] ?? '0', 10)
			const p = parseInt(configParts[2]?.split('=')[1] ?? '0', 10)

			return m !== this.config.memoryCost || t !== this.config.timeCost || p !== this.config.parallelism
		} catch {
			return true
		}
	}
}
```

`src/shared/utils/index.ts`

```typescript
export * from './errors'
export * from './is-dev.util'
export * from './ms.util'
export * from './parse-boolean.util'
export * from './session-metadata.util'
export * from './session.util'
export * from './generate-token.util'
export * from './file.util'
export * from './hash.util'
```

`src/shared/utils/is-dev.util.ts`

```typescript
dotenv.config()

export const isDev = (configService: ConfigService) => configService.getOrThrow<string>('NODE_ENV') === 'development'

export const IS_DEV_ENV = process.env.NODE_ENV === 'development'
```

`src/shared/utils/ms.util.ts`

```typescript
// Определение констант для различных единиц времени
const s = 1000
const m = s * 60
const h = m * 60
const d = h * 24
const w = d * 7
const y = d * 365.25

// Тип для различных единиц времени
type Unit =
	| 'Years'
	| 'Year'
	| 'Yrs'
	| 'Yr'
	| 'Y'
	| 'Weeks'
	| 'Week'
	| 'W'
	| 'Days'
	| 'Day'
	| 'D'
	| 'Hours'
	| 'Hour'
	| 'Hrs'
	| 'Hr'
	| 'H'
	| 'Minutes'
	| 'Minute'
	| 'Mins'
	| 'Min'
	| 'M'
	| 'Seconds'
	| 'Second'
	| 'Secs'
	| 'Sec'
	| 's'
	| 'Milliseconds'
	| 'Millisecond'
	| 'Msecs'
	| 'Msec'
	| 'Ms'

// Тип для единиц времени в любом регистре
type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>

// Тип для строкового значения, которое может содержать число и необязательную единицу времени
export type StringValue = `${number}` | `${number}${UnitAnyCase}` | `${number} ${UnitAnyCase}`

/**
 * Преобразует строковое значение, представляющее время, в миллисекунды.
 *
 * @param str - Строка, представляющая количество времени, например, "1 hour", "60s", "500 milliseconds".
 * @returns Количество миллисекунд, соответствующее указанному времени.
 * @throws {Error} Если строка не соответствует ожидаемому формату или если единица времени не распознана.
 *
 * @example
 * ms('1 minute'); // вернет 60000
 * ms('2 hours'); // вернет 7200000
 * ms('500 ms'); // вернет 500
 */
export function ms(str: StringValue): number {
	// Проверка входных данных
	if (typeof str !== 'string' || str.length === 0 || str.length > 100) {
		throw new Error('Value provided to ms() must be a string with length between 1 and 99.')
	}

	// Регулярное выражение для сопоставления строки с числом и необязательной единицей времени
	const match =
		/^(?<value>-?(?:\d+)?\.?\d+) *(?<type>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
			str,
		)

	// Извлечение значения и типа из совпадения
	const groups = match?.groups as { value: string; type?: string } | undefined
	if (!groups) {
		return NaN
	}
	const n = parseFloat(groups.value)
	const type = (groups.type || 'ms').toLowerCase() as Lowercase<Unit>

	// Преобразование строкового значения в миллисекунды в зависимости от единицы времени
	switch (type) {
		case 'years':
		case 'year':
		case 'yrs':
		case 'yr':
		case 'y':
			return n * y
		case 'weeks':
		case 'week':
		case 'w':
			return n * w
		case 'days':
		case 'day':
		case 'd':
			return n * d
		case 'hours':
		case 'hour':
		case 'hrs':
		case 'hr':
		case 'h':
			return n * h
		case 'minutes':
		case 'minute':
		case 'mins':
		case 'min':
		case 'm':
			return n * m
		case 'seconds':
		case 'second':
		case 'secs':
		case 'sec':
		case 's':
			return n * s
		case 'milliseconds':
		case 'millisecond':
		case 'msecs':
		case 'msec':
		case 'ms':
			return n
		default:
			throw new Error(
				`Error: time unit ${type} was recognized, but there is no corresponding case. Please check the input data.`,
			)
	}
}
```

`src/shared/utils/parse-boolean.util.ts`

```typescript
/**
 * Преобразует строковое значение в логическое значение (boolean).
 *
 * Эта функция принимает строку, представляющую логическое значение,
 * и возвращает соответствующее логическое значение. Если строка равна
 * "true" (игнорируя регистр), функция вернет `true`. Если строка равна
 * "false", функция вернет `false`. Если передано значение другого типа
 * или строка не соответствует ожидаемым значениям, будет выброшено
 * исключение.
 *
 * @param value - Строка, представляющая логическое значение ("true" или "false").
 * @returns {boolean} Логическое значение, соответствующее переданной строке.
 * @throws {Error} Если переданное значение не может быть преобразовано в логическое значение.
 *
 * @example
 * parseBoolean('true');  // вернет true
 * parseBoolean('false'); // вернет false
 * parseBoolean('TRUE');  // вернет true
 * parseBoolean('False'); // вернет false
 */
export function parseBoolean(value: string): boolean {
	if (typeof value === 'boolean') {
		return value
	}

	if (typeof value === 'string') {
		const lowerValue = value.trim().toLowerCase()
		if (lowerValue === 'true') {
			return true
		}
		if (lowerValue === 'false') {
			return false
		}
	}

	throw new Error(`Не удалось преобразовать значение "${value}" в логическое значение.`)
}
```

`src/shared/utils/session.util.ts`

```typescript
/**
 * Save user session and set userId, metadata, createdAt
 * @param req - request
 * @param user - current user
 * @param metadata - user's metadata
 * @returns - user
 */
export function saveSession(req: Request, user: User, metadata: ISessionMetadataDTO) {
	const lang = req.language || DEFAULT_LANGUAGE

	return new Promise<{ user: User }>((resolve, reject) => {
		if (!req.session) {
			const message =
				i18n.t('common.errors.session.not_initialized', { lng: lang }) || 'Session is not initialized'
			return reject(new InternalServerErrorException(message))
		}

		req.session.createdAt = new Date()
		req.session.userId = user.id
		req.session.metadata = metadata

		req.session.save(err => {
			if (err) {
				const message = i18n.t('common.errors.session.save_error', { lng: lang }) || 'Error saving session'
				return reject(new InternalServerErrorException(message))
			}
			resolve({ user })
		})
	})
}

/**
 * Destroy session from cookie and redis
 * @param req - request
 * @param configService - config service
 * @returns boolean
 */
export function destroySession(req: Request, configService: ConfigService): Promise<boolean> {
	const lang = req.language || DEFAULT_LANGUAGE

	return new Promise<boolean>((resolve, reject) => {
		if (!req.session) {
			// если сессии нет — считать уничтоженной
			return resolve(true)
		}

		req.session.destroy(err => {
			if (err) {
				const message =
					i18n.t('common.errors.session.destroy_error', { lng: lang }) || 'Error destroying session'
				return reject(new InternalServerErrorException(message))
			}

			// req.res может быть undefined в некоторых контекстах (тесты/скрипты)
			const sessionCookieName = configService.get<string>('SESSION_NAME')
			if (sessionCookieName && req.res?.clearCookie) {
				req.res.clearCookie(sessionCookieName)
			}

			resolve(true)
		})
	})
}
```
