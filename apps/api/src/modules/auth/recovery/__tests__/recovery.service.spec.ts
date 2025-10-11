import 'reflect-metadata'

import type { Request } from 'express'

import { I18nService, type Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { MailService } from '@/modules/libs'
import { generateToken, getSessionMetadata } from '@/shared/utils'
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { hash } from 'argon2'
import { ETokenType } from '@prisma/__generated__'

import type { NewPasswordInput, ResetPasswordInput } from '../dtos'
import { RecoveryService } from '../recovery.service'

jest.mock('argon2', () => ({
	hash: jest.fn(),
	verify: jest.fn(),
}))

jest.mock('@/shared/utils', () => ({
	generateToken: jest.fn(),
	getSessionMetadata: jest.fn(),
	saveSession: jest.fn(),
	destroySession: jest.fn(),
}))

describe('RecoveryService', () => {
	const translate = ((key: string) => key) as unknown as I18nService['t']
	let i18nMock: Pick<I18nService, 't'>
	let prismaMock: Pick<PrismaService, 'user' | 'token' | '$transaction'>
	let mailMock: Pick<MailService, 'sendPasswordResetToken'>
	let service: RecoveryService
	let request: Request
	const metadata = {
		location: { country: 'United States', city: 'New York', latidute: 0, longitude: 0 },
		device: { browser: 'Chrome', os: 'macOS', type: 'desktop' },
		ip: '127.0.0.1',
	} as ISessionMetadata

	beforeEach(() => {
		i18nMock = { t: translate }
		prismaMock = {
			user: {
				findUnique: jest.fn(),
				update: jest.fn(),
			},
			token: {
				findUnique: jest.fn(),
				delete: jest.fn(),
				upsert: jest.fn(),
			},
			$transaction: jest.fn(async operations => Promise.all(operations)),
		} as unknown as Pick<PrismaService, 'user' | 'token' | '$transaction'>

		mailMock = {
			sendPasswordResetToken: jest.fn(),
		} as unknown as Pick<MailService, 'sendPasswordResetToken'>

		;(hash as jest.Mock).mockResolvedValue('hashed-password')
		;(generateToken as jest.Mock).mockResolvedValue({ token: 'reset-token' })
		;(getSessionMetadata as jest.Mock).mockReturnValue(metadata)

		request = { headers: {}, session: {}, ip: '127.0.0.1' } as unknown as Request

		service = new RecoveryService(
			i18nMock as unknown as I18nService,
			prismaMock as unknown as PrismaService,
			mailMock as unknown as MailService,
		)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('initiates password reset flow', async () => {
		const input: ResetPasswordInput = { email: 'User@Example.com ' }
		;(prismaMock.user.findUnique as jest.Mock).mockResolvedValue({ id: 'user-id', email: 'user@example.com' })
		;(mailMock.sendPasswordResetToken as jest.Mock).mockResolvedValue(undefined)

		const result = await service.resetPassword(request, input, 'agent', 'en' as Language)

		expect(result).toBe(true)
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
			where: { email: 'user@example.com' },
			select: { id: true, email: true },
		})
		expect(generateToken).toHaveBeenCalledWith(
			prismaMock,
			expect.objectContaining({ email: 'user@example.com' }),
			ETokenType.PASSWORD_RESET,
		)
		expect(mailMock.sendPasswordResetToken).toHaveBeenCalledWith('user@example.com', 'reset-token', metadata, 'en')
	})

	it('throws NotFound when user is missing', async () => {
		;(prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null)

		await expect(service.resetPassword(request, { email: 'missing@example.com' }, 'agent', 'en')).rejects.toBeInstanceOf(
			NotFoundException,
		)
	})

	it('throws InternalServerError when mail sending fails', async () => {
		;(prismaMock.user.findUnique as jest.Mock).mockResolvedValue({ id: 'user-id', email: 'user@example.com' })
		;(mailMock.sendPasswordResetToken as jest.Mock).mockRejectedValue(new Error('smtp'))

		await expect(service.resetPassword(request, { email: 'user@example.com' }, 'agent', 'en')).rejects.toBeInstanceOf(
			InternalServerErrorException,
		)
	})

	it('sets new password for valid token', async () => {
		const tokenRecord = {
			id: 'token-id',
			type: ETokenType.PASSWORD_RESET,
			expiresIn: new Date(Date.now() + 1000),
			userId: 'user-id',
		}
		;(prismaMock.token.findUnique as jest.Mock).mockResolvedValue(tokenRecord)
		;(prismaMock.user.update as jest.Mock).mockResolvedValue({ id: 'user-id' })
		;(prismaMock.token.delete as jest.Mock).mockResolvedValue({ id: 'token-id' })

		const result = await service.newPassword({ token: 'valid', password: 'Password123!' }, 'en' as Language)

		expect(result).toBe(true)
		expect(prismaMock.user.update).toHaveBeenCalledWith({
			where: { id: 'user-id' },
			data: { password: 'hashed-password' },
			select: { id: true },
		})
		expect(prismaMock.token.delete).toHaveBeenCalledWith({ where: { id: 'token-id' } })
	})

	it('throws NotFound when token not found', async () => {
		;(prismaMock.token.findUnique as jest.Mock).mockResolvedValue(null)

		await expect(service.newPassword({ token: 'missing', password: 'Password123!' }, 'en')).rejects.toBeInstanceOf(
			NotFoundException,
		)
	})

	it('throws BadRequest when token expired', async () => {
		const tokenRecord = {
			id: 'token-id',
			type: ETokenType.PASSWORD_RESET,
			expiresIn: new Date(Date.now() - 1000),
			userId: 'user-id',
		}
		;(prismaMock.token.findUnique as jest.Mock).mockResolvedValue(tokenRecord)

		await expect(service.newPassword({ token: 'expired', password: 'Password123!' }, 'en')).rejects.toBeInstanceOf(
			BadRequestException,
		)
	})
})
