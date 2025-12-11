# File: modules\auth\verification\verification.resolver.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/verification/verification.resolver.ts`

## Category
Backend

## File Type
TS (verification.resolver.ts)

## Size
1447 characters, 37 lines

## Full Code

```typescript
import { RATE_LIMIT_VERIFICATION_EMAIL_POINTS, RATE_LIMIT_VERIFICATION_EMAIL_WINDOW_MS } from '@/core/config'
import { Lang, Language } from '@/core/i18n'
import { RateLimit } from '@/modules/security'
import { UserAgent } from '@/shared/decorators'
import type { GqlContext } from '@/shared/types'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { VerificationInput, VerificationResponse } from './dtos'
import { VerificationService } from './verification.service'

@Resolver('Verification')
export class VerificationResolver {
	constructor(private readonly verificationService: VerificationService) {}

	/**
	 * Send a verification email with a one-time token.
	 * The token is persisted and can be used to confirm the account.
	 */
	@RateLimit({
		points: RATE_LIMIT_VERIFICATION_EMAIL_POINTS,
		duration: RATE_LIMIT_VERIFICATION_EMAIL_WINDOW_MS,
		errorMessage: 'Too many verification email requests.',
	}) // ✅ 5 attempts per hour
	@Mutation(() => VerificationResponse, {
		name: 'verificationEmail',
		description: 'Send a verification email with a one-time token and return delivery/meta info.',
	})
	verificationEmail(
		@Context() { req }: GqlContext,
		@Args('data') input: VerificationInput,
		@UserAgent() userAgent: string,
		@Lang() lng: Language,
	): Promise<VerificationResponse> {
		return this.verificationService.verificationEmail(req, input, userAgent, lng)
	}
}

```

## Description

This file is part of the MedicHub API (NestJS) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.471Z*
