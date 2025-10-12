import 'reflect-metadata'

import type { Request, Response } from 'express'
import type { Session as ExpressSession, SessionData, Cookie } from 'express-session'

import { I18nService, type Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import type { LoginInput } from '../dtos'
import type { Session } from '../models'
import { SessionResolver } from '../session.resolver'
import { SessionService } from '../session.service'
import { VerificationService } from '../../verification'
import { ConfigService } from '@nestjs/config'
import { Test, type TestingModule } from '@nestjs/testing'
import {
	BadRequestException,
	ConflictException,
	NotFoundException,
	type ExecutionContext,
} from '@nestjs/common'
import { verify } from 'argon2'
import { destroySession, getSessionMetadata, saveSession } from '@/shared/utils'
import type { GqlContext, ISessionMetadata } from '@/shared/types'

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
}

interface PrismaMock {
	user: PrismaUserDelegate
}

interface RedisClientMock {
	mGet: jest.Mock<Promise<(string | null)[]>, [string[]]>
}

interface RedisMock {
	getJSON: jest.Mock<Promise<Session | null>, [string]>
	keys: jest.Mock<Promise<string[]>, [string]>
	getClient: jest.Mock<RedisClientMock, []>
	del: jest.Mock<Promise<number>, [string]>
}

type VerificationMock = {
	sendVerificationEmailToken: jest.Mock<Promise<boolean>, [Record<string, unknown>, Language]>
}

const verifyMock = verify as jest.MockedFunction<typeof verify>
const getSessionMetadataMock = getSessionMetadata as jest.MockedFunction<typeof getSessionMetadata>
const saveSessionMock = saveSession as jest.MockedFunction<typeof saveSession>
const destroySessionMock = destroySession as jest.MockedFunction<typeof destroySession>

type TestSession = ExpressSession &
	Partial<SessionData> & {
		userId?: string
		metadata?: ISessionMetadata
	}

const sampleMetadata: ISessionMetadata = {
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

const createContext = (
	sessionOverrides?: Partial<TestSession>,
): { request: Request; response: Response; context: GqlContext; session: TestSession } => {
	const response = {
		clearCookie: jest.fn(),
	} as unknown as Response

	const sessionStore: TestSession = {
		id: 'session-current',
		userId: 'user-id',
		cookie: {} as Cookie,
		regenerate: jest.fn(),
		destroy: jest.fn(),
		reload: jest.fn(),
		save: jest.fn(),
		touch: jest.fn(),
		resetMaxAge: jest.fn(),
		...sessionOverrides,
	}

	const request = {
		session: sessionStore,
		res: response,
		language: 'en',
	} as Request

	return { request, response, context: { req: request, res: response }, session: sessionStore }
}

describe('SessionModule integration', () => {
	let moduleRef: TestingModule
	let resolver: SessionResolver
	let prismaMock: PrismaMock
	let redisMock: RedisMock
	let verificationMock: VerificationMock
	let configMock: ConfigService
	let i18nMock: Pick<I18nService, 't'>

	beforeEach(async () => {
		prismaMock = {
			user: {
				findUnique: jest.fn(),
			},
		}

		const redisClientMock: RedisClientMock = {
			mGet: jest.fn(),
		}

		redisMock = {
			getJSON: jest.fn(),
			keys: jest.fn(),
			getClient: jest.fn(() => redisClientMock),
			del: jest.fn(),
		}

		verificationMock = {
			sendVerificationEmailToken: jest.fn(),
		}

		const translate = ((key: string) => key) as unknown as I18nService['t']
		i18nMock = { t: translate }

		configMock = {
			get: jest.fn((key: string) => {
				if (key === 'SESSION_FOLDER') return 'session:'
				if (key === 'SESSION_COOKIE') return 'connect.sid'
				return undefined
			}),
			getOrThrow: jest.fn(() => 'connect.sid'),
		} as unknown as ConfigService

		verifyMock.mockReset()
		getSessionMetadataMock.mockReset()
		saveSessionMock.mockReset()
		destroySessionMock.mockReset()

		moduleRef = await Test.createTestingModule({
			providers: [
				SessionResolver,
				SessionService,
				{ provide: PrismaService, useValue: prismaMock },
				{ provide: RedisService, useValue: redisMock },
				{ provide: VerificationService, useValue: verificationMock },
				{ provide: ConfigService, useValue: configMock },
				{ provide: I18nService, useValue: i18nMock },
			],
		}).compile()

		resolver = moduleRef.get(SessionResolver)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('logs in verified user and saves session', async () => {
		const { context } = createContext()
		const input: LoginInput = { email: 'user@example.com', password: 'password123' }
		const userAgent = 'Mozilla/5.0'

		prismaMock.user.findUnique.mockResolvedValue({
			id: 'user-id',
			email: 'user@example.com',
			password: 'stored-hash',
			isEmailVerified: true,
		})
		verifyMock.mockResolvedValue(true)
		getSessionMetadataMock.mockReturnValue(sampleMetadata)
		saveSessionMock.mockResolvedValue({ user: { id: 'user-id' } })

		const response = await resolver.login(context, input, userAgent, 'en' as Language)

		expect(response).toEqual({ user: { id: 'user-id' } })
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: 'user@example.com' } })
		expect(saveSessionMock).toHaveBeenCalled()
	})

	it('rejects login when email not verified and sends verification token', async () => {
		const { context } = createContext()
		const input: LoginInput = { email: 'user@example.com', password: 'password123' }

		prismaMock.user.findUnique.mockResolvedValue({
			id: 'user-id',
			email: 'user@example.com',
			password: 'stored-hash',
			isEmailVerified: false,
		})
		verifyMock.mockResolvedValue(true)
		verificationMock.sendVerificationEmailToken.mockResolvedValue(true)

		await expect(resolver.login(context, input, 'agent', 'en' as Language)).rejects.toBeInstanceOf(
			BadRequestException,
		)
		expect(verificationMock.sendVerificationEmailToken).toHaveBeenCalled()
	})

	it('finds current session by id', async () => {
		const { context } = createContext()
		redisMock.getJSON.mockResolvedValue({
			userId: 'user-id',
			metadata: sampleMetadata,
			createdAt: new Date().toISOString(),
			id: 'session-current',
		} as Session)

		const session = await resolver.findCurrent(context)

		expect(session).toMatchObject({ id: 'session-current', userId: 'user-id' })
		expect(redisMock.getJSON).toHaveBeenCalledWith('session:session-current')
	})

	it('lists sessions for user excluding current session', async () => {
		const { context, session } = createContext()
		session.id = 'session-current'
		session.userId = 'user-id'

		redisMock.keys.mockResolvedValue(['session:session-current', 'session:session-other'])
		const redisClient = redisMock.getClient()
		redisClient.mGet.mockResolvedValue([
			JSON.stringify({ userId: 'user-id', metadata: sampleMetadata, createdAt: '100' }),
			JSON.stringify({ userId: 'user-id', metadata: sampleMetadata, createdAt: '200' }),
		])

		const sessions = await resolver.findByUser(context, 'en' as Language)

		expect(sessions).toHaveLength(1)
		expect(sessions[0]).toMatchObject({ id: 'session-other', userId: 'user-id' })
	})

	it('prevents removing current session', async () => {
		const { context } = createContext()

		await expect(
			resolver.removeSession(context, 'session-current', 'en' as Language),
		).rejects.toBeInstanceOf(ConflictException)
		expect(redisMock.del).not.toHaveBeenCalled()
	})

	it('removes non-current session', async () => {
		const { context } = createContext()

		redisMock.del.mockResolvedValue(1)

	const result = await resolver.removeSession(context, 'session-other', 'en' as Language)

		expect(result).toBe(true)
		expect(redisMock.del).toHaveBeenCalledWith('session:session-other')
	})
})
