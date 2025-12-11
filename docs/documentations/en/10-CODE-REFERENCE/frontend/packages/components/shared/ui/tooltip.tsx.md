# File: packages\components\shared\ui\tooltip.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/shared/ui/tooltip.tsx`

## Category
Frontend

## File Type
TSX (tooltip.tsx)

## Size
1282 characters, 31 lines

## Full Code

```typescript
'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react'

import { cn } from '@/packages/utils'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = forwardRef<
    ComponentRef<typeof TooltipPrimitive.Content>,
    ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
            'bg-popover !text-p-sm text-popover-foreground animate-in fade-in-0 zoom-in-95 border-border/20 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-md border px-3 py-1.5 shadow-md',
            className
        )}
        {...props}
    />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.407Z*
