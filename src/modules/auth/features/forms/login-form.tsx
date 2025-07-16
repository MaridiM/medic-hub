'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ComponentProps, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Google } from '@/packages/assets/icons'
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

import { TLoginFormSchema, makeLoginFormSchema } from '@/auth/shared/schemas'

export const LoginForm = ({ className, ...props }: ComponentProps<'div'>) => {
    const [wasSubmitted, setWasSubmitted] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const t = useTranslations('auth.login')
    const loginFormSchema = useMemo(() => makeLoginFormSchema(t), [t])

    const form = useForm<TLoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: '',
            password: ''
        },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })

    useEffect(() => {
        if (wasSubmitted) {
            form.trigger()
        } else {
            form.clearErrors()
        }
    }, [loginFormSchema])

    const { isValid } = form.formState

    function onSubmit(data: TLoginFormSchema) {
        setWasSubmitted(true)
        console.log('LOGIN FORM DATA:', data)
    }
    return (
        <CardContent className='flex flex-col gap-6'>
            <div className='flex flex-col gap-6'>
                <div className='flex flex-col gap-2'>
                    <Button variant='ghost' className='w-full gap-2 tracking-wide'>
                        <Google className='!size-4' />
                        {t('form.login_with_google')}
                    </Button>
                </div>
                <div className='after:border-border/20 text-p-sm relative text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                    <span className='bg-card text-text-tertiary relative z-10 px-2'>{t('form.or_continue')}</span>
                </div>
            </div>

            {/* Форма */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('inputs.email.label')}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t('inputs.email.placeholder')} {...field} />
                                </FormControl>
                                <FormMessage className='!text-p-xs' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>
                                        {t('inputs.password.label')}
                                        <Link
                                            href={PATHS.auth('forgot-password')}
                                            className='text-p-sm text-text-secondary hover:text-text-tertiary ml-auto font-normal'
                                        >
                                            {t('form.forgot_password')}
                                        </Link>
                                    </FormLabel>
                                    <FormControl>
                                        <div className='relative'>
                                            <Input
                                                id='password'
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder={t('inputs.password.placeholder')}
                                                className='pr-14'
                                                {...field}
                                            />
                                            <Button
                                                type='button'
                                                className='absolute top-0 right-0 size-10 h-full min-w-10 rounded-l-none bg-transparent hover:bg-transparent'
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <Eye className='!size-4' />
                                                ) : (
                                                    <EyeOff className='!size-4' />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage className='!text-p-xs' />
                                </FormItem>
                            )
                        }}
                    />
                    <Button type='submit' variant='primary' className='mt-6 w-full' disabled={!isValid}>
                        {t('form.sign_in')}
                    </Button>
                </form>
            </Form>

            {/* Footer */}
            <footer className='text-text text-p-sm flex items-center justify-center gap-1'>
                {t('form.no_account')}
                <Link href={PATHS.auth('create-account')} className='text-primary hover:text-primary-700'>
                    {t('form.sign_up')}
                </Link>
            </footer>
        </CardContent>
    )
}
