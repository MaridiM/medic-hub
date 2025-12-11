# File: modules\auth\2fa\utils\risk-calculator.util.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/utils/risk-calculator.util.ts`

## Category
Backend

## File Type
TS (risk-calculator.util.ts)

## Size
14259 characters, 503 lines

## Full Code

```typescript
import { differenceInHours } from 'date-fns'

import type { ISessionMetadataDTO } from '@/shared/types'

import { HIGH_RISK_INDICATORS, RISK_THRESHOLDS, RISK_WEIGHTS, VELOCITY_CONFIG } from '../constants'
import type { IAnomaly, IRiskAssessment, IRiskFactor } from '../types'
import { ERiskLevel } from '../types'

/**
 * Risk context for assessment
 * Extended version of ISessionMetadata with additional context
 */
export interface IRiskContext {
	// Current session
	session: ISessionMetadataDTO

	// User context
	userId: string
	userRiskScore?: number
	accountAge: number // days

	// Device context
	isNewDevice: boolean
	deviceTrustScore: number
	failedAttemptsRecent: number

	// Historical data
	previousLocations: Array<{
		country: string
		city: string
		latitude: number
		longitude: number
		timestamp: Date
	}>

	// Time context
	loginTime: Date
	userTimezone?: string

	// Behavioral patterns (optional)
	typicalLoginHours?: number[]
	typicalLoginDays?: number[]
}

/**
 * Risk assessment and scoring utility
 * Calculates risk scores based on multiple factors
 */
export class RiskCalculatorUtil {
	/**
	 * Perform complete risk assessment
	 * @param context Assessment context
	 * @returns Complete risk assessment with score, level, and recommendations
	 */
	static assess(context: IRiskContext): IRiskAssessment {
		const factors = this.calculateFactors(context)
		const score = this.calculateScore(factors)
		const level = this.getRiskLevel(score)
		const anomalies = this.detectAnomalies(context)
		const recommendations = this.generateRecommendations(level, anomalies)

		return {
			score,
			level,
			factors,
			recommendations,
			require2FA: score >= RISK_THRESHOLDS[ERiskLevel.MEDIUM].min,
			blockAccess: level === ERiskLevel.CRITICAL,
			assessedAt: new Date(),
		}
	}

	/**
	 * Calculate individual risk factors
	 * @param context Assessment context
	 * @returns Array of risk factors
	 */
	private static calculateFactors(context: IRiskContext): IRiskFactor[] {
		const factors: IRiskFactor[] = []

		// Location-based risks
		factors.push(...this.assessLocationRisk(context))

		// Device-based risks
		factors.push(...this.assessDeviceRisk(context))

		// Behavioral risks
		factors.push(...this.assessBehavioralRisk(context))

		// Account age risks
		factors.push(...this.assessAccountRisk(context))

		// Authentication history risks
		factors.push(...this.assessAuthenticationRisk(context))

		return factors.filter(f => f.score > 0)
	}

	/**
	 * Assess location-based risks
	 */
	private static assessLocationRisk(context: IRiskContext): IRiskFactor[] {
		const factors: IRiskFactor[] = []
		const currentCountry = context.session.location.country

		// Check high-risk country
		if (
			HIGH_RISK_INDICATORS.HIGH_RISK_COUNTRIES.includes(
				currentCountry as (typeof HIGH_RISK_INDICATORS.HIGH_RISK_COUNTRIES)[number],
			)
		) {
			factors.push({
				type: 'high_risk_country',
				score: RISK_WEIGHTS.HIGH_RISK_COUNTRY,
				weight: 1.0,
				description: 'Login from high-risk country',
				details: { country: currentCountry },
			})
		}

		// Check new country
		const isNewCountry = !context.previousLocations.some(loc => loc.country === currentCountry)
		if (isNewCountry && context.previousLocations.length > 0) {
			factors.push({
				type: 'new_country',
				score: RISK_WEIGHTS.NEW_COUNTRY,
				weight: 0.8,
				description: 'First login from this country',
				details: { country: currentCountry },
			})
		}

		// Check new city
		const currentCity = context.session.location.city
		const isNewCity = !context.previousLocations.some(loc => loc.city === currentCity)
		if (isNewCity && context.previousLocations.length > 0 && !isNewCountry) {
			factors.push({
				type: 'new_city',
				score: RISK_WEIGHTS.NEW_CITY,
				weight: 0.6,
				description: 'First login from this city',
				details: { city: currentCity },
			})
		}

		// Check impossible travel
		const impossibleTravel = this.detectImpossibleTravel(context)
		if (impossibleTravel) {
			factors.push({
				type: 'impossible_travel',
				score: RISK_WEIGHTS.IMPOSSIBLE_TRAVEL,
				weight: 1.2,
				description: 'Impossible travel detected',
				details: impossibleTravel,
			})
		}

		return factors
	}

	/**
	 * Detect impossible travel (too fast between locations)
	 */
	private static detectImpossibleTravel(context: IRiskContext): Record<string, unknown> | null {
		if (context.previousLocations.length === 0) return null

		const lastLocation = context.previousLocations[0]

		// Note: Using latitude/longitude from ISessionMetadata (with typo)
		const currentLat: number = context.session.location.latitude
		const currentLon: number = context.session.location.longitude

		if (!lastLocation.latitude || !lastLocation.longitude || !currentLat || !currentLon) {
			return null
		}

		const distance = this.calculateDistance(lastLocation.latitude, lastLocation.longitude, currentLat, currentLon)

		const timeDiff = differenceInHours(context.loginTime, lastLocation.timestamp)

		if (timeDiff <= 0) return null

		const speed = distance / timeDiff

		if (speed > VELOCITY_CONFIG.MAX_TRAVEL_SPEED_KMH) {
			return {
				distance,
				timeDiff,
				speed,
				maxSpeed: VELOCITY_CONFIG.MAX_TRAVEL_SPEED_KMH,
				from: `${lastLocation.city}, ${lastLocation.country}`,
				to: `${context.session.location.city}, ${context.session.location.country}`,
			}
		}

		return null
	}

	/**
	 * Calculate distance between two coordinates using Haversine formula
	 * @returns Distance in kilometers
	 */
	private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
		const R = 6371 // Earth's radius in km
		const dLat = this.toRad(lat2 - lat1)
		const dLon = this.toRad(lon2 - lon1)

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
		return R * c
	}

	private static toRad(degrees: number): number {
		return degrees * (Math.PI / 180)
	}

	/**
	 * Assess device-based risks
	 */
	private static assessDeviceRisk(context: IRiskContext): IRiskFactor[] {
		const factors: IRiskFactor[] = []

		// New device
		if (context.isNewDevice) {
			factors.push({
				type: 'new_device',
				score: RISK_WEIGHTS.NEW_DEVICE,
				weight: 0.9,
				description: 'First login from this device',
			})
		}

		// Untrusted device
		if (context.deviceTrustScore < 50) {
			factors.push({
				type: 'untrusted_device',
				score: RISK_WEIGHTS.UNTRUSTED_DEVICE,
				weight: 1.0,
				description: 'Device has low trust score',
				details: { trustScore: context.deviceTrustScore },
			})
		}

		return factors
	}

	/**
	 * Assess behavioral risks
	 */
	private static assessBehavioralRisk(context: IRiskContext): IRiskFactor[] {
		const factors: IRiskFactor[] = []

		// Check suspicious user agent
		// Note: device.browser and device.os come from device-detector-js
		const deviceInfo = `${context.session.device.browser} ${context.session.device.os}`.toLowerCase()
		const isSuspicious = HIGH_RISK_INDICATORS.SUSPICIOUS_UA_PATTERNS.some(pattern => pattern.test(deviceInfo))
		if (isSuspicious) {
			factors.push({
				type: 'suspicious_user_agent',
				score: RISK_WEIGHTS.SUSPICIOUS_USER_AGENT,
				weight: 1.1,
				description: 'Suspicious user agent detected',
				details: {
					browser: context.session.device.browser,
					os: context.session.device.os,
				},
			})
		}

		// Check unusual time
		if (context.typicalLoginHours) {
			const hour = context.loginTime.getHours()
			if (!context.typicalLoginHours.includes(hour)) {
				factors.push({
					type: 'unusual_time',
					score: RISK_WEIGHTS.UNUSUAL_TIME,
					weight: 0.5,
					description: 'Login at unusual time',
					details: { hour, typical: context.typicalLoginHours },
				})
			}
		}

		// Check unusual day
		if (context.typicalLoginDays) {
			const day = context.loginTime.getDay()
			if (!context.typicalLoginDays.includes(day)) {
				factors.push({
					type: 'unusual_day',
					score: RISK_WEIGHTS.UNUSUAL_DAY,
					weight: 0.3,
					description: 'Login on unusual day',
					details: { day, typical: context.typicalLoginDays },
				})
			}
		}

		return factors
	}

	/**
	 * Assess account-related risks
	 */
	private static assessAccountRisk(context: IRiskContext): IRiskFactor[] {
		const factors: IRiskFactor[] = []

		// New account
		if (context.accountAge < 7) {
			factors.push({
				type: 'new_account',
				score: RISK_WEIGHTS.NEW_ACCOUNT,
				weight: 0.7,
				description: 'Account is less than 7 days old',
				details: { age: context.accountAge },
			})
		} else if (context.accountAge < 30) {
			factors.push({
				type: 'young_account',
				score: RISK_WEIGHTS.YOUNG_ACCOUNT,
				weight: 0.4,
				description: 'Account is less than 30 days old',
				details: { age: context.accountAge },
			})
		}

		return factors
	}

	/**
	 * Assess authentication history risks
	 */
	private static assessAuthenticationRisk(context: IRiskContext): IRiskFactor[] {
		const factors: IRiskFactor[] = []

		// Multiple failed attempts
		if (context.failedAttemptsRecent > 0) {
			const score = Math.min(RISK_WEIGHTS.MULTIPLE_FAILED_ATTEMPTS, context.failedAttemptsRecent * 10)
			factors.push({
				type: 'failed_attempts',
				score,
				weight: 1.0,
				description: 'Recent failed login attempts',
				details: { attempts: context.failedAttemptsRecent },
			})
		}

		return factors
	}

	/**
	 * Calculate final risk score from factors
	 */
	private static calculateScore(factors: IRiskFactor[]): number {
		if (factors.length === 0) return 0

		const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0)
		const weightedScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0)

		const score = totalWeight > 0 ? weightedScore / totalWeight : 0

		// Clamp to 0-100
		return Math.max(0, Math.min(100, Math.round(score)))
	}

	/**
	 * Get risk level from score
	 */
	private static getRiskLevel(score: number): ERiskLevel {
		for (const [level, range] of Object.entries(RISK_THRESHOLDS)) {
			if (score >= range.min && score <= range.max) {
				return level as ERiskLevel
			}
		}
		return ERiskLevel.LOW
	}

	/**
	 * Detect specific anomalies
	 */
	private static detectAnomalies(context: IRiskContext): IAnomaly[] {
		const anomalies: IAnomaly[] = []

		const impossibleTravel = this.detectImpossibleTravel(context)
		if (impossibleTravel) {
			anomalies.push({
				type: 'velocity',
				severity: 'critical',
				description: 'Impossible travel detected',
				score: RISK_WEIGHTS.IMPOSSIBLE_TRAVEL,
				details: impossibleTravel,
			})
		}

		return anomalies
	}

	/**
	 * Generate recommendations based on risk level
	 */
	private static generateRecommendations(level: ERiskLevel, anomalies: IAnomaly[]): string[] {
		const recommendations: string[] = []

		switch (level) {
			case ERiskLevel.CRITICAL:
				recommendations.push('Block access immediately')
				recommendations.push('Notify user of suspicious activity')
				recommendations.push('Require password reset')
				recommendations.push('Invalidate all sessions')
				break
			case ERiskLevel.HIGH:
				recommendations.push('Require 2FA verification')
				recommendations.push('Send security alert to user')
				recommendations.push('Log detailed audit trail')
				break
			case ERiskLevel.MEDIUM:
				recommendations.push('Require 2FA verification')
				recommendations.push('Monitor closely')
				break
			case ERiskLevel.LOW:
				recommendations.push('Log for analytics')
				break
			case ERiskLevel.VERY_LOW:
				// No action needed
				break
		}

		if (anomalies.length > 0) {
			recommendations.push(`Investigate ${anomalies.length} detected anomalies`)
		}

		return recommendations
	}

	/**
	 * Assesses risk for a password change event.
	 *
	 * @param context - Context containing event-specific data
	 * @returns Complete risk assessment for the password change event
	 */
	static assessPasswordChange(context: {
		sessionsInvalidated: number
		isNewDevice?: boolean // опционально
	}): IRiskAssessment {
		const factors: IRiskFactor[] = []

		// Base factor for any password change
		factors.push({
			type: 'password_change_initiated',
			score: RISK_WEIGHTS.PASSWORD_CHANGE,
			weight: 1.0,
			description: 'User-initiated password change.',
		})

		// Factor for multiple sessions being invalidated (potential sign of account takeover)
		if (context.sessionsInvalidated > 2) {
			factors.push({
				type: 'multiple_sessions_invalidated',
				score: RISK_WEIGHTS.MULTIPLE_SESSIONS_INVALIDATED,
				weight: 1.0,
				description: `Invalidated ${context.sessionsInvalidated} other sessions.`,
				details: { count: context.sessionsInvalidated },
			})
		}

		// Factor for changing password from a new or untrusted device
		if (context.isNewDevice) {
			factors.push({
				type: 'new_device_password_change',
				score: RISK_WEIGHTS.NEW_DEVICE,
				weight: 1.2, // Higher weight for this specific action
				description: 'Password changed from a new device.',
			})
		}

		const score = this.calculateScore(factors)
		const level = this.getRiskLevel(score)
		const anomalies: IAnomaly[] = []

		if (level === ERiskLevel.HIGH || level === ERiskLevel.CRITICAL) {
			anomalies.push({
				type: 'behavior',
				severity: 'high',
				description: 'High-risk password change event detected.',
				score: score,
				details: { sessionsInvalidated: context.sessionsInvalidated, isNewDevice: context.isNewDevice },
			})
		}

		return {
			score,
			level,
			factors,
			recommendations: this.generateRecommendations(level, anomalies),
			require2FA: score >= RISK_THRESHOLDS[ERiskLevel.MEDIUM].min,
			blockAccess: false, // Password change should not block access
			assessedAt: new Date(),
		}
	}
}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.228Z*
