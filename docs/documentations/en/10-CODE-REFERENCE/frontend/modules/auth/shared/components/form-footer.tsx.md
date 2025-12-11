# File: modules\auth\shared\components\form-footer.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/shared/components/form-footer.tsx`

## Category
Frontend

## File Type
TSX (form-footer.tsx)

## Size
619 characters, 18 lines

## Full Code

```typescript
import Link from 'next/link'
import { ComponentProps } from 'react'

import { type TLoginTranslation } from '../libs/i18n'

interface IProps extends ComponentProps<'div'> {
    t: TLoginTranslation
}

export const FormFooter = ({ t }: IProps) => {
    return (
        <div className='text-text-tertiary *:[a]:hover:text-primary text-p-xs px-4 text-center text-balance *:[a]:underline *:[a]:underline-offset-4'>
            {t('agreement.prefix')} <Link href='#'>{t('agreement.terms')}</Link> {t('agreement.and')}{' '}
            <Link href='#'>{t('agreement.privacy')}</Link>.
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.970Z*
