import { COMPANY_NAME, I18nService } from '@/core'
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'

import { BrevoService, SendgridService } from './libs'
import { VerificationEmailTemplate } from './templates'

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
	async sendVerificationEmailToken(email: string, token: string, language: string) {
		const html = await render(VerificationEmailTemplate({ token, i18n: this.i18n, language }))

		return this.sendMail(email, this.i18n.t('mail.verification_email.subject'), html)
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
