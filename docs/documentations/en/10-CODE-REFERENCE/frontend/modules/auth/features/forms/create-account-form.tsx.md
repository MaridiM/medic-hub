# File: modules\auth\features\forms\create-account-form.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/features/forms/create-account-form.tsx`

## Category
Frontend

## File Type
TSX (create-account-form.tsx)

## Size
5306 characters, 148 lines

## Full Code

```typescript
'use client'

import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { redirect, useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { CreateAccountDocument } from '@/packages/api/graphql'
import { Button, CardContent } from '@/packages/components'
import { PATHS } from '@/packages/config'
import { useAutoValidateForm } from '@/packages/hooks'
import { useTranslations } from '@/packages/libs/i18n'

import { FormLink, Social } from '@/auth/shared/components'
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
    const t = useTranslations('auth.createAccount')
    const router = useRouter()

    const { passwordStep, setPasswordStep } = useAuthStore()

    const [_createAccount, { loading: createAccountLoading }] = useMutation(CreateAccountDocument)

    const contactSchema = useMemo(() => makeCreateAccountFormSchema(t), [t])
    const passwordSchema = useMemo(() => makePasswordFormSchema(t), [t])

    // Restore default validation settings
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

    useAutoValidateForm(contactForm, ['email', 'fullName', 'phone'])
    useAutoValidateForm(passwordForm, ['password', 'confirmPassword'])

    const { isValid: validContact } = contactForm.formState
    const { isValid: validPassword } = passwordForm.formState

    const onSubmit = useCallback(
        async (data: TPasswordFormSchema) => {
            try {
                const response = await _createAccount({
                    variables: { data: { ...contactForm.getValues(), password: data.password } }
                })

                if (response.error?.message) {
                    toast.error(response.error?.message)
                    return
                }

                if (response.data?.createAccount.id) {
                    router.push(PATHS.dashboard())
                    contactForm.reset()
                    passwordForm.reset()
                    return
                }
                return
            } catch (error) {
                console.error('Account creation failed:', error)
            }
        },
        [_createAccount, contactForm, passwordForm, router]
    )

    const handleNextStep = useCallback(async () => {
        const isValid = await contactForm.trigger()
        if (isValid) {
            setPasswordStep(true)
        }
    }, [contactForm, setPasswordStep])

    return (
        <CardContent key='create-account-form' className='flex flex-col gap-6'>
            {!passwordStep && <Social t={t} />}

            {passwordStep ? (
                <PasswordForm form={passwordForm} onSubmit={onSubmit} t={t}>
                    <div className='mt-6 flex flex-col gap-6'>
                        <Button
                            type='submit'
                            variant='primary'
                            className='w-full'
                            disabled={!validPassword || createAccountLoading}
                        >
                            {createAccountLoading ? t('form.submiting') : t('form.submit')}
                        </Button>
                        <Button
                            type='button'
                            variant='ghost'
                            className='w-full'
                            onClick={() => setPasswordStep(false)}
                            disabled={createAccountLoading}
                        >
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
                        onClick={handleNextStep}
                        disabled={!validContact}
                    >
                        {t('form.next')}
                    </Button>
                </ContactForm>
            )}

            <FormLink
                href={PATHS.auth()}
                text={t('form.haveAccount')}
                buttonText={t('form.signIn')}
                onClick={() => {
                    setTimeout(() => {
                        contactForm.reset()
                        passwordForm.reset()
                    }, 500)
                    setPasswordStep(false)
                }}
            />
        </CardContent>
    )
}

```

## Description

This file is part of the MedicHub Frontend (Next.js) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.904Z*
