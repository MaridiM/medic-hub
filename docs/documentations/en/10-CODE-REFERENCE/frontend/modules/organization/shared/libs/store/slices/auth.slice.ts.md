# File: modules\organization\shared\libs\store\slices\auth.slice.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/organization/shared/libs/store/slices/auth.slice.ts`

## Category
Frontend

## File Type
TS (auth.slice.ts)

## Size
1174 characters, 37 lines

## Full Code

```typescript
import { StateCreator } from 'zustand'

import { E2FaMethod } from '@/packages/api/graphql'

import { type TStatus } from '@/auth/shared/types'

import { IAuthSlice } from '../types/auth.types'

export const authSlice: StateCreator<IAuthSlice> = set => ({
    // ===============================================
    // States
    // ===============================================

    // Pages
    passwordStep: false,
    statusPage: null,

    // 2FA
    is2FAEnabled: false,
    preferred2FAMethod: null,
    isTotpEnabled: false,

    // ===============================================
    // Actions
    // ===============================================

    // Pages
    setPasswordStep: (passwordStep: boolean) => set({ passwordStep }),
    setStatusPage: (statusPage: TStatus | null) => set({ statusPage }),

    // 2FA
    setIs2FAEnabled: (is2FAEnabled: boolean) => set({ is2FAEnabled }),
    setPreferred2FAMethod: (preferred2FAMethod: E2FaMethod | null) =>
        set({ preferred2FAMethod, isTotpEnabled: preferred2FAMethod === E2FaMethod.Totp }),
    setIsTotpEnabled: (isTotpEnabled: boolean) => set({ isTotpEnabled })
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.189Z*
