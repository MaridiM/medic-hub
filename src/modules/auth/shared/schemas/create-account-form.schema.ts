import { z } from 'zod'

import { TUseTranslations } from '@/packages/libs/i18n'

export function makeCreateAccountFormSchema(t: TUseTranslations) {
    return (
        z
            .object({
                fullName: z
                    .string()
                    .nonempty({ message: t('validation.required', { field: t('inputs.fullName.label') }) }),

                email: z
                    .string()
                    .nonempty({ message: t('validation.required', { field: t('inputs.email.label') }) })
                    .pipe(z.email({ message: t('validation.invalid_email') })),

                phone: z
                    .string()
                    .nonempty({ message: t('validation.required', { field: t('inputs.phone.label') }) })
                    .regex(/^\+[1-9]\d{1,14}$/, { message: t('validation.invalid_phone') }),

                password: z
                    .string()
                    .nonempty({ message: t('validation.required', { field: t('inputs.password.label') }) })
                    .min(8, { message: t('validation.min_length', { min: 8 }) }),

                confirmPassword: z
                    .string()
                    .nonempty({ message: t('validation.required', { field: t('inputs.confirmPassword.label') }) })
                    .min(8, { message: t('validation.min_length', { min: 8 }) })
            })
            // 🚀 объектный refine для сравнения двух полей
            .refine(data => data.password === data.confirmPassword, {
                message: t('validation.passwords_do_not_match'),
                path: ['confirmPassword'] // укажем, что ошибка относится к полю confirmPassword
            })
    )
}

export type TCreateAccountFormSchema = z.infer<ReturnType<typeof makeCreateAccountFormSchema>>
