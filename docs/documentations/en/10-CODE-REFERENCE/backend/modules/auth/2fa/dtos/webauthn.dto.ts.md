# File: modules\auth\2fa\dtos\webauthn.dto.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/dtos/webauthn.dto.ts`

## Category
Backend

## File Type
TS (webauthn.dto.ts)

## Size
4269 characters, 142 lines

## Full Code

```typescript
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import GraphQLJSON from 'graphql-type-json'

import { Field, InputType } from '@nestjs/graphql'
import type { AuthenticationResponseJSON, RegistrationResponseJSON } from '@simplewebauthn/typescript-types'

/**
 * Input for starting WebAuthn registration
 */
@InputType('StartWebAuthnRegistrationInput', {
	description: 'Input for initiating WebAuthn credential registration (passkey or security key)',
})
export class StartWebAuthnRegistrationInput {
	@Field(() => String, {
		nullable: true,
		description: 'Custom name for the authenticator (e.g., "YubiKey 5C", "iPhone 15 Pro")',
	})
	@IsOptional()
	@IsString()
	@MaxLength(100)
	authenticatorName?: string

	@Field(() => String, {
		nullable: true,
		description:
			'Authenticator attachment: "platform" (TouchID, FaceID, Windows Hello) or "cross-platform" (YubiKey, external USB key)',
		defaultValue: undefined,
	})
	@IsOptional()
	@IsString()
	authenticatorAttachment?: 'platform' | 'cross-platform'

	@Field(() => Boolean, {
		nullable: true,
		description: 'Prefer platform authenticators (built-in biometrics) over external keys',
		defaultValue: true,
	})
	@IsOptional()
	@IsBoolean()
	preferPlatform?: boolean
}

/**
 * Input for completing WebAuthn registration
 */
@InputType('CompleteWebAuthnRegistrationInput', {
	description: 'Input for completing WebAuthn registration with authenticator response',
})
export class CompleteWebAuthnRegistrationInput {
	@Field(() => String, {
		description: 'Challenge ID from registration options (used to verify this response)',
	})
	@IsString()
	@IsNotEmpty()
	challengeId: string

	@Field(() => GraphQLJSON, {
		description:
			'RegistrationResponseJSON from @simplewebauthn/browser startRegistration(). Contains id, rawId, response.attestationObject, response.clientDataJSON, type, and optional fields.',
	})
	@IsNotEmpty()
	response: RegistrationResponseJSON

	@Field(() => String, {
		nullable: true,
		description: 'Custom name for this authenticator (overrides name from StartWebAuthnRegistrationInput)',
	})
	@IsOptional()
	@IsString()
	@MaxLength(100)
	authenticatorName?: string
}

/**
 * Input for starting WebAuthn authentication
 */
@InputType('StartWebAuthnAuthenticationInput', {
	description: 'Input for initiating WebAuthn authentication challenge',
})
export class StartWebAuthnAuthenticationInput {
	@Field(() => String, {
		nullable: true,
		description:
			'Specific credential ID to use for authentication (if null, user picks from available credentials)',
	})
	@IsOptional()
	@IsString()
	credentialId?: string

	@Field(() => String, {
		nullable: true,
		description: 'User email for authentication (required if user is not already logged in)',
	})
	@IsOptional()
	@IsString()
	email?: string
}

/**
 * Input for completing WebAuthn authentication
 */
@InputType('CompleteWebAuthnAuthenticationInput', {
	description: 'Input for completing WebAuthn authentication with authenticator response',
})
export class CompleteWebAuthnAuthenticationInput {
	@Field(() => String, {
		description: 'Challenge ID from authentication options (used to verify this response)',
	})
	@IsString()
	@IsNotEmpty()
	challengeId: string

	@Field(() => GraphQLJSON, {
		description:
			'AuthenticationResponseJSON from @simplewebauthn/browser startAuthentication(). Contains id, rawId, response.authenticatorData, response.clientDataJSON, response.signature, response.userHandle, and type.',
	})
	@IsNotEmpty()
	response: AuthenticationResponseJSON
}

/**
 * Input for removing WebAuthn credential
 */
@InputType('RemoveWebAuthnCredentialInput', {
	description: 'Input for removing a registered WebAuthn credential (requires password confirmation)',
})
export class RemoveWebAuthnCredentialInput {
	@Field(() => String, {
		description: 'Credential ID (base64url) or authentication method ID to remove',
	})
	@IsString()
	@IsNotEmpty()
	credentialId: string

	@Field(() => String, {
		description: 'User password for confirmation (security measure to prevent unauthorized removal)',
	})
	@IsString()
	@IsNotEmpty()
	password: string
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.139Z*
