# Full App Code (excluding imports, tests, i18n, extra core) - Part 5 of 8

`src/modules/libs/mail/providers/index.ts`


```typescript
export * from './brevo'
export * from './sendgrid'
export * from './email.provider.interface'
export * from './smtp.service'

```




`src/modules/libs/mail/providers/sendgrid/index.ts`


```typescript
export * from './sendgrid.service'

```




`src/modules/libs/mail/providers/sendgrid/sendgrid.service.ts`


```typescript
@Injectable()
export class SendgridService implements IEmailProvider {
	private sgMail: typeof sgMail

	constructor(
		private readonly config: ConfigService,
		private readonly i18n: I18nService,
	) {
		const apiKey = this.config.getOrThrow<string>('MAIL_SENDGRID_API_KEY')
		if (!apiKey) {
			throw new Error('API key is missing.')
		}
		sgMail.setApiKey(apiKey)
		this.sgMail = sgMail
	}

	/**
	 * Send mail method from Brove
	 * @param email - email address to
	 * @param subject - subject for email
	 * @param html - React, html email template
	 * @param lng - current language of user
	 * @returns - send mail
	 */
	async sendMail(email: string, subject: string, html: string, lng?: string): Promise<boolean> {
		try {
			await this.sgMail.send({
				to: email,
				from: `"${COMPANY_NAME}" <${this.config.getOrThrow<string>('MAIL_SENDGRID_SENDER')}>`,
				subject,
				html,
			})
			return true
		} catch (error) {
			console.log('[SENDGRID_ERROR] - ', error)
			throw new BadRequestException(
				this.i18n.t('mail.errors.message_send_failed', { lng }) || 'Failed to send the message.',
			)
		}
	}
}

```




`src/modules/libs/mail/providers/smtp.service.ts`


```typescript
@Injectable()
export class SmtpService implements IEmailProvider {
	constructor(
		private readonly mailer: MailerService,
		private readonly config: ConfigService,
	) {}

	async sendMail(email: string, subject: string, html: string): Promise<unknown> {
		return this.mailer.sendMail({
			from: `"${COMPANY_NAME}" <${this.config.getOrThrow<string>('MAIL_LOGIN')}>`,
			to: email,
			subject,
			html,
		})
	}
}

```




`src/modules/libs/mail/templates/2fa-security/2fa-disabled-by-admin.template.tsx`


```tsx
interface IProps {
	supportUrl: string
	settingsUrl: string
	i18n?: I18nService
	lng?: string
	adminEmail: string
	reason: string
	timestamp: string
}

export function TwoFADisabledByAdminTemplate({
	supportUrl,
	settingsUrl,
	i18n,
	lng = 'en',
	adminEmail,
	reason,
	timestamp,
}: IProps) {
	const t = i18n.t('mail.2fa_disabled_by_admin', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	return (
		<TemplateWrapper template="2fa_disabled_by_admin" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center text-purple-600">
						{t('title') || '👤 2FA Disabled by Administrator'}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME }) ||
							`An administrator has disabled two-factor authentication on your ${APP_NAME} account.`}
					</Text>

					<Section className="mb-4 mt-4 rounded-lg bg-purple-50 p-6 text-left">
						<Heading className="text-xl font-semibold text-purple-700">
							{t('action_details.title') || 'Administrative Action Details:'}
						</Heading>
						<ul className="mt-2 list-inside list-disc text-black">
							<li>
								{t('action_details.admin', { admin: adminEmail }) || `👤 Administrator: ${adminEmail}`}
							</li>
							<li>
								{t('action_details.action') || '🔓 Action: Two-Factor Authentication Disabled'}
							</li>
							<li>
								{t('action_details.time', { time: timestamp }) || `⏰ Time: ${timestamp}`}
							</li>
						</ul>
					</Section>

					<Section className="mb-4 rounded-lg bg-blue-50 p-4">
						<Heading className="text-lg font-semibold text-blue-700">
							{t('reason.title') || 'Reason Provided:'}
						</Heading>
						<Text className="mt-2 rounded bg-white p-3 italic text-gray-700">
							"{reason}"
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg bg-orange-50 p-4">
						<Text className="m-0 font-semibold text-orange-700">
							⚠️ {t('security_impact.title') || 'Security Impact'}
						</Text>
						<Text className="mt-2 text-gray-700">
							{t('security_impact.message') ||
								'Your account security has been reduced. We recommend re-enabling 2FA as soon as possible.'}
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg bg-gray-100 p-4">
						<Heading className="text-lg font-semibold text-gray-700">
							{t('questions.title') || 'Have Questions?'}
						</Heading>
						<Text className="mt-2 text-gray-700">
							{t('questions.message') ||
								'If you have questions about this action or believe it was made in error, please contact our support team.'}
						</Text>
					</Section>
				</Section>

				<div className="flex justify-center gap-4">
					<Button
						className="box-border w-fit rounded-lg bg-[#2B7AFF] px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
						href={settingsUrl}
					>
						{t('cta') || 'Re-Enable 2FA'}
					</Button>

					<Button
						className="box-border w-fit rounded-lg bg-gray-600 px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
						href={supportUrl}
					>
						{t('cta_secondary') || 'Contact Support'}
					</Button>
				</div>

				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint') || 'Security settings:'}
					</Text>
					<Link href={settingsUrl} className="w-full text-center text-sm font-sans tracking-[0px]">
						{settingsUrl}
					</Link>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}

```




`src/modules/libs/mail/templates/2fa-security/2fa-disabled.template.tsx`


```tsx
interface IProps {
	settingsUrl: string
	i18n?: I18nService
	lng?: string
	timestamp: string
}

export function TwoFADisabledTemplate({ settingsUrl, i18n, lng = 'en', timestamp }: IProps) {
	const t = i18n.t('mail.2fa_disabled', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	return (
		<TemplateWrapper template="2fa_disabled" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center text-red-600">
						{t('title') || '🚨 Two-Factor Authentication Disabled'}
					</Heading>

					<Text className="text-center font-semibold">
						{t('intro', { app: APP_NAME }) ||
							`Two-factor authentication has been completely disabled on your ${APP_NAME} account.`}
					</Text>

					<Section className="mb-4 mt-4 rounded-lg border-2 border-red-500 bg-red-50 p-6">
						<Heading className="text-xl font-bold text-red-700">
							⚠️ {t('critical_warning.title') || 'CRITICAL SECURITY ALERT'}
						</Heading>
						<Text className="mt-2 text-red-900">
							{t('critical_warning.message') ||
								'Your account is now significantly less secure. We strongly recommend re-enabling 2FA immediately.'}
						</Text>
						<ul className="mt-2 list-inside list-disc text-red-800">
							<li>{t('risks')[0] || 'Your account can now be accessed with just a password'}</li>
							<li>{t('risks')[1] || 'Unauthorized access is much easier for attackers'}</li>
							<li>{t('risks')[2] || 'Your data and privacy are at increased risk'}</li>
						</ul>
					</Section>

					<Section className="mb-4 rounded-lg bg-gray-100 p-4">
						<Text className="m-0 text-sm text-gray-600">
							{t('timestamp', { time: timestamp }) || `⏰ Disabled at: ${timestamp}`}
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg bg-yellow-50 p-4">
						<Text className="m-0 font-semibold text-orange-700">
							{t('legalNote')[0] || "If you didn't disable 2FA, your account may be compromised!"}
						</Text>
						<Text className="mt-2 text-gray-700">
							{t('legalNote')[1] || 'Take immediate action: change your password and re-enable 2FA now.'}
						</Text>
					</Section>
				</Section>

				<Button
					className="m-auto box-border w-fit rounded-lg bg-red-600 px-6 py-3 text-center font-sans font-bold tracking-wider text-white"
					href={settingsUrl}
				>
					{t('cta') || 'Re-Enable 2FA Now'}
				</Button>

				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint') || 'Or paste this link into your browser:'}
					</Text>
					<Link href={settingsUrl} className="w-full text-center text-sm font-sans tracking-[0px]">
						{settingsUrl}
					</Link>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}

```




`src/modules/libs/mail/templates/2fa-security/2fa-method-added.template.tsx`


```tsx
interface IProps {
	settingsUrl: string
	i18n?: I18nService
	lng?: string
	methodType: E2FAMethod
	methodName?: string
	timestamp: string
}

export function TwoFAMethodAddedTemplate({ settingsUrl, i18n, lng = 'en', methodType, methodName, timestamp }: IProps) {
	const t = i18n.t('mail.2fa_method_added', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	const methodDisplay = methodName || methodType

	return (
		<TemplateWrapper template="2fa_method_added" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center">
						{t('title') || '🔐 New 2FA Method Added'}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME, method: methodDisplay }) ||
							`A new two-factor authentication method (${methodDisplay}) was added to your ${APP_NAME} account.`}
					</Text>

					<Section className="mb-4 mt-4 rounded-lg bg-blue-50 p-6 text-left">
						<Heading className="text-xl font-semibold text-[#2B7AFF]">{t('details.title') || 'Method Details:'}</Heading>
						<ul className="mt-2 list-inside list-disc text-black">
							<li>{t('details.type', { type: methodType }) || `🔑 Type: ${methodType}`}</li>
							{methodName && <li>{t('details.name', { name: methodName }) || `📝 Name: ${methodName}`}</li>}
							<li>{t('details.timestamp', { time: timestamp }) || `⏰ Added: ${timestamp}`}</li>
						</ul>
					</Section>

					<Section className="mb-4 mt-4 rounded-lg bg-yellow-50 p-4">
						<Text className="m-0 font-semibold text-orange-700">
							⚠️ {t('legalNote') || "If you didn't make this change, your account may be compromised."}
						</Text>
						<Text className="mt-2 text-gray-700">
							{t('warning.action') ||
								'Please review your security settings immediately and remove any unauthorized methods.'}
						</Text>
					</Section>
				</Section>

				<Button
					className="m-auto box-border w-fit rounded-lg bg-[#2B7AFF] px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
					href={settingsUrl}
				>
					{t('cta') || 'Manage 2FA Settings'}
				</Button>

				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint') || 'Or paste this link into your browser:'}
					</Text>
					<Link href={settingsUrl} className="w-full text-center text-sm font-sans tracking-[0px]">
						{settingsUrl}
					</Link>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}

```




`src/modules/libs/mail/templates/2fa-security/2fa-method-removed.template.tsx`


```tsx
interface IProps {
	settingsUrl: string
	i18n?: I18nService
	lng?: string
	methodType: E2FAMethod
	methodName?: string
	timestamp: string
}

export function TwoFAMethodRemovedTemplate({
	settingsUrl,
	i18n,
	lng = 'en',
	methodType,
	methodName,
	timestamp,
}: IProps) {
	const t = i18n.t('mail.2fa_method_removed', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	const methodDisplay = methodName || methodType

	return (
		<TemplateWrapper template="2fa_method_removed" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center">
						{t('title') || '🔓 2FA Method Removed'}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME, method: methodDisplay }) ||
							`A two-factor authentication method (${methodDisplay}) was removed from your ${APP_NAME} account.`}
					</Text>

					<Section className="mb-4 mt-4 rounded-lg bg-gray-100 p-6 text-left">
						<Heading className="text-xl font-semibold text-[#2B7AFF]">{t('details.title') || 'Removed Method:'}</Heading>
						<ul className="mt-2 list-inside list-disc text-black">
							<li>{t('details.type', { type: methodType }) || `🔑 Type: ${methodType}`}</li>
							{methodName && <li>{t('details.name', { name: methodName }) || `📝 Name: ${methodName}`}</li>}
							<li>{t('details.timestamp', { time: timestamp }) || `⏰ Removed: ${timestamp}`}</li>
						</ul>
					</Section>

					<Section className="mb-4 mt-4 rounded-lg bg-red-50 p-4">
						<Text className="m-0 font-semibold text-red-700">
							⚠️ {t('warning.message') || 'Removing 2FA methods reduces your account security.'}
						</Text>
						<Text className="mt-2 text-gray-700">
							{t('warning.action') ||
								"If you didn't remove this method, please secure your account immediately and add it back."}
						</Text>
					</Section>
				</Section>

				<Button
					className="m-auto box-border w-fit rounded-lg bg-[#2B7AFF] px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
					href={settingsUrl}
				>
					{t('cta') || 'Review Security Settings'}
				</Button>

				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint') || 'Or paste this link into your browser:'}
					</Text>
					<Link href={settingsUrl} className="w-full text-center text-sm font-sans tracking-[0px]">
						{settingsUrl}
					</Link>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}

```




`src/modules/libs/mail/templates/2fa-security/backup-codes-regenerated.template.tsx`


```tsx
interface IProps {
	settingsUrl: string
	i18n?: I18nService
	lng?: string
	timestamp: string
}

export function BackupCodesRegeneratedTemplate({ settingsUrl, i18n, lng = 'en', timestamp }: IProps) {
	const t = i18n.t('mail.backup_codes_regenerated', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	return (
		<TemplateWrapper template="backup_codes_regenerated" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center">
						{t('title') || '✅ Backup Codes Regenerated'}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME }) || `Your ${APP_NAME} backup codes have been successfully regenerated.`}
					</Text>

					<Section className="mb-4 mt-4 rounded-lg bg-green-50 p-6 text-center">
						<div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-green-200">
							<Text className="m-0 text-4xl">✅</Text>
						</div>
						<Text className="m-0 text-lg font-semibold text-green-700">
							{t('success_message') || 'New backup codes generated successfully'}
						</Text>
						<Text className="mt-2 text-sm text-gray-600">
							{t('timestamp', { time: timestamp }) || `Generated at: ${timestamp}`}
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg border-2 border-red-500 bg-red-50 p-4">
						<Text className="m-0 font-bold text-red-700">🚨 {t('important.title') || 'IMPORTANT NOTICE'}</Text>
						<Text className="mt-2 text-red-900">
							{t('legalNote') || 'All your previous backup codes are now INVALID and cannot be used.'}
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg bg-blue-50 p-4">
						<Heading className="text-lg font-semibold text-blue-700">
							{t('next_steps.title') || 'Next Steps:'}
						</Heading>
						<ol className="mt-2 list-inside list-decimal text-gray-700">
							<li>{t('next_steps.steps')[0] || 'Log in to your account to view your new codes'}</li>
							<li>{t('next_steps.steps')[1] || 'Download or print them immediately'}</li>
							<li>{t('next_steps.steps')[2] || 'Store them in a secure location (password manager, safe)'}</li>
							<li>{t('next_steps.steps')[3] || 'Never share them with anyone'}</li>
						</ol>
					</Section>

					<Section className="mb-4 rounded-lg bg-yellow-50 p-4">
						<Text className="m-0 font-semibold text-orange-700">
							⚠️ {t('security_reminder.title') || 'Security Reminder'}
						</Text>
						<Text className="mt-2 text-gray-700">
							{t('security_reminder.message') ||
								'Each backup code can only be used once. Once used, it becomes invalid permanently.'}
						</Text>
					</Section>
				</Section>

				<Button
					className="m-auto box-border w-fit rounded-lg bg-[#2B7AFF] px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
					href={settingsUrl}
				>
					{t('cta') || 'View New Backup Codes'}
				</Button>

				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint') || 'Or paste this link into your browser:'}
					</Text>
					<Link href={settingsUrl} className="w-full text-center text-sm font-sans tracking-[0px]">
						{settingsUrl}
					</Link>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}

```




`src/modules/libs/mail/templates/2fa-security/device-revoked-by-admin.template.tsx`


```tsx
interface IProps {
	supportUrl: string
	securityUrl: string
	i18n?: I18nService
	lng?: string
	deviceName: string
	adminEmail: string
	reason: string
	timestamp: string
}

export function DeviceRevokedByAdminTemplate({
	supportUrl,
	securityUrl,
	i18n,
	lng = 'en',
	deviceName,
	adminEmail,
	reason,
	timestamp,
}: IProps) {
	const t = i18n.t('mail.device_revoked_by_admin', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	return (
		<TemplateWrapper template="device_revoked_by_admin" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center text-purple-600">
						{t('title') || '🚫 Device Revoked by Administrator'}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME, device: deviceName }) ||
							`An administrator has revoked device "${deviceName}" from your ${APP_NAME} account.`}
					</Text>

					<Section className="mb-4 mt-4 rounded-lg bg-purple-50 p-6 text-left">
						<Heading className="text-xl font-semibold text-purple-700">
							{t('action_details.title') || 'Administrative Action Details:'}
						</Heading>
						<ul className="mt-2 list-inside list-disc text-black">
							<li>
								{t('action_details.admin', { admin: adminEmail }) || `👤 Administrator: ${adminEmail}`}
							</li>
							<li>
								{t('action_details.device', { device: deviceName }) || `📱 Device: ${deviceName}`}
							</li>
							<li>
								{t('action_details.action') || '🚫 Action: Device Revoked'}
							</li>
							<li>
								{t('action_details.time', { time: timestamp }) || `⏰ Time: ${timestamp}`}
							</li>
						</ul>
					</Section>

					<Section className="mb-4 rounded-lg bg-blue-50 p-4">
						<Heading className="text-lg font-semibold text-blue-700">
							{t('reason.title') || 'Reason Provided:'}
						</Heading>
						<Text className="mt-2 rounded bg-white p-3 italic text-gray-700">
							"{reason}"
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg bg-red-50 p-4">
						<Text className="m-0 font-semibold text-red-700">
							⚠️ {t('impact.title') || 'What this means:'}
						</Text>
						<ul className="mt-2 list-inside list-disc text-gray-700">
							<li>{t('impact.items')[0] || 'This device is no longer trusted for your account'}</li>
							<li>{t('impact.items')[1] || 'All active sessions from this device have been terminated'}</li>
							<li>{t('impact.items')[2] || 'You will need to log in again from this device'}</li>
							<li>{t('impact.items')[3] || '2FA verification will be required on next login'}</li>
						</ul>
					</Section>

					<Section className="mb-4 rounded-lg bg-yellow-50 p-4">
						<Text className="m-0 font-semibold text-orange-700">
							💡 {t('next_steps.title') || 'What should you do?'}
						</Text>
						<ul className="mt-2 list-inside list-disc text-gray-700">
							<li>{t('next_steps.items')[0] || 'Review your recent security activity'}</li>
							<li>{t('next_steps.items')[1] || 'Contact support if you believe this was done in error'}</li>
							<li>{t('next_steps.items')[2] || 'Update your security settings if needed'}</li>
						</ul>
					</Section>
				</Section>

				<div className="flex justify-center gap-4">
					<Button
						className="box-border w-fit rounded-lg bg-[#2B7AFF] px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
						href={securityUrl}
					>
						{t('cta') || 'Review Security'}
					</Button>

					<Button
						className="box-border w-fit rounded-lg bg-gray-600 px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
						href={supportUrl}
					>
						{t('cta_secondary') || 'Contact Support'}
					</Button>
				</div>

				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint') || 'Security page:'}
					</Text>
					<Link href={securityUrl} className="w-full text-center text-sm font-sans tracking-[0px]">
						{securityUrl}
					</Link>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}

```




`src/modules/libs/mail/templates/2fa-security/index.ts`


```typescript
// 2FA Security Notifications
export * from './2fa-method-added.template'
export * from './2fa-method-removed.template'
export * from './2fa-disabled.template'

// Device & Login
export * from './2fa-disabled.template'
export * from './suspicious-activity.template'

// Backup Codes
export * from './new-device-login.template'
export * from './low-backup-codes.template'
export * from './backup-codes-regenerated.template'

// Admin Actions
export * from './2fa-disabled-by-admin.template'
export * from './backup-codes-regenerated.template'
export * from './device-revoked-by-admin.template'

```




`src/modules/libs/mail/templates/2fa-security/low-backup-codes.template.tsx`


```tsx
interface IProps {
	settingsUrl: string
	i18n?: I18nService
	lng?: string
	remaining: number
	threshold: number
}

export function LowBackupCodesTemplate({ settingsUrl, i18n, lng = 'en', remaining, threshold }: IProps) {
	const t = i18n.t('mail.low_backup_codes', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	return (
		<TemplateWrapper template="low_backup_codes" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center text-orange-600">
						{t('title') || '⚠️ Running Low on Backup Codes'}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME, remaining }) ||
							`Your ${APP_NAME} account has only ${remaining} backup codes remaining.`}
					</Text>

					<Section className="mb-4 mt-4 rounded-lg bg-orange-50 p-6 text-center">
						<div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-orange-200">
							<Text className="m-0 text-4xl font-bold text-orange-700">{remaining}</Text>
						</div>
						<Text className="m-0 text-lg font-semibold text-orange-700">
							{t('remaining_label', { count: remaining }) || `${remaining} codes left`}
						</Text>
						<Text className="mt-2 text-sm text-gray-600">
							{t('threshold_info', { threshold }) || `Warning threshold: ${threshold} codes`}
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg bg-blue-50 p-4">
						<Heading className="text-lg font-semibold text-blue-700">
							{t('what_are.title') || 'What are backup codes?'}
						</Heading>
						<Text className="mt-2 text-gray-700">
							{t('what_are.description') ||
								'Backup codes are one-time use codes that allow you to access your account if you lose access to your 2FA device.'}
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg bg-yellow-50 p-4">
						<Text className="m-0 font-semibold text-orange-700">
							⚠️ {t('recommendation.title') || 'Action Required'}
						</Text>
						<Text className="mt-2 text-gray-700">
							{t('recommendation.message') ||
								'We recommend regenerating your backup codes before you run out. Each code can only be used once.'}
						</Text>
						<ul className="mt-2 list-inside list-disc text-gray-700">
							<li>{t('recommendation.steps')[0] || 'Generate new backup codes'}</li>
							<li>{t('recommendation.steps')[1] || 'Save them in a secure location'}</li>
							<li>{t('recommendation.steps')[2] || 'Old codes will be invalidated'}</li>
						</ul>
					</Section>
				</Section>

				<Button
					className="m-auto box-border w-fit rounded-lg bg-orange-600 px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
					href={settingsUrl}
				>
					{t('cta') || 'Regenerate Backup Codes'}
				</Button>

				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint') || 'Or paste this link into your browser:'}
					</Text>
					<Link href={settingsUrl} className="w-full text-center text-sm font-sans tracking-[0px]">
						{settingsUrl}
					</Link>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}

```




`src/modules/libs/mail/templates/2fa-security/new-device-login.template.tsx`


```tsx
interface IProps {
	securityUrl: string
	i18n?: I18nService
	lng?: string
	metadata: ISessionMetadata
	timestamp: string
}

export function NewDeviceLoginTemplate({ securityUrl, i18n, lng = 'en', metadata, timestamp }: IProps) {
	const t = i18n.t('mail.new_device_login', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	return (
		<TemplateWrapper template="new_device_login" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center">
						{t('title') || '🔐 New Device Login Detected'}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME }) ||
							`We detected a login to your ${APP_NAME} account from a new device or location.`}
					</Text>

					<Section className="mb-4 mt-4 rounded-lg bg-blue-50 p-6 text-left">
						<Heading className="text-xl font-semibold text-[#2B7AFF]">{t('login_details.title') || 'Login Details:'}</Heading>
						<ul className="mt-2 list-inside list-disc text-black">
							<li>
								{t('login_details.location', {
									country: metadata.location.country,
									city: metadata.location.city,
								}) || `🌍 Location: ${metadata.location.country}, ${metadata.location.city}`}
							</li>
							<li>
								{t('login_details.device', { device: metadata.device.type }) || `📱 Device: ${metadata.device.type}`}
							</li>
							<li>{t('login_details.os', { os: metadata.device.os }) || `💻 OS: ${metadata.device.os}`}</li>
							<li>
								{t('login_details.browser', { browser: metadata.device.browser }) ||
									`🌐 Browser: ${metadata.device.browser}`}
							</li>
							<li>{t('login_details.ip', { ip: metadata.ip }) || `🔢 IP: ${metadata.ip}`}</li>
							<li>{t('login_details.time', { time: timestamp }) || `⏰ Time: ${timestamp}`}</li>
						</ul>
					</Section>

					<Section className="mb-4 rounded-lg bg-green-50 p-4">
						<Text className="m-0 font-semibold text-green-700">
							✅ {t('recognized.title') || 'Was this you?'}
						</Text>
						<Text className="mt-2 text-gray-700">
							{t('recognized.message') || 'If you recognize this activity, no action is needed.'}
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg bg-red-50 p-4">
						<Text className="m-0 font-semibold text-red-700">
							⚠️ {t('unrecognized.title') || "Wasn't you?"}
						</Text>
						<Text className="mt-2 text-gray-700">
							{t('unrecognized.message') ||
								'If you did NOT perform this login, your account may be compromised. Secure it immediately!'}
						</Text>
					</Section>
				</Section>

				<Button
					className="m-auto box-border w-fit rounded-lg bg-[#2B7AFF] px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
					href={securityUrl}
				>
					{t('cta') || 'Review Security Activity'}
				</Button>

				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint') || 'Or paste this link into your browser:'}
					</Text>
					<Link href={securityUrl} className="w-full text-center text-sm font-sans tracking-[0px]">
						{securityUrl}
					</Link>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}

```




`src/modules/libs/mail/templates/2fa-security/suspicious-activity.template.tsx`


```tsx
interface IProps {
	securityUrl: string
	lockAccountUrl: string
	i18n?: I18nService
	lng?: string
	eventDescription: string
	riskScore: number
	timestamp: string
}

export function SuspiciousActivityTemplate({
	securityUrl,
	lockAccountUrl,
	i18n,
	lng = 'en',
	eventDescription,
	riskScore,
	timestamp,
}: IProps) {
	const t = i18n.t('mail.suspicious_activity', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	const riskLevel = riskScore >= 80 ? 'CRITICAL' : riskScore >= 60 ? 'HIGH' : 'MEDIUM'
	const riskColor = riskLevel === 'CRITICAL' ? 'red' : riskLevel === 'HIGH' ? 'orange' : 'yellow'

	return (
		<TemplateWrapper template="suspicious_activity" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center text-red-600">
						{t('title') || '🚨 Suspicious Activity Detected'}
					</Heading>

					<Text className="text-center font-semibold">
						{t('intro', { app: APP_NAME }) ||
							`We detected suspicious activity on your ${APP_NAME} account that requires your attention.`}
					</Text>

					<Section className={`mb-4 mt-4 rounded-lg border-2 border-${riskColor}-500 bg-${riskColor}-50 p-6`}>
						<Heading className={`text-xl font-bold text-${riskColor}-700`}>
							⚠️ {t('alert.title', { level: riskLevel }) || `${riskLevel} RISK DETECTED`}
						</Heading>
						<Text className={`mt-2 text-${riskColor}-900`}>
							{eventDescription}
						</Text>
						<div className="mt-4 rounded bg-white p-3">
							<Text className="m-0 text-sm font-semibold text-gray-700">
								{t('risk_score') || 'Risk Score:'}
							</Text>
							<div className="mt-2 h-4 w-full overflow-hidden rounded-full bg-gray-200">
								<div
									className={`h-full bg-${riskColor}-600`}
									style={{ width: `${riskScore}%` }}
								/>
							</div>
							<Text className="mt-1 text-right text-xs text-gray-600">
								{riskScore}/100
							</Text>
						</div>
					</Section>

					<Section className="mb-4 rounded-lg bg-gray-100 p-4">
						<Text className="m-0 text-sm text-gray-600">
							{t('timestamp', { time: timestamp }) || `⏰ Detected at: ${timestamp}`}
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg bg-blue-50 p-4">
						<Heading className="text-lg font-semibold text-blue-700">
							{t('what_to_do.title') || 'What should you do?'}
						</Heading>
						<ol className="mt-2 list-inside list-decimal text-gray-700">
							<li>{t('what_to_do.steps')[0] || 'Review your recent security activity'}</li>
							<li>{t('what_to_do.steps')[1] || 'Change your password if you suspect unauthorized access'}</li>
							<li>{t('what_to_do.steps')[2] || 'Enable 2FA if not already enabled'}</li>
							<li>{t('what_to_do.steps')[3] || 'Lock your account if you did not perform this action'}</li>
						</ol>
					</Section>
				</Section>

				<div className="flex justify-center gap-4">
					<Button
						className="box-border w-fit rounded-lg bg-[#2B7AFF] px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
						href={securityUrl}
					>
						{t('cta') || 'Review Activity'}
					</Button>

					<Button
						className="box-border w-fit rounded-lg bg-red-600 px-6 py-3 text-center font-sans font-bold tracking-wider text-white"
						href={lockAccountUrl}
					>
						{t('cta_secondary') || 'Lock My Account'}
					</Button>
				</div>

				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint') || 'Security review link:'}
					</Text>
					<Link href={securityUrl} className="w-full text-center text-sm font-sans tracking-[0px]">
						{securityUrl}
					</Link>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}

```




`src/modules/libs/mail/templates/authentication/index.ts`


```typescript
export * from './otp-code.template'
export * from './password-changed.template'
export * from './password-reset-confirmation.template'
export * from './reset-password.template'
export * from './verification-email.template'

```




`src/modules/libs/mail/templates/authentication/otp-code.template.tsx`


```tsx
interface IProps {
  code: string;
  i18n?: I18nService;
  lng?: string;
}

export function OtpCodeTemplate({ code, i18n, lng = 'en' }: IProps) {
  const t = i18n.t('mail.otp_code', { lng });

  return (
    <TemplateWrapper template='otp_code' lng={lng} i18n={i18n}>
      <Tailwind>
        <Section className="font-sans text-center mb-4 px-2">
          <Heading as="h2" className="text-2xl font-bold">
            {t('title') || "Your Verification Code"}
          </Heading>
          <Text className="text-base text-gray-600">
            {t('intro') || "Use the following code to complete your verification. This code is valid for 5 minutes."}
          </Text>
        </Section>
        
        <Section className="text-center my-8">
          <Text className="inline-block bg-gray-100 px-8 py-4 rounded-lg text-4xl font-bold tracking-widest">
            {code}
          </Text>
        </Section>
      </Tailwind>
    </TemplateWrapper>
  );
}

```




`src/modules/libs/mail/templates/authentication/password-changed.template.tsx`


```tsx
interface IPasswordChangedProps {
	metadata: ISessionMetadata
	i18n: I18nService
	lng?: string
}

export function PasswordChangedTemplate({ metadata, i18n, lng = 'en' }: IPasswordChangedProps) {
	const t = i18n.t('mail.password_changed', { lng })

	const securityUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/security/activity`
	const supportUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/support`

	const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US', {
		dateStyle: 'long',
		timeStyle: 'short',
	})

	return (
		<TemplateWrapper template="password_changed" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center">
						{t('title') || '🔒 Password Changed Successfully'}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME }) ||
							`This is to let you know that the password for your ${APP_NAME} account was changed successfully.`}
					</Text>
				</Section>

				{/* Security Details */}
				<Section className="mb-4 rounded-lg border border-[#e0e0e0] bg-[#f9f9f9] px-4 py-3">
					<Text className="mb-2 font-semibold text-[#333]">
						{t('details.title') || 'Change Details:'}
					</Text>

					<Text className="m-0 text-sm text-[#555]">
						⏰ <strong>{t('details.timestamp') || 'Time'}:</strong> {timestamp}
					</Text>

					{metadata.ip && (
						<Text className="m-0 text-sm text-[#555]">
							💻 <strong>{t('details.ip') || 'IP Address'}:</strong> {metadata.ip}
						</Text>
					)}

					{metadata.location && (
						<Text className="m-0 text-sm text-[#555]">
							🌍 <strong>{t('details.location') || 'Location'}:</strong>{' '}
							{metadata.location.city}, {metadata.location.country}
						</Text>
					)}

					{metadata.device && (
						<>
							<Text className="m-0 text-sm text-[#555]">
								🌐 <strong>{t('details.browser') || 'Browser'}:</strong> {metadata.device.browser}
							</Text>
							<Text className="m-0 text-sm text-[#555]">
								📱 <strong>{t('details.os') || 'Operating System'}:</strong> {metadata.device.os}
							</Text>
						</>
					)}
				</Section>

				{/* Warning Section */}
				<Section className="mb-4 rounded-lg border-l-4 border-[#ffc107] bg-[#fff3cd] px-4 py-3">
					<Text className="m-0 text-sm font-semibold text-[#856404]">
						⚠️ {t('warning.title') || "Wasn't you?"}
					</Text>
					<Text className="m-0 text-sm text-[#856404]">
						{t('warning.message') ||
							'If you did not make this change, your account may be compromised. Please contact support immediately.'}
					</Text>
				</Section>

				{/* Action Buttons */}
				<Section className="text-center">
					<Button
						className="m-auto box-border w-fit rounded-lg bg-[#007bff] px-6 py-3 text-center font-sans font-normal text-white traking-wider"
						href={securityUrl}
					>
						{t('cta.security') || 'View Security Activity'}
					</Button>
				</Section>

				<Section className="mt-4 text-center">
					<Button
						className="m-auto box-border w-fit rounded-lg bg-[#6c757d] px-6 py-3 text-center font-sans font-normal text-white traking-wider"
						href={supportUrl}
					>
						{t('cta.support') || 'Contact Support'}
					</Button>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}

```




`src/modules/libs/mail/templates/authentication/password-reset-confirmation.template.tsx`


```tsx
export interface IPasswordResetConfirmationProps {
    enable2faUrl: string
    securityUrl: string
    timestamp: string
    metadata: ISessionMetadata
	i18n: I18nService
	lng?: string
}

export function PasswordResetConfirmationTemplate({
    enable2faUrl,
    securityUrl,
    timestamp,
	metadata,
	i18n,
	lng = 'en',
}: IPasswordResetConfirmationProps) {
	const t = i18n.t('mail.password_reset_confirmation', { lng })

	

	return (
		<TemplateWrapper template="password_reset_confirmation" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center">
						{t('title', { defaultValue: '✅ Password Reset Successful' })}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME, defaultValue: `Your password reset request has been completed successfully. You can now log in with your new password.` }) }
					</Text>
				</Section>

				{/* Success Banner */}
				<Section className="mb-4 rounded-lg border-l-4 border-[#28a745] bg-[#d4edda] px-4 py-3">
					<Text className="m-0 text-sm font-semibold text-[#155724]">
						✅ {t('success.title', { defaultValue: 'Password Reset Successful' })}
					</Text>
					<Text className="m-0 text-sm text-[#155724]">
						{t('success.message', { defaultValue: 'Your password has been reset and you can now log in with your new password.'}) }
					</Text>
				</Section>

				{/* Reset Details */}
				<Section className="mb-4 rounded-lg border border-[#e0e0e0] bg-[#f9f9f9] px-4 py-3">
					<Text className="mb-2 font-semibold text-[#333]">
						{t('details.title', { defaultValue: '🔍 Password Reset Details' })}
					</Text>

					<Text className="m-0 text-sm text-[#555]">
						⏰ <strong>{t('details.timestamp', { defaultValue: 'Reset Time' })}:</strong> {timestamp}
					</Text>

					{metadata.ip && (
						<Text className="m-0 text-sm text-[#555]">
							💻 <strong>{t('details.ip', { defaultValue: 'IP Address'})}:</strong> {metadata.ip}
						</Text>
					)}

					{metadata.location && (
						<Text className="m-0 text-sm text-[#555]">
							🌍 <strong>{t('details.location', { defaultValue: 'Location'})}:</strong>{' '}
							{metadata.location.city}, {metadata.location.country}
						</Text>
					)}

					{metadata.device && (
						<>
							<Text className="m-0 text-sm text-[#555]">
								🌐 <strong>{t('details.browser', { defaultValue: 'Browser' })}:</strong> {metadata.device.browser}
							</Text>
							<Text className="m-0 text-sm text-[#555]">
								📱 <strong>{t('details.os', { defaultValue: 'Operating System' })}:</strong> {metadata.device.os}
							</Text>
						</>
					)}
				</Section>

				{/* Security Recommendations */}
				<Section className="mb-4 rounded-lg border-l-4 border-[#007bff] bg-[#e7f3ff] px-4 py-3">
					<Text className="mb-2 font-semibold text-[#004085]">
						🔐 {t('recommendations.title', { defaultValue: 'Security Recommendations' })}
					</Text>
					<ul className="m-0 pl-5 text-sm text-[#004085]">
						<li>
							{t('recommendations.enable_2fa', { defaultValue: 'Enable two-factor authentication (2FA) for additional security' })}
						</li>
						<li>
							{t('recommendations.unique_password', { defaultValue: 'Use a unique password that you don\'t use on other websites' })}
						</li>
						<li>
							{t('recommendations.review_activity', { defaultValue: 'Review your recent security activity regularly' })}
						</li>
						<li>{t('recommendations.never_share', { defaultValue: 'Never share your password with anyone' })}</li>
					</ul>
				</Section>

				{/* Action Buttons */}
				<Section className="text-center">
					<Button
						className="m-auto box-border w-fit rounded-lg bg-[#28a745] px-6 py-3 text-center font-sans font-normal text-white traking-wider"
						href={enable2faUrl}
					>
						{t('cta.enable_2fa', { defaultValue: 'Enable 2FA Now' })}
					</Button>
				</Section>

				<Section className="mt-4 text-center">
					<Text className="m-0 text-sm">
						<a href={securityUrl} className="text-[#007bff] no-underline">
							{t('cta.security', { defaultValue: 'View Security Activity' })}
						</a>
					</Text>
				</Section>

				{/* Warning Footer */}
				<Section className="mt-4 px-2">
					<Text className="m-0 text-center text-xs text-[#656565]">
						{t('warning', { defaultValue: "If you did not request this password reset, please contact support immediately." })
}
					</Text>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}

```




`src/modules/libs/mail/templates/authentication/reset-password.template.tsx`


```tsx
export interface IResetPasswordProps {
	url: string
	metadata: ISessionMetadata
	i18n: I18nService
	lng?: string
}

export function ResetPasswordTemplate({ url, metadata, i18n, lng = 'en' }: IResetPasswordProps) {
	const t = i18n.t('mail.reset_password', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US', {
		dateStyle: 'long',
		timeStyle: 'short',
	})

	return (
		<TemplateWrapper template="reset_password" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center">
						{t('title', { defaultValue: 'Reset your password' })}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME, defaultValue: `We received a request to reset the password for your ${APP_NAME} account. If this was you, click the button below to choose a new password.`})}
					</Text>
				</Section>

				{/* Main CTA Button */}
				<Section className="text-center">
					<Button
						className="m-auto box-border w-fit rounded-lg bg-[#2B7AFF] px-6 py-3 text-center font-sans font-normal text-white traking-wider"
						href={url}
					>
						{t('cta', { defaultValue: 'Create new password' })}
					</Button>
				</Section>

				{/* Link fallback */}
				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans text-sm font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint', { defaultValue: 'Or paste this link into your browser:' })}
					</Text>
					<Link href={url} className="w-full text-center text-sm font-sans tracking-[0px]">
						{url}
					</Link>
				</Section>

				{/* Request Details */}
				<Section className="mt-6 mb-4 rounded-lg border border-[#e0e0e0] bg-[#f9f9f9] px-4 py-3">
					<Text className="mb-2 font-semibold text-[#333]">
						{t('request_info.title', { defaultValue: 'Request details:' })}
					</Text>

					<Text className="m-0 text-sm text-[#555]">
						⏰ <strong>{t('time', { ip: metadata.ip, defaultValue: `💻 IP address: ${metadata.ip}` })}:</strong> {timestamp}
					</Text>

					{metadata.ip && (
						<Text className="m-0 text-sm text-[#555]">
							{t('request_info.ip', { ip: metadata.ip, defaultValue: `💻 IP address: ${metadata.ip}` }) }
						</Text>
					)}

					{metadata.location && (
						<Text className="m-0 text-sm text-[#555]">
							{t('request_info.location', {
								country: metadata.location.country,
								city: metadata.location.city,
								defaultValue: `🌍 Location: ${metadata.location.city}, ${metadata.location.country}`,
							})}
						</Text>
					)}

					{metadata.device?.browser && (
						<Text className="m-0 text-sm text-[#555]">
							{t('request_info.browser', { browser: metadata.device.browser, defaultValue: `🌐 Browser: ${metadata.device.browser}` })}
						</Text>
					)}

					{metadata.device?.os && (
						<Text className="m-0 text-sm text-[#555]">
							{t('request_info.os', { os: metadata.device.os,  defaultValue: `📱 Operating system: ${metadata.device.os}`})}
						</Text>
					)}
				</Section>

				{/* Warning if user didn't request */}
				<Section className="mb-4 rounded-lg border-l-4 border-[#ffc107] bg-[#fff3cd] px-4 py-3">
					<Text className="m-0 text-sm font-semibold text-[#856404]">
						⚠️ {t('wasnt_you', { defaultValue: 'Wasn’t you?' })}
					</Text>
					<Text className="m-0 text-sm text-[#856404]">
						{t('request_info.note', { defaultValue: "If you didn't initiate this request, please ignore this message." })}
					</Text>
				</Section>

				{/* Token expiry notice */}
				<Section className="mt-4 px-2">
					<Text className="m-0 text-center text-xs text-[#656565]">
						 {t('valid_link', { defaultValue: 'This link is valid for 1 hour.' })}
					</Text>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}

```



