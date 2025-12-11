# File: modules\auth\features\status-message.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/features/status-message.tsx`

## Category
Frontend

## File Type
TSX (status-message.tsx)

## Size
2221 characters, 65 lines

## Full Code

```typescript
'use client'

import { useTranslations } from '@/packages/libs/i18n'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Button, CardContent, Countdown } from '@/packages/components'
import { PATHS } from '@/packages/config'
import { useCountdown } from '@/packages/hooks'

import { TryAgain } from '@/auth/shared/components'
import { TStatus } from '@/auth/shared/types'

interface StatusMessageProps {
    status: TStatus
    setStatusPage: (s: TStatus | null) => void
}

const DURATION = 15 // countdown duration in seconds

export const StatusMessage = ({ status, setStatusPage }: StatusMessageProps) => {
    const t = useTranslations('auth.resetPassword')
    const router = useRouter()

    const { remaining, start } = useCountdown(DURATION)

    useEffect(() => {
        if (status === 'success') start()
    }, [status, start])

    useEffect(() => {
        if (status === 'success' && remaining === 0) {
            router.push(PATHS.auth())
        }
    }, [status, remaining, router])

    return (
        <CardContent className='flex flex-col items-center gap-6'>
            {status === 'success' ? (
                <Button
                    variant='primary'
                    disabled={!remaining}
                    className='w-full gap-2'
                    onClick={() => router.push(PATHS.auth())}
                >
                    {remaining > 0 ? `${t('confirmation.backButton.0')} ` : t('confirmation.redirect')}
                    {remaining > 0 && <Countdown duration={remaining} className='!text-text-foreground' />}
                </Button>
            ) : (
                <>
                    <TryAgain
                        text={t('confirmation.tryAgain.text')}
                        link={t('confirmation.tryAgain.link')}
                        onClick={() => setStatusPage(null)}
                    />
                    <Button variant='ghost' className='w-fit' onClick={() => router.push(PATHS.auth())}>
                        {t('confirmation.backButton.1')}
                    </Button>
                </>
            )}
        </CardContent>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.937Z*
