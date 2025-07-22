import { z } from 'zod'

import { TUseTranslations } from '@/packages/libs/i18n'

export function makeResetPasswordFormSchema(t: TUseTranslations) {
    return z.object({
        email: z
            .string()
            .nonempty({ message: t('validation.required', { field: t('inputs.email.label') }) })
            .pipe(z.email({ message: t('validation.invalidEmail') }))
    })
}

export type TResetPasswordFormSchema = z.infer<ReturnType<typeof makeResetPasswordFormSchema>>
