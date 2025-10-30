# Rate Limit Module


**index**
`apps/api/src/modules/security/rate-limit/index.ts`

```typescript
export * from './constants'
export * from './decorators'
export * from './guards'
export * from './rate-limit.service'
export * from './rate-limit.module'
export * from './types'

```


**constants/index.ts**
`apps/api/src/modules/security/rate-limit/constants/index.ts`

```typescript
export * from './rate-limit.constants'

```


**constants/rate-limit.constants.ts**
`apps/api/src/modules/security/rate-limit/constants/rate-limit.constants.ts`

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


**types/index.ts**
`apps/api/src/modules/security/rate-limit/types/index.ts`

```typescript
export * from './rate-limit.types'

```


**types/rate-limit.types.ts**
`apps/api/src/modules/security/rate-limit/types/rate-limit.types.ts`

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


**decorators/index.ts**
`apps/api/src/modules/security/rate-limit/decorators/index.ts`

```typescript
export * from './rate-limit.decorator'
export * from './skip-rate-limit.decorator'

```


**decorators/rate-limit.decorator.ts**
`apps/api/src/modules/security/rate-limit/decorators/rate-limit.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common'

import { RATE_LIMIT_KEY } from '../constants/rate-limit.constants'
import type { RateLimitOptions } from '../types/rate-limit.types'

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


**decorators/skip-rate-limit.decorator.ts**
`apps/api/src/modules/security/rate-limit/decorators/skip-rate-limit.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common'

import { SKIP_RATE_LIMIT_KEY } from '../constants/rate-limit.constants'

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


**guards/index.ts**
`apps/api/src/modules/security/rate-limit/guards/index.ts`

```typescript
export * from './rate-limit.guard'

```


**guards/rate-limit.guard.ts**
`apps/api/src/modules/security/rate-limit/guards/rate-limit.guard.ts`

```typescript
import { Request } from 'express'

import { SecurityEventService } from '@/modules/security-event'
import type { GqlContext } from '@/shared/types'
import { ExecutionContext, forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import type { CanActivate } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ESecurityEvent, ESecuritySeverity } from '@prisma/__generated__'

import { DEFAULT_RATE_LIMIT, RATE_LIMIT_KEY, SKIP_RATE_LIMIT_KEY } from '../constants/rate-limit.constants'
import { RateLimitService } from '../rate-limit.service'
import type { RateLimitOptions } from '../types/rate-limit.types'

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


**rate-limit.module.ts**
`apps/api/src/modules/security/rate-limit/rate-limit.module.ts`

```typescript
import { SecurityEventService } from '@/modules/security-event'
import { Global, Module } from '@nestjs/common'

import { RateLimitGuard } from './guards'
import { RateLimitService } from './rate-limit.service'

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


**rate-limit.service.ts**
`apps/api/src/modules/security/rate-limit/rate-limit.service.ts`

```typescript
import { CoreService } from '@/core/core.service'
import { RedisService } from '@/core/redis'
import { Inject, Injectable, Logger } from '@nestjs/common'

import { RATE_LIMIT_LISTS, RATE_LIMIT_PREFIX } from './constants'
import type { RateLimitResponse } from './types/rate-limit.types'

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


**__tests__/rate-limit.service.spec.ts**
`apps/api/src/modules/security/rate-limit/__tests__/rate-limit.service.spec.ts`

```typescript
import { RedisService } from '@/core/redis'
import { Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { RateLimitService } from '../rate-limit.service'

// Создаем шпиона один раз перед всеми тестами
const loggerErrorSpy = jest.spyOn(Logger, 'error').mockImplementation(() => {})

// Типизированный мок для клиента Redis
type MockRedisClient = {
	zRemRangeByScore: jest.Mock<Promise<number>, [string, number | string, number | string]>
	zCard: jest.Mock<Promise<number>, [string]>
	zAdd: jest.Mock<Promise<number>, [string, { score: number; value: string }]>
	expire: jest.Mock<Promise<boolean>, [string, number]>
	zRange: jest.Mock<Promise<string[]>, [string, number, number, { REV: boolean }?]>
	sIsMember: jest.Mock<Promise<boolean>, [string, string]>
	sAdd: jest.Mock<Promise<number>, [string, string | string[]]>
}

describe('RateLimitService', () => {
	let service: RateLimitService
	let redisClient: MockRedisClient

	beforeEach(async () => {
		// Очищаем моки, но не восстанавливаем шпионов
		jest.clearAllMocks()

		redisClient = {
			zRemRangeByScore: jest.fn().mockResolvedValue(1),
			zCard: jest.fn().mockResolvedValue(0),
			zAdd: jest.fn().mockResolvedValue(1),
			expire: jest.fn().mockResolvedValue(true),
			zRange: jest.fn().mockResolvedValue([]),
			sIsMember: jest.fn().mockResolvedValue(false),
			sAdd: jest.fn().mockResolvedValue(1),
		}

		const mockRedisService = {
			getClient: (): MockRedisClient => redisClient,
			sIsMember: redisClient.sIsMember,
			sAdd: redisClient.sAdd,
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [RateLimitService, { provide: RedisService, useValue: mockRedisService }],
		}).compile()

		service = module.get<RateLimitService>(RateLimitService)
	})

	afterAll(() => {
		// Восстанавливаем оригинальную реализацию логгера после всех тестов
		loggerErrorSpy.mockRestore()
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('consume', () => {
		const key = 'test-key'
		const points = 5
		const duration = 60 // 60 seconds

		it('should allow the first request', async () => {
			redisClient.zCard.mockResolvedValue(0)

			const result = await service.consume(key, points, duration)

			expect(result.isAllowed).toBe(true)
			expect(result.remaining).toBe(points - 1)
			expect(redisClient.zAdd).toHaveBeenCalledTimes(1)
			expect(redisClient.expire).toHaveBeenCalledWith(`rate-limit:global:${key}`, duration)
		})

		it('should allow requests within the limit', async () => {
			redisClient.zCard.mockResolvedValue(points - 2) // 3 consumed, 2 remaining

			const result = await service.consume(key, points, duration)

			expect(result.isAllowed).toBe(true)
			expect(result.remaining).toBe(1) // 5 - (3 + 1)
		})

		it('should block requests when the limit is reached', async () => {
			redisClient.zCard.mockResolvedValue(points) // 5 consumed, limit reached
			const oldestTimestamp = Date.now() - (duration - 10) * 1000 // 10 seconds left
			redisClient.zRange.mockResolvedValue([oldestTimestamp.toString()])

			const result = await service.consume(key, points, duration)

			expect(result.isAllowed).toBe(false)
			expect(result.remaining).toBe(0)
			expect(result.msBeforeNext).toBeGreaterThanOrEqual(9000)
			expect(result.msBeforeNext).toBeLessThanOrEqual(11000)
			expect(redisClient.zAdd).not.toHaveBeenCalled()
		})

		it('should correctly implement the sliding window', async () => {
			// 1. Первый запрос - разрешен
			redisClient.zCard.mockResolvedValue(0)
			await service.consume(key, points, duration)
			expect(redisClient.zAdd).toHaveBeenCalledTimes(1)

			// 2. Имитируем, что старые записи удалились
			redisClient.zRemRangeByScore.mockResolvedValue(2)
			redisClient.zCard.mockResolvedValue(points - 2) // Теперь в окне 3 записи

			// 3. Новый запрос должен быть разрешен
			const result = await service.consume(key, points, duration)
			expect(result.isAllowed).toBe(true)
			expect(result.remaining).toBe(points - (points - 2 + 1)) // 5 - (3+1) = 1
		})

		it('should fail-open (allow request) if Redis fails', async () => {
			const redisError = new Error('Redis connection error')
			const key = 'fail-key'
			redisClient.zRemRangeByScore.mockRejectedValue(redisError)

			const result = await service.consume(key, 5, 60)

			expect(result.isAllowed).toBe(true)
			expect(result.remaining).toBe(5)
			expect(loggerErrorSpy).toHaveBeenCalledWith(`Rate limit check failed for key ${key}:`, redisError)
		})
	})

	describe('Whitelist / Blacklist', () => {
		const ip = '1.2.3.4'

		it('isWhitelisted should call sIsMember with the correct key', async () => {
			await service.isWhitelisted(ip)
			expect(redisClient.sIsMember).toHaveBeenCalledWith('rate-limit:whitelist', ip)
		})

		it('isBlacklisted should call sIsMember with the correct key', async () => {
			await service.isBlacklisted(ip)
			expect(redisClient.sIsMember).toHaveBeenCalledWith('rate-limit:blacklist', ip)
		})

		it('addToWhitelist should call sAdd with the correct key', async () => {
			await service.addToWhitelist(ip)
			expect(redisClient.sAdd).toHaveBeenCalledWith('rate-limit:whitelist', ip)
		})
	})
})

```


# Integration


**SecurityModule**
`apps/api/src/modules/security/security.module.ts`

```typescript
import { Global, Module } from '@nestjs/common'

import { AccountLockModule } from './account-lock'
import { RateLimitModule } from './rate-limit'

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


**CoreModule global guard registration**
`apps/api/src/core/core.module.ts`

```typescript
import 'module-alias/register'

import { AccountModule, RecoveryModule, SessionModule, TwoFactorModule, VerificationModule } from '@/modules/auth'
import { NotificationModule } from '@/modules/notification'
import { RbacModule } from '@/modules/rbac'
import { RateLimitGuard, SecurityModule } from '@/modules/security'
import { SecurityEventModule } from '@/modules/security-event'
import { IS_DEV_ENV } from '@/shared/utils'
import { UrlModule } from '@/shared/utils/url'
import { ApolloDriver } from '@nestjs/apollo'
import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD, APP_PIPE } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { ScheduleModule } from '@nestjs/schedule'

import { getGraphQLConfig } from './config'
import { I18nValidationPipe } from './i18n'
import { I18nModule } from './i18n/i18n.module'
import { GraphQLLoggerMiddleware } from './middleware'
import { PrismaModule } from './prisma'
import { ProviderModule } from './provider'
import { RedisModule } from './redis'

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

		// Utils
		UrlModule,

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
		I18nValidationPipe,
		GraphQLLoggerMiddleware,
		{ provide: APP_PIPE, useExisting: I18nValidationPipe },
		{ provide: APP_GUARD, useClass: RateLimitGuard },
	],
})
export class CoreModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(GraphQLLoggerMiddleware).forRoutes('*') // Применяем ко всем роутам
	}
}

```


# Configuration


**App config defaults**
`apps/api/src/core/config/app.config.ts`

```typescript
import * as dotenv from 'dotenv'

import { CronExpression } from '@nestjs/schedule'

dotenv.config()

export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
export const COMPANY_NAME = process.env.COMPANY_NAME || 'MedicHub Inc.'
export const APP_NAME = process.env.APP_NAME || 'DoctorLab'
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'maridim.dev@gmail.com'

// RATE LIMITING
export const RATE_LIMIT_LOGIN_POINTS = +process.env.RATE_LIMIT_LOGIN_POINTS || 5
export const RATE_LIMIT_LOGIN_WINDOW_MS = +process.env.RATE_LIMIT_LOGIN_WINDOW_MS || 900 // 15 minutes

export const RATE_LIMIT_RESET_PASSWORD_POINTS = +process.env.RATE_LIMIT_RESET_PASSWORD_POINTS || 3
export const RATE_LIMIT_RESET_PASSWORD_WINDOW_MS = +process.env.RATE_LIMIT_RESET_PASSWORD_WINDOW_MS || 3600 // 3 hours

export const RATE_LIMIT_NEW_PASSWORD_POINTS = +process.env.RATE_LIMIT_NEW_PASSWORD_POINTS || 5
export const RATE_LIMIT_NEW_PASSWORD_WINDOW_MS = +process.env.RATE_LIMIT_NEW_PASSWORD_WINDOW_MS || 900 // 15 minutes

export const RATE_LIMIT_2FA_POINTS = +process.env.RATE_LIMIT_2FA_POINTS || 5
export const RATE_LIMIT_2FA_WINDOW_MS = +process.env.RATE_LIMIT_2FA_WINDOW_MS || 300 // 5 minutes

export const RATE_LIMIT_CHANGE_PASSWORD_POINTS = +process.env.RATE_LIMIT_CHANGE_PASSWORD_POINTS || 5
export const RATE_LIMIT_CHANGE_PASSWORD_WINDOW_MS = +process.env.RATE_LIMIT_CHANGE_PASSWORD_WINDOW_MS || 3600 // 3 hours

export const RATE_LIMIT_VERIFICATION_EMAIL_POINTS = +process.env.RATE_LIMIT_VERIFICATION_EMAIL_POINTS || 5
export const RATE_LIMIT_VERIFICATION_EMAIL_WINDOW_MS = +process.env.RATE_LIMIT_VERIFICATION_EMAIL_WINDOW_MS || 3600 // 3 hours

// CRON JOB SCHEDULES
export const CRON_CLEANUP_BACKUP_CODES =
	process.env.CRON_CLEANUP_BACKUP_CODES || CronExpression.EVERY_DAY_AT_2AM || '0 2 * * *' // Runs daily at 2:00 AM
export const CRON_CLEANUP_DEVICES = process.env.CRON_CLEANUP_DEVICES || CronExpression.EVERY_DAY_AT_6AM || '0 6 * * *' // Runs daily at 3:00 AM (or 6:00 AM as shown in logs)
export const CRON_CLEANUP_EVENTS = process.env.CRON_CLEANUP_EVENTS || CronExpression.EVERY_WEEK || '0 0 * * 0' // Runs weekly on Sunday at 0:00 AM
export const CRON_ENFORCE_DEVICE_LIMITS =
	process.env.CRON_ENFORCE_DEVICE_LIMITS || CronExpression.EVERY_6_HOURS || '0 */3 * * *' // Runs every 6 hours (adjusted to match logs at 9:00)

```


**Environment overrides (`RATE LIMITING` section)**
`apps/api/.env`

```dotenv
# RATE LIMITING
RATE_LIMIT_LOGIN_POINTS=5
RATE_LIMIT_LOGIN_WINDOW_MS=900

RATE_LIMIT_RESET_PASSWORD_POINTS=3
RATE_LIMIT_RESET_PASSWORD_WINDOW_MS=3600

RATE_LIMIT_NEW_PASSWORD_POINTS=5
RATE_LIMIT_NEW_PASSWORD_WINDOW_MS=900

RATE_LIMIT_2FA_POINTS=5
RATE_LIMIT_2FA_WINDOW_MS=300

RATE_LIMIT_CHANGE_PASSWORD_POINTS=5
RATE_LIMIT_CHANGE_PASSWORD_WINDOW_MS=3600

RATE_LIMIT_VERIFICATION_EMAIL_POINTS=5
RATE_LIMIT_VERIFICATION_EMAIL_WINDOW_MS=3600


```


# GraphQL Usage


**SessionResolver.login**
`apps/api/src/modules/auth/session/session.resolver.ts`

```typescript
import { RATE_LIMIT_LOGIN_POINTS, RATE_LIMIT_LOGIN_WINDOW_MS } from '@/core/config'
import { Lang, Language } from '@/core/i18n'
import { RateLimit } from '@/modules/security'
import { Authorization, UserAgent } from '@/shared/decorators'
import type { GqlContext } from '@/shared/types'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { LoginInput, LoginResponse } from './dtos'
import { Session } from './models'
import { SessionService } from './session.service'

@Resolver(() => Session)
export class SessionResolver {
	constructor(private readonly sessionService: SessionService) {}

	/**
	 * Authenticate the user and create a server session.
	 */
	@RateLimit({
		points: RATE_LIMIT_LOGIN_POINTS,
		duration: RATE_LIMIT_LOGIN_WINDOW_MS,
		errorMessage: `Too many login attempts. Please try again in ${RATE_LIMIT_LOGIN_WINDOW_MS / 60} minutes.`,
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


**RecoveryResolver**
`apps/api/src/modules/auth/recovery/recovery.resolver.ts`

```typescript
import {
	RATE_LIMIT_NEW_PASSWORD_POINTS,
	RATE_LIMIT_NEW_PASSWORD_WINDOW_MS,
	RATE_LIMIT_RESET_PASSWORD_POINTS,
	RATE_LIMIT_RESET_PASSWORD_WINDOW_MS,
} from '@/core/config'
import { Lang, Language } from '@/core/i18n'
import { RateLimit } from '@/modules/security'
import { UserAgent } from '@/shared/decorators'
import type { GqlContext } from '@/shared/types'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { NewPasswordInput, ResetPasswordInput } from './dtos'
import { RecoveryService } from './recovery.service'

@Resolver('Recovery')
export class RecoveryResolver {
	constructor(private readonly recoveryService: RecoveryService) {}

	/**
	 * Initiates password reset flow by email.
	 * Generates a one-time reset token and sends a reset link to the user.
	 * Protected against email enumeration (always returns true).
	 */
	@RateLimit({ points: RATE_LIMIT_RESET_PASSWORD_POINTS, duration: RATE_LIMIT_RESET_PASSWORD_WINDOW_MS }) // ✅ 5 attempts per 15 minutes
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
	@RateLimit({ points: RATE_LIMIT_NEW_PASSWORD_POINTS, duration: RATE_LIMIT_NEW_PASSWORD_WINDOW_MS }) // ✅ 5 attempts per 15 minutes
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


**AccountResolver.changePassword**
`apps/api/src/modules/auth/account/account.resolver.ts`

```typescript
import { RATE_LIMIT_CHANGE_PASSWORD_POINTS, RATE_LIMIT_CHANGE_PASSWORD_WINDOW_MS } from '@/core/config'
import { Lang, Language } from '@/core/i18n'
import { RateLimit } from '@/modules/security'
import { Authorization, Authorized, UserAgent } from '@/shared/decorators'
import type { GqlContext } from '@/shared/types'
import { Args, Context, Field, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql'

import { AccountService } from './account.service'
import { ChangeEmailInput, ChangePasswordInput, CreateAccountInput } from './dtos'
import { User } from './models'

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


**VerificationResolver**
`apps/api/src/modules/auth/verification/verification.resolver.ts`

```typescript
import { RATE_LIMIT_VERIFICATION_EMAIL_POINTS, RATE_LIMIT_VERIFICATION_EMAIL_WINDOW_MS } from '@/core/config'
import { Lang, Language } from '@/core/i18n'
import { RateLimit } from '@/modules/security'
import { UserAgent } from '@/shared/decorators'
import type { GqlContext } from '@/shared/types'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { VerificationInput, VerificationResponse } from './dtos'
import { VerificationService } from './verification.service'

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


**TwoFactorResolver.verify2FA**
`apps/api/src/modules/auth/2fa/resolvers/2fa.resolver.ts`

```typescript
import { RATE_LIMIT_2FA_POINTS, RATE_LIMIT_2FA_WINDOW_MS } from '@/core/config'
import { I18nService, Lang, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RateLimit } from '@/modules/security'
import { Authorization, Authorized } from '@/shared/decorators'
import type { GqlContext } from '@/shared/types'
import { getSessionMetadata } from '@/shared/utils'
import { BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { E2FAMethod, type User } from '@prisma/__generated__'

import {
	CompleteTotpSetupInput,
	CompleteWebAuthnAuthenticationInput,
	CompleteWebAuthnRegistrationInput,
	GenerateTotpSetupInput,
	RegenerateBackupCodesInput,
	Remove2FAMethodInput,
	RemoveWebAuthnCredentialInput,
	SendOtpCodeInput,
	SetupOtpInput,
	StartWebAuthnAuthenticationInput,
	StartWebAuthnRegistrationInput,
	Update2FAMethodInput,
	Verify2FAInput,
	VerifyBackupCodeInput,
	VerifyOtpSetupInput,
} from '../dtos'
import { Require2FAVerification, TwoFactorVerifiedGuard } from '../guards'
import {
	BackupCodesRegeneratedModel,
	BackupCodesStatusModel,
	OtpSetupModel,
	TotpSetupModel,
	TwoFactorMethodModel,
	TwoFactorMethodsListModel,
	TwoFactorSetupCompleteModel,
	TwoFactorSuccessModel,
	WebAuthnAuthenticationCompleteModel,
```


# Notification Rate Limits


**constants/notification.constants.ts**
`apps/api/src/modules/notification/constants/notification.constants.ts`

```typescript
import { ENotificationChannel, ENotificationPriority } from '../types'

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


**NotificationService rate limit helpers**
`apps/api/src/modules/notification/notification.service.ts`

```typescript
	// ==================== Rate Limiting ====================

	/**
	 * Check if user has exceeded rate limits
	 */
	private async checkRateLimit(userId: string): Promise<{ allowed: boolean; reason?: string }> {
		const hourKey = NOTIFICATION_REDIS_KEYS.RATE_LIMIT_HOUR(userId)
		const dayKey = NOTIFICATION_REDIS_KEYS.RATE_LIMIT_DAY(userId)

		const hourCount = await this.rGet(hourKey)
		const dayCount = await this.rGet(dayKey)

		const hourlyCount = hourCount ? parseInt(hourCount, 10) : 0
		const dailyCount = dayCount ? parseInt(dayCount, 10) : 0

		if (hourlyCount >= NOTIFICATION_RATE_LIMITS.MAX_PER_HOUR) {
			return { allowed: false, reason: 'Hourly limit exceeded' }
		}

		if (dailyCount >= NOTIFICATION_RATE_LIMITS.MAX_PER_DAY) {
			return { allowed: false, reason: 'Daily limit exceeded' }
		}

		return { allowed: true }
	}

	/**
	 * Track sent notification for rate limiting
	 */
	private async trackSentNotification(userId: string, category: ENotificationCategory): Promise<void> {
		const hourKey = NOTIFICATION_REDIS_KEYS.RATE_LIMIT_HOUR(userId)
		const dayKey = NOTIFICATION_REDIS_KEYS.RATE_LIMIT_DAY(userId)

		// Increment counters
		await this.rIncr(hourKey)
		await this.rExpire(hourKey, 3600) // 1 hour

		await this.rIncr(dayKey)
		await this.rExpire(dayKey, 86400) // 24 hours

		// Log if enabled
		if (SECURITY_NOTIFICATION_CONFIG.LOG_ALL_ATTEMPTS) {
			this.logger.debug(`Notification sent: user=${userId}, category=${category}`)
		}
	}

	/**
	 * Check for duplicate notifications
	 */
	private async checkDuplicate(userId: string, notificationHash: string): Promise<boolean> {
		const key = NOTIFICATION_REDIS_KEYS.DUPLICATE(userId, notificationHash)
		const exists = await this.rGet(key)

		if (exists) {
			return true // Is duplicate
		}

		// Mark as sent
		await this.rSet(key, '1', NOTIFICATION_RATE_LIMITS.DUPLICATE_COOLDOWN)
		return false
	}

	/**
	 * Generate notification hash for duplicate detection
	 */
	private generateNotificationHash(data: any): string {
		return createHash('sha256').update(JSON.stringify(data)).digest('hex').substring(0, 16)
	}

```



