# File: modules\auth\features\forms\change-password-form.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/features/forms/change-password-form.tsx`

## Category
Frontend

## File Type
TSX (change-password-form.tsx)

## Size
3532 characters, 102 lines

## Full Code

```typescript
'use client'

import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { type ComponentProps, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { NewPasswordDocument } from '@/packages/api/graphql'
import { Button, CardContent } from '@/packages/components'
import { PATHS } from '@/packages/config'
import { useAutoValidateForm } from '@/packages/hooks'
import { useTranslations } from '@/packages/libs/i18n'

import { TPasswordFormSchema, makePasswordFormSchema } from '@/auth/shared/schemas'
import { type TStatus } from '@/auth/shared/types'

import { PasswordForm } from './password-form'

interface IProps extends ComponentProps<typeof CardContent> {
    setStatusPage: (statusPage: TStatus | null) => void
    token: string
}
export const ChangePasswordForm = ({ setStatusPage, token }: IProps) => {
    const router = useRouter()
    const t = useTranslations('auth.changePassword')

    const [_newPassword, { loading: newPasswordLoading }] = useMutation(NewPasswordDocument)

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
        async ({ password }: TPasswordFormSchema) => {
            console.log('SUBMIT:', { password, token })

            const response = await _newPassword({
                variables: {
                    data: { password, token }
                }
            })

            if (response?.error?.message) {
                toast.error(response.error.message)
                return
            }

            if (!response?.data?.newPassword) {
                setStatusPage('failed')
                return
            }

            setStatusPage('success')
            setTimeout(() => {
                form.reset()
            }, 500)
        },
        [form, setStatusPage, token]
    )

    return (
        <CardContent key='change-password-form' className='flex flex-col gap-6'>
            <PasswordForm form={form} onSubmit={onSubmit} t={t}>
                <div className='mt-6 flex flex-col items-center gap-6'>
                    <Button
                        type='submit'
                        variant='primary'
                        className='w-full'
                        disabled={!validPassword || newPasswordLoading}
                    >
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.898Z*
