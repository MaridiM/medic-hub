# File: core\config\graphql.config.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/core/config/graphql.config.ts`

## Category
Backend

## File Type
TS (graphql.config.ts)

## Size
701 characters, 24 lines

## Full Code

```typescript
import { Request, Response } from 'express'
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
		context: ({ req, res }: { req: Request; res: Response }) => ({
			req,
			res,
			language: req.language || DEFAULT_LANGUAGE,
		}),
		installSubscriptionHandlers: true,
	}
}

```

## Description

This file is part of the MedicHub API (NestJS) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:18.997Z*
