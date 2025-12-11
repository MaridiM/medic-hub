# File: core\provider\mail\providers\brevo\brevo.service.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/core/provider/mail/providers/brevo/brevo.service.ts`

## Category
Backend

## File Type
TS (brevo.service.ts)

## Size
1537 characters, 48 lines

## Full Code

```typescript
import { COMPANY_NAME } from '@/core/config'
import * as brevo from '@getbrevo/brevo'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { IEmailProvider } from '../email.provider.interface'

@Injectable()
export class BrevoService implements IEmailProvider {
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
			name: COMPANY_NAME,
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.072Z*
