# File: packages\components\shared\hint.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/shared/hint.tsx`

## Category
Frontend

## File Type
TSX (hint.tsx)

## Size
760 characters, 24 lines

## Full Code

```typescript
import { ComponentProps, PropsWithChildren } from 'react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui'

interface IProps {
    tooltip?: string | ComponentProps<typeof TooltipContent>
}

export function Hint({ children, tooltip }: PropsWithChildren<IProps>) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                {tooltip &&
                    (typeof tooltip === 'string' ? (
                        <TooltipContent>{tooltip}</TooltipContent>
                    ) : (
                        <TooltipContent {...tooltip} />
                    ))}
            </Tooltip>
        </TooltipProvider>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.246Z*
