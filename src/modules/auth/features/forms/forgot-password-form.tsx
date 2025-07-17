'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
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
import { useAutoValidateForm } from '@/packages/hooks'

import { TForgotPasswordFormSchema, makeForgotPasswordFormSchema } from '@/auth/shared/schemas'

export const ForgotPasswordForm = () => {
    const t = useTranslations('auth.forgotPassword')
    const forgotPasswordFormSchema = useMemo(() => makeForgotPasswordFormSchema(t), [t])

    // RHF form hook with Zod resolver for schema validation.
    const form = useForm<TForgotPasswordFormSchema>({
        resolver: zodResolver(forgotPasswordFormSchema),
        defaultValues: { email: '' },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })

    useAutoValidateForm(form, ['email'])

    const { isValid } = form.formState

    const onSubmit = useCallback((data: TForgotPasswordFormSchema) => {
        console.log('FORGOT PASSWORD FORM DATA:', data)

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
                        {t('form.send_reset_link')}
                    </Button>
                    <Button type='button' variant='ghost' className='w-full' onClick={() => {}}>
                        {t('form.back')}
                    </Button>
                </form>
            </Form>
        </CardContent>
    )
}
