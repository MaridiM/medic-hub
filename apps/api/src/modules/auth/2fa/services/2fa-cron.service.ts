import { Injectable, Logger } from '@nestjs/common'
import { Cron, SchedulerRegistry } from '@nestjs/schedule'

import { BackupCodeService } from './backup-code.service'
import { DeviceTrustService } from './device-trust.service'
import { SecurityEventService } from './security-event.service'

/**
 * Automated maintenance service for 2FA system.
 * Handles cleanup of expired data and enforcement of limits.
 */
@Injectable()
export class TwoFactorCronService {
	private readonly logger = new Logger(TwoFactorCronService.name)

	constructor(
		private readonly backupCodeService: BackupCodeService,
		private readonly deviceTrustService: DeviceTrustService,
		private readonly securityEventService: SecurityEventService,
		private readonly schedulerRegistry: SchedulerRegistry,
	) {
		this.logger.log('🤖 2FA Cron Service initialized')
		this.logScheduledJobs()
	}

	/**
	 * Clean up expired backup codes
	 * Runs daily at 2:00 AM
	 */
	@Cron(process.env.CRON_CLEANUP_BACKUP_CODES || '0 2 * * *', {
		name: 'cleanup-backup-codes',
		timeZone: process.env.TZ || 'UTC',
	})
	async cleanupExpiredBackupCodes(): Promise<void> {
		const startTime = Date.now()
		this.logger.log('🧹 Starting expired backup codes cleanup...')

		try {
			const result = await this.backupCodeService.cleanupExpiredCodes()
			const duration = Date.now() - startTime

			this.logger.log(
				`✅ Backup codes cleanup completed: ${result.deleted} codes removed, ` +
					`${result.affected} users affected (${duration}ms)`,
			)

			// Log metrics for monitoring
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
	}

	/**
	 * Clean up old and inactive devices
	 * Runs daily at 3:00 AM
	 */
	@Cron(process.env.CRON_CLEANUP_DEVICES || '0 3 * * *', {
		name: 'cleanup-devices',
		timeZone: process.env.TZ || 'UTC',
	})
	async cleanupOldDevices(): Promise<void> {
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
	}

	/**
	 * Archive old security events
	 * Runs weekly on Sunday at 4:00 AM
	 */
	@Cron(process.env.CRON_CLEANUP_EVENTS || '0 4 * * 0', {
		name: 'cleanup-security-events',
		timeZone: process.env.TZ || 'UTC',
	})
	async cleanupOldSecurityEvents(): Promise<void> {
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
	}

	/**
	 * Enforce device limits for all users
	 * Runs every 6 hours
	 */
	@Cron(process.env.CRON_ENFORCE_DEVICE_LIMITS || '0 */6 * * *', {
		name: 'enforce-device-limits',
		timeZone: process.env.TZ || 'UTC',
	})
	async enforceDeviceLimits(): Promise<void> {
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
	}

	/**
	 * Log cron job metrics for monitoring
	 */
	private async logCronMetrics(jobName: string, metrics: Record<string, any>): Promise<void> {
		// In production, you would send these metrics to your monitoring service
		// For now, we'll just log them
		this.logger.debug(`📊 Cron metrics for ${jobName}:`, metrics)

		// Example: Send to monitoring service
		// await this.monitoringService.recordCronExecution(jobName, metrics)
	}

	/**
	 * Log all scheduled jobs on startup
	 */
	private logScheduledJobs(): void {
		const jobs = this.schedulerRegistry.getCronJobs()

		this.logger.log('📅 Scheduled cron jobs:')
		jobs.forEach((job, name) => {
			const nextDate = job.nextDate()
			this.logger.log(`  - ${name}: Next run at ${nextDate.toISO()}`)
		})
	}

	/**
	 * Manually trigger a specific job (for testing/admin purposes)
	 */
	async triggerJob(jobName: string): Promise<void> {
		const job = this.schedulerRegistry.getCronJob(jobName)

		if (!job) {
			throw new Error(`Job ${jobName} not found`)
		}

		this.logger.warn(`⚡ Manually triggering job: ${jobName}`)

		// Fix: Use void operator for fire-and-forget or handle the promise
		void job.fireOnTick()
		// Alternative if fireOnTick returns a promise and you want to wait:
		// await Promise.resolve(job.fireOnTick())
	}

	/**
	 * Get status of all cron jobs
	 */
	getCronJobsStatus(): Array<{ name: string; running: boolean; nextRun: Date | null }> {
		const jobs = this.schedulerRegistry.getCronJobs()
		const status: Array<{ name: string; running: boolean; nextRun: Date | null }> = []

		jobs.forEach((job, name) => {
			try {
				// CronJob from 'cron' package doesn't have 'running' property
				// Check if job has lastDate (it was executed) as proxy for running state
				const lastDate = job.lastDate()
				const nextDate = job.nextDate()

				status.push({
					name,
					running: false, // We can't reliably determine if running
					nextRun: nextDate ? nextDate.toJSDate() : null,
				})
			} catch (error) {
				this.logger.error(`Failed to get status for job ${name}:`, error)
				status.push({
					name,
					running: false,
					nextRun: null,
				})
			}
		})

		return status
	}

	/**
	 * Alternative implementation with better type safety
	 */
	getCronJobsStatusSafe(): Array<{
		name: string
		lastDate: Date | null
		nextDate: Date | null
	}> {
		const jobs = this.schedulerRegistry.getCronJobs()
		const status: Array<{
			name: string
			lastDate: Date | null
			nextDate: Date | null
		}> = []

		jobs.forEach((job, name) => {
			try {
				status.push({
					name,
					lastDate: job.lastDate() || null,
					nextDate: job.nextDate()?.toJSDate() || null,
				})
			} catch (error) {
				this.logger.error(`Failed to get status for job ${name}:`, error)
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
