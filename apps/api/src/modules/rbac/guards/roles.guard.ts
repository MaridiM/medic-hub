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
