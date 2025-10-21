# Full App Code (excluding imports, tests, i18n, extra core) - Part 3 of 8

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
		super(i18n, prisma)
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




`src/modules/auth/recovery/recovery.resolver.ts`


```typescript
@Resolver('Recovery')
export class RecoveryResolver {
	constructor(private readonly recoveryService: RecoveryService) {}

	/**
	 * Initiates password reset flow by email.
	 * Generates a one-time reset token and sends a reset link to the user.
	 * Protected against email enumeration (always returns true).
	 */
	@Mutation(() => Boolean, {
		name: 'resetPassword',
		description:
			"Initiate password reset: generate a one-time token and send a reset link to the user's email. Always returns true to prevent email enumeration.",
	})
	async resetPassword(
		@Context() { req }: GqlContext,
		@Args('data', {
			type: () => ResetPasswordInput,
			description: 'Payload with the email address that requests a password reset.',
		})
		input: ResetPasswordInput,
		@UserAgent() userAgent: string,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.recoveryService.resetPassword(req, input, userAgent, lng)
	}

	/**
	 * Completes password reset using a valid token by setting a new password.
	 * Consumes the token on success and sends confirmation email.
	 */
	@Mutation(() => Boolean, {
		name: 'newPassword',
		description:
			'Complete password reset: validate token, set a new password, consume the token, and send confirmation email.',
	})
	async newPassword(
		@Args('data', {
			type: () => NewPasswordInput,
			description: 'Payload with the reset token and the new password.',
		})
		input: NewPasswordInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.recoveryService.newPassword(input, lng)
	}
}

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
		super(i18n, prisma)
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
 * Login response with optional access token and user data
 */
@ObjectType('LoginResponse', {
	description: 'Response after successful authentication',
})
export class LoginResponse {
	@Field({
		nullable: true,
		description: 'JWT access token (null if using cookie-based sessions)',
	})
	accessToken?: string

	@Field(() => User, {
		nullable: true,
		description: 'Authenticated user data',
	})
	user?: User
}

```



