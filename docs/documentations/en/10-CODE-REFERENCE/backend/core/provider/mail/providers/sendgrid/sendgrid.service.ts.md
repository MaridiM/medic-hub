# File: core\provider\mail\providers\sendgrid\sendgrid.service.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/core/provider/mail/providers/sendgrid/sendgrid.service.ts`

## Category
Backend

## File Type
TS (sendgrid.service.ts)

## Size
1457 characters, 50 lines

## Full Code

```typescript
import { COMPANY_NAME } from '@/core/config'
import { I18nService } from '@/core/i18n'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import sgMail from '@sendgrid/mail'

import { IEmailProvider } from '../email.provider.interface'

@Injectable()
export class SendgridService implements IEmailProvider {
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
	 * @param lng - current language of user
	 * @returns - send mail
	 */
	async sendMail(email: string, subject: string, html: string, lng?: string): Promise<boolean> {
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
				this.i18n.t('mail.errors.message_send_failed', { lng }) || 'Failed to send the message.',
			)
		}
	}
}

```

## Description

This file is part of the MedicHub API (NestJS) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.083Z*
