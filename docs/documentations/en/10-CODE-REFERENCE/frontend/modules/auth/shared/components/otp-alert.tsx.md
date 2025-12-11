# File: modules\auth\shared\components\otp-alert.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/shared/components/otp-alert.tsx`

## Category
Frontend

## File Type
TSX (otp-alert.tsx)

## Size
1805 characters, 58 lines

## Full Code

```typescript
'use client'

import { CircleX, LucideIcon } from 'lucide-react'
import { CircleCheckBig } from 'lucide-react'
import { ComponentProps } from 'react'

import { Alert, AlertTitle, Countdown } from '@/packages/components'
import { cn } from '@/packages/utils'

import { type TStatus } from '@/auth/shared/types'

interface IStatusParamsItem {
    icon: LucideIcon
    styles: Record<string, string>
}

type TStatusParams = Record<TStatus, IStatusParamsItem>

interface OtpAlertProps extends ComponentProps<typeof Alert> {
    status: TStatus
    title: string
    /** Countdown start in seconds (default 3) */
    duration?: number
}

export const OtpAlert = ({ status, title, duration = 3, ...props }: OtpAlertProps) => {
    const statusParams: TStatusParams = {
        success: {
            icon: CircleCheckBig,
            styles: {
                alert: `border-positive/50 dark:border-positive bg-positive/10`,
                icon: `stroke-positive`,
                title: `text-positive`
            }
        },
        failed: {
            icon: CircleX,
            styles: {
                alert: `border-destructive/50 dark:border-destructive bg-destructive/10`,
                icon: `stroke-destructive`,
                title: `text-destructive`
            }
        }
    }

    const { icon: Icon, styles } = statusParams[status]

    return (
        <Alert className={styles.alert} {...props}>
            <Icon className={cn(styles.icon, 'size-4')} />
            <AlertTitle className={cn(styles.title, 'flex items-center justify-between')}>
                {title}
                {status === 'success' && <Countdown duration={duration} className='!text-positive' />}
            </AlertTitle>
        </Alert>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.008Z*
