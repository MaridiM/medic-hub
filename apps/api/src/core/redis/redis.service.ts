import { createClient, type RedisClientType } from 'redis'

import { logUnknownError } from '@/shared/utils'
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

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
