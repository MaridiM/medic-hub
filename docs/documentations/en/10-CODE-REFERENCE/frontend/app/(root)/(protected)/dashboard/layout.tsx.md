# File: app\(root)\(protected)\dashboard\layout.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/app/(root)/(protected)/dashboard/layout.tsx`

## Category
Frontend

## File Type
TSX (layout.tsx)

## Size
368 characters, 16 lines

## Full Code

```typescript
import { ReactNode } from 'react'
import { Toaster } from 'sonner'

export default async function OrganizationLayout({
    children
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <div>
            <main className='min-h-screen w-full'>{children}</main>
            <Toaster position='bottom-right' richColors />
        </div>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.847Z*
