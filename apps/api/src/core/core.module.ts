import 'module-alias/register'

import { AccountModule, RecoveryModule, SessionModule, TwoFactorModule, VerificationModule } from '@/modules/auth'
import { NotificationModule } from '@/modules/notification'
import { RbacModule } from '@/modules/rbac'
import { RateLimitGuard, SecurityModule } from '@/modules/security'
import { SecurityEventModule } from '@/modules/security-event'
import { IS_DEV_ENV } from '@/shared/utils'
import { UrlModule } from '@/shared/utils/url'
import { ApolloDriver } from '@nestjs/apollo'
import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD, APP_PIPE } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { ScheduleModule } from '@nestjs/schedule'

import { getGraphQLConfig } from './config'
import { I18nValidationPipe } from './i18n'
import { I18nModule } from './i18n/i18n.module'
import { GraphQLLoggerMiddleware } from './middleware'
import { PrismaModule } from './prisma'
import { ProviderModule } from './provider'
import { RedisModule } from './redis'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true,
			validate: config => config,
		}),
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			imports: [ConfigModule],
			useFactory: getGraphQLConfig,
			inject: [ConfigService],
		}),
		ScheduleModule.forRoot(),

		// Core
		I18nModule,
		RedisModule,
		PrismaModule,
		ProviderModule,

		// Utils
		UrlModule,

		// Modules
		SecurityModule,

		// Auth
		AccountModule,
		RecoveryModule,
		SessionModule,
		TwoFactorModule,
		VerificationModule,

		// Notification
		NotificationModule,

		// Security Event
		SecurityEventModule,

		// RBAC
		RbacModule,
	],
	providers: [
		I18nValidationPipe,
		GraphQLLoggerMiddleware,
		{ provide: APP_PIPE, useExisting: I18nValidationPipe },
		{ provide: APP_GUARD, useClass: RateLimitGuard },
	],
})
export class CoreModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(GraphQLLoggerMiddleware).forRoutes('*') // Применяем ко всем роутам
	}
}
