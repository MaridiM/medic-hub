# File: modules\auth\shared\components\header.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/shared/components/header.tsx`

## Category
Frontend

## File Type
TSX (header.tsx)

## Size
445 characters, 17 lines

## Full Code

```typescript
'use client'

import { ChangeLanguage, ChangeTheme, LogoIcon } from '@/packages/components'

export const Header = () => {
    return (
        <header className='flex h-16 items-center justify-between p-4'>
            <LogoIcon mini={false} className='h-8' />

            <div className='flex items-center gap-2'>
                <ChangeLanguage />
                <ChangeTheme />
            </div>
        </header>
    )
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.000Z*
