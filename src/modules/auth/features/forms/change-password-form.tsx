'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { type ComponentProps, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { Button, CardContent } from '@/packages/components'
import { PATHS } from '@/packages/config'
import { useAutoValidateForm } from '@/packages/hooks'

import { TPasswordFormSchema, makePasswordFormSchema } from '@/auth/shared/schemas'
import { type TStatus } from '@/auth/shared/types'

import { PasswordForm } from './password-form'

interface IProps extends ComponentProps<typeof CardContent> {
    setStatusPage: (statusPage: TStatus | null) => void
}
export const ChangePasswordForm = ({ setStatusPage }: IProps) => {
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
            setStatusPage('failed')
            setTimeout(() => {
                form.reset()
            }, 500)
        },
        [form, setStatusPage]
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
