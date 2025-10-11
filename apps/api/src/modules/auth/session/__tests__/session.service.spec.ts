import 'reflect-metadata'

import type { Request, Response } from 'express'

import { I18nService, type Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { destroySession, getSessionMetadata, saveSession } from '@/shared/utils'
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { VerificationService } from '@/modules/auth/verification'
import { verify } from 'argon2'

import { SessionService } from '../session.service'
import type { LoginInput } from '../dtos'
import type { Session } from '../models'
import type { ISessionMetadata } from '@/shared/types'

jest.mock('argon2', () => ({
	verify: jest.fn(),
}))

jest.mock('@/shared/utils', () => ({
	generateToken: jest.fn(),
	getSessionMetadata: jest.fn(),
	saveSession: jest.fn(),
	destroySession: jest.fn(),
}))

describe('SessionService', () => {
	const translate = ((key: string) => key) as unknown as I18nService['t']
	let i18nMock: Pick<I18nService, 't'>
	let prismaMock: Pick<PrismaService, 'user'>
	let redisMock: Pick<RedisService, 'getJSON' | 'keys' | 'getClient' | 'del'>
	let verificationMock: Pick<VerificationService, 'sendVerificationEmailToken'>
	let configMock: Pick<ConfigService, 'get' | 'getOrThrow'>
	let service: SessionService
	let request: Request
	const response = { clearCookie: jest.fn() } as unknown as Response
	const sessionMetadataSample = {
		location: { country: 'United States', city: 'New York', latidute: 0, longitude: 0 },
		device: { browser: 'Chrome', os: 'macOS', type: 'desktop' },
		ip: '127.0.0.1',
	}

	beforeEach(() => {
		i18nMock = { t: translate }
		prismaMock = {
			user: { findUnique: jest.fn() },
		} as unknown as Pick<PrismaService, 'user'>
		const redisClientMock = {
			mGet: jest.fn(),
		}
		redisMock = {
			getJSON: jest.fn(),
			keys: jest.fn(),
			getClient: jest.fn(() => redisClientMock),
			del: jest.fn(),
		} as unknown as Pick<RedisService, 'getJSON' | 'keys' | 'getClient' | 'del'>
		verificationMock = {
			sendVerificationEmailToken: jest.fn().mockResolvedValue(true),
		} as unknown as Pick<VerificationService, 'sendVerificationEmailToken'>
		configMock = {
			get: jest.fn((key: string) => {
				if (key === 'SESSION_FOLDER') return 'session:'
				if (key === 'SESSION_COOKIE') return 'connect.sid'
				return undefined
			}),
			getOrThrow: jest.fn(() => 'connect.sid'),
		} as unknown as Pick<ConfigService, 'get' | 'getOrThrow'>

		request = {
			session: { id: 'current-session', userId: 'user-id' },
			res: response,
			language: 'en',
		} as unknown as Request

		;(verify as jest.Mock).mockResolvedValue(true)
		;(getSessionMetadata as jest.Mock).mockReturnValue(sessionMetadataSample)
		;(saveSession as jest.Mock).mockResolvedValue({ user: { id: 'user-id' } })

		service = new SessionService(
			prismaMock as unknown as PrismaService,
			redisMock as unknown as RedisService,
			i18nMock as unknown as I18nService,
			configMock as unknown as ConfigService,
			verificationMock as unknown as VerificationService,
		)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('logs in verified user', async () => {
		const input: LoginInput = { email: 'user@example.com', password: 'password' }
		;(prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
			id: 'user-id',
			email: 'user@example.com',
			password: 'hashed',
			isEmailVerified: true,
		})

		const result = await service.login(request, 'agent', input, 'en' as Language)

		expect(result).toEqual({ user: { id: 'user-id' } })
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: 'user@example.com' } })
		expect(saveSession).toHaveBeenCalled()
	})

	it('throws NotFound when user is missing', async () => {
		;(prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null)

		await expect(service.login(request, 'agent', { email: 'x', password: 'y' }, 'en')).rejects.toBeInstanceOf(
			NotFoundException,
		)
	})

	it('throws NotFound when password mismatch', async () => {
		;(prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
			id: 'user-id',
			email: 'user@example.com',
			password: 'hashed',
			isEmailVerified: true,
		})
		;(verify as jest.Mock).mockResolvedValue(false)

		await expect(service.login(request, 'agent', { email: 'x', password: 'y' }, 'en')).rejects.toBeInstanceOf(
			NotFoundException,
		)
	})

	it('requests email verification when email is not verified', async () => {
		;(prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
			id: 'user-id',
			email: 'user@example.com',
			password: 'hashed',
			isEmailVerified: false,
		})

		await expect(service.login(request, 'agent', { email: 'x', password: 'y' }, 'en')).rejects.toBeInstanceOf(
			BadRequestException,
		)
		expect(verificationMock.sendVerificationEmailToken).toHaveBeenCalled()
	})

	it('reads current session from redis', async () => {
		const sessionData: Session = {
			id: 'current-session',
			userId: 'user-id',
			metadata: sessionMetadataSample,
			createdAt: new Date().toISOString(),
		}
		;(redisMock.getJSON as jest.Mock).mockResolvedValue(sessionData)

		const result = await service.findCurrent(request)

		expect(result).toEqual(sessionData)
		expect(redisMock.getJSON).toHaveBeenCalledWith('session:current-session')
	})

	it('filters sessions excluding current one', async () => {
		;(redisMock.keys as jest.Mock).mockResolvedValue(['session:current-session', 'session:another-session'])
		const client = redisMock.getClient() as unknown as { mGet: jest.Mock }
		client.mGet.mockResolvedValue([
			JSON.stringify({ userId: 'user-id', createdAt: '100', metadata: sessionMetadataSample }),
			JSON.stringify({ userId: 'user-id', createdAt: '200', metadata: sessionMetadataSample }),
		])

		const sessions = await service.findByUser(request, 'en' as Language)

		expect(sessions).toHaveLength(1)
		expect(sessions[0].id).toBe('another-session')
	})

	it('clears session cookie', () => {
		const result = service.clear(request)

		expect(result).toBe(true)
		expect(response.clearCookie).toHaveBeenCalledWith('connect.sid')
	})

	it('prevents removing current session', async () => {
		await expect(service.remove(request, 'current-session', 'en')).rejects.toBeInstanceOf(ConflictException)
		expect(redisMock.del).not.toHaveBeenCalled()
	})

	it('removes session by id', async () => {
		;(redisMock.del as jest.Mock).mockResolvedValue(1)

		const result = await service.remove(request, 'another-session', 'en' as Language)

		expect(result).toBe(true)
		expect(redisMock.del).toHaveBeenCalledWith('session:another-session')
	})
})
