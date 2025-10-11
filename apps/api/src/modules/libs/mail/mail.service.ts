import { CLIENT_URL, PATHS } from '@/core/config'
import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { ISessionMetadata } from '@/shared/types'
import { Inject, Injectable } from '@nestjs/common'
import { render } from '@react-email/components'

import { IEmailProvider } from './providers'
import { VerificationEmailTemplate } from './templates'
import { ResetPasswordTemplate } from './templates/reset-password'

@Injectable()
export class MailService extends CoreService {
	constructor(
		i18n: I18nService,
		@Inject(IEmailProvider) private readonly emailProvider: IEmailProvider,
	) {
		super(i18n)
	}

	/**
	 * Send Verification email
	 * @param email - user email to
	 * @param token - generated token
	 * @returns - sended info object
	 */
	async sendVerificationEmailToken(email: string, token: string, lng: Language) {
		const url = PATHS.VERIFY_EMAIL(CLIENT_URL, token)
		const html = await render(VerificationEmailTemplate({ url, i18n: this.i18n, lng }))
		const subject = this.i18n.t('mail.verification_email.subject', { lng })
		return this.sendMail(email, subject, html)
	}

	/**
	 * Send Verification email
	 * @param email - user email to
	 * @param token - generated token
	 * @returns - sended info object
	 */
	async sendVerificationEmailOtpToken(email: string, token: string, lng: Language) {
		const url = PATHS.VERIFY_EMAIL(CLIENT_URL, token)
		const html = await render(VerificationEmailTemplate({ url, i18n: this.i18n, lng }))
		const subject = this.i18n.t('mail.verification_email.subject', { lng })
		return this.sendMail(email, subject, html)
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
	 * Проверка возможности отправки Email
	 */
	async canSendEmail(_email: string): Promise<boolean> {
		// TODO: Добавить валидацию email, проверку черного списка и т.д.
		return Promise.resolve(true)
	}

	private async sendMail(email: string, subject: string, html: string) {
		// Просто делегируем вызов выбранному провайдеру
		return this.emailProvider.sendMail(email, subject, html)
	}
}
