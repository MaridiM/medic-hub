# File: app\(root)\auth\verify\page.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/app/(root)/auth/verify/page.tsx`

## Category
Frontend

## File Type
TSX (page.tsx)

## Size
791 characters, 27 lines

## Full Code

```typescript
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Verify } from '@/modules/auth'

import { PATHS } from '@/packages/config'
import { NO_INDEX_PAGE } from '@/packages/constants'
import { getTranslations } from '@/packages/libs/i18n'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('auth.verify')

    return {
        title: t('heading'),
        description: t('description'),
        ...NO_INDEX_PAGE
    }
}
export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token: string }> }) {
    const token = (await searchParams).token

    if (!token) {
        return redirect(PATHS.auth('create-account'))
    }
    return <Verify token={token} />
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.888Z*
