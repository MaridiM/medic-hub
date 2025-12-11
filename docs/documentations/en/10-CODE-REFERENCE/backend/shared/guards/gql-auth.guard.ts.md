# File: shared\guards\gql-auth.guard.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/shared/guards/gql-auth.guard.ts`

## Category
Backend

## File Type
TS (gql-auth.guard.ts)

## Size
1260 characters, 39 lines

## Full Code

```typescript
import { DEFAULT_LANGUAGE, I18nService } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class GqlAuthGuard implements CanActivate {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly i18n: I18nService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const gqlContext = ctx.getContext<{ req: { session: { userId?: string }; language?: string; user?: any } }>()
		const request = gqlContext.req
		const lang = request.language || DEFAULT_LANGUAGE

		const user_not_authorized: string =
			this.i18n.t('common.errors.auth.user_not_authorized', { lng: lang }) || 'User not authorized'

		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException(user_not_authorized)
		}

		const user = await this.prismaService.user.findUnique({
			where: { id: request.session.userId },
		})

		if (!user) {
			throw new UnauthorizedException(user_not_authorized)
		}

		request.user = user

		return true
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.660Z*
