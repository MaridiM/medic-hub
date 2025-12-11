# File: modules\auth\2fa\guards\2fa-verified.guard.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/guards/2fa-verified.guard.ts`

## Category
Backend

## File Type
TS (2fa-verified.guard.ts)

## Size
3465 characters, 110 lines

## Full Code

```typescript
import { I18nService } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

/**
 * Metadata key for 2FA verification requirement
 */
export const REQUIRE_2FA_VERIFICATION = 'require_2fa_verification'

/**
 * Guard to ensure user has verified 2FA for current session
 * Use this for sensitive operations that require fresh 2FA verification
 */
@Injectable()
export class TwoFactorVerifiedGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly prisma: PrismaService,
		private readonly i18n: I18nService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// Check if route requires 2FA verification
		const require2FA = this.reflector.getAllAndOverride<boolean>(REQUIRE_2FA_VERIFICATION, [
			context.getHandler(),
			context.getClass(),
		])

		if (!require2FA) {
			return true // Route doesn't require 2FA
		}

		const ctx = GqlExecutionContext.create(context)
		const gqlContext = ctx.getContext()
		const user = gqlContext.req?.user

		if (!user) {
			throw new UnauthorizedException(
				this.i18n.t('common.errors.auth.user_not_authorized', { defaultValue: 'User not authorized' }),
			)
		}

		// Check if user has 2FA enabled
		const userData = await this.prisma.user.findUnique({
			where: { id: user.id },
			select: { is2FAEnabled: true },
		})

		if (!userData?.is2FAEnabled) {
			return true // User doesn't have 2FA, so no verification needed
		}

		// Check session 2FA verification status
		const sessionToken =
			gqlContext.req?.cookies?.sessionToken || gqlContext.req?.headers?.authorization?.replace('Bearer ', '')

		if (!sessionToken) {
			throw new UnauthorizedException(
				this.i18n.t('common.errors.auth.user_not_authorized', { defaultValue: 'Session not found' }),
			)
		}

		const session = await this.prisma.session.findUnique({
			where: { token: sessionToken },
			select: { is2FAVerified: true, verified2FAAt: true },
		})

		if (!session?.is2FAVerified) {
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.2fa.verification_required', { defaultValue: '2FA verification required' }),
			)
		}

		// Optional: Check if verification is recent (e.g., within last 5 minutes)
		const VERIFICATION_VALIDITY = 5 * 60 * 1000 // 5 minutes
		if (session.verified2FAAt) {
			const timeSinceVerification = Date.now() - session.verified2FAAt.getTime()
			if (timeSinceVerification > VERIFICATION_VALIDITY) {
				throw new UnauthorizedException(
					this.i18n.t('auth.errors.2fa.verification_expired', {
						defaultValue: '2FA verification has expired. Please verify again.',
					}),
				)
			}
		}

		return true
	}
}

/**
 * Decorator to require 2FA verification for a route.
 * Can be applied to a class or a method.
 */
export const Require2FAVerification = (): ((
	target: any,
	propertyKey?: string | symbol,
	descriptor?: PropertyDescriptor,
) => void) => {
	return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
		if (descriptor) {
			Reflect.defineMetadata(REQUIRE_2FA_VERIFICATION, true, descriptor.value)
		} else {
			Reflect.defineMetadata(REQUIRE_2FA_VERIFICATION, true, target)
		}
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.140Z*
