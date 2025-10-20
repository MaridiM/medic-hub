# Recovery Module

**root**
`src/modules/auth/recovery/index.ts`

```typescript
export * from './recovery.module'
export * from './recovery.service'
```

`src/modules/auth/recovery/recovery.module.ts`

```typescript
import { Module } from '@nestjs/common'

import { RecoveryResolver } from './recovery.resolver'
import { RecoveryService } from './recovery.service'

@Module({
	providers: [RecoveryResolver, RecoveryService],
})
export class RecoveryModule {}
```

`src/modules/auth/recovery/recovery.resolver.ts`

```typescript
import { Lang, Language } from '@/core/i18n'
import { UserAgent } from '@/shared/decorators'
import type { GqlContext } from '@/shared/types'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { NewPasswordInput, ResetPasswordInput } from './dtos'
import { RecoveryService } from './recovery.service'

@Resolver('Recovery')
export class RecoveryResolver {
	constructor(private readonly recoveryService: RecoveryService) {}

	/**
	 * Initiates password reset flow by email.
	 * Generates a one-time reset token and sends a reset link to the user.
	 */
	@Mutation(() => Boolean, {
		name: 'resetPassword',
		description: 'Initiate password reset: generate a one-time token and send a reset link to the user’s email.',
	})
	async resetPassword(
		@Context() { req }: GqlContext,
		@Args('data', {
			type: () => ResetPasswordInput,
			description: 'Payload with the email address that requests a password reset.',
		})
		input: ResetPasswordInput,
		@UserAgent() userAgent: string,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.recoveryService.resetPassword(req, input, userAgent, lng)
	}

	/**
	 * Completes password reset using a valid token by setting a new password.
	 * Consumes the token on success.
	 */
	@Mutation(() => Boolean, {
		name: 'newPassword',
		description: 'Complete password reset: validate token, set a new password, and consume the token.',
	})
	async newPassword(
		@Args('data', {
			type: () => NewPasswordInput,
			description: 'Payload with the reset token and the new password.',
		})
		input: NewPasswordInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.recoveryService.newPassword(input, lng)
	}
}
```

`src/modules/auth/recovery/recovery.service.ts`

```typescript
import { hash } from 'argon2'
import { Request } from 'express'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { MailService } from '@/modules/libs'
import { generateToken, getSessionMetadata } from '@/shared/utils'
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ETokenType, User } from '@prisma/__generated__'

import { NewPasswordInput, ResetPasswordInput } from './dtos'

@Injectable()
export class RecoveryService extends CoreService {
	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		private readonly mail: MailService,
	) {
		super(i18n, prisma)
	}

	/** Normalize email for uniqueness checks (trim + lower-case). */
	private normalizeEmail(email: string): string {
		return email.trim().toLowerCase()
	}

	/**
	 * Start password reset flow:
	 * 1) Normalize email and check that the user exists
	 * 2) Generate a one-time PASSWORD_RESET token
	 * 3) Try to send the reset email (non-blocking: mail errors won't fail the flow)
	 * 4) Always return true on success path
	 *
	 * @param req Express request (for IP/geo/browser meta)
	 * @param input ResetPasswordInput { email }
	 * @param userAgent Raw User-Agent header
	 * @param lng Language code for i18n
	 * @returns true if the flow was initiated
	 * @throws NotFoundException if user is not found
	 * @throws InternalServerErrorException on unexpected DB errors
	 */
	async resetPassword(req: Request, input: ResetPasswordInput, userAgent: string, lng: Language): Promise<boolean> {
		const email = this.normalizeEmail(input.email)

		// 1) Check user existence with minimal projection
		const user = await this.prisma.user.findUnique({
			where: { email },
			select: { id: true, email: true },
		})

		if (!user) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.user.not_found', { lng, defaultValue: 'User not found' }),
			)
		}

		try {
			// 2) Generate/reset token for this user
			const token = await generateToken(this.prisma, user as User, ETokenType.PASSWORD_RESET)

			// 3) Send email (do not fail the flow if mailer throws)
			const meta = getSessionMetadata(req, userAgent)
			try {
				await this.mail.sendPasswordResetToken(user.email, token.token, meta, lng)
			} catch {
				// Optional: log mailer error; we don't block the flow for transient mail issues
				// this.logger?.warn('sendPasswordResetToken failed', err);
				throw new InternalServerErrorException(
					this.i18n.t('auth.errors.mail.reset_send_failed', {
						lng,
						defaultValue: 'Could not send password reset email',
					}),
				)
			}

			// 4) Indicate success to the client
			return true
		} catch {
			// Wrap any unexpected persistence errors
			throw new InternalServerErrorException(
				this.i18n.t('common.errors.unexpected', { lng, defaultValue: 'Unexpected error' }),
			)
		}
	}

	/**
	 * Set a new password by reset token:
	 *  - validates token existence and type
	 *  - checks expiration
	 *  - hashes and saves the new password
	 *  - removes the used token
	 *
	 * @param input DTO with `token` and `password`
	 * @param lng i18n language code
	 * @returns `true` on success
	 * @throws NotFoundException if token not found
	 * @throws BadRequestException if token expired
	 */
	async newPassword(input: NewPasswordInput, lng: Language): Promise<boolean> {
		const { password, token } = input

		// token is unique in the schema -> find by token only
		const t = await this.prisma.token.findUnique({
			where: { token },
			select: { id: true, type: true, expiresIn: true, userId: true },
		})

		if (!t || t.type !== ETokenType.PASSWORD_RESET) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.token.not_found', { lng, defaultValue: 'Token not found' }),
			)
		}

		if (new Date(t.expiresIn) < new Date()) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.token.expired', { lng, defaultValue: 'Token expired' }),
			)
		}

		try {
			const hashed = await hash(password)

			// Update password and consume the token
			await this.prisma.$transaction([
				this.prisma.user.update({
					where: { id: t.userId },
					data: { password: hashed },
					select: { id: true },
				}),
				this.prisma.token.delete({ where: { id: t.id } }),
			])

			return true
		} catch {
			throw new InternalServerErrorException(
				this.i18n.t('auth.errors.password.change_failed', { lng, defaultValue: 'Failed to change password' }),
			)
		}
	}
}
```

**dtos**
`src/modules/auth/recovery/dtos/index.ts`

```typescript
export * from './new-password.dto'
export * from './reset-password.dto'
```

`src/modules/auth/recovery/dtos/new-password.dto.ts`

```typescript
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class NewPasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string

	@Field(() => String)
	@IsUUID(4)
	@IsNotEmpty()
	token: string
}
```

`src/modules/auth/recovery/dtos/reset-password.dto.ts`

```typescript
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ResetPasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string
}
```
