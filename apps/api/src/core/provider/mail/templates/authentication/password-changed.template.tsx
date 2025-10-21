import { APP_NAME } from '@/core/config'
import { type I18nService } from '@/core/i18n'
import type { ISessionMetadata } from '@/shared/types'
import { Button, Heading, Section, Tailwind, Text } from '@react-email/components'

import { TemplateWrapper } from '../components'

interface IPasswordChangedProps {
	metadata: ISessionMetadata
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