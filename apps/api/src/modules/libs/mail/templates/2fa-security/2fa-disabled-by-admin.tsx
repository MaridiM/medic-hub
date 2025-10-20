import { APP_NAME } from '@/core/config'
import type { I18nService } from '@/core/i18n'
import { Button, Heading, Link, Section, Tailwind, Text } from '@react-email/components'

import { TemplateWrapper } from '../components'

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