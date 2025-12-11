# File: core\i18n\locales\index.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/core/i18n/locales/index.ts`

## Category
Backend

## File Type
TS (index.ts)

## Size
371 characters, 15 lines

## Full Code

```typescript
import en from './en'
import ruRaw from './ru'

export type MessagesSchema = typeof en // эталон — структура EN
export const ru: MessagesSchema = ruRaw // гарантируем совпадение структуры

const languages = {
	en,
	ru,
} as const

export default languages
export type LanguagesMap = typeof languages
export type Language = keyof LanguagesMap // "en" | "ru"

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.031Z*
