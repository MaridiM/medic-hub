'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { Button, CardContent } from '@/packages/components'
import { PATHS } from '@/packages/config'
import { useAutoValidateForm } from '@/packages/hooks'

import { AuthFormLink, AuthSocial } from '@/auth/shared/components'
import { useAuthStore } from '@/auth/shared/libs/store'
import {
    TCreateAccountFormSchema,
    TPasswordFormSchema,
    makeCreateAccountFormSchema,
    makePasswordFormSchema
} from '@/auth/shared/schemas'

import { ContactForm } from './contact-form'
import { PasswordForm } from './password-form'

export const ChangePasswordForm = () => {
    const t = useTranslations('auth.changePassword')

    const passwordSchema = useMemo(() => makePasswordFormSchema(t), [t])

    const passwordForm = useForm<TPasswordFormSchema>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { password: '', confirmPassword: '' },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })

    useAutoValidateForm(passwordForm, ['password', 'confirmPassword'])

    const { isValid: validPassword } = passwordForm.formState

    const onSubmit = useCallback(
        (data: TPasswordFormSchema) => {
            console.log('SUBMIT:', data)

            // TODO: add login action

            setTimeout(() => {
                passwordForm.reset()
            }, 500)
        },
        [passwordForm]
    )

    return (
        <CardContent className='flex flex-col gap-6'>
            <PasswordForm form={passwordForm} onSubmit={onSubmit} t={t}>
                <div className='mt-6 flex flex-col gap-6'>
                    <Button type='submit' variant='primary' className='w-full' disabled={!validPassword}>
                        {t('form.submit')}
                    </Button>
                </div>
            </PasswordForm>
        </CardContent>
    )
}
