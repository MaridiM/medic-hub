import 'module-alias/register'

import { AccountModule, RecoveryModule, SessionModule, TwoFactorModule, VerificationModule } from '@/modules/auth'
import { MailModule, SmsModule } from '@/modules/libs'
import { IS_DEV_ENV } from '@/shared/utils'
import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_PIPE } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'

import { getGraphQLConfig } from './config'
import { I18nValidationPipe } from './i18n'
import { I18nModule } from './i18n/i18n.module'
import { PrismaModule } from './prisma'
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
		// Core
		PrismaModule,
		RedisModule,
		I18nModule,

		// Libs
		MailModule,
		SmsModule,

		// Modules
		AccountModule,
		TwoFactorModule,
		RecoveryModule,
		SessionModule,
		VerificationModule,
	],
	providers: [
		{
			provide: APP_PIPE,
			useClass: I18nValidationPipe,
		},
	],
})
export class CoreModule {}
