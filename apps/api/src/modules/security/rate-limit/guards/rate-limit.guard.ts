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
