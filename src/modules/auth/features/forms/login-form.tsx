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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input
} from '@/packages/components'
import { PATHS } from '@/packages/config'
import { useAutoValidateForm } from '@/packages/hooks'

import { FormLink, Social, type TStatus, TryAgain } from '@/auth/shared/components'
import { useAuthStore } from '@/auth/shared/libs/store'
import { TLoginFormSchema, TOtpFormSchema, makeLoginFormSchema, makeOtpFormSchema } from '@/auth/shared/schemas'

import { OtpForm } from './otp-form'

export const LoginForm = () => {
    const t = useTranslations('auth.login')
    const [showPassword, setShowPassword] = useState(false)
    const { setPasswordStep, isShowTwoFactor, setIsShowTwoFactor, isTotpEnabled } = useAuthStore()

    // Form
    const loginSchema = useMemo(() => makeLoginFormSchema(t), [t])
    const otpSchema = useMemo(() => makeOtpFormSchema(t), [t])

    const loginForm = useForm<TLoginFormSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })
    const otpForm = useForm<TOtpFormSchema>({
        resolver: zodResolver(otpSchema),
        defaultValues: { code: '' },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })

    useAutoValidateForm(loginForm, ['email', 'password'])
    useAutoValidateForm(otpForm, ['code'])

    const { isValid: isValidLogin } = loginForm.formState
    const { isValid: isValidOtp } = otpForm.formState

    // 2FA state
    const [OTPStatus, setOTPStatus] = useState<TStatus | null>(null)
    const [remaining, setRemaining] = useState(0)
    const [hasRedirected, setRedirected] = useState(false)

    const COUNTDOWN = 3 // seconds

    // Submit login → show OTP form
    const onLoginSubmit = useCallback(
        (data: TLoginFormSchema) => {
            console.log('LOGIN DATA', data)
            setIsShowTwoFactor(true)
            loginForm.reset()
        },
        [setIsShowTwoFactor, loginForm]
    )

    // When OTP form valid → start success flow
    useEffect(() => {
        if (isShowTwoFactor && isValidOtp) {
            console.log('OTP DATA', otpForm.getValues())
            setOTPStatus('success')
            setRemaining(COUNTDOWN)
            setRedirected(false)
            otpForm.reset()
        }
    }, [isShowTwoFactor, isValidOtp, otpForm])

    // Countdown tick
    useEffect(() => {
        if (OTPStatus !== 'success' || remaining <= 0) return
        const id = window.setTimeout(() => setRemaining(r => r - 1), 1000)
        return () => clearTimeout(id)
    }, [OTPStatus, remaining])

    // One‑time redirect when reaches zero
    useEffect(() => {
        if (OTPStatus === 'success' && remaining === 0 && !hasRedirected) {
            console.log('Redirect to dashboard')
            setRedirected(true)
            setIsShowTwoFactor(false)
            setOTPStatus(null)
            // TODO: actual redirect, e.g. router.push('/dashboard')
        }
    }, [OTPStatus, remaining, hasRedirected, setIsShowTwoFactor])

    return (
        <CardContent className='flex flex-col gap-6'>
            {!isShowTwoFactor && <Social t={t} />}

            {isShowTwoFactor ? (
                <OtpForm form={otpForm} t={t} status={OTPStatus} alertDuration={remaining}>
                    <div className='mt-6 flex flex-col items-center gap-6'>
                        {!isTotpEnabled && (
                            <TryAgain
                                text={t('2fa.tryAgain.text')}
                                link={t('2fa.tryAgain.link')}
                                onClick={
                                    !isTotpEnabled
                                        ? () => {
                                              console.log('RESEND CODE')
                                              otpForm.reset()
                                          }
                                        : undefined
                                }
                            />
                        )}
                        <Button
                            type='button'
                            variant='ghost'
                            className='mx-auto w-fit'
                            onClick={() => {
                                setIsShowTwoFactor(false)
                                otpForm.reset()
                            }}
                        >
                            {t('form.back')}
                        </Button>
                    </div>
                </OtpForm>
            ) : (
                <Form key='login-form' {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className='space-y-4'>
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
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder={t('inputs.password.placeholder')}
                                                autoComplete='current-password'
                                                className='pr-14'
                                                {...field}
                                            />
                                            <Button
                                                type='button'
                                                className='absolute top-0 right-0 size-10 h-full min-w-10 rounded-l-none bg-transparent'
                                                onClick={() => setShowPassword(p => !p)}
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
                <FormLink
                    href={PATHS.auth('create-account')}
                    text={t('form.noAccount')}
                    buttonText={t('form.signUp')}
                    onClick={() => {
                        setPasswordStep(false)
                        loginForm.reset()
                    }}
                />
            )}
        </CardContent>
    )
}
