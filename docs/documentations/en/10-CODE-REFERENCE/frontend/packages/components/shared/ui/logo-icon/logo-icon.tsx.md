# File: packages\components\shared\ui\logo-icon\logo-icon.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/shared/ui/logo-icon/logo-icon.tsx`

## Category
Frontend

## File Type
TSX (logo-icon.tsx)

## Size
1116 characters, 35 lines

## Full Code

```typescript
'use client'

import { useTheme } from 'next-themes'

import { LogoFullSVG } from './logo-full'
import { LogoMiniSVG } from './logo-mini'
import { LogoTextSVG } from './logo-text'
import type { TIconProps } from './types'

export function LogoIcon({ mini = true, onlyText = false, ...props }: TIconProps) {
    const { theme } = useTheme()

    const isDark = theme === 'dark'

    const shadow = isDark ? '#1e1e1e' : '#999'
    const primary = isDark ? '#2B7AFF' : '#143394'
    const secondary = isDark ? '#EFEFEF' : '#2B7AFF'

    const filterStyle = `drop-shadow(0px .5px 1px ${shadow})`

    return (
        <>
            {!onlyText ? (
                mini ? (
                    <LogoMiniSVG shadow={filterStyle} primary={primary} secondary={secondary} {...props} />
                ) : (
                    <LogoFullSVG shadow={filterStyle} primary={primary} secondary={secondary} {...props} />
                )
            ) : (
                <LogoTextSVG shadow={filterStyle} primary={primary} secondary={secondary} {...props} />
            )}
        </>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.298Z*
