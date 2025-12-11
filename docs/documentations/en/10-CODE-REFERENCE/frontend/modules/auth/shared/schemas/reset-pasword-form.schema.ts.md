# File: modules\auth\shared\schemas\reset-pasword-form.schema.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/shared/schemas/reset-pasword-form.schema.ts`

## Category
Frontend

## File Type
TS (reset-pasword-form.schema.ts)

## Size
495 characters, 15 lines

## Full Code

```typescript
import { z } from 'zod'

import { type TLoginTranslation } from '../libs/i18n'

export function makeResetPasswordFormSchema(t: TLoginTranslation) {
    return z.object({
        email: z
            .string()
            .nonempty({ message: t('validation.required', { field: t('inputs.email.label') }) })
            .pipe(z.email({ message: t('validation.invalidEmail') }))
    })
}

export type TResetPasswordFormSchema = z.infer<ReturnType<typeof makeResetPasswordFormSchema>>

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.079Z*
