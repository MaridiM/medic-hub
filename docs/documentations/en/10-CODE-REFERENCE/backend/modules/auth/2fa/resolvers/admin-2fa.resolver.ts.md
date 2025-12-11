# File: modules\auth\2fa\resolvers\admin-2fa.resolver.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/resolvers/admin-2fa.resolver.ts`

## Category
Backend

## File Type
TS (admin-2fa.resolver.ts)

## Size
4169 characters, 138 lines

## Full Code

```typescript
import { EUserRole, Roles, RolesGuard } from '@/modules/rbac'
import { Authorization, Authorized } from '@/shared/decorators'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { type User } from '@prisma/__generated__'

import {
	DisableUser2FAInput,
	GetUserSecurityEventsInput,
	RevokeAllUserDevicesInput,
	RevokeUserDeviceInput,
} from '../dtos/admin-2fa.dto'
import {
	AdminActionSuccessModel,
	SecurityEventSummary,
	TrustedDeviceSummary,
	User2FAStatusModel,
} from '../models/admin-2fa.model'
import { AdminTwoFactorService, DeviceTrustService } from '../services'

/**
 * Administrative resolver for 2FA management.
 * All operations require SUPER_ADMIN role and are heavily audited.
 */
@Resolver('Admin2FA')
@Authorization() // Require authentication for all operations
@Roles(EUserRole.SUPER_ADMIN) // Require SUPER_ADMIN role
@UseGuards(RolesGuard) // Apply role checking
export class AdminTwoFactorResolver {
	constructor(
		private readonly adminService: AdminTwoFactorService,
		private readonly deviceTrustService: DeviceTrustService,
	) {}

	// ==================== Queries ====================

	/**
	 * Get comprehensive 2FA status for any user
	 */
	@Query(() => User2FAStatusModel, {
		name: 'adminGetUser2FAStatus',
		description: '[Admin] Get comprehensive 2FA status for a user',
	})
	async getUser2FAStatus(@Args('userId') userId: string): Promise<User2FAStatusModel> {
		return this.adminService.getUser2FAStatus(userId)
	}

	/**
	 * Get security events for a user
	 */
	@Query(() => [SecurityEventSummary], {
		name: 'adminGetUserSecurityEvents',
		description: '[Admin] Get security events for a user',
	})
	async getUserSecurityEvents(@Args('input') input: GetUserSecurityEventsInput): Promise<SecurityEventSummary[]> {
		const events = await this.adminService.getUserSecurityEvents(input)

		return events.map(e => ({
			id: e.id,
			event: e.event,
			severity: e.severity,
			ip: e.ip,
			country: e.country,
			city: e.city,
			resolved: e.resolved,
			createdAt: e.createdAt,
		}))
	}

	/**
	 * Get all trusted devices for a user
	 */
	@Query(() => [TrustedDeviceSummary], {
		name: 'adminGetUserTrustedDevices',
		description: '[Admin] Get all trusted devices for a user',
	})
	async getUserTrustedDevices(@Args('userId') userId: string): Promise<TrustedDeviceSummary[]> {
		const devices = await this.deviceTrustService.getUserDevices(userId)

		return devices.map(d => ({
			id: d.id,
			deviceId: d.deviceId,
			name: d.name,
			browser: d.browser,
			os: d.os,
			trustScore: d.trustScore,
			lastIp: d.lastIp,
			lastCountry: d.lastCountry,
			lastSeenAt: d.lastSeenAt,
			isActive: d.isActive,
		}))
	}

	// ==================== Mutations ====================

	/**
	 * Disable 2FA for a user (emergency access)
	 */
	@Mutation(() => AdminActionSuccessModel, {
		name: 'adminDisableUser2FA',
		description: '[Admin] Disable 2FA for a user in emergency situations',
	})
	async disableUser2FA(
		@Authorized() adminUser: User,
		@Args('input') input: DisableUser2FAInput,
	): Promise<AdminActionSuccessModel> {
		return this.adminService.disableUser2FA(adminUser, input)
	}

	/**
	 * Revoke a specific device for a user
	 */
	@Mutation(() => AdminActionSuccessModel, {
		name: 'adminRevokeUserDevice',
		description: '[Admin] Revoke a specific trusted device for a user',
	})
	async revokeUserDevice(
		@Authorized() adminUser: User,
		@Args('input') input: RevokeUserDeviceInput,
	): Promise<AdminActionSuccessModel> {
		return this.adminService.revokeUserDevice(adminUser, input)
	}

	/**
	 * Revoke all devices for a user (emergency)
	 */
	@Mutation(() => AdminActionSuccessModel, {
		name: 'adminRevokeAllUserDevices',
		description: '[Admin] Revoke all trusted devices and sessions for a user',
	})
	async revokeAllUserDevices(
		@Authorized() adminUser: User,
		@Args('input') input: RevokeAllUserDevicesInput,
	): Promise<AdminActionSuccessModel> {
		return this.adminService.revokeAllUserDevices(adminUser, input)
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.156Z*
