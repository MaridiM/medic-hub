# Full App Code (excluding imports, tests, i18n) - Part 5 of 6

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

