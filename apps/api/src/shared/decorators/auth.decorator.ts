import { applyDecorators, UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from '../guards'

export function Authorization() {
	return applyDecorators(UseGuards(GqlAuthGuard))
}
