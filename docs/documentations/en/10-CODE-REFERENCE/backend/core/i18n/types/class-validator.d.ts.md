# File: core\i18n\types\class-validator.d.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/core/i18n/types/class-validator.d.ts`

## Category
Backend

## File Type
TS (class-validator.d.ts)

## Size
211 characters, 12 lines

## Full Code

```typescript
declare module 'class-validator' {
	export interface ValidationArguments {
		context?: {
			lang?: string
			[key: string]: any
		}
	}
}

// Важно: убедитесь, что этот файл является модулем
export {}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.037Z*
