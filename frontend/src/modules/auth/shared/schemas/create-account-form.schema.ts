import { z } from 'zod'

import { TUseTranslations } from '@/packages/libs/i18n'

export function makeCreateAccountFormSchema(t: TUseTranslations) {
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
