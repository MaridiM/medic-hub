import cookieParser from 'cookie-parser'
// import * as dotenv from 'dotenv'
// import dotenvExpand from 'dotenv-expand'
import { json, type NextFunction, type Request, Response } from 'express'
import { graphqlUploadExpress } from 'graphql-upload-minimal'
import helmet, { HelmetOptions } from 'helmet'
import i18nextMiddleware from 'i18next-http-middleware'

import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { helmetConfig, i18n, initI18n, sessionConfig } from './core/config'
import { CoreModule } from './core/core.module'
import { DEFAULT_LANGUAGE } from './core/i18n'
import { RedisService } from './core/redis'
import { IS_DEV_ENV } from './shared/utils'

// const myEnv = dotenv.config({ path: '.env' })
// dotenvExpand.expand(myEnv)

async function bootstrap() {
	// ✅ Create a logger for the bootstrap process
	const bootstrapLogger = new Logger('Bootstrap')

	await initI18n()

	const app = await NestFactory.create(CoreModule, {
		rawBody: true,
		// ✅ Configuring logging based on the environment
		logger: IS_DEV_ENV ? ['log', 'error', 'warn', 'debug', 'verbose'] : ['log', 'error', 'warn'],
	})

	const config = app.get(ConfigService)
	const redis = app.get(RedisService)

	// ✅ Enable Graceful Shutdown
	app.enableShutdownHooks()

	// ✅ Security Headers (Helmet) - apply first!
	app.use(helmet(helmetConfig as Readonly<HelmetOptions>))

	// ✅ i18n middleware (add req.i18n, req.language)
	app.use(i18nextMiddleware.handle(i18n))

	// ✅ JSON + language detection fallback
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

	// ✅ Redis-based sessions
	app.use(sessionConfig(config, redis))

	// ✅ CORS
	const clientUrl = config.get<string>('CLIENT_URL') || 'http://localhost:3000'
	app.enableCors({
		origin: [clientUrl, 'http://localhost:3000'],
		credentials: true,
		exposedHeaders: ['set-cookie'],
	})

	// ✅ Start server
	const port = Number(config.get<string>('SERVER_PORT')) || 8000
	await app.listen(port)

	// ✅ Logging a successful launch
	const graphqlPath = config.get<string>('GRAPHQL_PREFIX') || '/graphql'
	const env = config.get<string>('NODE_ENV') || 'development'

	bootstrapLogger.log(`🚀 Application is running on: http://localhost:${port}`)
	bootstrapLogger.log(`📊 GraphQL Playground: http://localhost:${port}${graphqlPath}`)
	bootstrapLogger.log(`🌍 Environment: ${env}`)
	bootstrapLogger.log(`🔒 CORS enabled for: ${clientUrl}`)
	bootstrapLogger.log(`📝 GraphQL logging: ${IS_DEV_ENV ? 'DETAILED' : 'COMPACT'}`)
}

const bootstrapLogger = new Logger('Bootstrap')
bootstrap().catch(error => {
	bootstrapLogger.error('❌ Application bootstrap failed!', error.stack)
	process.exit(1)
})
