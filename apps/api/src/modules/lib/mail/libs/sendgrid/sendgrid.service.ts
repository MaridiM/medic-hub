import { COMPANY_NAME, I18nService } from '@/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import sgMail from '@sendgrid/mail'

@Injectable()
export class SendgridService {
	private sgMail: typeof sgMail

	constructor(
		private readonly config: ConfigService,
		private readonly i18n: I18nService,
	) {
		const apiKey = this.config.getOrThrow<string>('MAIL_SENDGRID_API_KEY')
		if (!apiKey) {
			throw new Error('API key is missing.')
		}
		sgMail.setApiKey(apiKey)
		this.sgMail = sgMail
	}

	/**
	 * Send mail method from Brove
	 * @param email - email address to
	 * @param subject - subject for email
	 * @param html - React, html email template
	 * @returns - send mail
	 */
	async sendMail(email: string, subject: string, html: string, language?: string): Promise<boolean> {
		try {
			await this.sgMail.send({
				to: email,
				from: `"${COMPANY_NAME}" <${this.config.getOrThrow<string>('MAIL_SENDGRID_SENDER')}>`,
				subject,
				html,
			})
			return true
		} catch (error) {
			console.log('[SENDGRID_ERROR] - ', error)
			throw new BadRequestException(
				this.i18n.t('mail.errors.message_send_failed', { lng: language ?? 'en' }) ||
					'Failed to send the message.',
			)
		}
	}
}
