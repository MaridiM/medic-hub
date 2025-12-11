# File: modules\auth\shared\libs\store\auth.store.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/shared/libs/store/auth.store.ts`

## Category
Frontend

## File Type
TS (auth.store.ts)

## Size
246 characters, 11 lines

## Full Code

```typescript
import { create } from 'zustand'

import { authSlice } from './slices'
import { IAuthSlice } from './types'

type TBoundStore = IAuthSlice

export const useAuthStore = create<TBoundStore>()((...args) => ({
    ...authSlice(...args)
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.048Z*
