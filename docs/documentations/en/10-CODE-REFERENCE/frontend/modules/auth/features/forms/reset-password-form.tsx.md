# File: modules\auth\features\forms\reset-password-form.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/features/forms/reset-password-form.tsx`

## Category
Frontend

## File Type
TSX (reset-password-form.tsx)

## Size
4533 characters, 130 lines

## Full Code

```typescript
'use client'

import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { ComponentProps, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ResetPasswordDocument } from '@/packages/api/graphql'
import {
    Button,
    CardContent,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input
} from '@/packages/components'
import { PATHS } from '@/packages/config'
import { useAutoValidateForm } from '@/packages/hooks'
import { useTranslations } from '@/packages/libs/i18n'

import { TResetPasswordFormSchema, makeResetPasswordFormSchema } from '@/auth/shared/schemas'
import type { TStatus } from '@/auth/shared/types'

interface IProps extends ComponentProps<typeof CardContent> {
    setStatusPage: (statusPage: TStatus | null) => void
}

export const ResetPasswordForm = ({ setStatusPage }: IProps) => {
    const router = useRouter()

    const t = useTranslations('auth.resetPassword')
    const resetPasswordFormSchema = useMemo(() => makeResetPasswordFormSchema(t), [t])

    const [_resetPassword, { loading: resetPasswordLoading }] = useMutation(ResetPasswordDocument)

    // RHF form hook with Zod resolver for schema validation.
    const form = useForm<TResetPasswordFormSchema>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: { email: '' },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })

    useAutoValidateForm(form, ['email'])

    const { isValid } = form.formState

    const onSubmit = useCallback(
        async ({ email }: TResetPasswordFormSchema) => {
            console.log('RESET PASSWORD FORM DATA:', email)

            const response = await _resetPassword({
                variables: { data: { email } }
            })
            console.log('RESET PASSWORD RESPONSE:', response)

            if (response.error && response.error.message) {
                toast.error(response.error.message)
                return
            }

            if (!response.data?.resetPassword) {
                setStatusPage('failed')
                return
            }

            setStatusPage('success')
            setTimeout(() => {
                form.reset()
            }, 500)
            return
        },
        [form, setStatusPage]
    )

    return (
        <CardContent className='flex flex-col gap-6'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('inputs.email.label')}</FormLabel>
                                <FormControl>
                                    <Input
                                        type='email'
                                        placeholder={t('inputs.email.placeholder')}
                                        autoComplete='email'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className='!text-p-xs text-destructive' />
                            </FormItem>
                        )}
                    />

                    <Button
                        type='submit'
                        variant='primary'
                        className='mt-6 w-full'
                        disabled={!isValid || resetPasswordLoading}
                    >
                        {t('form.submit')}
                    </Button>
                    <Button
                        type='button'
                        variant='ghost'
                        className='mx-auto w-fit'
                        onClick={() => {
                            router.push(PATHS.auth())
                            setTimeout(() => {
                                setStatusPage(null)
                            }, 500)
                        }}
                    >
                        {t('form.back')}
                    </Button>
                </form>
            </Form>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.928Z*
