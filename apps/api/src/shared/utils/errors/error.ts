import { objectTag } from './tag'

/**
 * Тип JSON-примитива, который гарантированно сериализуем в строку без вложенных структур.
 */
type JsonPrimitive = string | number | boolean | null

/**
 * Узкий тайп-гарда для проверки, что значение — экземпляр Error.
 * @param x Любое значение неизвестного типа.
 * @returns true, если x — Error.
 */
function isError(x: unknown): x is Error {
	return x instanceof Error
}

/**
 * Тайп-гарда: является ли значение непустым объектом (Record).
 * Массивы и функции не исключаются — это ожидаемое поведение для JSON.stringify.
 * @param x Любое значение.
 * @returns true, если x — объект и не null.
 */
function isRecord(x: unknown): x is Record<string, unknown> {
	return typeof x === 'object' && x !== null
}

/**
 * Безопасно сериализует «что угодно» в строку для логов:
 * - Для `Error` формирует JSON c `name`, `message`, `stack` и рекурсивно сериализует `cause`;
 * - Для примитивов (string/number/boolean/null/undefined) возвращает строковое представление;
 * - Для объектов пытается `JSON.stringify` с защитой от циклов и поддержкой BigInt;
 * - В крайнем случае возвращает тег вида `"[object Something]"`.
 *
 * Гарантирует возвращаемый тип `string` и не использует небезопасных приведения типов.
 *
 * @param x Любое значение (обычно то, что пришло в `catch` как `unknown`).
 * @returns Строка, пригодная для логгирования.
 *
 * @example
 * serializeUnknown(new Error('boom'))
 * // => '{"name":"Error","message":"boom","stack":"..."}'
 *
 * serializeUnknown({ a: 1, self: ref })
 * // => '{"a":1,"self":"[Circular]"}'
 */
export function serializeUnknown(x: unknown): string {
	if (isError(x)) {
		const base: Record<string, JsonPrimitive> = {
			name: x.name,
			message: x.message,
			stack: x.stack ?? null,
		}
		const maybeCause = (x as { cause?: unknown }).cause
		if (typeof maybeCause !== 'undefined') {
			base.cause = serializeUnknown(maybeCause)
		}
		return JSON.stringify(base)
	}

	if (typeof x === 'string') return x
	if (typeof x === 'number') return `${x}`
	if (typeof x === 'boolean') return x ? 'true' : 'false'
	if (x === null) return 'null'
	if (x === undefined) return 'undefined'

	try {
		const json = JSON.stringify(x, createCycleReplacer())
		if (typeof json === 'string') return json
	} catch {
		// ignore
	}
	return objectTag(x) // ← всегда string, без no-unsafe-return
}

/**
 * Создаёт `replacer` для `JSON.stringify`, который:
 * 1) защищает от циклических ссылок, подставляя строку "[Circular]";
 * 2) сериализует BigInt как строку (по умолчанию JSON не умеет BigInt).
 *
 * Используется внутри `serializeUnknown` и `safeStringify`.
 *
 * @returns Функция-заменитель, совместимая с параметром `replacer` JSON.stringify.
 */
function createCycleReplacer() {
	const seen = new WeakSet<object>()
	return (_key: string, value: unknown) => {
		if (isRecord(value)) {
			if (seen.has(value)) return '[Circular]'
			seen.add(value)
		}
		if (typeof value === 'bigint') return value.toString()
		return value
	}
}

/**
 * Упрощённая версия безопасной сериализации для «обычных» значений.
 * Отличается от `serializeUnknown` тем, что не разбирает Error детально,
 * а пытается получить JSON-строку или отдаёт тег вида `"[object Something]"`.
 *
 * Полезно, когда не нужен подробный разбор ошибок, а достаточно «что-то логопригодное».
 *
 * @param x Любое значение.
 * @returns Строка (гарантированно).
 *
 * @example
 * safeStringify({a:1})         // '{"a":1}'
 * safeStringify(new Set([1]))  // '"[object Set]"' (если JSON не справился)
 */
export function safeStringify(x: unknown): string {
	if (typeof x === 'string') return x
	try {
		const json = JSON.stringify(x, createCycleReplacer()) // string | undefined
		if (typeof json === 'string') return json
	} catch {
		// ignore
	}
	return objectTag(x) // ← строго string
}
