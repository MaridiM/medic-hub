# Full App Code (excluding imports, tests, i18n) - Part 2 of 6

`src/core/provider/mail/templates/2fa-security/index.ts`

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


`src/core/provider/mail/templates/2fa-security/low-backup-codes.template.tsx`

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


`src/core/provider/mail/templates/2fa-security/new-device-login.template.tsx`

```tsx
interface IProps {
	securityUrl: string
	i18n?: I18nService
	lng?: string
	metadata: ISessionMetadataDTO
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


`src/core/provider/mail/templates/2fa-security/suspicious-activity.template.tsx`

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


`src/core/provider/mail/templates/authentication/index.ts`

```typescript
export * from './otp-code.template'
export * from './password-changed.template'
export * from './password-reset-confirmation.template'
export * from './reset-password.template'
export * from './verification-email.template'
```


`src/core/provider/mail/templates/authentication/otp-code.template.tsx`

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


`src/core/provider/mail/templates/authentication/password-changed.template.tsx`

```tsx
interface IPasswordChangedProps {
	metadata: ISessionMetadataDTO
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


`src/core/provider/mail/templates/authentication/password-reset-confirmation.template.tsx`

```tsx
export interface IPasswordResetConfirmationProps {
    enable2faUrl: string
    securityUrl: string
    timestamp: string
    metadata: ISessionMetadataDTO
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


`src/core/provider/mail/templates/authentication/reset-password.template.tsx`

```tsx
export interface IResetPasswordProps {
	url: string
	metadata: ISessionMetadataDTO
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


`src/core/provider/mail/templates/components/index.ts`

```typescript
export * from './template-wrapper'
```


`src/core/provider/mail/templates/components/template-wrapper.tsx`

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


`src/core/provider/mail/templates/index.ts`

```typescript
// Authentication
export * from './authentication'

// 2FA Security Notifications
export * from './2fa-security'
```


`src/core/provider/provider.module.ts`

```typescript
/**
 * Global Communication Module
 *
 * This module bundles all external communication channels, such as email and SMS.
 * By making it global, services like MailService and SmsService are available
 * for dependency injection throughout the application without needing to import
 * this module in feature modules.
 */
@Global()
@Module({
	imports: [MailModule, SmsModule],
	exports: [MailModule, SmsModule], // Export modules to make their services (MailService, SmsService) available
})
export class ProviderModule {}
```


`src/core/provider/sms/index.ts`

```typescript
export * from './sms.module'
export * from './sms.service'
```


`src/core/provider/sms/sms.module.ts`

```typescript
@Global()
@Module({
	providers: [SmsService],
	exports: [SmsService],
})
export class SmsModule {}
```


`src/core/provider/sms/sms.service.ts`

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
		super({ i18n, config })

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


`src/core/redis/index.ts`

```typescript
export * from './redis.service'
export * from './redis.module'
```


`src/core/redis/redis.module.ts`

```typescript
@Global()
@Module({
	providers: [RedisService],
	exports: [RedisService],
})
export class RedisModule {}
```


`src/core/redis/redis.service.ts`

```typescript
/**
 * RedisService provides a robust, type-safe interface for interacting with Redis.
 * It encapsulates the `redis` (v4) client, handles connection management,
 * and offers convenient helper methods for common operations like JSON serialization
 * and working with various data structures.
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
	private client: RedisClientType
	private readonly logger = new Logger(RedisService.name)

	constructor(private readonly config: ConfigService) {
		this.client = createClient({ url: this.config.getOrThrow<string>('REDIS_URL') })
		this.client.on('error', (err: unknown) => {
			logUnknownError(this.logger, 'Redis client error', err, RedisService.name)
		})
		this.client.connect().catch((err: unknown) => {
			logUnknownError(this.logger, 'Redis connect error', err, RedisService.name)
		})
	}

	/**
	 * Gracefully disconnects the Redis client when the module is destroyed.
	 */
	async onModuleDestroy() {
		if (this.client.isOpen) {
			await this.client.disconnect()
		}
	}

	/**
	 * Returns the raw `redis` client instance.
	 * @returns The underlying Redis client instance.
	 */
	getClient(): RedisClientType {
		return this.client
	}

	// ===== BASIC OPERATIONS =====

	/**
	 * Get a string value by key.
	 * @param key - The Redis key.
	 * @returns The string value or null if the key does not exist.
	 */
	async get(key: string): Promise<string | null> {
		const res = await this.client.get(key)
		return typeof res === 'string' ? res : null
	}

	/**
	 * Set a string value by key, with an optional TTL.
	 * @param key - The Redis key.
	 * @param value - The string value to set.
	 * @param ttlSeconds - Optional time-to-live in seconds.
	 */
	async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
		if (ttlSeconds && ttlSeconds > 0) {
			await this.client.set(key, value, { EX: ttlSeconds })
		} else {
			await this.client.set(key, value)
		}
	}

	/**
	 * Delete one or more keys.
	 * @param key - The key or keys to delete.
	 * @returns The number of keys that were removed.
	 */
	async del(key: string | string[]): Promise<number> {
		return this.client.del(key)
	}

	/**
	 * Set a timeout on a key.
	 * @param key - The Redis key.
	 * @param ttlSeconds - The time-to-live in seconds.
	 * @returns `true` if the timeout was set, `false` otherwise.
	 */
	async expire(key: string, ttlSeconds: number): Promise<boolean> {
		const n = await this.client.expire(key, ttlSeconds)
		return n === 1
	}

	/**
	 * Check if a key exists.
	 * @param key - The Redis key.
	 * @returns `true` if the key exists, `false` otherwise.
	 */
	async exists(key: string): Promise<boolean> {
		return (await this.client.exists(key)) > 0
	}

	/**
	 * Get the remaining time to live of a key in seconds.
	 * @param key - The Redis key.
	 * @returns The time to live in seconds, or a negative value if the key does not exist or has no TTL.
	 */
	async ttl(key: string): Promise<number> {
		return this.client.ttl(key)
	}

	/**
	 * Increment the integer value of a key by one.
	 * @param key - The Redis key.
	 * @returns The value of the key after the increment.
	 */
	async incr(key: string): Promise<number> {
		return this.client.incr(key)
	}

	/**
	 * Decrement the integer value of a key by one.
	 * @param key - The Redis key.
	 * @returns The value of the key after the decrement.
	 */
	async decr(key: string): Promise<number> {
		return this.client.decr(key)
	}

	/**
	 * Increment a key and set a TTL on the first increment.
	 * @param key - The Redis key.
	 * @param ttlSeconds - The time-to-live in seconds to set if the key is new.
	 * @returns The value of the key after the increment.
	 */
	async incrWithExpire(key: string, ttlSeconds: number): Promise<number> {
		const value = await this.client.incr(key)
		if (value === 1) {
			// Set TTL without waiting for it to complete (fire-and-forget)
			this.client.expire(key, ttlSeconds).catch(err => {
				this.logger.warn(`Failed to set TTL on new key "${key}" after INCR:`, err)
			})
		}
		return value
	}

	// ===== JSON HELPERS =====

	/**
	 * Serialize an object to JSON and store it in Redis.
	 * @template T - The type of the object.
	 * @param key - The Redis key.
	 * @param value - The object to store.
	 * @param ttlSeconds - Optional time-to-live in seconds.
	 */
	async setJSON<T extends object>(key: string, value: T, ttlSeconds?: number): Promise<void> {
		const raw = JSON.stringify(value)
		await this.set(key, raw, ttlSeconds)
	}

	/**
	 * Retrieve a JSON-serialized object from Redis and parse it.
	 * @template T - The expected type of the object.
	 * @param key - The Redis key.
	 * @returns The parsed object or null if not found or on parse error.
	 */
	async getJSON<T = unknown>(key: string): Promise<T | null> {
		const raw = await this.get(key)
		if (raw == null) return null
		try {
			return JSON.parse(raw) as T
		} catch {
			this.logger.warn(`Failed to parse JSON for key: ${key}`)
			return null
		}
	}

	// ===== KEY ENUMERATION =====

	/**
	 * Find all keys matching the given pattern.
	 * Warning: `KEYS` can be a blocking operation; use `SCAN` in production for large datasets.
	 * @param pattern - The glob-style pattern.
	 * @returns An array of keys matching the pattern.
	 */
	async keys(pattern: string): Promise<string[]> {
		return this.client.keys(pattern)
	}

	/**
	 * Delete all keys matching the given pattern.
	 * @param pattern - The glob-style pattern.
	 * @returns The number of keys that were removed.
	 */
	async delPattern(pattern: string): Promise<number> {
		const keysToDelete = await this.keys(pattern)
		if (keysToDelete.length === 0) return 0
		return this.client.del(keysToDelete)
	}

	// ===== ADVANCED OPERATIONS =====

	/**
	 * Set a value only if the key does not exist.
	 * @param key - The Redis key.
	 * @param value - The string value.
	 * @param ttlSeconds - Optional time-to-live in seconds.
	 * @returns `true` if the key was set, `false` otherwise.
	 */
	async setNX(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
		const result = ttlSeconds
			? await this.client.set(key, value, { NX: true, EX: ttlSeconds })
			: await this.client.set(key, value, { NX: true })
		return result === 'OK'
	}

	/**
	 * Atomically get the value of a key and delete it.
	 * @param key - The Redis key.
	 * @returns The value of the key, or null if the key does not exist.
	 */
	async getdel(key: string): Promise<string | null> {
		const result = await this.client.getDel(key)
		return result === null || typeof result !== 'string' ? null : result
	}

	// ===== SETS & ZSETS =====

	/**
	 * Add one or more members to a set.
	 * @param key - The key of the set.
	 * @param members - A single member or an array of members to add.
	 * @returns The number of elements that were added to the set.
	 */
	async sAdd(key: string, members: string | string[]): Promise<number> {
		return this.client.sAdd(key, members)
	}

	/**
	 * Remove one or more members from a set.
	 * @param key - The key of the set.
	 * @param members - A single member or an array of members to remove.
	 * @returns The number of members that were removed from the set.
	 */
	async sRem(key: string, members: string | string[]): Promise<number> {
		return this.client.sRem(key, members)
	}

	/**
	 * Check if a member exists in a set.
	 * @param key - The key of the set.
	 * @param member - The member to check for.
	 * @returns `true` if the member is an element of the set, `false` otherwise.
	 */
	async sIsMember(key: string, member: string): Promise<boolean> {
		const result = await this.client.sIsMember(key, member)
		return result === 1
	}

	/**
	 * Add an element to a sorted set.
	 * @param key - The key of the sorted set.
	 * @param score - The score of the element.
	 * @param member - The member to add.
	 * @returns The number of elements added to the sorted set.
	 */
	async zAdd(key: string, score: number, member: string): Promise<number> {
		return this.client.zAdd(key, { score, value: member })
	}

	/**
	 * Remove all members in a sorted set within a given range of scores.
	 * @param key - The key of the sorted set.
	 * @param min - The minimum score.
	 * @param max - The maximum score.
	 * @returns The number of elements removed.
	 */
	async zRemRangeByScore(key: string, min: number | string, max: number | string): Promise<number> {
		return this.client.zRemRangeByScore(key, min, max)
	}

	/**
	 * Get the number of members in a sorted set.
	 * @param key - The key of the sorted set.
	 * @returns The cardinality (number of elements) of the sorted set.
	 */
	async zCard(key: string): Promise<number> {
		return this.client.zCard(key)
	}

	/**
	 * Get a range of members from a sorted set.
	 * @param key - The key of the sorted set.
	 * @param min - The starting index.
	 * @param max - The ending index.
	 * @param options - Optional parameters, e.g., { REV: true } for reverse order.
	 * @returns An array of members in the specified range.
	 */
	async zRange(key: string, min: number, max: number, options?: { REV: boolean }): Promise<string[]> {
		return this.client.zRange(key, min, max, options)
	}
}
```


`src/main.ts`

```typescript
const myEnv = dotenv.config({ path: 'backend/.env' })
dotenvExpand.expand(myEnv)

async function bootstrap() {
	await initI18n()

	const app = await NestFactory.create(CoreModule, { rawBody: true })

	const config = app.get(ConfigService)
	const redis = app.get(RedisService)

	// ✅ Security Headers (Helmet) - apply first!
	app.use(helmet(helmetConfig as Readonly<HelmetOptions>))

	// ✅ i18n middleware (добавляет req.i18n, req.language)
	app.use(i18nextMiddleware.handle(i18n))

	// ✅ JSON + выставляем язык, если вдруг отсутствует
	app.use(json({ limit: '1mb', type: 'application/json' }))
	app.use((req: Request, res: Response, next: NextFunction) => {
		req.language =
			req.language ||
			req.i18n?.language ||
			String(req.headers['accept-language'] || '').split(',')[0] ||
			DEFAULT_LANGUAGE
		next()
	})

	// ✅ Cookie / file upload / global pipes
	app.use(cookieParser(config.get<string>('COOKIES_SECRET')))
	app.use(config.get<string>('GRAPHQL_PREFIX') || '/graphql', graphqlUploadExpress())
	app.useGlobalPipes(new ValidationPipe({ transform: true }))

	// ✅ Сессии через Redis
	app.use(sessionConfig(config, redis))

	// ✅ CORS
	const clientUrl = config.get<string>('CLIENT_URL') || 'http://localhost:3000'
	app.enableCors({
		origin: [clientUrl, 'http://localhost:3000'],
		credentials: true,
		exposedHeaders: ['set-cookie'],
	})

	// ✅ Старт
	const port = Number(config.get<string>('SERVER_PORT')) || 8000
	await app.listen(port)
}

bootstrap().catch(err => {
	// Можно заменить на ваш логгер
	console.error('Nest bootstrap failed:', err)
	process.exit(1)
})
```


`src/modules/auth/2fa/constants/2fa.constants.ts`

```typescript
/**
 * Core 2FA configuration constants
 */

// ===== GENERAL 2FA SETTINGS =====

export const TWO_FA_CONFIG = {
	/** Maximum number of 2FA methods per user */
	MAX_METHODS_PER_USER: 5,

	/** Maximum number of active sessions requiring 2FA */
	MAX_ACTIVE_SESSIONS: 10,

	/** Allow backup codes as fallback */
	ALLOW_BACKUP_CODES: true,

	/** Force 2FA for admin users */
	FORCE_ADMIN_2FA: true,

	/** Session lifetime after 2FA verification (seconds) */
	SESSION_LIFETIME_AFTER_2FA: 86400, // 24 hours

	/** Remember device duration (seconds) */
	REMEMBER_DEVICE_DURATION: 2592000, // 30 days
} as const

// ===== TOTP SETTINGS =====

export const TOTP_CONFIG = {
	/** Allowed time window drift (±N periods) */
	WINDOW: 1,

	/** Default algorithm */
	ALGORITHM: 'SHA1' as const,

	/** Code length */
	DIGITS: 6,

	/** Time step in seconds */
	PERIOD: 30,

	/** Secret length in bytes */
	SECRET_LENGTH: 20,

	/** QR code size */
	QR_CODE_SIZE: 300,

	/** QR code error correction */
	QR_ERROR_CORRECTION: 'H' as const,
} as const

/**
 * QR Code Settings
 */
export const QR_CODE_OPTIONS = {
	errorCorrectionLevel: 'H' as const,
	margin: 1,
	width: 300,
	type: 'image/png' as const,
	color: {
		dark: '#000000',
		light: '#FFFFFF',
	},
} as const

// ===== OTP SETTINGS =====

export const OTP_CONFIG = {
	/** Code length */
	CODE_LENGTH: 6,

	/** Code expiry (seconds) */
	CODE_EXPIRY: 300, // 5 minutes

	/** Max verification attempts per code */
	MAX_ATTEMPTS: 3,

	/** Cooldown between sends (seconds) */
	SEND_COOLDOWN: 60, // 1 minute

	/** Max sends per hour */
	MAX_SENDS_PER_HOUR: 5,

	/** Code reuse prevention window (seconds) */
	REUSE_PREVENTION_WINDOW: 90,
} as const

// ===== BACKUP CODES =====

export const BACKUP_CODE_CONFIG = {
	/** Number of codes to generate */
	COUNT: 10,

	/** Code length in bytes */
	BYTES: 4,

	/** Code format */
	FORMAT: 'HEX' as const,

	/** Expiration (null = never expire) */
	EXPIRY_DAYS: null as number | null,

	/** Minimum remaining codes before warning */
	LOW_CODES_THRESHOLD: 3,
} as const

// ===== RATE LIMITING =====

export const RATE_LIMIT_CONFIG = {
	/** Window duration (seconds) */
	WINDOW: 300, // 5 minutes

	/** Max attempts per window */
	MAX_ATTEMPTS: 5,

	/** Account lock duration after max attempts (seconds) */
	LOCK_DURATION: 900, // 15 minutes

	/** Progressive lock multiplier */
	PROGRESSIVE_LOCK_MULTIPLIER: 2,
} as const

// ===== REDIS KEYS =====

export const REDIS_KEYS = {
	// 2FA codes
	OTP_CODE: (userId: string) => `2fa:otp:code:${userId}`,
	OTP_ATTEMPTS: (userId: string) => `2fa:otp:attempts:${userId}`,
	OTP_COOLDOWN: (userId: string) => `2fa:otp:cooldown:${userId}`,
	OTP_USED: (userId: string, code: string) => `2fa:otp:used:${userId}:${code}`,

	// TOTP
	TOTP_TEMP_SECRET: (userId: string) => `2fa:totp:temp:${userId}`,
	TOTP_USED: (userId: string, code: string) => `2fa:totp:used:${userId}:${code}`,

	// Rate limiting
	RATE_LIMIT: (userId: string, action: string) => `2fa:rate:${userId}:${action}`,

	// Device trust
	DEVICE_FINGERPRINT: (deviceId: string) => `2fa:device:fp:${deviceId}`,
	DEVICE_TRUST: (userId: string, deviceId: string) => `2fa:device:trust:${userId}:${deviceId}`,

	// Risk
	RISK_SCORE: (userId: string) => `2fa:risk:score:${userId}`,
	RISK_FACTORS: (userId: string) => `2fa:risk:factors:${userId}`,

	// WebAuthn
	WEBAUTHN_CHALLENGE: (challengeId: string) => `webauthn:challenge:${challengeId}`,
	WEBAUTHN_REGISTRATION: (userId: string) => `webauthn:registration:${userId}`,
	WEBAUTHN_AUTHENTICATION: (userId: string) => `webauthn:authentication:${userId}`,
} as const

// ===== AUDIT ACTIONS =====

export const AUDIT_ACTIONS = {
	// Method management
	METHOD_ADDED: '2FA_METHOD_ADDED',
	METHOD_REMOVED: '2FA_METHOD_REMOVED',
	METHOD_UPDATED: '2FA_METHOD_UPDATED',
	PRIMARY_METHOD_CHANGED: '2FA_PRIMARY_METHOD_CHANGED',

	// Verification
	VERIFICATION_SUCCESS: '2FA_VERIFICATION_SUCCESS',
	VERIFICATION_FAILED: '2FA_VERIFICATION_FAILED',
	BACKUP_CODE_USED: '2FA_BACKUP_CODE_USED',

	// Setup
	TOTP_SETUP_STARTED: '2FA_TOTP_SETUP_STARTED',
	TOTP_SETUP_COMPLETED: '2FA_TOTP_SETUP_COMPLETED',
	OTP_SETUP_COMPLETED: '2FA_OTP_SETUP_COMPLETED',

	// WebAuthn
	WEBAUTHN_REGISTERED: '2FA_WEBAUTHN_REGISTERED',
	WEBAUTHN_VERIFIED: '2FA_WEBAUTHN_VERIFIED',
	PASSKEY_CREATED: '2FA_PASSKEY_CREATED',
	PASSKEY_USED: '2FA_PASSKEY_USED',

	// Backup codes
	BACKUP_CODES_GENERATED: '2FA_BACKUP_CODES_GENERATED',
	BACKUP_CODES_REGENERATED: '2FA_BACKUP_CODES_REGENERATED',
	BACKUP_CODES_VIEWED: '2FA_BACKUP_CODES_VIEWED',

	// Device trust
	DEVICE_TRUSTED: '2FA_DEVICE_TRUSTED',
	DEVICE_UNTRUSTED: '2FA_DEVICE_UNTRUSTED',

	// System
	ENABLED: '2FA_ENABLED',
	DISABLED: '2FA_DISABLED',
	FORCED: '2FA_FORCED',
} as const

export type T2FAAuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS]

// ===== HELPER FUNCTIONS =====

/**
 * Create standardized audit metadata
 */
export const createAuditMetadata = (
	data: Partial<{ timestamp?: string }> & Record<string, unknown> = {},
): Prisma.InputJsonObject => {
	return {
		timestamp: new Date().toISOString(),
		...data,
	}
}

/**
 * Validation patterns
 */
export const VALIDATION_PATTERNS = {
	TOTP_CODE: /^\d{6}$/,
	OTP_CODE: /^\d{6}$/,
	BACKUP_CODE: /^[A-F0-9]{8}$/,
	PHONE_E164: /^\+[1-9]\d{7,14}$/,
	DEVICE_ID: /^[a-f0-9]{64}$/,
} as const
```


`src/modules/auth/2fa/constants/device.constants.ts`

```typescript
/**
 * Device trust and fingerprinting constants
 */

// ===== TRUST SCORING =====

export const DEVICE_TRUST = {
	/** Initial trust score for new devices */
	INITIAL_SCORE: 0,

	/** Minimum score to be considered trusted */
	TRUST_THRESHOLD: 75,

	/** Score increment per successful login */
	SUCCESS_INCREMENT: 5,

	/** Score decrement per failed attempt */
	FAILURE_DECREMENT: 10,

	/** Maximum trust score */
	MAX_SCORE: 100,

	/** Minimum trust score */
	MIN_SCORE: 0,

	/** Score decay per day of inactivity */
	DECAY_PER_DAY: 1,

	/** Days of inactivity before decay starts */
	DECAY_GRACE_PERIOD: 7,
} as const

// ===== DEVICE LIFETIME =====

export const DEVICE_LIFETIME = {
	/** Default device trust duration (seconds) */
	DEFAULT_DURATION: 2592000, // 30 days

	/** Maximum device trust duration (seconds) */
	MAX_DURATION: 7776000, // 90 days

	/** Minimum device trust duration (seconds) */
	MIN_DURATION: 86400, // 1 day

	/** Auto-revoke after inactivity (seconds) */
	AUTO_REVOKE_AFTER: 15552000, // 180 days
} as const

// ===== FINGERPRINTING =====

export const FINGERPRINT_CONFIG = {
	/** Fingerprint hash algorithm */
	ALGORITHM: 'sha256' as const,

	/** Minimum components required for valid fingerprint */
	MIN_COMPONENTS: 5,

	/** Fingerprint similarity threshold (0-1) */
	SIMILARITY_THRESHOLD: 0.8,

	/** Enable canvas fingerprinting */
	USE_CANVAS: true,

	/** Enable WebGL fingerprinting */
	USE_WEBGL: true,

	/** Enable audio fingerprinting */
	USE_AUDIO: false, // More invasive

	/** Enable font detection */
	USE_FONTS: true,
} as const

// ===== DEVICE LIMITS =====

export const DEVICE_LIMITS = {
	/** Maximum trusted devices per user */
	MAX_TRUSTED_DEVICES: 10,

	/** Maximum devices to keep in history */
	MAX_DEVICE_HISTORY: 50,

	/** Auto-cleanup devices older than (days) */
	CLEANUP_AFTER_DAYS: 365,
} as const

// ===== REDIS KEYS =====

export const DEVICE_REDIS_KEYS = {
	FINGERPRINT: (deviceId: string) => `device:fp:${deviceId}`,
	TRUST_SCORE: (userId: string, deviceId: string) => `device:trust:${userId}:${deviceId}`,
	LAST_SEEN: (deviceId: string) => `device:seen:${deviceId}`,
	LOCATION: (deviceId: string) => `device:location:${deviceId}`,
} as const
```


`src/modules/auth/2fa/constants/index.ts`

```typescript
export * from './2fa.constants'
export * from './device.constants'
export * from './risk.constants'
export * from './webauthn.constants'
```


`src/modules/auth/2fa/constants/risk.constants.ts`

```typescript
/**
 * Risk assessment and scoring constants
 */

// ===== RISK THRESHOLDS =====

export const RISK_THRESHOLDS = {
	[ERiskLevel.VERY_LOW]: { min: 0, max: 20 },
	[ERiskLevel.LOW]: { min: 21, max: 40 },
	[ERiskLevel.MEDIUM]: { min: 41, max: 60 },
	[ERiskLevel.HIGH]: { min: 61, max: 80 },
	[ERiskLevel.CRITICAL]: { min: 81, max: 100 },
} as const

// ===== RISK FACTOR WEIGHTS =====

export const RISK_WEIGHTS = {
	// Location factors
	NEW_COUNTRY: 20,
	NEW_CITY: 15,
	IMPOSSIBLE_TRAVEL: 40, // Too fast travel between locations
	HIGH_RISK_COUNTRY: 25,
	VPN_DETECTED: 10,

	// Device factors
	NEW_DEVICE: 15,
	UNTRUSTED_DEVICE: 20,
	DEVICE_ANOMALY: 25,

	// Behavioral factors
	UNUSUAL_TIME: 10,
	UNUSUAL_DAY: 5,
	RAPID_REQUESTS: 30,
	MULTIPLE_FAILED_ATTEMPTS: 35,

	// Account factors
	NEW_ACCOUNT: 10, // < 7 days old
	YOUNG_ACCOUNT: 5, // < 30 days old
	DORMANT_ACCOUNT: 15, // No activity > 90 days

	// Pattern factors
	DEVIATION_FROM_PATTERN: 20,
	SUSPICIOUS_USER_AGENT: 15,
	BOT_DETECTED: 50,
} as const

// ===== VELOCITY CHECKS =====

export const VELOCITY_CONFIG = {
	/** Maximum distance in km to travel in 1 hour (by plane) */
	MAX_TRAVEL_SPEED_KMH: 900,

	/** Time window for velocity check (seconds) */
	VELOCITY_WINDOW: 3600, // 1 hour

	/** Max login attempts per minute */
	MAX_ATTEMPTS_PER_MINUTE: 5,

	/** Max sessions per hour */
	MAX_SESSIONS_PER_HOUR: 10,
} as const

// ===== HIGH-RISK INDICATORS =====

export const HIGH_RISK_INDICATORS = {
	/** Countries with higher fraud rates (ISO codes) */
	HIGH_RISK_COUNTRIES: ['RU', 'CN', 'NG', 'VN', 'IN'],

	/** Suspicious user agent patterns */
	SUSPICIOUS_UA_PATTERNS: [/bot/i, /crawler/i, /spider/i, /scraper/i, /curl/i, /wget/i],

	/** Known VPN/proxy ASNs */
	VPN_ASNS: [
		// Common VPN providers
		'AS14061', // DigitalOcean
		'AS16509', // Amazon (often used for proxies)
		// Add more as needed
	],
} as const

// ===== ACTIONS BY RISK LEVEL =====

export const RISK_ACTIONS = {
	[ERiskLevel.VERY_LOW]: {
		require2FA: false,
		blockAccess: false,
		logEvent: false,
		notifyUser: false,
	},
	[ERiskLevel.LOW]: {
		require2FA: false,
		blockAccess: false,
		logEvent: true,
		notifyUser: false,
	},
	[ERiskLevel.MEDIUM]: {
		require2FA: true,
		blockAccess: false,
		logEvent: true,
		notifyUser: false,
	},
	[ERiskLevel.HIGH]: {
		require2FA: true,
		blockAccess: false,
		logEvent: true,
		notifyUser: true,
	},
	[ERiskLevel.CRITICAL]: {
		require2FA: true,
		blockAccess: true,
		logEvent: true,
		notifyUser: true,
	},
} as const

// ===== CACHE SETTINGS =====

export const RISK_CACHE = {
	/** Risk score TTL (seconds) */
	SCORE_TTL: 300, // 5 minutes

	/** Risk factors TTL (seconds) */
	FACTORS_TTL: 600, // 10 minutes

	/** Location history TTL (seconds) */
	LOCATION_HISTORY_TTL: 86400, // 24 hours
} as const
```


`src/modules/auth/2fa/constants/webauthn.constants.ts`

```typescript
/**
 * WebAuthn and Passkey configuration constants
 * Following FIDO2 and WebAuthn Level 2 specifications
 */

// ===== RELYING PARTY (RP) CONFIGURATION =====

export const WEBAUTHN_RP = {
	/** Relying Party name (your app name) */
	NAME: process.env.APP_NAME || 'MyApp',

	/** Relying Party ID (your domain) */
	ID: process.env.WEBAUTHN_RP_ID || 'localhost',

	/** Origin (full URL) */
	ORIGIN: process.env.WEBAUTHN_ORIGIN || 'http://localhost:3000',
} as const

// ===== AUTHENTICATOR SELECTION =====

export const AUTHENTICATOR_SELECTION = {
	/** Authenticator attachment: 'platform', 'cross-platform', or undefined (both) */
	AUTHENTICATOR_ATTACHMENT: undefined as 'platform' | 'cross-platform' | undefined,

	/** Require resident key (for passwordless) */
	RESIDENT_KEY: 'preferred' as const,

	/** User verification */
	USER_VERIFICATION: 'preferred' as const,
} as const

// ===== ATTESTATION =====

export const ATTESTATION_CONFIG = {
	/** Attestation conveyance */
	CONVEYANCE: 'none' as const,

	/** Verify attestation (requires attestation metadata) */
	VERIFY_ATTESTATION: false,

	/** Allowed attestation formats */
	ALLOWED_FORMATS: ['packed', 'fido-u2f', 'android-safetynet', 'apple', 'none'] as const,
} as const

// ===== CREDENTIAL PARAMETERS =====

export const CREDENTIAL_PARAMS = {
	/** Supported algorithms (ES256, RS256) */
	PUB_KEY_CRED_PARAMS: [
		{ type: 'public-key' as const, alg: -7 }, // ES256 (recommended)
		{ type: 'public-key' as const, alg: -257 }, // RS256
	],

	/** Challenge length (bytes) */
	CHALLENGE_LENGTH: 32,

	/** Timeout for user interaction (milliseconds) */
	TIMEOUT: 60000, // 60 seconds
} as const

// ===== VALIDATION =====

export const VALIDATION_CONFIG = {
	/** Maximum allowed counter resets */
	MAX_COUNTER_RESETS: 0,

	/** Verify user presence (UP flag) */
	REQUIRE_USER_PRESENCE: true,

	/** Verify user verification (UV flag) */
	REQUIRE_USER_VERIFICATION: false,

	/** Check backup eligibility flag */
	CHECK_BACKUP_ELIGIBILITY: true,
} as const

// ===== STORAGE =====

export const WEBAUTHN_STORAGE = {
	/** Challenge TTL in Redis (seconds) */
	CHALLENGE_TTL: 300, // 5 minutes

	/** Credential TTL (null = forever) */
	CREDENTIAL_TTL: null as number | null,

	/** Maximum credentials per user */
	MAX_CREDENTIALS_PER_USER: 10,
} as const

// ===== COMBINED CONFIG EXPORT =====

export const WEBAUTHN_CONFIG = {
	AUTHENTICATOR_SELECTION,
	ATTESTATION_CONFIG,
	CREDENTIAL_PARAMS,
	VALIDATION_CONFIG,
} as const
```


`src/modules/auth/2fa/dtos/admin-2fa.dto.ts`

```typescript
/**
 * Input for disabling a user's 2FA
 */
@InputType('DisableUser2FAInput')
export class DisableUser2FAInput {
	@Field(() => String, { description: 'User ID whose 2FA should be disabled' })
	@IsUUID()
	@IsNotEmpty()
	userId: string

	@Field(() => String, { description: 'Reason for disabling 2FA' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(500)
	reason: string

	@Field(() => Boolean, {
		nullable: true,
		defaultValue: true,
		description: 'Whether to notify the user via email',
	})
	@IsOptional()
	@IsBoolean()
	notifyUser?: boolean
}

/**
 * Input for revoking a user's device
 */
@InputType('RevokeUserDeviceInput')
export class RevokeUserDeviceInput {
	@Field(() => String, { description: 'User ID' })
	@IsUUID()
	@IsNotEmpty()
	userId: string

	@Field(() => String, { description: 'Device ID to revoke' })
	@IsString()
	@IsNotEmpty()
	deviceId: string

	@Field(() => String, { description: 'Reason for revoking device' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(500)
	reason: string
}

/**
 * Input for revoking all user devices
 */
@InputType('RevokeAllUserDevicesInput')
export class RevokeAllUserDevicesInput {
	@Field(() => String, { description: 'User ID' })
	@IsUUID()
	@IsNotEmpty()
	userId: string

	@Field(() => String, { description: 'Reason for revoking all devices' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(500)
	reason: string
}

/**
 * Input for getting user security events
 */
@InputType('GetUserSecurityEventsInput')
export class GetUserSecurityEventsInput {
	@Field(() => String, { description: 'User ID' })
	@IsUUID()
	@IsNotEmpty()
	userId: string

	@Field(() => Int, { nullable: true, defaultValue: 50, description: 'Number of events to return' })
	@IsOptional()
	limit?: number

	@Field(() => [String], {
		nullable: true,
		description: 'Filter by event types',
	})
	@IsOptional()
	@IsEnum(ESecurityEvent, { each: true })
	events?: ESecurityEvent[]

	@Field(() => [String], {
		nullable: true,
		description: 'Filter by severity levels',
	})
	@IsOptional()
	@IsEnum(ESecuritySeverity, { each: true })
	severities?: ESecuritySeverity[]
}
```


`src/modules/auth/2fa/dtos/index.ts`

```typescript
export * from './admin-2fa.dto'
export * from './setup-totp.dto'
export * from './setup-otp.dto'
export * from './verify-2fa.dto'
export * from './manage-methods.dto'
export * from './webauthn.dto'
```


`src/modules/auth/2fa/dtos/manage-methods.dto.ts`

```typescript
/**
 * Input for updating 2FA method
 */
@InputType('Update2FAMethodInput')
export class Update2FAMethodInput {
	@Field(() => String, { description: 'Method ID to update' })
	@IsString()
	@IsNotEmpty()
	methodId: string

	@Field(() => String, { nullable: true, description: 'New name for the method' })
	@IsOptional()
	@IsString()
	name?: string

	@Field(() => Boolean, { nullable: true, description: 'Set as primary method' })
	@IsOptional()
	@IsBoolean()
	isPrimary?: boolean

	@Field(() => Boolean, { nullable: true, description: 'Activate/deactivate method' })
	@IsOptional()
	@IsBoolean()
	isActive?: boolean
}

/**
 * Input for removing 2FA method
 */
@InputType('Remove2FAMethodInput')
export class Remove2FAMethodInput {
	@Field(() => String, { description: 'Method ID to remove' })
	@IsString()
	@IsNotEmpty()
	methodId: string

	@Field(() => String, { description: 'Password for confirmation' })
	@IsString()
	@IsNotEmpty()
	password: string

	@Field(() => String, { nullable: true, description: '2FA code for additional security' })
	@IsOptional()
	@IsString()
	code?: string
}

/**
 * Input for regenerating backup codes
 */
@InputType('RegenerateBackupCodesInput')
export class RegenerateBackupCodesInput {
	@Field(() => String, { nullable: true, description: 'Specific method ID (regenerates for all if not specified)' })
	@IsOptional()
	@IsString()
	methodId?: string

	@Field(() => String, { description: 'Password for confirmation' })
	@IsString()
	@IsNotEmpty()
	password: string
}
```


`src/modules/auth/2fa/dtos/setup-otp.dto.ts`

```typescript
registerEnumType(E2FAMethod, {
	name: 'E2FAMethod', // имя enum в схеме GraphQL
	description: 'Allowed OTP methods for setup (email or SMS).',
	valuesMap: {
		TOTP: { deprecationReason: 'Not allowed in SetupOtpInput' },
		WEBAUTHN: { deprecationReason: 'Not allowed in SetupOtpInput' },
		PASSKEY: { deprecationReason: 'Not allowed in SetupOtpInput' },
		BACKUP_CODE: { deprecationReason: 'Not allowed in SetupOtpInput' },
	},
})

/**
 * Input for setting up OTP (Email or SMS)
 */
@InputType('SetupOtpInput')
export class SetupOtpInput {
	@Field(() => E2FAMethod, {
		description: 'OTP method: OTP_EMAIL or OTP_SMS',
		defaultValue: E2FAMethod.OTP_EMAIL,
	})
	@IsOptional()
	@IsEnum(E2FAMethod)
	@IsIn([E2FAMethod.OTP_EMAIL, E2FAMethod.OTP_SMS], {
		message: 'method must be OTP_EMAIL or OTP_SMS',
	})
	method!: E2FAMethod

	@Field({ nullable: true, description: 'Email destination (required for OTP_EMAIL)' })
	@IsOptional()
	@ValidateIf(o => o.method === E2FAMethod.OTP_EMAIL)
	@IsEmail()
	email?: string

	@Field({ nullable: true, description: 'Phone in E.164, required for OTP_SMS' })
	@IsOptional()
	@ValidateIf(o => o.method === E2FAMethod.OTP_SMS)
	@Matches(VALIDATION_PATTERNS.PHONE_E164, {
		message: 'phone must be a valid E.164 number (e.g. +1234567890)',
	})
	phone?: string

	@Field({ nullable: true, description: 'Optional display name for the method' })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	name?: string
}

/**
 * Input for sending OTP code
 */
@InputType('SendOtpCodeInput')
export class SendOtpCodeInput {
	@Field(() => String, { nullable: true, description: 'Method ID to send code to (uses primary if not specified)' })
	@IsOptional()
	@IsString()
	methodId?: string
}

/**
 * Input for verifying OTP code during setup
 */
@InputType('VerifyOtpSetupInput')
export class VerifyOtpSetupInput {
	@Field(() => String, { description: 'Method ID from setup' })
	@IsString()
	@IsNotEmpty()
	methodId: string

	@Field(() => String, { description: '6-digit OTP code' })
	@IsString()
	@IsNotEmpty()
	@Matches(VALIDATION_PATTERNS.OTP_CODE, { message: 'Code must be exactly 6 digits' })
	code: string
}
```


`src/modules/auth/2fa/dtos/setup-totp.dto.ts`

```typescript
/**
 * Input for generating TOTP setup (QR code)
 */
@InputType('GenerateTotpSetupInput')
export class GenerateTotpSetupInput {
	@Field(() => String, { nullable: true, description: 'Optional custom name for this method' })
	@IsOptional()
	@IsString()
	name?: string
}

/**
 * Input for completing TOTP setup
 */
@InputType('CompleteTotpSetupInput')
export class CompleteTotpSetupInput {
	@Field(() => String, { description: 'TOTP secret from generation step' })
	@IsString()
	@IsNotEmpty()
	@Length(TOTP_CONFIG.SECRET_LENGTH, TOTP_CONFIG.SECRET_LENGTH, {
		message: `Secret must be exactly ${TOTP_CONFIG.SECRET_LENGTH} characters`,
	})
	secret: string

	@Field(() => String, { description: '6-digit TOTP code for verification' })
	@IsString()
	@IsNotEmpty()
	@Matches(VALIDATION_PATTERNS.TOTP_CODE, { message: 'Code must be exactly 6 digits' })
	code: string

	@Field(() => String, { nullable: true, description: 'Optional custom name' })
	@IsOptional()
	@IsString()
	name?: string
}
```


`src/modules/auth/2fa/dtos/verify-2fa.dto.ts`

```typescript
/**
 * Generic 2FA verification input
 * Supports TOTP codes, OTP codes, and backup codes
 */
@InputType('Verify2FAInput')
export class Verify2FAInput {
	@Field(() => String, { description: '6-digit code or 8-character backup code' })
	@IsString()
	@IsNotEmpty()
	code: string

	@Field(() => String, {
		nullable: true,
		description: 'Specific method ID to verify (uses primary if not specified)',
	})
	@IsOptional()
	@IsString()
	methodId?: string

	@Field(() => Boolean, { nullable: true, description: 'Remember this device for future logins' })
	@IsOptional()
	@IsBoolean()
	trustDevice?: boolean
}

/**
 * Backup code verification input
 */
@InputType('VerifyBackupCodeInput')
export class VerifyBackupCodeInput {
	@Field(() => String, { description: '8-character backup code' })
	@IsString()
	@IsNotEmpty()
	@Matches(VALIDATION_PATTERNS.BACKUP_CODE, { message: 'Invalid backup code format' })
	backupCode: string

	@Field(() => String, { nullable: true, description: 'Method ID this code is for' })
	@IsOptional()
	@IsString()
	methodId?: string
}
```

