# Account Module

**root**
`src/modules/auth/account/account.module.ts`

```typescript
import { Module } from '@nestjs/common'

import { VerificationService } from '../verification'

import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'
// Import enums registration
import './models/enums'

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

@Resolver(() => User)
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	/**
	 * Returns the currently authenticated user's profile (safe projection).
	 */
	@Authorization()
	@Query(() => User, {
		name: 'profile',
		description: 'Get the currently authenticated user profile. Returns safe projection without sensitive data.',
	})
	async me(@Authorized('id') id: string): Promise<User> {
		return this.accountService.me(id)
	}

	/**
	 * Creates a new user account and sends an email verification token.
	 */
	@Mutation(() => User, {
		name: 'createAccount',
		description:
			'Create a new user account. Normalizes email, hashes password with Argon2id, and sends verification email.',
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
		description: 'Change current user email address. Resets verification status and sends new verification email.',
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
		description: 'Change current user password. Verifies old password, updates passwordChangedAt timestamp.',
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
import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { isPrismaError } from '@/shared/utils'
import { HashUtil } from '@/shared/utils/hash.util'
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common'

import { VerificationService } from '../verification'

import { ChangeEmailInput, ChangePasswordInput, CreateAccountInput } from './dtos'
import { User } from './models'

/**
 * AccountService
 * Handles user profile operations:
 * - Profile reading
 * - Account creation with email verification
 * - Email change with re-verification
 * - Password change with passwordChangedAt tracking
 *
 * All user-facing messages are internationalized via I18nService.
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
	 * Normalize email for uniqueness checks (trim + lowercase).
	 * @param email - Raw email input
	 * @returns Normalized email
	 */
	private normalizeEmail(email: string): string {
		return email.trim().toLowerCase()
	}

	/**
	 * Get current user profile (safe projection without password).
	 *
	 * @param id - User ID
	 * @returns User profile or null if not found
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
	 * - Hashes password with Argon2id
	 * - Sends email verification token
	 * - Handles unique constraint violations (P2002)
	 *
	 * @param input - Account creation payload
	 * @param lng - Language code for i18n
	 * @returns Newly created user (safe projection)
	 * @throws ConflictException if email already exists
	 * @throws InternalServerErrorException on unexpected errors
	 */
	async create(input: CreateAccountInput, lng: Language): Promise<User> {
		const email = this.normalizeEmail(input.email)
		const hashedPassword = await HashUtil.hash(input.password)

		try {
			const user = await this.prisma.user.create({
				data: {
					...input,
					email,
					password: hashedPassword,
				},
			})

			// Send verification email (non-blocking)
			await this.verification.sendEmailVerificationToken(user, lng).catch(() => {
				// Log error but don't fail account creation
			})

			return user as unknown as User
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
	 * Change user email address.
	 * - Normalizes email
	 * - Rejects if new email equals current email
	 * - Resets email verification status
	 * - Sends new verification email
	 * - Handles unique constraint violations
	 *
	 * @param user - Current authenticated user
	 * @param input - New email input
	 * @param lng - Language code for i18n
	 * @returns true if successful
	 * @throws BadRequestException if email is the same as current
	 * @throws ConflictException if email is already taken
	 * @throws InternalServerErrorException on unexpected errors
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
				data: {
					email,
					isEmailVerified: false,
					emailVerifiedAt: null,
				},
			})

			// Send verification email
			await this.verification.sendEmailVerificationToken(updated, lng).catch(() => {})

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
	 * Change user password.
	 * - Verifies old password with Argon2id
	 * - Rejects if new password equals old password
	 * - Hashes new password
	 * - Updates passwordChangedAt timestamp
	 *
	 * @param user - Current authenticated user
	 * @param input - Password change payload
	 * @param lng - Language code for i18n
	 * @returns true if successful
	 * @throws BadRequestException if old password is invalid or passwords match
	 * @throws InternalServerErrorException on database errors
	 */
	async changePassword(user: User, input: ChangePasswordInput, lng: Language): Promise<boolean> {
		const { oldPassword, newPassword } = input

		// Verify old password
		const isValidOld = await HashUtil.verify(user.password, oldPassword)
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
			const hashed = await HashUtil.hash(newPassword)
			await this.prisma.user.update({
				where: { id: user.id },
				data: {
					password: hashed,
					passwordChangedAt: new Date(),
				},
			})

			// TODO: Optionally invalidate all sessions except current one
			// TODO: Send email notification about password change

			return true
		} catch {
			throw new InternalServerErrorException(
				this.i18n.t('auth.errors.password.change_failed', {
					lng,
					defaultValue: 'Failed to change password',
				}),
			)
		}
	}
}
```

`src/modules/auth/account/index.ts`

```typescript
// Ensure enums are registered before anything else
import './models/enums'

export * from './account.module'
export * from './account.service'
export * from './models'
```

**dtos**
`src/modules/auth/account/dtos/change-email.dto.ts`

```typescript
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

/**
 * Email change input
 */
@InputType('ChangeEmailInput', {
	description: 'Input data for changing user email address',
})
export class ChangeEmailInput {
	@Field({
		description: 'New email address (must be unique and different from current)',
	})
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

/**
 * Password change input
 */
@InputType('ChangePasswordInput', {
	description: 'Input data for changing user password',
})
export class ChangePasswordInput {
	@Field({
		description: 'Current password (for verification)',
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	oldPassword: string

	@Field({
		description: 'New password (minimum 8 characters, must differ from old)',
	})
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

/**
 * Account creation input
 */
@InputType('CreateAccountInput', {
	description: 'Input data for creating a new user account',
})
export class CreateAccountInput {
	@Field({
		description: 'Full name (alphanumeric with hyphens allowed)',
	})
	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
	fullName: string

	@Field({
		description: 'Email address (must be unique)',
	})
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string

	@Field({
		description: 'Password (minimum 8 characters)',
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string

	@Field({
		description: 'Phone number in E.164 format (e.g., +1234567890)',
	})
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
`src/modules/auth/account/models/enums.ts`

```typescript
import { registerEnumType } from '@nestjs/graphql'
import { E2FAMethod, EUserRole } from '@prisma/__generated__'

/**
 * Register Prisma enums for GraphQL
 * Must be imported before any models that use these enums
 */

registerEnumType(EUserRole, {
	name: 'EUserRole',
	description: 'User role for access control and permissions',
	valuesMap: {
		USER: {
			description: 'Regular user with standard permissions',
		},
		SUPER_ADMIN: {
			description: 'Super administrator with full system access',
		},
	},
})

registerEnumType(E2FAMethod, {
	name: 'E2FAMethod',
	description: 'Available two-factor authentication methods',
	valuesMap: {
		TOTP: {
			description: 'Time-based one-time password (Google Authenticator, Authy, 1Password)',
		},
		OTP_EMAIL: {
			description: 'One-time password sent via email',
		},
		OTP_SMS: {
			description: 'One-time password sent via SMS',
		},
		WEBAUTHN: {
			description: 'WebAuthn/FIDO2 hardware security keys (YubiKey, Titan)',
		},
		PASSKEY: {
			description: 'Passkeys using biometrics (TouchID, FaceID, Windows Hello)',
		},
		BACKUP_CODE: {
			description: 'Backup recovery codes for emergency access',
		},
	},
})

export { EUserRole, E2FAMethod }
```

`src/modules/auth/account/models/index.ts`

```typescript
// Register enums FIRST before importing User model
import './enums'

export * from './enums'
export * from './user.model'
```

`src/modules/auth/account/models/user.model.ts`

```typescript
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql'

import { E2FAMethod, EUserRole } from './enums'

/**
 * User GraphQL model
 * Represents a user account with security features and profile information
 * Password field is hidden from GraphQL schema for security
 */
@ObjectType('User', {
	description: 'User account with profile, security, and authentication settings',
})
export class User {
	// ===== Identity =====

	@Field(() => ID, {
		description: 'Unique user identifier (UUID v4)',
	})
	id: string

	// ===== Profile Fields =====

	@Field({
		description: 'Full name of the user (displayed in UI)',
	})
	fullName: string

	@Field({
		nullable: true,
		description: 'First name (optional, parsed from fullName)',
	})
	firstName?: string

	@Field({
		nullable: true,
		description: 'Last name (optional, parsed from fullName)',
	})
	lastName?: string

	@Field({
		description: 'Email address (unique, used for login and notifications)',
	})
	email: string

	@Field({
		nullable: true,
		description: 'Phone number in E.164 format (optional, used for SMS 2FA)',
	})
	phone?: string

	@Field({
		nullable: true,
		description: 'Avatar image URL (optional)',
	})
	avatar?: string

	@Field({
		nullable: true,
		description: 'User biography or description (optional)',
	})
	bio?: string

	// ===== Password (Hidden) =====

	@HideField()
	password: string

	// ===== Role-Based Access Control =====

	@Field(() => [EUserRole], {
		description: 'User roles for access control (can have multiple roles)',
	})
	roles: EUserRole[]

	// ===== Email Verification =====

	@Field({
		description: 'Whether the email address has been verified',
	})
	isEmailVerified: boolean

	@Field({
		nullable: true,
		description: 'Timestamp when email was verified (null if not verified)',
	})
	emailVerifiedAt?: Date

	@Field({
		nullable: true,
		description: 'Whether user has unsubscribed from email notifications',
	})
	isUnsubscribed?: boolean

	@Field({
		nullable: true,
		description: 'Timestamp of last email bounce (for reputation tracking)',
	})
	emailBouncedAt?: Date

	// ===== Phone Verification =====

	@Field({
		description: 'Whether the phone number has been verified',
	})
	isPhoneVerified: boolean

	@Field({
		nullable: true,
		description: 'Timestamp when phone was verified (null if not verified)',
	})
	phoneVerifiedAt?: Date

	@Field({
		nullable: true,
		description: 'Timestamp of last SMS delivery failure (for reputation tracking)',
	})
	phoneBouncedAt?: Date

	// ===== Unified 2FA System =====

	@Field({
		description: 'Global 2FA status - true if user has at least one active 2FA method',
	})
	is2FAEnabled: boolean

	@Field(() => E2FAMethod, {
		nullable: true,
		description: 'User preferred 2FA method used by default during login',
	})
	preferred2FAMethod?: E2FAMethod

	@Field({
		description: 'Whether 2FA is mandatory for this user (admin-enforced for compliance)',
	})
	require2FA: boolean

	// ===== Account Security =====

	@Field({
		nullable: true,
		description: 'Timestamp of last successful login',
	})
	lastLoginAt?: Date

	@Field({
		nullable: true,
		description: 'IP address of last successful login',
	})
	lastLoginIp?: string

	@Field({
		nullable: true,
		description: 'Timestamp when password was last changed',
	})
	passwordChangedAt?: Date

	// ===== Risk Assessment =====

	@Field({
		nullable: true,
		description: 'User risk score (0-100): 0 = trusted, 100 = high risk. Based on login patterns and behavior.',
	})
	riskScore?: number

	@Field({
		nullable: true,
		description: 'Timestamp when risk score was last calculated',
	})
	lastRiskAssessAt?: Date

	// ===== Soft Delete =====

	@Field({
		nullable: true,
		description: 'Soft delete timestamp (null if account is active)',
	})
	deletedAt?: Date

	// ===== Timestamps =====

	@Field({
		description: 'Account creation timestamp',
	})
	createdAt: Date

	@Field({
		description: 'Account last update timestamp (auto-updated)',
	})
	updatedAt: Date
}
```
