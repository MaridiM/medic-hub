import cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import { json, type NextFunction, type Request, Response } from 'express'
import { graphqlUploadExpress } from 'graphql-upload-minimal'
import i18nextMiddleware from 'i18next-http-middleware'

import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { i18n, initI18n, sessionConfig } from './core/config'
import { CoreModule } from './core/core.module'
import { DEFAULT_LANGUAGE } from './core/i18n'
import { RedisService } from './core/redis'

const myEnv = dotenv.config({ path: 'backend/.env' })
dotenvExpand.expand(myEnv)

async function bootstrap() {
	await initI18n()

	const app = await NestFactory.create(CoreModule, { rawBody: true })

	const config = app.get(ConfigService)
	const redis = app.get(RedisService)

	// ✅ i18n middleware (добавляет req.i18n, req.language)
	app.use(i18nextMiddleware.handle(i18n))

	// ✅ JSON + выставляем язык, если вдруг отсутствует
	app.use(json({ limit: '1mb', type: 'application/json' }))
	app.use((req: Request, res: Response, next: NextFunction) => {
		req.language =
			req.language ||
			req.i18n?.language ||
			String(req.headers['accept-language'] || '').split(',')[0] ||
			DEFAULT_LANGUAGE
		next()
	})

	// ✅ Cookie / file upload / global pipes
	app.use(cookieParser(config.get<string>('COOKIES_SECRET')))
	app.use(config.get<string>('GRAPHQL_PREFIX') || '/graphql', graphqlUploadExpress())
	app.useGlobalPipes(new ValidationPipe({ transform: true }))

	// ✅ Сессии через Redis
	app.use(sessionConfig(config, redis))

	// ✅ CORS
	const clientUrl = config.get<string>('CLIENT_URL') || 'http://localhost:3000'
	app.enableCors({
		origin: [clientUrl, 'http://localhost:3000'],
		credentials: true,
		exposedHeaders: ['set-cookie'],
	})

	// ✅ Старт
	const port = Number(config.get<string>('SERVER_PORT')) || 8000
	await app.listen(port)
}

bootstrap().catch(err => {
	// Можно заменить на ваш логгер
	console.error('Nest bootstrap failed:', err)
	process.exit(1)
})
