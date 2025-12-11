# File: packages\components\shared\ui\checkbox.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/shared/ui/checkbox.tsx`

## Category
Frontend

## File Type
TSX (checkbox.tsx)

## Size
1198 characters, 29 lines

## Full Code

```typescript
'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react'

import { cn } from '@/packages/utils'

const Checkbox = forwardRef<
    ComponentRef<typeof CheckboxPrimitive.Root>,
    ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            'peer border-border/40 data-[state=checked]:bg-primary data-[state=checked]:text-text-foreground size-4 shrink-0 rounded-sm border focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-none',
            className
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
            <Check className='stroke-text-foreground size-3 stroke-[2.5px] pl-[0.5px] transition-colors duration-300 ease-in-out' />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.269Z*
