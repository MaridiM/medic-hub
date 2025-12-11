# File: core\core.service.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/core/core.service.ts`

## Category
Backend

## File Type
TS (core.service.ts)

## Size
6041 characters, 212 lines

## Full Code

```typescript
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { I18nService } from './i18n'
import { LeafKeys, Res, StrOptions } from './i18n/types'
import { PrismaService } from './prisma'
import { RedisService } from './redis'

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

## Description

This file is part of the MedicHub API (NestJS) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.014Z*
