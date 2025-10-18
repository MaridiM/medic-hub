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
