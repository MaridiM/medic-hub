import { APP_NAME } from '@/core/config'
import type { I18nService } from '@/core/i18n'
import { Button, Heading, Link, Section, Tailwind, Text } from '@react-email/components'

import { TemplateWrapper } from '../components'

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