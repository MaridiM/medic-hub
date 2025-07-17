import { z } from 'zod'

import { TUseTranslations } from '@/packages/libs/i18n'

export function makePasswordFormSchema(t: TUseTranslations) {
    return z
        .object({
            password: z
                .string()
                .nonempty({ message: t('validation.required', { field: t('inputs.password.label') }) })
                .min(8, { message: t('validation.min_length', { min: 8 }) }),

            confirmPassword: z
                .string()
                .nonempty({ message: t('validation.required', { field: t('inputs.confirmPassword.label') }) })
                .min(8, { message: t('validation.min_length', { min: 8 }) })
        })
        .refine(data => data.password === data.confirmPassword, {
            message: t('validation.passwords_do_not_match'),
            path: ['confirmPassword'] // укажем, что ошибка относится к полю confirmPassword
        })
}

export type TPasswordFormSchema = z.infer<ReturnType<typeof makePasswordFormSchema>>
