# Full App Code (excluding imports, tests, i18n, extra core) - Part 7 of 8

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
		super(i18n, prisma)
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



