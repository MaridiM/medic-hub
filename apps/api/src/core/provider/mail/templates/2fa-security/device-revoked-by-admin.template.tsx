import { APP_NAME } from '@/core/config'
import type { I18nService } from '@/core/i18n'
import { Button, Heading, Link, Section, Tailwind, Text } from '@react-email/components'

import { TemplateWrapper } from '../components'

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