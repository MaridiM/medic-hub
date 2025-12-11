# File: packages\utils\tw-merge.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/utils/tw-merge.ts`

## Category
Frontend

## File Type
TS (tw-merge.ts)

## Size
172 characters, 7 lines

## Full Code

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.855Z*
