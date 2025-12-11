# File: modules\auth\shared\components\form-header.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/shared/components/form-header.tsx`

## Category
Frontend

## File Type
TSX (form-header.tsx)

## Size
4259 characters, 107 lines

## Full Code

```typescript
'use client'

import { ComponentProps, useMemo } from 'react'

import { CardDescription, CardHeader, CardTitle } from '@/packages/components'
import { cn } from '@/packages/utils'

import { SendMailFailedIcon, SendMailSuccessIcon } from '@/auth/shared/assets/icons'
import { useAuthStore } from '@/auth/shared/libs/store'
import type { TAuthFormType, TStatus } from '@/auth/shared/types'

import { type TAuthTranslation } from '../libs/i18n'

interface IProps<T extends TAuthFormType = TAuthFormType> extends ComponentProps<'div'> {
    t: TAuthTranslation<T>
    type: TAuthFormType
    status: TStatus | null
}

export const FormHeader = ({ t, type, status }: IProps) => {
    const { passwordStep, is2FAEnabled, isTotpEnabled } = useAuthStore()
    const hasStatus = Boolean(status)

    // Pick icon if we have status
    const Icon = useMemo(() => {
        if (status === 'success') return SendMailSuccessIcon
        if (status === 'failed') return SendMailFailedIcon
        return null
    }, [status])

    // Compute title string (may contain \n for multi‑line)
    const title = useMemo(() => {
        if (type === 'login' && is2FAEnabled) {
            return t('2fa.title')
        }
        if (type === 'resetPassword') {
            if (status === 'success') {
                return `${t('confirmation.successTitle.0')}\n${t('confirmation.successTitle.1')}`
            }
            if (status === 'failed') return `${t('confirmation.failedTitle')}`
            return t('form.title')
        }
        if (type === 'changePassword') {
            if (status === 'success') return t('confirmation.successTitle')
            if (status === 'failed') return t('confirmation.failedTitle')
            return t('form.title')
        }
        if (type === 'verify') {
            if (status === 'success') return t('confirmation.successTitle')
            if (status === 'failed') return t('confirmation.failedTitle')
            return null
        }
        return t('form.title')
    }, [type, is2FAEnabled, status, t])

    // Compute the one description string
    const description = useMemo(() => {
        switch (type) {
            case 'login':
                return is2FAEnabled
                    ? isTotpEnabled
                        ? t('2fa.descriptionTOTP')
                        : t('2fa.descriptionOTP')
                    : t('form.description')
            case 'createAccount':
                return passwordStep ? t('form.descriptionPassword') : t('form.description')
            case 'resetPassword':
                if (status === 'success') return t('confirmation.successDescription')
                if (status === 'failed') return t('confirmation.failedDescription')
                return t('form.description')
            case 'changePassword':
                if (status === 'success') return t('confirmation.successDescription')
                if (status === 'failed') return t('confirmation.failedDescription')
                return t('form.description')
            case 'verify':
                if (status === 'success') return t('confirmation.successDescription')
                if (status === 'failed') return t('confirmation.failedDescription')
                return null
            default:
                return null
        }
    }, [type, is2FAEnabled, isTotpEnabled, passwordStep, status, t])

    return (
        <CardHeader
            key={`header-${type}-${status}`}
            className={cn('text-center', hasStatus && 'flex flex-col items-center justify-start gap-4')}
        >
            {Icon && <Icon className='min-h-[133px] w-auto' />}

            <CardTitle className='text-h4 text-center leading-6'>
                {title?.split('\n').map((line, i) => (
                    <span key={i} style={{ display: 'block' }}>
                        {line}
                    </span>
                ))}
            </CardTitle>

            {description && (
                <CardDescription className='!text-text-tertiary text-p-sm px-2 text-center'>
                    {description}
                </CardDescription>
            )}
        </CardHeader>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.972Z*
