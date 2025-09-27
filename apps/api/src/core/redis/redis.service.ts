import { createClient, type RedisClientType } from 'redis'

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RedisService {
	private client: RedisClientType

	constructor(private readonly config: ConfigService) {
		this.client = createClient({ url: this.config.getOrThrow<string>('REDIS_URL') })
		this.client.connect().catch(err => {
			console.error('Redis client connect error', err)
		})
	}

	getClient(): RedisClientType {
		return this.client
	}

	// ===== БАЗОВЫЕ ОПЕРАЦИИ =====

	/** Получить строку по ключу */
	async get(key: string): Promise<string | null> {
		const res = await this.client.get(key)
		return typeof res === 'string' ? res : null
	}

	/** Установить строку по ключу (c optional TTL в секундах) */
	async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
		if (ttlSeconds && ttlSeconds > 0) {
			await this.client.set(key, value, { EX: ttlSeconds })
		} else {
			await this.client.set(key, value)
		}
	}

	/** Удалить ключ */
	async del(key: string): Promise<number> {
		return this.client.del(key)
	}

	/** Проверить наличие ключа */
	async expire(key: string, ttlSeconds: number): Promise<boolean> {
		const n = await this.client.expire(key, ttlSeconds)
		return n === 1
	}

	// ===== JSON-ХЕЛПЕРЫ (типобезопасные) =====

	/** Сохранить объект как JSON */
	async setJSON<T extends object>(key: string, value: T, ttlSeconds?: number): Promise<void> {
		const raw = JSON.stringify(value)
		await this.set(key, raw, ttlSeconds)
	}

	/** Прочитать объект из JSON */
	async getJSON<T = unknown>(key: string): Promise<T | null> {
		const raw = await this.get(key)
		if (raw == null) return null
		try {
			// raw is a string here (get() returns string | null), so parse it
			return JSON.parse(raw) as T
		} catch {
			return null
		}
	}
}
