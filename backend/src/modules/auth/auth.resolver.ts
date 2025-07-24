import { Query, Resolver } from '@nestjs/graphql'

import { AuthService } from './auth.service'

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Query(() => String, { name: 'ping' })
	ping() {
		return 'pong'
	}
}
