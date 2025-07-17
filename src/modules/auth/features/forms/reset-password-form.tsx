'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'

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

import { TResetPasswordFormSchema, makeResetPasswordFormSchema } from '@/auth/shared/schemas'

export const ResetPasswordForm = () => {
    const router = useRouter()

    const t = useTranslations('auth.resetPassword')
    const resetPasswordFormSchema = useMemo(() => makeResetPasswordFormSchema(t), [t])

    // RHF form hook with Zod resolver for schema validation.
    const form = useForm<TResetPasswordFormSchema>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: { email: '' },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })

    useAutoValidateForm(form, ['email'])

    const { isValid } = form.formState

    const onSubmit = useCallback((data: TResetPasswordFormSchema) => {
        console.log('RESET PASSWORD FORM DATA:', data)

        // TODO: add login action

        setTimeout(() => {
            form.reset()
        }, 500)
    }, [])

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
                                <FormMessage className='!text-p-xs' />
                            </FormItem>
                        )}
                    />

                    <Button type='submit' variant='primary' className='mt-6 w-full' disabled={!isValid}>
                        {t('form.sendResetLink')}
                    </Button>
                    <Button type='button' variant='ghost' className='w-full' onClick={() => router.push(PATHS.auth())}>
                        {t('form.back')}
                    </Button>
                </form>
            </Form>
        </CardContent>
    )
}
