# File: shared\utils\errors\prisma-errors.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/shared/utils/errors/prisma-errors.ts`

## Category
Backend

## File Type
TS (prisma-errors.ts)

## Size
312 characters, 7 lines

## Full Code

```typescript
import { Prisma } from '@prisma/__generated__'

export function isPrismaError(e: unknown, code?: string): e is Prisma.PrismaClientKnownRequestError {
	const err = e as Prisma.PrismaClientKnownRequestError
	return !!err && err.name === 'PrismaClientKnownRequestError' && (code ? err.code === code : true)
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.695Z*
