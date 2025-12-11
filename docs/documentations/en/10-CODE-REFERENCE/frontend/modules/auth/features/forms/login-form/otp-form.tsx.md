# File: modules\auth\features\forms\login-form\otp-form.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/features/forms/login-form/otp-form.tsx`

## Category
Frontend

## File Type
TSX (otp-form.tsx)

## Size
3159 characters, 70 lines

## Full Code

```typescript
import { ComponentProps, PropsWithChildren } from 'react'
import { UseFormReturn } from 'react-hook-form'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot
} from '@/packages/components'

import { OtpAlert } from '@/auth/shared/components'
import { type TLoginTranslation } from '@/auth/shared/libs/i18n'
import { TOtpFormSchema } from '@/auth/shared/schemas'
import { type TStatus } from '@/auth/shared/types'

interface IProps extends PropsWithChildren<ComponentProps<'form'>> {
    form: UseFormReturn<TOtpFormSchema>
    t: TLoginTranslation
    status?: TStatus | null
    alertDuration?: number
}

export const OtpForm = ({ children, form, t, status, alertDuration, ...props }: IProps) => {
    return (
        <Form {...form} {...props}>
            <form className='space-y-4'>
                {status === 'success' ? (
                    <OtpAlert status={status} title={t(`2fa.status.${status}`)} duration={alertDuration} />
                ) : (
                    <>
                        <FormField
                            control={form.control}
                            name='code'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <InputOTP
                                            maxLength={6}
                                            {...field}
                                            containerClassName='flex w-full justify-center'
                                        >
                                            <InputOTPGroup className='flex w-full justify-between'>
                                                <InputOTPSlot index={0} className='size-12 rounded-md' />
                                                <InputOTPSlot index={1} className='size-12 rounded-md' />
                                                <InputOTPSlot index={2} className='size-12 rounded-md' />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup className='flex w-full justify-between'>
                                                <InputOTPSlot index={3} className='size-12 rounded-md' />
                                                <InputOTPSlot index={4} className='size-12 rounded-md' />
                                                <InputOTPSlot index={5} className='size-12 rounded-md' />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {status && <OtpAlert status={status} title={t(`2fa.status.${status}`)} />}
                        {children}
                    </>
                )}
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.916Z*
