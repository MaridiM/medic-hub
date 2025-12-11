# File: modules\notification\types\notification.types.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/notification/types/notification.types.ts`

## Category
Backend

## File Type
TS (notification.types.ts)

## Size
3121 characters, 124 lines

## Full Code

```typescript
import type { Language } from '@/core/i18n'
import type { ISessionMetadataDTO } from '@/shared/types'
import type { E2FAMethod, User } from '@prisma/__generated__'

/**
 * Notification category for grouping
 */
export enum ENotificationCategory {
	/** Security-related notifications (2FA, login alerts, etc.) */
	SECURITY = 'SECURITY',
	/** Authentication events (password reset, email verification) */
	AUTHENTICATION = 'AUTHENTICATION',
	/** User account changes (profile updates, settings) */
	USER = 'USER',
	/** Administrative actions (account suspension, etc.) */
	ADMIN = 'ADMIN',
	/** System notifications (maintenance, updates) */
	SYSTEM = 'SYSTEM',
}

/**
 * Notification delivery channel
 */
export enum ENotificationChannel {
	/** Email notification */
	EMAIL = 'EMAIL',
	/** SMS notification */
	SMS = 'SMS',
	/** Push notification (future) */
	PUSH = 'PUSH',
	/** In-app notification (future) */
	IN_APP = 'IN_APP',
}

/**
 * Notification priority level
 */
export enum ENotificationPriority {
	/** Low priority - informational */
	LOW = 'LOW',
	/** Normal priority - standard notifications */
	NORMAL = 'NORMAL',
	/** High priority - important security events */
	HIGH = 'HIGH',
	/** Critical priority - immediate action required */
	CRITICAL = 'CRITICAL',
}

/**
 * Base notification data
 */
export interface INotificationBase {
	/** Recipient user */
	user: User
	/** User's language preference */
	language: Language
	/** Notification category */
	category: ENotificationCategory
	/** Priority level */
	priority: ENotificationPriority
	/** Delivery channels to use */
	channels?: ENotificationChannel[]
}

/**
 * Security notification specific data
 */
export interface ISecurityNotificationData extends INotificationBase {
	category: ENotificationCategory.SECURITY
}

/**
 * 2FA method change notification data
 */
export interface I2FAMethodNotificationData extends ISecurityNotificationData {
	methodType: E2FAMethod
	methodName?: string
	action: '2fa_method_added' | '2fa_method_removed' | '2fa_disabled'
}

/**
 * Device login notification data
 */
export interface IDeviceLoginNotificationData extends ISecurityNotificationData {
	device: ISessionMetadataDTO 
}

/**
 * Backup codes notification data
 */
export interface IBackupCodesNotificationData extends ISecurityNotificationData {
	remaining?: number
	action: 'low_codes' | 'codes_regenerated'
}

/**
 * Suspicious activity notification data
 */
export interface ISuspiciousActivityNotificationData extends ISecurityNotificationData {
	eventDescription: string
	riskScore: number
}

/**
 * Admin action notification data
 */
export interface IAdminActionNotificationData extends INotificationBase {
	category: ENotificationCategory.ADMIN
	adminEmail: string
	reason: string
	action: '2fa_disabled' | 'device_revoked' | 'account_suspended'
	deviceName?: string
}

/**
 * Notification result
 */
export interface INotificationResult {
	success: boolean
	channel: ENotificationChannel
	sentAt?: Date
	error?: string
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.512Z*
