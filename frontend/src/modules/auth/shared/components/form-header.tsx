'use client'

import { ComponentProps, useMemo } from 'react'

import { CardDescription, CardHeader, CardTitle } from '@/packages/components'
import { TUseTranslations } from '@/packages/libs/i18n'
import { cn } from '@/packages/utils'

import { SendMailFailedIcon, SendMailSuccessIcon } from '@/auth/shared/assets/icons'
import { useAuthStore } from '@/auth/shared/libs/store'
import type { TAuthFormType, TStatus } from '@/auth/shared/types'

interface IProps extends ComponentProps<'div'> {
    t: TUseTranslations
    type: TAuthFormType
    status: TStatus | null
}

export const FormHeader = ({ t, type, status }: IProps) => {
    const { passwordStep, isShowTwoFactor, isTotpEnabled } = useAuthStore()
    const hasStatus = Boolean(status)

    // Pick icon if we have status
    const Icon = useMemo(() => {
        if (status === 'success') return SendMailSuccessIcon
        if (status === 'failed') return SendMailFailedIcon
        return null
    }, [status])

    // Compute title string (may contain \n for multi‑line)
    const title = useMemo(() => {
        if (type === 'login' && isShowTwoFactor) {
            return t('2fa.title')
        }
        if (type === 'resetPassword') {
            if (status === 'success') return `${t('confirmation.successTitle.0')}\n${t('confirmation.successTitle.1')}`
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
    }, [type, isShowTwoFactor, status, t])

    // Compute the one description string
    const description = useMemo(() => {
        switch (type) {
            case 'login':
                return isShowTwoFactor
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
    }, [type, isShowTwoFactor, isTotpEnabled, passwordStep, status, t])

    return (
        <CardHeader
            key={`header-${type}-${status}`}
            className={cn('text-center', hasStatus && 'flex flex-col items-center justify-start gap-4')}
        >
            {Icon && <Icon />}

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
