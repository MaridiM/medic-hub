# File: core\provider\mail\providers\email.provider.interface.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/core/provider/mail/providers/email.provider.interface.ts`

## Category
Backend

## File Type
TS (email.provider.interface.ts)

## Size
171 characters, 6 lines

## Full Code

```typescript
export const IEmailProvider = Symbol('IEmailProvider')

export interface IEmailProvider {
	sendMail(email: string, subject: string, html: string): Promise<unknown>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.077Z*
