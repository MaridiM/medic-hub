import { I18nService } from '@/core/i18n'
import { RedisService } from '@/core/redis'
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { OTP_MAX_REQUESTS_PER_HOUR, OTP_RATE_LIMIT_WINDOW } from '../constants'

export const OTP_RATE_LIMIT = 'otp_rate_limit'

export interface OtpRateLimitOptions {
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

@Injectable()
export class OtpRateLimitGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly redis: RedisService,
		private i18n: I18nService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const options = this.reflector.get<OtpRateLimitOptions>(OTP_RATE_LIMIT, context.getHandler())

		if (!options) {
			return true
		}

		const ctx = GqlExecutionContext.create(context)
		const gqlContext = ctx.getContext<GraphQLContext>()
		const user = gqlContext.req.user

		if (!user) {
			return true
		}

		const key = `otp:rate:${user.id}:${options.action}`
		const attemptsStr = await this.redis.get(key)
		const attempts = attemptsStr ? parseInt(attemptsStr, 10) : 0

		if (attempts >= options.maxAttempts) {
			const ttl = await this.redis.ttl(key)
			const minutesLeft = Math.ceil(ttl / 60)

			const translatedMessage = this.i18n.t('otp.rate_limit_exceeded' as any, {
				args: { minutes: minutesLeft },
			})

			const message =
				typeof translatedMessage === 'string'
					? translatedMessage
					: `Too many attempts. Try again in ${minutesLeft} minutes`

			throw new HttpException(message, HttpStatus.TOO_MANY_REQUESTS)
		}

		return true
	}
}

export const SetOtpRateLimit = (
	action: string,
	maxAttempts: number = OTP_MAX_REQUESTS_PER_HOUR,
	windowMs: number = OTP_RATE_LIMIT_WINDOW * 1000,
): MethodDecorator => {
	return <T>(
		target: object,
		propertyKey: string | symbol,
		descriptor: TypedPropertyDescriptor<T>,
	): TypedPropertyDescriptor<T> => {
		if (descriptor.value && typeof descriptor.value === 'function') {
			Reflect.defineMetadata(
				OTP_RATE_LIMIT,
				{ maxAttempts, windowMs, action } as OtpRateLimitOptions,
				descriptor.value,
			)
		}

		return descriptor
	}
}
