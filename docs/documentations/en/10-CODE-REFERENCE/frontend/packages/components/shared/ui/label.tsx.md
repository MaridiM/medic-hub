# File: packages\components\shared\ui\label.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/shared/ui/label.tsx`

## Category
Frontend

## File Type
TSX (label.tsx)

## Size
624 characters, 25 lines

## Full Code

```typescript
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/packages/utils/index"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-p-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.290Z*
