import { APP_NAME } from '@/core/config'
import type { I18nService } from '@/core/i18n'
import type { ISessionMetadata } from '@/shared/types'
import { Button, Heading, Link, Section, Tailwind, Text } from '@react-email/components'

import { TemplateWrapper } from '../components'

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