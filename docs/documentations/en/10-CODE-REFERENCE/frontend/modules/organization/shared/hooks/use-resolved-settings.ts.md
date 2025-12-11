# File: modules\organization\shared\hooks\use-resolved-settings.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/organization/shared/hooks/use-resolved-settings.ts`

## Category
Frontend

## File Type
TS (use-resolved-settings.ts)

## Size
659 characters, 22 lines

## Full Code

```typescript
import { useMemo } from 'react'

import { ResolvedSettings, resolveOrganizationSettings } from '../utils'

type UseResolvedSettingsParams = {
    language?: string
    timezone?: string
    currency?: string
    firstDayOfWeek?: string
    businessHours?: string
}

/**
 * Instantly resolves all "auto" values and keeps them in sync in real time.
 * Perfect for forms — you always have actual values for preview or sending to the server.
 */
export const useResolvedSettings = (params: UseResolvedSettingsParams = {}): ResolvedSettings => {
    return useMemo(() => {
        return resolveOrganizationSettings(params)
    }, [params])
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.170Z*
