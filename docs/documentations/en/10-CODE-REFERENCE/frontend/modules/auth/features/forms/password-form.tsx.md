# File: modules\auth\features\forms\password-form.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/features/forms/password-form.tsx`

## Category
Frontend

## File Type
TSX (password-form.tsx)

## Size
4650 characters, 92 lines

## Full Code

```typescript
'use client'

import { Eye, EyeOff } from 'lucide-react'
import { ComponentProps, PropsWithChildren, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/packages/components'

import { type TCreateAccountTranslation } from '@/auth/shared/libs/i18n'
import { TPasswordFormSchema } from '@/auth/shared/schemas'

interface IProps extends PropsWithChildren<Omit<ComponentProps<'form'>, 'onSubmit'>> {
    form: UseFormReturn<TPasswordFormSchema>
    onSubmit: (data: TPasswordFormSchema) => void
    t: TCreateAccountTranslation
}

export const PasswordForm = ({ children, form, onSubmit, t, ...props }: IProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <Form key='password-form' {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4' {...props}>
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
                                        autoComplete='off'
                                        {...field}
                                    />
                                    <Button
                                        type='button'
                                        className='absolute top-0 right-0 size-10 h-full min-w-10 rounded-l-none bg-transparent hover:bg-transparent'
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <Eye className='!size-4' /> : <EyeOff className='!size-4' />}
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage className='!text-p-xs text-destructive' />
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
                                        autoComplete='off'
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
                            <FormMessage className='!text-p-xs text-destructive' />
                        </FormItem>
                    )}
                />
                {children}
            </form>
        </Form>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.921Z*
