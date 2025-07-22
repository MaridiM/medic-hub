import { AuthModule, HealthModule } from '@/modules'
import { IS_DEV_ENV } from '@/shared/utils'
import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { TerminusModule } from '@nestjs/terminus'

import { getGraphQLConfig } from './config'
import { PrismaModule, PrismaService } from './prisma'
import { RedisModule } from './redis'

console.log('POSTGRES_URL')
@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true,
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

		// Health
		TerminusModule,
		HealthModule,
	],
	providers: [PrismaService],
})
export class CoreModule {}
