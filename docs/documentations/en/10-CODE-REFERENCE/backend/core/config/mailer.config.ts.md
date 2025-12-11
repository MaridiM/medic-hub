# File: core\config\mailer.config.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/core/config/mailer.config.ts`

## Category
Backend

## File Type
TS (mailer.config.ts)

## Size
539 characters, 17 lines

## Full Code

```typescript
import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export function getMailerConfig(configService: ConfigService): MailerOptions {
	return {
		transport: {
			host: configService.getOrThrow<string>('MAIL_HOST'),
			port: configService.getOrThrow<number>('MAIL_PORT'),
			secure: false, // Использовать true для SSL (порт 465)
			auth: {
				user: configService.getOrThrow<string>('MAIL_LOGIN'),
				pass: configService.getOrThrow<string>('MAIL_PASSWORD'),
			},
		},
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.006Z*
