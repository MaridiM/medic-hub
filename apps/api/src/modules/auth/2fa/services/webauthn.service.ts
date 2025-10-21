import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { HashUtil } from '@/shared/utils'
import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { E2FAMethod, ESecurityEvent, ESecuritySeverity, Prisma, type User } from '@prisma/__generated__'
import {
	generateAuthenticationOptions,
	generateRegistrationOptions,
	type VerifiedAuthenticationResponse,
	type VerifiedRegistrationResponse,
	verifyAuthenticationResponse,
	verifyRegistrationResponse,
} from '@simplewebauthn/server'
import type {
	AuthenticationResponseJSON,
	AuthenticatorTransportFuture,
	RegistrationResponseJSON,
} from '@simplewebauthn/typescript-types'

import { REDIS_KEYS, WEBAUTHN_CONFIG, WEBAUTHN_RP, WEBAUTHN_STORAGE } from '../constants'
import type { IPasskeyMethodData, IWebAuthnMethodData } from '../types'

import { BackupCodeService } from './backup-code.service'
import { SecurityEventService } from './security-event.service'

/**
 * Service handling WebAuthn/FIDO2 operations for passwordless authentication
 * and hardware security keys support.
 */
@Injectable()
export class WebAuthnService extends CoreService {
	private readonly logger = new Logger(WebAuthnService.name)

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly backupCodeService: BackupCodeService,
		private readonly securityEventService: SecurityEventService,
	) {
		super({ i18n, prisma, redis })
	}

	/**
	 * Generate registration options for new WebAuthn credential
	 */
	async generateRegistrationOptions(
		user: User,
		authenticatorAttachment?: 'platform' | 'cross-platform',
		lng: Language = 'en',
	): Promise<{
		challengeId: string
		options: any // Use any for GraphQL compatibility
	}> {
		// Check credential limit
		const credentialCount = await this.prisma.authenticationMethod.count({
			where: {
				userId: user.id,
				method: { in: [E2FAMethod.WEBAUTHN, E2FAMethod.PASSKEY] },
				isActive: true,
			},
		})

		if (credentialCount >= WEBAUTHN_STORAGE.MAX_CREDENTIALS_PER_USER) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.max_credentials', {
					lng,
					max: WEBAUTHN_STORAGE.MAX_CREDENTIALS_PER_USER,
					defaultValue: `Maximum ${WEBAUTHN_STORAGE.MAX_CREDENTIALS_PER_USER} credentials allowed`,
				}),
			)
		}

		// Get existing credentials to exclude
		const existingCredentials = await this.prisma.authenticationMethod.findMany({
			where: {
				userId: user.id,
				method: { in: [E2FAMethod.WEBAUTHN, E2FAMethod.PASSKEY] },
				credentialId: { not: null },
			},
			select: { credentialId: true },
		})

		// Format exclude credentials properly
		const excludeCredentials = existingCredentials
			.filter(c => c.credentialId)
			.map(c => ({
				id: c.credentialId,
				transports: ['usb', 'nfc', 'ble', 'internal'] as AuthenticatorTransportFuture[],
			}))

		// Generate registration options
		const options = await generateRegistrationOptions({
			rpName: WEBAUTHN_RP.NAME,
			rpID: WEBAUTHN_RP.ID,
			userID: Buffer.from(user.id, 'utf-8'), // Convert string to Uint8Array
			userName: user.email,
			userDisplayName: user.fullName || user.email,
			timeout: WEBAUTHN_CONFIG.CREDENTIAL_PARAMS.TIMEOUT,
			excludeCredentials,
			authenticatorSelection: {
				authenticatorAttachment,
				residentKey: WEBAUTHN_CONFIG.AUTHENTICATOR_SELECTION.RESIDENT_KEY,
				userVerification: WEBAUTHN_CONFIG.AUTHENTICATOR_SELECTION.USER_VERIFICATION,
			},
		})

		// Store challenge in Redis
		const challengeId = this.generateChallengeId()
		const challengeKey = REDIS_KEYS.WEBAUTHN_CHALLENGE(challengeId)

		await this.rSetJSON(
			challengeKey,
			{
				userId: user.id,
				challenge: options.challenge,
				type: 'registration',
				createdAt: new Date().toISOString(),
			},
			WEBAUTHN_STORAGE.CHALLENGE_TTL,
		)

		this.logger.log(`Generated WebAuthn registration options for user ${user.id}`)

		return { challengeId, options }
	}

	/**
	 * Verify registration response and save credential
	 */
	async verifyRegistrationResponse(
		user: User,
		challengeId: string,
		response: RegistrationResponseJSON,
		authenticatorName?: string,
		lng: Language = 'en',
	): Promise<{
		success: boolean
		methodId: string
		credentialId: string
		backupCodes: string[]
	}> {
		// Get challenge from Redis
		const challengeKey = REDIS_KEYS.WEBAUTHN_CHALLENGE(challengeId)
		const challengeData = await this.rGetJSON<{
			userId: string
			challenge: string
			type: string
		}>(challengeKey)

		if (!challengeData || challengeData.userId !== user.id || challengeData.type !== 'registration') {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.invalid_challenge', {
					lng,
					defaultValue: 'Invalid or expired challenge',
				}),
			)
		}

		// Verify the registration
		let verification: VerifiedRegistrationResponse
		try {
			verification = await verifyRegistrationResponse({
				response,
				expectedChallenge: challengeData.challenge,
				expectedOrigin: WEBAUTHN_RP.ORIGIN,
				expectedRPID: WEBAUTHN_RP.ID,
			})
		} catch (error) {
			this.logger.error(`WebAuthn registration verification failed: ${(error as Error).message}`)
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.registration_failed', {
					lng,
					defaultValue: 'Registration verification failed',
				}),
			)
		}

		if (!verification.verified || !verification.registrationInfo) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.registration_invalid', {
					lng,
					defaultValue: 'Invalid registration response',
				}),
			)
		}

		const { registrationInfo } = verification
		const { credential, credentialDeviceType, credentialBackedUp, aaguid } = registrationInfo

		// Determine method type
		const isPlatform = credentialDeviceType === 'singleDevice'
		const methodType = isPlatform ? E2FAMethod.PASSKEY : E2FAMethod.WEBAUTHN

		// Create method data based on type - use separate variables for clarity
		let methodData: IWebAuthnMethodData | IPasskeyMethodData

		if (methodType === E2FAMethod.PASSKEY) {
			// Create IPasskeyMethodData
			const passkeyData: IPasskeyMethodData = {
				publicKey: Buffer.from(credential.publicKey).toString('base64url'),
				counter: credential.counter,
				credentialId: Buffer.from(credential.id).toString('base64url'),
				transports: (response.response.transports || ['internal']) as (
					| 'usb'
					| 'nfc'
					| 'ble'
					| 'internal'
					| 'hybrid'
				)[],
				aaguid: aaguid || undefined,
				isSynced: credentialBackedUp || false,
				platform: this.detectPlatform(response.response.clientDataJSON),
				backupEligible: credentialBackedUp || false,
				backedUp: credentialBackedUp || false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}
			methodData = passkeyData
		} else {
			// Create IWebAuthnMethodData
			const webauthnData: IWebAuthnMethodData = {
				publicKey: Buffer.from(credential.publicKey).toString('base64url'),
				counter: credential.counter,
				credentialId: Buffer.from(credential.id).toString('base64url'),
				transports: (response.response.transports || ['usb', 'nfc', 'ble', 'internal']) as (
					| 'usb'
					| 'nfc'
					| 'ble'
					| 'internal'
				)[],
				aaguid: aaguid || undefined,
				attestationFormat: 'none',
				userVerified: true,
				backupEligible: credentialBackedUp || false,
				backedUp: credentialBackedUp || false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}
			methodData = webauthnData
		}

		// Create method and backup codes in transaction
		const result = await this.prisma.$transaction(async tx => {
			const existingMethods = await tx.authenticationMethod.count({
				where: { userId: user.id, isActive: true },
			})
			const isPrimary = existingMethods === 0

			const method = await tx.authenticationMethod.create({
				data: {
					userId: user.id,
					method: methodType,
					data: methodData as unknown as Prisma.JsonValue,
					name: authenticatorName || (isPlatform ? 'Platform Authenticator' : 'Security Key'),
					credentialId: Buffer.from(credential.id).toString('base64url'),
					isPrimary,
					isActive: true,
				},
			})

			if (isPrimary) {
				await tx.user.update({
					where: { id: user.id },
					data: {
						is2FAEnabled: true,
						preferred2FAMethod: methodType,
					},
				})
			}

			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: methodType === E2FAMethod.PASSKEY ? 'PASSKEY_REGISTERED' : 'WEBAUTHN_REGISTERED',
					category: 'SECURITY',
					success: true,
					metadata: {
						methodId: method.id,
						credentialId: method.credentialId,
						authenticatorName,
						isPlatform,
					} as Prisma.InputJsonValue,
				},
			})

			return method
		})

		// Generate backup codes
		const backupCodes = await this.backupCodeService.generateBackupCodes(user.id, methodType, result.id)

		// Log security event
		await this.securityEventService.logEvent({
			userId: user.id,
			event:
				methodType === E2FAMethod.PASSKEY ? ESecurityEvent.PASSKEY_CREATED : ESecurityEvent.WEBAUTHN_REGISTERED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: {
				methodId: result.id,
				credentialId: result.credentialId,
				authenticatorName,
				timestamp: new Date().toISOString(),
			},
		})

		// Clear challenge
		await this.rDel(challengeKey)

		this.logger.log(`WebAuthn/Passkey registered for user ${user.id}, method ${result.id}`)

		return {
			success: true,
			methodId: result.id,
			credentialId: result.credentialId,
			backupCodes,
		}
	}

	/**
	 * Generate authentication options
	 */
	async generateAuthenticationOptions(
		userId?: string,
		credentialId?: string,
	): Promise<{
		challengeId: string
		options: any // Already any, no need for assertion
		credentialCount: number
	}> {
		let allowCredentials: any[] = []
		let credentialCount = 0

		if (userId) {
			const credentials = await this.prisma.authenticationMethod.findMany({
				where: {
					userId,
					method: { in: [E2FAMethod.WEBAUTHN, E2FAMethod.PASSKEY] },
					isActive: true,
					credentialId: credentialId || undefined,
				},
			})

			credentialCount = credentials.length

			allowCredentials = credentials
				.filter(c => c.credentialId)
				.map(c => {
					const data = c.data as unknown as IWebAuthnMethodData
					return {
						id: c.credentialId,
						transports: data.transports as AuthenticatorTransportFuture[],
					}
				})
		}

		const options = await generateAuthenticationOptions({
			rpID: WEBAUTHN_RP.ID,
			timeout: WEBAUTHN_CONFIG.CREDENTIAL_PARAMS.TIMEOUT,
			allowCredentials,
			userVerification: WEBAUTHN_CONFIG.AUTHENTICATOR_SELECTION.USER_VERIFICATION,
		})

		const challengeId = this.generateChallengeId()
		const challengeKey = REDIS_KEYS.WEBAUTHN_CHALLENGE(challengeId)

		await this.rSetJSON(
			challengeKey,
			{
				userId: userId || 'unknown',
				challenge: options.challenge,
				type: 'authentication',
				createdAt: new Date().toISOString(),
			},
			WEBAUTHN_STORAGE.CHALLENGE_TTL,
		)

		this.logger.log(`Generated WebAuthn authentication options${userId ? ` for user ${userId}` : ''}`)

		return {
			challengeId,
			options,
			credentialCount,
		}
	}

	/**
	 * Verify authentication response
	 */
	async verifyAuthenticationResponse(
		challengeId: string,
		response: AuthenticationResponseJSON,
		lng: Language = 'en',
	): Promise<{
		success: boolean
		userId: string
		credentialId: string
		methodId: string
	}> {
		const challengeKey = REDIS_KEYS.WEBAUTHN_CHALLENGE(challengeId)
		const challengeData = await this.rGetJSON<{
			userId: string
			challenge: string
			type: string
		}>(challengeKey)

		if (!challengeData || challengeData.type !== 'authentication') {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.invalid_challenge', {
					lng,
					defaultValue: 'Invalid or expired challenge',
				}),
			)
		}

		const credentialId = response.id
		const method = await this.prisma.authenticationMethod.findUnique({
			where: { credentialId },
			include: { user: true },
		})

		if (!method || !method.isActive) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.2fa.credential_not_found', {
					lng,
					defaultValue: 'Credential not found',
				}),
			)
		}

		const methodData = method.data as unknown as IWebAuthnMethodData

		let verification: VerifiedAuthenticationResponse
		try {
			// Create properly formatted credential for verification
			const credential = {
				id: method.credentialId,
				publicKey: Buffer.from(methodData.publicKey, 'base64url'),
				counter: methodData.counter,
				transports: methodData.transports as AuthenticatorTransportFuture[],
			}

			verification = await verifyAuthenticationResponse({
				response,
				expectedChallenge: challengeData.challenge,
				expectedOrigin: WEBAUTHN_RP.ORIGIN,
				expectedRPID: WEBAUTHN_RP.ID,
				credential,
			})
		} catch (error) {
			this.logger.error(`WebAuthn authentication verification failed: ${(error as Error).message}`)
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.2fa.authentication_failed', {
					lng,
					defaultValue: 'Authentication verification failed',
				}),
			)
		}

		if (!verification.verified) {
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.2fa.authentication_invalid', {
					lng,
					defaultValue: 'Invalid authentication response',
				}),
			)
		}

		const { authenticationInfo } = verification
		const { newCounter } = authenticationInfo

		methodData.counter = newCounter
		methodData.updatedAt = new Date().toISOString()

		await this.prisma.authenticationMethod.update({
			where: { id: method.id },
			data: {
				data: methodData as unknown as Prisma.JsonValue,
				lastUsedAt: new Date(),
				useCount: { increment: 1 },
			},
		})

		await this.securityEventService.logEvent({
			userId: method.userId,
			event:
				method.method === E2FAMethod.PASSKEY ? ESecurityEvent.PASSKEY_USED : ESecurityEvent.WEBAUTHN_VERIFIED,
			severity: ESecuritySeverity.LOW,
			metadata: {
				methodId: method.id,
				credentialId,
				timestamp: new Date().toISOString(),
			},
		})

		await this.rDel(challengeKey)

		this.logger.log(`WebAuthn authentication successful for user ${method.userId}`)

		return {
			success: true,
			userId: method.userId,
			credentialId,
			methodId: method.id,
		}
	}

	/**
	 * Get user's WebAuthn credentials
	 */
	async getUserCredentials(userId: string) {
		const methods = await this.prisma.authenticationMethod.findMany({
			where: {
				userId,
				method: { in: [E2FAMethod.WEBAUTHN, E2FAMethod.PASSKEY] },
				isActive: true,
			},
			orderBy: { createdAt: 'desc' },
		})

		return methods.map(method => {
			const data = method.data as unknown as IWebAuthnMethodData
			return {
				id: method.id,
				credentialId: method.credentialId,
				name: method.name,
				isPlatform: method.method === E2FAMethod.PASSKEY,
				isBackedUp: data.backedUp,
				transports: data.transports,
				lastUsedAt: method.lastUsedAt,
				useCount: method.useCount,
				createdAt: method.createdAt,
			}
		})
	}

	/**
	 * Remove WebAuthn credential
	 */
	async removeCredential(
		user: User,
		credentialId: string,
		password: string,
		lng: Language = 'en',
	): Promise<{ success: boolean }> {
		// Verify password
		const isPasswordValid = await HashUtil.verify(user.password, password)
		if (!isPasswordValid) {
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.password.invalid', { lng, defaultValue: 'Invalid password' }),
			)
		}

		const method = await this.prisma.authenticationMethod.findUnique({
			where: { credentialId },
		})

		if (!method || method.userId !== user.id) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.2fa.credential_not_found', {
					lng,
					defaultValue: 'Credential not found',
				}),
			)
		}

		// Delete credential and backup codes
		await this.prisma.$transaction(async tx => {
			await tx.authenticationMethod.delete({
				where: { id: method.id },
			})

			await tx.backupCode.deleteMany({
				where: { authMethodId: method.id },
			})

			// Check if this was the last method
			const remainingMethods = await tx.authenticationMethod.count({
				where: { userId: user.id, isActive: true },
			})

			if (remainingMethods === 0) {
				await tx.user.update({
					where: { id: user.id },
					data: {
						is2FAEnabled: false,
						preferred2FAMethod: null,
					},
				})
			}
		})

		// Log security event
		await this.securityEventService.logEvent({
			userId: user.id,
			event:
				method.method === E2FAMethod.PASSKEY ? ESecurityEvent.PASSKEY_DELETED : ESecurityEvent.WEBAUTHN_REMOVED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: {
				methodId: method.id,
				credentialId,
				timestamp: new Date().toISOString(),
			},
		})

		this.logger.log(`WebAuthn credential ${credentialId} removed for user ${user.id}`)

		return { success: true }
	}

	// ==================== Private Helpers ====================

	private generateChallengeId(): string {
		return Buffer.from(
			Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
		).toString('base64url')
	}

	/**
	 * Detect platform from client data
	 */
	private detectPlatform(clientDataJSON: string): string {
		// Parse the base64url encoded clientDataJSON
		try {
			const decoded = Buffer.from(clientDataJSON, 'base64url').toString('utf-8')
			const data = JSON.parse(decoded)

			// Check origin or other fields to detect platform
			const origin = data.origin || ''

			// You can also check user agent if passed through context
			if (origin.includes('android')) return 'android'
			if (origin.includes('ios') || origin.includes('iphone') || origin.includes('ipad')) return 'ios'
			if (origin.includes('windows')) return 'windows'
			if (origin.includes('mac')) return 'macos'

			return 'unknown'
		} catch {
			return 'unknown'
		}
	}
}
