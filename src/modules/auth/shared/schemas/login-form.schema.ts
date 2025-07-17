import { z } from 'zod'

import { TUseTranslations } from '@/packages/libs/i18n'

export function makeLoginFormSchema(t: TUseTranslations) {
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

export type TLoginFormSchema = z.infer<ReturnType<typeof makeLoginFormSchema>>
