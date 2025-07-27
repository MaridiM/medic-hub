import cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'
import { json } from 'express'
import { graphqlUploadExpress } from 'graphql-upload-minimal'
import i18nextMiddleware from 'i18next-http-middleware'

import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { CoreModule, i18n, initI18n, RedisService, sessionConfig } from './core'
import { DEFAULT_LANGUAGE } from './core'

const myEnv = dotenv.config({ path: 'backend/.env' })
dotenvExpand.expand(myEnv)

async function bootstrap() {
	await initI18n()

	const app = await NestFactory.create(CoreModule, { rawBody: true })

	const config = app.get(ConfigService)
	const redis = app.get(RedisService)

	// ✅ Middleware i18n (инициализирует req.i18n и req.language)
	app.use(i18nextMiddleware.handle(i18n))

	// ✅ JSON и язык через Accept-Language, если вдруг не найден
	app.use(json({ limit: '1mb', type: 'application/json' }))
	app.use((req, res, next) => {
		req.language =
			req.language || req.i18n?.language || req.headers['accept-language']?.split(',')[0] || DEFAULT_LANGUAGE
		next()
	})

	// ✅ Cookie, file upload и глобальные пайпы
	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))
	app.use(config.getOrThrow<string>('GRAPHQL_PREFIX'), graphqlUploadExpress())
	app.useGlobalPipes(new ValidationPipe({ transform: true }))

	// ✅ Сессии через Redis
	app.use(sessionConfig(config, redis))

	// ✅ CORS
	const allowedOrigins = [config.getOrThrow<string>('CLIENT_URL'), 'http://localhost:3000']
	app.enableCors({
		origin: allowedOrigins,
		credentials: true,
		exposedHeaders: ['set-cookie'],
	})

	// ✅ Запуск
	await app.listen(config.getOrThrow<number>('SERVER_PORT') ?? 8000)
}
bootstrap()
