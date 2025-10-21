import { APP_NAME, COMPANY_NAME, SUPPORT_EMAIL } from '@/core/config'
import { type I18nService } from '@/core/i18n'
import { Body, Head, Html, Img, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { PropsWithChildren } from 'react'

type TTemplateName =
	| 'verification_email'
	| 'otp_code'
	| '2fa_method_added'
	| '2fa_method_removed'
	| '2fa_disabled'
	| 'new_device_login'
	| 'suspicious_activity'
	| 'low_backup_codes'
	| 'backup_codes_regenerated'
	| '2fa_disabled_by_admin'
	| 'device_revoked_by_admin'
	| 'password_changed'
	| 'reset_password'
	| 'password_reset_confirmation'

export interface IProps {
	template: TTemplateName
	i18n?: I18nService
	lng?: string
}

export function TemplateWrapper({ template, children, i18n, lng = 'en' }: PropsWithChildren<IProps>) {
	const currentYear: number = new Date().getFullYear()
	const t = i18n.t(`mail.${template}`, { lng })
	const tTemp = i18n.t(`mail.template`, { lng })

	return (
		<Html lang={lng}>
			<Preview>{t('preview')}</Preview>
			<Tailwind>
				<Head />
				<Body className="m-auto max-w-[600px] bg-[#efefef] px-3 py-3">
					{/* Логотип */}
					<div className="h-fit space-y-4 rounded-md bg-white px-4 py-6 text-center">
						<Section>
							{/*[if mso]><div style="font-family:Segoe UI, Arial, sans-serif; font-size:20px; font-weight:700; color:#143394">{companyName}</div><![endif]*/}
							<div className="flex h-12 items-center justify-center" role="svg" aria-label={COMPANY_NAME}>
								<Img
									src="https://res.cloudinary.com/dki4lxdki/image/upload/v1759181992/doctorlab/app/logo-full.png"
									width="180"
									height="44"
									alt={COMPANY_NAME}
									style={{ display: 'block', margin: '0 auto', border: '0', outline: 'none', textDecoration: 'none' }}
								/>
							</div>
						</Section>

						{children}
					</div>

					<Section className="px-1 pt-4">
						<Text className="m-0 text-xs text-[#656565]">
							{tTemp('signature')[0] || 'Regards, the'}{' '}
							<span className="font-semibold text-[#143394]">
								{tTemp('signature', { company: COMPANY_NAME })[1] || `${COMPANY_NAME} team`}
							</span>
						</Text>
						<Text className="mt-2 text-xs text-[#656565]">
							{tTemp('supportNote') || 'This is an automated message; please do not reply. Contact support: '}
							<Link href={`mailto:${SUPPORT_EMAIL}`} className="text-[#656565] underline">
								{SUPPORT_EMAIL}
							</Link>
						</Text>
						<Text className="mb-2 font-sans text-xs font-normal leading-[14px] text-[#656565]">
							{t('legalNote', { app: APP_NAME }) ||
								`You're receiving this email because you created a ${APP_NAME} account. If you didn't request this, you can safely ignore this email.`}
						</Text>
					</Section>

					<Section className="px-2 text-center">
						<Text className="mb-4 font-sans text-xs font-normal tracking-wide text-[#656565]">
							{tTemp('copyright', { year: currentYear, company: APP_NAME }) ||
								`© ${currentYear} ${APP_NAME}. All rights reserved.`}
						</Text>
						{/*[if mso]><div style="font-family:Segoe UI, Arial, sans-serif; font-size:20px; font-weight:700; color:#143394">{companyName}</div><![endif]*/}
						<div className="m-auto flex size-12 items-center justify-center" role="img" aria-label={COMPANY_NAME}>
							<Img
								src="https://res.cloudinary.com/dki4lxdki/image/upload/v1759181993/doctorlab/app/logo-mini.png"
								width="44"
								height="44"
								alt={COMPANY_NAME}
								style={{ display: 'block', margin: '0 auto', border: '0', outline: 'none', textDecoration: 'none' }}
							/>
						</div>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	)
}