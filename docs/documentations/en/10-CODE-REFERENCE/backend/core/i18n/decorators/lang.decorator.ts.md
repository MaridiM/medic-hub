# File: core\i18n\decorators\lang.decorator.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/core/i18n/decorators/lang.decorator.ts`

## Category
Backend

## File Type
TS (lang.decorator.ts)

## Size
1417 characters, 46 lines

## Full Code

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

type ReqLike = {
	cookies?: Record<string, string | undefined>
	language?: string
	headers?: Record<string, string | string[] | undefined>
}

/** Get request from either GraphQL or HTTP context. */
function getReq(ctx: ExecutionContext): ReqLike {
	const gql = GqlExecutionContext.create(ctx)
	const g = gql.getContext<{ req?: ReqLike }>()
	return g?.req ?? ctx.switchToHttp().getRequest<ReqLike>()
}

/** Normalize language-like value to a short, lowercase tag. */
function norm(v?: string | string[]): string | undefined {
	const raw = Array.isArray(v) ? v[0] : v
	if (!raw) return
	return raw.split(',')[0]?.split(';')[0]?.trim().toLowerCase() || undefined
}

/**
 * @Lang() — best-effort language extractor.
 *
 * Resolution order:
 *  1) cookie: language
 *  2) req.language (if set by middleware)
 *  3) header: Accept-Language (first tag)
 *  4) fallback: "en"
 *
 * @example
 * @Resolver()
 * class ExampleResolver {
 *   @Query(() => String)
 *   hello(@Lang() lng: Language) {
 *     return `lang=${lang}`;
 *   }
 * }
 */
export const Lang = createParamDecorator<unknown, string>((_data, ctx) => {
	const req = getReq(ctx)
	return norm(req.cookies?.language) ?? norm(req.language) ?? norm(req.headers?.['accept-language']) ?? 'en'
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.018Z*
