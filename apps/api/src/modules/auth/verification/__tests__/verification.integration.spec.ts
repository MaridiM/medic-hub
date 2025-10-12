import 'reflect-metadata'

import type { Request, Response } from 'express'

import { I18nService, type Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { MailService } from '@/modules/libs/mail'
import { VerificationResolver } from '../verification.resolver'
import { VerificationService } from '../verification.service'
import type { VerificationInput } from '../dtos'
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { generateToken, getSessionMetadata, saveSession } from '@/shared/utils'
import type { GqlContext, ISessionMetadata } from '@/shared/types'
import { ETokenType } from '@prisma/__generated__'
import type { Token } from '@prisma/__generated__'

jest.mock('@/shared/utils', () => ({
	generateToken: jest.fn(),
	getSessionMetadata: jest.fn(),
	saveSession: jest.fn(),
	destroySession: jest.fn(),
}))

type PrismaTokenDelegate = {
	findUnique: jest.Mock<Promise<Record<string, unknown> | null>, [unknown]>
	delete: jest.Mock<Promise<Record<string, unknown>>, [unknown]>
}

type PrismaUserDelegate = {
	update: jest.Mock<Promise<Record<string, unknown>>, [unknown]>
}

interface PrismaMock {
	token: PrismaTokenDelegate
	user: PrismaUserDelegate
	$transaction: jest.Mock<Promise<unknown[]>, [Promise<unknown>[]]>
}

type MailMock = {
	sendVerificationEmailToken: jest.Mock<Promise<void>, [string, string, Language]>
}

const getSessionMetadataMock = getSessionMetadata as jest.MockedFunction<typeof getSessionMetadata>
const saveSessionMock = saveSession as jest.MockedFunction<typeof saveSession>
const generateTokenMock = generateToken as jest.MockedFunction<typeof generateToken>

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
	token: 'verification-token',
	type: ETokenType.EMAIL_VERIFY,
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
		session: {},
	} as Request

	return { request, context: { req: request, res: response } }
}

describe('VerificationModule integration', () => {
	let resolver: VerificationResolver
	let service: VerificationService
	let prismaMock: PrismaMock
	let mailMock: MailMock
	let i18nMock: Pick<I18nService, 't'>

	beforeEach(() => {
		prismaMock = {
			token: {
				findUnique: jest.fn(),
				delete: jest.fn(),
			},
			user: {
				update: jest.fn(),
			},
			$transaction: jest.fn(async operations => Promise.all(operations)),
		}

		mailMock = {
			sendVerificationEmailToken: jest.fn(),
		}

		const translate = ((key: string) => key) as unknown as I18nService['t']
		i18nMock = { t: translate }

		getSessionMetadataMock.mockReset()
		saveSessionMock.mockReset()
		generateTokenMock.mockReset()

		service = new VerificationService(
			i18nMock as unknown as I18nService,
			prismaMock as unknown as PrismaService,
			mailMock as unknown as MailService,
		)
		resolver = new VerificationResolver(service)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('verifies email with valid token and creates session', async () => {
		const { context } = createContext()
		const input: VerificationInput = { token: 'valid-token' }
		const userAgent = 'Mozilla/5.0'
		const tokenRecord = {
			id: 'token-id',
			type: 'EMAIL_VERIFY',
			expiresIn: new Date(Date.now() + 1000),
			userId: 'user-id',
		}

		prismaMock.token.findUnique.mockResolvedValue(tokenRecord)
		prismaMock.user.update.mockResolvedValue({
			id: 'user-id',
			email: 'user@example.com',
			isEmailVerified: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		prismaMock.token.delete.mockResolvedValue({ id: 'token-id' })
		getSessionMetadataMock.mockReturnValue(metadataSample)
		saveSessionMock.mockResolvedValue({ user: { id: 'user-id' } })

		const response = await resolver.verificationEmail(context, input, userAgent, 'en' as Language)

		expect(response).toEqual({ user: { id: 'user-id' } })
		expect(prismaMock.token.findUnique).toHaveBeenCalledWith({
			where: { token: 'valid-token' },
			select: { id: true, type: true, expiresIn: true, userId: true },
		})
		expect(saveSessionMock).toHaveBeenCalled()
	})

	it('throws when verification token is expired', async () => {
		const { context } = createContext()
		const input: VerificationInput = { token: 'expired-token' }

		prismaMock.token.findUnique.mockResolvedValue({
			id: 'token-id',
			type: 'EMAIL_VERIFY',
			userId: 'user-id',
			expiresIn: new Date(Date.now() - 1000),
		})

		await expect(resolver.verificationEmail(context, input, 'agent', 'en' as Language)).rejects.toBeInstanceOf(
			BadRequestException,
		)
})

	it('throws when verification token not found', async () => {
		const { context } = createContext()
		const input: VerificationInput = { token: 'missing-token' }

		prismaMock.token.findUnique.mockResolvedValue(null)

		await expect(resolver.verificationEmail(context, input, 'agent', 'en' as Language)).rejects.toBeInstanceOf(
			NotFoundException,
		)
	})

	it('sends verification email token successfully', async () => {
		const user = {
			id: 'user-id',
			email: 'user@example.com',
		} as Parameters<VerificationService['sendVerificationEmailToken']>[0]

		generateTokenMock.mockResolvedValue(buildToken({ token: 'verification-token' }))
		mailMock.sendVerificationEmailToken.mockResolvedValue()

		const result = await service.sendVerificationEmailToken(user, 'en' as Language)

		expect(result).toBe(true)
		expect(generateTokenMock).toHaveBeenCalled()
		expect(mailMock.sendVerificationEmailToken).toHaveBeenCalledWith(
			'user@example.com',
			'verification-token',
			'en',
		)
	})

	it('throws when verification email fails to send', async () => {
		const user = {
			id: 'user-id',
			email: 'user@example.com',
		} as Parameters<VerificationService['sendVerificationEmailToken']>[0]

		generateTokenMock.mockResolvedValue(buildToken({ token: 'verification-token' }))
		mailMock.sendVerificationEmailToken.mockRejectedValue(new Error('SMTP error'))

		await expect(service.sendVerificationEmailToken(user, 'en' as Language)).rejects.toBeInstanceOf(
			InternalServerErrorException,
		)
	})
})
