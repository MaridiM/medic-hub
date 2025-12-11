# File: packages\components\providers\toaster-provider.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/providers/toaster-provider.tsx`

## Category
Frontend

## File Type
TSX (toaster-provider.tsx)

## Size
346 characters, 17 lines

## Full Code

```typescript
'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

export const ToasterProvider = () => {
    const { theme } = useTheme()

    return (
        <Sonner
            theme={theme as 'light' | 'dark' | 'system' | undefined}
            position="bottom-right"
            richColors
        />
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.243Z*
