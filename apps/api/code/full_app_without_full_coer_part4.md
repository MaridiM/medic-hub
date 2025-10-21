# Full App Code (excluding imports, tests, i18n, extra core) - Part 4 of 8

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
	providers: [SessionResolver, SessionService, VerificationService, SecurityEventService],
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




`src/modules/auth/session/session.service.ts`


```typescript
/**
 * SessionService
 * Handles user session management:
 * - Login (password verification, email check, session creation)
 * - Logout (session destruction)
 * - Session reading and listing
 * - Session removal
 * - Cookie management
 * - Bulk session invalidation (for security events like password changes)
 *
 * Enterprise features:
 * - Tracks lastLoginAt and lastLoginIp
 * - Supports 2FA verification status in sessions
 * - Uses Redis for session storage
 * - Rate limiting and security event logging (TODO)
 */
@Injectable()
export class SessionService extends CoreService {
	/** Redis key prefix for sessions */
	private readonly prefix: string
	/** Cookie name for express-session */
	private readonly cookieName: string

	constructor(
		prisma: PrismaService,
		redis: RedisService,
		i18n: I18nService,
		config: ConfigService,
		private readonly verification: VerificationService,
	) {
		super(i18n, prisma, redis, config)
		this.prefix = this.config.get<string>('SESSION_FOLDER') ?? 'session:'
		this.cookieName = this.config.get<string>('SESSION_COOKIE') ?? 'connect.sid'
	}

	/**
	 * Build Redis key for a session ID.
	 * @param sessionId - Session identifier
	 * @returns Full Redis key
	 */
	private key(sessionId: string): string {
		return `${this.prefix}${sessionId}`
	}

	/**
	 * Authenticate user and create a session.
	 * - Verifies email and password
	 * - Enforces email verification requirement
	 * - Updates lastLoginAt and lastLoginIp
	 * - Creates session in Redis
	 *
	 * @param req - HTTP request object
	 * @param userAgent - User agent string
	 * @param data - Login credentials
	 * @param lng - Language code for i18n
	 * @returns Login response with user data
	 * @throws NotFoundException if user not found or password invalid
	 * @throws BadRequestException if email not verified
	 */
	async login(req: Request, userAgent: string, data: LoginInput, lng: Language): Promise<LoginResponse> {
		const user = await this.prisma.user.findUnique({
			where: { email: data.email },
		})

		if (!user) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.user.not_found', { lng, defaultValue: 'User not found' }),
			)
		}

		const ok = await HashUtil.verify(user.password, data.password)
		if (!ok) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.password.invalid', { lng, defaultValue: 'Invalid password' }),
			)
		}

		if (!user.isEmailVerified) {
			// Resend verification email (non-blocking)
			await this.verification.sendEmailVerificationToken(user, lng).catch(() => {})

			throw new BadRequestException(
				this.i18n.t('auth.errors.account.not_verified', {
					lng,
					defaultValue: 'Account not verified. Please check your email for verification',
				}),
			)
		}

		// Update last login tracking
		const meta = getSessionMetadata(req, userAgent)
		await this.prisma.user.update({
			where: { id: user.id },
			data: {
				lastLoginAt: new Date(),
				lastLoginIp: meta.ip,
			},
		})

		// Create session
		return saveSession(req, user, meta)
	}

	/**
	 * Destroy the current session (logout).
	 *
	 * @param req - HTTP request object
	 * @returns true if session destroyed successfully
	 */
	async logout(req: Request): Promise<boolean> {
		return destroySession(req, this.config)
	}

	/**
	 * Get current session from Redis by session ID.
	 *
	 * @param req - HTTP request object
	 * @returns Session object or null if not found
	 */
	async findCurrent(req: Request): Promise<Session | null> {
		const sessionId = req.session.id
		const session = await this.redis.getJSON<Session>(this.key(sessionId))
		return session ? { ...session, id: sessionId } : null
	}

	/**
	 * List all sessions for the current user (excluding current session).
	 * Sorted by creation time (newest first).
	 *
	 * @param req - HTTP request object
	 * @param lng - Language code for i18n
	 * @returns Array of user sessions
	 * @throws NotFoundException if user not found in session
	 */
	async findByUser(req: Request, lng: Language): Promise<Session[]> {
		const userId = req.session.userId
		if (!userId) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.user.not_found', { lng, defaultValue: 'User not found' }),
			)
		}

		// Get all session keys
		const keys = await this.redis.keys(`${this.prefix}*`)
		if (keys.length === 0) return []

		// Bulk read session data
		const raw = (await this.redis.getClient().mGet(keys)) as (string | null)[]

		// Parse and filter by userId
		const sessions = keys.flatMap((key, i) => {
			const s = raw[i]
			if (!s) return []
			try {
				const parsed = JSON.parse(s) as Session
				if (parsed?.userId !== userId) return []
				const id = key.slice(this.prefix.length)
				return [{ ...parsed, id }]
			} catch {
				return []
			}
		})

		// Sort by creation time (descending)
		sessions.sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)))

		// Exclude current session
		const currentId = req.session?.id
		return sessions.filter(s => s.id !== currentId)
	}

	/**
	 * Clear session cookie from the client.
	 * Note: This does not remove the session from Redis.
	 *
	 * @param req - HTTP request object
	 * @returns true
	 */
	clear(req: Request): boolean {
		req.res?.clearCookie(this.cookieName)
		return true
	}

	/**
	 * Remove a specific session by ID.
	 * Prevents removal of the current session.
	 *
	 * @param req - HTTP request object
	 * @param id - Session ID to remove
	 * @param lng - Language code for i18n
	 * @returns true if removed successfully
	 * @throws ConflictException if trying to remove current session
	 * @throws InternalServerErrorException on Redis errors
	 */
	async remove(req: Request, id: string, lng: Language): Promise<boolean> {
		const currentId = req.session?.id

		if (currentId && currentId === id) {
			throw new ConflictException(
				this.i18n.t('auth.errors.session.cannot_delete_current', {
					lng,
					defaultValue: "You can't delete the current session",
				}),
			)
		}

		try {
			await this.redis.del(this.key(id))
			return true
		} catch {
			throw new InternalServerErrorException(
				this.i18n.t('common.errors.unexpected', { lng, defaultValue: 'Unexpected error' }),
			)
		}
	}

	/**
	 * Invalidate all sessions for a specific user.
	 * Used for security operations like password changes or account compromise.
	 *
	 * @param userId - User ID whose sessions should be invalidated
	 * @param excludeSessionId - Optional session ID to keep active (e.g., current session)
	 * @returns Number of sessions invalidated
	 *
	 * @example
	 * ```typescript
	 * // Invalidate all sessions except current one after password change
	 * const count = await sessionService.invalidateUserSessions(
	 *   user.id,
	 *   req.session.id
	 * )
	 * // Returns: 3 (if user had 3 other active sessions)
	 * ```
	 */
	async invalidateUserSessions(userId: string, excludeSessionId?: string): Promise<number> {
		// Get all session keys
		const keys = await this.redis.keys(`${this.prefix}*`)
		if (keys.length === 0) return 0

		// Bulk read session data
		const raw = (await this.redis.getClient().mGet(keys)) as (string | null)[]

		// Find sessions belonging to this user
		const sessionsToDelete: string[] = []

		keys.forEach((key, i) => {
			const s = raw[i]
			if (!s) return

			try {
				const parsed = JSON.parse(s) as Session
				if (parsed?.userId !== userId) return

				const sessionId = key.slice(this.prefix.length)

				// Skip excluded session (usually current session)
				if (excludeSessionId && sessionId === excludeSessionId) return

				sessionsToDelete.push(key)
			} catch {
				// Skip invalid session data
			}
		})

		// Delete sessions in bulk
		if (sessionsToDelete.length > 0) {
			await this.redis.getClient().del(sessionsToDelete)
		}

		return sessionsToDelete.length
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
		super(i18n, prisma)
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




`src/modules/libs/index.ts`


```typescript
export * from './mail'
export * from './sms'

```




`src/modules/libs/mail/index.ts`


```typescript
export * from './mail.module'
export * from './mail.service'

```




`src/modules/libs/mail/mail.module.ts`


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




`src/modules/libs/mail/mail.service.ts`


```typescript
const DISPOSABLE_DOMAINS = new Set(['10minutemail.com', 'temp-mail.org', 'mailinator.com'])

/**
 * Mail Service
 *
 * Centralized email sending service with:
 * - Email validation and reputation checking
 * - Disposable email detection
 * - DNS MX record validation
 * - Bounce and unsubscribe tracking
 * - Security notification templates
 * - React Email rendering for modern, responsive emails
 */
@Injectable()
export class MailService extends CoreService {
	private readonly logger = new Logger(MailService.name)

	constructor(
		i18n: I18nService,
		@Inject(IEmailProvider) private readonly emailProvider: IEmailProvider,
	) {
		super(i18n)
	}

	// ==================== Email Validation & Reputation ====================

	/**
	 * A guard method to check if an email can and should be sent.
	 */
	async canSendEmail(email: string): Promise<boolean> {
		const check = await this.checkEmailSendability(email)
		return check.canSend
	}

	/**
	 * Detailed email sendability check with reason
	 */
	private async checkEmailSendability(email: string): Promise<{ canSend: boolean; reason?: string }> {
		if (!isEmail(email)) {
			return { canSend: false, reason: 'invalid_format' }
		}

		const domain = email.split('@')[1]
		if (DISPOSABLE_DOMAINS.has(domain.toLowerCase())) {
			return { canSend: false, reason: 'disposable_email_provider' }
		}

		const userState = await this.prisma.user.findUnique({
			where: { email },
			select: { isUnsubscribed: true, emailBouncedAt: true },
		})

		if (userState?.isUnsubscribed) {
			return { canSend: false, reason: 'user_unsubscribed' }
		}

		if (userState?.emailBouncedAt) {
			return { canSend: false, reason: 'address_hard_bounced' }
		}

		try {
			const addresses = await dns.resolveMx(domain)
			if (!addresses || addresses.length === 0) {
				return { canSend: false, reason: 'domain_has_no_mx_records' }
			}
		} catch (error) {
			if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
				this.logger.warn(`DNS lookup failed for domain: ${domain}.`)
				return { canSend: false, reason: 'domain_not_found' }
			}
			this.logger.error(`DNS lookup for ${domain} failed unexpectedly:`, error)
		}

		return { canSend: true }
	}

	/**
	 * A private helper to wrap `canSendEmail` and throw an exception on failure.
	 */
	private async ensureCanSend(email: string) {
		const check = await this.checkEmailSendability(email)
		if (!check.canSend) {
			const message = `Skipping email to ${email}. Reason: ${check.reason}`
			this.logger.warn(message)
			throw new BadRequestException(message)
		}
	}

	// ==================== Authentication Emails ====================

	async sendVerificationEmailToken(email: string, token: string, lng: Language) {
		await this.ensureCanSend(email)
		const url = PATHS.VERIFY_EMAIL(CLIENT_URL, token)
		const html = await render(VerificationEmailTemplate({ url, i18n: this.i18n, lng }))
		const subject = this.i18n.t('mail.verification_email.subject', { lng })
		return this.sendMail(email, subject, html)
	}

	async sendOtpCodeEmail(email: string, code: string, lng: Language) {
		await this.ensureCanSend(email)
		const html = await render(OtpCodeTemplate({ code, i18n: this.i18n, lng }))
		const subject = this.i18n.t('mail.otp_code.subject', { lng, defaultValue: 'Your Verification Code' })
		return this.sendMail(email, subject, html)
	}

	/**
	 * Send password reset token with secure link.
	 *
	 * This email is sent when a user requests to reset their forgotten password.
	 * Contains a time-limited token link and request metadata for security.
	 *
	 * @param email - Recipient email address
	 * @param token - Password reset token UUID
	 * @param metadata - Session metadata (IP, location, device)
	 * @param lng - Language code for template selection
	 *
	 * @example
	 * ```typescript
	 * await mailService.sendPasswordResetToken(
	 *   'user@example.com',
	 *   'token-uuid-here',
	 *   {
	 *     ip: '192.168.1.1',
	 *     location: { country: 'USA', city: 'New York' },
	 *     device: { browser: 'Chrome', os: 'Windows' }
	 *   },
	 *   'en'
	 * )
	 * ```
	 */
	async sendPasswordResetToken(email: string, token: string, metadata: ISessionMetadata, lng: Language) {
		try {
			await this.ensureCanSend(email)

			const url: string = PATHS.RESET_PASSWORD(CLIENT_URL, token)
			const html = await render(ResetPasswordTemplate({ url, metadata, i18n: this.i18n, lng }))
			const subject = this.i18n.t('mail.reset_password.subject', { lng, defaultValue: 'Reset your password' })

			await this.sendMail(email, subject, html)

			this.logger.log(`Password reset token sent to ${email}`)
		} catch (error) {
			this.logger.error(`Failed to send password reset token to ${email}`, error)
			// Re-throw to allow caller to handle
			throw error
		}
	}

	// ==================== Password Management Emails ====================

	/**
	 * Send notification about successful password change.
	 *
	 * This email alerts users when their password has been changed,
	 * providing security details and a link to report unauthorized access.
	 *
	 * @param email - Recipient email address
	 * @param metadata - Session metadata (IP, location, device, timestamp)
	 * @param lng - Language code for template selection
	 *
	 * @example
	 * ```typescript
	 * await mailService.sendPasswordChangedNotification(
	 *   'user@example.com',
	 *   {
	 *     ip: '192.168.1.1',
	 *     location: { country: 'USA', city: 'New York' },
	 *     device: { browser: 'Chrome', os: 'Windows' }
	 *   },
	 *   'en'
	 * )
	 * ```
	 */
	async sendPasswordChangedNotification(email: string, metadata: ISessionMetadata, lng: Language): Promise<void> {
		try {
			await this.ensureCanSend(email)

			const html = await render(PasswordChangedTemplate({ metadata, i18n: this.i18n, lng }))
			const subject = this.i18n.t('mail.password_changed.subject', {
				lng,
				defaultValue: 'Your password was changed',
			})

			await this.sendMail(email, subject, html)

			this.logger.log(`Password changed notification sent to ${email}`)
		} catch (error) {
			this.logger.error(`Failed to send password changed notification to ${email}`, error)
			// Non-blocking: do not throw error, just log it
		}
	}

	/**
	 * Send confirmation after successful password reset.
	 *
	 * This email confirms that the password reset process has been completed
	 * and provides security recommendations.
	 *
	 * @param email - Recipient email address
	 * @param metadata - Session metadata (IP, location, device, timestamp)
	 * @param lng - Language code for template selection
	 *
	 * @example
	 * ```typescript
	 * await mailService.sendPasswordResetConfirmation(
	 *   'user@example.com',
	 *   {
	 *     ip: '192.168.1.1',
	 *     location: { country: 'USA', city: 'New York' },
	 *     device: { browser: 'Chrome', os: 'Windows' }
	 *   },
	 *   'en'
	 * )
	 * ```
	 */
	async sendPasswordResetConfirmation(email: string, metadata: ISessionMetadata, lng: Language): Promise<void> {
		try {
			await this.ensureCanSend(email)

			const enable2faUrl = `${CLIENT_URL}/settings/security/2fa`
			const securityUrl = `${CLIENT_URL}/security/activity`

			const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US', {
				dateStyle: 'long',
				timeStyle: 'short',
			})

			const html = await render(
				PasswordResetConfirmationTemplate({
					enable2faUrl,
					securityUrl,
					timestamp,
					metadata,
					i18n: this.i18n,
					lng,
				}),
			)
			const subject = this.i18n.t('mail.password_reset_confirmation.subject', {
				lng,
				defaultValue: 'Password successfully reset',
			})

			await this.sendMail(email, subject, html)

			this.logger.log(`Password reset confirmation sent to ${email}`)
		} catch (error) {
			this.logger.error(`Failed to send password reset confirmation to ${email}`, error)
			// Non-blocking: do not throw error, just log it
		}
	}

	// ==================== 2FA Security Notifications ====================

	/**
	 * Send notification when 2FA method is added
	 */
	async send2FAMethodAddedEmail(
		email: string,
		methodType: E2FAMethod,
		methodName: string | undefined,
		lng: Language = 'en',
	): Promise<void> {
		await this.ensureCanSend(email)

		const settingsUrl = `${CLIENT_URL}/settings/security`
		const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US')

		const html = await render(
			TwoFAMethodAddedTemplate({
				settingsUrl,
				i18n: this.i18n,
				lng,
				methodType,
				methodName,
				timestamp,
			}),
		)

		const subject = this.i18n.t('mail.2fa_method_added.subject', { lng, defaultValue: '🔐 New 2FA Method Added' })
		await this.sendMail(email, subject, html)

		this.logger.log(`2FA method added notification sent to ${email}`)
	}

	/**
	 * Send notification when 2FA method is removed
	 */
	async send2FAMethodRemovedEmail(
		email: string,
		methodType: E2FAMethod,
		methodName: string | undefined,
		lng: Language = 'en',
	): Promise<void> {
		await this.ensureCanSend(email)

		const settingsUrl = `${CLIENT_URL}/settings/security`
		const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US')

		const html = await render(
			TwoFAMethodRemovedTemplate({
				settingsUrl,
				i18n: this.i18n,
				lng,
				methodType,
				methodName,
				timestamp,
			}),
		)

		const subject = this.i18n.t('mail.2fa_method_removed.subject', { lng, defaultValue: '🔓 2FA Method Removed' })
		await this.sendMail(email, subject, html)

		this.logger.log(`2FA method removed notification sent to ${email}`)
	}

	/**
	 * Send notification when 2FA is completely disabled
	 */
	async send2FADisabledEmail(email: string, lng: Language = 'en'): Promise<void> {
		await this.ensureCanSend(email)

		const settingsUrl = `${CLIENT_URL}/settings/security`
		const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US')

		const html = await render(
			TwoFADisabledTemplate({
				settingsUrl,
				i18n: this.i18n,
				lng,
				timestamp,
			}),
		)

		const subject = this.i18n.t('mail.2fa_disabled.subject', {
			lng,
			defaultValue: '🚨 Two-Factor Authentication Disabled',
		})
		await this.sendMail(email, subject, html)

		this.logger.warn(`2FA disabled notification sent to ${email}`)
	}

	// ==================== Device & Login Notifications ====================

	/**
	 * Send notification for new device login
	 */
	async sendNewDeviceLoginEmail(email: string, metadata: ISessionMetadata, lng: Language = 'en'): Promise<void> {
		await this.ensureCanSend(email)

		const securityUrl = `${CLIENT_URL}/security/activity`
		const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US')

		const html = await render(
			NewDeviceLoginTemplate({
				securityUrl,
				i18n: this.i18n,
				lng,
				metadata,
				timestamp,
			}),
		)

		const subject = this.i18n.t('mail.new_device_login.subject', {
			lng,
			defaultValue: '🔐 New Device Login Detected',
		})
		await this.sendMail(email, subject, html)

		this.logger.log(`New device login notification sent to ${email}`)
	}

	/**
	 * Send notification for suspicious activity
	 */
	async sendSuspiciousActivityEmail(
		email: string,
		eventDescription: string,
		riskScore: number,
		lng: Language = 'en',
	): Promise<void> {
		await this.ensureCanSend(email)

		const securityUrl = `${CLIENT_URL}/security/activity`
		const lockAccountUrl = `${CLIENT_URL}/security/lock-account`
		const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US')

		const html = await render(
			SuspiciousActivityTemplate({
				securityUrl,
				lockAccountUrl,
				i18n: this.i18n,
				lng,
				eventDescription,
				riskScore,
				timestamp,
			}),
		)

		const subject = this.i18n.t('mail.suspicious_activity.subject', {
			lng,
			defaultValue: '🚨 Suspicious Activity Detected',
		})
		await this.sendMail(email, subject, html)

		this.logger.warn(`Suspicious activity notification sent to ${email} (risk: ${riskScore})`)
	}

	// ==================== Backup Codes Notifications ====================

	/**
	 * Send notification when backup codes are running low
	 */
	async sendLowBackupCodesEmail(email: string, remaining: number, lng: Language = 'en'): Promise<void> {
		await this.ensureCanSend(email)

		const settingsUrl = `${CLIENT_URL}/settings/security/backup-codes`
		const threshold = 3

		const html = await render(
			LowBackupCodesTemplate({
				settingsUrl,
				i18n: this.i18n,
				lng,
				remaining,
				threshold,
			}),
		)

		const subject = this.i18n.t('mail.low_backup_codes.subject', {
			lng,
			defaultValue: '⚠️ Running Low on Backup Codes',
		})
		await this.sendMail(email, subject, html)

		this.logger.log(`Low backup codes notification sent to ${email} (${remaining} remaining)`)
	}

	/**
	 * Send notification when backup codes are regenerated
	 */
	async sendBackupCodesRegeneratedEmail(email: string, lng: Language = 'en'): Promise<void> {
		await this.ensureCanSend(email)

		const settingsUrl = `${CLIENT_URL}/settings/security/backup-codes`
		const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US')

		const html = await render(
			BackupCodesRegeneratedTemplate({
				settingsUrl,
				i18n: this.i18n,
				lng,
				timestamp,
			}),
		)

		const subject = this.i18n.t('mail.backup_codes_regenerated.subject', {
			lng,
			defaultValue: '✅ Backup Codes Regenerated',
		})
		await this.sendMail(email, subject, html)

		this.logger.log(`Backup codes regenerated notification sent to ${email}`)
	}

	// ==================== Admin Action Notifications ====================

	/**
	 * Send notification when 2FA is disabled by admin
	 */
	async send2FADisabledByAdminEmail(
		email: string,
		adminEmail: string,
		reason: string,
		lng: Language = 'en',
	): Promise<void> {
		await this.ensureCanSend(email)

		const supportUrl = `${CLIENT_URL}/support`
		const settingsUrl = `${CLIENT_URL}/settings/security`
		const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US')

		const html = await render(
			TwoFADisabledByAdminTemplate({
				supportUrl,
				settingsUrl,
				i18n: this.i18n,
				lng,
				adminEmail,
				reason,
				timestamp,
			}),
		)

		const subject = this.i18n.t('mail.2fa_disabled_by_admin.subject', {
			lng,
			defaultValue: '👤 2FA Disabled by Administrator',
		})
		await this.sendMail(email, subject, html)

		this.logger.warn(`2FA disabled by admin notification sent to ${email}`)
	}

	/**
	 * Send notification when device is revoked by admin
	 */
	async sendDeviceRevokedByAdminEmail(
		email: string,
		deviceName: string,
		adminEmail: string,
		reason: string,
		lng: Language = 'en',
	): Promise<void> {
		await this.ensureCanSend(email)

		const supportUrl = `${CLIENT_URL}/support`
		const securityUrl = `${CLIENT_URL}/security/devices`
		const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US')

		const html = await render(
			DeviceRevokedByAdminTemplate({
				supportUrl,
				securityUrl,
				i18n: this.i18n,
				lng,
				deviceName,
				adminEmail,
				reason,
				timestamp,
			}),
		)

		const subject = this.i18n.t('mail.device_revoked_by_admin.subject', {
			lng,
			defaultValue: '🚫 Device Revoked by Administrator',
		})
		await this.sendMail(email, subject, html)

		this.logger.warn(`Device revoked by admin notification sent to ${email}`)
	}

	// ==================== Core Send Method ====================

	private async sendMail(email: string, subject: string, html: string) {
		return this.emailProvider.sendMail(email, subject, html)
	}
}

```




`src/modules/libs/mail/providers/brevo/brevo.service.ts`


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




`src/modules/libs/mail/providers/brevo/index.ts`


```typescript
export * from './brevo.service'

```




`src/modules/libs/mail/providers/email.provider.interface.ts`


```typescript
export const IEmailProvider = Symbol('IEmailProvider')

export interface IEmailProvider {
	sendMail(email: string, subject: string, html: string): Promise<unknown>
}

```



