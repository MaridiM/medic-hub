# File: modules\auth\features\wrapper.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/features/wrapper.tsx`

## Category
Frontend

## File Type
TSX (wrapper.tsx)

## Size
635 characters, 20 lines

## Full Code

```typescript
import { PropsWithChildren } from 'react'

import { cn } from '@/packages/utils'

import { Footer, Header } from '@/auth/shared/components'

interface WrapperProps extends PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
    className?: string
}

export const Wrapper = ({ children, className, ...props }: WrapperProps) => {
    return (
        <div className={cn('flex min-h-screen w-full flex-col gap-6 overflow-y-auto', className)} {...props}>
            <Header />
            <div className='flex flex-1 items-center justify-center p-4'>{children}</div>
            <Footer />
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.939Z*
