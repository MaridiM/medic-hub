# File: packages\components\shared\ui\badge.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/shared/ui/badge.tsx`

## Category
Frontend

## File Type
TSX (badge.tsx)

## Size
1171 characters, 30 lines

## Full Code

```typescript
import { type VariantProps, cva } from 'class-variance-authority'
import { HTMLAttributes } from 'react'

import { cn } from '@/packages/utils'

const badgeVariants = cva(
    'inline-flex items-center rounded-full border border-border/20 px-2.5 py-0.5 !text-label-lg  pt-[2px] font-medium transition-colors focus:outline-none',
    {
        variants: {
            variant: {
                default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
                secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
                destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
                outline: 'text-foreground'
            }
        },
        defaultVariants: {
            variant: 'default'
        }
    }
)

export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.264Z*
