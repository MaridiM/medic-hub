# File: modules\auth\2fa\resolvers\2fa.resolver.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/resolvers/2fa.resolver.ts`

## Category
Backend

## File Type
TS (2fa.resolver.ts)

## Size
20826 characters, 705 lines

## Full Code

```typescript
import { RATE_LIMIT_2FA_POINTS, RATE_LIMIT_2FA_WINDOW_MS } from '@/core/config'
import { I18nService, Lang, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RateLimit } from '@/modules/security'
import { Authorization, Authorized } from '@/shared/decorators'
import type { GqlContext } from '@/shared/types'
import { getSessionMetadata } from '@/shared/utils'
import { BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { E2FAMethod, type User } from '@prisma/__generated__'

import {
	CompleteTotpSetupInput,
	CompleteWebAuthnAuthenticationInput,
	CompleteWebAuthnRegistrationInput,
	GenerateTotpSetupInput,
	RegenerateBackupCodesInput,
	Remove2FAMethodInput,
	RemoveWebAuthnCredentialInput,
	SendOtpCodeInput,
	SetupOtpInput,
	StartWebAuthnAuthenticationInput,
	StartWebAuthnRegistrationInput,
	Update2FAMethodInput,
	Verify2FAInput,
	VerifyBackupCodeInput,
	VerifyOtpSetupInput,
} from '../dtos'
import { Require2FAVerification, TwoFactorVerifiedGuard } from '../guards'
import {
	BackupCodesRegeneratedModel,
	BackupCodesStatusModel,
	OtpSetupModel,
	TotpSetupModel,
	TwoFactorMethodModel,
	TwoFactorMethodsListModel,
	TwoFactorSetupCompleteModel,
	TwoFactorSuccessModel,
	WebAuthnAuthenticationCompleteModel,
	WebAuthnAuthenticationOptionsModel,
	WebAuthnCredentialModel,
	WebAuthnRegistrationCompleteModel,
	WebAuthnRegistrationOptionsModel,
} from '../models'
import {
	BackupCodeService,
	DeviceTrustService,
	SecurityEventService,
	TwoFactorMethodService,
	WebAuthnService,
} from '../services'
import { ITotpMethodData } from '../types'

/**
 * GraphQL Resolver for 2FA operations
 * Provides complete API for Two-Factor Authentication management
 */
@Resolver('TwoFactor')
export class TwoFactorResolver {
	constructor(
		private readonly prisma: PrismaService,
		private readonly i18n: I18nService,
		private readonly twoFactorService: TwoFactorMethodService,
		private readonly backupCodeService: BackupCodeService,
		private readonly deviceTrustService: DeviceTrustService,
		private readonly securityEventService: SecurityEventService,
		private readonly webauthnService: WebAuthnService,
	) {}

	// ==================== TOTP Operations ====================

	/**
	 * Generate TOTP setup (QR code + manual entry key)
	 * Step 1 of TOTP setup flow
	 */
	@Authorization()
	@Query(() => TotpSetupModel, {
		name: 'generateTotpSetup',
		description: 'Generate TOTP QR code and secret for setup',
	})
	async generateTotpSetup(
		@Authorized() user: User,
		@Args('data', { nullable: true }) input: GenerateTotpSetupInput = {},
		@Lang() lng: Language,
	): Promise<TotpSetupModel> {
		return this.twoFactorService.generateTotpSetup(user, input.name, lng)
	}

	/**
	 * Complete TOTP setup after scanning QR code
	 * Step 2 of TOTP setup flow (final step)
	 */
	@Authorization()
	@Mutation(() => TwoFactorSetupCompleteModel, {
		name: 'completeTotpSetup',
		description: 'Complete TOTP setup by verifying code and receive backup codes',
	})
	async completeTotpSetup(
		@Authorized() user: User,
		@Args('data') input: CompleteTotpSetupInput,
		@Lang() lng: Language,
	): Promise<TwoFactorSetupCompleteModel> {
		return this.twoFactorService.completeTotpSetup(user, input, lng)
	}

	// ==================== OTP Operations ====================

	/**
	 * Setup OTP method (Email or SMS)
	 * Step 1 of OTP setup flow
	 */
	@Authorization()
	@Mutation(() => OtpSetupModel, {
		name: 'setupOtp',
		description: 'Setup OTP method (Email or SMS)',
	})
	async setupOtp(
		@Authorized() user: User,
		@Args('data') input: SetupOtpInput,
		@Lang() lng: Language,
	): Promise<OtpSetupModel> {
		return this.twoFactorService.setupOtp(user, input, lng)
	}

	/**
	 * Send OTP code to user
	 * Step 2a of OTP setup flow (can be repeated)
	 */
	@Authorization()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'sendOtpCode',
		description: 'Send OTP verification code',
	})
	async sendOtpCode(
		@Authorized() user: User,
		@Args('data', { nullable: true }) input: SendOtpCodeInput = {},
		@Lang() lng: Language,
	): Promise<TwoFactorSuccessModel> {
		return this.twoFactorService.sendOtpCode(user, input, lng)
	}

	/**
	 * Verify OTP code during setup
	 * Step 2b of OTP setup flow (final step)
	 */
	@Authorization()
	@Mutation(() => TwoFactorSetupCompleteModel, {
		name: 'verifyOtpSetup',
		description: 'Verify OTP code during setup and receive backup codes',
	})
	async verifyOtpSetup(
		@Authorized() user: User,
		@Args('data') input: VerifyOtpSetupInput,
		@Lang() lng: Language,
	): Promise<TwoFactorSetupCompleteModel> {
		return this.twoFactorService.verifyOtpSetup(user, input, lng)
	}

	// ==================== Universal Verification ====================

	/**
	 * Verify 2FA code (works for TOTP, OTP, or backup codes)
	 * Used during login or for sensitive operations
	 */
	@RateLimit({
		points: RATE_LIMIT_2FA_POINTS,
		duration: RATE_LIMIT_2FA_WINDOW_MS,
		errorMessage: 'Too many 2FA verification attempts.',
	}) // ✅ 5 attempts per 5 minutes
	@Authorization()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'verify2FA',
		description: 'Verify 2FA code (TOTP/OTP/backup code)',
	})
	async verify2FA(
		@Authorized() user: User,
		@Args('data') input: Verify2FAInput,
		@Context() context: GqlContext,
		@Lang() lng: Language,
	): Promise<TwoFactorSuccessModel> {
		const session = getSessionMetadata(context.req, context.req.headers['user-agent'] || 'Unknown')

		// Determine if code is backup code (8 chars) or regular (6 digits)
		const isBackupCode = /^[A-F0-9]{8}$/i.test(input.code)

		if (isBackupCode) {
			// --- Handle Backup Code Verification ---
			const method = input.methodId
				? await this.twoFactorService['prisma'].authenticationMethod.findUnique({
						where: { id: input.methodId },
					})
				: await this.twoFactorService['prisma'].authenticationMethod.findFirst({
						where: { userId: user.id, isPrimary: true },
					})

			if (!method) {
				throw new BadRequestException(
					this.i18n.t('auth.errors.2fa.method_not_found', { lng, defaultValue: '2FA method not found' }),
				)
			}

			try {
				await this.backupCodeService.verifyBackupCode(user, input.code, method.method, lng, session.ip)
				await this.securityEventService.log2FASuccess(user.id, 'BACKUP_CODE', session)
			} catch (error) {
				await this.securityEventService.log2FAFailed(user.id, 'BACKUP_CODE', session, 1)
				throw error
			}
		} else {
			// --- Handle TOTP/OTP Code Verification ---
			const method = input.methodId
				? await this.prisma.authenticationMethod.findFirst({
						where: { id: input.methodId, userId: user.id },
					})
				: await this.prisma.authenticationMethod.findFirst({
						where: { userId: user.id, isPrimary: true },
					})

			if (!method) {
				throw new BadRequestException(
					this.i18n.t('auth.errors.2fa.method_not_found', { lng, defaultValue: '2FA method not found' }),
				)
			}

			let isCodeValid = false

			switch (method.method) {
				case E2FAMethod.TOTP: {
					const totpData = method.data as unknown as ITotpMethodData
					isCodeValid = this.twoFactorService.verifyTotpCode(user.email, totpData.secret, input.code)
					break
				}

				case E2FAMethod.OTP_EMAIL:
				case E2FAMethod.OTP_SMS: {
					isCodeValid = await this.twoFactorService.verifyOneTimeCode(user.id, method.id, input.code, lng)
					break
				}

				default: {
					throw new BadRequestException(
						`Verification for method type ${method.method} is not supported here.`,
					)
				}
			}

			if (!isCodeValid) {
				await this.securityEventService.log2FAFailed(user.id, method.method, session, 1)
				throw new UnauthorizedException(
					this.i18n.t('auth.errors.2fa.invalid_code', { lng, defaultValue: 'Invalid 2FA code' }),
				)
			}

			await this.securityEventService.log2FASuccess(user.id, method.method, session)

			// For now, return success
			await this.securityEventService.log2FASuccess(user.id, method.method, session)
		}

		// If trustDevice is true, register device as trusted
		if (input.trustDevice) {
			const deviceId = await this.deviceTrustService.registerDevice(user.id, session, lng)
			await this.deviceTrustService.trustDevice(user.id, deviceId)
		}

		// Update session as 2FA verified
		const sessionToken = context.req.cookies?.sessionToken
		if (sessionToken) {
			await this.twoFactorService['prisma'].session.updateMany({
				where: { token: sessionToken, userId: user.id },
				data: {
					is2FAVerified: true,
					verified2FAAt: new Date(),
				},
			})
		}

		return {
			success: true,
			message: '2FA verified successfully',
		}
	}

	/**
	 * Verify backup code explicitly
	 */
	@Authorization()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'verifyBackupCode',
		description: 'Verify backup recovery code',
	})
	async verifyBackupCode(
		@Authorized() user: User,
		@Args('data') input: VerifyBackupCodeInput,
		@Context() context: GqlContext,
		@Lang() lng: Language,
	): Promise<TwoFactorSuccessModel> {
		const session = getSessionMetadata(context.req, context.req.headers['user-agent'] || 'Unknown')

		const method = input.methodId
			? await this.twoFactorService['prisma'].authenticationMethod.findUnique({
					where: { id: input.methodId },
				})
			: await this.twoFactorService['prisma'].authenticationMethod.findFirst({
					where: { userId: user.id, isPrimary: true },
				})

		if (!method) {
			throw new Error('2FA method not found')
		}

		await this.backupCodeService.verifyBackupCode(user, input.backupCode, method.method, lng)
		await this.securityEventService.log2FASuccess(user.id, 'BACKUP_CODE', session)

		return {
			success: true,
			message: 'Backup code verified successfully',
		}
	}

	// ==================== Method Management ====================

	/**
	 * Get all user's 2FA methods
	 */
	@Authorization()
	@Query(() => TwoFactorMethodsListModel, {
		name: 'my2FAMethods',
		description: "Get user's 2FA methods",
	})
	async getMy2FAMethods(@Authorized() user: User): Promise<TwoFactorMethodsListModel> {
		return this.twoFactorService.getUserMethods(user.id)
	}

	/**
	 * Update 2FA method
	 */
	@Authorization()
	@UseGuards(TwoFactorVerifiedGuard)
	@Require2FAVerification()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'update2FAMethod',
		description: 'Update 2FA method (name, primary status, etc.)',
	})
	async update2FAMethod(
		@Authorized() user: User,
		@Args('data') input: Update2FAMethodInput,
		@Lang() lng: Language,
	): Promise<TwoFactorSuccessModel> {
		return this.twoFactorService.updateMethod(user.id, input, lng)
	}

	/**
	 * Remove 2FA method
	 */
	@Authorization()
	@UseGuards(TwoFactorVerifiedGuard)
	@Require2FAVerification()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'remove2FAMethod',
		description: 'Remove 2FA method (requires password confirmation)',
	})
	async remove2FAMethod(
		@Authorized() user: User,
		@Args('data') input: Remove2FAMethodInput,
		@Lang() lng: Language,
	): Promise<TwoFactorSuccessModel> {
		return this.twoFactorService.removeMethod(user, input, lng)
	}

	// ==================== Backup Codes ====================

	/**
	 * Get backup codes status
	 */
	@Authorization()
	@Query(() => BackupCodesStatusModel, {
		name: 'backupCodesStatus',
		description: 'Get status of backup codes',
	})
	async getBackupCodesStatus(
		@Authorized() user: User,
		@Args('methodId', { nullable: true }) methodId?: string,
	): Promise<BackupCodesStatusModel> {
		const method = methodId
			? await this.twoFactorService['prisma'].authenticationMethod.findUnique({
					where: { id: methodId },
				})
			: await this.twoFactorService['prisma'].authenticationMethod.findFirst({
					where: { userId: user.id, isPrimary: true },
				})

		if (!method) {
			throw new Error('2FA method not found')
		}

		const status = await this.backupCodeService.getBackupCodesStatus(user.id, method.method)

		return {
			total: status.total,
			used: status.used,
			remaining: status.remaining,
			expired: status.expired,
			isLow: status.remaining <= 3,
		}
	}

	/**
	 * Regenerate backup codes
	 */
	@Authorization()
	@UseGuards(TwoFactorVerifiedGuard)
	@Require2FAVerification()
	@Mutation(() => BackupCodesRegeneratedModel, {
		name: 'regenerateBackupCodes',
		description: 'Regenerate backup codes (requires password)',
	})
	async regenerateBackupCodes(
		@Authorized() user: User,
		@Args('data') input: RegenerateBackupCodesInput,
		@Lang() lng: Language,
	): Promise<BackupCodesRegeneratedModel> {
		return this.twoFactorService.regenerateBackupCodes(user, input, lng)
	}

	// ==================== Device Trust ====================

	/**
	 * Get trusted devices
	 */
	@Authorization()
	@Query(() => [TwoFactorMethodModel], {
		name: 'myTrustedDevices',
		description: "Get user's trusted devices",
	})
	async getMyTrustedDevices(@Authorized() user: User) {
		const devices = await this.deviceTrustService.getUserDevices(user.id)
		return devices.map(d => ({
			id: d.id,
			deviceId: d.deviceId,
			name: d.name,
			browser: d.browser,
			os: d.os,
			device: d.device,
			trustScore: d.trustScore,
			lastCountry: d.lastCountry,
			lastCity: d.lastCity,
			isActive: d.isActive,
			lastSeenAt: d.lastSeenAt,
			expiresAt: d.expiresAt,
			createdAt: d.createdAt,
		}))
	}

	/**
	 * Revoke device trust
	 */
	@Authorization()
	@UseGuards(TwoFactorVerifiedGuard)
	@Require2FAVerification()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'revokeDeviceTrust',
		description: 'Revoke trust for a device',
	})
	async revokeDeviceTrust(
		@Authorized() user: User,
		@Args('deviceId') deviceId: string,
	): Promise<TwoFactorSuccessModel> {
		await this.deviceTrustService.revokeDevice(user.id, deviceId)
		return {
			success: true,
			message: 'Device trust revoked successfully',
		}
	}

	// ==================== Utility ====================

	/**
	 * Check if user has 2FA enabled
	 */
	@Authorization()
	@Query(() => Boolean, {
		name: 'is2FAEnabled',
		description: 'Check if user has 2FA enabled',
	})
	async is2FAEnabled(@Authorized() user: User): Promise<boolean> {
		const userData = await this.twoFactorService['prisma'].user.findUnique({
			where: { id: user.id },
			select: { is2FAEnabled: true },
		})
		return userData?.is2FAEnabled || false
	}

	/**
	 * Check if current session is 2FA verified
	 */
	@Authorization()
	@Query(() => Boolean, {
		name: 'isSession2FAVerified',
		description: 'Check if current session is 2FA verified',
	})
	async isSession2FAVerified(@Context() context: GqlContext): Promise<boolean> {
		const sessionToken = context.req.cookies?.sessionToken
		if (!sessionToken) return false

		const session = await this.twoFactorService['prisma'].session.findUnique({
			where: { token: sessionToken },
			select: { is2FAVerified: true },
		})

		return session?.is2FAVerified || false
	}

	// ==================== WebAuthn Operations ====================

	/**
	 * Start WebAuthn registration process
	 */
	@Authorization()
	@Mutation(() => WebAuthnRegistrationOptionsModel, {
		name: 'startWebAuthnRegistration',
		description: 'Generate WebAuthn registration options for adding a security key or passkey',
	})
	async startWebAuthnRegistration(
		@Authorized() user: User,
		@Args('data', { nullable: true }) input: StartWebAuthnRegistrationInput = {},
		@Lang() lng: Language,
	): Promise<WebAuthnRegistrationOptionsModel> {
		const { challengeId, options } = await this.webauthnService.generateRegistrationOptions(
			user,
			input.authenticatorAttachment,
			lng,
		)

		return {
			challengeId,
			options, // Type conversion for GraphQL
			rpName: options.rp.name,
			rpId: options.rp.id,
			userDisplayName: options.user.displayName,
		}
	}

	/**
	 * Complete WebAuthn registration
	 */
	@Authorization()
	@Mutation(() => WebAuthnRegistrationCompleteModel, {
		name: 'completeWebAuthnRegistration',
		description: 'Verify and save WebAuthn credential',
	})
	async completeWebAuthnRegistration(
		@Authorized() user: User,
		@Args('data') input: CompleteWebAuthnRegistrationInput,
		@Lang() lng: Language,
	): Promise<WebAuthnRegistrationCompleteModel> {
		const result = await this.webauthnService.verifyRegistrationResponse(
			user,
			input.challengeId,
			input.response,
			input.authenticatorName,
			lng,
		)

		// Get credential details
		const method = await this.prisma.authenticationMethod.findUnique({
			where: { credentialId: result.credentialId },
		})

		const data = method?.data as any

		return {
			success: result.success,
			methodId: result.methodId,
			credentialId: result.credentialId,
			authenticatorName: input.authenticatorName,
			isPlatform: method?.method === 'PASSKEY',
			isBackedUp: data?.backedUp || false,
			backupCodes: result.backupCodes,
			message: this.i18n.t('auth.success.2fa.webauthn_registered', {
				lng,
				defaultValue: 'Security key registered successfully',
			}),
		}
	}

	/**
	 * Start WebAuthn authentication
	 */
	@Query(() => WebAuthnAuthenticationOptionsModel, {
		name: 'startWebAuthnAuthentication',
		description: 'Generate WebAuthn authentication options',
	})
	async startWebAuthnAuthentication(
		@Args('data', { nullable: true }) input: StartWebAuthnAuthenticationInput = {},
		@Context() context: GqlContext,
	): Promise<WebAuthnAuthenticationOptionsModel> {
		// Try to get user ID from session or input
		const userId =
			context.req.user?.id ||
			(input.email
				? (
						await this.prisma.user.findUnique({
							where: { email: input.email },
							select: { id: true },
						})
					)?.id
				: undefined)

		const { challengeId, options, credentialCount } = await this.webauthnService.generateAuthenticationOptions(
			userId,
			input.credentialId,
		)

		return {
			challengeId,
			options,
			rpId: options.rpId,
			credentialCount,
		}
	}

	/**
	 * Complete WebAuthn authentication
	 */
	@Mutation(() => WebAuthnAuthenticationCompleteModel, {
		name: 'completeWebAuthnAuthentication',
		description: 'Verify WebAuthn authentication response',
	})
	async completeWebAuthnAuthentication(
		@Args('data') input: CompleteWebAuthnAuthenticationInput,
		@Context() context: GqlContext,
		@Lang() lng: Language,
	): Promise<WebAuthnAuthenticationCompleteModel> {
		const result = await this.webauthnService.verifyAuthenticationResponse(input.challengeId, input.response, lng)

		// Get credential details
		const method = await this.prisma.authenticationMethod.findUnique({
			where: { credentialId: result.credentialId },
			select: { name: true, data: true },
		})

		// Mark session as 2FA verified
		const sessionToken = context.req.cookies?.sessionToken
		if (sessionToken) {
			await this.prisma.session.updateMany({
				where: { token: sessionToken, userId: result.userId },
				data: {
					is2FAVerified: true,
					verified2FAAt: new Date(),
				},
			})
		}

		const data = method?.data as any

		return {
			success: result.success,
			credentialId: result.credentialId,
			authenticatorName: method?.name,
			counter: data?.counter || 0,
			message: this.i18n.t('auth.success.2fa.webauthn_verified', {
				lng,
				defaultValue: 'Authentication successful',
			}),
		}
	}

	/**
	 * Get user's WebAuthn credentials
	 */
	@Authorization()
	@Query(() => [WebAuthnCredentialModel], {
		name: 'myWebAuthnCredentials',
		description: "Get user's registered WebAuthn credentials",
	})
	async getMyWebAuthnCredentials(@Authorized() user: User): Promise<WebAuthnCredentialModel[]> {
		return this.webauthnService.getUserCredentials(user.id)
	}

	/**
	 * Remove WebAuthn credential
	 */
	@Authorization()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'removeWebAuthnCredential',
		description: 'Remove a WebAuthn credential',
	})
	async removeWebAuthnCredential(
		@Authorized() user: User,
		@Args('data') input: RemoveWebAuthnCredentialInput,
		@Lang() lng: Language,
	): Promise<TwoFactorSuccessModel> {
		await this.webauthnService.removeCredential(user, input.credentialId, input.password, lng)

		return {
			success: true,
			message: this.i18n.t('auth.success.2fa.credential_removed', {
				lng,
				defaultValue: 'Security key removed successfully',
			}),
		}
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.154Z*
