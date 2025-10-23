import { APP_NAME } from '@/core/config'
import { type I18nService } from '@/core/i18n'
import type { ISessionMetadataDTO } from '@/shared/types'
import { Button, Heading, Section, Tailwind, Text } from '@react-email/components'

import { TemplateWrapper } from '../components'

export interface IPasswordResetConfirmationProps {
    enable2faUrl: string
    securityUrl: string
    timestamp: string
    metadata: ISessionMetadataDTO
	i18n: I18nService
	lng?: string
}

export function PasswordResetConfirmationTemplate({
    enable2faUrl,
    securityUrl,
    timestamp,
	metadata,
	i18n,
	lng = 'en',
}: IPasswordResetConfirmationProps) {
	const t = i18n.t('mail.password_reset_confirmation', { lng })

	return (
		<TemplateWrapper template="password_reset_confirmation" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center">
						{t('title', { defaultValue: '✅ Password Reset Successful' })}
					</Heading>

					<Text className="text-center">
						{t('intro', { app: APP_NAME, defaultValue: `Your password reset request has been completed successfully. You can now log in with your new password.` }) }
					</Text>
				</Section>

				{/* Success Banner */}
				<Section className="mb-4 rounded-lg border-l-4 border-[#28a745] bg-[#d4edda] px-4 py-3">
					<Text className="m-0 text-sm font-semibold text-[#155724]">
						✅ {t('success.title', { defaultValue: 'Password Reset Successful' })}
					</Text>
					<Text className="m-0 text-sm text-[#155724]">
						{t('success.message', { defaultValue: 'Your password has been reset and you can now log in with your new password.'}) }
					</Text>
				</Section>

				{/* Reset Details */}
				<Section className="mb-4 rounded-lg border border-[#e0e0e0] bg-[#f9f9f9] px-4 py-3">
					<Text className="mb-2 font-semibold text-[#333]">
						{t('details.title', { defaultValue: '🔍 Password Reset Details' })}
					</Text>

					<Text className="m-0 text-sm text-[#555]">
						⏰ <strong>{t('details.timestamp', { defaultValue: 'Reset Time' })}:</strong> {timestamp}
					</Text>

					{metadata.ip && (
						<Text className="m-0 text-sm text-[#555]">
							💻 <strong>{t('details.ip', { defaultValue: 'IP Address'})}:</strong> {metadata.ip}
						</Text>
					)}

					{metadata.location && (
						<Text className="m-0 text-sm text-[#555]">
							🌍 <strong>{t('details.location', { defaultValue: 'Location'})}:</strong>{' '}
							{metadata.location.city}, {metadata.location.country}
						</Text>
					)}

					{metadata.device && (
						<>
							<Text className="m-0 text-sm text-[#555]">
								🌐 <strong>{t('details.browser', { defaultValue: 'Browser' })}:</strong> {metadata.device.browser}
							</Text>
							<Text className="m-0 text-sm text-[#555]">
								📱 <strong>{t('details.os', { defaultValue: 'Operating System' })}:</strong> {metadata.device.os}
							</Text>
						</>
					)}
				</Section>

				{/* Security Recommendations */}
				<Section className="mb-4 rounded-lg border-l-4 border-[#007bff] bg-[#e7f3ff] px-4 py-3">
					<Text className="mb-2 font-semibold text-[#004085]">
						🔐 {t('recommendations.title', { defaultValue: 'Security Recommendations' })}
					</Text>
					<ul className="m-0 pl-5 text-sm text-[#004085]">
						<li>
							{t('recommendations.enable_2fa', { defaultValue: 'Enable two-factor authentication (2FA) for additional security' })}
						</li>
						<li>
							{t('recommendations.unique_password', { defaultValue: 'Use a unique password that you don\'t use on other websites' })}
						</li>
						<li>
							{t('recommendations.review_activity', { defaultValue: 'Review your recent security activity regularly' })}
						</li>
						<li>{t('recommendations.never_share', { defaultValue: 'Never share your password with anyone' })}</li>
					</ul>
				</Section>

				{/* Action Buttons */}
				<Section className="text-center">
					<Button
						className="m-auto box-border w-fit rounded-lg bg-[#28a745] px-6 py-3 text-center font-sans font-normal text-white traking-wider"
						href={enable2faUrl}
					>
						{t('cta.enable_2fa', { defaultValue: 'Enable 2FA Now' })}
					</Button>
				</Section>

				<Section className="mt-4 text-center">
					<Text className="m-0 text-sm">
						<a href={securityUrl} className="text-[#007bff] no-underline">
							{t('cta.security', { defaultValue: 'View Security Activity' })}
						</a>
					</Text>
				</Section>

				{/* Warning Footer */}
				<Section className="mt-4 px-2">
					<Text className="m-0 text-center text-xs text-[#656565]">
						{t('warning', { defaultValue: "If you did not request this password reset, please contact support immediately." })
}
					</Text>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}