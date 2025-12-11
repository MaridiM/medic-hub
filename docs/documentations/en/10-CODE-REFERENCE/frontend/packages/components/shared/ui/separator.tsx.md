# File: packages\components\shared\ui\separator.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/shared/ui/separator.tsx`

## Category
Frontend

## File Type
TSX (separator.tsx)

## Size
789 characters, 29 lines

## Full Code

```typescript
'use client'

import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { ComponentProps } from 'react'

import { cn } from '@/packages/utils/index'

function Separator({
    className,
    orientation = 'horizontal',
    decorative = true,
    ...props
}: ComponentProps<typeof SeparatorPrimitive.Root>) {
    return (
        <SeparatorPrimitive.Root
            data-slot='separator-root'
            decorative={decorative}
            orientation={orientation}
            className={cn(
                'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
                className
            )}
            {...props}
        />
    )
}

export { Separator }

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.327Z*
