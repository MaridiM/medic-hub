import { getMailerConfig } from '@/core/config'
import { UrlService } from '@/shared/utils'
import { MailerModule } from '@nestjs-modules/mailer'
import { Global, Module, Provider } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { MailService } from './mail.service'
import { BrevoService, SendgridService } from './providers'
import { IEmailProvider } from './providers/email.provider.interface'
import { SmtpService } from './providers/smtp.service'

//Factory for change email service
const emailProviderFactory: Provider = {
	provide: IEmailProvider,
	useFactory: (config: ConfigService, brevo: BrevoService, sendgrid: SendgridService, smtp: SmtpService) => {
		const mailService = config.get<string>('MAIL_USE_SERVICE')?.toLowerCase()
		switch (mailService) {
			case 'brevo':
				return brevo
			case 'sendgrid':
				return sendgrid
			default:
				return smtp
		}
	},
	inject: [ConfigService, BrevoService, SendgridService, SmtpService],
}

@Global()
@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getMailerConfig,
			inject: [ConfigService],
		}),
	],
	providers: [MailService, SmtpService, emailProviderFactory, BrevoService, SendgridService, UrlService],
	exports: [MailService, emailProviderFactory],
})
export class MailModule {}
