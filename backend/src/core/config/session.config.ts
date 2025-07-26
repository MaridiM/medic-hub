import { RedisStore } from 'connect-redis'

import { RedisService } from '@/core'
import { ms, parseBoolean, StringValue } from '@/shared/utils'
import { ConfigService } from '@nestjs/config'

export const sessionConfig = (config: ConfigService, redis: RedisService) => ({
	secret: config.getOrThrow<string>('SESSION_SECRET'),
	name: config.getOrThrow<string>('SESSION_NAME'),
	resave: false,
	saveUninitialized: false,
	cookie: {
		domain: config.getOrThrow<string>('SESSION_DOMAIN') || 'localhost',
		maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
		httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
		secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
		sameSite: 'lax' as const,
	},
	store: new RedisStore({
		client: redis,
		ttl: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
		prefix: config.getOrThrow<string>('SESSION_FOLDER') || 'sessions:',
	}),
})
