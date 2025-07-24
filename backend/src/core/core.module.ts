import 'module-alias/register'
import { AuthModule } from '@/modules/auth'
import { IS_DEV_ENV } from '@/shared/utils'
import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { getGraphQLConfig } from './config'
import { PrismaModule, PrismaService } from './prisma'
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
		PrismaModule,
		RedisModule,

		// Modules
		AuthModule,
	],
	providers: [PrismaService],
})
export class CoreModule {}
