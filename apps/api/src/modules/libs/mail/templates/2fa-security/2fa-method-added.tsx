import { APP_NAME } from '@/core/config'
import type { I18nService } from '@/core/i18n'
import type { E2FAMethod } from '@prisma/__generated__'
import { Button, Heading, Link, Section, Tailwind, Text } from '@react-email/components'

import { TemplateWrapper } from '../components'

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