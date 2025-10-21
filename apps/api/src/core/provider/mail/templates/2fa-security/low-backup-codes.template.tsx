import { APP_NAME } from '@/core/config'
import type { I18nService } from '@/core/i18n'
import { Button, Heading, Link, Section, Tailwind, Text } from '@react-email/components'

import { TemplateWrapper } from '../components'

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