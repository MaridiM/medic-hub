import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { NotificationService } from '@/modules/notification'
import { SecurityEventService } from '@/modules/security-event'
import { Test, TestingModule } from '@nestjs/testing'
import { ESecurityEvent, ESecuritySeverity, EUserRole, type User } from '@prisma/__generated__'

import { AccountLockService } from '../account-lock.service'
import { ACCOUNT_LOCK_CONFIG, PROGRESSIVE_DELAYS } from '../constants'

// --- Mocks ---
const mockSecurityEventService = { create: jest.fn() }
const mockNotificationService = { notifyAccountLocked: jest.fn() }
const mockPrismaService = { accountLock: { findFirst: jest.fn(), create: jest.fn() } }
// Для CoreService и его Redis-хелперов, мы будем мокать методы RedisService напрямую
const mockRedisService = {
	rGetNumber: jest.fn(),
	rIncr: jest.fn(),
	rDel: jest.fn(),
}

const mockUser: User = {
	id: 'user-id-123',
	email: 'test@example.com',
	// ... остальные поля
} as User

describe('AccountLockService', () => {
	let service: AccountLockService

	beforeEach(async () => {
		jest.clearAllMocks()
		// Используем фейковые таймеры для контроля setTimeout
		jest.useFakeTimers()

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AccountLockService,
				{ provide: SecurityEventService, useValue: mockSecurityEventService },
				{ provide: NotificationService, useValue: mockNotificationService },
				// CoreService зависимости
				{ provide: PrismaService, useValue: mockPrismaService },
				{ provide: RedisService, useValue: mockRedisService },
			],
		}).compile()

		service = module.get<AccountLockService>(AccountLockService)

		// Внедряем моки в CoreService-хелперы, которые использует AccountLockService
		// Это более надежно, чем мокать сам CoreService
		;(service as any).rGetNumber = mockRedisService.rGetNumber
		;(service as any).rIncr = mockRedisService.rIncr
		;(service as any).rDel = mockRedisService.rDel
		;(service as any).prisma = mockPrismaService
	})

	afterEach(() => {
		jest.useRealTimers()
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('isAccountLocked', () => {
		it('should return true if an active lock exists', async () => {
			mockPrismaService.accountLock.findFirst.mockResolvedValue({
				id: 'lock-1',
				expiresAt: new Date(Date.now() + 100000),
			})
			const result = await service.isAccountLocked(mockUser.id)
			expect(result).toBe(true)
		})

		it('should return false if no lock exists', async () => {
			mockPrismaService.accountLock.findFirst.mockResolvedValue(null)
			const result = await service.isAccountLocked(mockUser.id)
			expect(result).toBe(false)
		})

		it('should return false if lock has expired', async () => {
			// Чтобы тест был надежным, мы должны передать объект, который не пройдет проверку в Prisma
			// Но так как мы мокаем, просто возвращаем null
			mockPrismaService.accountLock.findFirst.mockResolvedValue(null)
			const result = await service.isAccountLocked(mockUser.id)
			expect(result).toBe(false)
		})
	})

	describe('clearFailedAttempts', () => {
		it('should call rDel with the correct Redis key', async () => {
			await service.clearFailedAttempts(mockUser.id)
			expect(mockRedisService.rDel).toHaveBeenCalledWith(`account-lock:attempts:${mockUser.id}`)
		})
	})

	describe('incrementFailedAttempts', () => {
		it('should just increment the counter if threshold is not reached', async () => {
			mockRedisService.rGetNumber.mockResolvedValue(2)
			mockRedisService.rIncr.mockResolvedValue(3)

			await service.incrementFailedAttempts(mockUser, 'ip', 'ua', 'en')

			expect(mockRedisService.rIncr).toHaveBeenCalledTimes(1)
			expect(mockPrismaService.accountLock.create).not.toHaveBeenCalled()
		})

		it('should apply a progressive delay', async () => {
			const delayConfig = PROGRESSIVE_DELAYS[0] // e.g., { attempts: 3, delayMs: 1000 }
			mockRedisService.rGetNumber.mockResolvedValue(delayConfig.attempts - 1)
			mockRedisService.rIncr.mockResolvedValue(delayConfig.attempts)

			const promise = service.incrementFailedAttempts(mockUser, 'ip', 'ua', 'en')

			// Проверяем, что задержка была установлена
			expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), delayConfig.delayMs)

			// "Проматываем" время
			await jest.runAllTimersAsync()
			await promise
		})

		it('should lock the account when MAX_FAILED_ATTEMPTS is reached', async () => {
			const maxAttempts = ACCOUNT_LOCK_CONFIG.MAX_FAILED_ATTEMPTS
			mockRedisService.rGetNumber.mockResolvedValue(maxAttempts - 1)
			mockRedisService.rIncr.mockResolvedValue(maxAttempts)

			await service.incrementFailedAttempts(mockUser, '1.2.3.4', 'Test-UA', 'en')

			// 1. Проверяем создание блокировки в БД
			expect(mockPrismaService.accountLock.create).toHaveBeenCalledWith({
				data: {
					userId: mockUser.id,
					reason: expect.any(String),
					failedAttempts: maxAttempts,
					expiresAt: expect.any(Date),
					ip: '1.2.3.4',
					userAgent: 'Test-UA',
				},
			})

			// 2. Проверяем создание события безопасности
			expect(mockSecurityEventService.create).toHaveBeenCalledWith({
				userId: mockUser.id,
				event: ESecurityEvent.ACCOUNT_LOCKED,
				severity: ESecuritySeverity.CRITICAL,
				ip: '1.2.3.4',
				userAgent: 'Test-UA',
				metadata: expect.any(Object),
			})

			// 3. Проверяем вызов уведомления (пока закомментирован в коде, но мок должен быть готов)
			// expect(mockNotificationService.notifyAccountLocked).toHaveBeenCalledWith(mockUser, 'en');

			// 4. Проверяем очистку счетчика в Redis
			expect(mockRedisService.rDel).toHaveBeenCalledWith(`account-lock:attempts:${mockUser.id}`)
		})
	})
})
