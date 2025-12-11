# File: modules\security\account-lock\__tests__\account-lock.service.spec.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/security/account-lock/__tests__/account-lock.service.spec.ts`

## Category
Backend

## File Type
TS (account-lock.service.spec.ts)

## Size
7497 characters, 222 lines

## Full Code

```typescript
import { I18nService } from '@/core/i18n'
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
const mockRedisService = {
	// Предоставляем полную реализацию мока для RedisService, чтобы избежать 'any'
	getClient: jest.fn(),
	get: jest.fn(),
	set: jest.fn(),
	del: jest.fn(),
	expire: jest.fn(),
	exists: jest.fn(),
	ttl: jest.fn(),
	incr: jest.fn(),
	decr: jest.fn(),
	incrWithExpire: jest.fn(),
	setJSON: jest.fn(),
	getJSON: jest.fn(),
	keys: jest.fn(),
	delPattern: jest.fn(),
	setNX: jest.fn(),
	getdel: jest.fn(),
	sAdd: jest.fn(),
	sRem: jest.fn(),
	sIsMember: jest.fn(),
	zAdd: jest.fn(),
	zRemRangeByScore: jest.fn(),
	zCard: jest.fn(),
	zRange: jest.fn(),
}

const mockI18nService = { t: jest.fn((key: string): string => key) }

const mockUser: User = {
	id: 'user-id-123',
	email: 'test@example.com',
	fullName: 'Test User',
	firstName: 'Test',
	lastName: 'User',
	phone: '+1234567890',
	password: 'hashed-password',
	avatar: null,
	bio: null,
	roles: [EUserRole.USER],
	isEmailVerified: true,
	emailVerifiedAt: new Date(),
	isUnsubscribed: false,
	emailBouncedAt: null,
	isPhoneVerified: false,
	phoneVerifiedAt: null,
	phoneBouncedAt: null,
	is2FAEnabled: false,
	preferred2FAMethod: null,
	require2FA: false,
	lastLoginAt: new Date(),
	lastLoginIp: '127.0.0.1',
	passwordChangedAt: new Date(),
	riskScore: 0,
	lastRiskAssessAt: null,
	deletedAt: null,
	createdAt: new Date(),
	updatedAt: new Date(),
}

describe('AccountLockService', () => {
	let service: AccountLockService
	let redisService: RedisService

	beforeEach(async () => {
		jest.clearAllMocks()
		jest.useFakeTimers()

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AccountLockService,
				{ provide: SecurityEventService, useValue: mockSecurityEventService },
				{ provide: NotificationService, useValue: mockNotificationService },
				{ provide: PrismaService, useValue: mockPrismaService },
				{ provide: RedisService, useValue: mockRedisService },
				{ provide: I18nService, useValue: mockI18nService },
			],
		}).compile()

		service = module.get<AccountLockService>(AccountLockService)
		redisService = module.get<RedisService>(RedisService)
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
				unlockedAt: null,
				expiresAt: new Date(Date.now() + 100000),
			})
			const result = await service.isAccountLocked(mockUser.id)
			expect(result).toBe(true)
		})

		it('should return true for a permanent lock (expiresAt is null)', async () => {
			mockPrismaService.accountLock.findFirst.mockResolvedValue({
				id: 'lock-perm',
				unlockedAt: null,
				expiresAt: null,
			})
			const result = await service.isAccountLocked(mockUser.id)
			expect(result).toBe(true)
		})

		it('should return false if no lock exists', async () => {
			mockPrismaService.accountLock.findFirst.mockResolvedValue(null)
			const result = await service.isAccountLocked(mockUser.id)
			expect(result).toBe(false)
		})

		it('should return false because the query itself filters out expired locks', async () => {
			mockPrismaService.accountLock.findFirst.mockResolvedValue(null)
			const result = await service.isAccountLocked(mockUser.id)
			expect(result).toBe(false)
		})

		it('should return false if lock was manually unlocked (as query returns null)', async () => {
			mockPrismaService.accountLock.findFirst.mockResolvedValue(null)
			const result = await service.isAccountLocked(mockUser.id)
			expect(result).toBe(false)
		})
	})

	describe('clearFailedAttempts', () => {
		it('should call del with the correct Redis key', async () => {
			const delSpy = jest.spyOn(redisService, 'del').mockResolvedValue(1)
			await service.clearFailedAttempts(mockUser.id)
			expect(delSpy).toHaveBeenCalledWith(`account-lock:attempts:${mockUser.id}`)
		})
	})

	describe('incrementFailedAttempts', () => {
		it('should just increment the counter if threshold is not reached', async () => {
			jest.spyOn(redisService, 'get').mockResolvedValue('2')
			const incrSpy = jest.spyOn(redisService, 'incr').mockResolvedValue(3)

			await service.incrementFailedAttempts(mockUser, 'ip', 'ua', 'en')

			expect(incrSpy).toHaveBeenCalledTimes(1)
			expect(mockPrismaService.accountLock.create).not.toHaveBeenCalled()
		})

		it('should apply a progressive delay', async () => {
			const delayConfig = PROGRESSIVE_DELAYS.find(d => d.attempts === 3)
			if (!delayConfig) {
				throw new Error('Test setup failed: Progressive delay config not found')
			}

			jest.spyOn(redisService, 'get').mockResolvedValue((delayConfig.attempts - 1).toString())
			jest.spyOn(redisService, 'incr').mockResolvedValue(delayConfig.attempts)

			const promise = service.incrementFailedAttempts(mockUser, 'ip', 'ua', 'en')

			expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), delayConfig.delayMs)

			await jest.runAllTimersAsync()
			await promise
		})

		it('should lock the account when MAX_FAILED_ATTEMPTS is reached', async () => {
			const maxAttempts = ACCOUNT_LOCK_CONFIG.MAX_FAILED_ATTEMPTS
			jest.spyOn(redisService, 'get').mockResolvedValue((maxAttempts - 1).toString())
			jest.spyOn(redisService, 'incr').mockResolvedValue(maxAttempts)
			const delSpy = jest.spyOn(redisService, 'del').mockResolvedValue(1)

			await service.incrementFailedAttempts(mockUser, '1.2.3.4', 'Test-UA-Lock', 'en')

			expect(mockPrismaService.accountLock.create).toHaveBeenCalledWith({
				data: {
					userId: mockUser.id,
					reason: `Exceeded ${maxAttempts} failed login attempts.`,
					failedAttempts: maxAttempts,
					expiresAt: expect.any(Date),
					ip: '1.2.3.4',
					userAgent: 'Test-UA-Lock',
				},
			})
			expect(mockSecurityEventService.create).toHaveBeenCalledWith({
				userId: mockUser.id,
				event: ESecurityEvent.ACCOUNT_LOCKED,
				severity: ESecuritySeverity.CRITICAL,
				ip: '1.2.3.4',
				userAgent: 'Test-UA-Lock',
				metadata: {
					reason: 'brute_force_protection',
					failedAttempts: maxAttempts,
					lockDuration: ACCOUNT_LOCK_CONFIG.LOCKOUT_DURATION_SECONDS,
				},
			})
			expect(delSpy).toHaveBeenCalledWith(`account-lock:attempts:${mockUser.id}`)
		})

		it('should handle Redis errors gracefully without crashing', async () => {
			jest.spyOn(redisService, 'get').mockRejectedValue(new Error('Redis is down'))
			await expect(service.incrementFailedAttempts(mockUser, '1.1.1.1', 'Test-UA', 'en')).resolves.not.toThrow()
		})
	})
})

```

## Description

This file is part of the MedicHub API (NestJS) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.554Z*
