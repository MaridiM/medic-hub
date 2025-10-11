import { COMPANY_NAME } from '@/core/config'
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { IEmailProvider } from './email.provider.interface'

@Injectable()
export class SmtpService implements IEmailProvider {
	constructor(
		private readonly mailer: MailerService,
		private readonly config: ConfigService,
	) {}

	async sendMail(email: string, subject: string, html: string): Promise<unknown> {
		return this.mailer.sendMail({
			from: `"${COMPANY_NAME}" <${this.config.getOrThrow<string>('MAIL_LOGIN')}>`,
			to: email,
			subject,
			html,
		})
	}
}
