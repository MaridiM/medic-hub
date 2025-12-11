# File: packages\libs\i18n\request.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/libs/i18n/request.ts`

## Category
Frontend

## File Type
TS (request.ts)

## Size
673 characters, 19 lines

## Full Code

```typescript
import { getRequestConfig } from 'next-intl/server'

import { translations as authTranslations } from '@/auth/shared/libs/i18n'

import { TLanguage, defaultLanguage } from './config'
import { getCurrentLanguage } from './language'
import { translations } from './locales'

export default getRequestConfig(async () => {
    const locale: TLanguage = (await getCurrentLanguage()) ?? defaultLanguage
    return {
        locale,
        messages: { ...translations[locale], ...authTranslations[locale] }

        // ✅ DEBUG: Проверяем, что массивы есть ДО передачи в next-intl
        // messages: (await import(`./locales/${locale}.json`)).default
    }
})

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.722Z*
