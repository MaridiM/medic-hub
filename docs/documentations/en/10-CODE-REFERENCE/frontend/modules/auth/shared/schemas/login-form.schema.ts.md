# File: modules\auth\shared\schemas\login-form.schema.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/shared/schemas/login-form.schema.ts`

## Category
Frontend

## File Type
TS (login-form.schema.ts)

## Size
947 characters, 25 lines

## Full Code

```typescript
import { z } from 'zod'

import { type TLoginTranslation } from '../libs/i18n'

export function makeLoginFormSchema(t: TLoginTranslation) {
    return z.object({
        email: z
            .string()
            .nonempty({ message: t('validation.required', { field: t('inputs.password.label') }) })
            .pipe(z.email({ message: t('validation.invalidEmail') })),
        password: z
            .string()
            .nonempty({ message: t('validation.required', { field: t('inputs.password.label') }) })
            .min(8, { message: t('validation.minLength', { min: 8 }) })
    })
}
export function makeOtpFormSchema(t: TLoginTranslation) {
    return z.object({
        code: z.string().min(6, { message: t('validation.minLength', { min: 6 }) })
    })
}

export type TLoginFormSchema = z.infer<ReturnType<typeof makeLoginFormSchema>>
export type TOtpFormSchema = z.infer<ReturnType<typeof makeOtpFormSchema>>

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.072Z*
