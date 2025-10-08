import { Lang, Language } from '@/core/i18n'
import { Authorization, Authorized } from '@/shared/decorators'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@prisma/__generated__'

import { MAX_ATTEMPTS, RATE_LIMIT_ACTIONS, RATE_LIMIT_WINDOW } from './constants'
import { DisableTotpInput, EnableTotpInput, VerifyTotpInput } from './dtos'
import { SetTotpRateLimit, TotpRateLimitGuard } from './guards/totp-rate-limit.guard'
import { BackupCodesStatusModel, TotpEnabledModel, TotpModel } from './models'
import { TotpService } from './totp.service'

@Resolver('Totp')
export class TotpResolver {
	constructor(private readonly totpService: TotpService) {}

	@Authorization()
	@Query(() => TotpModel, {
		name: 'generateTotpSecret',
		description: 'Generate TOTP secret and QR code',
	})
	async generate(@Authorized() user: User, @Lang() lng: Language): Promise<TotpModel> {
		return this.totpService.generate(user, lng)
	}

	@Authorization()
	@UseGuards(TotpRateLimitGuard)
	@SetTotpRateLimit(RATE_LIMIT_ACTIONS.ENABLE, MAX_ATTEMPTS, RATE_LIMIT_WINDOW * 1000)
	@Mutation(() => TotpEnabledModel, {
		name: 'enableTotp',
		description: 'Enable TOTP two-factor authentication',
	})
	async enable(
		@Authorized() user: User,
		@Args('data') input: EnableTotpInput,
		@Lang() lng: Language,
	): Promise<TotpEnabledModel> {
		return this.totpService.enable(user, input, lng)
	}

	@Authorization()
	@UseGuards(TotpRateLimitGuard)
	@SetTotpRateLimit(RATE_LIMIT_ACTIONS.DISABLE, MAX_ATTEMPTS, RATE_LIMIT_WINDOW * 1000)
	@Mutation(() => Boolean, {
		name: 'disableTotp',
		description: 'Disable TOTP two-factor authentication',
	})
	async disable(
		@Authorized() user: User,
		@Args('data') input: DisableTotpInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.totpService.disable(user, input, lng)
	}

	@Authorization()
	@UseGuards(TotpRateLimitGuard)
	@SetTotpRateLimit(RATE_LIMIT_ACTIONS.VERIFY, MAX_ATTEMPTS, RATE_LIMIT_WINDOW * 1000)
	@Mutation(() => Boolean, {
		name: 'verifyTotp',
		description: 'Verify TOTP code',
	})
	async verify(
		@Authorized() user: User,
		@Args('data') input: VerifyTotpInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.totpService.verify(user, input.code, lng)
	}

	@Authorization()
	@Query(() => BackupCodesStatusModel, {
		name: 'totpBackupCodesStatus',
		description: 'Get backup codes status',
	})
	async getBackupCodesStatus(@Authorized() user: User, @Lang() lng: Language): Promise<BackupCodesStatusModel> {
		return this.totpService.getBackupCodesStatus(user, lng)
	}

	@Authorization()
	@Mutation(() => TotpEnabledModel, {
		name: 'regenerateTotpBackupCodes',
		description: 'Regenerate backup codes',
	})
	async regenerateBackupCodes(
		@Authorized() user: User,
		@Args('password') password: string,
		@Lang() lng: Language,
	): Promise<TotpEnabledModel> {
		return this.totpService.regenerateBackupCodes(user, password, lng)
	}
}
