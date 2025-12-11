# File: core\config\session.config.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/core/config/session.config.ts`

## Category
Backend

## File Type
TS (session.config.ts)

## Size
1122 characters, 33 lines

## Full Code

```typescript
import { RedisStore } from 'connect-redis'
import session from 'express-session'
import ms from 'ms'

import { RedisService } from '@/core/redis/redis.service'
import { parseBoolean, StringValue } from '@/shared/utils'
import { ConfigService } from '@nestjs/config'

export const sessionConfig = (config: ConfigService, redis: RedisService) => {
	const redisClient = redis.getClient()

	const store = new RedisStore({
		client: redisClient,
		prefix: config.getOrThrow<string>('SESSION_FOLDER') || 'sessions:',
		ttl: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
	})

	return session({
		store,
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
	})
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.008Z*
