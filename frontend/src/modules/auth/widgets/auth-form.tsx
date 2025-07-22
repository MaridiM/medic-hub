'use client'

import { Loader } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { ComponentProps, useEffect, useMemo, useState } from 'react'

import { Card } from '@/packages/components'
import { PATHS } from '@/packages/config'
import { cn } from '@/packages/utils'

import { ChangePasswordForm, CreateAccountForm, LoginForm, ResetPasswordForm, StatusMessage } from '@/auth/features'
import { FormFooter, FormHeader } from '@/auth/shared/components'
import { useAuthStore } from '@/auth/shared/libs/store'
import type { TAuthFormType } from '@/auth/shared/types'

interface IProps extends ComponentProps<'div'> {
    type: TAuthFormType
    token?: string
}

export const AuthForm = ({ className, type = 'login', token, ...props }: IProps) => {
    const t = useTranslations(`auth.${type}`)
    const pathname = usePathname()
    const [loading, setLoading] = useState(true)

    const { isShowTwoFactor, statusPage, setStatusPage } = useAuthStore()

    useEffect(() => {
        if (statusPage && pathname === PATHS.auth()) {
            setStatusPage(null)
        }
    }, [statusPage, pathname, setStatusPage])

    useEffect(() => {
        if (type === 'verify' && token) {
            console.log('TOKEN CHECK TOKEN', token)
            setStatusPage('success')
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }
    }, [token, setStatusPage, type])

    // Reset password layout
    const statusLayout = useMemo(
        () =>
            !!statusPage || (type === 'verify' && statusPage) ? (
                <StatusMessage status={statusPage} setStatusPage={setStatusPage} />
            ) : (
                <>
                    {type === 'resetPassword' && <ResetPasswordForm setStatusPage={setStatusPage} />}
                    {type === 'changePassword' && <ChangePasswordForm setStatusPage={setStatusPage} />}
                </>
            ),
        [statusPage, setStatusPage, type]
    )

    return (
        <div className={cn('flex w-full max-w-[400px] min-w-[320px] flex-col gap-6', className)} {...props}>
            <Card>
                {type === 'verify' && loading ? (
                    <div className='flex justify-center'>
                        <Loader className='size-8 animate-spin' />
                    </div>
                ) : (
                    <>
                        <FormHeader t={t} type={type} status={statusPage} />

                        {type === 'login' && <LoginForm />}
                        {type === 'createAccount' && <CreateAccountForm />}
                        {statusLayout}
                    </>
                )}
            </Card>

            {((type === 'login' && !isShowTwoFactor) || type === 'createAccount') && <FormFooter t={t} />}
        </div>
    )
}
