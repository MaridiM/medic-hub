import { CLIENT_URL, COMPANY_NAME, PATHS } from '@/core/config'
import { I18nService, Language } from '@/core/i18n'
import { ISessionMetadata } from '@/shared/types'
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'

import { BrevoService, SendgridService } from './libs'
import { VerificationEmailTemplate } from './templates'
import { ResetPasswordTemplate } from './templates/reset-password'

@Injectable()
export class MailService {
	constructor(
		private readonly brevo: BrevoService,
		private readonly config: ConfigService,
		private readonly i18n: I18nService,
		private readonly mailer: MailerService,
		private readonly sendgrid: SendgridService,
	) {}

	/**
	 * Send Verification email
	 * @param email - user email to
	 * @param token - generated token
	 * @returns - sended info object
	 */
	async sendVerificationEmailToken(email: string, token: string, lng: Language) {
		const url: string = PATHS.VERIFY_EMAIL(CLIENT_URL, token)
		const html = await render(VerificationEmailTemplate({ url, i18n: this.i18n, lng }))
		return this.sendMail(email, this.i18n.t('mail.verification_email.subject'), html)
	}

	/**
	 * Send Verification email
	 * @param email - user email to
	 * @param token - generated token
	 * @param metadata - user browser info, ip, location, device
	 * @returns - sended info object
	 */
	async sendPasswordResetToken(email: string, token: string, metadata: ISessionMetadata, lng: Language) {
		const url: string = PATHS.RESET_PASSWORD(CLIENT_URL, token)
		const html = await render(ResetPasswordTemplate({ url, i18n: this.i18n, metadata, lng }))
		return this.sendMail(email, this.i18n.t('mail.reset_password.subject'), html)
	}

	/**
	 * Base send mail method
	 * @param email - email address to
	 * @param subject - subject for email
	 * @param html - React, html email template
	 * @returns - send mail
	 */
	private async sendMail(email: string, subject: string, html: string) {
		if (this.config.getOrThrow<string>('MAIL_USE_SERVICE') === 'brevo') {
			return this.brevo.sendMail(email, subject, html)
		}

		if (this.config.getOrThrow<string>('MAIL_USE_SERVICE') === 'sendgrid') {
			return this.sendgrid.sendMail(email, subject, html)
		}

		const sentResponse: unknown = await this.mailer.sendMail({
			from: `"${COMPANY_NAME}" <${this.config.getOrThrow<string>('MAIL_LOGIN')}>`,
			to: email,
			subject,
			html,
		})

		return sentResponse
	}
}
