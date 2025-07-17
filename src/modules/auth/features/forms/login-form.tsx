'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ComponentProps, useCallback, useMemo, useState } from 'react'
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

import { AuthFormLink, AuthSocial } from '@/auth/shared/components'
import { useAuthStore } from '@/auth/shared/libs/store'
import { TLoginFormSchema, makeLoginFormSchema } from '@/auth/shared/schemas'

export const LoginForm = ({}: ComponentProps<'div'>) => {
    const [showPassword, setShowPassword] = useState(false)

    const { setPasswordStep } = useAuthStore()

    const t = useTranslations('auth.login')
    const loginFormSchema = useMemo(() => makeLoginFormSchema(t), [t])

    // RHF form hook with Zod resolver for schema validation.
    const form = useForm<TLoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: { email: '', password: '' },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })

    useAutoValidateForm(form, ['email', 'password'])

    const { isValid } = form.formState

    const onSubmit = useCallback((data: TLoginFormSchema) => {
        console.log('LOGIN FORM DATA:', data)

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

                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
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
                                            autoComplete='current-password'
                                            {...field}
                                        />
                                        <Button
                                            type='button'
                                            className='absolute top-0 right-0 size-10 h-full min-w-10 rounded-l-none bg-transparent hover:bg-transparent'
                                            onClick={() => setShowPassword(s => !s)}
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
                        )}
                    />

                    <Button type='submit' variant='primary' className='mt-6 w-full' disabled={!isValid}>
                        {t('form.sign_in')}
                    </Button>
                </form>
            </Form>
        </CardContent>
    )
}
