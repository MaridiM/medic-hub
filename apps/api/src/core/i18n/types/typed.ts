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

/* ===== ✅ НОВОЕ: Вложенные пути внутри узла ===== */

/**
 * Все вложенные пути внутри объекта T (включая вложенные через точку)
 * Например, для { details: { title: "...", type: "..." } }
 * вернет: "details" | "details.title" | "details.type"
 */
export type NestedPaths<T, D extends Depth = 6, P extends string = ''> = [D] extends [0]
	? never
	: T extends object
		? {
				[K in keyof T & string]:
					| `${P}${K}`
					| (T[K] extends object
							? T[K] extends readonly any[]
								? never
								: NestedPaths<T[K], Dec<D>, `${P}${K}.`>
							: never)
			}[keyof T & string]
		: never

/**
 * Значение по относительному пути внутри объекта T
 * Например: RelativeValue<{ details: { title: "..." } }, "details.title"> = string
 */
export type RelativeValue<T, P extends string> = P extends `${infer K}.${infer R}`
	? K extends keyof T
		? RelativeValue<T[K], R>
		: never
	: P extends keyof T
		? T[P]
		: never

/** Опции */
export type StrOptions = Omit<TOptions, 'returnObjects'> & {
	lng?: string
	returnObjects?: false | undefined
}
export type ObjOptions = Omit<TOptions, 'returnObjects'> & {
	lng?: string
	returnObjects: true
}

/* ===== ✅ ОБНОВЛЕННЫЙ ScopedT с поддержкой вложенных путей ===== */

/**
 * Скоуп-функция для вложенных переводов
 *
 * Поддерживает:
 * 1. Прямые дочерние ключи: t('title') → string
 * 2. Вложенные пути: t('details.title') → string
 * 3. Вложенные объекты: t('details') → ScopedT
 * 4. Массивы строк: t('risks') → string[]
 */
export type ScopedT<K extends string> = {
	// ✅ Вложенные пути (например, 'details.title', 'warning.message')
	<P extends NestedPaths<NodeValue<K>>>(
		path: P,
		opts?: StrOptions,
	): RelativeValue<NodeValue<K>, P> extends readonly string[]
		? string[]
		: RelativeValue<NodeValue<K>, P> extends string
			? string
			: RelativeValue<NodeValue<K>, P> extends object
				? ScopedT<`${K}.${P}`>
				: string
} & {
	// Узлы с returnObjects: true
	<C extends ChildNodeKeys<K>>(child: C, opts: ObjOptions): ValueAtPath<Res, `${K}.${C}`>
} & {
	// Узлы без opts или returnObjects: false → новый ScopedT
	<C extends ChildNodeKeys<K>>(child: C, opts?: StrOptions): ScopedT<`${K}.${C}`>
}

/** Узнаём «объект» безопасно в рантайме */
export const isObjectRecord = (x: unknown): x is Record<string, unknown> =>
	typeof x === 'object' && x !== null && !Array.isArray(x)

/** Упрощённый тип функции t */
export type CoreT = (key: string, opts?: TOptions) => unknown
