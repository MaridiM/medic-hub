import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

/**
 * @description Получает язык из заголовка или fallback
 * @param data - данные
 * @param ctx - контекст
 * @returns язык
 * @example
 * @Controller('auth')
 * export class AuthController {
 *   @Get('hello')
 *   async hello(@Lang() lang: string) {
 *     return this.i18n.t('auth.hello', { lng: lang });
 *   }
 * }
 */

export const Lang = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
	const gqlCtx = GqlExecutionContext.create(ctx).getContext()
	const req = gqlCtx.req

	// Попробуем получить язык из заголовка или fallback
	return req.cookies.language || req.language || req.headers['accept-language']?.split(',')[0] || 'en'
})
