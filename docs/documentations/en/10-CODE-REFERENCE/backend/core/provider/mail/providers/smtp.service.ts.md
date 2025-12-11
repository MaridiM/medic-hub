# File: core\provider\mail\providers\smtp.service.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/core/provider/mail/providers/smtp.service.ts`

## Category
Backend

## File Type
TS (smtp.service.ts)

## Size
687 characters, 24 lines

## Full Code

```typescript
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.085Z*
