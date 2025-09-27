import en from './en'
import ruRaw from './ru'

export type MessagesSchema = typeof en // эталон — структура EN
export const ru: MessagesSchema = ruRaw // гарантируем совпадение структуры

const languages = {
	en,
	ru,
} as const

export default languages
export type LanguagesMap = typeof languages
export type Language = keyof LanguagesMap // "en" | "ru"
