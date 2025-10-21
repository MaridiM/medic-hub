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