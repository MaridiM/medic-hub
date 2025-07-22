import { z } from 'zod'

import { languages } from '@/packages/libs/i18n'

export const changeLanguageSchema = z.object({
    language: z.enum(languages)
})

export type TChangeLanguageSchema = z.infer<typeof changeLanguageSchema>
