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
