# File: packages\components\features\appearence\change-theme.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/features/appearence/change-theme.tsx`

## Category
Frontend

## File Type
TSX (change-theme.tsx)

## Size
995 characters, 34 lines

## Full Code

```typescript
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/packages/components'
import { cn } from '@/packages/utils'

interface IProps {
    className?: string
    iconClassName?: string
}

export function ChangeTheme({ className, iconClassName }: IProps) {
    const { theme, setTheme, systemTheme } = useTheme()

    const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark')

    return (
        <Button
            variant='outline'
            size='icon'
            className={cn('border-none bg-transparent transition-all duration-300 ease-in-out', className)}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
            {isDark ? (
                <Sun className={cn('!size-5 stroke-yellow-500', iconClassName)} />
            ) : (
                <Moon className={cn('!size-5', iconClassName)} />
            )}
        </Button>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.230Z*
