'use client'

import { useTranslations } from 'next-intl'
import { ComponentProps } from 'react'

import { Card } from '@/packages/components'
import { cn } from '@/packages/utils'

import { AuthStatusMessage, ChangePasswordForm, CreateAccountForm, LoginForm, ResetPasswordForm } from '@/auth/features'
import { FormFooter, FormHeader } from '@/auth/shared/components'
import { useAuthStore } from '@/auth/shared/libs/store'
import { TAuthFormType } from '@/auth/shared/types'

interface IProps extends ComponentProps<'div'> {
    type: TAuthFormType
}

export const AuthForm = ({ className, type = 'login', ...props }: IProps) => {
    const t = useTranslations(`auth.${type}`)
    const { isShowTwoFactor } = useAuthStore()

    return (
        <div className={cn('flex w-full max-w-[400px] min-w-[320px] flex-col gap-6', className)} {...props}>
            <Card>
                <FormHeader t={t} type={type} />

                {type === 'login' && <LoginForm />}
                {type === 'createAccount' && <CreateAccountForm />}
                {type === 'resetPassword' && <ResetPasswordForm />}
                {type === 'changePassword' && <ChangePasswordForm />}
            </Card>
            {/* <AuthStatusMessage /> */}

            {((type === 'login' && !isShowTwoFactor) || type === 'createAccount') && <FormFooter t={t} />}
        </div>
    )
}
