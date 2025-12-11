# File: modules\auth\shared\components\try-again.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/shared/components/try-again.tsx`

## Category
Frontend

## File Type
TSX (try-again.tsx)

## Size
735 characters, 25 lines

## Full Code

```typescript
import { ComponentProps } from 'react'

import { Button } from '@/packages/components'

interface IProps extends ComponentProps<'div'> {
    text: string
    link: string
    onClick?: () => void
}

export const TryAgain = ({ text, link, onClick }: IProps) => {
    return (
        <div className='text-p-sm text-text-secondary flex items-center justify-center gap-1'>
            {text}
            <Button
                type='button'
                className='text-primary hover:text-primary-700 w-fill h-auto cursor-pointer rounded-none bg-transparent p-0 hover:bg-transparent'
                onClick={() => onClick?.()}
            >
                {link}
            </Button>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.012Z*
