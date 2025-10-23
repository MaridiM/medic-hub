import { APP_NAME } from '@/core/config'
import { type I18nService } from '@/core/i18n'
import type { ISessionMetadataDTO } from '@/shared/types'
import { Button, Heading, Link, Section, Tailwind, Text } from '@react-email/components'

import { TemplateWrapper } from '../components'

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