# File: packages\config\providers\theme.provider.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/config/providers/theme.provider.tsx`

## Category
Frontend

## File Type
TSX (theme.provider.tsx)

## Size
480 characters, 16 lines

## Full Code

```typescript
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ComponentProps, useEffect, useState } from 'react'

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
    const [mounted, setMounted] = useState<boolean>(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.542Z*
