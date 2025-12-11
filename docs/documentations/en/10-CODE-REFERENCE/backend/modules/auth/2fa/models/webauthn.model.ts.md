# File: modules\auth\2fa\models\webauthn.model.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/models/webauthn.model.ts`

## Category
Backend

## File Type
TS (webauthn.model.ts)

## Size
6056 characters, 210 lines

## Full Code

```typescript
import GraphQLJSON from 'graphql-type-json'

import { Field, Int, ObjectType } from '@nestjs/graphql'

/**
 * WebAuthn registration options response
 * Contains all data needed to create a new WebAuthn credential
 */
@ObjectType('WebAuthnRegistrationOptions', {
	description: 'WebAuthn registration options for creating a new passkey or security key',
})
export class WebAuthnRegistrationOptionsModel {
	@Field(() => String, {
		description: 'Unique challenge identifier for this registration session (used to verify response)',
	})
	challengeId: string

	@Field(() => GraphQLJSON, {
		description:
			'PublicKeyCredentialCreationOptions as JSON. Pass this to @simplewebauthn/browser startRegistration() or navigator.credentials.create({ publicKey: options })',
	})
	options: Record<string, any>

	@Field(() => String, {
		description: 'Relying Party name displayed to user (e.g., "MedicHub")',
	})
	rpName: string

	@Field(() => String, {
		description: 'Relying Party ID - domain name (e.g., "medichub.com")',
	})
	rpId: string

	@Field(() => String, {
		description: 'User display name shown in authenticator UI (e.g., "John Doe <john@example.com>")',
	})
	userDisplayName: string
}

/**
 * WebAuthn registration complete response
 * Returned after successful credential creation
 */
@ObjectType('WebAuthnRegistrationComplete', {
	description: 'Response after successful WebAuthn credential registration',
})
export class WebAuthnRegistrationCompleteModel {
	@Field(() => Boolean, {
		description: 'Whether registration was successful',
	})
	success: boolean

	@Field(() => String, {
		description: 'Unique authentication method ID (stored in database)',
	})
	methodId: string

	@Field(() => String, {
		description: 'WebAuthn credential ID (base64url encoded, used for authentication)',
	})
	credentialId: string

	@Field(() => String, {
		nullable: true,
		description: 'User-provided authenticator name (e.g., "YubiKey 5C", "iPhone 15 Pro")',
	})
	authenticatorName?: string

	@Field(() => Boolean, {
		description: 'Whether this is a platform authenticator (TouchID, FaceID, Windows Hello)',
	})
	isPlatform: boolean

	@Field(() => Boolean, {
		description: 'Whether credential is backed up to cloud (iCloud Keychain, Google Password Manager)',
	})
	isBackedUp: boolean

	@Field(() => [String], {
		description: 'Backup recovery codes for emergency access (store securely, shown only once)',
	})
	backupCodes: string[]

	@Field(() => String, {
		description: 'Human-readable success message for UI display',
	})
	message: string
}

/**
 * WebAuthn authentication options response
 * Contains data needed to verify an existing credential
 */
@ObjectType('WebAuthnAuthenticationOptions', {
	description: 'WebAuthn authentication options for verifying a passkey or security key',
})
export class WebAuthnAuthenticationOptionsModel {
	@Field(() => String, {
		description: 'Unique challenge identifier for this authentication session (used to verify response)',
	})
	challengeId: string

	@Field(() => GraphQLJSON, {
		description:
			'PublicKeyCredentialRequestOptions as JSON. Pass this to @simplewebauthn/browser startAuthentication() or navigator.credentials.get({ publicKey: options })',
	})
	options: Record<string, any>

	@Field(() => String, {
		description: 'Relying Party ID - must match registration domain',
	})
	rpId: string

	@Field(() => Int, {
		description: 'Number of registered WebAuthn credentials for this user',
	})
	credentialCount: number
}

/**
 * WebAuthn authentication complete response
 * Returned after successful authentication
 */
@ObjectType('WebAuthnAuthenticationComplete', {
	description: 'Response after successful WebAuthn credential verification',
})
export class WebAuthnAuthenticationCompleteModel {
	@Field(() => Boolean, {
		description: 'Whether authentication was successful',
	})
	success: boolean

	@Field(() => String, {
		description: 'Credential ID that was used for authentication (base64url encoded)',
	})
	credentialId: string

	@Field(() => String, {
		nullable: true,
		description: 'Name of the authenticator that was used (e.g., "YubiKey 5C")',
	})
	authenticatorName?: string

	@Field(() => Int, {
		description: 'Updated signature counter (detects cloned authenticators if counter decreases)',
	})
	counter: number

	@Field(() => String, {
		description: 'Human-readable success message for UI display',
	})
	message: string
}

/**
 * WebAuthn credential info
 * Represents a registered security key or passkey
 */
@ObjectType('WebAuthnCredential', {
	description: 'Registered WebAuthn credential (security key or passkey)',
})
export class WebAuthnCredentialModel {
	@Field(() => String, {
		description: 'Unique authentication method ID (database primary key)',
	})
	id: string

	@Field(() => String, {
		description: 'WebAuthn credential ID (base64url encoded, unique per credential)',
	})
	credentialId: string

	@Field(() => String, {
		nullable: true,
		description: 'User-provided name for this credential (e.g., "Work YubiKey", "Personal iPhone")',
	})
	name?: string

	@Field(() => Boolean, {
		description: 'Platform authenticator (TouchID, FaceID, Windows Hello) vs cross-platform (YubiKey, USB key)',
	})
	isPlatform: boolean

	@Field(() => Boolean, {
		description: 'Whether credential is synced to cloud (iCloud Keychain, Google Password Manager)',
	})
	isBackedUp: boolean

	@Field(() => [String], {
		description: 'Supported transports (usb, nfc, ble, internal, hybrid)',
	})
	transports: string[]

	@Field(() => Date, {
		nullable: true,
		description: 'Timestamp of last successful authentication with this credential',
	})
	lastUsedAt?: Date

	@Field(() => Int, {
		description: 'Total number of successful authentications with this credential',
	})
	useCount: number

	@Field(() => Date, {
		description: 'Credential registration timestamp',
	})
	createdAt: Date
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.152Z*
