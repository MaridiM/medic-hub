import { COMPANY_NAME, DEFAULT_LANGUAGE, I18nService, type Language, SUPPORT_EMAIL, tObj } from '@/core'
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
	async sendVerificationEmailToken(email?: string, token?: string, language?: Language) {
		const content = tObj('mail.verification_email', {
			lng: language ?? DEFAULT_LANGUAGE,
			hours: 24, // ← подставится в {hours}
		})
		const html = await render(VerificationEmailTemplate({ token, content }))

		// return this.sendMail(email, 'Верификация аккаунта', html)
		return Promise.resolve(1)
	}
}
