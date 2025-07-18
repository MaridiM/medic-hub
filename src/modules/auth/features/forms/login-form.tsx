'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
    Button,
    CardContent,
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot
} from '@/packages/components'
import { PATHS } from '@/packages/config'
import { useAutoValidateForm } from '@/packages/hooks'

import { AuthFormLink, AuthSocial } from '@/auth/shared/components'
import { useAuthStore } from '@/auth/shared/libs/store'
import { TLoginFormSchema, TOtpFormSchema, makeLoginFormSchema, makeOtpFormSchema } from '@/auth/shared/schemas'

export const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false)

    const { setPasswordStep, isShowTwoFactor, setIsShowTwoFactor } = useAuthStore()

    const t = useTranslations('auth.login')
    const loginFormSchema = useMemo(() => makeLoginFormSchema(t), [t])
    const otpFormSchema = useMemo(() => makeOtpFormSchema(t), [t])

    // RHF form hook with Zod resolver for schema validation.
    const loginForm = useForm<TLoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: { email: '', password: '' },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })
    const otpForm = useForm<TOtpFormSchema>({
        resolver: zodResolver(otpFormSchema),
        defaultValues: { pin: '' },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })

    useAutoValidateForm(loginForm, ['email', 'password'])
    useAutoValidateForm(otpForm, ['pin'])

    const { isValid: isValidLogin } = loginForm.formState
    const { isValid: isValidOtp } = otpForm.formState

    const onSubmit = useCallback((data: TLoginFormSchema) => {
        console.log('LOGIN FORM DATA:', data)

        // TODO: add login action
        setIsShowTwoFactor(true)
        setTimeout(() => {
            loginForm.reset()
        }, 500)
    }, [])

    useEffect(() => {
        if (isShowTwoFactor && isValidOtp) {
            console.log('OTP FORM DATA:', otpForm.getValues())
        }
    }, [isShowTwoFactor, isValidOtp])

    return (
        <CardContent className='flex flex-col gap-6'>
            {!isShowTwoFactor && <AuthSocial t={t} />}

            {isShowTwoFactor ? (
                <Form {...otpForm}>
                    <form className='space-y-4'>
                        <FormField
                            control={otpForm.control}
                            name='pin'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <InputOTP
                                            maxLength={6}
                                            {...field}
                                            containerClassName='flex w-full justify-center'
                                        >
                                            <InputOTPGroup className='flex w-full justify-between'>
                                                <InputOTPSlot
                                                    index={0}
                                                    className='size-12 rounded-md'
                                                    aria-invalid={isValidOtp}
                                                />
                                                <InputOTPSlot
                                                    index={1}
                                                    className='size-12 rounded-md'
                                                    aria-invalid={isValidOtp}
                                                />
                                                <InputOTPSlot
                                                    index={2}
                                                    className='size-12 rounded-md'
                                                    aria-invalid={isValidOtp}
                                                />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup className='flex w-full justify-between'>
                                                <InputOTPSlot
                                                    index={3}
                                                    className='size-12 rounded-md'
                                                    aria-invalid={isValidOtp}
                                                />
                                                <InputOTPSlot
                                                    index={4}
                                                    className='size-12 rounded-md'
                                                    aria-invalid={isValidOtp}
                                                />
                                                <InputOTPSlot
                                                    index={5}
                                                    className='size-12 rounded-md'
                                                    aria-invalid={isValidOtp}
                                                />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button
                            type='button'
                            variant='ghost'
                            className='mt-6 w-full'
                            onClick={() => {
                                setIsShowTwoFactor(false)
                                setTimeout(() => otpForm.reset(), 500)
                            }}
                        >
                            {t('form.back')}
                        </Button>
                    </form>
                </Form>
            ) : (
                <Form key='login-form' {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onSubmit)} className='space-y-4'>
                        <FormField
                            control={loginForm.control}
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

                        <FormField
                            control={loginForm.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t('inputs.password.label')}
                                        <Link
                                            href={PATHS.auth('recovery')}
                                            className='text-p-sm text-text-secondary hover:text-text-tertiary ml-auto font-normal'
                                        >
                                            {t('form.resetPassword')}
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
                                                // aria-invalid={!!loginForm.formState.errors.password}
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
                                    <FormMessage className='!text-p-xs text-destructive' />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' variant='primary' className='mt-6 w-full' disabled={!isValidLogin}>
                            {t('form.submit')}
                        </Button>
                    </form>
                </Form>
            )}

            {!isShowTwoFactor && (
                <AuthFormLink
                    href={PATHS.auth('create-account')}
                    text={t('form.noAccount')}
                    buttonText={t('form.signUp')}
                    onClick={() => {
                        // Reset the store and form when navigating away
                        setPasswordStep(false)
                        setTimeout(() => loginForm.reset(), 500)
                    }}
                />
            )}
        </CardContent>
    )
}
