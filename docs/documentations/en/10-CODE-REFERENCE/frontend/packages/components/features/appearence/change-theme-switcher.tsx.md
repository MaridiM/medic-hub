# File: packages\components\features\appearence\change-theme-switcher.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/features/appearence/change-theme-switcher.tsx`

## Category
Frontend

## File Type
TSX (change-theme-switcher.tsx)

## Size
1837 characters, 53 lines

## Full Code

```typescript
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'

import { cn } from '@/packages/utils'

import { Button } from '../../shared'

type IProps = {
    className?: string
    iconClassName?: string
}

export function ChangeThemeSwitcher({ className, iconClassName }: IProps) {
    const { theme, setTheme, systemTheme } = useTheme()
    const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark')

    return (
        <div className={cn('bg-background flex items-center rounded-[7px] p-px', className)}>
            <Button
                variant='outline'
                size='icon'
                className={cn(
                    'size-6 cursor-pointer rounded-md bg-transparent transition-all duration-300 ease-in-out hover:bg-transparent',
                    {
                        'bg-card hover:bg-card rounded-r-[2px] shadow-lg': isDark
                    },
                    className
                )}
                onClick={() => setTheme('dark')}
            >
                <Sun className={cn('!size-4 stroke-yellow-500', iconClassName)} />
            </Button>
            <Button
                variant='outline'
                size='icon'
                className={cn(
                    'size-6 cursor-pointer rounded-md bg-transparent transition-all duration-300 ease-in-out hover:bg-transparent',
                    {
                        'bg-card hover:bg-card rounded-l-[2px] shadow-lg': !isDark
                    },
                    className
                )}
                onClick={() => setTheme('light')}
            >
                <Moon className={cn('!size-4', iconClassName)} />
            </Button>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.228Z*
