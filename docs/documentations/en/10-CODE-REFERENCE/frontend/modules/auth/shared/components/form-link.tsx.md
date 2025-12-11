# File: modules\auth\shared\components\form-link.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/shared/components/form-link.tsx`

## Category
Frontend

## File Type
TSX (form-link.tsx)

## Size
895 characters, 32 lines

## Full Code

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { ComponentProps } from 'react'

import { Button } from '@/packages/components'

interface IProps extends ComponentProps<'div'> {
    href: string
    buttonText: string
    text: string
    onClick?: () => void
}

export const FormLink = ({ href, buttonText, text, onClick, ...props }: IProps) => {
    const router = useRouter()
    return (
        <footer className='text-text text-p-sm flex items-center justify-center gap-1' {...props}>
            {text}
            <Button
                className='text-primary hover:text-primary-700 cursor-pointer p-0 hover:bg-transparent'
                onClick={() => {
                    router.push(href)
                    onClick?.()
                }}
            >
                {buttonText}
            </Button>
        </footer>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.996Z*
