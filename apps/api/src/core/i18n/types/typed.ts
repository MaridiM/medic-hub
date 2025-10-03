import type { TOptions } from 'i18next'

import languages from '@/core/i18n/locales'

/** Базовый ресурс (одна локаль) */
export type Res = (typeof languages)['en']

/* ===== вспомогательные ===== */
type Depth = 0 | 1 | 2 | 3 | 4 | 5 | 6
type DecMap = { 0: 0; 1: 0; 2: 1; 3: 2; 4: 3; 5: 4; 6: 5 }
type Dec<D extends Depth> = DecMap[D]

type NonArrayObject<T> = T extends readonly any[] ? never : T extends object ? T : never

/** Значение по dot-пути */
export type ValueAtPath<T, P extends string> = P extends `${infer K}.${infer R}`
	? K extends keyof T
		? ValueAtPath<T[K], R>
		: never
	: P extends keyof T
		? T[P]
		: never

/** Все dot-пути (и листья, и узлы), с лимитом глубины */
export type DotPaths<T, D extends Depth = 6, P extends string = ''> = [D] extends [0]
	? never
	: {
			[K in keyof T & string]: T[K] extends object ? `${P}${K}` | DotPaths<T[K], Dec<D>, `${P}${K}.`> : `${P}${K}`
		}[keyof T & string]

/** Только ключи-узлы (объекты, НО не массивы) */
export type NodeKeys<T> = {
	[K in DotPaths<T>]: NonArrayObject<ValueAtPath<T, K>> extends never ? never : K
}[DotPaths<T>]

/** Только ключи-листья-СТРОКИ */
export type LeafKeys<T> = {
	[K in DotPaths<T>]: ValueAtPath<T, K> extends string ? K : never
}[DotPaths<T>]

/** Только ключи-листья-МАССИВЫ СТРОК */
export type ArrayLeafKeys<T> = {
	[K in DotPaths<T>]: ValueAtPath<T, K> extends readonly string[] ? K : never
}[DotPaths<T>]

/** Значение узла (объект без массивов) */
export type NodeValue<K extends string> =
	NonArrayObject<ValueAtPath<Res, K>> extends never ? never : NonArrayObject<ValueAtPath<Res, K>>

/** Дочерние ключи-лист (строка ИЛИ массив строк) */
export type ChildLeafKeys<K extends string> = {
	[C in keyof NodeValue<K> & string]: NodeValue<K>[C] extends string | readonly string[] ? C : never
}[keyof NodeValue<K> & string]

/** Дочерние ключи-узлы (массивы НЕ считаем узлами) */
export type ChildNodeKeys<K extends string> = {
	[C in keyof NodeValue<K> & string]: NodeValue<K>[C] extends readonly string[]
		? never
		: NodeValue<K>[C] extends object
			? C
			: never
}[keyof NodeValue<K> & string]

/** Опции */
export type StrOptions = Omit<TOptions, 'returnObjects'> & {
	lng?: string
	returnObjects?: false | undefined
}
export type ObjOptions = Omit<TOptions, 'returnObjects'> & {
	lng?: string
	returnObjects: true
}

/** Скоуп-t */
export type ScopedT<K extends string> = {
	<C extends ChildLeafKeys<K>>(
		child: C,
		opts?: StrOptions,
	): NodeValue<K>[C] extends readonly string[] ? string[] : string
} & {
	<C extends ChildNodeKeys<K>>(child: C, opts: ObjOptions): ValueAtPath<Res, `${K}.${C}`>
} & {
	<C extends ChildNodeKeys<K>>(child: C, opts?: StrOptions): ScopedT<`${K}.${C}`>
}

/** Узнаём «объект» безопасно в рантайме */
export const isObjectRecord = (x: unknown): x is Record<string, unknown> =>
	typeof x === 'object' && x !== null && !Array.isArray(x)

/** Упрощённый тип функции t */
export type CoreT = (key: string, opts?: TOptions) => unknown

// import 'i18next'
// import type { TOptions } from 'i18next'

// import languages from '@/core/i18n/locales'

// /** Базовый ресурс (одна локаль) */
// export type Res = (typeof languages)['en']

// /** Ограничение глубины рекурсии типов */
// type Depth = 0 | 1 | 2 | 3 | 4 | 5 | 6
// type DecMap = { 0: 0; 1: 0; 2: 1; 3: 2; 4: 3; 5: 4; 6: 5 }
// type Dec<D extends Depth> = DecMap[D]

// /** Значение по dot-пути */
// export type ValueAtPath<T, P extends string> = P extends `${infer K}.${infer R}`
// 	? K extends keyof T
// 		? ValueAtPath<T[K], R>
// 		: never
// 	: P extends keyof T
// 		? T[P]
// 		: never

// /** Все dot-пути (и листья, и узлы), с лимитом глубины */
// export type DotPaths<T, D extends Depth = 6, P extends string = ''> = [D] extends [0]
// 	? never
// 	: {
// 			[K in keyof T & string]: T[K] extends object ? `${P}${K}` | DotPaths<T[K], Dec<D>, `${P}${K}.`> : `${P}${K}`
// 		}[keyof T & string]

// /** Только ключи-узлы (объекты) */
// export type NodeKeys<T> = {
// 	[K in DotPaths<T>]: ValueAtPath<T, K> extends object ? K : never
// }[DotPaths<T>]

// /** Только ключи-листья-СТРОКИ */
// export type LeafKeys<T> = {
// 	[K in DotPaths<T>]: ValueAtPath<T, K> extends string ? K : never
// }[DotPaths<T>]

// /** Только ключи-листья-МАССИВЫ СТРОК */
// export type ArrayLeafKeys<T> = {
// 	[K in DotPaths<T>]: ValueAtPath<T, K> extends readonly string[] ? K : never
// }[DotPaths<T>]

// /** Значение узла */
// export type NodeValue<K extends string> = ValueAtPath<Res, K> extends object ? ValueAtPath<Res, K> : never

// /** Дочерние ключи-листья (строка ИЛИ массив строк) */
// export type ChildLeafKeys<K extends string> = {
// 	[C in keyof NodeValue<K> & string]: NodeValue<K>[C] extends string | readonly string[] ? C : never
// }[keyof NodeValue<K> & string]

// /** Дочерние ключи-узлы (массивы НЕ считаем узлами) */
// export type ChildNodeKeys<K extends string> = {
// 	[C in keyof NodeValue<K> & string]: NodeValue<K>[C] extends readonly string[]
// 		? never
// 		: NodeValue<K>[C] extends object
// 			? C
// 			: never
// }[keyof NodeValue<K> & string]

// /** Опции */
// export type StrOptions = Omit<TOptions, 'returnObjects'> & {
// 	lng?: string
// 	returnObjects?: false | undefined
// }
// export type ObjOptions = Omit<TOptions, 'returnObjects'> & {
// 	lng?: string
// 	returnObjects: true
// }

// /** Скоуп-t: подсказывает только детей узла.
//  * Для листа-массива вернёт string[], для листа-строки — string.
//  */
// export type ScopedT<K extends string> = {
// 	<C extends ChildLeafKeys<K>>(
// 		child: C,
// 		opts?: StrOptions,
// 	): NodeValue<K>[C] extends readonly string[] ? string[] : string
// } & {
// 	<C extends ChildNodeKeys<K>>(child: C, opts: ObjOptions): ValueAtPath<Res, `${K}.${C}`>
// } & {
// 	<C extends ChildNodeKeys<K>>(child: C, opts?: StrOptions): ScopedT<`${K}.${C}`>
// }

// /** Узнаём «объект» безопасно в рантайме */
// export const isObjectRecord = (x: unknown): x is Record<string, unknown> =>
// 	typeof x === 'object' && x !== null && !Array.isArray(x)

// /** Упрощённый тип функции t */
// export type CoreT = (key: string, opts?: TOptions) => unknown
