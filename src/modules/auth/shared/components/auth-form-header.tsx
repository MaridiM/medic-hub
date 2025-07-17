'use client'

import { ComponentProps } from 'react'

import { CardDescription, CardHeader, CardTitle } from '@/packages/components'
import { TUseTranslations } from '@/packages/libs/i18n'

import { useAuthStore } from '@/auth/shared/libs/store'
import { TAuthFormType } from '@/auth/shared/types'

interface IProps extends ComponentProps<'div'> {
    t: TUseTranslations
    type: TAuthFormType
}

export const AuthFormHeader = ({ className, t, type, ...props }: IProps) => {
    const { passwordStep } = useAuthStore()

    return (
        <CardHeader className='text-center'>
            <CardTitle className='text-xl uppercase'>{t('form.title')}</CardTitle>
            <CardDescription className='!text-text-tertiary text-p-xs'>
                {type === 'login' && t('form.description')}
                {type === 'createAccount' && (passwordStep ? t('form.description_password') : t('form.description'))}
                {type === 'forgotPassword' && t('form.description')}
            </CardDescription>
        </CardHeader>
    )
}
