import * as brevo from '@getbrevo/brevo'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class BrevoService {
	private apiInstance: brevo.TransactionalEmailsApi

	constructor(private readonly configService: ConfigService) {
		this.apiInstance = new brevo.TransactionalEmailsApi()
		this.apiInstance.setApiKey(
			brevo.TransactionalEmailsApiApiKeys.apiKey,
			this.configService.getOrThrow<string>('MAIL_BREVO_API_KEY'),
		)
	}

	/**
	 * Send mail method from Brove
	 * -- need verify email domain gmail don't support
	 * @param email - email address to
	 * @param subject - subject for email
	 * @param html - React, html email template
	 * @returns - send mail
	 */
	async sendMail(email: string, subject: string, html: string) {
		const sendSmtpEmail: brevo.SendSmtpEmail = new brevo.SendSmtpEmail()

		sendSmtpEmail.subject = subject
		sendSmtpEmail.htmlContent = html
		sendSmtpEmail.sender = {
			name: 'Twitch Clone',
			email: this.configService.getOrThrow<string>('MAIL_BREVO_SENDER'),
		}
		sendSmtpEmail.to = [{ email }]

		try {
			const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail)
			return response.body
		} catch (error) {
			console.log('[BREVO_ERROR] - ', error)
			throw new BadRequestException('Ошибка отправки сообщения')
		}
	}
}
