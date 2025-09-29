/**
 * Типобезопасная обёртка над `Object.prototype.toString.call(v)`.
 * Нужна, чтобы избежать предупреждений `no-unsafe-return`/`no-unsafe-call` и
 * всегда возвращать строго `string`.
 *
 * @example
 * objectTag(123)            // "[object Number]"
 * objectTag(new Date())     // "[object Date]"
 */
export const objectTag = (v: unknown): string => {
	// call() действительно возвращает any — сузим тип локально
	const s = Object.prototype.toString.call(v) as string
	return s
}
