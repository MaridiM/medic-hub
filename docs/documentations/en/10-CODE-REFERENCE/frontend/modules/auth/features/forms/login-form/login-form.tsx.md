# File: modules\auth\features\forms\login-form\login-form.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/features/forms/login-form/login-form.tsx`

## Category
Frontend

## File Type
TSX (login-form.tsx)

## Size
6178 characters, 169 lines

## Full Code

```typescript
'use client'

import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { LoginDocument } from '@/packages/api/graphql'
import { CardContent } from '@/packages/components'
import { PATHS } from '@/packages/config'
import { useAutoValidateForm, useCountdown } from '@/packages/hooks'
import { useTranslations } from '@/packages/libs/i18n'

import { useAuthStore } from '@/auth/shared/libs/store'
import { TLoginFormSchema, TOtpFormSchema, makeLoginFormSchema, makeOtpFormSchema } from '@/auth/shared/schemas'
import { TStatus } from '@/auth/shared/types'

import { TwoFactorStep } from './2fa-step'
import { LoginStep } from './login-step'

const COUNTDOWN_SECONDS = 3

export const LoginForm = () => {
    const t = useTranslations('auth.login')
    const router = useRouter()

    const { is2FAEnabled, setIs2FAEnabled, isTotpEnabled, setPreferred2FAMethod, preferred2FAMethod, setPasswordStep } =
        useAuthStore()

    const [showPassword, setShowPassword] = useState(false)

    const [_login, { loading: loginLoading }] = useMutation(LoginDocument)

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
        async (data: TLoginFormSchema) => {
            const response = await _login({ variables: { data } })

            if (response.error && response.error.message) {
                toast.error(response.error.message)
                return
            }

            const user = response.data?.login?.user ?? null
            if (!user) return
            loginForm.reset()

            if (user.is2FAEnabled) {
                setIs2FAEnabled(user.is2FAEnabled || false)
                setPreferred2FAMethod(user.preferred2FAMethod || null)
                return
            }
            return router.push(PATHS.dashboard())
        },
        [_login, loginForm, router, setIs2FAEnabled, setPreferred2FAMethod]
    )

    // 4. when OTP valid → simulate verify, start countdown
    useEffect(() => {
        if (is2FAEnabled && otpForm.formState.isValid) {
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
    }, [is2FAEnabled, otpForm.formState.isValid, start, otpForm])

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
            setIs2FAEnabled(false)
            setOTPStatus(null)
            router.push(PATHS.dashboard())
        }
    }, [OTPStatus, remaining, hasRedirected, setIs2FAEnabled, router])

    return (
        <CardContent className='flex flex-col gap-6'>
            {is2FAEnabled ? (
                <TwoFactorStep
                    t={t}
                    form={otpForm}
                    status={OTPStatus}
                    remaining={remaining}
                    isTotpEnabled={isTotpEnabled}
                    setOTPStatus={setOTPStatus}
                    onBack={() => {
                        setIs2FAEnabled(false)
                        setOTPStatus(null)
                        otpForm.reset()
                    }}
                />
            ) : (
                <LoginStep
                    t={t}
                    form={loginForm}
                    showPassword={showPassword}
                    loading={loginLoading}
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.911Z*
