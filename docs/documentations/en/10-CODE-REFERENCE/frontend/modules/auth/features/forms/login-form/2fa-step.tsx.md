# File: modules\auth\features\forms\login-form\2fa-step.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/features/forms/login-form/2fa-step.tsx`

## Category
Frontend

## File Type
TSX (2fa-step.tsx)

## Size
1749 characters, 48 lines

## Full Code

```typescript
import { type UseFormReturn } from 'react-hook-form'

import { TryAgain } from '@/modules/auth/shared/components'

import { Button } from '@/packages/components'

import { type TLoginTranslation } from '@/auth/shared/libs/i18n'
import { TOtpFormSchema } from '@/auth/shared/schemas'
import type { TStatus } from '@/auth/shared/types'

import { OtpForm } from './otp-form'

interface IProps {
    t: TLoginTranslation
    form: UseFormReturn<TOtpFormSchema>
    status: TStatus | null
    remaining: number
    isTotpEnabled: boolean
    onBack: () => void
    setOTPStatus: (status: TStatus | null) => void
}
export const TwoFactorStep = ({ t, form, status, remaining, isTotpEnabled, onBack, setOTPStatus }: IProps) => {
    return (
        <OtpForm form={form} t={t} status={status} alertDuration={remaining}>
            <div className='mt-6 flex flex-col items-center gap-6'>
                {!isTotpEnabled && (
                    <TryAgain
                        text={t('2fa.tryAgain.text')}
                        link={t('2fa.tryAgain.link')}
                        onClick={
                            !isTotpEnabled
                                ? () => {
                                      console.log('RESEND CODE')
                                      setOTPStatus(null)
                                      form.reset()
                                  }
                                : undefined
                        }
                    />
                )}
                <Button type='button' variant='ghost' className='mx-auto w-fit' onClick={onBack}>
                    {t('form.back')}
                </Button>
            </div>
        </OtpForm>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.908Z*
