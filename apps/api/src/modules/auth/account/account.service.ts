import { hash, verify } from 'argon2'

import { I18nService, PrismaService } from '@/core'
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

import { VerificationService } from '../verification'

import { ChangeEmailInput, ChangePasswordInput, CreateAccountInput } from './dtos'
import { User } from './models'

@Injectable()
export class AccountService {
	constructor(
		private readonly i18n: I18nService,
		private readonly prisma: PrismaService,
		private readonly verification: VerificationService,
	) {}

	/**
	 * Get current user profile
	 * @param id - user id
	 * @returns - user
	 */
	async me(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
		})
		return user
	}

	/**
	 * Create a new user
	 * @param data - The data for the new user
	 * @param language - The language of the user
	 * @returns The new user
	 */
	async create(input: CreateAccountInput, language: string): Promise<User> {
		const isEmailExists = await this.prisma.user.findUnique({ where: { email: input.email } })
		if (isEmailExists) {
			throw new ConflictException(this.i18n.t('auth.user_already_exists', { lng: language }))
		}

		const hashedPassword = await hash(input.password)

		const user = await this.prisma.user.create({ data: { ...input, password: hashedPassword } })
		await this.verification.sendVerificationEmailToken(user, language)
		return user
	}

	/**
	 * Method for change email
	 * @param user - current user
	 * @param input - user input
	 * @returns - boolean
	 */
	async changeEmail(user: User, input: ChangeEmailInput) {
		const { email } = input

		const isEmailExists = await this.prisma.user.findUnique({ where: { email } })
		if (isEmailExists) {
			throw new ConflictException(this.i18n.t('auth.user_already_exists') || 'This email is already in use')
		}

		await this.prisma.user.update({
			where: { id: user.id },
			data: { email },
		})
		return true
	}
	/**
	 * Method for change password
	 * @param user - current user
	 * @param input - user input
	 * @returns - boolean
	 */
	async changePassword(user: User, input: ChangePasswordInput) {
		const { oldPassword, newPassword } = input

		const isValidPassword = await verify(user.password, oldPassword)
		if (!isValidPassword) {
			throw new NotFoundException(this.i18n.t('auth.invalid_password') || 'Invalid password')
		}

		await this.prisma.user.update({
			where: { id: user.id },
			data: { password: await hash(newPassword) },
		})
		return true
	}
}
