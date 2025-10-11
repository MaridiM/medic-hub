import 'reflect-metadata'

import type { I18nService } from '@/core/i18n'
import type { RedisService } from '@/core/redis'
import { type ExecutionContext, HttpException, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { MAX_ATTEMPTS, RATE_LIMIT_WINDOW } from '../constants'
import { SetTotpRateLimit, TOTP_RATE_LIMIT, TotpRateLimitGuard } from '../guards/totp-rate-limit.guard'

type GraphQLUser = { id: string; email: string }
type GraphQLContext = { req: { user?: GraphQLUser } }

describe('TotpRateLimitGuard', () => {
	const reflector = new Reflector()
	const reflectorGetSpy = jest.spyOn(reflector, 'get')

	const redisMock = {
		get: jest.fn<Promise<string | null>, [string]>(),
		ttl: jest.fn<Promise<number>, [string]>(),
	}

	const translateMock = jest.fn<unknown, [string, unknown?]>((key: string) => key)
	const i18nMock: Pick<I18nService, 't'> = { t: translateMock as unknown as I18nService['t'] }

	let graphContext: GraphQLContext
	let executionContext: ExecutionContext
	let gqlContextSpy: jest.SpyInstance<GqlExecutionContext, [ExecutionContext]>

	const createGuard = () =>
		new TotpRateLimitGuard(reflector, redisMock as unknown as RedisService, i18nMock as unknown as I18nService)

	beforeAll(() => {
		gqlContextSpy = jest.spyOn(GqlExecutionContext, 'create')
	})

	beforeEach(() => {
		jest.clearAllMocks()

		graphContext = { req: { user: { id: 'user-1', email: 'user@example.com' } } }
		const handler = jest.fn<unknown, []>()

		const httpHost = {
			getRequest: (): { user?: GraphQLUser } => graphContext.req,
			getResponse: (): Record<string, never> => ({}),
			getNext: (): undefined => undefined,
		}
		const rpcHost = {
			getContext: (): Record<string, never> => ({}),
			getData: (): undefined => undefined,
		}
		const wsHost = {
			getClient: (): Record<string, never> => ({}),
			getData: (): undefined => undefined,
		}

		executionContext = {
			getClass: () => class TestResolverClass {} as ReturnType<ExecutionContext['getClass']>,
			getHandler: () => handler,
			switchToHttp: () => httpHost,
			switchToRpc: () => rpcHost,
			switchToWs: () => wsHost,
			getArgByIndex: <T>() => undefined as T,
			getArgs: (): unknown[] => [],
			getType: () => 'graphql' as ReturnType<ExecutionContext['getType']>,
		} as unknown as ExecutionContext

		gqlContextSpy.mockReturnValue({
			getContext: <T>() => graphContext as T,
		} as GqlExecutionContext)

		redisMock.get.mockResolvedValue(null)
		redisMock.ttl.mockResolvedValue(RATE_LIMIT_WINDOW)
		translateMock.mockImplementation((key: string) => key)
	})

	afterAll(() => {
		gqlContextSpy.mockRestore()
	})

	it('allows requests when no metadata is set', async () => {
		const guard = createGuard()
		reflectorGetSpy.mockReturnValue(undefined)

		await expect(guard.canActivate(executionContext)).resolves.toBe(true)
		expect(redisMock.get).not.toHaveBeenCalled()
	})

	it('allows requests when attempts are below the threshold', async () => {
		const guard = createGuard()
		reflectorGetSpy.mockReturnValue({
			maxAttempts: MAX_ATTEMPTS,
			windowMs: RATE_LIMIT_WINDOW * 1000,
			action: 'enable',
		})
		redisMock.get.mockResolvedValue('2')

		await expect(guard.canActivate(executionContext)).resolves.toBe(true)
		expect(redisMock.get).toHaveBeenCalled()
	})

	it('blocks requests when attempts exceed the threshold', async () => {
		const guard = createGuard()
		reflectorGetSpy.mockReturnValue({
			maxAttempts: MAX_ATTEMPTS,
			windowMs: RATE_LIMIT_WINDOW * 1000,
			action: 'verify',
		})
		redisMock.get.mockResolvedValue(`${MAX_ATTEMPTS}`)
		redisMock.ttl.mockResolvedValue(120)
		translateMock.mockReturnValue('translated message')

		await expect(guard.canActivate(executionContext)).rejects.toEqual(
			new HttpException('translated message', HttpStatus.TOO_MANY_REQUESTS),
		)
		expect(translateMock).toHaveBeenCalledWith('totp.rate_limit_exceeded', expect.any(Object))
	})

	it('SetTotpRateLimit stores metadata on the method handler', () => {
		class TestResolver {
			@SetTotpRateLimit('test-action', 3, 1000)
			test(): void {}
		}

		const descriptor = Object.getOwnPropertyDescriptor(TestResolver.prototype, 'test')
		if (!descriptor || typeof descriptor.value !== 'function') {
			throw new Error('Expected method descriptor to contain a function value')
		}

		const metadataTarget: object = descriptor.value
		const metadata = Reflect.getMetadata(TOTP_RATE_LIMIT, metadataTarget)

		expect(metadata).toEqual({
			action: 'test-action',
			maxAttempts: 3,
			windowMs: 1000,
		})
	})
})
