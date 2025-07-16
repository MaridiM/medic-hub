'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ComponentProps, useMemo, useState } from 'react'
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

import { useAuthStore } from '@/auth/shared/libs/store'
import { TCreateAccountFormSchema, makeCreateAccountFormSchema } from '@/auth/shared/schemas'

export const CreateAccountForm = ({ className, ...props }: ComponentProps<'div'>) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { passwordStep, setPasswordStep } = useAuthStore()

    const t = useTranslations('auth.createAccount')
    const createAccountFormSchema = useMemo(() => makeCreateAccountFormSchema(t), [t])

    const form = useForm<TCreateAccountFormSchema>({
        resolver: zodResolver(createAccountFormSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
        },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })

    const { isValid } = form.formState

    function onSubmit(data: TCreateAccountFormSchema) {
        console.log('CREATE ACCOUNT FORM DATA:', data)
    }

    return (
        <CardContent className='flex flex-col gap-6'>
            {!passwordStep && (
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
            )}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    {passwordStep ? (
                        <>
                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('inputs.password.label')}</FormLabel>
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
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='confirmPassword'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('inputs.confirmPassword.label')}</FormLabel>
                                        <FormControl>
                                            <div className='relative'>
                                                <Input
                                                    id='confirmPassword'
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    placeholder={t('inputs.confirmPassword.placeholder')}
                                                    className='pr-14'
                                                    {...field}
                                                />
                                                <Button
                                                    type='button'
                                                    className='absolute top-0 right-0 size-10 h-full min-w-10 rounded-l-none bg-transparent hover:bg-transparent'
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? (
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
                        </>
                    ) : (
                        <>
                            <FormField
                                control={form.control}
                                name='fullName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('inputs.fullName.label')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('inputs.fullName.placeholder')} {...field} />
                                        </FormControl>
                                        <FormMessage className='!text-p-xs' />
                                    </FormItem>
                                )}
                            />
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
                                name='phone'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('inputs.phone.label')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('inputs.phone.placeholder')} {...field} />
                                        </FormControl>
                                        <FormMessage className='!text-p-xs' />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    {passwordStep && (
                        <Button type='submit' variant='primary' className='mt-6 w-full' disabled={!isValid}>
                            {t('form.sign_up')}
                        </Button>
                    )}
                    <Button
                        type='button'
                        variant={passwordStep ? 'ghost' : 'primary'}
                        className='mt-6 w-full'
                        onClick={() => setPasswordStep(!passwordStep)}
                    >
                        {passwordStep ? t('form.back') : t('form.next')}
                    </Button>
                </form>
            </Form>
            <footer className='text-text text-p-sm flex items-center justify-center gap-1'>
                {t('form.have_account')}
                <Link href={PATHS.auth()} className='text-primary hover:text-primary-700'>
                    {t('form.sign_in')}
                </Link>
            </footer>
        </CardContent>
    )
}
