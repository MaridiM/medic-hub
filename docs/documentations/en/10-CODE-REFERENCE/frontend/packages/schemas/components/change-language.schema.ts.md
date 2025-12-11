# File: packages\schemas\components\change-language.schema.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/schemas/components/change-language.schema.ts`

## Category
Frontend

## File Type
TS (change-language.schema.ts)

## Size
240 characters, 10 lines

## Full Code

```typescript
import { z } from 'zod'

import { languages } from '@/packages/libs/i18n'

export const changeLanguageSchema = z.object({
    language: z.enum(languages)
})

export type TChangeLanguageSchema = z.infer<typeof changeLanguageSchema>

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.828Z*
