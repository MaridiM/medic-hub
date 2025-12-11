# File: packages\libs\store\app\slices\app.slice.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/libs/store/app/slices/app.slice.ts`

## Category
Frontend

## File Type
TS (app.slice.ts)

## Size
282 characters, 12 lines

## Full Code

```typescript
import { StateCreator } from 'zustand'

import { IAppSlice } from '../types'

export const appSlice: StateCreator<IAppSlice> = (set) => ({
    // States
    isSidebarOpen: true,

    // Actions
    setIsSidebarOpen: (isSidebarOpen: boolean) => set({ isSidebarOpen }),
})

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.742Z*
