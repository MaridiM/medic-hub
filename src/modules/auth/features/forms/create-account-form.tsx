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

export const CreateAccountForm = () => {
    const { passwordStep, setPasswordStep } = useAuthStore()
    const t = useTranslations('auth.createAccount')

    const contactSchema = useMemo(() => makeCreateAccountFormSchema(t), [t])
    const passwordSchema = useMemo(() => makePasswordFormSchema(t), [t])

    const contactForm = useForm<TCreateAccountFormSchema>({
        resolver: zodResolver(contactSchema),
        defaultValues: { fullName: '', email: '', phone: '' },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })
    const passwordForm = useForm<TPasswordFormSchema>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { password: '', confirmPassword: '' },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })

    // Включаем автовалидатор для каждого шага
    useAutoValidateForm(contactForm, ['fullName', 'email', 'phone'])
    useAutoValidateForm(passwordForm, ['password', 'confirmPassword'])

    const { isValid: validContact } = contactForm.formState
    const { isValid: validPassword } = passwordForm.formState

    const onSubmit = useCallback(
        (data: TPasswordFormSchema) => {
            console.log('SUBMIT:', { ...contactForm.getValues(), ...data })

            // TODO: add login action

            setTimeout(() => {
                contactForm.reset()
                passwordForm.reset()
            }, 500)

            setPasswordStep(false)
        },
        [contactForm, passwordForm, setPasswordStep]
    )

    return (
        <CardContent className='flex flex-col gap-6'>
            {!passwordStep && <AuthSocial t={t} />}

            {passwordStep ? (
                <PasswordForm form={passwordForm} onSubmit={onSubmit} t={t}>
                    <div className='mt-6 flex flex-col gap-6'>
                        <Button type='submit' variant='primary' className='w-full' disabled={!validPassword}>
                            {t('form.signUp')}
                        </Button>
                        <Button type='button' variant='ghost' className='w-full' onClick={() => setPasswordStep(false)}>
                            {t('form.back')}
                        </Button>
                    </div>
                </PasswordForm>
            ) : (
                <ContactForm form={contactForm} t={t}>
                    <Button
                        type='button'
                        variant='primary'
                        className='mt-6 w-full'
                        onClick={() => setPasswordStep(true)}
                        disabled={!validContact}
                    >
                        {t('form.next')}
                    </Button>
                </ContactForm>
            )}

            <AuthFormLink
                href={PATHS.auth()}
                text={t('form.haveAccount')}
                buttonText={t('form.signIn')}
                onClick={() => {
                    setPasswordStep(false)
                    setTimeout(() => {
                        contactForm.reset()
                        passwordForm.reset()
                    }, 500)
                }}
            />
        </CardContent>
    )
}
