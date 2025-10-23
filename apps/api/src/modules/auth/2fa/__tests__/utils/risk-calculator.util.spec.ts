import { subDays, subHours } from 'date-fns'

import { ERiskLevel } from '../../types'
import { IRiskContext, RiskCalculatorUtil } from '../../utils'

// Базовый, "идеальный" контекст низкого риска
const createMockContext = (overrides: Partial<IRiskContext> = {}): IRiskContext => {
	const now = new Date()
	return {
		session: {
			ip: '8.8.8.8',
			location: { country: 'USA', city: 'Mountain View', latitude: 37.422, longitude: -122.084 },
			device: { browser: 'Chrome', os: 'macOS', type: 'desktop' },
		},
		userId: 'user-123',
		accountAge: 365, // Старый аккаунт
		isNewDevice: false, // Знакомое устройство
		deviceTrustScore: 90, // Высокий скор доверия
		failedAttemptsRecent: 0, // Нет недавних ошибок
		previousLocations: [
			{
				country: 'USA',
				city: 'Mountain View',
				latitude: 37.422,
				longitude: -122.084,
				timestamp: subHours(now, 24),
			},
			{ country: 'USA', city: 'New York', latitude: 40.7128, longitude: -74.006, timestamp: subDays(now, 7) },
		],
		loginTime: now,
		...overrides,
	}
}

describe('RiskCalculatorUtil', () => {
	describe('assess', () => {
		it('should return VERY_LOW risk for a trusted, typical login', () => {
			// Arrange
			const context = createMockContext()

			// Act
			const assessment = RiskCalculatorUtil.assess(context)

			// Assert
			expect(assessment.level).toBe(ERiskLevel.VERY_LOW)
			expect(assessment.score).toBeLessThan(20)
			expect(assessment.factors).toHaveLength(0) // Нет факторов риска
			expect(assessment.require2FA).toBe(false)
			expect(assessment.blockAccess).toBe(false)
		})

		it('should return MEDIUM risk for a login from a new device', () => {
			// Arrange
			const context = createMockContext({ isNewDevice: true })

			// Act
			const assessment = RiskCalculatorUtil.assess(context)

			// Assert
			expect(assessment.level).toBe(ERiskLevel.MEDIUM)
			expect(assessment.score).toBeGreaterThan(40)
			expect(assessment.factors).toContainEqual(expect.objectContaining({ type: 'new_device' }))
			expect(assessment.require2FA).toBe(true)
		})

		it('should return HIGH risk for a login from a new country', () => {
			// Arrange
			const context = createMockContext({
				session: {
					ip: '91.198.174.192',
					location: { country: 'Netherlands', city: 'Amsterdam', latitude: 52.3676, longitude: 4.9041 },
					device: { browser: 'Chrome', os: 'macOS', type: 'desktop' },
				},
			})

			// Act
			const assessment = RiskCalculatorUtil.assess(context)

			// Assert
			expect(assessment.level).toBe(ERiskLevel.HIGH)
			expect(assessment.score).toBeGreaterThan(60)
			expect(assessment.factors).toContainEqual(expect.objectContaining({ type: 'new_country' }))
		})

		it('should return CRITICAL risk for impossible travel', () => {
			// Arrange
			const now = new Date()
			const context = createMockContext({
				// Логин из Сиднея...
				session: {
					ip: '101.188.64.1',
					location: { country: 'Australia', city: 'Sydney', latitude: -33.8688, longitude: 151.2093 },
					device: { browser: 'Firefox', os: 'Windows', type: 'desktop' },
				},
				// ... через час после логина из Нью-Йорка
				previousLocations: [
					{
						country: 'USA',
						city: 'New York',
						latitude: 40.7128,
						longitude: -74.006,
						timestamp: subHours(now, 1),
					},
				],
			})

			// Act
			const assessment = RiskCalculatorUtil.assess(context)

			// Assert
			expect(assessment.level).toBe(ERiskLevel.CRITICAL)
			expect(assessment.score).toBeGreaterThan(80)
			expect(assessment.factors).toContainEqual(expect.objectContaining({ type: 'impossible_travel' }))
			expect(assessment.blockAccess).toBe(true) // Критический риск должен блокировать доступ
		})

		it('should increase risk for recent failed attempts', () => {
			// Arrange
			const context = createMockContext({ failedAttemptsRecent: 3 })

			// Act
			const assessment = RiskCalculatorUtil.assess(context)

			// Assert
			expect(assessment.level).toBe(ERiskLevel.MEDIUM)
			expect(assessment.factors).toContainEqual(
				expect.objectContaining({ type: 'failed_attempts', details: { attempts: 3 } }),
			)
		})

		it('should increase risk for a very new account', () => {
			// Arrange
			const context = createMockContext({ accountAge: 1 }) // 1 день

			// Act
			const assessment = RiskCalculatorUtil.assess(context)

			// Assert
			expect(assessment.level).toBe(ERiskLevel.LOW)
			expect(assessment.factors).toContainEqual(expect.objectContaining({ type: 'new_account' }))
		})

		it('should cap the risk score at 100', () => {
			// Arrange
			const now = new Date()
			const context = createMockContext({
				isNewDevice: true,
				failedAttemptsRecent: 5,
				accountAge: 1,
				session: {
					ip: '1.1.1.1',
					location: { country: 'China', city: 'Beijing', latitude: 39.9042, longitude: 116.4074 },
					device: { browser: 'curl', os: 'Linux', type: 'desktop' },
				},
				previousLocations: [
					{
						country: 'USA',
						city: 'New York',
						latitude: 40.7128,
						longitude: -74.006,
						timestamp: subHours(now, 1),
					},
				],
			})

			// Act
			const assessment = RiskCalculatorUtil.assess(context)

			// Assert
			expect(assessment.score).toBeLessThanOrEqual(100)
		})

		it('should have zero risk if no risk factors are present', () => {
			// Arrange
			const context = createMockContext()

			// Act
			const assessment = RiskCalculatorUtil.assess(context)

			// Assert
			// В базовом контексте нет факторов риска, поэтому score должен быть 0.
			expect(assessment.score).toBe(0)
			expect(assessment.level).toBe(ERiskLevel.VERY_LOW)
		})
	})
})
