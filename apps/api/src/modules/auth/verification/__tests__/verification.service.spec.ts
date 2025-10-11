import 'reflect-metadata'

import type { Request } from 'express'

import { I18nService, type Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { MailService } from '@/modules/libs/mail'
import { generateToken, getSessionMetadata, saveSession } from '@/shared/utils'
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ETokenType } from '@prisma/__generated__'

import { VerificationService } from '../verification.service'
import type { VerificationInput } from '../dtos'

jest.mock('@/shared/utils', () => ({
	generateToken: jest.fn(),
	getSessionMetadata: jest.fn(),
	saveSession: jest.fn(),
	destroySession: jest.fn(),
}))

describe('VerificationService', () => {
	const translate = ((key: string) => key) as unknown as I18nService['t']
	let i18nMock: Pick<I18nService, 't'>
	let prismaMock: Pick<PrismaService, 'token' | 'user' | '$transaction'>
	let mailMock: Pick<MailService, 'sendVerificationEmailToken'>
	let service: VerificationService
	let request: Request

	const metadataSample = {
		location: { country: 'United States', city: 'New York', latidute: 0, longitude: 0 },
		device: { browser: 'Chrome', os: 'macOS', type: 'desktop' },
		ip: '127.0.0.1',
	}

	const buildToken = (overrides?: Partial<{ token: string; expiresIn: Date; userId: string }>) => ({
		id: 'token-id',
		token: 'verification-token',
		type: ETokenType.EMAIL_VERIFY,
		expiresIn: new Date(Date.now() + 1000),
		userId: 'user-id',
		createdAt: new Date(),
		updatedAt: new Date(),
		...(overrides ?? {}),
	})

	beforeEach(() => {
		i18nMock = { t: translate }
		prismaMock = {
			token: {
				findUnique: jest.fn(),
				delete: jest.fn(),
				upsert: jest.fn(),
			},
			user: {
				update: jest.fn(),
			},
			$transaction: jest.fn(async operations => Promise.all(operations)),
		} as unknown as Pick<PrismaService, 'token' | 'user' | '$transaction'>
		mailMock = {
			sendVerificationEmailToken: jest.fn(),
		} as unknown as Pick<MailService, 'sendVerificationEmailToken'>

		service = new VerificationService(
			i18nMock as unknown as I18nService,
			prismaMock as unknown as PrismaService,
			mailMock as unknown as MailService,
		)

		request = { session: {}, headers: {} } as unknown as Request

		;(getSessionMetadata as jest.Mock).mockReturnValue(metadataSample)
		;(saveSession as jest.Mock).mockResolvedValue({ user: { id: 'user-id' } })
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('verifies email and stores session', async () => {
		const input: VerificationInput = { token: 'valid-token' }
		const tokenRecord = {
			id: 'token-id',
			type: ETokenType.EMAIL_VERIFY,
			expiresIn: new Date(Date.now() + 1000),
			userId: 'user-id',
		}
		;(prismaMock.token.findUnique as jest.Mock).mockResolvedValue(tokenRecord)
		;(prismaMock.user.update as jest.Mock).mockResolvedValue({
			id: 'user-id',
			email: 'user@example.com',
			isEmailVerified: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		;(prismaMock.token.delete as jest.Mock).mockResolvedValue({ id: 'token-id' })

		const result = await service.verificationEmail(request, input, 'agent', 'en' as Language)

		expect(result).toEqual({ user: { id: 'user-id' } })
		expect(prismaMock.token.findUnique).toHaveBeenCalledWith({
			where: { token: 'valid-token' },
			select: { id: true, type: true, expiresIn: true, userId: true },
		})
		expect(saveSession).toHaveBeenCalled()
	})

	it('throws NotFound when token missing', async () => {
		;(prismaMock.token.findUnique as jest.Mock).mockResolvedValue(null)

		await expect(
			service.verificationEmail(request, { token: 'missing' }, 'agent', 'en'),
		).rejects.toBeInstanceOf(NotFoundException)
	})

	it('throws BadRequest when token expired', async () => {
		const tokenRecord = {
			id: 'token-id',
			type: ETokenType.EMAIL_VERIFY,
			expiresIn: new Date(Date.now() - 1000),
			userId: 'user-id',
		}
		;(prismaMock.token.findUnique as jest.Mock).mockResolvedValue(tokenRecord)

		await expect(
			service.verificationEmail(request, { token: 'expired' }, 'agent', 'en'),
		).rejects.toBeInstanceOf(BadRequestException)
	})

	it('sends verification email token', async () => {
		const user = { id: 'user-id', email: 'user@example.com' } as Parameters<
			VerificationService['sendVerificationEmailToken']
		>[0]
		;(generateToken as jest.Mock).mockResolvedValue(buildToken())
		;(mailMock.sendVerificationEmailToken as jest.Mock).mockResolvedValue(undefined)

		const result = await service.sendVerificationEmailToken(user, 'en' as Language)

		expect(result).toBe(true)
		expect(generateToken).toHaveBeenCalledWith(prismaMock, user, ETokenType.EMAIL_VERIFY)
		expect(mailMock.sendVerificationEmailToken).toHaveBeenCalledWith('user@example.com', 'verification-token', 'en')
	})

	it('throws when sending verification email fails', async () => {
		const user = { id: 'user-id', email: 'user@example.com' } as Parameters<
			VerificationService['sendVerificationEmailToken']
		>[0]
		;(generateToken as jest.Mock).mockResolvedValue(buildToken())
		;(mailMock.sendVerificationEmailToken as jest.Mock).mockRejectedValue(new Error('smtp'))

		await expect(service.sendVerificationEmailToken(user, 'en')).rejects.toBeInstanceOf(InternalServerErrorException)
	})
})
