# Full App Code (excluding imports, tests, i18n) - Part 4 of 6

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
