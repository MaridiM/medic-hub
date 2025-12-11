# File: shared\decorators\authorized.decorator.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/shared/decorators/authorized.decorator.ts`

## Category
Backend

## File Type
TS (authorized.decorator.ts)

## Size
643 characters, 21 lines

## Full Code

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { User } from '@prisma/__generated__'

export const Authorized = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
	let user: User

	if (ctx.getType() === 'http') {
		const req = ctx.switchToHttp().getRequest<{ user: User }>()
		user = req.user
	} else {
		const context = GqlExecutionContext.create(ctx)
		const gqlContext = context.getContext<{ req: { user: User } }>()
		user = gqlContext.req.user

		if (!user) return null
	}

	return data ? user[data] : user
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.638Z*
