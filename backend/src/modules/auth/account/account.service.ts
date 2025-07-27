import { hash, verify } from 'argon2'

import { I18nService, PrismaService } from '@/core'
import { ConflictException, Injectable } from '@nestjs/common'

import { CreateAccountInput } from './inputs'
import { User } from './models'

@Injectable()
export class AccountService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly i18n: I18nService,
	) {}

	/**
	 * Create a new user
	 * @param data - The data for the new user
	 * @param language - The language of the user
	 * @returns The new user
	 */
	async create(data: CreateAccountInput, language: string): Promise<User> {
		const user = await this.prisma.user.findUnique({ where: { email: data.email } })
		if (user) {
			throw new ConflictException(this.i18n.t('auth.user_already_exists', { lng: language }))
		}

		const hashedPassword = await hash(data.password)

		return this.prisma.user.create({ data: { ...data, password: hashedPassword } })
	}

	/**
	 * Find profile
	 * @param id - The id of the user
	 * @param language - The language of the user
	 * @returns The user
	 */
	async findProfile(language: string, id: string): Promise<User> {
		const user = await this.prisma.user.findUnique({ where: { id } })
		if (!user) {
			throw new ConflictException(this.i18n.t('auth.user_not_found', { lng: language }))
		}
		return user
	}
}
