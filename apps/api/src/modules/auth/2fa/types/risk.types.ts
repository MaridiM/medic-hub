import type { ISessionMetadataDTO } from '@/shared/types'

/**
 * Risk level categories
 */
export enum ERiskLevel {
	/** Very low risk, trusted pattern */
	VERY_LOW = 'VERY_LOW',
	/** Low risk, normal behavior */
	LOW = 'LOW',
	/** Medium risk, some anomalies */
	MEDIUM = 'MEDIUM',
	/** High risk, suspicious activity */
	HIGH = 'HIGH',
	/** Critical risk, likely attack */
	CRITICAL = 'CRITICAL',
}

/**
 * Individual risk factor
 */
// src/modules/auth/2fa/types/risk.types.ts
export interface IRiskFactor {
	/** Factor type (e.g., "new_device", "unusual_location") */
	type: string
	/** Risk score contribution (0-100) */
	score: number
	/** Factor weight in final calculation */
	weight: number
	/** Human-readable description */
	description: string
	/** Evidence/details */
	details?: Record<string, unknown>
}

/**
 * Complete risk assessment result
 */
export interface IRiskAssessment {
	/** Overall risk score (0-100) */
	score: number
	/** Risk level category */
	level: ERiskLevel
	/** Individual risk factors */
	factors: IRiskFactor[]
	/** Recommended actions */
	recommendations: string[]
	/** Whether to require 2FA */
	require2FA: boolean
	/** Whether to block access */
	blockAccess: boolean
	/** Assessment timestamp */
	assessedAt: Date
}

/**
 * Anomaly detection result
 */
export interface IAnomaly {
	type: 'location' | 'time' | 'device' | 'behavior' | 'velocity'
	severity: 'low' | 'medium' | 'high' | 'critical'
	description: string
	score: number
	details: Record<string, unknown>
}

/**
 * Re-export session metadata for convenience
 */
export type { ISessionMetadataDTO }
