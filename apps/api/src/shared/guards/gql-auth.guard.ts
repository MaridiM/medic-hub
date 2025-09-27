import { DEFAULT_LANGUAGE, I18nService, PrismaService } from '@/core'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class GqlAuthGuard implements CanActivate {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly i18n: I18nService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const gqlContext = ctx.getContext<{ req: { session: { userId?: string }; language?: string; user?: any } }>()
		const request = gqlContext.req
		const lang = request.language || DEFAULT_LANGUAGE

		const user_not_authorized = this.i18n.t('common.user_not_authorized', { lng: lang }) as string

		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException(user_not_authorized)
		}

		const user = await this.prismaService.user.findUnique({
			where: { id: request.session.userId },
		})

		if (!user) {
			throw new UnauthorizedException(user_not_authorized)
		}

		request.user = user

		return true
	}
}
