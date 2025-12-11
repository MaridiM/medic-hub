# File: packages\libs\store\app\app.store.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/libs/store/app/app.store.ts`

## Category
Frontend

## File Type
TS (app.store.ts)

## Size
238 characters, 11 lines

## Full Code

```typescript
import { create } from 'zustand'

import { appSlice } from './slices'
import { IAppSlice } from './types'

type TBoundStore = IAppSlice

export const useStore = create<TBoundStore>()((...args) => ({
    ...appSlice(...args)
}))

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.737Z*
