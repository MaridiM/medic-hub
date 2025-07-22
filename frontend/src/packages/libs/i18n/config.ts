import { useTranslations } from 'next-intl'

export const COOKIE_NAME = 'language'
export const languages = ['ru', 'en'] as const
export const defaultLanguage: TLanguage = 'en'

export type TLanguage = (typeof languages)[number]
export type TUseTranslations = ReturnType<typeof useTranslations>
