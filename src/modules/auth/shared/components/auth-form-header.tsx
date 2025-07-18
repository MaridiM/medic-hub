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

export const AuthFormHeader = ({ t, type }: IProps) => {
    const { passwordStep, isShowTwoFactor, isTotpEnabled } = useAuthStore()

    return (
        <CardHeader className='text-center'>
            <CardTitle className='text-xl uppercase'>
                {type === 'login' && isShowTwoFactor ? t('form.pinTitle') : t('form.title')}
            </CardTitle>
            <CardDescription className='!text-text-tertiary text-p-xs'>
                {type === 'login' &&
                    (isShowTwoFactor
                        ? isTotpEnabled
                            ? t('form.pinDescriptionTOTP')
                            : t('form.pinDescriptionOTP')
                        : t('form.description'))}
                {type === 'createAccount' && (passwordStep ? t('form.descriptionPassword') : t('form.description'))}
                {type === 'resetPassword' && t('form.description')}
                {type === 'changePassword' && t('form.description')}
            </CardDescription>
        </CardHeader>
    )
}
