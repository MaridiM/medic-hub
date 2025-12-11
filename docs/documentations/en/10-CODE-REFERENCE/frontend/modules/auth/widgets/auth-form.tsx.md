# File: modules\auth\widgets\auth-form.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/widgets/auth-form.tsx`

## Category
Frontend

## File Type
TSX (auth-form.tsx)

## Size
4389 characters, 122 lines

## Full Code

```typescript
'use client'

import { useMutation } from '@apollo/client/react'
import { Loader } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ComponentProps, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { VerificationEmailDocument } from '@/packages/api/graphql'
import { Card } from '@/packages/components'
import { PATHS } from '@/packages/config'
import { useTranslations } from '@/packages/libs/i18n'
import { cn } from '@/packages/utils'

import { ChangePasswordForm, CreateAccountForm, LoginForm, ResetPasswordForm, StatusMessage } from '@/auth/features'
import { FormFooter, FormHeader } from '@/auth/shared/components'
import { useAuthStore } from '@/auth/shared/libs/store'
import type { TAuthFormType } from '@/auth/shared/types'

interface IProps extends ComponentProps<'div'> {
    type: TAuthFormType
    token?: string
}

export const AuthForm = ({ className, type = 'login', token, ...props }: IProps) => {
    const t = useTranslations(`auth.${type}`)
    const pathname = usePathname()

    const { is2FAEnabled, statusPage, setStatusPage } = useAuthStore()

    const [_verificationEmail, { loading: verificationEmailLoading }] = useMutation(VerificationEmailDocument)

    // ✅ Используем ref для отслеживания выполненных запросов
    const verificationAttempted = useRef(false)

    // Reset status when returning to the main auth page
    useEffect(() => {
        if (statusPage && pathname === PATHS.auth()) {
            setStatusPage(null)
        }
    }, [statusPage, pathname, setStatusPage])

    // ✅ Token verification - выполняется только один раз
    useEffect(() => {
        // Проверяем, что запрос еще не выполнялся
        if (type === 'verify' && token && !verificationAttempted.current) {
            verificationAttempted.current = true

            const verifyEmail = async () => {
                try {
                    const response = await _verificationEmail({
                        variables: { data: { token } }
                    })

                    if (response?.error?.message) {
                        toast.error(response.error.message)
                        setStatusPage('failed')
                        return
                    }

                    if (response.data) {
                        setStatusPage('success')
                    }
                } catch (error) {
                    console.error('Verification error:', error)
                    toast.error('Verification failed')
                    setStatusPage('failed')
                }
            }

            verifyEmail()
        }

        // Сброс флага при размонтировании (для hot reload в development)
        return () => {
            if (type !== 'verify') {
                verificationAttempted.current = false
            }
        }
    }, [type, token, _verificationEmail, setStatusPage])

    // Status block / special forms without extra side effects
    const statusLayout = useMemo(() => {
        if (statusPage) {
            return <StatusMessage status={statusPage} setStatusPage={setStatusPage} />
        }
        if (type === 'resetPassword') {
            return <ResetPasswordForm setStatusPage={setStatusPage} />
        }
        if (type === 'changePassword' && token) {
            return <ChangePasswordForm setStatusPage={setStatusPage} token={token} />
        }
        return null
    }, [statusPage, setStatusPage, type, token])

    if (type === 'verify' && verificationEmailLoading) {
        return (
            <div className='flex justify-center'>
                <Loader className='size-8 animate-spin' />
            </div>
        )
    }

    return (
        <div className={cn('flex w-full max-w-[400px] min-w-[320px] flex-col gap-6', className)} {...props}>
            <Card>
                <>
                    <FormHeader t={t} type={type} status={statusPage} />

                    {/* Keys matter: changing type remounts and re-initialises the forms */}
                    {type === 'login' && <LoginForm key='login' />}
                    {type === 'createAccount' && <CreateAccountForm key='createAccount' />}

                    {statusLayout}
                </>
            </Card>

            {((type === 'login' && !is2FAEnabled) || type === 'createAccount') && <FormFooter t={t} />}
        </div>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.091Z*
