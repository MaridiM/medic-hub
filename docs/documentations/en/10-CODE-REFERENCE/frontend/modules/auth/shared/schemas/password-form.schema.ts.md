# File: modules\auth\shared\schemas\password-form.schema.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/shared/schemas/password-form.schema.ts`

## Category
Frontend

## File Type
TS (password-form.schema.ts)

## Size
1016 characters, 25 lines

## Full Code

```typescript
import { z } from 'zod'

import { type TCreateAccountTranslation } from '../libs/i18n'

export function makePasswordFormSchema(t: TCreateAccountTranslation) {
    return z
        .object({
            password: z
                .string()
                .nonempty({ message: t('validation.required', { field: t('inputs.password.label') }) })
                .min(8, { message: t('validation.minLength', { min: 8 }) }),

            confirmPassword: z
                .string()
                .nonempty({ message: t('validation.required', { field: t('inputs.confirmPassword.label') }) })
                .min(8, { message: t('validation.minLength', { min: 8 }) })
        })
        .refine(data => data.password === data.confirmPassword, {
            message: t('validation.passwordsDoNotMatch'),
            path: ['confirmPassword'] // point validation error to the confirmPassword field
        })
}

export type TPasswordFormSchema = z.infer<ReturnType<typeof makePasswordFormSchema>>

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.077Z*
