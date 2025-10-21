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