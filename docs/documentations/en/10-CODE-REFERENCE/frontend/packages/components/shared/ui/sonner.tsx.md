# File: packages\components\shared\ui\sonner.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/shared/ui/sonner.tsx`

## Category
Frontend

## File Type
TSX (sonner.tsx)

## Size
337 characters, 13 lines

## Full Code

```typescript
'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = 'system' } = useTheme()

    return <Sonner theme={theme as ToasterProps['theme']} className='toaster group' richColors {...props} />
}

export { Toaster }

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.334Z*
