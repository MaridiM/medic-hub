# File: packages\libs\i18n\language.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/libs/i18n/language.ts`

## Category
Frontend

## File Type
TS (language.ts)

## Size
558 characters, 20 lines

## Full Code

```typescript
'use server'

import { cookies } from 'next/headers'

import { COOKIE_NAME, TLanguage, defaultLanguage } from './config'

export async function getCurrentLanguage() {
    const cookieStore = await cookies()
    return (cookieStore.get(COOKIE_NAME)?.value ?? defaultLanguage) as TLanguage
}

export async function setLanguage(language: TLanguage): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, language, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
      })
}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.709Z*
