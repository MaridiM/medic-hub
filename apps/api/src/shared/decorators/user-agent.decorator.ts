import type { Request } from 'express'

import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const UserAgent = createParamDecorator((data: unknown, context: ExecutionContext) => {
	if (context.getType() === 'http') {
		const request = context.switchToHttp().getRequest<Request>()

		return request.headers['user-agent']
	} else {
		const ctx = GqlExecutionContext.create(context)
		const gqlContext = ctx.getContext<{ req?: Request }>()

		return gqlContext.req?.headers['user-agent'] ?? null
	}
})
