# File: shared\utils\errors\tag.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/shared/utils/errors/tag.ts`

## Category
Backend

## File Type
TS (tag.ts)

## Size
497 characters, 15 lines

## Full Code

```typescript
/**
 * Типобезопасная обёртка над `Object.prototype.toString.call(v)`.
 * Нужна, чтобы избежать предупреждений `no-unsafe-return`/`no-unsafe-call` и
 * всегда возвращать строго `string`.
 *
 * @example
 * objectTag(123)            // "[object Number]"
 * objectTag(new Date())     // "[object Date]"
 */
export const objectTag = (v: unknown): string => {
	// call() действительно возвращает any — сузим тип локально
	const s = Object.prototype.toString.call(v) as string
	return s
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.697Z*
