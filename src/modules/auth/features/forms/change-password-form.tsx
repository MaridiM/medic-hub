'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { Button, CardContent } from '@/packages/components'
import { PATHS } from '@/packages/config'
import { useAutoValidateForm } from '@/packages/hooks'

import { TPasswordFormSchema, makePasswordFormSchema } from '@/auth/shared/schemas'

import { PasswordForm } from './password-form'

export const ChangePasswordForm = () => {
    const router = useRouter()
    const t = useTranslations('auth.changePassword')

    const passwordSchema = useMemo(() => makePasswordFormSchema(t), [t])

    const form = useForm<TPasswordFormSchema>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { password: '', confirmPassword: '' },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })

    useAutoValidateForm(form, ['password', 'confirmPassword'])

    const { isValid: validPassword } = form.formState

    const onSubmit = useCallback(
        (data: TPasswordFormSchema) => {
            console.log('SUBMIT:', data)

            // TODO: add login action

            setTimeout(() => {
                form.reset()
            }, 500)
        },
        [form]
    )

    return (
        <CardContent key='change-password-form' className='flex flex-col gap-6'>
            <PasswordForm form={form} onSubmit={onSubmit} t={t}>
                <div className='mt-6 flex flex-col items-center gap-6'>
                    <Button type='submit' variant='primary' className='w-full' disabled={!validPassword}>
                        {t('form.submit')}
                    </Button>
                    <Button
                        type='button'
                        variant='ghost'
                        className='w-fit'
                        onClick={() => {
                            router.push(PATHS.auth())
                            setTimeout(() => {
                                form.reset()
                            }, 500)
                        }}
                    >
                        {t('form.back')}
                    </Button>
                </div>
            </PasswordForm>
        </CardContent>
    )
}
