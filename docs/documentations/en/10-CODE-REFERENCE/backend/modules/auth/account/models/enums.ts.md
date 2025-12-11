# File: modules\auth\account\models\enums.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/account/models/enums.ts`

## Category
Backend

## File Type
TS (enums.ts)

## Size
1243 characters, 48 lines

## Full Code

```typescript
import { registerEnumType } from '@nestjs/graphql'
import { E2FAMethod, EUserRole } from '@prisma/__generated__'

/**
 * Register Prisma enums for GraphQL
 * Must be imported before any models that use these enums
 */

registerEnumType(EUserRole, {
	name: 'EUserRole',
	description: 'User role for access control and permissions',
	valuesMap: {
		USER: {
			description: 'Regular user with standard permissions',
		},
		SUPER_ADMIN: {
			description: 'Super administrator with full system access',
		},
	},
})

registerEnumType(E2FAMethod, {
	name: 'E2FAMethod',
	description: 'Available two-factor authentication methods',
	valuesMap: {
		TOTP: {
			description: 'Time-based one-time password (Google Authenticator, Authy, 1Password)',
		},
		OTP_EMAIL: {
			description: 'One-time password sent via email',
		},
		OTP_SMS: {
			description: 'One-time password sent via SMS',
		},
		WEBAUTHN: {
			description: 'WebAuthn/FIDO2 hardware security keys (YubiKey, Titan)',
		},
		PASSKEY: {
			description: 'Passkeys using biometrics (TouchID, FaceID, Windows Hello)',
		},
		BACKUP_CODE: {
			description: 'Backup recovery codes for emergency access',
		},
	},
})

export { EUserRole, E2FAMethod }

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.326Z*
