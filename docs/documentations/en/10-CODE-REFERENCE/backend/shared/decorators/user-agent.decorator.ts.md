# File: shared\decorators\user-agent.decorator.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/shared/decorators/user-agent.decorator.ts`

## Category
Backend

## File Type
TS (user-agent.decorator.ts)

## Size
597 characters, 18 lines

## Full Code

```typescript
import type { Request } from 'express'

import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const UserAgent = createParamDecorator((data: unknown, context: ExecutionContext) => {
	if (context.getType() === 'http') {
		const request = context.switchToHttp().getRequest<Request>()

		return request.headers['user-agent']
	} else {
		const ctx = GqlExecutionContext.create(context)
		const gqlContext = ctx.getContext<{ req?: Request }>()

		return gqlContext.req?.headers['user-agent'] ?? null
	}
})

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.657Z*
