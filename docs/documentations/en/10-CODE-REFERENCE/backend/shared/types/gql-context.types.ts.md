# File: shared\types\gql-context.types.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/shared/types/gql-context.types.ts`

## Category
Backend

## File Type
TS (gql-context.types.ts)

## Size
1054 characters, 36 lines

## Full Code

```typescript
import type { Request, Response } from 'express'

import type { User as PrismaUser } from '@prisma/__generated__'

/**
 * The authenticated user object attached to the request,
 * with sensitive fields like 'password' omitted.
 * Using a `type` alias is the correct approach for transformations like Omit.
 */
export type AuthenticatedUser = Omit<PrismaUser, 'password'>

/**
 * Extends the base Express Request interface to include our custom properties,
 * ensuring type safety throughout the application.
 */
export interface AuthenticatedRequest extends Request {
	/**
	 * The authenticated user object, attached by an authentication guard/middleware.
	 */
	user?: AuthenticatedUser

	/**
	 * The session object, now correctly typed with our custom fields
	 * thanks to declaration merging in `session.types.ts`.
	 */
	session: Request['session']
}

/**
 * The GraphQL context object, providing typed access to the request and response.
 */
export interface GqlContext {
	req: AuthenticatedRequest
	res: Response
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.677Z*
