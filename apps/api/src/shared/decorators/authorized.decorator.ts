import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { User } from '@prisma/__generated__'

export const Authorized = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
	let user: User

	if (ctx.getType() === 'http') {
		const req = ctx.switchToHttp().getRequest<{ user: User }>()
		user = req.user
	} else {
		const context = GqlExecutionContext.create(ctx)
		const gqlContext = context.getContext<{ req: { user: User } }>()
		user = gqlContext.req.user

		if (!user) return null
	}

	return data ? user[data] : user
})
