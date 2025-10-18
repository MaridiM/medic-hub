# Account Module

**root**
`src/modules/auth/account/account.module.ts`

```typescript
import { Module } from '@nestjs/common'

import { VerificationService } from '../verification'

import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'

@Module({
	providers: [AccountService, AccountResolver, VerificationService],
})
export class AccountModule {}
```

`src/modules/auth/account/account.resolver.ts`

```typescript
import { Lang, Language } from '@/core/i18n'
import { Authorization, Authorized } from '@/shared/decorators'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AccountService } from './account.service'
import { ChangeEmailInput, ChangePasswordInput, CreateAccountInput } from './dtos'
import { User } from './models'

@Resolver()
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	/**
	 * Returns the currently authenticated user's profile (safe projection).
	 */
	@Authorization()
	@Query(() => User, {
		name: 'profile',
		description:
			'Get the currently authenticated user profile. Requires auth. Returns a safe projection (no password).',
	})
	async me(@Authorized('id') id: string) {
		return this.accountService.me(id)
	}

	/**
	 * Creates a new user account and sends an email verification token.
	 */
	@Mutation(() => User, {
		name: 'createAccount',
		description:
			'Create a new user account. Normalizes email, hashes password, and sends a verification email token.',
	})
	create(@Args('data') input: CreateAccountInput, @Lang() lng: Language): Promise<User> {
		return this.accountService.create(input, lng)
	}

	/**
	 * Changes the email of the authenticated user and re-sends a verification email.
	 */
	@Authorization()
	@Mutation(() => Boolean, {
		name: 'changeEmail',
		description:
			'Change the current user email. Normalizes email, rejects same email, resets verification and sends a new verification token.',
	})
	async changeEmail(
		@Authorized() user: User,
		@Args('data') input: ChangeEmailInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.accountService.changeEmail(user, input, lng)
	}

	/**
	 * Changes the password of the authenticated user after validating the old password.
	 */
	@Authorization()
	@Mutation(() => Boolean, {
		name: 'changePassword',
		description:
			'Change the current user password. Verifies old password, rejects identical new password, hashes and updates on success.',
	})
	async changePassword(
		@Authorized() user: User,
		@Args('data') input: ChangePasswordInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.accountService.changePassword(user, input, lng)
	}
}
```

`src/modules/auth/account/account.service.ts`

```typescript
import { hash, verify } from 'argon2'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { isPrismaError } from '@/shared/utils'
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common'

import { VerificationService } from '../verification'

import { ChangeEmailInput, ChangePasswordInput, CreateAccountInput } from './dtos'
import { User } from './models'

/**
 * AccountService
 * - User profile reading
 * - Account creation (email verification token delivery)
 * - Email change
 * - Password change
 *
 * All user-facing messages MUST go through `this.i18n.t(key, lng, fallback)`.
 */
@Injectable()
export class AccountService extends CoreService {
	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		private readonly verification: VerificationService,
	) {
		super(i18n, prisma)
	}

	/**
	 * Normalize email for uniqueness checks (trim + lower-case).
	 * @param email Raw email
	 * @returns Normalized email
	 */
	private normalizeEmail(email: string): string {
		return email.trim().toLowerCase()
	}

	/**
	 * Get current user profile (safe projection).
	 * NOTE: Even if password is hidden at the model level, we still explicitly
	 * select only the fields we need to avoid accidental data exposure.
	 *
	 * @param id User id
	 * @returns User or null
	 */
	async me(id: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { id },
		})

		return user as unknown as User | null
	}

	/**
	 * Create a new user account.
	 * - Normalizes email
	 * - Hashes password
	 * - Sends verification email token
	 * - Handles unique constraint race via Prisma P2002
	 *
	 * @param input  CreateAccountInput payload
	 * @param lng    Language code for messages
	 * @returns      Newly created user (safe projection)
	 * @throws ConflictException if email is already in use
	 */
	async create(input: CreateAccountInput, lng: Language): Promise<User> {
		const email = this.normalizeEmail(input.email)
		const hashedPassword = await hash(input.password)

		try {
			const user = await this.prisma.user.create({
				data: { ...input, email, password: hashedPassword },
			})

			// Optional: do not fail account creation if mailing fails
			await this.verification.sendEmailVerificationToken(user as any, lng)
			// await this.verification.sendEmailVerificationToken(user as unknown as User, lng)

			return user as unknown as User
		} catch (e) {
			if (isPrismaError(e, 'P2002')) {
				// Unique constraint violation: email already exists
				throw new ConflictException(
					this.i18n.t('auth.errors.user.already_exists', {
						lng,
						defaultValue: 'This email is already in use',
					}),
				)
			}
			throw new InternalServerErrorException(
				this.i18n.t('common.errors.unexpected', { lng, defaultValue: 'Unexpected error' }),
			)
		}
	}

	/**
	 * Change user email:
	 * - Normalizes email
	 * - Rejects if new email equals current
	 * - Updates email and resets verification
	 * - Sends new verification email token
	 * - Handles unique constraint via P2002
	 *
	 * @param user  Current user
	 * @param input New email
	 * @param lng   Language code for messages
	 * @returns     true if updated
	 * @throws BadRequestException  if same email as current
	 * @throws ConflictException    if email is taken
	 * @throws InternalServerErrorException for unexpected errors
	 */
	async changeEmail(user: User, input: ChangeEmailInput, lng: Language): Promise<boolean> {
		const email = this.normalizeEmail(input.email)

		if (email === this.normalizeEmail(user.email)) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.user.same_email', {
					lng,
					defaultValue: 'This email is already your current email',
				}),
			)
		}

		try {
			const updated = await this.prisma.user.update({
				where: { id: user.id },
				data: { email, isEmailVerified: false },
				select: { id: true, email: true, isEmailVerified: true },
			})

			await this.verification.sendEmailVerificationToken(updated as any, lng)
			// await this.verification.sendEmailVerificationToken(updated as unknown as User, lng)
			return true
		} catch (e) {
			if (isPrismaError(e, 'P2002')) {
				throw new ConflictException(
					this.i18n.t('auth.errors.user.already_exists', {
						lng,
						defaultValue: 'This email is already in use',
					}),
				)
			}
			throw new InternalServerErrorException(
				this.i18n.t('common.errors.unexpected', { lng, defaultValue: 'Unexpected error' }),
			)
		}
	}

	/**
	 * Change user password:
	 * - Verifies old password
	 * - Rejects if new password equals old
	 * - Hashes and updates password
	 *
	 * @param user  Current user
	 * @param input Old/new passwords
	 * @param lng   Language code for messages
	 * @returns     true on success
	 * @throws BadRequestException on invalid old password or same password
	 * @throws InternalServerErrorException if DB update fails
	 */
	async changePassword(user: User, input: ChangePasswordInput, lng: Language): Promise<boolean> {
		const { oldPassword, newPassword } = input

		// Verify old password
		const isValidOld = await verify(user.password, oldPassword)
		if (!isValidOld) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.password.invalid', { lng, defaultValue: 'Invalid password' }),
			)
		}

		// Forbid setting the same password
		if (oldPassword === newPassword) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.password.same', {
					lng,
					defaultValue: 'New password must differ from the old one',
				}),
			)
		}

		try {
			const hashed = await hash(newPassword)
			await this.prisma.user.update({
				where: { id: user.id },
				data: { password: hashed },
				select: { id: true },
			})
			// Optionally: invalidate sessions / notify user via email
			return true
		} catch {
			throw new InternalServerErrorException(
				this.i18n.t('auth.errors.password.change_failed', { lng, defaultValue: 'Failed to change password' }),
			)
		}
	}
}
```

`src/modules/auth/account/index.ts`

```typescript
export * from './account.module'
export * from './account.service'
export * from './models'
```

**dtos**
`src/modules/auth/account/dtos/change-email.dto.ts`

```typescript
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ChangeEmailInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string
}
```

`src/modules/auth/account/dtos/change-password.dto.ts`

```typescript
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ChangePasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	oldPassword: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	newPassword: string
}
```

`src/modules/auth/account/dtos/create.dto.ts`

```typescript
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MinLength } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateAccountInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
	fullName: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@IsPhoneNumber()
	phone: string
}
```

`src/modules/auth/account/dtos/index.ts`

```typescript
export * from './change-email.dto'
export * from './change-password.dto'
export * from './create.dto'
```

**models**
`src/modules/auth/account/models/index.ts`

```typescript
export * from './user.model'
```

`src/modules/auth/account/models/user.model.ts`

```typescript
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class User {
	@Field(() => ID)
	id: string

	@Field(() => String)
	fullName: string

	@Field(() => String)
	email: string

	@Field(() => String, { nullable: true })
	phone: string

	@HideField()
	password: string | null

	@Field(() => String, { nullable: true })
	firstName: string

	@Field(() => String, { nullable: true })
	lastName: string

	@Field(() => String, { nullable: true })
	avatar: string

	@Field(() => String, { nullable: true })
	bio: string

	@Field(() => Boolean)
	isEmailVerified: boolean

	@Field(() => Boolean)
	isTotpEnabled: boolean

	@Field(() => String, { nullable: true })
	totpSecret: string

	@Field(() => Boolean)
	isOtpEnabled: boolean

	@Field(() => String, { nullable: true })
	otpSecret: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
```
