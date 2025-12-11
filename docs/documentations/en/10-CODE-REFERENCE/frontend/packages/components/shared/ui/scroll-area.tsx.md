# File: packages\components\shared\ui\scroll-area.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/shared/ui/scroll-area.tsx`

## Category
Frontend

## File Type
TSX (scroll-area.tsx)

## Size
1749 characters, 49 lines

## Full Code

```typescript
'use client'

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { ComponentProps } from 'react'

import { cn } from '@/packages/utils/index'

function ScrollArea({ className, children, ...props }: ComponentProps<typeof ScrollAreaPrimitive.Root>) {
    return (
        <ScrollAreaPrimitive.Root data-slot='scroll-area' className={cn('relative', className)} {...props}>
            <ScrollAreaPrimitive.Viewport
                data-slot='scroll-area-viewport'
                className='size-full rounded-[inherit] border-border/20 transition-[color,box-shadow] outline-none focus-visible:outline-1'
            >
                {children}
            </ScrollAreaPrimitive.Viewport>
            <ScrollBar />
            <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>
    )
}

function ScrollBar({
    className,
    orientation = 'vertical',
    ...props
}: ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
    return (
        <ScrollAreaPrimitive.ScrollAreaScrollbar
            data-slot='scroll-area-scrollbar'
            orientation={orientation}
            className={cn(
                'flex touch-none p-px transition-colors select-none',
                orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent',
                orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent',
                className
            )}
            {...props}
        >
            <ScrollAreaPrimitive.ScrollAreaThumb
                data-slot='scroll-area-thumb'
                className='bg-border/20 relative flex-1 rounded-full'
            />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
    )
}

export { ScrollArea, ScrollBar }

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.310Z*
