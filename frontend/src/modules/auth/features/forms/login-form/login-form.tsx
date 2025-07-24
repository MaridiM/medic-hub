'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { CardContent } from '@/packages/components'
import { useAutoValidateForm, useCountdown } from '@/packages/hooks'

import { useAuthStore } from '@/auth/shared/libs/store'
import { TLoginFormSchema, TOtpFormSchema, makeLoginFormSchema, makeOtpFormSchema } from '@/auth/shared/schemas'
import { TStatus } from '@/auth/shared/types'

import { LoginStep } from './login-step'
import { OtpStep } from './otp-step'

const COUNTDOWN_SECONDS = 3

export const LoginForm = () => {
    const t = useTranslations('auth.login')
    const { isShowTwoFactor, setIsShowTwoFactor, isTotpEnabled, setPasswordStep } = useAuthStore()
    const [showPassword, setShowPassword] = useState(false)

    // 1. build forms
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

    // auto‑validate fields
    useAutoValidateForm(loginForm, ['email', 'password'])
    useAutoValidateForm(otpForm, ['code'])

    // 2FA / countdown state
    const [OTPStatus, setOTPStatus] = useState<TStatus | null>(null)
    const { remaining, start } = useCountdown(COUNTDOWN_SECONDS)
    const [hasRedirected, setRedirected] = useState(false)

    // timer ref for failure reset
    const failResetTimer = useRef<number | null>(null)

    // 3. login submit → show OTP
    const onLoginSubmit = useCallback(
        (data: TLoginFormSchema) => {
            console.log('LOGIN DATA', data)
            setIsShowTwoFactor(true)
            loginForm.reset()
        },
        [loginForm, setIsShowTwoFactor]
    )

    // 4. when OTP valid → simulate verify, start countdown
    useEffect(() => {
        if (isShowTwoFactor && otpForm.formState.isValid) {
            // simulate backend response delay
            setTimeout(() => {
                console.log('OTP DATA', otpForm.getValues())
                // here you would check with backend; we'll simulate failure
                setOTPStatus('failed') // or 'success'
                start()
                otpForm.reset()
                setRedirected(false)
            }, 500)
        }
    }, [isShowTwoFactor, otpForm.formState.isValid, start, otpForm])

    // 5. auto‑reset field 5s after failure
    useEffect(() => {
        if (OTPStatus === 'failed') {
            clearTimeout(failResetTimer.current ?? undefined)
            failResetTimer.current = window.setTimeout(() => {
                otpForm.resetField('code')
                setOTPStatus(null)
            }, 5000)
        }
        return () => clearTimeout(failResetTimer.current ?? undefined)
    }, [OTPStatus, otpForm.resetField, otpForm])

    // 6. cancel reset when user starts typing
    const codeValue = otpForm.watch('code')
    useEffect(() => {
        if (OTPStatus === 'failed' && !!codeValue?.length) {
            clearTimeout(failResetTimer.current ?? undefined)
            setOTPStatus(null)
        }
    }, [codeValue, OTPStatus])

    // 7. redirect once when countdown ends on success
    useEffect(() => {
        if (OTPStatus === 'success' && !!remaining && !hasRedirected) {
            console.log('Redirect to dashboard')
            setRedirected(true)
            setIsShowTwoFactor(false)
            setOTPStatus(null)
            // TODO: actual router.push('/dashboard')
        }
    }, [OTPStatus, remaining, hasRedirected, setIsShowTwoFactor])

    return (
        <CardContent className='flex flex-col gap-6'>
            {isShowTwoFactor ? (
                <OtpStep
                    t={t}
                    form={otpForm}
                    status={OTPStatus}
                    remaining={remaining}
                    isTotpEnabled={isTotpEnabled}
                    setOTPStatus={setOTPStatus}
                    onBack={() => {
                        setIsShowTwoFactor(false)
                        setOTPStatus(null)
                        otpForm.reset()
                    }}
                />
            ) : (
                <LoginStep
                    t={t}
                    form={loginForm}
                    showPassword={showPassword}
                    togglePassword={() => setShowPassword(v => !v)}
                    onSubmit={onLoginSubmit}
                    onSignUp={() => {
                        setPasswordStep(false)
                        loginForm.reset()
                    }}
                />
            )}
        </CardContent>
    )
}
