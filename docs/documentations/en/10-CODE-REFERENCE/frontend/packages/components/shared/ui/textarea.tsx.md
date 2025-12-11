# File: packages\components\shared\ui\textarea.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/shared/ui/textarea.tsx`

## Category
Frontend

## File Type
TSX (textarea.tsx)

## Size
684 characters, 19 lines

## Full Code

```typescript
import * as React from 'react'

import { cn } from '@/packages/utils/index'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
    return (
        <textarea
            data-slot='textarea'
            className={cn(
                'border-border/20 bg-card text-p-sm file:text-p-sm file:text-foreground placeholder:text-muted-foreground md:text-p-sm flex h-10 w-full overflow-hidden rounded-md border px-4 pt-[9px] pb-2 file:border-0 file:bg-transparent file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            {...props}
        />
    )
}

export { Textarea }

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.344Z*
