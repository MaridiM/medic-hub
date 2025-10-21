# Full App Code (excluding imports, tests, i18n, extra core) - Part 6 of 8

`src/modules/libs/mail/templates/authentication/verification-email.template.tsx`


```tsx
interface IProps {
  url: string;
  i18n?: I18nService;
  lng?: string;
}

export function VerificationEmailTemplate({
  url, i18n, lng='en'
}: IProps) {
    
    const t = i18n.t('mail.verification_email', { lng })
    const tTemp = i18n.t('mail.template', { lng })

    return (
        <TemplateWrapper template='verification_email' lng={lng} i18n={i18n} >
            <Tailwind>
                <Section className="font-sans tracking-wide font-normal text-[#222222] mb-2 px-2">
                    <Heading as="h2" className="text-center">{t('title') || "Verify your email address"}</Heading>

                    <Text className="text-center">{t('intro', {app: APP_NAME}) || `Please confirm that you’d like to use this email address for your ${APP_NAME} account. Once confirmed, you’ll be able to start using ${APP_NAME}.`}</Text>
                </Section>

                <Button
                    className="box-border w-fit rounded-lg m-auto bg-[#2B7AFF] px-6 py-3 text-center font-normal font-sans traking-wider text-white"
                    href={url}
                >
                    {t('cta') || "Verify email"}
                </Button>
                
                <Section className="text-center px-2 mt-4">
                    <Text className="text-center font-sans tracking-wide font-normal text-[#222222] m-0">{tTemp('copyLinkHint') || "Or paste this link into your browser:"}</Text>
                    <Link href={url} className="font-sans tracking-[0px] text-center text-sm w-full" >{url}</Link>
                </Section>
            </Tailwind>
        </TemplateWrapper>
    );
}

```




`src/modules/libs/mail/templates/components/index.ts`


```typescript
export * from './template-wrapper'

```




`src/modules/libs/mail/templates/components/template-wrapper.tsx`


```tsx
type TTemplateName =
	| 'verification_email'
	| 'otp_code'
	| '2fa_method_added'
	| '2fa_method_removed'
	| '2fa_disabled'
	| 'new_device_login'
	| 'suspicious_activity'
	| 'low_backup_codes'
	| 'backup_codes_regenerated'
	| '2fa_disabled_by_admin'
	| 'device_revoked_by_admin'
	| 'password_changed'
	| 'reset_password'
	| 'password_reset_confirmation'

export interface IProps {
	template: TTemplateName
	i18n?: I18nService
	lng?: string
}

export function TemplateWrapper({ template, children, i18n, lng = 'en' }: PropsWithChildren<IProps>) {
	const currentYear: number = new Date().getFullYear()
	const t = i18n.t(`mail.${template}`, { lng })
	const tTemp = i18n.t(`mail.template`, { lng })

	return (
		<Html lang={lng}>
			<Preview>{t('preview')}</Preview>
			<Tailwind>
				<Head />
				<Body className="m-auto max-w-[600px] bg-[#efefef] px-3 py-3">
					{/* Логотип */}
					<div className="h-fit space-y-4 rounded-md bg-white px-4 py-6 text-center">
						<Section>
							{/*[if mso]><div style="font-family:Segoe UI, Arial, sans-serif; font-size:20px; font-weight:700; color:#143394">{companyName}</div><![endif]*/}
							<div className="flex h-12 items-center justify-center" role="svg" aria-label={COMPANY_NAME}>
								<Img
									src="https://res.cloudinary.com/dki4lxdki/image/upload/v1759181992/doctorlab/app/logo-full.png"
									width="180"
									height="44"
									alt={COMPANY_NAME}
									style={{ display: 'block', margin: '0 auto', border: '0', outline: 'none', textDecoration: 'none' }}
								/>
							</div>
						</Section>

						{children}
					</div>

					<Section className="px-1 pt-4">
						<Text className="m-0 text-xs text-[#656565]">
							{tTemp('signature')[0] || 'Regards, the'}{' '}
							<span className="font-semibold text-[#143394]">
								{tTemp('signature', { company: COMPANY_NAME })[1] || `${COMPANY_NAME} team`}
							</span>
						</Text>
						<Text className="mt-2 text-xs text-[#656565]">
							{tTemp('supportNote') || 'This is an automated message; please do not reply. Contact support: '}
							<Link href={`mailto:${SUPPORT_EMAIL}`} className="text-[#656565] underline">
								{SUPPORT_EMAIL}
							</Link>
						</Text>
						<Text className="mb-2 font-sans text-xs font-normal leading-[14px] text-[#656565]">
							{t('legalNote', { app: APP_NAME }) ||
								`You're receiving this email because you created a ${APP_NAME} account. If you didn't request this, you can safely ignore this email.`}
						</Text>
					</Section>

					<Section className="px-2 text-center">
						<Text className="mb-4 font-sans text-xs font-normal tracking-wide text-[#656565]">
							{tTemp('copyright', { year: currentYear, company: APP_NAME }) ||
								`© ${currentYear} ${APP_NAME}. All rights reserved.`}
						</Text>
						{/*[if mso]><div style="font-family:Segoe UI, Arial, sans-serif; font-size:20px; font-weight:700; color:#143394">{companyName}</div><![endif]*/}
						<div className="m-auto flex size-12 items-center justify-center" role="img" aria-label={COMPANY_NAME}>
							<Img
								src="https://res.cloudinary.com/dki4lxdki/image/upload/v1759181993/doctorlab/app/logo-mini.png"
								width="44"
								height="44"
								alt={COMPANY_NAME}
								style={{ display: 'block', margin: '0 auto', border: '0', outline: 'none', textDecoration: 'none' }}
							/>
						</div>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	)
}

```




`src/modules/libs/mail/templates/index.ts`


```typescript
// Authentication
export * from './authentication'

// 2FA Security Notifications
export * from './2fa-security'

```




`src/modules/libs/sms/index.ts`


```typescript
export * from './sms.module'
export * from './sms.service'

```




`src/modules/libs/sms/sms.module.ts`


```typescript
@Global()
@Module({
	providers: [SmsService],
	exports: [SmsService],
})
export class SmsModule {}

```




`src/modules/libs/sms/sms.service.ts`


```typescript
interface TwilioError {
	message: string
	code?: number
	status?: number
	moreInfo?: string
	[key: string]: unknown
}

@Injectable()
export class SmsService extends CoreService {
	private readonly logger: Logger = new Logger(SmsService.name)
	private readonly twilioClient: Twilio
	private readonly defaultFrom: string

	constructor(i18n: I18nService, config: ConfigService) {
		super(i18n, undefined, undefined, config)

		const accountSid: string = this.config.getOrThrow<string>('TWILIO_SID')
		const authToken: string = this.config.getOrThrow<string>('TWILIO_TOKEN')
		this.defaultFrom = this.config.getOrThrow<string>('TWILIO_PHONE')

		this.twilioClient = twilio(accountSid, authToken)
	}

	/**
	 * Checks if an SMS can and should be sent to a given phone number.
	 */
	async canSendSms(phone: string): Promise<{ canSend: boolean; reason?: string }> {
		// 1. Format validation (E.164)
		if (!isPhoneNumber(phone, undefined)) {
			// Using undefined region to enforce E.164
			return { canSend: false, reason: 'invalid_phone_format' }
		}
		// 2. Internal database check (bounce tracking)
		const userState = await this.prisma.user.findUnique({
			where: { phone },
			select: { phoneBouncedAt: true },
		})
		if (userState?.phoneBouncedAt) {
			return { canSend: false, reason: 'phone_hard_bounced' }
		}
		// 3. (Optional) External lookup via Twilio Lookup API
		try {
			const lookup = await this.twilioClient.lookups.v2.phoneNumbers(phone).fetch()
			if (!lookup.valid || lookup.lineTypeIntelligence?.type === 'voip') {
				return { canSend: false, reason: `invalid_line_type:${lookup.lineTypeIntelligence?.type}` }
			}
		} catch (error) {
			this.logger.error(`Twilio Lookup failed for ${phone}:`, error)
			// Decide if we should proceed or fail on lookup error
		}
		return { canSend: true }
	}

	async sendSMS(to: string, body: string, from?: string): Promise<boolean> {
		await this.ensureCanSend(to)
		try {
			await this.twilioClient.messages.create({ body, to, from: from ?? this.defaultFrom })
			return true
		} catch (error: unknown) {
			this.logError(error)
			// Here we could update user's `phoneBouncedAt` if the error indicates a permanent failure
			return false
		}
	}

	/**
	 * Send verification sms with code
	 * @param to recipient phone address
	 * @param code verification code
	 * @returns boolean true if successful, false if not sent
	 */
	async sendVerificationPhoneSMS(to: string, code: string, lng: Language): Promise<boolean> {
		const message = this.i18n.t('sms.verification.phone', {
			lng,
			defaultValue: `Your verification code: ${code}`,
			args: { code },
		})
		return this.sendSMS(to, message)
	}
	/**
	 * Send verification OTP sms with code
	 * @param to recipient phone address
	 * @param code verification code
	 * @returns boolean true if successful, false if not sent
	 */
	async sendOtpSMS(to: string, code: string, lng: Language): Promise<boolean> {
		const message = this.i18n.t('sms.verification.otp', {
			lng,
			defaultValue: `Your verification code: ${code}`,
			args: { code },
		})
		return this.sendSMS(to, message)
	}

	private async ensureCanSend(phone: string) {
		const check = await this.canSendSms(phone)
		if (!check.canSend) {
			const message = `Skipping SMS to ${phone}. Reason: ${check.reason}`
			this.logger.warn(message)
			throw new BadRequestException(message)
		}
	}

	private isTwilioError(error: unknown): error is TwilioError {
		return (
			typeof error === 'object' &&
			error !== null &&
			'message' in error &&
			typeof (error as TwilioError).message === 'string'
		)
	}

	private logError(error: unknown): void {
		if (this.isTwilioError(error)) {
			const codeInfo: string = error.code ? ` (code: ${error.code})` : ''
			const statusInfo: string = error.status ? ` (status: ${error.status})` : ''

			this.logger.error(`Twilio SMS send failed${codeInfo}${statusInfo}: ${error.message}`)
			this.logger.debug(`Twilio error payload: ${JSON.stringify(error)}`)
		} else if (error instanceof Error) {
			this.logger.error(`Twilio SMS send failed: ${error.message}`)
		} else {
			this.logger.error('Twilio SMS send failed: Unknown error')
		}
	}
}

```




`src/modules/notification/constants/index.ts`


```typescript
export * from './notification.constants'

```




`src/modules/notification/constants/notification.constants.ts`


```typescript
/**
 * Default notification settings
 */
export const NOTIFICATION_DEFAULTS = {
	/** Default channel if none specified */
	DEFAULT_CHANNEL: ENotificationChannel.EMAIL,

	/** Default priority */
	DEFAULT_PRIORITY: ENotificationPriority.NORMAL,

	/** Default language */
	DEFAULT_LANGUAGE: 'en' as const,

	/** Retry attempts for failed notifications */
	MAX_RETRY_ATTEMPTS: 3,

	/** Retry delay in milliseconds */
	RETRY_DELAY_MS: 5000,
} as const

/**
 * Priority-based channel preferences
 * Higher priority notifications use more channels
 */
export const PRIORITY_CHANNELS: Record<ENotificationPriority, ENotificationChannel[]> = {
	[ENotificationPriority.LOW]: [ENotificationChannel.EMAIL],
	[ENotificationPriority.NORMAL]: [ENotificationChannel.EMAIL],
	[ENotificationPriority.HIGH]: [ENotificationChannel.EMAIL, ENotificationChannel.SMS],
	[ENotificationPriority.CRITICAL]: [ENotificationChannel.EMAIL, ENotificationChannel.SMS],
}

/**
 * Security notification settings
 */
export const SECURITY_NOTIFICATION_CONFIG = {
	/** Enable/disable security notifications globally */
	ENABLED: process.env.SECURITY_NOTIFICATIONS_ENABLED !== 'false',

	/** Require email verification to send notifications */
	REQUIRE_VERIFIED_EMAIL: true,

	/** Require phone verification for SMS notifications */
	REQUIRE_VERIFIED_PHONE: true,

	/** Check email reputation before sending */
	CHECK_EMAIL_REPUTATION: true,

	/** Log all notification attempts */
	LOG_ALL_ATTEMPTS: true,
} as const

/**
 * Rate limiting for notifications
 */
export const NOTIFICATION_RATE_LIMITS = {
	/** Max notifications per user per hour */
	MAX_PER_HOUR: 10,

	/** Max notifications per user per day */
	MAX_PER_DAY: 50,

	/** Cooldown between duplicate notifications (seconds) */
	DUPLICATE_COOLDOWN: 300, // 5 minutes
} as const

/**
 * Redis keys for notification tracking
 */
export const NOTIFICATION_REDIS_KEYS = {
	/** Track sent notifications */
	SENT: (userId: string, type: string) => `notification:sent:${userId}:${type}`,

	/** Rate limiting */
	RATE_LIMIT_HOUR: (userId: string) => `notification:rate:hour:${userId}`,
	RATE_LIMIT_DAY: (userId: string) => `notification:rate:day:${userId}`,

	/** Duplicate detection */
	DUPLICATE: (userId: string, hash: string) => `notification:dup:${userId}:${hash}`,
} as const

```




`src/modules/notification/index.ts`


```typescript
export * from './notification.module'
export * from './notification.service'
export * from './types'
export * from './constants'

```




`src/modules/notification/notification.module.ts`


```typescript
/**
 * Global Notification Module
 *
 * Provides centralized notification services for the entire application.
 * Registered as a global module, making NotificationService available
 * everywhere without explicit imports.
 *
 * @remarks
 * - Supports multiple delivery channels (Email, SMS, Push)
 * - Handles rate limiting and duplicate detection
 * - Tracks delivery success/failure
 * - Respects user preferences and reputation
 *
 * @example
 * ```typescript
 * // No need to import in other modules, automatically available
 * @Injectable()
 * export class MyService {
 *   constructor(private readonly notificationService: NotificationService) {}
 *
 *   async doSomething() {
 *     await this.notificationService.notify2FAMethodAdded(user, 'TOTP', 'My App', 'en')
 *   }
 * }
 * ```
 */
@Global()
@Module({
	providers: [NotificationService],
})
export class NotificationModule {}

```




`src/modules/notification/notification.service.ts`


```typescript
/**
 * Global Notification Service
 *
 * Centralized service for sending notifications across all application modules.
 * Supports multiple channels (Email, SMS, Push) and handles rate limiting,
 * duplicate detection, and delivery tracking.
 *
 * @remarks
 * This is a global module - automatically available in all modules without import.
 *
 * @example
 * ```typescript
 * // In any service
 * await this.notificationService.send2FAMethodAdded(user, 'TOTP', 'My Auth App', 'en')
 * ```
 */
@Injectable()
export class NotificationService extends CoreService {
	private readonly logger = new Logger(NotificationService.name)

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly mailService: MailService,
		private readonly smsService: SmsService,
	) {
		super(i18n, prisma, redis)
	}

	// ==================== Core Notification Logic ====================

	/**
	 * Send notification through appropriate channels
	 *
	 * @param data Base notification data
	 * @param emailMethod Email sending method
	 * @param smsMethod Optional SMS sending method
	 * @returns Array of delivery results
	 */
	private async sendNotification(
		data: INotificationBase,
		emailMethod: () => Promise<void>,
		smsMethod?: () => Promise<void>,
	): Promise<INotificationResult[]> {
		const results: INotificationResult[] = []

		// Check if notifications are enabled
		if (!SECURITY_NOTIFICATION_CONFIG.ENABLED && data.category === ENotificationCategory.SECURITY) {
			this.logger.debug('Security notifications are disabled globally')
			return results
		}

		// Check rate limiting
		const rateLimitCheck = await this.checkRateLimit(data.user.id)
		if (!rateLimitCheck.allowed) {
			this.logger.warn(`Rate limit exceeded for user ${data.user.id}`)
			return [
				{
					success: false,
					channel: ENotificationChannel.EMAIL,
					error: 'Rate limit exceeded',
				},
			]
		}

		// Determine channels to use
		const channels = data.channels || PRIORITY_CHANNELS[data.priority] || [NOTIFICATION_DEFAULTS.DEFAULT_CHANNEL]

		// Send via Email
		if (channels.includes(ENotificationChannel.EMAIL)) {
			const emailResult = await this.sendViaEmail(data.user, emailMethod)
			results.push(emailResult)
		}

		// Send via SMS (if method provided and user has verified phone)
		if (channels.includes(ENotificationChannel.SMS) && smsMethod && data.user.isPhoneVerified && data.user.phone) {
			const smsResult = await this.sendViaSms(data.user, smsMethod)
			results.push(smsResult)
		}

		// Track sent notification
		if (results.some(r => r.success)) {
			await this.trackSentNotification(data.user.id, data.category)
		}

		return results
	}

	/**
	 * Send notification via email
	 */
	private async sendViaEmail(user: User, emailMethod: () => Promise<void>): Promise<INotificationResult> {
		try {
			// Check email verification
			if (SECURITY_NOTIFICATION_CONFIG.REQUIRE_VERIFIED_EMAIL && !user.isEmailVerified) {
				return {
					success: false,
					channel: ENotificationChannel.EMAIL,
					error: 'Email not verified',
				}
			}

			if (!user.email) {
				return {
					success: false,
					channel: ENotificationChannel.EMAIL,
					error: 'No email address',
				}
			}

			// Check email reputation
			if (SECURITY_NOTIFICATION_CONFIG.CHECK_EMAIL_REPUTATION) {
				const canSend = await this.mailService.canSendEmail(user.email)
				if (!canSend) {
					return {
						success: false,
						channel: ENotificationChannel.EMAIL,
						error: 'Email bounced or unsubscribed',
					}
				}
			}

			// Send email
			await emailMethod()

			return {
				success: true,
				channel: ENotificationChannel.EMAIL,
				sentAt: new Date(),
			}
		} catch (error) {
			this.logger.error(`Email notification failed: ${(error as Error).message}`, error)
			return {
				success: false,
				channel: ENotificationChannel.EMAIL,
				error: (error as Error).message,
			}
		}
	}

	/**
	 * Send notification via SMS
	 */
	private async sendViaSms(user: User, smsMethod: () => Promise<void>): Promise<INotificationResult> {
		try {
			// Check phone verification
			if (SECURITY_NOTIFICATION_CONFIG.REQUIRE_VERIFIED_PHONE && !user.isPhoneVerified) {
				return {
					success: false,
					channel: ENotificationChannel.SMS,
					error: 'Phone not verified',
				}
			}

			if (!user.phone) {
				return {
					success: false,
					channel: ENotificationChannel.SMS,
					error: 'No phone number',
				}
			}

			// Check SMS capability
			const canSend = await this.smsService.canSendSms(user.phone)
			if (!canSend) {
				return {
					success: false,
					channel: ENotificationChannel.SMS,
					error: 'Phone number invalid or blocked',
				}
			}

			// Send SMS
			await smsMethod()

			return {
				success: true,
				channel: ENotificationChannel.SMS,
				sentAt: new Date(),
			}
		} catch (error) {
			this.logger.error(`SMS notification failed: ${(error as Error).message}`, error)
			return {
				success: false,
				channel: ENotificationChannel.SMS,
				error: (error as Error).message,
			}
		}
	}

	// ==================== Rate Limiting ====================

	/**
	 * Check if user has exceeded rate limits
	 */
	private async checkRateLimit(userId: string): Promise<{ allowed: boolean; reason?: string }> {
		const hourKey = NOTIFICATION_REDIS_KEYS.RATE_LIMIT_HOUR(userId)
		const dayKey = NOTIFICATION_REDIS_KEYS.RATE_LIMIT_DAY(userId)

		const hourCount = await this.rGet(hourKey)
		const dayCount = await this.rGet(dayKey)

		const hourlyCount = hourCount ? parseInt(hourCount, 10) : 0
		const dailyCount = dayCount ? parseInt(dayCount, 10) : 0

		if (hourlyCount >= NOTIFICATION_RATE_LIMITS.MAX_PER_HOUR) {
			return { allowed: false, reason: 'Hourly limit exceeded' }
		}

		if (dailyCount >= NOTIFICATION_RATE_LIMITS.MAX_PER_DAY) {
			return { allowed: false, reason: 'Daily limit exceeded' }
		}

		return { allowed: true }
	}

	/**
	 * Track sent notification for rate limiting
	 */
	private async trackSentNotification(userId: string, category: ENotificationCategory): Promise<void> {
		const hourKey = NOTIFICATION_REDIS_KEYS.RATE_LIMIT_HOUR(userId)
		const dayKey = NOTIFICATION_REDIS_KEYS.RATE_LIMIT_DAY(userId)

		// Increment counters
		await this.rIncr(hourKey)
		await this.rExpire(hourKey, 3600) // 1 hour

		await this.rIncr(dayKey)
		await this.rExpire(dayKey, 86400) // 24 hours

		// Log if enabled
		if (SECURITY_NOTIFICATION_CONFIG.LOG_ALL_ATTEMPTS) {
			this.logger.debug(`Notification sent: user=${userId}, category=${category}`)
		}
	}

	/**
	 * Check for duplicate notifications
	 */
	private async checkDuplicate(userId: string, notificationHash: string): Promise<boolean> {
		const key = NOTIFICATION_REDIS_KEYS.DUPLICATE(userId, notificationHash)
		const exists = await this.rGet(key)

		if (exists) {
			return true // Is duplicate
		}

		// Mark as sent
		await this.rSet(key, '1', NOTIFICATION_RATE_LIMITS.DUPLICATE_COOLDOWN)
		return false
	}

	/**
	 * Generate notification hash for duplicate detection
	 */
	private generateNotificationHash(data: any): string {
		return createHash('sha256').update(JSON.stringify(data)).digest('hex').substring(0, 16)
	}

	// ==================== 2FA Security Notifications ====================

	/**
	 * Notify user when a new 2FA method is added
	 */
	async notify2FAMethodAdded(
		user: User,
		methodType: E2FAMethod,
		methodName: string | null | undefined,
		lng: Language = 'en',
	): Promise<INotificationResult[]> {
		const data: I2FAMethodNotificationData = {
			user,
			language: lng,
			category: ENotificationCategory.SECURITY,
			priority: ENotificationPriority.HIGH,
			methodType,
			methodName: methodName || undefined,
			action: '2fa_method_added',
		}

		return this.sendNotification(data, () =>
			this.mailService.send2FAMethodAddedEmail(user.email, methodType, methodName || undefined, lng),
		)
	}

	/**
	 * Notify user when a 2FA method is removed
	 */
	async notify2FAMethodRemoved(
		user: User,
		methodType: E2FAMethod,
		methodName: string | null | undefined,
		lng: Language = 'en',
	): Promise<INotificationResult[]> {
		const data: I2FAMethodNotificationData = {
			user,
			language: lng,
			category: ENotificationCategory.SECURITY,
			priority: ENotificationPriority.HIGH,
			methodType,
			methodName: methodName || undefined,
			action: '2fa_method_removed',
		}

		return this.sendNotification(data, () =>
			this.mailService.send2FAMethodRemovedEmail(user.email, methodType, methodName || undefined, lng),
		)
	}

	/**
	 * Notify user when 2FA is completely disabled
	 */
	async notify2FADisabled(user: User, lng: Language = 'en'): Promise<INotificationResult[]> {
		const data: I2FAMethodNotificationData = {
			user,
			language: lng,
			category: ENotificationCategory.SECURITY,
			priority: ENotificationPriority.CRITICAL,
			methodType: 'BACKUP_CODE' as E2FAMethod, // Placeholder
			action: '2fa_disabled',
		}

		return this.sendNotification(data, () => this.mailService.send2FADisabledEmail(user.email, lng))
	}

	// ==================== Device & Login Notifications ====================

	/**
	 * Notify user about login from a new device
	 */
	async notifyNewDeviceLogin(
		user: User,
		device: ISessionMetadata,
		lng: Language = 'en',
	): Promise<INotificationResult[]> {
		const data: IDeviceLoginNotificationData = {
			user,
			language: lng,
			category: ENotificationCategory.SECURITY,
			priority: ENotificationPriority.HIGH,
			device,
		}

		// Check for duplicate (same device, same day)
		const hash = this.generateNotificationHash({
			userId: user.id,
			device: device.device,
			date: new Date().toDateString(),
		})
		const isDuplicate = await this.checkDuplicate(user.id, hash)
		if (isDuplicate) {
			this.logger.debug(`Skipping duplicate new device notification for user ${user.id}`)
			return []
		}

		return this.sendNotification(data, () => this.mailService.sendNewDeviceLoginEmail(user.email, device, lng))
	}

	/**
	 * Notify user about suspicious login activity
	 */
	async notifySuspiciousActivity(
		user: User,
		eventDescription: string,
		riskScore: number,
		lng: Language = 'en',
	): Promise<INotificationResult[]> {
		const data: ISuspiciousActivityNotificationData = {
			user,
			language: lng,
			category: ENotificationCategory.SECURITY,
			priority: riskScore >= 80 ? ENotificationPriority.CRITICAL : ENotificationPriority.HIGH,
			eventDescription,
			riskScore,
		}

		return this.sendNotification(data, () =>
			this.mailService.sendSuspiciousActivityEmail(user.email, eventDescription, riskScore, lng),
		)
	}

	// ==================== Backup Codes Notifications ====================

	/**
	 * Notify user when backup codes are running low
	 */
	async notifyLowBackupCodes(user: User, remaining: number, lng: Language = 'en'): Promise<INotificationResult[]> {
		const data: IBackupCodesNotificationData = {
			user,
			language: lng,
			category: ENotificationCategory.SECURITY,
			priority: ENotificationPriority.NORMAL,
			remaining,
			action: 'low_codes',
		}

		return this.sendNotification(data, () => this.mailService.sendLowBackupCodesEmail(user.email, remaining, lng))
	}

	/**
	 * Notify user when backup codes are regenerated
	 */
	async notifyBackupCodesRegenerated(user: User, lng: Language = 'en'): Promise<INotificationResult[]> {
		const data: IBackupCodesNotificationData = {
			user,
			language: lng,
			category: ENotificationCategory.SECURITY,
			priority: ENotificationPriority.NORMAL,
			action: 'codes_regenerated',
		}

		return this.sendNotification(data, () => this.mailService.sendBackupCodesRegeneratedEmail(user.email, lng))
	}

	// ==================== Admin Action Notifications ====================

	/**
	 * Notify user when 2FA is disabled by administrator
	 */
	async notify2FADisabledByAdmin(
		user: User,
		adminEmail: string,
		reason: string,
		lng: Language = 'en',
	): Promise<INotificationResult[]> {
		const data: IAdminActionNotificationData = {
			user,
			language: lng,
			category: ENotificationCategory.ADMIN,
			priority: ENotificationPriority.CRITICAL,
			adminEmail,
			reason,
			action: '2fa_disabled',
		}

		return this.sendNotification(data, () =>
			this.mailService.send2FADisabledByAdminEmail(user.email, adminEmail, reason, lng),
		)
	}

	/**
	 * Notify user when a device is revoked by administrator
	 */
	async notifyDeviceRevokedByAdmin(
		user: User,
		deviceName: string,
		adminEmail: string,
		reason: string,
		lng: Language = 'en',
	): Promise<INotificationResult[]> {
		const data: IAdminActionNotificationData = {
			user,
			language: lng,
			category: ENotificationCategory.ADMIN,
			priority: ENotificationPriority.HIGH,
			adminEmail,
			reason,
			action: 'device_revoked',
			deviceName,
		}

		return this.sendNotification(data, () =>
			this.mailService.sendDeviceRevokedByAdminEmail(user.email, deviceName, adminEmail, reason, lng),
		)
	}

	// ==================== Utility Methods ====================

	/**
	 * Check if user can receive notifications
	 */
	async canNotifyUser(user: User): Promise<boolean> {
		if (!user.isEmailVerified || !user.email) {
			return false
		}

		return void this.mailService.canSendEmail(user.email)
	}

	/**
	 * Get notification statistics for user
	 */
	async getUserNotificationStats(userId: string): Promise<{
		hourly: number
		daily: number
		limits: { hourly: number; daily: number }
	}> {
		const hourKey = NOTIFICATION_REDIS_KEYS.RATE_LIMIT_HOUR(userId)
		const dayKey = NOTIFICATION_REDIS_KEYS.RATE_LIMIT_DAY(userId)

		const hourCount = await this.rGet(hourKey)
		const dayCount = await this.rGet(dayKey)

		return {
			hourly: hourCount ? parseInt(hourCount, 10) : 0,
			daily: dayCount ? parseInt(dayCount, 10) : 0,
			limits: {
				hourly: NOTIFICATION_RATE_LIMITS.MAX_PER_HOUR,
				daily: NOTIFICATION_RATE_LIMITS.MAX_PER_DAY,
			},
		}
	}
}

```




`src/modules/notification/types/index.ts`


```typescript
export * from './notification.types'

```




`src/modules/notification/types/notification.types.ts`


```typescript
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
	device: ISessionMetadata
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




`src/modules/rbac/decorators/index.ts`


```typescript
export * from './roles.decorator'

```




`src/modules/rbac/decorators/roles.decorator.ts`


```typescript
/**
 * Decorator to assign required roles to a GraphQL resolver or REST endpoint.
 * Used in conjunction with RolesGuard to enforce role-based access control.
 *
 * @param {...EUserRole[]} roles - One or more roles that are allowed to access the resource.
 * @returns {MethodDecorator & ClassDecorator} A decorator function.
 *
 * @example
 * ```typescript
 * // Single role requirement
 * @Roles(EUserRole.SUPER_ADMIN)
 * @UseGuards(RolesGuard)
 * async deleteUser() { ... }
 *
 * // Multiple roles (user must have at least one)
 * @Roles(EUserRole.SUPER_ADMIN, EUserRole.MODERATOR)
 * @UseGuards(RolesGuard)
 * async moderateContent() { ... }
 * ```
 */
export const Roles = (...roles: EUserRole[]): MethodDecorator & ClassDecorator => SetMetadata(ROLES_KEY, roles)

```




`src/modules/rbac/guards/index.ts`


```typescript
export * from './roles.guard'

```




`src/modules/rbac/guards/roles.guard.ts`


```typescript
/**
 * Guard that checks if the current user has the required roles to access a resource.
 * Fetches the user's current roles from the database to ensure data freshness.
 *
 * @class RolesGuard
 * @implements {CanActivate}
 */
@Injectable()
export class RolesGuard implements CanActivate {
	private readonly logger = new Logger(RolesGuard.name)

	constructor(
		private readonly reflector: Reflector,
		private readonly prisma: PrismaService,
	) {}

	/**
	 * Determines if the current user is authorized to access the resource.
	 *
	 * @param {ExecutionContext} context - The execution context.
	 * @returns {Promise<boolean>} True if the user has the required roles, false otherwise.
	 * @throws {ForbiddenException} If the user lacks the required roles.
	 */
	async canActivate(context: ExecutionContext): Promise<boolean> {
		// Get required roles from decorator metadata
		const requiredRoles = this.reflector.getAllAndOverride<RequiredRoles>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		])

		// If no roles are required, allow access
		if (!requiredRoles || requiredRoles.length === 0) {
			return true
		}

		// Extract user from GraphQL context
		const gqlContext = GqlExecutionContext.create(context)
		const request = gqlContext.getContext().req
		const user = request?.user

		// User must be authenticated
		if (!user?.id) {
			this.logger.warn('RolesGuard: No authenticated user found in request')
			throw new ForbiddenException('Authentication required to access this resource')
		}

		// Fetch fresh roles from database
		const dbUser = await this.prisma.user.findUnique({
			where: { id: user.id },
			select: {
				id: true,
				email: true,
				roles: true,
			},
		})

		if (!dbUser) {
			this.logger.error(`RolesGuard: User ${user.id} not found in database`)
			throw new ForbiddenException('User not found')
		}

		// Check if user has at least one of the required roles
		const hasRequiredRole = requiredRoles.some(role => dbUser.roles.includes(role))

		if (!hasRequiredRole) {
			this.logger.warn(
				`RolesGuard: User ${dbUser.email} lacks required roles. ` +
					`Has: [${dbUser.roles.join(', ')}], Needs one of: [${requiredRoles.join(', ')}]`,
			)
			throw new ForbiddenException(
				'Insufficient permissions. You need one of the following roles: ' + requiredRoles.join(', '),
			)
		}

		this.logger.debug(`RolesGuard: User ${dbUser.email} authorized with roles [${dbUser.roles.join(', ')}]`)

		return true
	}
}

```



