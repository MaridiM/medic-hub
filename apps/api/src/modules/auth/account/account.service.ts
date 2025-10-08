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
 * All user-facing messages MUST go through `this.msg(key, lng, fallback)`.
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
			select: {
				id: true,
				fullName: true,
				firstName: true,
				lastName: true,
				phone: true,
				email: true,
				isEmailVerified: true,
				isTotpEnabled: true,
				isOtpEnabled: true,
				createdAt: true,
				updatedAt: true,
			},
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
				select: {
					id: true,
					email: true,
					fullName: true,
					firstName: true,
					lastName: true,
					isEmailVerified: true,
					createdAt: true,
					updatedAt: true,
				},
			})

			// Optional: do not fail account creation if mailing fails
			await this.verification.sendVerificationEmailToken(user as unknown as User, lng)

			return user as unknown as User
		} catch (e) {
			if (isPrismaError(e, 'P2002')) {
				// Unique constraint violation: email already exists
				throw new ConflictException(
					this.msg('auth.errors.user.already_exists', 'This email is already in use', { lng }),
				)
			}
			throw new InternalServerErrorException(this.msg('common.errors.unexpected', 'Unexpected error', { lng }))
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
				this.msg('auth.errors.user.same_email', 'This email is already your current email', { lng }),
			)
		}

		try {
			const updated = await this.prisma.user.update({
				where: { id: user.id },
				data: { email, isEmailVerified: false },
				select: { id: true, email: true, isEmailVerified: true },
			})

			await this.verification.sendVerificationEmailToken(updated as unknown as User, lng)
			return true
		} catch (e) {
			if (isPrismaError(e, 'P2002')) {
				throw new ConflictException(
					this.msg('auth.errors.user.already_exists', 'This email is already in use', { lng }),
				)
			}
			throw new InternalServerErrorException(this.msg('common.errors.unexpected', 'Unexpected error', { lng }))
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
			throw new BadRequestException(this.msg('auth.errors.password.invalid', 'Invalid password', { lng }))
		}

		// Forbid setting the same password
		if (oldPassword === newPassword) {
			throw new BadRequestException(
				this.msg('auth.errors.password.same', 'New password must differ from the old one', { lng }),
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
				this.msg('auth.errors.password.change_failed', 'Failed to change password', { lng }),
			)
		}
	}
}
