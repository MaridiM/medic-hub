import { isEmail } from 'class-validator'
import { promises as dns } from 'dns'

import { CLIENT_URL, PATHS } from '@/core/config'
import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { ISessionMetadata } from '@/shared/types'
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common'
import { render } from '@react-email/components'

import { IEmailProvider } from './providers'
import { OtpCodeTemplate, VerificationEmailTemplate } from './templates'

const DISPOSABLE_DOMAINS = new Set(['10minutemail.com', 'temp-mail.org', 'mailinator.com'])

@Injectable()
export class MailService extends CoreService {
	private readonly logger = new Logger(MailService.name)

	constructor(
		i18n: I18nService,
		@Inject(IEmailProvider) private readonly emailProvider: IEmailProvider,
	) {
		super(i18n)
	}

	/**
	 * A guard method to check if an email can and should be sent.
	 */
	async canSendEmail(email: string): Promise<{ canSend: boolean; reason?: string }> {
		if (!isEmail(email)) {
			return { canSend: false, reason: 'invalid_format' }
		}
		const domain = email.split('@')[1]
		if (DISPOSABLE_DOMAINS.has(domain.toLowerCase())) {
			return { canSend: false, reason: 'disposable_email_provider' }
		}
		const userState = await this.prisma.user.findUnique({
			where: { email },
			select: { isUnsubscribed: true, emailBouncedAt: true },
		})
		if (userState?.isUnsubscribed) {
			return { canSend: false, reason: 'user_unsubscribed' }
		}
		if (userState?.emailBouncedAt) {
			return { canSend: false, reason: 'address_hard_bounced' }
		}
		try {
			const addresses = await dns.resolveMx(domain)
			if (!addresses || addresses.length === 0) {
				return { canSend: false, reason: 'domain_has_no_mx_records' }
			}
		} catch (error) {
			if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
				this.logger.warn(`DNS lookup failed for domain: ${domain}.`)
				return { canSend: false, reason: 'domain_not_found' }
			}
			this.logger.error(`DNS lookup for ${domain} failed unexpectedly:`, error)
		}
		return { canSend: true }
	}

	async sendVerificationEmailToken(email: string, token: string, lng: Language) {
		await this.ensureCanSend(email)
		const url = PATHS.VERIFY_EMAIL(CLIENT_URL, token)
		const html = await render(VerificationEmailTemplate({ url, i18n: this.i18n, lng }))
		const subject = this.i18n.t('mail.verification_email.subject', { lng })
		return this.sendMail(email, subject, html)
	}

	async sendOtpCodeEmail(email: string, code: string, lng: Language) {
		await this.ensureCanSend(email)
		const html = await render(OtpCodeTemplate({ code, i18n: this.i18n, lng }))
		const subject = this.i18n.t('mail.otp_code.subject', { lng, defaultValue: 'Your Verification Code' })
		return this.sendMail(email, subject, html)
	}

	async sendPasswordResetToken(email: string, token: string, metadata: ISessionMetadata, lng: Language) {
		await this.ensureCanSend(email)
		const url: string = PATHS.RESET_PASSWORD(CLIENT_URL, token)
		// const html = await render(ResetPasswordTemplate({ url, i18n: this.i18n, metadata, lng }))
		const html = `<div>RESET PASSWORD</div>`
		return this.sendMail(email, this.i18n.t('mail.reset_password.subject'), html)
	}

	private async sendMail(email: string, subject: string, html: string) {
		return this.emailProvider.sendMail(email, subject, html)
	}

	/**
	 * A private helper to wrap `canSendEmail` and throw an exception on failure.
	 */
	private async ensureCanSend(email: string) {
		const check = await this.canSendEmail(email)
		if (!check.canSend) {
			const message = `Skipping email to ${email}. Reason: ${check.reason}`
			this.logger.warn(message)
			throw new BadRequestException(message)
		}
	}
}
