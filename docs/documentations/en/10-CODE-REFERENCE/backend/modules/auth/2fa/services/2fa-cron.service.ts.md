# File: modules\auth\2fa\services\2fa-cron.service.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/services/2fa-cron.service.ts`

## Category
Backend

## File Type
TS (2fa-cron.service.ts)

## Size
10672 characters, 380 lines

## Full Code

```typescript
import type { CronJob } from 'cron'

import {
	CRON_CLEANUP_BACKUP_CODES,
	CRON_CLEANUP_DEVICES,
	CRON_CLEANUP_EVENTS,
	CRON_ENFORCE_DEVICE_LIMITS,
} from '@/core/config'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Cron, SchedulerRegistry } from '@nestjs/schedule'

import { BackupCodeService } from './backup-code.service'
import { DeviceTrustService } from './device-trust.service'
import { SecurityEventService } from './security-event.service'

/**
 * Automated maintenance service for 2FA system.
 * Handles cleanup of expired data and enforcement of limits.
 */
@Injectable()
export class TwoFactorCronService implements OnModuleInit {
	private readonly logger = new Logger(TwoFactorCronService.name)
	private readonly runningJobs = new Set<string>()
	private static instanceCount = 0
	private readonly instanceId: number

	constructor(
		private readonly backupCodeService: BackupCodeService,
		private readonly deviceTrustService: DeviceTrustService,
		private readonly securityEventService: SecurityEventService,
		private readonly schedulerRegistry: SchedulerRegistry,
	) {
		this.instanceId = ++TwoFactorCronService.instanceCount
		this.logger.log(`🤖 2FA Cron Service initialized (Instance #${this.instanceId})`)

		if (this.instanceId > 1) {
			this.logger.warn(
				`⚠️ WARNING: Multiple instances detected! This service should be singleton. ` +
					`Check your module imports.`,
			)
		}
	}

	onModuleInit() {
		this.logScheduledJobs()
	}

	/**
	 * Prevents duplicate concurrent executions of the same job
	 */
	private async executeWithLock<T>(jobName: string, fn: () => Promise<T>): Promise<T | null> {
		const lockKey = `${jobName}-${this.instanceId}`

		if (this.runningJobs.has(lockKey)) {
			this.logger.warn(`⏭️ Skipping ${jobName}: Already running`)
			return null
		}

		this.runningJobs.add(lockKey)
		try {
			return await fn()
		} finally {
			this.runningJobs.delete(lockKey)
		}
	}

	/**
	 * Clean up expired backup codes
	 * Runs daily at 2:00 AM
	 */
	@Cron(CRON_CLEANUP_BACKUP_CODES, {
		name: 'cleanup-backup-codes',
		timeZone: process.env.TZ || 'UTC',
	})
	async cleanupExpiredBackupCodes(): Promise<void> {
		await this.executeWithLock('cleanup-backup-codes', async () => {
			const startTime = Date.now()
			this.logger.log('🧹 Starting expired backup codes cleanup...')

			try {
				const result = await this.backupCodeService.cleanupExpiredCodes()
				const duration = Date.now() - startTime

				this.logger.log(
					`✅ Backup codes cleanup completed: ${result.deleted} codes removed, ` +
						`${result.affected} users affected (${duration}ms)`,
				)

				await this.logCronMetrics('cleanup_backup_codes', {
					success: true,
					itemsProcessed: result.deleted,
					usersAffected: result.affected,
					duration,
				})
			} catch (error) {
				const duration = Date.now() - startTime
				this.logger.error(
					`❌ Backup codes cleanup failed after ${duration}ms: ${(error as Error).message}`,
					(error as Error).stack,
				)

				await this.logCronMetrics('cleanup_backup_codes', {
					success: false,
					error: (error as Error).message,
					duration,
				})
			}
		})
	}

	/**
	 * Clean up old and inactive devices
	 * Runs daily at 6:00 AM
	 */
	@Cron(CRON_CLEANUP_DEVICES, {
		name: 'cleanup-devices',
		timeZone: process.env.TZ || 'UTC',
	})
	async cleanupOldDevices(): Promise<void> {
		await this.executeWithLock('cleanup-devices', async () => {
			const startTime = Date.now()
			this.logger.log('🧹 Starting old devices cleanup...')

			try {
				const result = await this.deviceTrustService.cleanupDevices()
				const duration = Date.now() - startTime

				this.logger.log(
					`✅ Devices cleanup completed: ${result.deleted} devices removed, ` +
						`${result.sessionsInvalidated} sessions invalidated (${duration}ms)`,
				)

				await this.logCronMetrics('cleanup_devices', {
					success: true,
					itemsProcessed: result.deleted,
					sessionsInvalidated: result.sessionsInvalidated,
					duration,
				})
			} catch (error) {
				const duration = Date.now() - startTime
				this.logger.error(
					`❌ Devices cleanup failed after ${duration}ms: ${(error as Error).message}`,
					(error as Error).stack,
				)

				await this.logCronMetrics('cleanup_devices', {
					success: false,
					error: (error as Error).message,
					duration,
				})
			}
		})
	}

	/**
	 * Archive old security events
	 * Runs weekly on Sunday at 4:00 AM
	 */
	@Cron(CRON_CLEANUP_EVENTS, {
		name: 'cleanup-security-events',
		timeZone: process.env.TZ || 'UTC',
	})
	async cleanupOldSecurityEvents(): Promise<void> {
		await this.executeWithLock('cleanup-security-events', async () => {
			const startTime = Date.now()
			this.logger.log('🧹 Starting old security events cleanup...')

			try {
				const result = await this.securityEventService.archiveOldEvents()
				const duration = Date.now() - startTime

				this.logger.log(
					`✅ Security events cleanup completed: ${result.archived} events archived, ` +
						`${result.deleted} events deleted (${duration}ms)`,
				)

				await this.logCronMetrics('cleanup_security_events', {
					success: true,
					archived: result.archived,
					deleted: result.deleted,
					duration,
				})
			} catch (error) {
				const duration = Date.now() - startTime
				this.logger.error(
					`❌ Security events cleanup failed after ${duration}ms: ${(error as Error).message}`,
					(error as Error).stack,
				)

				await this.logCronMetrics('cleanup_security_events', {
					success: false,
					error: (error as Error).message,
					duration,
				})
			}
		})
	}

	/**
	 * Enforce device limits for all users
	 * Runs every 3 hours
	 */
	@Cron(CRON_ENFORCE_DEVICE_LIMITS, {
		name: 'enforce-device-limits',
		timeZone: process.env.TZ || 'UTC',
	})
	async enforceDeviceLimits(): Promise<void> {
		await this.executeWithLock('enforce-device-limits', async () => {
			const startTime = Date.now()
			this.logger.log('🔒 Starting device limits enforcement...')

			try {
				const result = await this.deviceTrustService.enforceAllUsersDeviceLimits()
				const duration = Date.now() - startTime

				if (result.devicesRevoked > 0) {
					this.logger.warn(
						`⚠️ Device limits enforced: ${result.devicesRevoked} devices revoked ` +
							`from ${result.usersAffected} users (${duration}ms)`,
					)
				} else {
					this.logger.log(`✅ Device limits check completed: All users within limits (${duration}ms)`)
				}

				await this.logCronMetrics('enforce_device_limits', {
					success: true,
					devicesRevoked: result.devicesRevoked,
					usersAffected: result.usersAffected,
					usersChecked: result.usersChecked,
					duration,
				})
			} catch (error) {
				const duration = Date.now() - startTime
				this.logger.error(
					`❌ Device limits enforcement failed after ${duration}ms: ${(error as Error).message}`,
					(error as Error).stack,
				)

				await this.logCronMetrics('enforce_device_limits', {
					success: false,
					error: (error as Error).message,
					duration,
				})
			}
		})
	}

	/**
	 * Log cron job metrics for monitoring
	 */
	private async logCronMetrics(jobName: string, metrics: Record<string, unknown>): Promise<void> {
		this.logger.debug(`📊 Cron metrics for ${jobName}:`, metrics)
		// Example: await this.monitoringService.recordCronExecution(jobName, metrics)
	}

	/**
	 * Helper to safely convert cron date to ISO string
	 */
	private cronDateToISO(date: unknown): string | null {
		if (!date) return null

		try {
			// Try Luxon DateTime (has toISO method)
			if (this.isObjectWithMethod(date, 'toISO')) {
				const result = date.toISO()
				return typeof result === 'string' ? result : null
			}

			// Try Date object
			if (date instanceof Date) {
				return date.toISOString()
			}

			// Try objects with toJSDate method (Luxon DateTime)
			if (this.isObjectWithMethod(date, 'toJSDate')) {
				const jsDate = date.toJSDate()
				if (jsDate instanceof Date) {
					return jsDate.toISOString()
				}
			}

			// Try string or number conversion
			if (typeof date === 'string' || typeof date === 'number') {
				const dateObj = new Date(date)
				if (!isNaN(dateObj.getTime())) {
					return dateObj.toISOString()
				}
			}

			return null
		} catch {
			// Silently ignore conversion errors
			return null
		}
	}

	/**
	 * Type guard to check if object has a specific method
	 */
	private isObjectWithMethod<K extends string>(
		obj: unknown,
		method: K,
	): obj is Record<K, (...args: unknown[]) => unknown> {
		return (
			typeof obj === 'object' &&
			obj !== null &&
			method in obj &&
			typeof (obj as Record<string, unknown>)[method] === 'function'
		)
	}

	/**
	 * Log all scheduled jobs on startup
	 */
	private logScheduledJobs(): void {
		const jobs = this.schedulerRegistry.getCronJobs()

		this.logger.log(`📅 Scheduled cron jobs (${jobs.size} total):`)
		jobs.forEach((job, name) => {
			try {
				const nextDate = this.cronDateToISO(job.nextDate())
				this.logger.log(`  - ${name}: Next run at ${nextDate || 'unknown'}`)
			} catch {
				this.logger.warn(`  - ${name}: Unable to determine next run time`)
			}
		})
	}

	/**
	 * Manually trigger a specific job (for testing/admin purposes)
	 */
	async triggerJob(jobName: string): Promise<void> {
		try {
			const job = this.schedulerRegistry.getCronJob(jobName)
			this.logger.warn(`⚡ Manually triggering job: ${jobName}`)

			// Execute the job callback directly
			const callback = job.fireOnTick.bind(job)
			await Promise.resolve(callback())
		} catch (error) {
			this.logger.error(`Failed to trigger job ${jobName}:`, error)
			throw new Error(`Job ${jobName} not found or failed to execute`)
		}
	}

	/**
	 * Get status of all cron jobs with proper typing
	 */
	getCronJobsStatus(): Array<{
		name: string
		lastDate: string | null
		nextDate: string | null
	}> {
		const jobs = this.schedulerRegistry.getCronJobs()
		const status: Array<{
			name: string
			lastDate: string | null
			nextDate: string | null
		}> = []

		jobs.forEach((job: CronJob, name: string) => {
			try {
				status.push({
					name,
					lastDate: this.cronDateToISO(job.lastDate()),
					nextDate: this.cronDateToISO(job.nextDate()),
				})
			} catch {
				status.push({
					name,
					lastDate: null,
					nextDate: null,
				})
			}
		})

		return status
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.159Z*
