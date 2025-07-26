import { join } from 'path'

import { DEFAULT_LANGUAGE } from '@/core/i18n'
import { ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigService } from '@nestjs/config'

export function getGraphQLConfig(configService: ConfigService): ApolloDriverConfig {
  const path = configService.getOrThrow<string>('GRAPHQL_PREFIX')
  const autoSchemaFile = join(process.cwd(), 'src/core/graphql/schema.gql')


	return {
		path,
		autoSchemaFile,
		sortSchema: true,
		context: ({ req, res }) => ({ req, res, language: req.language || DEFAULT_LANGUAGE }),
		installSubscriptionHandlers: true,
	}
}
