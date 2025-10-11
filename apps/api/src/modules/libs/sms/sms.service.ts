import twilio from 'twilio'
import type { Twilio } from 'twilio'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

interface TwilioError {
	message: string
	code?: number
	status?: number
	moreInfo?: string
	[key: string]: unknown
}

@Injectable()
export class SmsService extends CoreService {
	private readonly logger: Logger = new Logger(SmsService.name)
	private readonly twilioClient: Twilio
	private readonly defaultFrom: string

	constructor(i18n: I18nService, config: ConfigService) {
		super(i18n, undefined, undefined, config)

		const accountSid: string = this.config.getOrThrow<string>('TWILIO_SID')
		const authToken: string = this.config.getOrThrow<string>('TWILIO_TOKEN')
		this.defaultFrom = this.config.getOrThrow<string>('TWILIO_PHONE')

		this.twilioClient = twilio(accountSid, authToken)
	}

	private isTwilioError(error: unknown): error is TwilioError {
		return (
			typeof error === 'object' &&
			error !== null &&
			'message' in error &&
			typeof (error as TwilioError).message === 'string'
		)
	}

	private logError(error: unknown): void {
		if (this.isTwilioError(error)) {
			const codeInfo: string = error.code ? ` (code: ${error.code})` : ''
			const statusInfo: string = error.status ? ` (status: ${error.status})` : ''

			this.logger.error(`Twilio SMS send failed${codeInfo}${statusInfo}: ${error.message}`)
			this.logger.debug(`Twilio error payload: ${JSON.stringify(error)}`)
		} else if (error instanceof Error) {
			this.logger.error(`Twilio SMS send failed: ${error.message}`)
		} else {
			this.logger.error('Twilio SMS send failed: Unknown error')
		}
	}

	async sendSMS(to: string, body: string, from?: string): Promise<boolean> {
		try {
			await this.twilioClient.messages.create({
				body,
				to,
				from: from ?? this.defaultFrom,
			})
			return true
		} catch (error: unknown) {
			this.logError(error)
			return false
		}
	}

	/**
	 * Send verification sms with code
	 * @param to recipient phone address
	 * @param code verification code
	 * @returns boolean true if successful, false if not sent
	 */
	async sendVerificationPhoneSMS(to: string, code: string, lng: Language): Promise<boolean> {
		return this.sendSMS(to, this.msg('sms.verification.phone', `Your verification code is: ${code}`, { lng, code }))
	}
	/**
	 * Send verification OTP sms with code
	 * @param to recipient phone address
	 * @param code verification code
	 * @returns boolean true if successful, false if not sent
	 */
	async sendOtpSMS(to: string, code: string, lng: Language): Promise<boolean> {
		return this.sendSMS(to, this.msg('sms.verification.otp', `Your verification code is: ${code}`, { lng, code }))
	}

	/**
	 * Проверка возможности отправки SMS
	 */
	async canSendSms(_phone: string): Promise<boolean> {
		// TODO: Добавить валидацию номера, проверку черного списка и т.д.
		return Promise.resolve(true)
	}
}
