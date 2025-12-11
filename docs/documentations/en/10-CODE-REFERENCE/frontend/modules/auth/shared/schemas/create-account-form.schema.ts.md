# File: modules\auth\shared\schemas\create-account-form.schema.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/shared/schemas/create-account-form.schema.ts`

## Category
Frontend

## File Type
TS (create-account-form.schema.ts)

## Size
857 characters, 22 lines

## Full Code

```typescript
import { z } from 'zod'

import { type TCreateAccountTranslation } from '../libs/i18n'

export function makeCreateAccountFormSchema(t: TCreateAccountTranslation) {
    return z.object({
        fullName: z.string().nonempty({ message: t('validation.required', { field: t('inputs.fullName.label') }) }),

        email: z
            .string()
            .nonempty({ message: t('validation.required', { field: t('inputs.email.label') }) })
            .pipe(z.email({ message: t('validation.invalidEmail') })),

        phone: z
            .string()
            .nonempty({ message: t('validation.required', { field: t('inputs.phone.label') }) })
            .regex(/^\+[1-9]\d{1,14}$/, { message: t('validation.invalidPhone') })
    })
}

export type TCreateAccountFormSchema = z.infer<ReturnType<typeof makeCreateAccountFormSchema>>

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.065Z*
