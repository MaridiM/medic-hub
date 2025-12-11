# File: packages\components\shared\ui\spinner.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/shared/ui/spinner.tsx`

## Category
Frontend

## File Type
TSX (spinner.tsx)

## Size
355 characters, 13 lines

## Full Code

```typescript
import { Loader2Icon } from 'lucide-react'
import { ComponentProps } from 'react'

import { cn } from '@/packages/utils/index'

function Spinner({ className, ...props }: ComponentProps<'svg'>) {
    return (
        <Loader2Icon role='status' aria-label='Loading' className={cn('size-4 animate-spin', className)} {...props} />
    )
}

export { Spinner }

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.337Z*
