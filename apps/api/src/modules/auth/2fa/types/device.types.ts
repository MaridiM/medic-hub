import type { ISessionMetadataDTO } from '@/shared/types'

/**
 * Device fingerprint components
 * Used to uniquely identify a device
 */
export interface IDeviceFingerprint {
	// Browser fingerprint
	userAgent: string
	language: string
	languages: string[]
	platform: string
	screenResolution: string
	availableScreenResolution: string
	colorDepth: number
	pixelRatio: number
	timezone: string
	timezoneOffset: number

	// Hardware
	hardwareConcurrency: number
	deviceMemory?: number
	maxTouchPoints: number

	// Canvas fingerprint
	canvasFingerprint?: string

	// WebGL fingerprint
	webglVendor?: string
	webglRenderer?: string

	// Audio fingerprint
	audioFingerprint?: string

	// Fonts
	installedFonts?: string[]

	// Plugins
	plugins?: string[]

	// Additional
	doNotTrack?: string
	cookieEnabled: boolean
	localStorage: boolean
	sessionStorage: boolean
	indexedDB: boolean
}

/**
 * Re-export session metadata from shared types
 * This is what we get from getSessionMetadata()
 */
export type { ISessionMetadataDTO }

/**
 * Extended device metadata with fingerprint
 */
export interface IDeviceMetadata extends ISessionMetadataDTO {
	/** Unique device ID generated from fingerprint */
	deviceId: string
	/** Full fingerprint data */
	fingerprint?: IDeviceFingerprint
}

/**
 * Device trust level
 */
export enum EDeviceTrustLevel {
	/** Unknown device, never seen before */
	UNKNOWN = 0,
	/** Seen before but not trusted */
	RECOGNIZED = 25,
	/** Partially trusted, some successful logins */
	PARTIAL = 50,
	/** Trusted device, many successful logins */
	TRUSTED = 75,
	/** Fully trusted, whitelisted device */
	VERIFIED = 100,
}

/**
 * Device trust score factors
 */
export interface IDeviceTrustFactors {
	/** Number of successful authentications */
	successfulLogins: number
	/** Number of failed attempts */
	failedAttempts: number
	/** Days since first seen */
	daysSinceFirstSeen: number
	/** Location consistency */
	locationConsistency: number
	/** Time pattern consistency */
	timePatternConsistency: number
	/** Is device explicitly trusted by user */
	explicitlyTrusted: boolean
}
