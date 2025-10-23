import { RedisService } from '@/core/redis'
import { Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { RateLimitService } from '../rate-limit.service'

// Создаем шпиона один раз перед всеми тестами
const loggerErrorSpy = jest.spyOn(Logger, 'error').mockImplementation(() => {})

// Типизированный мок для клиента Redis
type MockRedisClient = {
	zRemRangeByScore: jest.Mock<Promise<number>, [string, number | string, number | string]>
	zCard: jest.Mock<Promise<number>, [string]>
	zAdd: jest.Mock<Promise<number>, [string, { score: number; value: string }]>
	expire: jest.Mock<Promise<boolean>, [string, number]>
	zRange: jest.Mock<Promise<string[]>, [string, number, number, { REV: boolean }?]>
	sIsMember: jest.Mock<Promise<boolean>, [string, string]>
	sAdd: jest.Mock<Promise<number>, [string, string | string[]]>
}

describe('RateLimitService', () => {
	let service: RateLimitService
	let redisClient: MockRedisClient

	beforeEach(async () => {
		// Очищаем моки, но не восстанавливаем шпионов
		jest.clearAllMocks()

		redisClient = {
			zRemRangeByScore: jest.fn().mockResolvedValue(1),
			zCard: jest.fn().mockResolvedValue(0),
			zAdd: jest.fn().mockResolvedValue(1),
			expire: jest.fn().mockResolvedValue(true),
			zRange: jest.fn().mockResolvedValue([]),
			sIsMember: jest.fn().mockResolvedValue(false),
			sAdd: jest.fn().mockResolvedValue(1),
		}

		const mockRedisService = {
			getClient: (): MockRedisClient => redisClient,
			sIsMember: redisClient.sIsMember,
			sAdd: redisClient.sAdd,
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [RateLimitService, { provide: RedisService, useValue: mockRedisService }],
		}).compile()

		service = module.get<RateLimitService>(RateLimitService)
	})

	afterAll(() => {
		// Восстанавливаем оригинальную реализацию логгера после всех тестов
		loggerErrorSpy.mockRestore()
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('consume', () => {
		const key = 'test-key'
		const points = 5
		const duration = 60 // 60 seconds

		it('should allow the first request', async () => {
			redisClient.zCard.mockResolvedValue(0)

			const result = await service.consume(key, points, duration)

			expect(result.isAllowed).toBe(true)
			expect(result.remaining).toBe(points - 1)
			expect(redisClient.zAdd).toHaveBeenCalledTimes(1)
			expect(redisClient.expire).toHaveBeenCalledWith(`rate-limit:global:${key}`, duration)
		})

		it('should allow requests within the limit', async () => {
			redisClient.zCard.mockResolvedValue(points - 2) // 3 consumed, 2 remaining

			const result = await service.consume(key, points, duration)

			expect(result.isAllowed).toBe(true)
			expect(result.remaining).toBe(1) // 5 - (3 + 1)
		})

		it('should block requests when the limit is reached', async () => {
			redisClient.zCard.mockResolvedValue(points) // 5 consumed, limit reached
			const oldestTimestamp = Date.now() - (duration - 10) * 1000 // 10 seconds left
			redisClient.zRange.mockResolvedValue([oldestTimestamp.toString()])

			const result = await service.consume(key, points, duration)

			expect(result.isAllowed).toBe(false)
			expect(result.remaining).toBe(0)
			expect(result.msBeforeNext).toBeGreaterThanOrEqual(9000)
			expect(result.msBeforeNext).toBeLessThanOrEqual(11000)
			expect(redisClient.zAdd).not.toHaveBeenCalled()
		})

		it('should correctly implement the sliding window', async () => {
			// 1. Первый запрос - разрешен
			redisClient.zCard.mockResolvedValue(0)
			await service.consume(key, points, duration)
			expect(redisClient.zAdd).toHaveBeenCalledTimes(1)

			// 2. Имитируем, что старые записи удалились
			redisClient.zRemRangeByScore.mockResolvedValue(2)
			redisClient.zCard.mockResolvedValue(points - 2) // Теперь в окне 3 записи

			// 3. Новый запрос должен быть разрешен
			const result = await service.consume(key, points, duration)
			expect(result.isAllowed).toBe(true)
			expect(result.remaining).toBe(points - (points - 2 + 1)) // 5 - (3+1) = 1
		})

		it('should fail-open (allow request) if Redis fails', async () => {
			const redisError = new Error('Redis connection error')
			const key = 'fail-key'
			redisClient.zRemRangeByScore.mockRejectedValue(redisError)

			const result = await service.consume(key, 5, 60)

			expect(result.isAllowed).toBe(true)
			expect(result.remaining).toBe(5)
			expect(loggerErrorSpy).toHaveBeenCalledWith(`Rate limit check failed for key ${key}:`, redisError)
		})
	})

	describe('Whitelist / Blacklist', () => {
		const ip = '1.2.3.4'

		it('isWhitelisted should call sIsMember with the correct key', async () => {
			await service.isWhitelisted(ip)
			expect(redisClient.sIsMember).toHaveBeenCalledWith('rate-limit:whitelist', ip)
		})

		it('isBlacklisted should call sIsMember with the correct key', async () => {
			await service.isBlacklisted(ip)
			expect(redisClient.sIsMember).toHaveBeenCalledWith('rate-limit:blacklist', ip)
		})

		it('addToWhitelist should call sAdd with the correct key', async () => {
			await service.addToWhitelist(ip)
			expect(redisClient.sAdd).toHaveBeenCalledWith('rate-limit:whitelist', ip)
		})
	})
})
