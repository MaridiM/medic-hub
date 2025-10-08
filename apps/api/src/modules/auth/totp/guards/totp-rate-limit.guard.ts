import { I18nService } from '@/core/i18n'
import { RedisService } from '@/core/redis'
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { MAX_ATTEMPTS, RATE_LIMIT_WINDOW } from '../constants'

export const TOTP_RATE_LIMIT = 'totp_rate_limit'

export interface TotpRateLimitOptions {
	maxAttempts: number
	windowMs: number
	action: string
}

interface GraphQLContext {
	req: {
		user?: {
			id: string
			email: string
		}
	}
}

/**
 * Guard для ограничения попыток TOTP операций
 */
@Injectable()
export class TotpRateLimitGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly redis: RedisService,
		private i18n: I18nService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const options = this.reflector.get<TotpRateLimitOptions>(TOTP_RATE_LIMIT, context.getHandler())

		if (!options) {
			return true // Нет ограничений
		}

		const ctx = GqlExecutionContext.create(context)
		const gqlContext = ctx.getContext<GraphQLContext>()
		const user = gqlContext.req.user

		if (!user) {
			return true // Не авторизован - пропускаем (проверит @Authorization)
		}

		const key = `totp:rate:${user.id}:${options.action}`

		// Получаем количество попыток
		const attemptsStr = await this.redis.get(key)
		const attempts = attemptsStr ? parseInt(attemptsStr, 10) : 0

		if (attempts >= options.maxAttempts) {
			const ttl = await this.redis.ttl(key)
			const minutesLeft = Math.ceil(ttl / 60)

			// Получаем переведенное сообщение
			const translatedMessage = this.i18n.t('totp.rate_limit_exceeded' as any, {
				args: { minutes: minutesLeft },
			})

			// Формируем финальное сообщение
			const message =
				typeof translatedMessage === 'string'
					? translatedMessage
					: `Too many attempts. Try again in ${minutesLeft} minutes`

			throw new HttpException(message, HttpStatus.TOO_MANY_REQUESTS)
		}

		return true
	}
}

/**
 * Декоратор для установки лимитов на TOTP операции
 *
 * @param action - Название действия (enable, disable, verify)
 * @param maxAttempts - Максимальное количество попыток (по умолчанию из констант)
 * @param windowMs - Окно времени в миллисекундах (по умолчанию из констант)
 *
 * @example
 * ```typescript
 * @SetTotpRateLimit('enable', 5, 300000)
 * async enableTotp() { ... }
 * ```
 */
export const SetTotpRateLimit = (
	action: string,
	maxAttempts: number = MAX_ATTEMPTS,
	windowMs: number = RATE_LIMIT_WINDOW * 1000, // Конвертируем секунды в миллисекунды
): MethodDecorator => {
	return <T>(
		target: object,
		propertyKey: string | symbol,
		descriptor: TypedPropertyDescriptor<T>,
	): TypedPropertyDescriptor<T> => {
		// Проверяем что descriptor.value существует (это метод)
		if (descriptor.value && typeof descriptor.value === 'function') {
			Reflect.defineMetadata(
				TOTP_RATE_LIMIT,
				{ maxAttempts, windowMs, action } as TotpRateLimitOptions,
				descriptor.value,
			)
		}

		return descriptor
	}
}
