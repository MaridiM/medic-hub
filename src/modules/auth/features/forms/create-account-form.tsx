'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ComponentProps, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { Button, CardContent } from '@/packages/components'
import { PATHS } from '@/packages/config'

import { AuthFormLink, AuthSocial } from '@/auth/shared/components'
import { useAuthStore } from '@/auth/shared/libs/store'
import {
    TCreateAccountFormSchema,
    TPasswordFormSchema,
    makeCreateAccountFormSchema,
    makePasswordFormSchema
} from '@/auth/shared/schemas'

import { ContactInfoForm } from './contact-info-form'
import { PasswordForm } from './password-form'

export const CreateAccountForm = ({ className, ...props }: ComponentProps<'div'>) => {
    const router = useRouter()

    const { passwordStep, setPasswordStep } = useAuthStore()

    const t = useTranslations('auth.createAccount')
    const createAccountFormSchema = useMemo(() => makeCreateAccountFormSchema(t), [t])
    const passwordFormSchema = useMemo(() => makePasswordFormSchema(t), [t])

    const contactInfoForm = useForm<TCreateAccountFormSchema>({
        resolver: zodResolver(createAccountFormSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: ''
        },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })
    const passwordForm = useForm<TPasswordFormSchema>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })

    const { isValid: isValidContactInfo } = contactInfoForm.formState
    const { isValid: isValidPassword } = passwordForm.formState

    const onSubmit = useCallback(
        (data: TPasswordFormSchema) => {
            console.log('CREATE ACCOUNT FORM DATA:', { ...data, ...contactInfoForm.getValues() })
            contactInfoForm.reset()
            passwordForm.reset()
        },
        [contactInfoForm, passwordForm]
    )

    return (
        <CardContent className='flex flex-col gap-6'>
            {!passwordStep && <AuthSocial t={t} />}
            {passwordStep ? (
                <PasswordForm form={passwordForm} onSubmit={onSubmit} t={t}>
                    <Button type='submit' variant='primary' className='mt-6 w-full' disabled={!isValidPassword}>
                        {t('form.sign_up')}
                    </Button>
                    <Button
                        type='button'
                        variant={'ghost'}
                        className='mt-6 w-full'
                        onClick={() => setPasswordStep(false)}
                    >
                        {t('form.back')}
                    </Button>
                </PasswordForm>
            ) : (
                <ContactInfoForm form={contactInfoForm} t={t}>
                    <Button
                        type='button'
                        variant={'primary'}
                        className='mt-6 w-full'
                        onClick={() => setPasswordStep(true)}
                        disabled={!isValidContactInfo}
                    >
                        {t('form.next')}
                    </Button>
                </ContactInfoForm>
            )}

            <AuthFormLink
                href={PATHS.auth()}
                text={t('form.have_account')}
                buttonText={t('form.sign_in')}
                onClick={() => {
                    setPasswordStep(false)
                    setTimeout(() => {
                        contactInfoForm.reset()
                        passwordForm.reset()
                    }, 500)
                }}
            />
            {/* <footer className='text-text text-p-sm flex items-center justify-center gap-1'>
                {t('form.have_account')}
                <Button
                    className='text-primary hover:text-primary-700 p-0 hover:bg-transparent'
                    onClick={() => {
                        router.push(PATHS.auth())
                        setTimeout(() => {
                            setPasswordStep(false)
                            contactInfoForm.reset()
                            passwordForm.reset()
                        }, 500)
                    }}
                >
                    {t('form.sign_in')}
                </Button>
            </footer> */}
        </CardContent>
    )
}
