import { Logger } from '@nestjs/common'

import { safeStringify } from './error'

/**
 * Логирует ошибку неизвестного типа в формате, корректном для Nest `Logger`.
 *
 * - Если `err` — экземпляр `Error`, стек передаётся **отдельным аргументом**,
 *   чтобы логгер отформатировал его нативно (со стэктрейсом).
 * - Если `err` не `Error` (строка, число, объект, `null`/`undefined` и т.п.),
 *   значение сериализуется через `safeStringify` (c защитой от циклов/BigInt).
 *
 * @param logger  Экземпляр Nest `Logger` (например, `new Logger(RedisService.name)`).
 * @param prefix  Короткий префикс/сообщение (контекст ошибки), например: `"Redis connect error"`.
 * @param err     Любое значение из `catch` (тип `unknown`).
 * @param context Необязательный контекст для Nest Logger (обычно имя класса/сервиса).
 *
 * @example
 * const logger = new Logger(RedisService.name)
 * try {
 *   await client.connect()
 * } catch (e) {
 *   logUnknownError(logger, 'Redis connect error', e, RedisService.name)
 * }
 *
 * // Вывод:
 * // [Error] Redis connect error
 * // <stack trace>  // если err instanceof Error
 * //
 * // или
 * // Redis connect error: {"foo":"bar"}  // для произвольных значений
 */
export function logUnknownError(logger: Logger, prefix: string, err: unknown, context?: string): void {
	if (err instanceof Error) {
		logger.error(prefix, err.stack, context)
	} else {
		logger.error(`${prefix}: ${safeStringify(err)}`, undefined, context)
	}
}
