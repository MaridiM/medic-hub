# File: packages\components\shared\countdown.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/shared/countdown.tsx`

## Category
Frontend

## File Type
TSX (countdown.tsx)

## Size
964 characters, 38 lines

## Full Code

```typescript
'use client'

import { useTranslations } from '@/packages/libs/i18n'
import { useEffect, useState } from 'react'

import { cn } from '@/packages/utils'

interface CountdownProps {
    /** Start value in seconds */
    duration: number
    className?: string
}

export const Countdown = ({ duration, className }: CountdownProps) => {
    const t = useTranslations('core')

    const [remaining, setRemaining] = useState(duration)

    // reset when duration changes
    useEffect(() => {
        setRemaining(duration)
    }, [duration])

    // tick every second
    useEffect(() => {
        if (remaining <= 0) return
        const id = window.setTimeout(() => setRemaining(r => r - 1), 1000)
        return () => clearTimeout(id)
    }, [remaining])

    return (
        <span className={cn('text-text-secondary text-p-xs', className)}>
            {remaining}
            {t('time.seconds.short')}
        </span>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.244Z*
