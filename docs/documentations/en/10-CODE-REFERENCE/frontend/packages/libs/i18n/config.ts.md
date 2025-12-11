# File: packages\libs\i18n\config.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/libs/i18n/config.ts`

## Category
Frontend

## File Type
TS (config.ts)

## Size
794 characters, 21 lines

## Full Code

```typescript
import { useTranslations } from './types'
import { GetByPath, TypedT } from './types/paths'
import type { AllMessages, Namespace } from './types/typed'

export const COOKIE_NAME = 'language'
export const languages = ['ru', 'en'] as const
export const defaultLanguage: TLanguage = 'en'

export type TLanguage = (typeof languages)[number]

// Base type (for useTranslations without arguments)
export type TUseTranslations = ReturnType<typeof useTranslations>

// Generic type for scoped translations
export type TScopedTranslations<N extends Namespace> = TypedT<GetByPath<AllMessages, N>>

// Universal type for any scenario
export type TTranslationFunction<N extends Namespace | never = never> = N extends never
    ? TypedT<AllMessages>
    : TypedT<GetByPath<AllMessages, N>>

```

## Description

This file is part of the MedicHub Frontend (Next.js) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.703Z*
