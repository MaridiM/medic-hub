import { I18nService } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { Test, TestingModule } from '@nestjs/testing'
import { ESecurityEvent, ESecuritySeverity } from '@prisma/__generated__'

import { SecurityEventService } from './security-event.service'

describe('SecurityEventService', () => {
	let service: SecurityEventService
	let prisma: PrismaService

	const mockPrismaService = {
		securityEvent: {
			create: jest.fn(),
			findMany: jest.fn(),
			update: jest.fn(),
		},
	}

	const mockI18nService = {
		t: jest.fn((key: string) => key),
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SecurityEventService,
				{ provide: PrismaService, useValue: mockPrismaService },
				{ provide: I18nService, useValue: mockI18nService },
			],
		}).compile()

		service = module.get<SecurityEventService>(SecurityEventService)
		prisma = module.get<PrismaService>(PrismaService)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('create', () => {
		it('should create a security event with minimal data', async () => {
			const input = {
				userId: 'user-123',
				event: ESecurityEvent.LOGIN_SUCCESS,
			}

			const mockEvent = {
				id: 'event-123',
				...input,
				severity: ESecuritySeverity.LOW,
				createdAt: new Date(),
			}

			mockPrismaService.securityEvent.create.mockResolvedValue(mockEvent)

			const result = await service.create(input)

			expect(prisma.securityEvent.create).toHaveBeenCalledWith({
				data: {
					userId: 'user-123',
					event: ESecurityEvent.LOGIN_SUCCESS,
					severity: ESecuritySeverity.LOW,
					ip: undefined,
					userAgent: undefined,
					country: undefined,
					city: undefined,
					deviceId: undefined,
					riskScore: undefined,
					riskFactors: undefined,
					metadata: undefined,
				},
			})
			expect(result).toEqual(mockEvent)
		})

		it('should create a security event with full metadata', async () => {
			const input = {
				userId: 'user-123',
				event: ESecurityEvent.PASSWORD_CHANGED,
				severity: ESecuritySeverity.MEDIUM,
				ip: '192.168.1.1',
				userAgent: 'Mozilla/5.0',
				country: 'USA',
				city: 'New York',
				deviceId: 'device-456',
				riskScore: 35,
				riskFactors: [
					{ type: 'new_device', description: 'First time from this device', weight: 25 },
					{ type: 'unusual_time', description: 'Password changed at 3 AM', weight: 10 },
				],
				metadata: { reason: 'user_initiated' },
			}

			const mockEvent = { id: 'event-123', ...input, createdAt: new Date() }
			mockPrismaService.securityEvent.create.mockResolvedValue(mockEvent)

			const result = await service.create(input)

			expect(prisma.securityEvent.create).toHaveBeenCalledWith({
				data: expect.objectContaining({
					userId: 'user-123',
					event: ESecurityEvent.PASSWORD_CHANGED,
					severity: ESecuritySeverity.MEDIUM,
					ip: '192.168.1.1',
					riskScore: 35,
				}),
			})
			expect(result).toEqual(mockEvent)
		})
	})

	describe('findByUser', () => {
		it('should find all events for a user', async () => {
			const mockEvents = [
				{ id: 'event-1', userId: 'user-123', event: ESecurityEvent.LOGIN_SUCCESS },
				{ id: 'event-2', userId: 'user-123', event: ESecurityEvent.PASSWORD_CHANGED },
			]

			mockPrismaService.securityEvent.findMany.mockResolvedValue(mockEvents)

			const result = await service.findByUser('user-123')

			expect(prisma.securityEvent.findMany).toHaveBeenCalledWith({
				where: { userId: 'user-123' },
				orderBy: { createdAt: 'desc' },
				take: 50,
				skip: 0,
			})
			expect(result).toEqual(mockEvents)
		})

		it('should filter by event type', async () => {
			const mockEvents = [{ id: 'event-1', userId: 'user-123', event: ESecurityEvent.LOGIN_FAILED }]

			mockPrismaService.securityEvent.findMany.mockResolvedValue(mockEvents)

			await service.findByUser('user-123', { event: ESecurityEvent.LOGIN_FAILED })

			expect(prisma.securityEvent.findMany).toHaveBeenCalledWith({
				where: {
					userId: 'user-123',
					event: ESecurityEvent.LOGIN_FAILED,
				},
				orderBy: { createdAt: 'desc' },
				take: 50,
				skip: 0,
			})
		})

		it('should filter by severity and resolved status', async () => {
			mockPrismaService.securityEvent.findMany.mockResolvedValue([])

			await service.findByUser('user-123', {
				severity: ESecuritySeverity.HIGH,
				resolved: false,
				take: 10,
			})

			expect(prisma.securityEvent.findMany).toHaveBeenCalledWith({
				where: {
					userId: 'user-123',
					severity: ESecuritySeverity.HIGH,
					resolved: false,
				},
				orderBy: { createdAt: 'desc' },
				take: 10,
				skip: 0,
			})
		})
	})

	describe('resolve', () => {
		it('should mark event as resolved', async () => {
			const mockEvent = {
				id: 'event-123',
				resolved: true,
				resolvedAt: new Date(),
				resolvedBy: 'admin-456',
			}

			mockPrismaService.securityEvent.update.mockResolvedValue(mockEvent)

			const result = await service.resolve('event-123', 'admin-456')

			expect(prisma.securityEvent.update).toHaveBeenCalledWith({
				where: { id: 'event-123' },
				data: {
					resolved: true,
					resolvedAt: expect.any(Date),
					resolvedBy: 'admin-456',
				},
			})
			expect(result.resolved).toBe(true)
		})
	})

	describe('calculateRiskScore', () => {
		it('should sum risk factor weights', () => {
			const factors = [
				{ type: 'new_device', description: 'New device', weight: 30 },
				{ type: 'unusual_location', description: 'Unusual location', weight: 20 },
			]

			const score = service.calculateRiskScore(factors)

			expect(score).toBe(50)
		})

		it('should cap risk score at 100', () => {
			const factors = [
				{ type: 'factor1', description: 'Test', weight: 60 },
				{ type: 'factor2', description: 'Test', weight: 50 },
			]

			const score = service.calculateRiskScore(factors)

			expect(score).toBe(100)
		})

		it('should return 0 for empty factors', () => {
			const score = service.calculateRiskScore([])
			expect(score).toBe(0)
		})
	})
})
