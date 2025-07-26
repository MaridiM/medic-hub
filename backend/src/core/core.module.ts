import 'module-alias/register'

import { AccountModule } from '@/modules/auth'
import { IS_DEV_ENV } from '@/shared/utils'
import { ApolloDriver } from '@nestjs/apollo'
import {Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { getGraphQLConfig } from './config'
import { PrismaModule } from './prisma'
import { RedisModule } from './redis'
import { I18nModule } from './i18n/i18n.module';

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

		// Modules
		AccountModule,

		I18nModule,
	],
})
export class CoreModule {}
