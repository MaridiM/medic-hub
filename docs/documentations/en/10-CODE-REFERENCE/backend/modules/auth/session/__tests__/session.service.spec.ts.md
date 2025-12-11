# File: modules\auth\session\__tests__\session.service.spec.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/session/__tests__/session.service.spec.ts`

## Category
Backend

## File Type
TS (session.service.spec.ts)

## Size
4458 characters, 139 lines

## Full Code

```typescript
import { I18nService } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { VerificationService } from '../../verification'
import { SessionService } from '../session.service'

describe('SessionService', () => {
	let service: SessionService
	let redisService: RedisService

	const mockRedisClient = {
		mGet: jest.fn(),
		del: jest.fn(),
	}

	const mockRedisService = {
		getJSON: jest.fn(),
		keys: jest.fn(),
		del: jest.fn(),
		getClient: jest.fn(() => mockRedisClient),
	}

	const mockPrismaService = {
		user: {
			findUnique: jest.fn(),
			update: jest.fn(),
		},
	}

	const mockI18nService = {
		t: jest.fn((key: string) => key),
	}

	const mockConfigService = {
		get: jest.fn((key: string) => {
			if (key === 'SESSION_FOLDER') return 'session:'
			if (key === 'SESSION_COOKIE') return 'connect.sid'
			return null
		}),
	}

	const mockVerificationService = {
		sendEmailVerificationToken: jest.fn(),
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SessionService,
				{ provide: RedisService, useValue: mockRedisService },
				{ provide: PrismaService, useValue: mockPrismaService },
				{ provide: I18nService, useValue: mockI18nService },
				{ provide: ConfigService, useValue: mockConfigService },
				{ provide: VerificationService, useValue: mockVerificationService },
			],
		}).compile()

		service = module.get<SessionService>(SessionService)
		redisService = module.get<RedisService>(RedisService)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('invalidateUserSessions', () => {
		it('should invalidate all sessions for a user', async () => {
			const userId = 'user-123'
			const sessions = [
				{ id: 'session-1', userId: 'user-123', createdAt: new Date().toISOString() },
				{ id: 'session-2', userId: 'user-123', createdAt: new Date().toISOString() },
				{ id: 'session-3', userId: 'user-456', createdAt: new Date().toISOString() }, // Different user
			]

			const keys = ['session:session-1', 'session:session-2', 'session:session-3']
			const raw = sessions.map(s => JSON.stringify(s))

			mockRedisService.keys.mockResolvedValue(keys)
			mockRedisClient.mGet.mockResolvedValue(raw)
			mockRedisClient.del.mockResolvedValue(2)

			const count = await service.invalidateUserSessions(userId)

			expect(mockRedisService.keys).toHaveBeenCalledWith('session:*')
			expect(mockRedisClient.mGet).toHaveBeenCalledWith(keys)
			expect(mockRedisClient.del).toHaveBeenCalledWith(['session:session-1', 'session:session-2'])
			expect(count).toBe(2)
		})

		it('should exclude specified session from invalidation', async () => {
			const userId = 'user-123'
			const excludeSessionId = 'session-1'
			const sessions = [
				{ id: 'session-1', userId: 'user-123', createdAt: new Date().toISOString() },
				{ id: 'session-2', userId: 'user-123', createdAt: new Date().toISOString() },
			]

			const keys = ['session:session-1', 'session:session-2']
			const raw = sessions.map(s => JSON.stringify(s))

			mockRedisService.keys.mockResolvedValue(keys)
			mockRedisClient.mGet.mockResolvedValue(raw)
			mockRedisClient.del.mockResolvedValue(1)

			const count = await service.invalidateUserSessions(userId, excludeSessionId)

			expect(mockRedisClient.del).toHaveBeenCalledWith(['session:session-2'])
			expect(count).toBe(1)
		})

		it('should return 0 when no sessions exist', async () => {
			mockRedisService.keys.mockResolvedValue([])

			const count = await service.invalidateUserSessions('user-123')

			expect(count).toBe(0)
			expect(mockRedisClient.del).not.toHaveBeenCalled()
		})

		it('should handle invalid session data gracefully', async () => {
			const userId = 'user-123'
			const keys = ['session:session-1', 'session:session-2']
			const raw = ['invalid-json', JSON.stringify({ id: 'session-2', userId: 'user-123' })]

			mockRedisService.keys.mockResolvedValue(keys)
			mockRedisClient.mGet.mockResolvedValue(raw)
			mockRedisClient.del.mockResolvedValue(1)

			const count = await service.invalidateUserSessions(userId)

			expect(mockRedisClient.del).toHaveBeenCalledWith(['session:session-2'])
			expect(count).toBe(1)
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.454Z*
