# File: app\(root)\auth\page.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/app/(root)/auth/page.tsx`

## Category
Frontend

## File Type
TSX (page.tsx)

## Size
430 characters, 18 lines

## Full Code

```typescript
import { Metadata } from 'next'
import { getTranslations } from '@/packages/libs/i18n'
import { Login } from '@/modules/auth'

import { NO_INDEX_PAGE } from '@/packages/constants'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('auth.login')

    return {
        title: t('heading'),
        description: t('description'),
        ...NO_INDEX_PAGE
    }
}

export default Login

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.868Z*
