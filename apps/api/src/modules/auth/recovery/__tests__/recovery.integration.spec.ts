import { hash } from 'argon2'
import type { Request, Response } from 'express'
import 'reflect-metadata'

import { I18nService, type Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { MailService } from '@/modules/libs'
import type { GqlContext, ISessionMetadata } from '@/shared/types'
import { generateToken, getSessionMetadata } from '@/shared/utils'
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ETokenType } from '@prisma/__generated__'
import type { Token } from '@prisma/__generated__'

import type { NewPasswordInput, ResetPasswordInput } from '../dtos'
import { RecoveryResolver } from '../recovery.resolver'
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

type PrismaUserDelegate = {
	findUnique: jest.Mock<Promise<Record<string, unknown> | null>, [unknown]>
	update: jest.Mock<Promise<Record<string, unknown>>, [unknown]>
}

type PrismaTokenDelegate = {
	findUnique: jest.Mock<Promise<Record<string, unknown> | null>, [unknown]>
	delete: jest.Mock<Promise<Record<string, unknown>>, [unknown]>
	upsert: jest.Mock<Promise<Record<string, unknown>>, [unknown]>
}

interface PrismaMock {
	user: PrismaUserDelegate
	token: PrismaTokenDelegate
	$transaction: jest.Mock<Promise<unknown[]>, [Promise<unknown>[]]>
}

type MailServiceMock = {
	sendPasswordResetToken: jest.Mock<Promise<void>, [string, string, Record<string, unknown>, Language]>
}

describe('RecoveryModule integration', () => {
	let resolver: RecoveryResolver
	let service: RecoveryService
	let prismaMock: PrismaMock
	let mailMock: MailServiceMock
	let i18nMock: Pick<I18nService, 't'>

	const hashMock = hash as jest.MockedFunction<typeof hash>
	const generateTokenMock = generateToken as jest.MockedFunction<typeof generateToken>
	const getSessionMetadataMock = getSessionMetadata as jest.MockedFunction<typeof getSessionMetadata>

	const metadataSample: ISessionMetadata = {
		location: {
			country: 'United States',
			city: 'New York',
			latitude: 0,
			longitude: 0,
		},
		device: {
			browser: 'Chrome',
			os: 'macOS',
			type: 'desktop',
		},
		ip: '127.0.0.1',
	}

	const buildToken = (overrides?: Partial<Token>): Token => ({
		id: 'token-id',
		token: 'reset-token',
		type: ETokenType.PASSWORD_RESET,
		expiresIn: new Date(Date.now() + 1000),
		userId: 'user-id',
		createdAt: new Date(),
		updatedAt: new Date(),
		...(overrides ?? {}),
	})

	const createContext = (): { request: Request; context: GqlContext } => {
		const response = {} as Response
		const request = {
			headers: {},
			ip: '127.0.0.1',
			session: {},
		} as Request

		const context: GqlContext = { req: request, res: response }
		return { request, context }
	}

	beforeEach(() => {
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
		}

		mailMock = {
			sendPasswordResetToken: jest.fn(),
		}

		const translate = ((key: string) => key) as unknown as I18nService['t']
		i18nMock = { t: translate }

		hashMock.mockReset()
		generateTokenMock.mockReset()
		getSessionMetadataMock.mockReset()

		service = new RecoveryService(
			i18nMock as unknown as I18nService,
			prismaMock as unknown as PrismaService,
			mailMock as unknown as MailService,
		)
		resolver = new RecoveryResolver(service)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('initiates password reset and sends email', async () => {
		const { context } = createContext()
		const input: ResetPasswordInput = { email: 'User@Example.com ' }
		const userAgent = 'Mozilla/5.0'

		prismaMock.user.findUnique.mockResolvedValue({ id: 'user-id', email: 'user@example.com' })
		generateTokenMock.mockResolvedValue(buildToken({ token: 'reset-token' }))
		getSessionMetadataMock.mockReturnValue(metadataSample)
		mailMock.sendPasswordResetToken.mockResolvedValue()

		const result = await resolver.resetPassword(context, input, userAgent, 'en' as Language)

		expect(result).toBe(true)
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
			where: { email: 'user@example.com' },
			select: { id: true, email: true },
		})
		expect(generateTokenMock).toHaveBeenCalled()
		expect(mailMock.sendPasswordResetToken).toHaveBeenCalledWith(
			'user@example.com',
			'reset-token',
			metadataSample,
			'en',
		)
	})

	it('throws when user not found during reset', async () => {
		const { context } = createContext()
		const input: ResetPasswordInput = { email: 'missing@example.com' }

		prismaMock.user.findUnique.mockResolvedValue(null)

		await expect(resolver.resetPassword(context, input, 'agent', 'en' as Language)).rejects.toBeInstanceOf(
			NotFoundException,
		)
		expect(generateTokenMock).not.toHaveBeenCalled()
	})

	it('sets new password with valid token', async () => {
		const input: NewPasswordInput = { token: 'valid-token', password: 'Password123!' }
		const tokenRecord = {
			id: 'token-id',
			type: 'PASSWORD_RESET',
			expiresIn: new Date(Date.now() + 1000),
			userId: 'user-id',
		}

		prismaMock.token.findUnique.mockResolvedValue(tokenRecord)
		hashMock.mockResolvedValue('hashed-new-password')
		prismaMock.user.update.mockResolvedValue({ id: 'user-id' })
		prismaMock.token.delete.mockResolvedValue({ id: 'token-id' })

		const result = await resolver.newPassword(input, 'en' as Language)

		expect(result).toBe(true)
		expect(prismaMock.user.update).toHaveBeenCalledWith({
			where: { id: 'user-id' },
			data: { password: 'hashed-new-password' },
			select: { id: true },
		})
		expect(prismaMock.token.delete).toHaveBeenCalledWith({ where: { id: 'token-id' } })
	})

	it('throws when reset token not found', async () => {
		const input: NewPasswordInput = { token: 'missing-token', password: 'Password123!' }

		prismaMock.token.findUnique.mockResolvedValue(null)

		await expect(resolver.newPassword(input, 'en' as Language)).rejects.toBeInstanceOf(NotFoundException)
	})

	it('throws when mail sending fails', async () => {
		const { context } = createContext()
		const input: ResetPasswordInput = { email: 'user@example.com' }

		prismaMock.user.findUnique.mockResolvedValue({ id: 'user-id', email: 'user@example.com' })
		generateTokenMock.mockResolvedValue(buildToken({ token: 'reset-token' }))
		getSessionMetadataMock.mockReturnValue(metadataSample)
		mailMock.sendPasswordResetToken.mockRejectedValue(new Error('SMTP error'))

		await expect(resolver.resetPassword(context, input, 'agent', 'en' as Language)).rejects.toBeInstanceOf(
			InternalServerErrorException,
		)
	})

	it('throws when reset token expired', async () => {
		const input: NewPasswordInput = { token: 'expired-token', password: 'Password123!' }
		const tokenRecord = {
			id: 'token-id',
			type: 'PASSWORD_RESET',
			expiresIn: new Date(Date.now() - 1000),
			userId: 'user-id',
		}

		prismaMock.token.findUnique.mockResolvedValue(tokenRecord)

		await expect(resolver.newPassword(input, 'en' as Language)).rejects.toBeInstanceOf(BadRequestException)
	})
})
