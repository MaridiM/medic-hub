import { RedisStore } from 'connect-redis'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { graphqlUploadExpress } from 'graphql-upload-minimal'

import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { CoreModule, RedisService } from './core'
import { ms, parseBoolean, StringValue } from './shared/utils'

async function bootstrap() {
    const app = await NestFactory.create(CoreModule, { rawBody: true })

    const config = app.get(ConfigService)
    const redis = app.get(RedisService)

    app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET_FILE ')))
    app.use(config.getOrThrow<string>('GRAPHQL_PREFIX'), graphqlUploadExpress())
    app.useGlobalPipes(new ValidationPipe({ transform: true }))

    app.use(
      session({
        secret: config.getOrThrow<string>('SESSION_SECRET_FILE'),
        name: config.getOrThrow<string>('SESSION_NAME'),
        resave: false,
        saveUninitialized: false,
        cookie: {
          domain: config.getOrThrow<string>('SESSION_DOMAIN') || 'localhost',
          maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
          httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
          secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
          sameSite: 'lax',
        },
        store: new RedisStore({
          client: redis,
          ttl: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
          prefix: config.getOrThrow<string>('SESSION_FOLDER') || 'sessions:',
        }),
      }),
    )

    const allowedOrigins = [config.getOrThrow<string>('CLIENT_URL'), 'http://localhost:3000']

    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
      exposedHeaders: ['set-cookie'],
    })

    await app.listen(config.getOrThrow<number>('SERVER_PORT') ?? 8000)
}
bootstrap()
