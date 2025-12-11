# File: modules\auth\shared\libs\store\types\auth.types.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/shared/libs/store/types/auth.types.ts`

## Category
Frontend

## File Type
TS (auth.types.ts)

## Size
849 characters, 29 lines

## Full Code

```typescript
import { E2FaMethod } from '@/packages/api/graphql'

import { TStatus } from '@/auth/shared/types'

export interface IAuthSlice {
    // ===============================================
    // States
    // ===============================================
    // Pages
    passwordStep: boolean
    statusPage: TStatus | null

    // 2FA
    is2FAEnabled: boolean
    preferred2FAMethod: E2FaMethod | null
    isTotpEnabled: boolean

    // ===============================================
    // Actions
    // ===============================================
    // Pages
    setPasswordStep: (passwordStep: boolean) => void
    setStatusPage: (statusPage: TStatus | null) => void

    // 2FA
    setIs2FAEnabled: (is2FAEnabled: boolean) => void
    setPreferred2FAMethod: (preferred2FAMethod: E2FaMethod | null) => void
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.058Z*
