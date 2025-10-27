# Full App Code (excluding imports, tests, i18n) - Part 1 of 6

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
