import { z } from 'zod'

import { TUseTranslations } from '@/packages/libs/i18n'

export function makeForgotPasswordFormSchema(t: TUseTranslations) {
    return z.object({
        email: z
            .string()
            .nonempty({ message: t('validation.required', { field: t('inputs.email.label') }) })
            .pipe(z.email({ message: t('validation.invalid_email') }))
    })
}

export type TForgotPasswordFormSchema = z.infer<ReturnType<typeof makeForgotPasswordFormSchema>>
