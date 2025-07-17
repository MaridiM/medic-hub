'use client'

import { useTranslations } from 'next-intl'
import { ComponentProps } from 'react'

import { Card } from '@/packages/components'
import { cn } from '@/packages/utils'

import { ChangePasswordForm, CreateAccountForm, LoginForm, ResetPasswordForm } from '@/auth/features'
import { AuthFormFooter, AuthFormHeader } from '@/auth/shared/components'
import { TAuthFormType } from '@/auth/shared/types'

interface IProps extends ComponentProps<'div'> {
    type: TAuthFormType
}

export const AuthForm = ({ className, type = 'login', ...props }: IProps) => {
    const t = useTranslations(`auth.${type}`)

    return (
        <div className={cn('flex w-full max-w-[420px] min-w-[320px] flex-col gap-6', className)} {...props}>
            <Card>
                <AuthFormHeader t={t} type={type} />

                {type === 'login' && <LoginForm />}
                {type === 'createAccount' && <CreateAccountForm />}
                {type === 'resetPassword' && <ResetPasswordForm />}
                {type === 'changePassword' && <ChangePasswordForm />}
            </Card>
            {(type === 'login' || type === 'createAccount') && <AuthFormFooter t={t} />}
        </div>
    )
}
