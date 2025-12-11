# File: packages\components\shared\user-avatar.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/shared/user-avatar.tsx`

## Category
Frontend

## File Type
TSX (user-avatar.tsx)

## Size
892 characters, 30 lines

## Full Code

```typescript
import { CSSProperties } from 'react'

import { cn, generateAbbreviation } from '@/packages/utils'

import { Avatar, AvatarFallback, AvatarImage } from './ui'

interface IProps {
    className?: string
    style?: CSSProperties
    radius?: string
    src?: string
    fullName?: string
}

export function UserAvatar({ className, radius, style, fullName, src }: IProps) {
    return (
        <Avatar className={cn('', className, radius)}>
            <AvatarImage src={src} alt={fullName ?? 'User avatar'} style={style} />
            <AvatarFallback
                className={cn(
                    'border-border/5 text-p-md text-text-secondary border pt-px tracking-wider uppercase',
                    radius
                )}
            >
                {generateAbbreviation(fullName ?? 'US')}
            </AvatarFallback>
        </Avatar>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.414Z*
