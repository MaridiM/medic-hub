// i18n-typed.ts
import type { TOptions } from 'i18next'

import { i18n } from '@/core/config'
import languages from '@/core/i18n/locales'

// 1) Базовый тип ресурсов для одной локали
type Res = (typeof languages)['en']

// 2) Все dot-пути ТОЛЬКО к объектам (не к строкам)
type ObjectKeys<T, P extends string = ''> = {
	[K in keyof T & string]: T[K] extends string
		? never
		: T[K] extends object
			? `${P}${K}` | ObjectKeys<T[K], `${P}${K}.`>
			: never
}[keyof T & string]

// 3) Значение по dot-пути
type ValueAtPath<T, P extends string> = P extends `${infer K}.${infer R}`
	? K extends keyof T
		? ValueAtPath<T[K], R>
		: never
	: P extends keyof T
		? T[P]
		: never

// 4) Публичные типы
export type I18nObjectKey = ObjectKeys<Res>
export type I18nObject<K extends I18nObjectKey> = ValueAtPath<Res, K>

// 5) Опции для "объектных" переводов (без any)
type ObjOptions = TOptions & {
	returnObjects: true
	lng?: string
}

// 6) Типизированный t для возврата объектов
type TypedT = <K extends I18nObjectKey>(key: K, options?: ObjOptions) => I18nObject<K>

// 7) Хелпер без any и без линт-ошибок
export function tObj<K extends I18nObjectKey>(
	key: K,
	opts?: Omit<ObjOptions, 'returnObjects'> & { returnObjects?: true },
): I18nObject<K> {
	const t = i18n.t as unknown as TypedT
	return t(key, { ...opts, returnObjects: true })
}

// import { i18n } from '@/core/config'
// import languages from '@/core/i18n/locales'

// // Базовый тип ресурсов
// type Res = (typeof languages)['en']

// // Все "dot-пути" по объектам, но без листьев-строк
// type ObjectKeys<T, P extends string = ''> = {
// 	[K in keyof T & string]: T[K] extends string
// 		? never
// 		: T[K] extends object
// 			? `${P}${K}` | ObjectKeys<T[K], `${P}${K}.`>
// 			: never
// }[keyof T & string]

// // Значение по dot-пути
// type ValueAtPath<T, P extends string> = P extends `${infer K}.${infer R}`
// 	? K extends keyof T
// 		? ValueAtPath<T[K], R>
// 		: never
// 	: P extends keyof T
// 		? T[P]
// 		: never

// // Ключи, указывающие на объект (где returnObjects имеет смысл)
// export type I18nObjectKey = ObjectKeys<Res>

// // Тип объекта по ключу
// export type I18nObject<K extends I18nObjectKey> = ValueAtPath<Res, K>

// // Хелпер: вернуть объект строго типизировано
// export function tObj<K extends I18nObjectKey>(key: K, opts?: { lng?: string }): I18nObject<K> {
// 	// приводим тип результата вручную, чтобы не “ломать” перегрузки i18next
// 	return i18n.t(key as string, { ...opts, returnObjects: true } as any) as unknown as I18nObject<K>
// }
