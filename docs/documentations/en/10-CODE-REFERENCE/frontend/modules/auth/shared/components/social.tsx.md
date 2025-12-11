# File: modules\auth\shared\components\social.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/shared/components/social.tsx`

## Category
Frontend

## File Type
TSX (social.tsx)

## Size
1042 characters, 29 lines

## Full Code

```typescript
'use client'

import { ComponentProps } from 'react'

import { Google } from '@/packages/assets/icons'
import { Button } from '@/packages/components'

import { type TLoginTranslation } from '../libs/i18n'

interface IProps extends ComponentProps<'div'> {
    t: TLoginTranslation
}

export const Social = ({ t, ...props }: IProps) => {
    return (
        <div className='flex flex-col gap-6' {...props}>
            <div className='flex flex-col gap-2'>
                <Button variant='ghost' className='w-full gap-2 tracking-wide'>
                    <Google className='!size-4' />
                    {t('form.loginWithGoogle')}
                </Button>
            </div>
            <div className='after:border-border/20 text-p-sm relative text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                <span className='bg-card text-text-tertiary relative z-10 px-2'>{t('form.orContinue')}</span>
            </div>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.010Z*
