import { isPhoneNumber } from 'class-validator'
import twilio from 'twilio'
import type { Twilio } from 'twilio'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
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

	/**
	 * Checks if an SMS can and should be sent to a given phone number.
	 */
	async canSendSms(phone: string): Promise<{ canSend: boolean; reason?: string }> {
		// 1. Format validation (E.164)
		if (!isPhoneNumber(phone, undefined)) {
			// Using undefined region to enforce E.164
			return { canSend: false, reason: 'invalid_phone_format' }
		}
		// 2. Internal database check (bounce tracking)
		const userState = await this.prisma.user.findUnique({
			where: { phone },
			select: { phoneBouncedAt: true },
		})
		if (userState?.phoneBouncedAt) {
			return { canSend: false, reason: 'phone_hard_bounced' }
		}
		// 3. (Optional) External lookup via Twilio Lookup API
		try {
			const lookup = await this.twilioClient.lookups.v2.phoneNumbers(phone).fetch()
			if (!lookup.valid || lookup.lineTypeIntelligence?.type === 'voip') {
				return { canSend: false, reason: `invalid_line_type:${lookup.lineTypeIntelligence?.type}` }
			}
		} catch (error) {
			this.logger.error(`Twilio Lookup failed for ${phone}:`, error)
			// Decide if we should proceed or fail on lookup error
		}
		return { canSend: true }
	}

	async sendSMS(to: string, body: string, from?: string): Promise<boolean> {
		await this.ensureCanSend(to)
		try {
			await this.twilioClient.messages.create({ body, to, from: from ?? this.defaultFrom })
			return true
		} catch (error: unknown) {
			this.logError(error)
			// Here we could update user's `phoneBouncedAt` if the error indicates a permanent failure
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
		const message = this.i18n.t('sms.verification.phone', {
			lng,
			defaultValue: `Your verification code: ${code}`,
			args: { code },
		})
		return this.sendSMS(to, message)
	}
	/**
	 * Send verification OTP sms with code
	 * @param to recipient phone address
	 * @param code verification code
	 * @returns boolean true if successful, false if not sent
	 */
	async sendOtpSMS(to: string, code: string, lng: Language): Promise<boolean> {
		const message = this.i18n.t('sms.verification.otp', {
			lng,
			defaultValue: `Your verification code: ${code}`,
			args: { code },
		})
		return this.sendSMS(to, message)
	}

	private async ensureCanSend(phone: string) {
		const check = await this.canSendSms(phone)
		if (!check.canSend) {
			const message = `Skipping SMS to ${phone}. Reason: ${check.reason}`
			this.logger.warn(message)
			throw new BadRequestException(message)
		}
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
}
