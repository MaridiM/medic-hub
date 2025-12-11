# File: shared\types\express.d.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/shared/types/express.d.ts`

## Category
Backend

## File Type
TS (express.d.ts)

## Size
190 characters, 13 lines

## Full Code

```typescript
import 'express'

declare global {
	namespace Express {
		interface Request {
			/**
			 * Preferred language (i18n middleware may set this)
			 */
			language?: string
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.676Z*
