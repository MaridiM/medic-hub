import { Lang, Language } from '@/core/i18n'
import { Authorization, Authorized } from '@/shared/decorators'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@prisma/__generated__'

import { OTP_MAX_REQUESTS_PER_HOUR, OTP_RATE_LIMIT_ACTIONS, OTP_RATE_LIMIT_WINDOW } from './constants'
import { DisableOtpInput, EnableOtpInput, SendOtpInput, VerifyBackupCodeInput, VerifyOtpInput } from './dtos'
import { OtpRateLimitGuard, SetOtpRateLimit } from './guards/otp-rate-limit.guard'
import { OtpBackupCodesStatusModel, OtpEnabledModel, OtpSentModel } from './models'
import { OtpService } from './otp.service'

@Resolver('Otp')
export class OtpResolver {
	constructor(private readonly otpService: OtpService) {}

	@Authorization()
	@UseGuards(OtpRateLimitGuard)
	@SetOtpRateLimit(OTP_RATE_LIMIT_ACTIONS.ENABLE, OTP_MAX_REQUESTS_PER_HOUR, OTP_RATE_LIMIT_WINDOW * 1000)
	@Mutation(() => OtpEnabledModel, {
		name: 'enableOtp',
		description: 'Enable OTP two-factor authentication',
	})
	async enable(
		@Authorized() user: User,
		@Args('data') input: EnableOtpInput,
		@Lang() lng: Language,
	): Promise<OtpEnabledModel> {
		return this.otpService.enable(user, input, lng)
	}

	@Authorization()
	@UseGuards(OtpRateLimitGuard)
	@SetOtpRateLimit(OTP_RATE_LIMIT_ACTIONS.DISABLE, OTP_MAX_REQUESTS_PER_HOUR, OTP_RATE_LIMIT_WINDOW * 1000)
	@Mutation(() => Boolean, {
		name: 'disableOtp',
		description: 'Disable OTP two-factor authentication',
	})
	async disable(
		@Authorized() user: User,
		@Args('data') input: DisableOtpInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.otpService.disable(user, input, lng)
	}

	@Authorization()
	@UseGuards(OtpRateLimitGuard)
	@SetOtpRateLimit(OTP_RATE_LIMIT_ACTIONS.SEND, OTP_MAX_REQUESTS_PER_HOUR, OTP_RATE_LIMIT_WINDOW * 1000)
	@Mutation(() => OtpSentModel, {
		name: 'sendOtp',
		description: 'Send OTP code via email or SMS',
	})
	async send(
		@Authorized() user: User,
		@Args('data') input: SendOtpInput,
		@Lang() lng: Language,
	): Promise<OtpSentModel> {
		return this.otpService.send(user, input, lng)
	}

	@Authorization()
	@UseGuards(OtpRateLimitGuard)
	@SetOtpRateLimit(OTP_RATE_LIMIT_ACTIONS.VERIFY, OTP_MAX_REQUESTS_PER_HOUR, OTP_RATE_LIMIT_WINDOW * 1000)
	@Mutation(() => Boolean, {
		name: 'verifyOtp',
		description: 'Verify OTP code',
	})
	async verify(
		@Authorized() user: User,
		@Args('data') input: VerifyOtpInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.otpService.verify(user, input, lng)
	}

	@Authorization()
	@Mutation(() => Boolean, {
		name: 'verifyOtpBackupCode',
		description: 'Verify OTP backup code',
	})
	async verifyBackupCode(
		@Authorized() user: User,
		@Args('data') input: VerifyBackupCodeInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.otpService.verifyBackupCode(user, input.backupCode, lng)
	}

	@Authorization()
	@Query(() => OtpBackupCodesStatusModel, {
		name: 'otpBackupCodesStatus',
		description: 'Get OTP backup codes status',
	})
	async getBackupCodesStatus(@Authorized() user: User, @Lang() lng: Language): Promise<OtpBackupCodesStatusModel> {
		return this.otpService.getBackupCodesStatus(user, lng)
	}

	@Authorization()
	@Mutation(() => OtpEnabledModel, {
		name: 'regenerateOtpBackupCodes',
		description: 'Regenerate OTP backup codes',
	})
	async regenerateBackupCodes(
		@Authorized() user: User,
		@Args('password') password: string,
		@Lang() lng: Language,
	): Promise<OtpEnabledModel> {
		return this.otpService.regenerateBackupCodes(user, password, lng)
	}
}
