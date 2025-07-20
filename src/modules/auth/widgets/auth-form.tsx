'use client'

import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { ComponentProps, useEffect, useMemo } from 'react'

import { Card } from '@/packages/components'
import { PATHS } from '@/packages/config'
import { cn } from '@/packages/utils'

import { ChangePasswordForm, CreateAccountForm, LoginForm, ResetPasswordForm, StatusMessage } from '@/auth/features'
import { FormFooter, FormHeader } from '@/auth/shared/components'
import { useAuthStore } from '@/auth/shared/libs/store'
import type { TAuthFormType } from '@/auth/shared/types'

interface IProps extends ComponentProps<'div'> {
    type: TAuthFormType
}

export const AuthForm = ({ className, type = 'login', ...props }: IProps) => {
    const t = useTranslations(`auth.${type}`)
    const pathname = usePathname()

    const { isShowTwoFactor, statusPage, setStatusPage } = useAuthStore()

    useEffect(() => {
        if (statusPage === 'success' && pathname === PATHS.auth()) {
            console.log('PATHNAME', pathname, statusPage)
            setStatusPage(null)
        }
    }, [statusPage, pathname, setStatusPage])

    // Reset password layout
    const resetPasswordLayout = useMemo(
        () =>
            !!statusPage ? (
                <StatusMessage status={statusPage} setStatusPage={setStatusPage} />
            ) : (
                <ResetPasswordForm setStatusPage={setStatusPage} />
            ),
        [statusPage, setStatusPage]
    )

    return (
        <div className={cn('flex w-full max-w-[400px] min-w-[320px] flex-col gap-6', className)} {...props}>
            <Card>
                <FormHeader t={t} type={type} status={statusPage} />

                {type === 'login' && <LoginForm />}
                {type === 'createAccount' && <CreateAccountForm />}
                {type === 'resetPassword' ? resetPasswordLayout : null}
                {type === 'changePassword' && <ChangePasswordForm />}
            </Card>

            {((type === 'login' && !isShowTwoFactor) || type === 'createAccount') && <FormFooter t={t} />}
        </div>
    )
}
