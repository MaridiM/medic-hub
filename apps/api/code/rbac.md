# RBAC Module

**root**
`src/modules/rbac/index.ts`

```typescript
export * from './rbac.module'
export * from './guards'
export * from './decorators'
export * from './types/rbac.types'
```

`src/modules/rbac/rbac.module.ts`

```typescript
import { Global, Module } from '@nestjs/common'

import { RolesGuard } from './guards'

/**
 * Global module providing Role-Based Access Control (RBAC) functionality.
 * Exports guards and utilities for role-based authorization across the application.
 *
 * @module RbacModule
 */
@Global()
@Module({
	providers: [RolesGuard],
	exports: [RolesGuard],
})
export class RbacModule {}
```

`src/modules/rbac/rbac.service.ts`

```typescript
import { Injectable } from '@nestjs/common'

@Injectable()
export class RbacService {}
```

**decorators**
`src/modules/rbac/decorators/index.ts`

```typescript
export * from './roles.decorator'
```

`src/modules/rbac/decorators/roles.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common'

import { EUserRole, ROLES_KEY } from '../types/rbac.types'

/**
 * Decorator to assign required roles to a GraphQL resolver or REST endpoint.
 * Used in conjunction with RolesGuard to enforce role-based access control.
 *
 * @param {...EUserRole[]} roles - One or more roles that are allowed to access the resource.
 * @returns {MethodDecorator & ClassDecorator} A decorator function.
 *
 * @example
 * ```typescript
 * // Single role requirement
 * @Roles(EUserRole.SUPER_ADMIN)
 * @UseGuards(RolesGuard)
 * async deleteUser() { ... }
 *
 * // Multiple roles (user must have at least one)
 * @Roles(EUserRole.SUPER_ADMIN, EUserRole.MODERATOR)
 * @UseGuards(RolesGuard)
 * async moderateContent() { ... }
 * ```
 */
export const Roles = (...roles: EUserRole[]): MethodDecorator & ClassDecorator => SetMetadata(ROLES_KEY, roles)
```

**guards**
`src/modules/rbac/guards/index.ts`

```typescript
export * from './roles.guard'
```

`src/modules/rbac/guards/roles.guard.ts`

```typescript
import { PrismaService } from '@/core/prisma'
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { EUserRole, RequiredRoles, ROLES_KEY } from '../types/rbac.types'

/**
 * Guard that checks if the current user has the required roles to access a resource.
 * Fetches the user's current roles from the database to ensure data freshness.
 *
 * @class RolesGuard
 * @implements {CanActivate}
 */
@Injectable()
export class RolesGuard implements CanActivate {
	private readonly logger = new Logger(RolesGuard.name)

	constructor(
		private readonly reflector: Reflector,
		private readonly prisma: PrismaService,
	) {}

	/**
	 * Determines if the current user is authorized to access the resource.
	 *
	 * @param {ExecutionContext} context - The execution context.
	 * @returns {Promise<boolean>} True if the user has the required roles, false otherwise.
	 * @throws {ForbiddenException} If the user lacks the required roles.
	 */
	async canActivate(context: ExecutionContext): Promise<boolean> {
		// Get required roles from decorator metadata
		const requiredRoles = this.reflector.getAllAndOverride<RequiredRoles>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		])

		// If no roles are required, allow access
		if (!requiredRoles || requiredRoles.length === 0) {
			return true
		}

		// Extract user from GraphQL context
		const gqlContext = GqlExecutionContext.create(context)
		const request = gqlContext.getContext().req
		const user = request?.user

		// User must be authenticated
		if (!user?.id) {
			this.logger.warn('RolesGuard: No authenticated user found in request')
			throw new ForbiddenException('Authentication required to access this resource')
		}

		// Fetch fresh roles from database
		const dbUser = await this.prisma.user.findUnique({
			where: { id: user.id },
			select: {
				id: true,
				email: true,
				roles: true,
			},
		})

		if (!dbUser) {
			this.logger.error(`RolesGuard: User ${user.id} not found in database`)
			throw new ForbiddenException('User not found')
		}

		// Check if user has at least one of the required roles
		const hasRequiredRole = requiredRoles.some(role => dbUser.roles.includes(role))

		if (!hasRequiredRole) {
			this.logger.warn(
				`RolesGuard: User ${dbUser.email} lacks required roles. ` +
					`Has: [${dbUser.roles.join(', ')}], Needs one of: [${requiredRoles.join(', ')}]`,
			)
			throw new ForbiddenException(
				'Insufficient permissions. You need one of the following roles: ' + requiredRoles.join(', '),
			)
		}

		this.logger.debug(`RolesGuard: User ${dbUser.email} authorized with roles [${dbUser.roles.join(', ')}]`)

		return true
	}
}
```

**types**
`src/modules/rbac/types/index.ts`

```typescript
export * from './rbac.types'
```

`src/modules/rbac/types/rbac.types.ts`

```typescript
import { EUserRole } from '@prisma/__generated__'

/**
 * @fileoverview Type definitions for the RBAC (Role-Based Access Control) system.
 * @module rbac/types
 */

/**
 * Metadata key used to store required roles on a resolver or controller method.
 * This key is used by the @Roles decorator and RolesGuard.
 * @constant
 */
export const ROLES_KEY = 'roles'

/**
 * Re-export the user roles enum from Prisma for convenience.
 * This ensures consistency across the application.
 */
export { EUserRole }

/**
 * Type representing an array of roles required for access.
 */
export type RequiredRoles = EUserRole[]
```
