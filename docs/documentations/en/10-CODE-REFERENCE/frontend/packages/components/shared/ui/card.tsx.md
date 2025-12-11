# File: packages\components\shared\ui\card.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/shared/ui/card.tsx`

## Category
Frontend

## File Type
TSX (card.tsx)

## Size
1976 characters, 60 lines

## Full Code

```typescript
import { ComponentProps } from 'react'

import { cn } from '@/packages/utils/index'

function Card({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            data-slot='card'
            className={cn(
                'bg-card text-card-foreground border-border/20 flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
                className
            )}
            {...props}
        />
    )
}

function CardHeader({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            data-slot='card-header'
            className={cn(
                '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
                className
            )}
            {...props}
        />
    )
}

function CardTitle({ className, ...props }: ComponentProps<'div'>) {
    return <div data-slot='card-title' className={cn('leading-none font-semibold', className)} {...props} />
}

function CardDescription({ className, ...props }: ComponentProps<'div'>) {
    return <div data-slot='card-description' className={cn('text-muted-foreground text-p-sm', className)} {...props} />
}

function CardAction({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            data-slot='card-action'
            className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
            {...props}
        />
    )
}

function CardContent({ className, ...props }: ComponentProps<'div'>) {
    return <div data-slot='card-content' className={cn('px-6', className)} {...props} />
}

function CardFooter({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div data-slot='card-footer' className={cn('flex items-center px-6 [.border-t]:pt-6', className)} {...props} />
    )
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.267Z*
