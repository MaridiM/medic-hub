import { createClient, RedisClientType } from 'redis'

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RedisService {
	private client: RedisClientType

	constructor(private readonly config: ConfigService) {
		this.client = createClient({ url: this.config.getOrThrow<string>('REDIS_URL') })
		this.client.connect()
	}

	getClient(): RedisClientType {
		return this.client
	}
}
