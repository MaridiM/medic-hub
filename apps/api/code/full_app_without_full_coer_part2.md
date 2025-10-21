# Full App Code (excluding imports, tests, i18n, extra core) - Part 2 of 8

`src/modules/auth/2fa/services/2fa-cron.service.ts`


```typescript
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

```




`src/modules/auth/2fa/services/2fa-method.service.ts`


```typescript
/**
 * Main 2FA Method Service
 * Orchestrates all 2FA operations across different methods
 */
@Injectable()
export class TwoFactorMethodService extends CoreService {
	private readonly logger = new Logger(TwoFactorMethodService.name)

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly backupCodeService: BackupCodeService,
		private readonly securityEventService: SecurityEventService,
		private readonly mailService: MailService,
		private readonly smsService: SmsService,
		private readonly notificationService: NotificationService,
	) {
		super(i18n, prisma, redis)
	}

	// ==================== TOTP Methods ====================

	/**
	 * Generate TOTP setup (QR code + secret)
	 */
	async generateTotpSetup(user: User, name: string | undefined, lng: Language) {
		// Check if user already has max methods
		await this.checkMethodLimits(user.id, lng)

		// Generate secret
		const secret = this.generateTotpSecret()

		// Create TOTP instance
		const totp = this.createTOTP(user.email, secret)
		const otpAuthUrl = totp.toString()

		// Generate QR code
		const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl, QR_CODE_OPTIONS)

		// Store temporary secret in Redis (10 minutes)
		const tempKey = REDIS_KEYS.TOTP_TEMP_SECRET(user.id)
		await this.rSetJSON(tempKey, { secret, name }, 600)

		this.logger.log(`TOTP setup generated for user ${user.id}`)

		return {
			methodId: 'temp', // Temporary ID until verified
			qrCodeUrl,
			manualEntryKey: secret,
			issuer: APP_NAME,
			accountName: user.email,
		}
	}

	/**
	 * Complete TOTP setup after user scans QR and enters code
	 */
	async completeTotpSetup(user: User, input: CompleteTotpSetupInput, lng: Language) {
		// Get temporary secret
		const tempKey = REDIS_KEYS.TOTP_TEMP_SECRET(user.id)
		const cached = await this.rGetJSON<{ secret: string; name?: string }>(tempKey)

		if (!cached?.secret) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.setup_expired', {
					lng,
					defaultValue: 'TOTP setup has expired. Please start again.',
				}),
			)
		}

		if (cached.secret !== input.secret) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.invalid_secret', { lng, defaultValue: 'Invalid TOTP secret' }),
			)
		}

		// Verify code
		const isValid = this.verifyTotpCode(user.email, input.secret, input.code)
		if (!isValid) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.invalid_code', { lng, defaultValue: 'Invalid verification code' }),
			)
		}

		// Encrypt secret
		const encryptedSecret = EncryptionUtil.encrypt(input.secret)

		// Prepare method data
		const methodData: ITotpMethodData = {
			secret: encryptedSecret,
			algorithm: TOTP_CONFIG.ALGORITHM,
			digits: TOTP_CONFIG.DIGITS,
			period: TOTP_CONFIG.PERIOD,
			issuer: APP_NAME,
			accountName: user.email,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}

		// Create method and backup codes in transaction
		const result = await this.prisma.$transaction(async tx => {
			// Check if this should be primary (first method)
			const existingMethods = await tx.authenticationMethod.count({
				where: { userId: user.id, isActive: true },
			})
			const isPrimary = existingMethods === 0

			// Create authentication method
			const method = await tx.authenticationMethod.create({
				data: {
					userId: user.id,
					method: E2FAMethod.TOTP,
					data: methodData as unknown as Prisma.JsonValue,
					name: input.name || cached.name || 'TOTP Authenticator',
					isPrimary,
					isActive: true,
				},
			})

			// Enable 2FA on user if this is first method
			if (isPrimary) {
				await tx.user.update({
					where: { id: user.id },
					data: {
						is2FAEnabled: true,
						preferred2FAMethod: E2FAMethod.TOTP,
					},
				})
			}

			// Log audit
			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: AUDIT_ACTIONS.TOTP_SETUP_COMPLETED,
					category: 'SECURITY',
					success: true,
					metadata: { methodId: method.id } as Prisma.InputJsonValue,
				},
			})

			return method
		})

		// Generate backup codes (outside transaction for better error handling)
		const backupCodes = await this.backupCodeService.generateBackupCodes(user.id, E2FAMethod.TOTP, result.id)

		await this.securityEventService.logEvent({
			userId: user.id,
			event: ESecurityEvent.TWO_FA_METHOD_ADDED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: {
				methodId: result.id,
				methodType: result.method,
				timestamp: new Date().toISOString(),
			},
		})

		// ✅ NOTIFICATION CALL
		await this.notificationService.notify2FAMethodAdded(user, E2FAMethod.TOTP, result.name, lng)

		// Clear temp secret
		await this.rDel(tempKey)

		this.logger.log(`TOTP setup completed for user ${user.id}, method ${result.id}`)

		return {
			success: true,
			methodId: result.id,
			backupCodes,
			message: this.i18n.t('auth.setup.2fa.backup_codes_warning', {
				lng,
				defaultValue: 'Save these backup codes in a secure place. Each code can only be used once.',
			}),
		}
	}

	// ==================== OTP Methods ====================

	/**
	 * Setup OTP (Email or SMS)
	 */
	async setupOtp(user: User, input: SetupOtpInput, lng: Language) {
		await this.checkMethodLimits(user.id, lng)

		// Validate input
		if (input.method === E2FAMethod.OTP_EMAIL && !input.email && !user.email) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.email_required', { lng, defaultValue: 'Email is required for OTP_EMAIL' }),
			)
		}

		if (input.method === E2FAMethod.OTP_SMS && !input.phone && !user.phone) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.phone_required', { lng, defaultValue: 'Phone is required for OTP_SMS' }),
			)
		}

		// Prepare method data
		let methodData: IOtpEmailMethodData | IOtpSmsMethodData

		if (input.method === E2FAMethod.OTP_EMAIL) {
			const email = input.email || user.email
			methodData = {
				email,
				sentCount: 0,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}
		} else {
			const phone = input.phone || user.phone
			methodData = {
				phone,
				sentCount: 0,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}
		}

		// Create method
		const existingMethods = await this.prisma.authenticationMethod.count({
			where: { userId: user.id, isActive: true },
		})
		const isPrimary = existingMethods === 0

		const method = await this.prisma.authenticationMethod.create({
			data: {
				userId: user.id,
				method: input.method,
				data: methodData as unknown as Prisma.JsonValue,
				name: input.name || `${input.method === E2FAMethod.OTP_EMAIL ? 'Email' : 'SMS'} OTP`,
				isPrimary,
				isActive: false, // Inactive until verified
			},
		})

		// Enable 2FA if first method
		if (isPrimary) {
			await this.prisma.user.update({
				where: { id: user.id },
				data: {
					is2FAEnabled: true,
					preferred2FAMethod: input.method,
				},
			})
		}

		this.logger.log(`OTP setup created for user ${user.id}, method ${method.id}`)

		return {
			methodId: method.id,
			destination:
				input.method === E2FAMethod.OTP_EMAIL
					? (methodData as IOtpEmailMethodData).email
					: (methodData as IOtpSmsMethodData).phone,
			message: this.i18n.t('auth.setup.2fa.otp_created', {
				lng,
				defaultValue: 'OTP method created. Please verify with a code.',
			}),
		}
	}

	/**
	 * Send OTP code to user
	 */
	async sendOtpCode(user: User, input: SendOtpCodeInput, lng: Language) {
		const method = input.methodId
			? await this.prisma.authenticationMethod.findUnique({
					where: { id: input.methodId },
				})
			: await this.prisma.authenticationMethod.findFirst({
					where: {
						userId: user.id,
						method: { in: [E2FAMethod.OTP_EMAIL, E2FAMethod.OTP_SMS] },
						isPrimary: true,
					},
				})

		if (!method) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.method_not_found', { lng, defaultValue: 'OTP method not found' }),
			)
		}

		// Generate code
		const code = this.generateOtpCode()
		const hashedCode = await HashUtil.hash(code)

		// Store in Redis
		const codeKey = REDIS_KEYS.OTP_CODE(user.id)
		await this.rSetJSON(
			codeKey,
			{
				code: hashedCode,
				methodId: method.id,
				expiresAt: Date.now() + OTP_CONFIG.CODE_EXPIRY * 1000,
			},
			OTP_CONFIG.CODE_EXPIRY,
		)

		const methodData = method.data as unknown as IOtpEmailMethodData | IOtpSmsMethodData

		try {
			if (method.method === E2FAMethod.OTP_EMAIL) {
				const data = methodData as IOtpEmailMethodData
				// NOTE: We may need a new method in MailService to send a simple code.
				// For now, we'll adapt an existing one or assume it exists.
				await this.mailService.sendOtpCodeEmail(data.email, code, lng) // Assuming this method exists or will be created.
				this.logger.log(`OTP code sent to ${data.email}`)
			} else {
				const data = methodData as IOtpSmsMethodData
				await this.smsService.sendOtpSMS(data.phone, code, lng)
				this.logger.log(`OTP code sent to ${data.phone}`)
			}
		} catch (error) {
			this.logger.error(`Failed to send OTP for user ${user.id} via ${method.method}`, error)
			throw new InternalServerErrorException(
				this.i18n.t('auth.errors.2fa.send_failed', {
					lng,
					defaultValue: 'Failed to send the verification code.',
				}),
			)
		}

		return {
			success: true,
			message: this.i18n.t('auth.success.2fa.otp_sent', { lng, defaultValue: 'OTP code sent successfully' }),
		}
	}

	/**
	 * Verify OTP code during setup
	 */
	async verifyOtpSetup(user: User, input: VerifyOtpSetupInput, lng: Language) {
		// Get stored code
		const codeKey = REDIS_KEYS.OTP_CODE(user.id)
		const cached = await this.rGetJSON<{ code: string; methodId: string; expiresAt: number }>(codeKey)

		if (!cached) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.code_expired', { lng, defaultValue: 'OTP code has expired' }),
			)
		}

		if (cached.methodId !== input.methodId) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.method_mismatch', { lng, defaultValue: 'Code does not match method' }),
			)
		}

		// Verify code
		const isValid = await HashUtil.verify(cached.code, input.code)
		if (!isValid) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.invalid_code', { lng, defaultValue: 'Invalid OTP code' }),
			)
		}

		// Activate method and generate backup codes
		const result = await this.prisma.$transaction(async tx => {
			const method = await tx.authenticationMethod.update({
				where: { id: input.methodId },
				data: { isActive: true },
			})

			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: AUDIT_ACTIONS.OTP_SETUP_COMPLETED,
					category: 'SECURITY',
					success: true,
					metadata: { methodId: method.id } as Prisma.InputJsonValue,
				},
			})

			return method
		})

		// Log security event
		await this.securityEventService.logEvent({
			userId: user.id,
			event: ESecurityEvent.TWO_FA_METHOD_ADDED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: { methodId: result.id, methodType: result.method, timestamp: new Date().toISOString() },
		})

		await this.securityEventService.logEvent({
			userId: user.id,
			event: ESecurityEvent.TWO_FA_METHOD_ADDED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: {
				methodId: result.id,
				methodType: result.method,
				timestamp: new Date().toISOString(),
			},
		})

		const backupCodes = await this.backupCodeService.generateBackupCodes(user.id, result.method, result.id)
		await this.rDel(codeKey)

		// ✅ NOTIFICATION CALL
		await this.notificationService.notify2FAMethodAdded(user, result.method, result.name, lng)

		return {
			success: true,
			methodId: result.id,
			backupCodes,
			message: this.i18n.t('auth.setup.2fa.backup_codes_warning', {
				lng,
				defaultValue: 'Save these backup codes securely.',
			}),
		}
	}

	// ==================== Method Management ====================

	/**
	 * Get all user's 2FA methods
	 */
	async getUserMethods(userId: string) {
		const methods = await this.prisma.authenticationMethod.findMany({
			where: { userId, isActive: true },
			orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
		})

		const primary = methods.find(m => m.isPrimary)
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: { is2FAEnabled: true },
		})

		return {
			methods: methods.map(m => ({
				id: m.id,
				method: m.method,
				name: m.name,
				isActive: m.isActive,
				isPrimary: m.isPrimary,
				lastUsedAt: m.lastUsedAt,
				useCount: m.useCount,
				createdAt: m.createdAt,
			})),
			primary: primary
				? {
						id: primary.id,
						method: primary.method,
						name: primary.name,
						isActive: primary.isActive,
						isPrimary: primary.isPrimary,
						lastUsedAt: primary.lastUsedAt,
						useCount: primary.useCount,
						createdAt: primary.createdAt,
					}
				: undefined,
			totalActive: methods.length,
			is2FAEnabled: user?.is2FAEnabled || false,
		}
	}

	/**
	 * Update 2FA method
	 */
	async updateMethod(userId: string, input: Update2FAMethodInput, lng: Language) {
		const method = await this.prisma.authenticationMethod.findFirst({
			where: { id: input.methodId, userId },
		})

		if (!method) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.method_not_found', { lng, defaultValue: 'Method not found' }),
			)
		}

		// If setting as primary, unset other primary methods
		if (input.isPrimary) {
			await this.prisma.authenticationMethod.updateMany({
				where: { userId, isPrimary: true },
				data: { isPrimary: false },
			})
		}

		await this.prisma.authenticationMethod.update({
			where: { id: input.methodId },
			data: {
				name: input.name,
				isPrimary: input.isPrimary,
				isActive: input.isActive,
			},
		})

		return { success: true }
	}

	/**
	 * Remove 2FA method
	 */
	async removeMethod(user: User, input: Remove2FAMethodInput, lng: Language) {
		// Verify password
		const isPasswordValid = await HashUtil.verify(user.password, input.password)
		if (!isPasswordValid) {
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.password.invalid', { lng, defaultValue: 'Invalid password' }),
			)
		}

		const method = await this.prisma.authenticationMethod.findFirst({
			where: { id: input.methodId, userId: user.id },
		})

		if (!method) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.method_not_found', { lng, defaultValue: 'Method not found' }),
			)
		}

		// If removing last method, require additional confirmation
		const activeMethods = await this.prisma.authenticationMethod.count({
			where: { userId: user.id, isActive: true },
		})

		if (activeMethods === 1 && !input.code) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.last_method_code_required', {
					lng,
					defaultValue: 'Code required to remove last 2FA method',
				}),
			)
		}

		// Delete method and backup codes
		await this.prisma.$transaction(async tx => {
			await tx.authenticationMethod.delete({
				where: { id: input.methodId },
			})

			await tx.backupCode.deleteMany({
				where: { authMethodId: input.methodId },
			})

			// If this was the last method, disable 2FA
			if (activeMethods === 1) {
				await tx.user.update({
					where: { id: user.id },
					data: {
						is2FAEnabled: false,
						preferred2FAMethod: null,
					},
				})
			}
		})

		// Log security event
		await this.securityEventService.logEvent({
			userId: user.id,
			event: activeMethods === 1 ? ESecurityEvent.TWO_FA_DISABLED : ESecurityEvent.TWO_FA_METHOD_REMOVED,
			severity: ESecuritySeverity.HIGH,
			metadata: { methodId: input.methodId, methodType: method.method, timestamp: new Date().toISOString() },
		})

		// ✅ NOTIFICATION CALL
		if (activeMethods === 1) {
			// Last method removed - 2FA completely disabled
			await this.notificationService.notify2FADisabled(user, lng)
		} else {
			await this.notificationService.notify2FAMethodRemoved(user, method.method, method.name, lng)
		}

		return { success: true }
	}

	/**
	 * Regenerate backup codes
	 */
	async regenerateBackupCodes(user: User, input: RegenerateBackupCodesInput, lng: Language) {
		// Verify password
		const isPasswordValid = await HashUtil.verify(user.password, input.password)
		if (!isPasswordValid) {
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.password.invalid', { lng, defaultValue: 'Invalid password' }),
			)
		}

		let backupCodes: string[]

		if (input.methodId) {
			const method = await this.prisma.authenticationMethod.findFirst({
				where: { id: input.methodId, userId: user.id },
			})

			if (!method) {
				throw new BadRequestException(
					this.i18n.t('auth.errors.2fa.method_not_found', { lng, defaultValue: 'Method not found' }),
				)
			}

			backupCodes = await this.backupCodeService.regenerateBackupCodes(user.id, method.method, method.id)
		} else {
			// Regenerate for all methods
			const methods = await this.prisma.authenticationMethod.findMany({
				where: { userId: user.id, isActive: true },
			})

			backupCodes = []
			for (const method of methods) {
				const codes = await this.backupCodeService.regenerateBackupCodes(user.id, method.method, method.id)
				backupCodes.push(...codes)
			}
		}

		// ✅ NOTIFICATION CALL
		await this.notificationService.notifyBackupCodesRegenerated(user, lng)

		await this.securityEventService.logEvent({
			userId: user.id,
			event: ESecurityEvent.TWO_FA_BACKUP_CODES_REGENERATED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: {
				methodId: input.methodId || 'all',
				methodType: 'BACKUP_CODE',
				timestamp: new Date().toISOString(),
			},
		})

		return {
			success: true,
			backupCodes,
			message: this.i18n.t('auth.setup.2fa.backup_codes_warning', {
				lng,
				defaultValue: 'Save these backup codes securely.',
			}),
		}
	}

	// ... (после regenerateBackupCodes)

	// ==================== Method Verification ====================

	/**
	 * Verifies a TOTP code against the encrypted secret.
	 * This method is public to be accessible from the resolver.
	 *
	 * @param email - User's email (for TOTP label).
	 * @param encryptedSecret - The encrypted secret from the database.
	 * @param code - The 6-digit code from the user.
	 * @returns {boolean} - True if the code is valid.
	 */
	public verifyTotpCode(email: string, encryptedSecret: string, code: string): boolean {
		try {
			const secret = EncryptionUtil.decrypt(encryptedSecret)
			const totp = this.createTOTP(email, secret) // createTOTP остается private
			const delta = totp.validate({ token: code, window: TOTP_CONFIG.WINDOW })
			return delta !== null
		} catch (error) {
			this.logger.error(`TOTP code verification failed: ${(error as Error).message}`)
			return false
		}
	}

	/**
	 * Verifies a one-time code (Email/SMS) against the value stored in Redis.
	 * This method is public to be accessible from the resolver.
	 *
	 * @param userId - The ID of the user.
	 * @param methodId - The ID of the OTP method being verified.
	 * @param code - The 6-digit code from the user.
	 * @param lng - The language for error messages.
	 * @returns {Promise<boolean>} - True if the code is valid.
	 */
	public async verifyOneTimeCode(userId: string, methodId: string, code: string, lng: Language): Promise<boolean> {
		const codeKey = REDIS_KEYS.OTP_CODE(userId)
		const cached = await this.rGetJSON<{ code: string; methodId: string; expiresAt: number }>(codeKey)

		if (!cached) {
			// Не выбрасываем ошибку здесь, чтобы резолвер мог обработать это как "неверный код"
			return false
		}

		// Проверяем, что код предназначен для этого метода
		if (cached.methodId !== methodId) {
			return false
		}

		const isValid = await HashUtil.verify(cached.code, code)
		if (isValid) {
			// Prevent code reuse by deleting it after successful verification.
			await this.rDel(codeKey)
		}
		return isValid
	}

	// ==================== Private Helpers ====================

	private async checkMethodLimits(userId: string, lng: Language): Promise<void> {
		const count = await this.prisma.authenticationMethod.count({
			where: { userId, isActive: true },
		})

		if (count >= TWO_FA_CONFIG.MAX_METHODS_PER_USER) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.max_methods', {
					lng,
					defaultValue: `Maximum ${TWO_FA_CONFIG.MAX_METHODS_PER_USER} methods allowed`,
					max: TWO_FA_CONFIG.MAX_METHODS_PER_USER,
				}),
			)
		}
	}

	private generateTotpSecret(): string {
		return encode(randomBytes(15)).replace(/=/g, '').substring(0, TOTP_CONFIG.SECRET_LENGTH)
	}

	private createTOTP(email: string, secret: string): TOTP {
		return new TOTP({
			issuer: APP_NAME,
			label: email,
			algorithm: TOTP_CONFIG.ALGORITHM,
			digits: TOTP_CONFIG.DIGITS,
			period: TOTP_CONFIG.PERIOD,
			secret,
		})
	}

	private generateOtpCode(): string {
		return Math.floor(100000 + Math.random() * 900000).toString()
	}
}

```




`src/modules/auth/2fa/services/admin-2fa.service.ts`


```typescript
/**
 * Service handling administrative 2FA operations.
 * All operations are heavily audited for security compliance.
 */
@Injectable()
export class AdminTwoFactorService extends CoreService {
	private readonly logger = new Logger(AdminTwoFactorService.name)

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly securityEventService: SecurityEventService,
		private readonly deviceTrustService: DeviceTrustService,
		private readonly notificationService: NotificationService,
	) {
		super(i18n, prisma, redis)
	}

	/**
	 * Disable 2FA for a user (emergency access)
	 */
	async disableUser2FA(adminUser: User, input: DisableUser2FAInput): Promise<AdminActionSuccessModel> {
		// Verify target user exists
		const targetUser = await this.prisma.user.findUnique({
			where: { id: input.userId },
			select: {
				id: true,
				email: true,
				is2FAEnabled: true,
				preferred2FAMethod: true,
			},
		})

		if (!targetUser) {
			throw new NotFoundException('User not found')
		}

		if (!targetUser.is2FAEnabled) {
			return {
				success: true,
				message: 'User does not have 2FA enabled',
				affectedUserId: input.userId,
			}
		}

		// Start transaction
		const result = await this.prisma.$transaction(async tx => {
			// 1. Disable 2FA on user
			await tx.user.update({
				where: { id: input.userId },
				data: {
					is2FAEnabled: false,
					preferred2FAMethod: null,
				},
			})

			// 2. Deactivate all authentication methods
			await tx.authenticationMethod.updateMany({
				where: { userId: input.userId },
				data: { isActive: false },
			})

			// 3. Delete all backup codes
			await tx.backupCode.deleteMany({
				where: { userId: input.userId },
			})

			// 4. Create audit log
			const auditLog = await tx.auditLog.create({
				data: {
					userId: adminUser.id,
					action: 'ADMIN_DISABLED_USER_2FA',
					category: EAuditCategory.ADMIN,
					success: true,
					metadata: {
						targetUserId: input.userId,
						targetEmail: targetUser.email,
						reason: input.reason,
						previousMethod: targetUser.preferred2FAMethod,
						timestamp: new Date().toISOString(),
					} as Prisma.InputJsonValue,
				},
			})

			// 5. Create security event for target user
			await tx.securityEvent.create({
				data: {
					userId: input.userId,
					event: ESecurityEvent.TWO_FA_DISABLED,
					severity: ESecuritySeverity.CRITICAL,
					metadata: {
						timestamp: new Date().toISOString(),
						adminId: adminUser.id,
						adminEmail: adminUser.email,
						reason: input.reason,
						targetUserId: input.userId,
						targetEmail: targetUser.email,
						disabledBy: adminUser.email,
					} as IAdminActionMetadata as Prisma.InputJsonValue,
				},
			})

			return auditLog
		})

		// Log admin action
		this.logger.warn(`Admin ${adminUser.email} disabled 2FA for user ${targetUser.email}. Reason: ${input.reason}`)

		if (input.notifyUser) {
			await this.notificationService.notify2FADisabledByAdmin(targetUser as User, adminUser.email, input.reason)
		}

		return {
			success: true,
			message: `2FA disabled for user ${targetUser.email}`,
			affectedUserId: input.userId,
			auditLogId: result.id,
		}
	}

	/**
	 * Get comprehensive 2FA status for a user
	 */
	async getUser2FAStatus(userId: string): Promise<User2FAStatusModel> {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				email: true,
				is2FAEnabled: true,
				preferred2FAMethod: true,
				riskScore: true,
			},
		})

		if (!user) {
			throw new NotFoundException('User not found')
		}

		// Get authentication methods
		const methods = await this.prisma.authenticationMethod.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
		})

		// Get trusted devices
		const devices = await this.deviceTrustService.getUserDevices(userId)

		// Count remaining backup codes
		const backupCodesRemaining = await this.prisma.backupCode.count({
			where: {
				userId,
				usedAt: null,
				OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
			},
		})

		// Get recent security events
		const recentEvents = await this.securityEventService.getEvents({
			userId,
			limit: 10,
		})

		return {
			userId: user.id,
			email: user.email,
			is2FAEnabled: user.is2FAEnabled,
			preferred2FAMethod: user.preferred2FAMethod,
			methods: methods.map(m => ({
				id: m.id,
				method: m.method,
				name: m.name,
				isActive: m.isActive,
				isPrimary: m.isPrimary,
				lastUsedAt: m.lastUsedAt,
				useCount: m.useCount,
				createdAt: m.createdAt,
			})),
			trustedDevices: devices.map(d => ({
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
			})),
			backupCodesRemaining,
			riskScore: user.riskScore,
			recentEvents: recentEvents.map(e => ({
				id: e.id,
				event: e.event,
				severity: e.severity,
				ip: e.ip,
				country: e.country,
				city: e.city,
				resolved: e.resolved,
				createdAt: e.createdAt,
			})),
		}
	}

	/**
	 * Revoke a specific device for a user
	 */
	async revokeUserDevice(adminUser: User, input: RevokeUserDeviceInput): Promise<AdminActionSuccessModel> {
		// Verify device exists
		const device = await this.prisma.trustedDevice.findFirst({
			where: {
				userId: input.userId,
				deviceId: input.deviceId,
			},
		})

		if (!device) {
			throw new NotFoundException('Device not found')
		}

		// Revoke the device
		await this.deviceTrustService.revokeDevice(input.userId, input.deviceId)

		// Create audit log
		const auditLog = await this.prisma.auditLog.create({
			data: {
				userId: adminUser.id,
				action: 'ADMIN_REVOKED_USER_DEVICE',
				category: EAuditCategory.ADMIN,
				success: true,
				metadata: {
					targetUserId: input.userId,
					deviceId: input.deviceId,
					deviceName: device.name,
					reason: input.reason,
					timestamp: new Date().toISOString(),
				} as Prisma.InputJsonValue,
			},
		})

		// Log security event
		await this.securityEventService.logEvent({
			userId: input.userId,
			event: ESecurityEvent.DEVICE_REVOKED,
			severity: ESecuritySeverity.HIGH,
			metadata: {
				timestamp: new Date().toISOString(),
				adminId: adminUser.id,
				adminEmail: adminUser.email,
				deviceId: input.deviceId,
				reason: input.reason,
				revokedBy: adminUser.email,
			} as IAdminActionMetadata,
		})

		this.logger.warn(
			`Admin ${adminUser.email} revoked device ${input.deviceId} for user ${input.userId}. Reason: ${input.reason}`,
		)

		const user = await this.prisma.user.findUnique({ where: { id: input.userId } })
		if (user) {
			await this.notificationService.notifyDeviceRevokedByAdmin(
				user,
				device.name || input.deviceId,
				adminUser.email,
				input.reason,
				'en',
			)
		}

		return {
			success: true,
			message: `Device ${device.name || input.deviceId} revoked successfully`,
			affectedUserId: input.userId,
			auditLogId: auditLog.id,
		}
	}

	/**
	 * Revoke all devices for a user (emergency)
	 */
	async revokeAllUserDevices(adminUser: User, input: RevokeAllUserDevicesInput): Promise<AdminActionSuccessModel> {
		// Get all devices
		const devices = await this.deviceTrustService.getUserDevices(input.userId)

		if (devices.length === 0) {
			return {
				success: true,
				message: 'User has no active devices',
				affectedUserId: input.userId,
			}
		}

		// Revoke all devices
		await this.prisma.$transaction(async tx => {
			// 1. Mark all devices as revoked
			await tx.trustedDevice.updateMany({
				where: { userId: input.userId },
				data: {
					isActive: false,
					revokedAt: new Date(),
				},
			})

			// 2. Invalidate all sessions
			await tx.session.updateMany({
				where: { userId: input.userId },
				data: { revokedAt: new Date() },
			})

			// 3. Create audit log
			await tx.auditLog.create({
				data: {
					userId: adminUser.id,
					action: 'ADMIN_REVOKED_ALL_USER_DEVICES',
					category: EAuditCategory.ADMIN,
					success: true,
					metadata: {
						targetUserId: input.userId,
						devicesRevoked: devices.length,
						reason: input.reason,
						timestamp: new Date().toISOString(),
					} as Prisma.InputJsonValue,
				},
			})
		})

		// Log security event
		await this.securityEventService.logEvent({
			userId: input.userId,
			event: ESecurityEvent.DEVICE_REVOKED,
			severity: ESecuritySeverity.CRITICAL,
			metadata: {
				timestamp: new Date().toISOString(),
				adminId: adminUser.id,
				adminEmail: adminUser.email,
				reason: input.reason,
				devicesRevoked: devices.length,
				allDevices: true,
				revokedBy: adminUser.email,
			} as IAdminActionMetadata,
		})

		this.logger.warn(
			`Admin ${adminUser.email} revoked ALL ${devices.length} devices for user ${input.userId}. Reason: ${input.reason}`,
		)

		return {
			success: true,
			message: `All ${devices.length} devices revoked successfully`,
			affectedUserId: input.userId,
		}
	}

	/**
	 * Get security events for a user
	 */
	async getUserSecurityEvents(input: GetUserSecurityEventsInput) {
		return this.securityEventService.getEvents({
			userId: input.userId,
			events: input.events,
			severities: input.severities,
			limit: input.limit || 50,
		})
	}
}

```




`src/modules/auth/2fa/services/backup-code.service.ts`


```typescript
/**
 * Backup Code Service
 * Manages generation, validation, and lifecycle of backup codes
 */
@Injectable()
export class BackupCodeService extends CoreService {
	private readonly logger = new Logger(BackupCodeService.name)

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly notificationService: NotificationService,
	) {
		super(i18n, prisma, redis)
	}

	/**
	 * Generate backup codes for a 2FA method
	 * @param userId User ID
	 * @param methodType 2FA method type
	 * @param authMethodId Optional specific auth method ID
	 * @returns Array of plain text backup codes (show only once!)
	 */
	async generateBackupCodes(userId: string, methodType: E2FAMethod, authMethodId?: string): Promise<string[]> {
		const codes = this.generateCodes()
		const hashedCodes = await Promise.all(codes.map(code => HashUtil.hash(code)))

		const expiresAt = BACKUP_CODE_CONFIG.EXPIRY_DAYS
			? new Date(Date.now() + BACKUP_CODE_CONFIG.EXPIRY_DAYS * 24 * 60 * 60 * 1000)
			: null

		await this.prisma.backupCode.createMany({
			data: hashedCodes.map(hash => ({
				userId,
				authMethodId: authMethodId || null,
				type: methodType,
				code: hash,
				expiresAt,
			})),
		})

		this.logger.log(`Generated ${codes.length} backup codes for user ${userId}, method ${methodType}`)

		return codes
	}

	/**
	 * Generate random backup codes
	 */
	private generateCodes(): string[] {
		const codes: string[] = []
		const format = BACKUP_CODE_CONFIG.FORMAT

		for (let i = 0; i < BACKUP_CODE_CONFIG.COUNT; i++) {
			const code = randomBytes(BACKUP_CODE_CONFIG.BYTES).toString('hex').toUpperCase()

			if (format === 'HEX') {
				codes.push(code)
			} else if (format === 'BASE32') {
				// Convert to base32 if needed
				codes.push(this.toBase32(code))
			} else {
				// Numeric format
				const numeric = parseInt(code, 16).toString().slice(0, 8)
				codes.push(numeric.padStart(8, '0'))
			}
		}

		return codes
	}

	/**
	 * Simple hex to base32 conversion
	 */
	private toBase32(hex: string): string {
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
		let bits = ''
		let result = ''

		for (const char of hex) {
			bits += parseInt(char, 16).toString(2).padStart(4, '0')
		}

		for (let i = 0; i < bits.length; i += 5) {
			const chunk = bits.slice(i, i + 5).padEnd(5, '0')
			result += alphabet[parseInt(chunk, 2)]
		}

		return result.slice(0, 8)
	}

	/**
	 * Verify backup code
	 * @param user User object
	 * @param code Plain text backup code
	 * @param methodType 2FA method type
	 * @param lng Language for error messages
	 * @param ip Optional IP address for auditing
	 * @returns true if valid
	 */
	async verifyBackupCode(
		user: User,
		code: string,
		methodType: E2FAMethod,
		lng: Language,
		ip?: string,
	): Promise<boolean> {
		const normalizedCode = code.replace(/\s/g, '').toUpperCase()

		// Find unused backup codes for this user and method
		const backupCodes = await this.prisma.backupCode.findMany({
			where: {
				userId: user.id,
				type: methodType,
				usedAt: null,
				OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
			},
		})

		if (backupCodes.length === 0) {
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.2fa.no_backup_codes', {
					lng,
					defaultValue: 'No valid backup codes available',
				}),
			)
		}

		// Try to find matching code
		for (const backup of backupCodes) {
			const isMatch = await HashUtil.verify(backup.code, normalizedCode)

			if (isMatch) {
				// Mark as used
				await this.prisma.backupCode.update({
					where: { id: backup.id },
					data: {
						usedAt: new Date(),
						usedIp: ip, // Assuming you pass IP to this method
					},
				})
				this.logger.log(`Backup code used for user ${user.id}, method ${methodType}`)

				// Warn if running low
				const remaining = backupCodes.length - 1
				if (remaining <= BACKUP_CODE_CONFIG.LOW_CODES_THRESHOLD) {
					this.logger.warn(`User ${user.id} has only ${remaining} backup codes remaining`)
					// ✅ NOTIFICATION CALL
					await this.notificationService.notifyLowBackupCodes(user, remaining, lng)
				}

				return true
			}
		}

		throw new UnauthorizedException(
			this.i18n.t('auth.errors.2fa.invalid_backup_code', {
				lng,
				defaultValue: 'Invalid or already used backup code',
			}),
		)
	}

	/**
	 * Get backup codes status
	 */
	async getBackupCodesStatus(userId: string, methodType: E2FAMethod) {
		const total = await this.prisma.backupCode.count({
			where: {
				userId,
				type: methodType,
			},
		})

		const used = await this.prisma.backupCode.count({
			where: {
				userId,
				type: methodType,
				usedAt: { not: null },
			},
		})

		const expired = await this.prisma.backupCode.count({
			where: {
				userId,
				type: methodType,
				expiresAt: { lt: new Date() },
				usedAt: null,
			},
		})

		return {
			total,
			used,
			remaining: total - used - expired,
			expired,
		}
	}

	/**
	 * Regenerate backup codes (delete old, create new)
	 */
	async regenerateBackupCodes(userId: string, methodType: E2FAMethod, authMethodId?: string): Promise<string[]> {
		await this.prisma.backupCode.deleteMany({
			where: {
				userId,
				type: methodType,
				authMethodId: authMethodId || null,
			},
		})

		return this.generateBackupCodes(userId, methodType, authMethodId)
	}

	/**
	 * Delete all backup codes for user/method
	 */
	async deleteBackupCodes(userId: string, methodType: E2FAMethod): Promise<void> {
		await this.prisma.backupCode.deleteMany({
			where: {
				userId,
				type: methodType,
			},
		})

		this.logger.log(`Deleted all backup codes for user ${userId}, method ${methodType}`)
	}

	/**
	 * Cleanup expired backup codes (cron job)
	 * Returns metrics about the cleanup operation
	 */
	async cleanupExpiredCodes(): Promise<{ deleted: number; affected: number }> {
		// First, get count for metrics
		const expiredCodes = await this.prisma.backupCode.findMany({
			where: {
				expiresAt: { lt: new Date() },
				usedAt: null, // Don't delete already used codes for audit trail
			},
			select: {
				userId: true,
			},
		})

		const affectedUserIds = new Set(expiredCodes.map(c => c.userId))

		// Delete expired codes
		const result = await this.prisma.backupCode.deleteMany({
			where: {
				expiresAt: { lt: new Date() },
				usedAt: null,
			},
		})

		this.logger.log(`Cleaned up ${result.count} expired backup codes affecting ${affectedUserIds.size} users`)

		return {
			deleted: result.count,
			affected: affectedUserIds.size,
		}
	}
}

```




`src/modules/auth/2fa/services/device-trust.service.ts`


```typescript
/**
 * Device Trust Service
 * Manages trusted devices and calculates trust scores
 */
@Injectable()
export class DeviceTrustService extends CoreService {
	private readonly logger = new Logger(DeviceTrustService.name)

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly notificationService: NotificationService,
	) {
		super(i18n, prisma, redis)
	}

	/**
	 * Register or update a device
	 * @param userId User ID
	 * @param session Session metadata
	 * @param fingerprint Optional full fingerprint
	 * @param name Optional user-provided device name
	 * @returns Device ID
	 */
	async registerDevice(
		userId: string,
		session: ISessionMetadata,
		lng: Language,
		fingerprint?: IDeviceFingerprint,
		name?: string,
	): Promise<string> {
		// Generate device ID from fingerprint or session data
		const deviceId = fingerprint
			? FingerprintUtil.generateDeviceId(fingerprint)
			: FingerprintUtil.generateQuickDeviceId(
					`${session.device.browser}:${session.device.os}:${session.device.type}`,
					session.ip,
				)

		// Check if device already exists
		const existing = await this.prisma.trustedDevice.findUnique({
			where: { deviceId },
		})

		if (existing) {
			// Update last seen
			await this.prisma.trustedDevice.update({
				where: { id: existing.id },
				data: {
					lastSeenAt: new Date(),
					lastIp: session.ip,
					lastCountry: session.location.country,
					lastCity: session.location.city,
				},
			})

			return deviceId
		}

		// Create new device
		const expiresAt = addSeconds(new Date(), DEVICE_LIFETIME.DEFAULT_DURATION)

		await this.prisma.trustedDevice.create({
			data: {
				userId,
				deviceId,
				fingerprint: (fingerprint || {}) as Prisma.InputJsonValue,
				name,
				userAgent: `${session.device.browser} on ${session.device.os}`,
				browser: session.device.browser,
				os: session.device.os,
				device: session.device.type,
				trustScore: DEVICE_TRUST.INITIAL_SCORE,
				lastIp: session.ip,
				lastCountry: session.location.country,
				lastCity: session.location.city,
				expiresAt,
			},
		})

		this.logger.log(`Registered new device ${deviceId} for user ${userId}`)

		// ✅ NOTIFICATION CALL (just for new devices)
		const user = await this.prisma.user.findUnique({ where: { id: userId } })
		if (user) {
			await this.notificationService.notifyNewDeviceLogin(user, session, lng)
		}

		return deviceId
	}

	/**
	 * Get device by ID
	 */
	async getDevice(deviceId: string) {
		return this.prisma.trustedDevice.findUnique({
			where: { deviceId },
		})
	}

	/**
	 * Get all devices for user
	 */
	async getUserDevices(userId: string) {
		return this.prisma.trustedDevice.findMany({
			where: {
				userId,
				isActive: true,
				OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
			},
			orderBy: { lastSeenAt: 'desc' },
		})
	}

	/**
	 * Calculate trust score for a device
	 * @param deviceId Device ID
	 * @returns Trust score (0-100)
	 */
	async calculateTrustScore(deviceId: string): Promise<number> {
		const device = await this.getDevice(deviceId)
		if (!device) return 0

		const factors = await this.getTrustFactors(device.userId, deviceId)
		let score: number = DEVICE_TRUST.INITIAL_SCORE

		// Increase score for successful logins
		score += Math.min(factors.successfulLogins * DEVICE_TRUST.SUCCESS_INCREMENT, 40)

		// Decrease for failed attempts
		score -= factors.failedAttempts * DEVICE_TRUST.FAILURE_DECREMENT

		// Bonus for explicitly trusted devices
		if (factors.explicitlyTrusted) {
			score += 20
		}

		// Bonus for long-term devices
		if (factors.daysSinceFirstSeen > 90) {
			score += 15
		} else if (factors.daysSinceFirstSeen > 30) {
			score += 10
		}

		// Bonus for location consistency
		score += factors.locationConsistency * 0.1

		// Apply decay for inactivity
		if (factors.daysSinceFirstSeen > DEVICE_TRUST.DECAY_GRACE_PERIOD) {
			const inactiveDays = factors.daysSinceFirstSeen - DEVICE_TRUST.DECAY_GRACE_PERIOD
			score -= inactiveDays * DEVICE_TRUST.DECAY_PER_DAY
		}

		// Clamp to valid range
		score = Math.max(DEVICE_TRUST.MIN_SCORE, Math.min(DEVICE_TRUST.MAX_SCORE, score))

		// Update in database
		await this.prisma.trustedDevice.update({
			where: { deviceId },
			data: { trustScore: score },
		})

		// Cache in Redis
		await this.rSet(DEVICE_REDIS_KEYS.TRUST_SCORE(device.userId, deviceId), score.toString(), 3600)

		return score
	}

	/**
	 * Get trust factors for score calculation
	 */
	private async getTrustFactors(userId: string, deviceId: string): Promise<IDeviceTrustFactors> {
		const device = await this.getDevice(deviceId)
		if (!device) {
			return {
				successfulLogins: 0,
				failedAttempts: 0,
				daysSinceFirstSeen: 0,
				locationConsistency: 0,
				timePatternConsistency: 0,
				explicitlyTrusted: false,
			}
		}

		// Count successful sessions from this device
		const successfulLogins = await this.prisma.session.count({
			where: {
				userId,
				deviceId,
				revokedAt: null,
			},
		})

		// Count failed login attempts (from audit logs)
		const failedAttempts = await this.prisma.auditLog.count({
			where: {
				userId,
				action: 'LOGIN_FAILED',
				success: false,
				metadata: {
					path: ['deviceId'],
					equals: deviceId,
				},
			},
		})

		const daysSinceFirstSeen = Math.floor((Date.now() - device.createdAt.getTime()) / (1000 * 60 * 60 * 24))

		// Calculate location consistency (same country/city)
		const sessions = await this.prisma.session.findMany({
			where: { userId, deviceId },
			select: { country: true, city: true },
			take: 20,
		})

		const uniqueCountries = new Set(sessions.map(s => s.country)).size
		const locationConsistency = sessions.length > 0 ? (1 - uniqueCountries / sessions.length) * 100 : 0

		return {
			successfulLogins,
			failedAttempts,
			daysSinceFirstSeen,
			locationConsistency,
			timePatternConsistency: 0,
			explicitlyTrusted: device.trustScore >= DEVICE_TRUST.TRUST_THRESHOLD,
		}
	}

	/**
	 * Check if device is trusted
	 */
	async isTrusted(deviceId: string): Promise<boolean> {
		const device = await this.getDevice(deviceId)
		if (!device || !device.isActive) return false
		if (device.expiresAt && device.expiresAt < new Date()) return false
		if (device.revokedAt) return false

		return device.trustScore >= DEVICE_TRUST.TRUST_THRESHOLD
	}

	/**
	 * Mark device as explicitly trusted by user
	 */
	async trustDevice(userId: string, deviceId: string, duration?: number): Promise<void> {
		const expiresAt = duration
			? addSeconds(new Date(), duration)
			: addSeconds(new Date(), DEVICE_LIFETIME.DEFAULT_DURATION)

		await this.prisma.trustedDevice.updateMany({
			where: { userId, deviceId },
			data: {
				trustScore: DEVICE_TRUST.MAX_SCORE,
				expiresAt,
			},
		})

		this.logger.log(`Device ${deviceId} explicitly trusted by user ${userId}`)
	}

	/**
	 * Revoke trust for a device
	 */
	async revokeDevice(userId: string, deviceId: string): Promise<void> {
		await this.prisma.trustedDevice.updateMany({
			where: { userId, deviceId },
			data: {
				isActive: false,
				revokedAt: new Date(),
			},
		})

		// Invalidate all sessions from this device
		await this.prisma.session.updateMany({
			where: { userId, deviceId },
			data: { revokedAt: new Date() },
		})

		this.logger.warn(`Device ${deviceId} revoked for user ${userId}`)
	}

	/**
	 * Get trust level enum from score
	 */
	getTrustLevel(score: number): EDeviceTrustLevel {
		if (score >= 75) return EDeviceTrustLevel.VERIFIED
		if (score >= 50) return EDeviceTrustLevel.TRUSTED
		if (score >= 25) return EDeviceTrustLevel.PARTIAL
		if (score > 0) return EDeviceTrustLevel.RECOGNIZED
		return EDeviceTrustLevel.UNKNOWN
	}

	/**
	 * Cleanup old/expired devices (cron job)
	 * Returns metrics about the cleanup operation
	 */
	async cleanupDevices(): Promise<{ deleted: number; sessionsInvalidated: number }> {
		const cutoffDate = new Date(Date.now() - DEVICE_LIMITS.CLEANUP_AFTER_DAYS * 24 * 60 * 60 * 1000)

		// Get devices to be deleted for metrics
		const devicesToDelete = await this.prisma.trustedDevice.findMany({
			where: {
				OR: [
					{ expiresAt: { lt: new Date() } },
					{ lastSeenAt: { lt: cutoffDate } },
					{
						isActive: false,
						revokedAt: { lt: cutoffDate },
					},
				],
			},
			select: {
				deviceId: true,
				userId: true,
			},
		})

		const deviceIds = devicesToDelete.map(d => d.deviceId)

		// Invalidate sessions from these devices
		const sessionsResult = await this.prisma.session.updateMany({
			where: {
				deviceId: { in: deviceIds },
				revokedAt: null,
			},
			data: {
				revokedAt: new Date(),
			},
		})

		// Delete the devices
		const devicesResult = await this.prisma.trustedDevice.deleteMany({
			where: {
				OR: [
					{ expiresAt: { lt: new Date() } },
					{ lastSeenAt: { lt: cutoffDate } },
					{
						isActive: false,
						revokedAt: { lt: cutoffDate },
					},
				],
			},
		})

		this.logger.log(
			`Cleaned up ${devicesResult.count} old devices and invalidated ${sessionsResult.count} sessions`,
		)

		return {
			deleted: devicesResult.count,
			sessionsInvalidated: sessionsResult.count,
		}
	}

	/**
	 * Enforce device limits per user
	 */
	async enforceDeviceLimits(userId: string): Promise<void> {
		const devices = await this.prisma.trustedDevice.findMany({
			where: { userId, isActive: true },
			orderBy: { lastSeenAt: 'desc' },
		})

		if (devices.length > DEVICE_LIMITS.MAX_TRUSTED_DEVICES) {
			const toRevoke = devices.slice(DEVICE_LIMITS.MAX_TRUSTED_DEVICES)

			for (const device of toRevoke) {
				await this.revokeDevice(userId, device.deviceId)
			}

			this.logger.log(`Revoked ${toRevoke.length} devices for user ${userId} (limit exceeded)`)
		}
	}

	/**
	 * Enforce device limits for all users
	 * Returns metrics about enforcement actions
	 */
	async enforceAllUsersDeviceLimits(): Promise<{
		usersChecked: number
		usersAffected: number
		devicesRevoked: number
	}> {
		// Get all users with their device counts
		const usersWithDevices = await this.prisma.user.findMany({
			where: {
				trustedDevices: {
					some: {
						isActive: true,
					},
				},
			},
			select: {
				id: true,
				email: true,
				trustedDevices: {
					where: { isActive: true },
					orderBy: { lastSeenAt: 'desc' },
					select: {
						id: true,
						deviceId: true,
						lastSeenAt: true,
					},
				},
			},
		})

		let usersAffected = 0
		let totalDevicesRevoked = 0

		for (const user of usersWithDevices) {
			if (user.trustedDevices.length > DEVICE_LIMITS.MAX_TRUSTED_DEVICES) {
				const devicesToRevoke = user.trustedDevices.slice(DEVICE_LIMITS.MAX_TRUSTED_DEVICES)

				for (const device of devicesToRevoke) {
					await this.revokeDevice(user.id, device.deviceId)
					totalDevicesRevoked++
				}

				usersAffected++

				this.logger.warn(
					`User ${user.email} exceeded device limit. Revoked ${devicesToRevoke.length} oldest devices`,
				)
			}
		}

		return {
			usersChecked: usersWithDevices.length,
			usersAffected,
			devicesRevoked: totalDevicesRevoked,
		}
	}
}

```




`src/modules/auth/2fa/services/index.ts`


```typescript
export * from './security-event.service'
export * from './backup-code.service'
export * from './device-trust.service'
export * from './2fa-method.service'
export * from './admin-2fa.service'
export * from './2fa-cron.service'
export * from './webauthn.service'

```




`src/modules/auth/2fa/services/security-event.service.ts`


```typescript
/**
 * Security Event Service
 * Centralized logging and management of security events
 */
@Injectable()
export class SecurityEventService extends CoreService {
	private readonly logger = new Logger(SecurityEventService.name)

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly notificationService: NotificationService,
	) {
		super(i18n, prisma, redis)
	}

	/**
	 * Log a security event
	 * @param input Event data
	 */
	async logEvent(input: ICreateSecurityEventInput): Promise<void> {
		try {
			await this.prisma.securityEvent.create({
				data: {
					userId: input.userId,
					event: input.event,
					severity: input.severity,
					ip: input.metadata.ip,
					userAgent: input.metadata.userAgent,
					country: input.metadata.country,
					city: input.metadata.city,
					deviceId: input.metadata.deviceId,
					riskScore: input.riskScore,
					riskFactors: input.riskFactors as Prisma.JsonValue,
					metadata: input.metadata as unknown as Prisma.JsonObject,
				},
			})

			// Log to application logger for critical events
			if (input.severity === ESecuritySeverity.CRITICAL || input.severity === ESecuritySeverity.HIGH) {
				this.logger.warn(
					`Security event [${input.severity}]: ${input.event} for user ${input.userId}`,
					input.metadata,
				)
			}

			// Also log to audit log for compliance
			await this.prisma.auditLog.create({
				data: {
					userId: input.userId,
					action: input.event,
					category: EAuditCategory.SECURITY,
					success: input.severity !== ESecuritySeverity.CRITICAL,
					ip: input.metadata.ip,
					userAgent: input.metadata.userAgent,
					country: input.metadata.country,
					city: input.metadata.city,
					metadata: input.metadata as unknown as Prisma.JsonObject,
				},
			})
		} catch (error) {
			this.logger.error(`Failed to log security event: ${(error as Error).message}`, error)
			// Don't throw - logging failure shouldn't break the flow
		}
	}

	/**
	 * Log successful login
	 */
	async logLoginSuccess(userId: string, session: ISessionMetadata, riskScore?: number): Promise<void> {
		await this.logEvent({
			userId,
			event: ESecurityEvent.LOGIN_SUCCESS,
			severity: ESecuritySeverity.LOW,
			metadata: {
				timestamp: new Date().toISOString(),
				ip: session.ip,
				userAgent: `${session.device.browser} on ${session.device.os}`,
				country: session.location.country,
				city: session.location.city,
			},
			riskScore,
		})
	}

	/**
	 * Log failed login attempt
	 */
	async logLoginFailed(userId: string, session: ISessionMetadata, reason: string, riskScore?: number): Promise<void> {
		await this.logEvent({
			userId,
			event: ESecurityEvent.LOGIN_FAILED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: {
				timestamp: new Date().toISOString(),
				ip: session.ip,
				userAgent: `${session.device.browser} on ${session.device.os}`,
				country: session.location.country,
				city: session.location.city,
				reason,
			},
			riskScore,
		})
	}

	/**
	 * Log 2FA verification success
	 */
	async log2FASuccess(userId: string, methodType: string, session: ISessionMetadata): Promise<void> {
		await this.logEvent({
			userId,
			event: ESecurityEvent.TWO_FA_VERIFIED,
			severity: ESecuritySeverity.LOW,
			metadata: {
				timestamp: new Date().toISOString(),
				methodType,
				ip: session.ip,
				userAgent: `${session.device.browser} on ${session.device.os}`,
				country: session.location.country,
				city: session.location.city,
			},
		})
	}

	/**
	 * Log 2FA verification failure
	 */
	async log2FAFailed(userId: string, methodType: string, session: ISessionMetadata, attempts: number): Promise<void> {
		const severity = attempts >= 3 ? ESecuritySeverity.HIGH : ESecuritySeverity.MEDIUM

		await this.logEvent({
			userId,
			event: ESecurityEvent.TWO_FA_FAILED,
			severity,
			metadata: {
				timestamp: new Date().toISOString(),
				methodType,
				attempts,
				ip: session.ip,
				userAgent: `${session.device.browser} on ${session.device.os}`,
				country: session.location.country,
				city: session.location.city,
			},
		})
	}

	/**
	 * Log suspicious activity
	 */
	async logSuspiciousActivity(
		userId: string,
		session: ISessionMetadata,
		reason: string,
		riskScore: number,
		lng: Language,
	): Promise<void> {
		await this.logEvent({
			userId,
			event: ESecurityEvent.SUSPICIOUS_LOGIN,
			severity: ESecuritySeverity.HIGH,
			metadata: {
				timestamp: new Date().toISOString(),
				reason,
				ip: session.ip,
				userAgent: `${session.device.browser} on ${session.device.os}`,
				country: session.location.country,
				city: session.location.city,
			},
			riskScore,
		})

		const user = await this.prisma.user.findUnique({ where: { id: userId } })
		if (user) {
			await this.notificationService.notifySuspiciousActivity(user, reason, riskScore, lng)
		}
	}

	/**
	 * Get security events for user
	 */
	async getEvents(filter: ISecurityEventFilter) {
		const where: Prisma.SecurityEventWhereInput = {}

		if (filter.userId) where.userId = filter.userId
		if (filter.events) where.event = { in: filter.events }
		if (filter.severities) where.severity = { in: filter.severities }
		if (filter.resolved !== undefined) where.resolved = filter.resolved

		if (filter.dateFrom || filter.dateTo) {
			where.createdAt = {}
			if (filter.dateFrom) where.createdAt.gte = filter.dateFrom
			if (filter.dateTo) where.createdAt.lte = filter.dateTo
		}

		return this.prisma.securityEvent.findMany({
			where,
			take: filter.limit || 50,
			skip: filter.offset || 0,
			orderBy: { createdAt: 'desc' },
		})
	}

	/**
	 * Mark event as resolved
	 */
	async resolveEvent(eventId: string, resolvedBy: string): Promise<void> {
		await this.prisma.securityEvent.update({
			where: { id: eventId },
			data: {
				resolved: true,
				resolvedAt: new Date(),
				resolvedBy,
			},
		})
	}

	/**
	 * Get unresolved high-severity events
	 */
	async getUnresolvedCriticalEvents(userId?: string) {
		return this.prisma.securityEvent.findMany({
			where: {
				userId,
				resolved: false,
				severity: { in: [ESecuritySeverity.HIGH, ESecuritySeverity.CRITICAL] },
			},
			orderBy: { createdAt: 'desc' },
			take: 20,
		})
	}

	/**
	 * Archive old security events
	 * Moves old events to archive table or deletes based on retention policy
	 */
	async archiveOldEvents(): Promise<{ archived: number; deleted: number }> {
		const retentionDays = parseInt(process.env.SECURITY_EVENTS_RETENTION_DAYS || '90')
		const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000)

		// For now, we'll just delete old resolved events
		// In production, you might want to move them to an archive table first

		// Delete old resolved events
		const deletedResolved = await this.prisma.securityEvent.deleteMany({
			where: {
				createdAt: { lt: cutoffDate },
				resolved: true,
			},
		})

		// Keep unresolved events for longer (double retention)
		const extendedCutoff = new Date(Date.now() - retentionDays * 2 * 24 * 60 * 60 * 1000)
		const deletedUnresolved = await this.prisma.securityEvent.deleteMany({
			where: {
				createdAt: { lt: extendedCutoff },
				resolved: false,
				severity: { in: [ESecuritySeverity.LOW, ESecuritySeverity.MEDIUM] },
			},
		})

		const totalDeleted = deletedResolved.count + deletedUnresolved.count

		this.logger.log(
			`Archived/deleted ${totalDeleted} old security events ` +
				`(${deletedResolved.count} resolved, ${deletedUnresolved.count} unresolved)`,
		)

		return {
			archived: 0, // Would be used if we implement archiving
			deleted: totalDeleted,
		}
	}
}

```




`src/modules/auth/2fa/services/webauthn.service.ts`


```typescript
/**
 * Service handling WebAuthn/FIDO2 operations for passwordless authentication
 * and hardware security keys support.
 */
@Injectable()
export class WebAuthnService extends CoreService {
	private readonly logger = new Logger(WebAuthnService.name)

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly backupCodeService: BackupCodeService,
		private readonly securityEventService: SecurityEventService,
	) {
		super(i18n, prisma, redis)
	}

	/**
	 * Generate registration options for new WebAuthn credential
	 */
	async generateRegistrationOptions(
		user: User,
		authenticatorAttachment?: 'platform' | 'cross-platform',
		lng: Language = 'en',
	): Promise<{
		challengeId: string
		options: any // Use any for GraphQL compatibility
	}> {
		// Check credential limit
		const credentialCount = await this.prisma.authenticationMethod.count({
			where: {
				userId: user.id,
				method: { in: [E2FAMethod.WEBAUTHN, E2FAMethod.PASSKEY] },
				isActive: true,
			},
		})

		if (credentialCount >= WEBAUTHN_STORAGE.MAX_CREDENTIALS_PER_USER) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.max_credentials', {
					lng,
					max: WEBAUTHN_STORAGE.MAX_CREDENTIALS_PER_USER,
					defaultValue: `Maximum ${WEBAUTHN_STORAGE.MAX_CREDENTIALS_PER_USER} credentials allowed`,
				}),
			)
		}

		// Get existing credentials to exclude
		const existingCredentials = await this.prisma.authenticationMethod.findMany({
			where: {
				userId: user.id,
				method: { in: [E2FAMethod.WEBAUTHN, E2FAMethod.PASSKEY] },
				credentialId: { not: null },
			},
			select: { credentialId: true },
		})

		// Format exclude credentials properly
		const excludeCredentials = existingCredentials
			.filter(c => c.credentialId)
			.map(c => ({
				id: c.credentialId,
				transports: ['usb', 'nfc', 'ble', 'internal'] as AuthenticatorTransportFuture[],
			}))

		// Generate registration options
		const options = await generateRegistrationOptions({
			rpName: WEBAUTHN_RP.NAME,
			rpID: WEBAUTHN_RP.ID,
			userID: Buffer.from(user.id, 'utf-8'), // Convert string to Uint8Array
			userName: user.email,
			userDisplayName: user.fullName || user.email,
			timeout: WEBAUTHN_CONFIG.CREDENTIAL_PARAMS.TIMEOUT,
			excludeCredentials,
			authenticatorSelection: {
				authenticatorAttachment,
				residentKey: WEBAUTHN_CONFIG.AUTHENTICATOR_SELECTION.RESIDENT_KEY,
				userVerification: WEBAUTHN_CONFIG.AUTHENTICATOR_SELECTION.USER_VERIFICATION,
			},
		})

		// Store challenge in Redis
		const challengeId = this.generateChallengeId()
		const challengeKey = REDIS_KEYS.WEBAUTHN_CHALLENGE(challengeId)

		await this.rSetJSON(
			challengeKey,
			{
				userId: user.id,
				challenge: options.challenge,
				type: 'registration',
				createdAt: new Date().toISOString(),
			},
			WEBAUTHN_STORAGE.CHALLENGE_TTL,
		)

		this.logger.log(`Generated WebAuthn registration options for user ${user.id}`)

		return { challengeId, options }
	}

	/**
	 * Verify registration response and save credential
	 */
	async verifyRegistrationResponse(
		user: User,
		challengeId: string,
		response: RegistrationResponseJSON,
		authenticatorName?: string,
		lng: Language = 'en',
	): Promise<{
		success: boolean
		methodId: string
		credentialId: string
		backupCodes: string[]
	}> {
		// Get challenge from Redis
		const challengeKey = REDIS_KEYS.WEBAUTHN_CHALLENGE(challengeId)
		const challengeData = await this.rGetJSON<{
			userId: string
			challenge: string
			type: string
		}>(challengeKey)

		if (!challengeData || challengeData.userId !== user.id || challengeData.type !== 'registration') {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.invalid_challenge', {
					lng,
					defaultValue: 'Invalid or expired challenge',
				}),
			)
		}

		// Verify the registration
		let verification: VerifiedRegistrationResponse
		try {
			verification = await verifyRegistrationResponse({
				response,
				expectedChallenge: challengeData.challenge,
				expectedOrigin: WEBAUTHN_RP.ORIGIN,
				expectedRPID: WEBAUTHN_RP.ID,
			})
		} catch (error) {
			this.logger.error(`WebAuthn registration verification failed: ${(error as Error).message}`)
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.registration_failed', {
					lng,
					defaultValue: 'Registration verification failed',
				}),
			)
		}

		if (!verification.verified || !verification.registrationInfo) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.registration_invalid', {
					lng,
					defaultValue: 'Invalid registration response',
				}),
			)
		}

		const { registrationInfo } = verification
		const { credential, credentialDeviceType, credentialBackedUp, aaguid } = registrationInfo

		// Determine method type
		const isPlatform = credentialDeviceType === 'singleDevice'
		const methodType = isPlatform ? E2FAMethod.PASSKEY : E2FAMethod.WEBAUTHN

		// Create method data based on type - use separate variables for clarity
		let methodData: IWebAuthnMethodData | IPasskeyMethodData

		if (methodType === E2FAMethod.PASSKEY) {
			// Create IPasskeyMethodData
			const passkeyData: IPasskeyMethodData = {
				publicKey: Buffer.from(credential.publicKey).toString('base64url'),
				counter: credential.counter,
				credentialId: Buffer.from(credential.id).toString('base64url'),
				transports: (response.response.transports || ['internal']) as (
					| 'usb'
					| 'nfc'
					| 'ble'
					| 'internal'
					| 'hybrid'
				)[],
				aaguid: aaguid || undefined,
				isSynced: credentialBackedUp || false,
				platform: this.detectPlatform(response.response.clientDataJSON),
				backupEligible: credentialBackedUp || false,
				backedUp: credentialBackedUp || false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}
			methodData = passkeyData
		} else {
			// Create IWebAuthnMethodData
			const webauthnData: IWebAuthnMethodData = {
				publicKey: Buffer.from(credential.publicKey).toString('base64url'),
				counter: credential.counter,
				credentialId: Buffer.from(credential.id).toString('base64url'),
				transports: (response.response.transports || ['usb', 'nfc', 'ble', 'internal']) as (
					| 'usb'
					| 'nfc'
					| 'ble'
					| 'internal'
				)[],
				aaguid: aaguid || undefined,
				attestationFormat: 'none',
				userVerified: true,
				backupEligible: credentialBackedUp || false,
				backedUp: credentialBackedUp || false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}
			methodData = webauthnData
		}

		// Create method and backup codes in transaction
		const result = await this.prisma.$transaction(async tx => {
			const existingMethods = await tx.authenticationMethod.count({
				where: { userId: user.id, isActive: true },
			})
			const isPrimary = existingMethods === 0

			const method = await tx.authenticationMethod.create({
				data: {
					userId: user.id,
					method: methodType,
					data: methodData as unknown as Prisma.JsonValue,
					name: authenticatorName || (isPlatform ? 'Platform Authenticator' : 'Security Key'),
					credentialId: Buffer.from(credential.id).toString('base64url'),
					isPrimary,
					isActive: true,
				},
			})

			if (isPrimary) {
				await tx.user.update({
					where: { id: user.id },
					data: {
						is2FAEnabled: true,
						preferred2FAMethod: methodType,
					},
				})
			}

			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: methodType === E2FAMethod.PASSKEY ? 'PASSKEY_REGISTERED' : 'WEBAUTHN_REGISTERED',
					category: 'SECURITY',
					success: true,
					metadata: {
						methodId: method.id,
						credentialId: method.credentialId,
						authenticatorName,
						isPlatform,
					} as Prisma.InputJsonValue,
				},
			})

			return method
		})

		// Generate backup codes
		const backupCodes = await this.backupCodeService.generateBackupCodes(user.id, methodType, result.id)

		// Log security event
		await this.securityEventService.logEvent({
			userId: user.id,
			event:
				methodType === E2FAMethod.PASSKEY ? ESecurityEvent.PASSKEY_CREATED : ESecurityEvent.WEBAUTHN_REGISTERED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: {
				methodId: result.id,
				credentialId: result.credentialId,
				authenticatorName,
				timestamp: new Date().toISOString(),
			},
		})

		// Clear challenge
		await this.rDel(challengeKey)

		this.logger.log(`WebAuthn/Passkey registered for user ${user.id}, method ${result.id}`)

		return {
			success: true,
			methodId: result.id,
			credentialId: result.credentialId,
			backupCodes,
		}
	}

	/**
	 * Generate authentication options
	 */
	async generateAuthenticationOptions(
		userId?: string,
		credentialId?: string,
	): Promise<{
		challengeId: string
		options: any // Already any, no need for assertion
		credentialCount: number
	}> {
		let allowCredentials: any[] = []
		let credentialCount = 0

		if (userId) {
			const credentials = await this.prisma.authenticationMethod.findMany({
				where: {
					userId,
					method: { in: [E2FAMethod.WEBAUTHN, E2FAMethod.PASSKEY] },
					isActive: true,
					credentialId: credentialId || undefined,
				},
			})

			credentialCount = credentials.length

			allowCredentials = credentials
				.filter(c => c.credentialId)
				.map(c => {
					const data = c.data as unknown as IWebAuthnMethodData
					return {
						id: c.credentialId,
						transports: data.transports as AuthenticatorTransportFuture[],
					}
				})
		}

		const options = await generateAuthenticationOptions({
			rpID: WEBAUTHN_RP.ID,
			timeout: WEBAUTHN_CONFIG.CREDENTIAL_PARAMS.TIMEOUT,
			allowCredentials,
			userVerification: WEBAUTHN_CONFIG.AUTHENTICATOR_SELECTION.USER_VERIFICATION,
		})

		const challengeId = this.generateChallengeId()
		const challengeKey = REDIS_KEYS.WEBAUTHN_CHALLENGE(challengeId)

		await this.rSetJSON(
			challengeKey,
			{
				userId: userId || 'unknown',
				challenge: options.challenge,
				type: 'authentication',
				createdAt: new Date().toISOString(),
			},
			WEBAUTHN_STORAGE.CHALLENGE_TTL,
		)

		this.logger.log(`Generated WebAuthn authentication options${userId ? ` for user ${userId}` : ''}`)

		return {
			challengeId,
			options,
			credentialCount,
		}
	}

	/**
	 * Verify authentication response
	 */
	async verifyAuthenticationResponse(
		challengeId: string,
		response: AuthenticationResponseJSON,
		lng: Language = 'en',
	): Promise<{
		success: boolean
		userId: string
		credentialId: string
		methodId: string
	}> {
		const challengeKey = REDIS_KEYS.WEBAUTHN_CHALLENGE(challengeId)
		const challengeData = await this.rGetJSON<{
			userId: string
			challenge: string
			type: string
		}>(challengeKey)

		if (!challengeData || challengeData.type !== 'authentication') {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.invalid_challenge', {
					lng,
					defaultValue: 'Invalid or expired challenge',
				}),
			)
		}

		const credentialId = response.id
		const method = await this.prisma.authenticationMethod.findUnique({
			where: { credentialId },
			include: { user: true },
		})

		if (!method || !method.isActive) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.2fa.credential_not_found', {
					lng,
					defaultValue: 'Credential not found',
				}),
			)
		}

		const methodData = method.data as unknown as IWebAuthnMethodData

		let verification: VerifiedAuthenticationResponse
		try {
			// Create properly formatted credential for verification
			const credential = {
				id: method.credentialId,
				publicKey: Buffer.from(methodData.publicKey, 'base64url'),
				counter: methodData.counter,
				transports: methodData.transports as AuthenticatorTransportFuture[],
			}

			verification = await verifyAuthenticationResponse({
				response,
				expectedChallenge: challengeData.challenge,
				expectedOrigin: WEBAUTHN_RP.ORIGIN,
				expectedRPID: WEBAUTHN_RP.ID,
				credential,
			})
		} catch (error) {
			this.logger.error(`WebAuthn authentication verification failed: ${(error as Error).message}`)
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.2fa.authentication_failed', {
					lng,
					defaultValue: 'Authentication verification failed',
				}),
			)
		}

		if (!verification.verified) {
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.2fa.authentication_invalid', {
					lng,
					defaultValue: 'Invalid authentication response',
				}),
			)
		}

		const { authenticationInfo } = verification
		const { newCounter } = authenticationInfo

		methodData.counter = newCounter
		methodData.updatedAt = new Date().toISOString()

		await this.prisma.authenticationMethod.update({
			where: { id: method.id },
			data: {
				data: methodData as unknown as Prisma.JsonValue,
				lastUsedAt: new Date(),
				useCount: { increment: 1 },
			},
		})

		await this.securityEventService.logEvent({
			userId: method.userId,
			event:
				method.method === E2FAMethod.PASSKEY ? ESecurityEvent.PASSKEY_USED : ESecurityEvent.WEBAUTHN_VERIFIED,
			severity: ESecuritySeverity.LOW,
			metadata: {
				methodId: method.id,
				credentialId,
				timestamp: new Date().toISOString(),
			},
		})

		await this.rDel(challengeKey)

		this.logger.log(`WebAuthn authentication successful for user ${method.userId}`)

		return {
			success: true,
			userId: method.userId,
			credentialId,
			methodId: method.id,
		}
	}

	/**
	 * Get user's WebAuthn credentials
	 */
	async getUserCredentials(userId: string) {
		const methods = await this.prisma.authenticationMethod.findMany({
			where: {
				userId,
				method: { in: [E2FAMethod.WEBAUTHN, E2FAMethod.PASSKEY] },
				isActive: true,
			},
			orderBy: { createdAt: 'desc' },
		})

		return methods.map(method => {
			const data = method.data as unknown as IWebAuthnMethodData
			return {
				id: method.id,
				credentialId: method.credentialId,
				name: method.name,
				isPlatform: method.method === E2FAMethod.PASSKEY,
				isBackedUp: data.backedUp,
				transports: data.transports,
				lastUsedAt: method.lastUsedAt,
				useCount: method.useCount,
				createdAt: method.createdAt,
			}
		})
	}

	/**
	 * Remove WebAuthn credential
	 */
	async removeCredential(
		user: User,
		credentialId: string,
		password: string,
		lng: Language = 'en',
	): Promise<{ success: boolean }> {
		// Verify password
		const isPasswordValid = await HashUtil.verify(user.password, password)
		if (!isPasswordValid) {
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.password.invalid', { lng, defaultValue: 'Invalid password' }),
			)
		}

		const method = await this.prisma.authenticationMethod.findUnique({
			where: { credentialId },
		})

		if (!method || method.userId !== user.id) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.2fa.credential_not_found', {
					lng,
					defaultValue: 'Credential not found',
				}),
			)
		}

		// Delete credential and backup codes
		await this.prisma.$transaction(async tx => {
			await tx.authenticationMethod.delete({
				where: { id: method.id },
			})

			await tx.backupCode.deleteMany({
				where: { authMethodId: method.id },
			})

			// Check if this was the last method
			const remainingMethods = await tx.authenticationMethod.count({
				where: { userId: user.id, isActive: true },
			})

			if (remainingMethods === 0) {
				await tx.user.update({
					where: { id: user.id },
					data: {
						is2FAEnabled: false,
						preferred2FAMethod: null,
					},
				})
			}
		})

		// Log security event
		await this.securityEventService.logEvent({
			userId: user.id,
			event:
				method.method === E2FAMethod.PASSKEY ? ESecurityEvent.PASSKEY_DELETED : ESecurityEvent.WEBAUTHN_REMOVED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: {
				methodId: method.id,
				credentialId,
				timestamp: new Date().toISOString(),
			},
		})

		this.logger.log(`WebAuthn credential ${credentialId} removed for user ${user.id}`)

		return { success: true }
	}

	// ==================== Private Helpers ====================

	private generateChallengeId(): string {
		return Buffer.from(
			Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
		).toString('base64url')
	}

	/**
	 * Detect platform from client data
	 */
	private detectPlatform(clientDataJSON: string): string {
		// Parse the base64url encoded clientDataJSON
		try {
			const decoded = Buffer.from(clientDataJSON, 'base64url').toString('utf-8')
			const data = JSON.parse(decoded)

			// Check origin or other fields to detect platform
			const origin = data.origin || ''

			// You can also check user agent if passed through context
			if (origin.includes('android')) return 'android'
			if (origin.includes('ios') || origin.includes('iphone') || origin.includes('ipad')) return 'ios'
			if (origin.includes('windows')) return 'windows'
			if (origin.includes('mac')) return 'macos'

			return 'unknown'
		} catch {
			return 'unknown'
		}
	}
}

```




`src/modules/auth/2fa/types/device.types.ts`


```typescript
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
export type { ISessionMetadata }

/**
 * Extended device metadata with fingerprint
 */
export interface IDeviceMetadata extends ISessionMetadata {
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

```




`src/modules/auth/2fa/types/index.ts`


```typescript
export * from './method-data.types'
export * from './device.types'
export * from './risk.types'
export * from './security-event.types'

/**
 * Common response types
 */

export interface ISuccessResponse {
	success: true
	message?: string
}

export interface IErrorResponse {
	success: false
	error: string
	code?: string
}

export type TApiResponse<T = void> = T extends void
	? ISuccessResponse | IErrorResponse
	: (ISuccessResponse & { data: T }) | IErrorResponse

/**
 * Pagination
 */
export interface IPaginationParams {
	page: number
	limit: number
}

export interface IPaginatedResponse<T> {
	data: T[]
	total: number
	page: number
	limit: number
	totalPages: number
}

```




`src/modules/auth/2fa/types/method-data.types.ts`


```typescript
/**
 * Base interface for all 2FA method data
 * All method-specific data extends this
 */
export interface I2FAMethodDataBase {
	/** ISO timestamp of creation */
	createdAt: string
	/** ISO timestamp of last update */
	updatedAt: string
	/** Additional metadata */
	metadata?: Record<string, unknown>
}

/**
 * TOTP method data (Google Authenticator, Authy, etc.)
 */
export interface ITotpMethodData extends I2FAMethodDataBase {
	/** Encrypted TOTP secret (AES-256-GCM) */
	secret: string
	/** Hash algorithm: SHA1, SHA256, SHA512 */
	algorithm: 'SHA1' | 'SHA256' | 'SHA512'
	/** Number of digits in code (6 or 8) */
	digits: 6 | 8
	/** Time step in seconds (usually 30) */
	period: 30 | 60
	/** Issuer name (app name) */
	issuer: string
	/** Account name (usually email) */
	accountName: string
	/** QR code provisioning URI (optional, for re-provisioning) */
	provisioningUri?: string
}

/**
 * OTP Email method data
 */
export interface IOtpEmailMethodData extends I2FAMethodDataBase {
	/** Email address where codes are sent */
	email: string
	/** Timestamp of last code sent */
	lastSentAt?: string
	/** Number of codes sent in current window */
	sentCount: number
	/** Template ID for emails (if using template service) */
	templateId?: string
}

/**
 * OTP SMS method data
 */
export interface IOtpSmsMethodData extends I2FAMethodDataBase {
	/** Phone number in E.164 format */
	phone: string
	/** Timestamp of last code sent */
	lastSentAt?: string
	/** Number of codes sent in current window */
	sentCount: number
	/** SMS provider used (twilio, vonage, etc.) */
	provider?: string
}

/**
 * WebAuthn hardware key data (YubiKey, Titan Key)
 */
export interface IWebAuthnMethodData extends I2FAMethodDataBase {
	/** Public key (base64url encoded) */
	publicKey: string
	/** Signature counter for replay protection */
	counter: number
	/** Credential ID (base64url encoded) */
	credentialId: string
	/** Supported transports: usb, nfc, ble, internal */
	transports: ('usb' | 'nfc' | 'ble' | 'internal')[]
	/** AAGUID (Authenticator Attestation GUID) */
	aaguid?: string
	/** Attestation format (none, packed, fido-u2f, etc.) */
	attestationFormat?: string
	/** Whether authenticator supports user verification */
	userVerified: boolean
	/** Backup eligibility (can be backed up to cloud) */
	backupEligible: boolean
	/** Currently backed up to cloud */
	backedUp: boolean
}

/**
 * Passkey data (TouchID, FaceID, Windows Hello)
 * Similar to WebAuthn but with sync capabilities
 */
export interface IPasskeyMethodData extends I2FAMethodDataBase {
	/** Public key (base64url encoded) */
	publicKey: string
	/** Signature counter for replay protection */
	counter: number
	/** Credential ID (base64url encoded) */
	credentialId: string
	/** Supported transports */
	transports: ('usb' | 'nfc' | 'ble' | 'internal' | 'hybrid')[]
	/** AAGUID */
	aaguid?: string
	/** Whether passkey is synced across devices */
	isSynced: boolean
	/** Platform: ios, android, windows, macos */
	platform?: string
	/** User verification method: fingerprint, face, pin */
	uvMethod?: 'fingerprint' | 'face' | 'pin' | 'pattern'
	/** Backup eligibility */
	backupEligible: boolean
	/** Currently backed up */
	backedUp: boolean
}

/**
 * Backup code method data
 */
export interface IBackupCodeMethodData extends I2FAMethodDataBase {
	/** Total number of codes generated */
	totalCodes: number
	/** Number of codes already used */
	usedCodes: number
	/** Remaining codes */
	remainingCodes: number
	/** Format: HEX, BASE32, NUMERIC */
	format: 'HEX' | 'BASE32' | 'NUMERIC'
	/** Code length */
	codeLength: number
}

/**
 * Discriminated union of all method data types
 * Provides type safety when working with different methods
 */
export type T2FAMethodData =
	| { method: typeof E2FAMethod.TOTP; data: ITotpMethodData }
	| { method: typeof E2FAMethod.OTP_EMAIL; data: IOtpEmailMethodData }
	| { method: typeof E2FAMethod.OTP_SMS; data: IOtpSmsMethodData }
	| { method: typeof E2FAMethod.WEBAUTHN; data: IWebAuthnMethodData }
	| { method: typeof E2FAMethod.PASSKEY; data: IPasskeyMethodData }
	| { method: typeof E2FAMethod.BACKUP_CODE; data: IBackupCodeMethodData }

/**
 * Helper type to extract data type for specific method
 */
export type TMethodDataForType<T extends E2FAMethod> = Extract<T2FAMethodData, { method: T }>['data']

/**
 * Method setup input for API
 */
export interface I2FAMethodSetupInput {
	method: E2FAMethod
	name?: string
	isPrimary?: boolean
	data: Record<string, unknown>
}

/**
 * Method verification input
 */
export interface I2FAMethodVerifyInput {
	methodId: string
	code: string
	trustDevice?: boolean
}

```




`src/modules/auth/2fa/types/risk.types.ts`


```typescript
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
export interface IRiskFactor {
	/** Factor name */
	name: string
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
export type { ISessionMetadata }

```




`src/modules/auth/2fa/types/security-event.types.ts`


```typescript
/**
 * Base security event metadata
 */
export interface ISecurityEventMetadata {
	timestamp: string
	ip?: string
	userAgent?: string
	country?: string
	city?: string
	deviceId?: string
}

/**
 * Authentication event metadata
 */
export interface IAuthEventMetadata extends ISecurityEventMetadata {
	method?: '2fa' | 'password' | 'session'
	success: boolean
	failureReason?: string
	attempts?: number
}

/**
 * 2FA event metadata
 */
export interface I2FAEventMetadata extends ISecurityEventMetadata {
	methodType: string
	methodId?: string
	success: boolean
	failureReason?: string
	backupCodeUsed?: boolean
}

/**
 * Device event metadata
 */
export interface IDeviceEventMetadata extends ISecurityEventMetadata {
	deviceId: string
	deviceName?: string
	deviceType?: string
	trustScore?: number
	fingerprint?: Record<string, unknown>
}

/**
 * Suspicious activity metadata
 */
export interface ISuspiciousActivityMetadata extends ISecurityEventMetadata {
	reason: string
	anomalies?: Array<{
		type: string
		severity: string
		description: string
	}>
	riskScore: number
	blocked: boolean
}

/**
 * Administrative action metadata
 * Used when admins perform actions on user accounts
 */
export interface IAdminActionMetadata extends ISecurityEventMetadata {
	/** Admin who performed the action */
	adminId: string
	/** Admin's email for quick identification */
	adminEmail?: string
	/** Reason provided by admin */
	reason: string
	/** Target user affected by action */
	targetUserId?: string
	/** Target user's email */
	targetEmail?: string
	/** Additional action-specific fields */
	[key: string]: any
}

/**
 * Union type for all security event metadata types
 */
export type TSecurityEventMetadata =
	| ISecurityEventMetadata
	| IAuthEventMetadata
	| I2FAEventMetadata
	| IDeviceEventMetadata
	| ISuspiciousActivityMetadata
	| IAdminActionMetadata // ✅ Added admin action type

/**
 * Security event creation input
 */
export interface ICreateSecurityEventInput {
	userId: string
	event: ESecurityEvent
	severity: ESecuritySeverity
	metadata: TSecurityEventMetadata
	riskScore?: number
	riskFactors?: Record<string, number>
}

/**
 * Security event filter
 */
export interface ISecurityEventFilter {
	userId?: string
	events?: ESecurityEvent[]
	severities?: ESecuritySeverity[]
	dateFrom?: Date
	dateTo?: Date
	resolved?: boolean
	limit?: number
	offset?: number
}

```




`src/modules/auth/2fa/utils/encryption.util.ts`


```typescript
/**
 * Encryption utility for 2FA sensitive data
 * Uses AES-256-GCM for authenticated encryption
 */
export class EncryptionUtil {
	private static readonly ALGORITHM = 'aes-256-gcm'
	private static readonly IV_LENGTH = 16
	private static readonly AUTH_TAG_LENGTH = 16
	private static readonly KEY_LENGTH = 32

	/**
	 * Get encryption key from environment
	 * @throws Error if key is not configured
	 */
	private static getKey(): Buffer {
		const key = process.env.TWO_FA_ENCRYPTION_KEY

		if (!key) {
			throw new Error('TWO_FA_ENCRYPTION_KEY is not defined in environment')
		}

		// Expect hex-encoded 256-bit key (64 characters)
		if (key.length !== 64) {
			throw new Error('TWO_FA_ENCRYPTION_KEY must be 64 hex characters (256 bits)')
		}

		return Buffer.from(key, 'hex')
	}

	/**
	 * Encrypt plaintext using AES-256-GCM
	 * @param plaintext Data to encrypt
	 * @returns Encrypted string in format: iv:authTag:ciphertext (all hex-encoded)
	 */
	static encrypt(plaintext: string): string {
		try {
			const key = this.getKey()
			const iv = randomBytes(this.IV_LENGTH)

			const cipher = createCipheriv(this.ALGORITHM, key, iv)

			let encrypted = cipher.update(plaintext, 'utf8', 'hex')
			encrypted += cipher.final('hex')

			const authTag = cipher.getAuthTag()

			// Format: iv:authTag:ciphertext
			return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
		} catch (error) {
			throw new Error(`Encryption failed: ${(error as Error).message}`)
		}
	}

	/**
	 * Decrypt ciphertext using AES-256-GCM
	 * @param encryptedData Encrypted string in format iv:authTag:ciphertext
	 * @returns Decrypted plaintext
	 */
	static decrypt(encryptedData: string): string {
		try {
			const key = this.getKey()
			const parts = encryptedData.split(':')

			if (parts.length !== 3) {
				throw new Error('Invalid encrypted data format')
			}

			const [ivHex, authTagHex, ciphertextHex] = parts

			const iv = Buffer.from(ivHex, 'hex')
			const authTag = Buffer.from(authTagHex, 'hex')
			const ciphertext = Buffer.from(ciphertextHex, 'hex')

			const decipher = createDecipheriv(this.ALGORITHM, key, iv)
			decipher.setAuthTag(authTag)

			let decrypted = decipher.update(ciphertext)
			decrypted = Buffer.concat([decrypted, decipher.final()])

			return decrypted.toString('utf8')
		} catch (error) {
			throw new Error(`Decryption failed: ${(error as Error).message}`)
		}
	}

	/**
	 * Encrypt JSON object
	 * @param data Object to encrypt
	 * @returns Encrypted string
	 */
	static encryptJSON<T>(data: T): string {
		return this.encrypt(JSON.stringify(data))
	}

	/**
	 * Decrypt to JSON object
	 * @param encryptedData Encrypted string
	 * @returns Decrypted object
	 */
	static decryptJSON<T>(encryptedData: string): T {
		const decrypted = this.decrypt(encryptedData)
		return JSON.parse(decrypted) as T
	}

	/**
	 * Generate a new encryption key (for initial setup)
	 * @returns Hex-encoded 256-bit key
	 */
	static generateKey(): string {
		return randomBytes(this.KEY_LENGTH).toString('hex')
	}
}

```




`src/modules/auth/2fa/utils/fingerprint.util.ts`


```typescript
/**
 * Device fingerprinting utility
 * Generates unique device identifiers based on browser/system characteristics
 */
export class FingerprintUtil {
	/**
	 * Generate device ID from fingerprint components
	 * Uses SHA-256 hash of normalized fingerprint data
	 * @param fingerprint Device fingerprint data
	 * @returns Hex-encoded device ID (64 characters)
	 */
	static generateDeviceId(fingerprint: IDeviceFingerprint): string {
		const normalized = this.normalizeFingerprint(fingerprint)
		const data = JSON.stringify(normalized)

		return createHash('sha256').update(data).digest('hex')
	}

	/**
	 * Generate device ID from user agent only (quick method)
	 * Less unique but faster, useful for basic device tracking
	 * @param userAgent User-Agent string
	 * @param ip Optional IP address for additional entropy
	 * @returns Hex-encoded device ID
	 */
	static generateQuickDeviceId(userAgent: string, ip?: string): string {
		const data = ip ? `${userAgent}:${ip}` : userAgent

		return createHash('sha256').update(data).digest('hex')
	}

	/**
	 * Normalize fingerprint data for consistent hashing
	 * Sorts keys and removes volatile fields
	 * @param fingerprint Raw fingerprint data
	 * @returns Normalized fingerprint
	 */
	private static normalizeFingerprint(fingerprint: IDeviceFingerprint): Partial<IDeviceFingerprint> {
		// Remove highly volatile fields that change frequently
		const {
			// Remove timezone offset (changes with DST)
			timezoneOffset,
			// Keep stable fields only
			...stable
		} = fingerprint

		// Sort object keys for consistent stringification
		const sorted = Object.keys(stable)
			.sort()
			.reduce(
				(acc, key) => {
					acc[key] = stable[key as keyof typeof stable]
					return acc
				},
				{} as Record<string, unknown>,
			)

		return sorted as Partial<IDeviceFingerprint>
	}

	/**
	 * Calculate similarity between two fingerprints (0-1)
	 * Used to detect if a device has slightly changed (browser update, etc.)
	 * @param fp1 First fingerprint
	 * @param fp2 Second fingerprint
	 * @returns Similarity score (0 = completely different, 1 = identical)
	 */
	static calculateSimilarity(fp1: IDeviceFingerprint, fp2: IDeviceFingerprint): number {
		const keys = new Set([...Object.keys(fp1), ...Object.keys(fp2)])

		let matches = 0
		let total = 0

		for (const key of keys) {
			total++
			const val1 = fp1[key as keyof IDeviceFingerprint]
			const val2 = fp2[key as keyof IDeviceFingerprint]

			if (val1 === val2) {
				matches++
			} else if (typeof val1 === 'string' && typeof val2 === 'string') {
				// Partial match for strings (e.g., browser version change)
				const similarity = this.stringSimilarity(val1, val2)
				matches += similarity
			}
		}

		return total > 0 ? matches / total : 0
	}

	/**
	 * Compare two device metadata objects
	 * Uses session metadata for comparison (browser, OS, device type)
	 * @param device1 First device metadata
	 * @param device2 Second device metadata
	 * @returns Similarity score (0-1)
	 */
	static compareDevices(device1: IDeviceMetadata, device2: IDeviceMetadata): number {
		let score = 0
		let maxScore = 0

		// Compare browser
		maxScore += 30
		if (device1.device.browser === device2.device.browser) {
			score += 30
		}

		// Compare OS
		maxScore += 30
		if (device1.device.os === device2.device.os) {
			score += 30
		}

		// Compare device type
		maxScore += 20
		if (device1.device.type === device2.device.type) {
			score += 20
		}

		// Compare country
		maxScore += 10
		if (device1.location.country === device2.location.country) {
			score += 10
		}

		// Compare city
		maxScore += 10
		if (device1.location.city === device2.location.city) {
			score += 10
		}

		return maxScore > 0 ? score / maxScore : 0
	}

	/**
	 * Calculate similarity between two strings using Levenshtein distance
	 * @param str1 First string
	 * @param str2 Second string
	 * @returns Similarity score (0-1)
	 */
	private static stringSimilarity(str1: string, str2: string): number {
		const longer = str1.length > str2.length ? str1 : str2
		const shorter = str1.length > str2.length ? str2 : str1

		if (longer.length === 0) {
			return 1.0
		}

		const editDistance = this.levenshteinDistance(longer, shorter)
		return (longer.length - editDistance) / longer.length
	}

	/**
	 * Levenshtein distance algorithm
	 * @param str1 First string
	 * @param str2 Second string
	 * @returns Edit distance
	 */
	private static levenshteinDistance(str1: string, str2: string): number {
		const matrix: number[][] = []

		for (let i = 0; i <= str2.length; i++) {
			matrix[i] = [i]
		}

		for (let j = 0; j <= str1.length; j++) {
			matrix[0][j] = j
		}

		for (let i = 1; i <= str2.length; i++) {
			for (let j = 1; j <= str1.length; j++) {
				if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
					matrix[i][j] = matrix[i - 1][j - 1]
				} else {
					matrix[i][j] = Math.min(
						matrix[i - 1][j - 1] + 1, // substitution
						matrix[i][j - 1] + 1, // insertion
						matrix[i - 1][j] + 1, // deletion
					)
				}
			}
		}

		return matrix[str2.length][str1.length]
	}

	/**
	 * Validate fingerprint has minimum required components
	 * @param fingerprint Fingerprint to validate
	 * @returns Whether fingerprint is valid
	 */
	static isValidFingerprint(fingerprint: IDeviceFingerprint): boolean {
		const requiredFields: (keyof IDeviceFingerprint)[] = ['userAgent', 'platform', 'screenResolution', 'timezone']

		return requiredFields.every(
			field => fingerprint[field] !== undefined && fingerprint[field] !== null && fingerprint[field] !== '',
		)
	}

	/**
	 * Create minimal fingerprint from user agent only
	 * Useful when full fingerprint is not available
	 * @param userAgent User-Agent string
	 * @returns Minimal fingerprint object
	 */
	static createMinimalFingerprint(userAgent: string): Partial<IDeviceFingerprint> {
		return {
			userAgent,
			platform: 'unknown',
			language: 'unknown',
			languages: [],
			screenResolution: 'unknown',
			availableScreenResolution: 'unknown',
			colorDepth: 0,
			pixelRatio: 1,
			timezone: 'unknown',
			timezoneOffset: 0,
			hardwareConcurrency: 0,
			maxTouchPoints: 0,
			cookieEnabled: true,
			localStorage: true,
			sessionStorage: true,
			indexedDB: true,
		}
	}
}

```




`src/modules/auth/2fa/utils/index.ts`


```typescript
export * from './encryption.util'
export * from './fingerprint.util'
export * from './risk-calculator.util'

```




`src/modules/auth/2fa/utils/risk-calculator.util.ts`


```typescript
/**
 * Risk context for assessment
 * Extended version of ISessionMetadata with additional context
 */
export interface IRiskContext {
	// Current session
	session: ISessionMetadata

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
				name: 'high_risk_country',
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
				name: 'new_country',
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
				name: 'new_city',
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
				name: 'impossible_travel',
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
				name: 'new_device',
				score: RISK_WEIGHTS.NEW_DEVICE,
				weight: 0.9,
				description: 'First login from this device',
			})
		}

		// Untrusted device
		if (context.deviceTrustScore < 50) {
			factors.push({
				name: 'untrusted_device',
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
				name: 'suspicious_user_agent',
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
					name: 'unusual_time',
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
					name: 'unusual_day',
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
				name: 'new_account',
				score: RISK_WEIGHTS.NEW_ACCOUNT,
				weight: 0.7,
				description: 'Account is less than 7 days old',
				details: { age: context.accountAge },
			})
		} else if (context.accountAge < 30) {
			factors.push({
				name: 'young_account',
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
				name: 'failed_attempts',
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
}

```




`src/modules/auth/account/account.module.ts`


```typescript
// Import enums registration

@Module({
	providers: [AccountService, AccountResolver, VerificationService, SecurityEventService, SessionService],
})
export class AccountModule {}

```




`src/modules/auth/account/account.resolver.ts`


```typescript
/**
 * Response type for password change operation
 */
@ObjectType('ChangePasswordResponse', {
	description: 'Response after successful password change',
})
export class ChangePasswordResponse {
	@Field({
		description: 'Whether the password change was successful',
	})
	success: boolean

	@Field({
		description: 'Number of other sessions invalidated (logged out from other devices)',
	})
	sessionsInvalidated: number
}

@Resolver(() => User)
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	/**
	 * Returns the currently authenticated user's profile (safe projection).
	 */
	@Authorization()
	@Query(() => User, {
		name: 'profile',
		description: 'Get the currently authenticated user profile. Returns safe projection without sensitive data.',
	})
	async me(@Authorized('id') id: string): Promise<User> {
		return this.accountService.me(id)
	}

	/**
	 * Creates a new user account and sends an email verification token.
	 */
	@Mutation(() => User, {
		name: 'createAccount',
		description:
			'Create a new user account. Normalizes email, hashes password with Argon2id, and sends verification email.',
	})
	create(@Args('data') input: CreateAccountInput, @Lang() lng: Language): Promise<User> {
		return this.accountService.create(input, lng)
	}

	/**
	 * Changes the email of the authenticated user and re-sends a verification email.
	 */
	@Authorization()
	@Mutation(() => Boolean, {
		name: 'changeEmail',
		description: 'Change current user email address. Resets verification status and sends new verification email.',
	})
	async changeEmail(
		@Authorized() user: User,
		@Args('data') input: ChangeEmailInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.accountService.changeEmail(user, input, lng)
	}

	/**
	 * Changes the password of the authenticated user with enterprise security features.
	 * Invalidates all other sessions and logs security event.
	 */
	@Authorization()
	@Mutation(() => ChangePasswordResponse, {
		name: 'changePassword',
		description:
			'Change current user password. Verifies old password, invalidates all other sessions, logs security event, and updates passwordChangedAt timestamp.',
	})
	async changePassword(
		@Context() { req }: GqlContext,
		@Authorized() user: User,
		@Args('data') input: ChangePasswordInput,
		@UserAgent() userAgent: string,
		@Lang() lng: Language,
	): Promise<ChangePasswordResponse> {
		return this.accountService.changePassword(req, user, input, userAgent, lng)
	}
}

```



