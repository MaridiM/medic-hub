# GraphQL API Reference: Unified 2FA System

## 📚 Overview

This document provides a complete, detailed reference for all available **queries** and **mutations** for interacting with the Unified 2FA system. It is intended for frontend developers and anyone consuming this API.

**Base URL:** `/graphql`  
**Authentication:** Requires a valid `Authorization: Bearer <sessionToken>` header for all operations.

---

## 📋 Table of Contents

- [GraphQL API Reference: Unified 2FA System](#graphql-api-reference-unified-2fa-system)
  - [📚 Overview](#-overview)
  - [📋 Table of Contents](#-table-of-contents)
  - [🔍 Queries (Reading Data)](#-queries-reading-data)
    - [TOTP Setup](#totp-setup)
      - [`generateTotpSetup`](#generatetotpsetup)
    - [Method Management](#method-management)
      - [`my2FAMethods`](#my2famethods)
    - [Backup Codes](#backup-codes)
      - [`backupCodesStatus`](#backupcodesstatus)
    - [Device Trust](#device-trust)
      - [`myTrustedDevices`](#mytrusteddevices)
    - [Status Checks](#status-checks)
      - [`is2FAEnabled`](#is2faenabled)
      - [`isSession2FAVerified`](#issession2faverified)
    - [WebAuthn/Passkeys](#webauthnpasskeys)
      - [`startWebAuthnAuthentication`](#startwebauthnauthentication)
      - [`myWebAuthnCredentials`](#mywebauthncredentials)
  - [⚙️ Mutations (Modifying Data)](#️-mutations-modifying-data)
    - [TOTP Setup Mutations](#totp-setup-mutations)
      - [`completeTotpSetup`](#completetotpsetup)
    - [OTP Setup Mutations](#otp-setup-mutations)
      - [`setupOtp`](#setupotp)
      - [`sendOtpCode`](#sendotpcode)
      - [`verifyOtpSetup`](#verifyotpsetup)
    - [WebAuthn/Passkeys Mutations](#webauthnpasskeys-mutations)
      - [`startWebAuthnRegistration`](#startwebauthnregistration)
      - [`completeWebAuthnRegistration`](#completewebauthnregistration)
      - [`completeWebAuthnAuthentication`](#completewebauthnauthentication)
      - [`removeWebAuthnCredential`](#removewebauthncredential)
    - [Verification Mutations](#verification-mutations)
      - [`verify2FA`](#verify2fa)
      - [`verifyBackupCode`](#verifybackupcode)
    - [Method Management Mutations](#method-management-mutations)
      - [`update2FAMethod`](#update2famethod)
      - [`remove2FAMethod`](#remove2famethod)
    - [Backup Codes Management](#backup-codes-management)
      - [`regenerateBackupCodes`](#regeneratebackupcodes)
    - [Device Trust Management](#device-trust-management)
      - [`revokeDeviceTrust`](#revokedevicetrust)
  - [👨‍💼 Admin Operations](#-admin-operations)
    - [Admin Queries](#admin-queries)
      - [`adminGetUser2FAStatus`](#admingetuser2fastatus)
      - [`adminGetUserSecurityEvents`](#admingetusersecurityevents)
      - [`adminGetUserTrustedDevices`](#admingetusertrusteddevices)
    - [Admin Mutations](#admin-mutations)
      - [`adminDisableUser2FA`](#admindisableuser2fa)
      - [`adminRevokeUserDevice`](#adminrevokeuserdevice)
      - [`adminRevokeAllUserDevices`](#adminrevokealluserdevices)
  - [📘 GraphQL Types (Data Structures)](#-graphql-types-data-structures)
    - [Core 2FA Types](#core-2fa-types)
      - [`TotpSetup`](#totpsetup)
      - [`OtpSetup`](#otpsetup)
      - [`TwoFactorMethod`](#twofactormethod)
      - [`TwoFactorMethodsList`](#twofactormethodslist)
      - [`TwoFactorSetupComplete`](#twofactorsetupcomplete)
      - [`BackupCodesStatus`](#backupcodesstatus-1)
      - [`BackupCodesRegenerated`](#backupcodesregenerated)
      - [`TwoFactorSuccess`](#twofactorsuccess)
    - [WebAuthn/Passkeys Types](#webauthnpasskeys-types)
      - [`WebAuthnRegistrationOptions`](#webauthnregistrationoptions)
      - [`WebAuthnRegistrationComplete`](#webauthnregistrationcomplete)
      - [`WebAuthnAuthenticationOptions`](#webauthnauthenticationoptions)
      - [`WebAuthnAuthenticationComplete`](#webauthnauthenticationcomplete)
      - [`WebAuthnCredential`](#webauthncredential)
    - [Device Trust Types](#device-trust-types)
      - [`TrustedDevice`](#trusteddevice)
    - [Admin Types](#admin-types)
      - [`AdminActionSuccess`](#adminactionsuccess)
      - [`User2FAStatus`](#user2fastatus)
      - [`TwoFactorMethodSummary`](#twofactormethodsummary)
      - [`TrustedDeviceSummary`](#trusteddevicesummary)
      - [`SecurityEventSummary`](#securityeventsummary)
    - [Input Types](#input-types)
      - [Core 2FA Input Types](#core-2fa-input-types)
        - [`GenerateTotpSetupInput`](#generatetotpsetupinput)
        - [`CompleteTotpSetupInput`](#completetotpsetupinput)
        - [`SetupOtpInput`](#setupotpinput)
        - [`SendOtpCodeInput`](#sendotpcodeinput)
        - [`VerifyOtpSetupInput`](#verifyotpsetupinput)
        - [`Verify2FAInput`](#verify2fainput)
        - [`VerifyBackupCodeInput`](#verifybackupcodeinput)
        - [`Update2FAMethodInput`](#update2famethodinput)
        - [`Remove2FAMethodInput`](#remove2famethodinput)
        - [`RegenerateBackupCodesInput`](#regeneratebackupcodesinput)
      - [WebAuthn Input Types](#webauthn-input-types)
        - [`StartWebAuthnRegistrationInput`](#startwebauthnregistrationinput)
        - [`CompleteWebAuthnRegistrationInput`](#completewebauthnregistrationinput)
        - [`StartWebAuthnAuthenticationInput`](#startwebauthnauthenticationinput)
        - [`CompleteWebAuthnAuthenticationInput`](#completewebauthnauthenticationinput)
        - [`RemoveWebAuthnCredentialInput`](#removewebauthncredentialinput)
      - [Admin Input Types](#admin-input-types)
        - [`DisableUser2FAInput`](#disableuser2fainput)
        - [`RevokeUserDeviceInput`](#revokeuserdeviceinput)
        - [`RevokeAllUserDevicesInput`](#revokealluserdevicesinput)
        - [`GetUserSecurityEventsInput`](#getusersecurityeventsinput)
    - [Enums](#enums)
      - [`E2FAMethod`](#e2famethod)
      - [`ESecurityEvent`](#esecurityevent)
      - [`ESecuritySeverity`](#esecurityseverity)
      - [`EUserRole`](#euserrole)
  - [⚠️ Error Handling](#️-error-handling)
    - [Структура ответа с ошибкой](#структура-ответа-с-ошибкой)
    - [Таблица кодов и сообщений об ошибках](#таблица-кодов-и-сообщений-об-ошибках)
    - [Пример обработки ошибок на Frontend](#пример-обработки-ошибок-на-frontend)

---

## 🔍 Queries (Reading Data)

### TOTP Setup

#### `generateTotpSetup`
Starts the TOTP (Authenticator App) setup process. Generates a unique secret and provides it as a QR code and a manual entry key. This secret is valid for **10 minutes**.

**GraphQL Query:**
```graphql
query GenerateTotpSetup($data: GenerateTotpSetupInput) {
  generateTotpSetup(data: $data) {
    methodId
    qrCodeUrl
    manualEntryKey
    issuer
    accountName
  }
}
```

**Arguments:**
| Name   | Type                     | Description                                                                   |
| ------ | ------------------------ | ----------------------------------------------------------------------------- |
| `data` | `GenerateTotpSetupInput` | (Optional) Contains a `name` for the new method to help the user identify it. |

**Example Variables:**
```json
{
  "data": {
    "name": "My MacBook Pro Authenticator"
  }
}
```

**Response Fields:**
| Field            | Type      | Description                                                                        |
| ---------------- | --------- | ---------------------------------------------------------------------------------- |
| `methodId`       | `String!` | A temporary ID (`"temp"`). Not needed for the next step.                           |
| `qrCodeUrl`      | `String!` | A data URL (`data:image/png;base64,...`) for the QR code image.                    |
| `manualEntryKey` | `String!` | The secret key for manual entry. **This is the `secret` for `completeTotpSetup`.** |
| `issuer`         | `String!` | The name of your application (e.g., "MedicHub").                                   |
| `accountName`    | `String!` | The user's email, displayed in the authenticator app.                              |

**Example Response:**
```json
{
  "data": {
    "generateTotpSetup": {
      "methodId": "temp",
      "qrCodeUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "manualEntryKey": "JBSWY3DPEHPK3PXP",
      "issuer": "MedicHub",
      "accountName": "user@example.com"
    }
  }
}
```

---

### Method Management

#### `my2FAMethods`
Retrieves a list of all active 2FA methods for the currently authenticated user, sorted with the primary method first.

**GraphQL Query:**
```graphql
query GetMy2FAMethods {
  my2FAMethods {
    methods {
      id
      method
      name
      isPrimary
      isActive
      lastUsedAt
      useCount
      createdAt
    }
    primary {
      id
      method
      name
    }
    totalActive
    is2FAEnabled
  }
}
```

**Example Response:**
```json
{
  "data": {
    "my2FAMethods": {
      "methods": [
        {
          "id": "c1b2a3d4-e5f6-7890-1234-567890abcdef",
          "method": "TOTP",
          "name": "Google Authenticator",
          "isPrimary": true,
          "isActive": true,
          "lastUsedAt": "2025-10-26T10:00:00.000Z",
          "useCount": 42,
          "createdAt": "2025-01-15T09:00:00.000Z"
        },
        {
          "id": "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
          "method": "OTP_EMAIL",
          "name": "Backup Email",
          "isPrimary": false,
          "isActive": true,
          "lastUsedAt": "2025-09-01T14:30:00.000Z",
          "useCount": 3,
          "createdAt": "2025-08-20T11:00:00.000Z"
        }
      ],
      "primary": {
        "id": "c1b2a3d4-e5f6-7890-1234-567890abcdef",
        "method": "TOTP",
        "name": "Google Authenticator"
      },
      "totalActive": 2,
      "is2FAEnabled": true
    }
  }
}
```

---

### Backup Codes

#### `backupCodesStatus`
Checks the status of backup codes for a specific 2FA method.

**GraphQL Query:**
```graphql
query GetBackupCodesStatus($methodId: String) {
  backupCodesStatus(methodId: $methodId) {
    total
    used
    remaining
    expired
    isLow
  }
}
```

**Arguments:**
| Name       | Type     | Description                                                                          |
| ---------- | -------- | ------------------------------------------------------------------------------------ |
| `methodId` | `String` | (Optional) The ID of the method to check. If omitted, checks the **primary** method. |

**Example Variables:**
```json
{
  "methodId": "c1b2a3d4-e5f6-7890-1234-567890abcdef"
}
```

**Example Response:**
```json
{
  "data": {
    "backupCodesStatus": {
      "total": 10,
      "used": 2,
      "remaining": 8,
      "expired": 0,
      "isLow": false
    }
  }
}
```

---

### Device Trust

#### `myTrustedDevices`
Retrieves a list of all devices the user has marked as "trusted".

**GraphQL Query:**
```graphql
query GetMyTrustedDevices {
  myTrustedDevices {
    id
    deviceId
    name
    browser
    os
    device
    trustScore
    lastCountry
    lastCity
    isActive
    lastSeenAt
    expiresAt
    createdAt
  }
}
```

**Example Response:**
```json
{
  "data": {
    "myTrustedDevices": [
      {
        "id": "a1b2c3d4-e5f6-...",
        "deviceId": "a1b2c3d4e5f6...",
        "name": "Work Laptop",
        "browser": "Chrome",
        "os": "Windows",
        "device": "desktop",
        "trustScore": 85,
        "lastCountry": "US",
        "lastCity": "New York",
        "isActive": true,
        "lastSeenAt": "2025-10-26T10:00:00.000Z",
        "expiresAt": "2025-11-25T10:00:00.000Z",
        "createdAt": "2025-01-15T09:00:00.000Z"
      }
    ]
  }
}
```

---

### Status Checks

#### `is2FAEnabled`
A quick boolean check to see if the current user has any active 2FA method.

**GraphQL Query:**
```graphql
query Is2FAEnabled {
  is2FAEnabled
}
```

**Example Response:**
```json
{
  "data": {
    "is2FAEnabled": true
  }
}
```

---

#### `isSession2FAVerified`
A quick boolean check to see if the current session has already been verified with 2FA.

**GraphQL Query:**
```graphql
query IsSession2FAVerified {
  isSession2FAVerified
}
```

**Example Response:**
```json
{
  "data": {
    "isSession2FAVerified": true
  }
}
```

---

### WebAuthn/Passkeys

#### `startWebAuthnAuthentication`
Initiates WebAuthn/Passkey authentication flow. Returns challenge options for the browser's WebAuthn API.

**GraphQL Query:**
```graphql
query StartWebAuthnAuthentication($data: StartWebAuthnAuthenticationInput) {
  startWebAuthnAuthentication(data: $data) {
    challengeId
    options
    rpId
    credentialCount
  }
}
```

**Arguments:**
| Name   | Type                               | Description                                                    |
| ------ | ---------------------------------- | -------------------------------------------------------------- |
| `data` | `StartWebAuthnAuthenticationInput` | (Optional) Can specify `credentialId` or `email` for the user. |

**Example Variables:**
```json
{
  "data": {
    "email": "user@example.com"
  }
}
```

**Example Response:**
```json
{
  "data": {
    "startWebAuthnAuthentication": {
      "challengeId": "ch_1234567890abcdef",
      "options": {
        "challenge": "randomBase64Challenge==",
        "timeout": 60000,
        "rpId": "example.com",
        "allowCredentials": [
          {
            "id": "credentialIdBase64==",
            "type": "public-key",
            "transports": ["usb", "nfc"]
          }
        ]
      },
      "rpId": "example.com",
      "credentialCount": 1
    }
  }
}
```

---

#### `myWebAuthnCredentials`
Retrieves a list of all registered WebAuthn credentials (hardware keys, passkeys) for the current user.

**GraphQL Query:**
```graphql
query GetMyWebAuthnCredentials {
  myWebAuthnCredentials {
    id
    credentialId
    name
    isPlatform
    isBackedUp
    transports
    lastUsedAt
    useCount
    createdAt
  }
}
```

**Example Response:**
```json
{
  "data": {
    "myWebAuthnCredentials": [
      {
        "id": "wauth_abc123",
        "credentialId": "base64CredentialId==",
        "name": "YubiKey 5",
        "isPlatform": false,
        "isBackedUp": false,
        "transports": ["usb", "nfc"],
        "lastUsedAt": "2025-10-26T10:00:00.000Z",
        "useCount": 15,
        "createdAt": "2025-01-15T09:00:00.000Z"
      },
      {
        "id": "wauth_xyz789",
        "credentialId": "anotherBase64Id==",
        "name": "Touch ID",
        "isPlatform": true,
        "isBackedUp": true,
        "transports": ["internal"],
        "lastUsedAt": "2025-10-27T08:30:00.000Z",
        "useCount": 52,
        "createdAt": "2025-02-10T14:20:00.000Z"
      }
    ]
  }
}
```

---

## ⚙️ Mutations (Modifying Data)

### TOTP Setup Mutations

#### `completeTotpSetup`
Finalizes the TOTP setup by verifying the first code. On success, it activates the method and returns a new set of backup codes.

**GraphQL Mutation:**
```graphql
mutation CompleteTotpSetup($data: CompleteTotpSetupInput!) {
  completeTotpSetup(data: $data) {
    success
    methodId
    backupCodes
    message
  }
}
```

**Arguments:**
| Name   | Type                      | Description                                                                                       |
| ------ | ------------------------- | ------------------------------------------------------------------------------------------------- |
| `data` | `CompleteTotpSetupInput!` | **Required.** Contains the `secret` from `generateTotpSetup` and the 6-digit `code` from the app. |

**Example Variables:**
```json
{
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "code": "123456",
    "name": "My Google Authenticator"
  }
}
```

**Example Response:**
```json
{
  "data": {
    "completeTotpSetup": {
      "success": true,
      "methodId": "c1b2a3d4-e5f6-7890-1234-567890abcdef",
      "backupCodes": [
        "A1B2C3D4",
        "E5F6G7H8",
        "I9J0K1L2",
        "M3N4O5P6",
        "Q7R8S9T0",
        "U1V2W3X4",
        "Y5Z6A7B8",
        "C9D0E1F2",
        "G3H4I5J6",
        "K7L8M9N0"
      ],
      "message": "⚠️ CRITICAL: Save these backup codes now! They are shown only once."
    }
  }
}
```

**⚠️ CRITICAL:** You **MUST** show the `backupCodes` to the user immediately and provide a way to download/print them, as this is their only chance to save them.

---

### OTP Setup Mutations

#### `setupOtp`
Creates a new, inactive OTP method (Email or SMS) and returns its ID for verification.

**GraphQL Mutation:**
```graphql
mutation SetupOtp($data: SetupOtpInput!) {
  setupOtp(data: $data) {
    methodId
    destination
    message
  }
}
```

**Arguments:**
| Name   | Type             | Description                                                                                           |
| ------ | ---------------- | ----------------------------------------------------------------------------------------------------- |
| `data` | `SetupOtpInput!` | **Required.** Specifies the method (`OTP_EMAIL` or `OTP_SMS`), the destination, and an optional name. |

**Example Variables (Email):**
```json
{
  "data": {
    "method": "OTP_EMAIL",
    "email": "user.backup@email.com",
    "name": "Backup Email"
  }
}
```

**Example Variables (SMS):**
```json
{
  "data": {
    "method": "OTP_SMS",
    "phone": "+1234567890",
    "name": "Mobile Phone"
  }
}
```

**Example Response:**
```json
{
  "data": {
    "setupOtp": {
      "methodId": "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
      "destination": "us***@email.com",
      "message": "OTP method created. Please verify it by entering the code sent to us***@email.com"
    }
  }
}
```

---

#### `sendOtpCode`
Sends a 6-digit verification code to the destination specified in an OTP method.

**GraphQL Mutation:**
```graphql
mutation SendOtpCode($data: SendOtpCodeInput!) {
  sendOtpCode(data: $data) {
    success
    message
  }
}
```

**Arguments:**
| Name   | Type                | Description                                                                                                             |
| ------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `data` | `SendOtpCodeInput!` | **Required.** Contains the `methodId` of the OTP method to send a code to. If omitted, sends to the **primary** method. |

**Example Variables:**
```json
{
  "data": {
    "methodId": "f0e9d8c7-b6a5-4321-fedc-ba9876543210"
  }
}
```

**Example Response:**
```json
{
  "data": {
    "sendOtpCode": {
      "success": true,
      "message": "Verification code sent to us***@email.com"
    }
  }
}
```

---

#### `verifyOtpSetup`
Verifies the OTP code to finalize and activate the new OTP method. Returns backup codes.

**GraphQL Mutation:**
```graphql
mutation VerifyOtpSetup($data: VerifyOtpSetupInput!) {
  verifyOtpSetup(data: $data) {
    success
    methodId
    backupCodes
    message
  }
}
```

**Arguments:**
| Name   | Type                   | Description                                                                |
| ------ | ---------------------- | -------------------------------------------------------------------------- |
| `data` | `VerifyOtpSetupInput!` | **Required.** Contains the `methodId` and the `code` received by the user. |

**Example Variables:**
```json
{
  "data": {
    "methodId": "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
    "code": "654321"
  }
}
```

**Example Response:**
```json
{
  "data": {
    "verifyOtpSetup": {
      "success": true,
      "methodId": "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
      "backupCodes": [
        "A1B2C3D4",
        "E5F6G7H8",
        "..."
      ],
      "message": "⚠️ CRITICAL: Save these backup codes now!"
    }
  }
}
```

---

### WebAuthn/Passkeys Mutations

#### `startWebAuthnRegistration`
Initiates the registration of a new WebAuthn credential (hardware key or passkey).

**GraphQL Mutation:**
```graphql
mutation StartWebAuthnRegistration($data: StartWebAuthnRegistrationInput) {
  startWebAuthnRegistration(data: $data) {
    challengeId
    options
    rpName
    rpId
    userDisplayName
  }
}
```

**Arguments:**
| Name   | Type                             | Description                                                       |
| ------ | -------------------------------- | ----------------------------------------------------------------- |
| `data` | `StartWebAuthnRegistrationInput` | (Optional) Can specify authenticator preferences and custom name. |

**Example Variables:**
```json
{
  "data": {
    "authenticatorName": "YubiKey 5",
    "preferPlatform": false,
    "authenticatorAttachment": "cross-platform"
  }
}
```

**Example Response:**
```json
{
  "data": {
    "startWebAuthnRegistration": {
      "challengeId": "ch_reg_1234567890",
      "options": {
        "challenge": "randomBase64Challenge==",
        "rp": {
          "name": "MedicHub",
          "id": "medichub.com"
        },
        "user": {
          "id": "userIdBase64==",
          "name": "user@example.com",
          "displayName": "John Doe"
        },
        "pubKeyCredParams": [
          { "type": "public-key", "alg": -7 },
          { "type": "public-key", "alg": -257 }
        ],
        "timeout": 60000,
        "attestation": "none",
        "authenticatorSelection": {
          "authenticatorAttachment": "cross-platform",
          "requireResidentKey": false,
          "userVerification": "preferred"
        }
      },
      "rpName": "MedicHub",
      "rpId": "medichub.com",
      "userDisplayName": "John Doe"
    }
  }
}
```

**Frontend Integration Example:**
```typescript
// 1. Get registration options from backend
const { data } = await startWebAuthnRegistration({
  variables: {
    data: {
      authenticatorName: "My Security Key",
      preferPlatform: false
    }
  }
});

// 2. Use browser WebAuthn API
const credential = await navigator.credentials.create({
  publicKey: data.startWebAuthnRegistration.options
});

// 3. Complete registration (see next mutation)
```

---

#### `completeWebAuthnRegistration`
Completes the WebAuthn registration by verifying the credential created by the browser.

**GraphQL Mutation:**
```graphql
mutation CompleteWebAuthnRegistration($data: CompleteWebAuthnRegistrationInput!) {
  completeWebAuthnRegistration(data: $data) {
    success
    methodId
    credentialId
    authenticatorName
    isPlatform
    isBackedUp
    backupCodes
    message
  }
}
```

**Arguments:**
| Name   | Type                                 | Description                                                                              |
| ------ | ------------------------------------ | ---------------------------------------------------------------------------------------- |
| `data` | `CompleteWebAuthnRegistrationInput!` | **Required.** Contains `challengeId` from previous step and `response` from the browser. |

**Example Variables:**
```json
{
  "data": {
    "challengeId": "ch_reg_1234567890",
    "response": {
      "id": "credentialIdBase64",
      "rawId": "credentialIdBase64",
      "response": {
        "clientDataJSON": "base64EncodedJSON",
        "attestationObject": "base64EncodedObject"
      },
      "type": "public-key"
    },
    "authenticatorName": "YubiKey 5"
  }
}
```

**Example Response:**
```json
{
  "data": {
    "completeWebAuthnRegistration": {
      "success": true,
      "methodId": "wauth_abc123",
      "credentialId": "base64CredentialId==",
      "authenticatorName": "YubiKey 5",
      "isPlatform": false,
      "isBackedUp": false,
      "backupCodes": [
        "A1B2C3D4",
        "E5F6G7H8",
        "..."
      ],
      "message": "WebAuthn credential registered successfully. ⚠️ Save your backup codes!"
    }
  }
}
```

---

#### `completeWebAuthnAuthentication`
Completes the WebAuthn authentication by verifying the assertion from the browser.

**GraphQL Mutation:**
```graphql
mutation CompleteWebAuthnAuthentication($data: CompleteWebAuthnAuthenticationInput!) {
  completeWebAuthnAuthentication(data: $data) {
    success
    credentialId
    authenticatorName
    counter
    message
  }
}
```

**Arguments:**
| Name   | Type                                   | Description                                                                      |
| ------ | -------------------------------------- | -------------------------------------------------------------------------------- |
| `data` | `CompleteWebAuthnAuthenticationInput!` | **Required.** Contains `challengeId` and authentication `response` from browser. |

**Example Variables:**
```json
{
  "data": {
    "challengeId": "ch_1234567890abcdef",
    "response": {
      "id": "credentialIdBase64",
      "rawId": "credentialIdBase64",
      "response": {
        "clientDataJSON": "base64EncodedJSON",
        "authenticatorData": "base64EncodedData",
        "signature": "base64Signature",
        "userHandle": "userIdBase64"
      },
      "type": "public-key"
    }
  }
}
```

**Example Response:**
```json
{
  "data": {
    "completeWebAuthnAuthentication": {
      "success": true,
      "credentialId": "base64CredentialId==",
      "authenticatorName": "YubiKey 5",
      "counter": 43,
      "message": "Successfully authenticated with WebAuthn"
    }
  }
}
```

---

#### `removeWebAuthnCredential`
Removes a registered WebAuthn credential. **Requires password confirmation.**

**GraphQL Mutation:**
```graphql
mutation RemoveWebAuthnCredential($data: RemoveWebAuthnCredentialInput!) {
  removeWebAuthnCredential(data: $data) {
    success
    message
  }
}
```

**Arguments:**
| Name   | Type                             | Description                                                                |
| ------ | -------------------------------- | -------------------------------------------------------------------------- |
| `data` | `RemoveWebAuthnCredentialInput!` | **Required.** Contains the `credentialId` to remove and user's `password`. |

**Example Variables:**
```json
{
  "data": {
    "credentialId": "base64CredentialId==",
    "password": "my-secret-password"
  }
}
```

---

### Verification Mutations

#### `verify2FA`
The universal verification endpoint used during login. It smartly detects whether the code is a 6-digit TOTP/OTP or an 8-character backup code.

**GraphQL Mutation:**
```graphql
mutation Verify2FA($data: Verify2FAInput!) {
  verify2FA(data: $data) {
    success
    message
  }
}
```

**Arguments:**
| Name   | Type              | Description                                                           |
| ------ | ----------------- | --------------------------------------------------------------------- |
| `data` | `Verify2FAInput!` | **Required.** Contains the `code` and an optional `trustDevice` flag. |

**Example Variables (TOTP/OTP code):**
```json
{
  "data": {
    "code": "123456",
    "methodId": "c1b2a3d4-e5f6-7890-1234-567890abcdef",
    "trustDevice": true
  }
}
```

**Example Variables (Backup code):**
```json
{
  "data": {
    "code": "A1B2C3D4",
    "trustDevice": false
  }
}
```

**Example Response:**
```json
{
  "data": {
    "verify2FA": {
      "success": true,
      "message": "2FA verification successful. Device has been trusted for 30 days."
    }
  }
}
```

---

#### `verifyBackupCode`
Explicitly verifies an 8-character backup code. (Alternative to `verify2FA` if you want explicit backup code handling)

**GraphQL Mutation:**
```graphql
mutation VerifyBackupCode($data: VerifyBackupCodeInput!) {
  verifyBackupCode(data: $data) {
    success
    message
  }
}
```

**Arguments:**
| Name   | Type                     | Description                              |
| ------ | ------------------------ | ---------------------------------------- |
| `data` | `VerifyBackupCodeInput!` | **Required.** Contains the `backupCode`. |

**Example Variables:**
```json
{
  "data": {
    "backupCode": "A1B2C3D4",
    "methodId": "c1b2a3d4-e5f6-7890-1234-567890abcdef"
  }
}
```

---

### Method Management Mutations

#### `update2FAMethod`
Updates a 2FA method's properties, such as its name or primary status.

**GraphQL Mutation:**
```graphql
mutation Update2FAMethod($data: Update2FAMethodInput!) {
  update2FAMethod(data: $data) {
    success
    message
  }
}
```

**Arguments:**
| Name   | Type                    | Description                                                                                       |
| ------ | ----------------------- | ------------------------------------------------------------------------------------------------- |
| `data` | `Update2FAMethodInput!` | **Required.** Contains the `methodId` and the fields to update (`name`, `isPrimary`, `isActive`). |

**Example Variables (Set as primary):**
```json
{
  "data": {
    "methodId": "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
    "isPrimary": true,
    "name": "Primary Email"
  }
}
```

**Example Variables (Rename method):**
```json
{
  "data": {
    "methodId": "c1b2a3d4-e5f6-7890-1234-567890abcdef",
    "name": "Work Phone Authenticator"
  }
}
```

---

#### `remove2FAMethod`
Permanently deletes a 2FA method. **Requires password confirmation.**

**GraphQL Mutation:**
```graphql
mutation Remove2FAMethod($data: Remove2FAMethodInput!) {
  remove2FAMethod(data: $data) {
    success
    message
  }
}
```

**Arguments:**
| Name   | Type                    | Description                                                                                                    |
| ------ | ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| `data` | `Remove2FAMethodInput!` | **Required.** Contains the `methodId` and the user's `password`. A `code` is required if it's the last method. |

**Example Variables (Removing a secondary method):**
```json
{
  "data": {
    "methodId": "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
    "password": "my-secret-password"
  }
}
```

**Example Variables (Removing the LAST method - requires 2FA code):**
```json
{
  "data": {
    "methodId": "c1b2a3d4-e5f6-7890-1234-567890abcdef",
    "password": "my-secret-password",
    "code": "123456"
  }
}
```

**Example Response:**
```json
{
  "data": {
    "remove2FAMethod": {
      "success": true,
      "message": "2FA method removed successfully"
    }
  }
}
```

---

### Backup Codes Management

#### `regenerateBackupCodes`
Generates a new set of backup codes, invalidating all old ones. **Requires password confirmation.**

**GraphQL Mutation:**
```graphql
mutation RegenerateBackupCodes($data: RegenerateBackupCodesInput!) {
  regenerateBackupCodes(data: $data) {
    success
    backupCodes
    message
  }
}
```

**Arguments:**
| Name   | Type                          | Description                                                              |
| ------ | ----------------------------- | ------------------------------------------------------------------------ |
| `data` | `RegenerateBackupCodesInput!` | **Required.** Contains the user's `password` and an optional `methodId`. |

**Example Variables (for a specific method):**
```json
{
  "data": {
    "methodId": "c1b2a3d4-e5f6-7890-1234-567890abcdef",
    "password": "my-secret-password"
  }
}
```

**Example Variables (for all methods):**
```json
{
  "data": {
    "password": "my-secret-password"
  }
}
```

**Example Response:**
```json
{
  "data": {
    "regenerateBackupCodes": {
      "success": true,
      "backupCodes": [
        "X1Y2Z3A4",
        "B5C6D7E8",
        "F9G0H1I2",
        "..."
      ],
      "message": "⚠️ CRITICAL: New backup codes generated. Old codes are now invalid. Save these immediately!"
    }
  }
}
```

---

### Device Trust Management

#### `revokeDeviceTrust`
Revokes the "trusted" status of a device, forcing 2FA on the next login from it.

**GraphQL Mutation:**
```graphql
mutation RevokeDeviceTrust($deviceId: String!) {
  revokeDeviceTrust(deviceId: $deviceId) {
    success
    message
  }
}
```

**Arguments:**
| Name       | Type      | Description                                                                                    |
| ---------- | --------- | ---------------------------------------------------------------------------------------------- |
| `deviceId` | `String!` | **Required.** The `deviceId` of the device to revoke (obtained from `myTrustedDevices` query). |

**Example Variables:**
```json
{
  "deviceId": "a1b2c3d4e5f6..."
}
```

**Example Response:**
```json
{
  "data": {
    "revokeDeviceTrust": {
      "success": true,
      "message": "Device trust revoked successfully"
    }
  }
}
```

---

## 👨‍💼 Admin Operations

**⚠️ Important:** All admin operations require the user to have `SUPER_ADMIN` role. Unauthorized access will result in a `FORBIDDEN` error.

### Admin Queries

#### `adminGetUser2FAStatus`
Retrieves comprehensive 2FA status for any user (admin view).

**GraphQL Query:**
```graphql
query AdminGetUser2FAStatus($userId: String!) {
  adminGetUser2FAStatus(userId: $userId) {
    userId
    email
    is2FAEnabled
    preferred2FAMethod
    methods {
      id
      method
      name
      isActive
      isPrimary
      lastUsedAt
      useCount
      createdAt
    }
    trustedDevices {
      id
      deviceId
      name
      browser
      os
      trustScore
      lastIp
      lastCountry
      lastCity
      lastSeenAt
      isActive
    }
    backupCodesRemaining
    riskScore
    recentEvents {
      id
      event
      severity
      ip
      country
      city
      resolved
      createdAt
    }
  }
}
```

**Arguments:**
| Name     | Type      | Description                                |
| -------- | --------- | ------------------------------------------ |
| `userId` | `String!` | **Required.** The ID of the user to query. |

**Example Variables:**
```json
{
  "userId": "user_abc123xyz"
}
```

---

#### `adminGetUserSecurityEvents`
Retrieves security events for a specific user with optional filtering.

**GraphQL Query:**
```graphql
query AdminGetUserSecurityEvents($data: GetUserSecurityEventsInput!) {
  adminGetUserSecurityEvents(data: $data) {
    id
    event
    severity
    ip
    country
    city
    resolved
    createdAt
  }
}
```

**Arguments:**
| Name   | Type                          | Description                                                                             |
| ------ | ----------------------------- | --------------------------------------------------------------------------------------- |
| `data` | `GetUserSecurityEventsInput!` | **Required.** Contains `userId` and optional filters (`events`, `severities`, `limit`). |

**Example Variables:**
```json
{
  "data": {
    "userId": "user_abc123xyz",
    "limit": 50,
    "severities": ["HIGH", "CRITICAL"],
    "events": ["TWO_FA_FAILED", "SUSPICIOUS_LOGIN", "BRUTE_FORCE_DETECTED"]
  }
}
```

---

#### `adminGetUserTrustedDevices`
Retrieves all trusted devices for a specific user.

**GraphQL Query:**
```graphql
query AdminGetUserTrustedDevices($userId: String!) {
  adminGetUserTrustedDevices(userId: $userId) {
    id
    deviceId
    name
    browser
    os
    trustScore
    lastIp
    lastCountry
    lastCity
    lastSeenAt
    isActive
  }
}
```

---

### Admin Mutations

#### `adminDisableUser2FA`
Completely disables 2FA for a user (emergency access recovery).

**GraphQL Mutation:**
```graphql
mutation AdminDisableUser2FA($data: DisableUser2FAInput!) {
  adminDisableUser2FA(data: $data) {
    success
    message
    affectedUserId
    auditLogId
  }
}
```

**Arguments:**
| Name   | Type                   | Description                                                                             |
| ------ | ---------------------- | --------------------------------------------------------------------------------------- |
| `data` | `DisableUser2FAInput!` | **Required.** Contains `userId`, `reason` for audit, and optional `notifyUser` boolean. |

**Example Variables:**
```json
{
  "data": {
    "userId": "user_abc123xyz",
    "reason": "User lost access to all 2FA methods and backup codes. Verified identity via support ticket #12345.",
    "notifyUser": true
  }
}
```

**Example Response:**
```json
{
  "data": {
    "adminDisableUser2FA": {
      "success": true,
      "message": "2FA has been disabled for user. Audit log created.",
      "affectedUserId": "user_abc123xyz",
      "auditLogId": "audit_xyz789"
    }
  }
}
```

---

#### `adminRevokeUserDevice`
Revokes trust for a specific device of a user.

**GraphQL Mutation:**
```graphql
mutation AdminRevokeUserDevice($data: RevokeUserDeviceInput!) {
  adminRevokeUserDevice(data: $data) {
    success
    message
    affectedUserId
    auditLogId
  }
}
```

**Arguments:**
| Name   | Type                     | Description                                                          |
| ------ | ------------------------ | -------------------------------------------------------------------- |
| `data` | `RevokeUserDeviceInput!` | **Required.** Contains `userId`, `deviceId`, and `reason` for audit. |

**Example Variables:**
```json
{
  "data": {
    "userId": "user_abc123xyz",
    "deviceId": "device_hash_abc123",
    "reason": "Device reported as stolen by user"
  }
}
```

---

#### `adminRevokeAllUserDevices`
Revokes trust for ALL devices of a user (e.g., account compromise).

**GraphQL Mutation:**
```graphql
mutation AdminRevokeAllUserDevices($data: RevokeAllUserDevicesInput!) {
  adminRevokeAllUserDevices(data: $data) {
    success
    message
    affectedUserId
    auditLogId
  }
}
```

**Arguments:**
| Name   | Type                         | Description                                             |
| ------ | ---------------------------- | ------------------------------------------------------- |
| `data` | `RevokeAllUserDevicesInput!` | **Required.** Contains `userId` and `reason` for audit. |

**Example Variables:**
```json
{
  "data": {
    "userId": "user_abc123xyz",
    "reason": "Suspected account compromise. All devices revoked as precaution."
  }
}
```

---

## 📘 GraphQL Types (Data Structures)

> Справочник по типам схемы для Unified 2FA System в удобном табличном формате.  
> **Обозначения:** `!` — обязательное поле, без `!` — необязательное (nullable).

---

### Core 2FA Types

#### `TotpSetup`
Содержит все необходимое для начала настройки TOTP (Authenticator App).

| Поле             | Тип       | Описание                                                                                |
| ---------------- | --------- | --------------------------------------------------------------------------------------- |
| `methodId`       | `String!` | Временный ID (`"temp"`). Не используется на клиенте.                                    |
| `qrCodeUrl`      | `String!` | Data URL (`data:image/png;base64,...`) для отображения QR-кода.                         |
| `manualEntryKey` | `String!` | Секретный ключ для ручного ввода (**используется в `completeTotpSetup` как `secret`**). |
| `issuer`         | `String!` | Название приложения (например, `MedicHub`).                                             |
| `accountName`    | `String!` | Имя аккаунта (обычно email пользователя) для отображения в приложении-аутентификаторе.  |

---

#### `OtpSetup`
Ответ после начала настройки OTP (Email/SMS).

| Поле          | Тип       | Описание                                                                                      |
| ------------- | --------- | --------------------------------------------------------------------------------------------- |
| `methodId`    | `String!` | ID созданного метода. Используется для отправки и верификации кода.                           |
| `destination` | `String!` | Маскированный адрес назначения (email/phone), например `us***@example.com` или `+1*****6789`. |
| `message`     | `String!` | Сервисное сообщение/подсказка для пользователя.                                               |

---

#### `TwoFactorMethod`
Представляет один настроенный метод 2FA.

| Поле         | Тип           | Описание                                                       |
| ------------ | ------------- | -------------------------------------------------------------- |
| `id`         | `String!`     | Уникальный ID метода.                                          |
| `method`     | `E2FAMethod!` | Тип метода (например, `TOTP`, `OTP_EMAIL`, `WEBAUTHN`).        |
| `name`       | `String`      | Пользовательское имя метода *(optional)*.                      |
| `isActive`   | `Boolean!`    | Активен ли метод.                                              |
| `isPrimary`  | `Boolean!`    | Является ли основным методом.                                  |
| `lastUsedAt` | `DateTime`    | Метка времени последнего успешного использования *(optional)*. |
| `useCount`   | `Int!`        | Суммарное число успешных использований.                        |
| `createdAt`  | `DateTime!`   | Метка времени создания.                                        |

---

#### `TwoFactorMethodsList`
Ответ на запрос `my2FAMethods`, содержащий сводную информацию.

| Поле           | Тип                   | Описание                                                         |
| -------------- | --------------------- | ---------------------------------------------------------------- |
| `methods`      | `[TwoFactorMethod!]!` | Массив всех активных методов 2FA пользователя.                   |
| `primary`      | `TwoFactorMethod`     | Метод, помеченный как основной. `null`, если такового нет.       |
| `totalActive`  | `Int!`                | Общее количество активных методов.                               |
| `is2FAEnabled` | `Boolean!`            | Глобальный флаг, показывающий, включена ли 2FA для пользователя. |

---

#### `TwoFactorSetupComplete`
Ответ после успешного завершения настройки любого 2FA метода.

| Поле          | Тип          | Описание                                                                                    |
| ------------- | ------------ | ------------------------------------------------------------------------------------------- |
| `success`     | `Boolean!`   | Всегда `true` в случае успеха.                                                              |
| `methodId`    | `String!`    | ID созданного и активированного метода.                                                     |
| `backupCodes` | `[String!]!` | **⚠️ КРИТИЧНО:** Массив из 10 одноразовых резервных кодов. **Показывается только один раз!** |
| `message`     | `String!`    | Сообщение-предупреждение о необходимости сохранить коды.                                    |

---

#### `BackupCodesStatus`
Информация о состоянии резервных кодов.

| Поле        | Тип        | Описание                                                        |
| ----------- | ---------- | --------------------------------------------------------------- |
| `total`     | `Int!`     | Общее количество сгенерированных кодов (обычно 10).             |
| `used`      | `Int!`     | Количество уже использованных кодов.                            |
| `remaining` | `Int!`     | Количество оставшихся, неиспользованных кодов.                  |
| `expired`   | `Int!`     | Количество кодов, срок действия которых истек (если применимо). |
| `isLow`     | `Boolean!` | `true`, если количество оставшихся кодов меньше или равно 3.    |

---

#### `BackupCodesRegenerated`
Ответ после успешной регенерации резервных кодов.

| Поле          | Тип          | Описание                                                                             |
| ------------- | ------------ | ------------------------------------------------------------------------------------ |
| `success`     | `Boolean!`   | Всегда `true` в случае успеха.                                                       |
| `backupCodes` | `[String!]!` | **⚠️ КРИТИЧНО:** Новый набор из 10 резервных кодов. **Показывается только один раз!** |
| `message`     | `String!`    | Сообщение-предупреждение.                                                            |

---

#### `TwoFactorSuccess`
Универсальный ответ для простых мутаций.

| Поле      | Тип        | Описание                                 |
| --------- | ---------- | ---------------------------------------- |
| `success` | `Boolean!` | `true` в случае успеха.                  |
| `message` | `String`   | *(Optional)* Сообщение с подтверждением. |

---

### WebAuthn/Passkeys Types

#### `WebAuthnRegistrationOptions`
Опции для начала регистрации WebAuthn credential.

| Поле              | Тип       | Описание                                                             |
| ----------------- | --------- | -------------------------------------------------------------------- |
| `challengeId`     | `String!` | ID вызова для регистрации (используется на шаге `complete`).         |
| `options`         | `JSON!`   | Объект опций WebAuthn (передаётся в `navigator.credentials.create`). |
| `rpName`          | `String!` | Имя Relying Party (название приложения).                             |
| `rpId`            | `String!` | ID Relying Party (домен, например `medichub.com`).                   |
| `userDisplayName` | `String!` | Имя пользователя для отображения в аутентификаторе.                  |

---

#### `WebAuthnRegistrationComplete`
Результат завершения регистрации WebAuthn.

| Поле                | Тип          | Описание                                                                                |
| ------------------- | ------------ | --------------------------------------------------------------------------------------- |
| `success`           | `Boolean!`   | Признак успеха.                                                                         |
| `methodId`          | `String!`    | ID созданного метода.                                                                   |
| `credentialId`      | `String!`    | ID учётных данных WebAuthn (base64url).                                                 |
| `authenticatorName` | `String`     | Название аутентификатора *(optional)*.                                                  |
| `isPlatform`        | `Boolean!`   | Платформенный ли аутентификатор (Touch ID / Face ID / Windows Hello).                   |
| `isBackedUp`        | `Boolean!`   | Резервируется ли credential в облаке (iCloud Keychain, Google Password Manager и т.д.). |
| `backupCodes`       | `[String!]!` | **⚠️** Коды восстановления (показываются один раз).                                      |
| `message`           | `String!`    | Сообщение об успехе.                                                                    |

---

#### `WebAuthnAuthenticationOptions`
Опции для начала аутентификации WebAuthn.

| Поле              | Тип       | Описание                                                             |
| ----------------- | --------- | -------------------------------------------------------------------- |
| `challengeId`     | `String!` | ID вызова для аутентификации.                                        |
| `options`         | `JSON!`   | Объект опций WebAuthn (передаётся в `navigator.credentials.get`).    |
| `rpId`            | `String!` | ID Relying Party.                                                    |
| `credentialCount` | `Int!`    | Количество зарегистрированных учётных данных для этого пользователя. |

---

#### `WebAuthnAuthenticationComplete`
Результат завершения аутентификации WebAuthn.

| Поле                | Тип        | Описание                                                  |
| ------------------- | ---------- | --------------------------------------------------------- |
| `success`           | `Boolean!` | Признак успеха.                                           |
| `credentialId`      | `String!`  | Использованный credential ID.                             |
| `authenticatorName` | `String`   | Название аутентификатора *(optional)*.                    |
| `counter`           | `Int!`     | Обновлённый счётчик подписи (для защиты от клонирования). |
| `message`           | `String!`  | Сообщение об успехе.                                      |

---

#### `WebAuthnCredential`
Информация о зарегистрированном WebAuthn credential.

| Поле           | Тип          | Описание                                                     |
| -------------- | ------------ | ------------------------------------------------------------ |
| `id`           | `String!`    | ID метода.                                                   |
| `credentialId` | `String!`    | Credential ID (base64url).                                   |
| `name`         | `String`     | Пользовательское имя *(optional)*.                           |
| `isPlatform`   | `Boolean!`   | Платформенный аутентификатор (встроенный в устройство).      |
| `isBackedUp`   | `Boolean!`   | Резервируется в облаке.                                      |
| `transports`   | `[String!]!` | Поддерживаемые транспорты (`usb`, `nfc`, `ble`, `internal`). |
| `lastUsedAt`   | `DateTime`   | Последнее использование *(optional)*.                        |
| `useCount`     | `Int!`       | Счётчик использований.                                       |
| `createdAt`    | `DateTime!`  | Дата создания.                                               |

---

### Device Trust Types

#### `TrustedDevice`
Информация о доверенном устройстве.

| Поле          | Тип         | Описание                                      |
| ------------- | ----------- | --------------------------------------------- |
| `id`          | `String!`   | ID записи устройства.                         |
| `deviceId`    | `String!`   | Хеш отпечатка устройства.                     |
| `name`        | `String`    | Пользовательское имя *(optional)*.            |
| `browser`     | `String!`   | Браузер (например, "Chrome").                 |
| `os`          | `String!`   | Операционная система (например, "Windows").   |
| `device`      | `String!`   | Тип устройства (`desktop`/`mobile`/`tablet`). |
| `trustScore`  | `Float!`    | Оценка доверия (0–100).                       |
| `lastCountry` | `String`    | Последняя страна *(optional)*.                |
| `lastCity`    | `String`    | Последний город *(optional)*.                 |
| `isActive`    | `Boolean!`  | Доверие активно.                              |
| `lastSeenAt`  | `DateTime!` | Последняя активность.                         |
| `expiresAt`   | `DateTime`  | Истечение доверия *(optional)*.               |
| `createdAt`   | `DateTime!` | Создано.                                      |

---

### Admin Types

#### `AdminActionSuccess`
Результат выполнения административной операции.

| Поле             | Тип        | Описание                       |
| ---------------- | ---------- | ------------------------------ |
| `success`        | `Boolean!` | Признак успеха.                |
| `message`        | `String!`  | Результат операции.            |
| `affectedUserId` | `String!`  | ID затронутого пользователя.   |
| `auditLogId`     | `String`   | ID записи аудита *(optional)*. |

---

#### `User2FAStatus`
Полный статус 2FA пользователя (административный view).

| Поле                   | Тип                          | Описание                             |
| ---------------------- | ---------------------------- | ------------------------------------ |
| `userId`               | `String!`                    | ID пользователя.                     |
| `email`                | `String!`                    | Email пользователя.                  |
| `is2FAEnabled`         | `Boolean!`                   | Флаг включения 2FA.                  |
| `preferred2FAMethod`   | `E2FAMethod`                 | Предпочтительный метод *(nullable)*. |
| `methods`              | `[TwoFactorMethodSummary!]!` | Сводка по методам.                   |
| `trustedDevices`       | `[TrustedDeviceSummary!]!`   | Сводка по доверенным устройствам.    |
| `backupCodesRemaining` | `Int!`                       | Оставшиеся коды восстановления.      |
| `riskScore`            | `Float`                      | Рисковый балл (0-100) *(optional)*.  |
| `recentEvents`         | `[SecurityEventSummary!]!`   | Последние события безопасности.      |

---

#### `TwoFactorMethodSummary`
Краткая информация о методе 2FA (для админки).

| Поле         | Тип           | Описание                              |
| ------------ | ------------- | ------------------------------------- |
| `id`         | `String!`     | ID метода.                            |
| `method`     | `E2FAMethod!` | Тип метода.                           |
| `name`       | `String`      | Имя *(optional)*.                     |
| `isActive`   | `Boolean!`    | Активен.                              |
| `isPrimary`  | `Boolean!`    | Основной.                             |
| `lastUsedAt` | `DateTime`    | Последнее использование *(optional)*. |
| `useCount`   | `Int!`        | Кол-во использований.                 |
| `createdAt`  | `DateTime!`   | Создано.                              |

---

#### `TrustedDeviceSummary`
Краткая информация об устройстве (для админки).

| Поле          | Тип         | Описание                   |
| ------------- | ----------- | -------------------------- |
| `id`          | `String!`   | ID записи.                 |
| `deviceId`    | `String!`   | ID/хеш устройства.         |
| `name`        | `String`    | Имя *(optional)*.          |
| `browser`     | `String`    | Браузер *(optional)*.      |
| `os`          | `String`    | ОС *(optional)*.           |
| `trustScore`  | `Float!`    | Балл доверия.              |
| `lastIp`      | `String`    | Последний IP *(optional)*. |
| `lastCountry` | `String`    | Страна *(optional)*.       |
| `lastCity`    | `String`    | Город *(optional)*.        |
| `lastSeenAt`  | `DateTime!` | Последняя активность.      |
| `isActive`    | `Boolean!`  | Активен.                   |

---

#### `SecurityEventSummary`
Краткая информация о событии безопасности.

| Поле        | Тип                  | Описание               |
| ----------- | -------------------- | ---------------------- |
| `id`        | `String!`            | ID события.            |
| `event`     | `ESecurityEvent!`    | Тип события.           |
| `severity`  | `ESecuritySeverity!` | Уровень важности.      |
| `ip`        | `String`             | IP *(optional)*.       |
| `country`   | `String`             | Страна *(optional)*.   |
| `city`      | `String`             | Город *(optional)*.    |
| `resolved`  | `Boolean!`           | Помечено как решённое. |
| `createdAt` | `DateTime!`          | Время создания.        |

---

### Input Types

> Поля с `!` — обязательные. Поля без `!` — необязательные.

#### Core 2FA Input Types

##### `GenerateTotpSetupInput`
| Поле   | Тип      | Описание                                  |
| ------ | -------- | ----------------------------------------- |
| `name` | `String` | Пользовательское имя метода *(optional)*. |

---

##### `CompleteTotpSetupInput`
| Поле     | Тип       | Описание                                          |
| -------- | --------- | ------------------------------------------------- |
| `secret` | `String!` | Секрет из `generateTotpSetup` (`manualEntryKey`). |
| `code`   | `String!` | 6-значный код из приложения-аутентификатора.      |
| `name`   | `String`  | Имя метода *(optional)*.                          |

---

##### `SetupOtpInput`
| Поле     | Тип           | Описание                                            |
| -------- | ------------- | --------------------------------------------------- |
| `method` | `E2FAMethod!` | `OTP_EMAIL` или `OTP_SMS`.                          |
| `email`  | `String`      | Email (обязателен для `OTP_EMAIL`).                 |
| `phone`  | `String`      | Телефон в формате E.164 (обязателен для `OTP_SMS`). |
| `name`   | `String`      | Имя метода *(optional)*.                            |

---

##### `SendOtpCodeInput`
| Поле       | Тип      | Описание                                                       |
| ---------- | -------- | -------------------------------------------------------------- |
| `methodId` | `String` | ID метода *(optional, если не указан — используется primary)*. |

---

##### `VerifyOtpSetupInput`
| Поле       | Тип       | Описание                 |
| ---------- | --------- | ------------------------ |
| `methodId` | `String!` | ID метода из `setupOtp`. |
| `code`     | `String!` | 6-значный код.           |

---

##### `Verify2FAInput`
| Поле          | Тип       | Описание                                    |
| ------------- | --------- | ------------------------------------------- |
| `code`        | `String!` | 6-значный код или 8-символьный backup code. |
| `methodId`    | `String`  | Конкретный метод *(optional)*.              |
| `trustDevice` | `Boolean` | Доверять устройству 30 дней *(optional)*.   |

---

##### `VerifyBackupCodeInput`
| Поле         | Тип       | Описание                  |
| ------------ | --------- | ------------------------- |
| `backupCode` | `String!` | 8-символьный backup code. |
| `methodId`   | `String`  | ID метода *(optional)*.   |

---

##### `Update2FAMethodInput`
| Поле        | Тип       | Описание                                  |
| ----------- | --------- | ----------------------------------------- |
| `methodId`  | `String!` | ID метода для обновления.                 |
| `name`      | `String`  | Новое имя *(optional)*.                   |
| `isPrimary` | `Boolean` | Сделать основным *(optional)*.            |
| `isActive`  | `Boolean` | Активировать/деактивировать *(optional)*. |

---

##### `Remove2FAMethodInput`
| Поле       | Тип       | Описание                                              |
| ---------- | --------- | ----------------------------------------------------- |
| `methodId` | `String!` | ID метода.                                            |
| `password` | `String!` | Пароль пользователя (подтверждение).                  |
| `code`     | `String`  | 2FA-код (обязателен, если удаляется последний метод). |

---

##### `RegenerateBackupCodesInput`
| Поле       | Тип       | Описание                                                  |
| ---------- | --------- | --------------------------------------------------------- |
| `methodId` | `String`  | Конкретный метод *(optional; если не указан — для всех)*. |
| `password` | `String!` | Пароль пользователя (подтверждение).                      |

---

#### WebAuthn Input Types

##### `StartWebAuthnRegistrationInput`
| Поле                      | Тип       | Описание                                                 |
| ------------------------- | --------- | -------------------------------------------------------- |
| `authenticatorName`       | `String`  | Имя аутентификатора *(optional)*.                        |
| `authenticatorAttachment` | `String`  | `platform` или `cross-platform` *(optional)*.            |
| `preferPlatform`          | `Boolean` | Предпочитать платформенные аутентификаторы *(optional)*. |

---

##### `CompleteWebAuthnRegistrationInput`
| Поле                | Тип       | Описание                                  |
| ------------------- | --------- | ----------------------------------------- |
| `challengeId`       | `String!` | ID вызова из `startWebAuthnRegistration`. |
| `response`          | `JSON!`   | Ответ регистрации WebAuthn из браузера.   |
| `authenticatorName` | `String`  | Имя аутентификатора *(optional)*.         |

---

##### `StartWebAuthnAuthenticationInput`
| Поле           | Тип      | Описание                            |
| -------------- | -------- | ----------------------------------- |
| `credentialId` | `String` | Конкретный credential *(optional)*. |
| `email`        | `String` | Email пользователя *(optional)*.    |

---

##### `CompleteWebAuthnAuthenticationInput`
| Поле          | Тип       | Описание                                    |
| ------------- | --------- | ------------------------------------------- |
| `challengeId` | `String!` | ID вызова из `startWebAuthnAuthentication`. |
| `response`    | `JSON!`   | Ответ аутентификации WebAuthn из браузера.  |

---

##### `RemoveWebAuthnCredentialInput`
| Поле           | Тип       | Описание                             |
| -------------- | --------- | ------------------------------------ |
| `credentialId` | `String!` | Credential ID для удаления.          |
| `password`     | `String!` | Пароль пользователя (подтверждение). |

---

#### Admin Input Types

##### `DisableUser2FAInput`
| Поле         | Тип       | Описание                                         |
| ------------ | --------- | ------------------------------------------------ |
| `userId`     | `String!` | ID пользователя.                                 |
| `reason`     | `String!` | Подробная причина отключения (для аудита).       |
| `notifyUser` | `Boolean` | Отправить уведомление пользователю *(optional)*. |

---

##### `RevokeUserDeviceInput`
| Поле       | Тип       | Описание                  |
| ---------- | --------- | ------------------------- |
| `userId`   | `String!` | ID пользователя.          |
| `deviceId` | `String!` | ID устройства для отзыва. |
| `reason`   | `String!` | Причина.                  |

---

##### `RevokeAllUserDevicesInput`
| Поле     | Тип       | Описание                  |
| -------- | --------- | ------------------------- |
| `userId` | `String!` | ID пользователя.          |
| `reason` | `String!` | Причина массового отзыва. |

---

##### `GetUserSecurityEventsInput`
| Поле         | Тип                    | Описание                                 |
| ------------ | ---------------------- | ---------------------------------------- |
| `userId`     | `String!`              | ID пользователя.                         |
| `limit`      | `Int`                  | Количество записей *(optional)*.         |
| `events`     | `[ESecurityEvent!]`    | Фильтр по типам событий *(optional)*.    |
| `severities` | `[ESecuritySeverity!]` | Фильтр по уровням важности *(optional)*. |

---

### Enums

#### `E2FAMethod`
Типы методов двухфакторной аутентификации.

| Значение      | Описание                                             |
| ------------- | ---------------------------------------------------- |
| `TOTP`        | Time-based OTP (Google Authenticator, Authy).        |
| `OTP_EMAIL`   | Одноразовый пароль по email.                         |
| `OTP_SMS`     | Одноразовый пароль по SMS.                           |
| `WEBAUTHN`    | WebAuthn/FIDO2 (аппаратные ключи, например YubiKey). |
| `PASSKEY`     | Passkeys (Touch ID, Face ID, Windows Hello).         |
| `BACKUP_CODE` | Резервные/восстановительные коды.                    |

---

#### `ESecurityEvent`
Типы событий безопасности.

| Значение                          | Описание                              |
| --------------------------------- | ------------------------------------- |
| `LOGIN_SUCCESS`                   | Успешный вход.                        |
| `LOGIN_FAILED`                    | Неуспешный вход.                      |
| `LOGOUT`                          | Выход из системы.                     |
| `SESSION_EXPIRED`                 | Истечение сессии.                     |
| `TWO_FA_ENABLED`                  | Включение 2FA.                        |
| `TWO_FA_DISABLED`                 | Отключение 2FA.                       |
| `TWO_FA_VERIFIED`                 | Успешная проверка 2FA.                |
| `TWO_FA_FAILED`                   | Ошибка проверки 2FA.                  |
| `TWO_FA_METHOD_ADDED`             | Добавлен метод 2FA.                   |
| `TWO_FA_METHOD_REMOVED`           | Удалён метод 2FA.                     |
| `TWO_FA_BACKUP_CODE_USED`         | Использован резервный код.            |
| `TWO_FA_BACKUP_CODES_REGENERATED` | Перегенерированы резервные коды.      |
| `PASSWORD_CHANGED`                | Пароль изменён.                       |
| `PASSWORD_RESET_REQUESTED`        | Запрошен сброс пароля.                |
| `PASSWORD_RESET_COMPLETED`        | Завершён сброс пароля.                |
| `ACCOUNT_CREATED`                 | Аккаунт создан.                       |
| `ACCOUNT_LOCKED`                  | Аккаунт заблокирован.                 |
| `ACCOUNT_UNLOCKED`                | Аккаунт разблокирован.                |
| `EMAIL_VERIFIED`                  | Email подтверждён.                    |
| `PHONE_VERIFIED`                  | Телефон подтверждён.                  |
| `NEW_DEVICE_DETECTED`             | Обнаружено новое устройство.          |
| `DEVICE_TRUSTED`                  | Устройство помечено как доверенное.   |
| `DEVICE_UNTRUSTED`                | С устройства снят статус доверенного. |
| `DEVICE_REVOKED`                  | Устройство отозвано.                  |
| `SUSPICIOUS_LOGIN`                | Подозрительный вход.                  |
| `UNUSUAL_LOCATION`                | Необычная локация.                    |
| `BRUTE_FORCE_DETECTED`            | Обнаружен брутфорс.                   |
| `IMPOSSIBLE_TRAVEL`               | Невозможное перемещение.              |
| `WEBAUTHN_REGISTERED`             | Зарегистрирован WebAuthn-метод.       |
| `WEBAUTHN_VERIFIED`               | WebAuthn верифицирован.               |
| `WEBAUTHN_REMOVED`                | WebAuthn удалён.                      |
| `PASSKEY_CREATED`                 | Создан passkey.                       |
| `PASSKEY_USED`                    | Использован passkey.                  |
| `PASSKEY_DELETED`                 | Удалён passkey.                       |

---

#### `ESecuritySeverity`
Уровни важности событий безопасности.

| Значение   | Описание                                    |
| ---------- | ------------------------------------------- |
| `LOW`      | Нормальная активность (информационно).      |
| `MEDIUM`   | Необычная активность (наблюдение).          |
| `HIGH`     | Подозрительная активность (алерт).          |
| `CRITICAL` | Атака/компрометация (немедленные действия). |

---

#### `EUserRole`
Роли пользователей в системе.

| Значение      | Описание                               |
| ------------- | -------------------------------------- |
| `USER`        | Роль стандартного пользователя.        |
| `SUPER_ADMIN` | Роль администратора с полным доступом. |

---

## ⚠️ Error Handling

API использует стандартный формат ошибок GraphQL. При возникновении ошибки ответ будет содержать поле `errors` вместо или вместе с полем `data`.

### Структура ответа с ошибкой

Каждая ошибка в массиве `errors` имеет следующую структуру:

```json
{
  "errors": [
    {
      "message": "The verification code is incorrect. Please check your authenticator app and try again.",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["verify2FA"],
      "extensions": {
        "code": "BAD_USER_INPUT",
        "timestamp": "2025-10-27T10:30:00.123Z",
        "originalError": {
          "message": "Invalid verification code",
          "error": "Bad Request",
          "statusCode": 400
        }
      }
    }
  ]
}
```

**Ключевые поля:**
-   **`message`**: Дружелюбное, локализованное сообщение для пользователя. **Его можно и нужно показывать напрямую в UI.**
-   **`extensions.code`**: Машиночитаемый код ошибки (например, `BAD_USER_INPUT`, `UNAUTHENTICATED`). Используется для программной логики на клиенте.
-   **`extensions.originalError.message`**: Более техническое сообщение об ошибке, полезное для отладки.

---

### Таблица кодов и сообщений об ошибках

Ниже приведен список специфичных для 2FA ошибок, которые может вернуть API.

| `message` (содержит текст)                           | `extensions.code`       | Причина                                                                                 | Действие на Frontend                                                                                                |
| :--------------------------------------------------- | :---------------------- | :-------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Setup & Configuration**                            |                         |                                                                                         |                                                                                                                     |
| `Setup session has expired`                          | `BAD_USER_INPUT`        | Пользователь потратил более 10 минут на настройку TOTP.                                 | Показать сообщение "Сессия истекла" и предложить начать настройку заново (запросить новый QR-код).                  |
| `Invalid secret provided`                            | `BAD_USER_INPUT`        | Секретный ключ, отправленный для верификации, не совпадает с тем, что был сгенерирован. | Это внутренняя ошибка, маловероятная при правильной реализации. Предложить начать заново.                           |
| `Maximum of {max} methods allowed`                   | `BAD_USER_INPUT`        | Пользователь пытается добавить больше методов, чем разрешено (обычно 5).                | Показать сообщение "Достигнут лимит методов" и предложить удалить один из существующих.                             |
| **Verification**                                     |                         |                                                                                         |                                                                                                                     |
| `The verification code is incorrect`                 | `BAD_USER_INPUT`        | Пользователь ввел неверный 6-значный код.                                               | Показать "Неверный код". Можно добавить счетчик оставшихся попыток.                                                 |
| `The backup code is invalid`                         | `BAD_USER_INPUT`        | Пользователь ввел неверный 8-значный резервный код.                                     | Показать "Неверный резервный код".                                                                                  |
| `Code has expired`                                   | `BAD_USER_INPUT`        | Срок действия OTP-кода (обычно 5 минут) истек.                                          | Показать "Срок действия кода истек" и активировать кнопку "Отправить код повторно".                                 |
| `Code does not match the method`                     | `BAD_USER_INPUT`        | Код был сгенерирован для одного метода, а верификация запрошена для другого.            | Внутренняя логическая ошибка. Попросить пользователя попробовать еще раз.                                           |
| `Too many attempts. Please try again in X minutes`   | `TOO_MANY_REQUESTS`     | Сработал rate-limit после нескольких неудачных попыток.                                 | Заблокировать форму ввода и показать сообщение с таймером: "Слишком много попыток. Попробуйте снова через X минут." |
| **Method Management**                                |                         |                                                                                         |                                                                                                                     |
| `The password you entered is incorrect`              | `UNAUTHENTICATED`       | Пароль, введенный для подтверждения удаления или регенерации, неверен.                  | Показать "Неверный пароль".                                                                                         |
| `A valid 2FA code is required to remove last method` | `BAD_USER_INPUT`        | Пользователь пытается удалить последний метод 2FA, не предоставив код подтверждения.    | Показать дополнительное поле для ввода 2FA-кода и объяснить, что это необходимо для безопасности.                   |
| `2FA method not found`                               | `BAD_USER_INPUT`        | ID метода, который пытаются удалить или обновить, не существует.                        | Обновить список методов в UI, так как он, вероятно, устарел.                                                        |
| **Communication**                                    |                         |                                                                                         |                                                                                                                     |
| `Cannot send email/SMS to this destination`          | `BAD_REQUEST`           | Адрес email или номер телефона невалиден, заблокирован или отписан.                     | Показать сообщение "Не удалось отправить код на указанный адрес/номер. Проверьте его или выберите другой метод."    |
| **WebAuthn**                                         |                         |                                                                                         |                                                                                                                     |
| `WebAuthn is not supported in this browser`          | `BAD_REQUEST`           | Браузер не поддерживает WebAuthn API.                                                   | Показать сообщение о необходимости использовать современный браузер или выбрать другой метод 2FA.                   |
| `WebAuthn challenge has expired`                     | `BAD_USER_INPUT`        | Challenge для WebAuthn истек (обычно 60 секунд).                                        | Предложить начать процесс регистрации/аутентификации заново.                                                        |
| `Invalid WebAuthn credential`                        | `BAD_USER_INPUT`        | Credential не найден или не соответствует пользователю.                                 | Показать сообщение об ошибке и предложить использовать другой метод или зарегистрировать новый ключ.                |
| **General**                                          |                         |                                                                                         |                                                                                                                     |
| `Unauthorized`                                       | `UNAUTHENTICATED`       | Сессионный токен отсутствует или недействителен.                                        | Перенаправить пользователя на страницу входа.                                                                       |
| `Forbidden resource`                                 | `FORBIDDEN`             | У пользователя нет прав на выполнение этого действия (например, админская операция).    | Показать страницу "Доступ запрещен" (403).                                                                          |
| `Internal server error`                              | `INTERNAL_SERVER_ERROR` | Ошибка на сервере, не зависящая от пользователя.                                        | Показать общее сообщение "Что-то пошло не так. Пожалуйста, попробуйте позже." и предложить связаться с поддержкой.  |

---

### Пример обработки ошибок на Frontend

Этот пример показывает, как можно обрабатывать ошибки от мутации `verify2FA`, используя `message` для пользователя и `extensions.code` для логики.

**React + TypeScript Example:**

```typescript
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { VERIFY_2FA_MUTATION } from './graphql/mutations';

interface VerificationFormProps {
  onSuccess: () => void;
}

function TwoFactorVerificationForm({ onSuccess }: VerificationFormProps) {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const [verify2FA, { loading }] = useMutation(VERIFY_2FA_MUTATION, {
    onCompleted: () => {
      onSuccess();
    },
    onError: (error) => {
      // Анализируем ошибку GraphQL
      const gqlError = error.graphQLErrors[0];
      const extensions = gqlError?.extensions;

      if (extensions?.code === 'TOO_MANY_REQUESTS') {
        // Если сработал rate-limit, извлекаем время из сообщения
        const minutesMatch = gqlError.message.match(/(\d+)\s*minutes?/);
        const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 5;
        setErrorMessage(`Too many attempts. Please try again in ${minutes} minute(s).`);
        
        // Запускаем таймер на клиенте
        let seconds = minutes * 60;
        setCooldown(seconds);
      } else if (extensions?.code === 'BAD_USER_INPUT') {
        // Для неверного кода просто показываем сообщение
        setErrorMessage(gqlError.message);
      } else if (extensions?.code === 'UNAUTHENTICATED') {
        // Сессия истекла - редирект на логин
        window.location.href = '/login';
      } else {
        // Для всех остальных ошибок показываем общее сообщение
        setErrorMessage('An error occurred. Please try again.');
        console.error('GraphQL Error:', gqlError);
      }
    },
  });

  // Таймер обратного отсчета
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Сбрасываем старую ошибку
    if (cooldown > 0) return;
    
    verify2FA({ 
      variables: { 
        data: { 
          code,
          trustDevice: true // Trust this device for 30 days
        } 
      } 
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Two-Factor Authentication</h2>
      
      <div className="mb-4">
        <label htmlFor="code" className="block text-sm font-medium mb-2">
          Enter your 6-digit code
        </label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="123456"
          disabled={loading || cooldown > 0}
          className="w-full px-4 py-2 border rounded-lg text-center text-2xl tracking-widest"
          maxLength={6}
          autoComplete="one-time-code"
        />
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || cooldown > 0 || code.length !== 6}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading 
          ? 'Verifying...' 
          : cooldown > 0 
          ? `Try again in ${formatTime(cooldown)}` 
          : 'Verify'
        }
      </button>

      <div className="mt-4 text-sm text-gray-600">
        <p>Lost access? <a href="/recover" className="text-blue-600 hover:underline">Use backup code</a></p>
      </div>
    </form>
  );
}

export default TwoFactorVerificationForm;
```

**Key Features of This Error Handling:**

1. **User-Friendly Messages**: Shows the `message` from GraphQL errors directly to users
2. **Rate Limiting**: Automatically detects rate limit errors and starts a countdown timer
3. **Auto-Redirect**: Redirects to login on authentication errors
4. **Type Safety**: Uses TypeScript for better error handling
5. **Visual Feedback**: Disables inputs during cooldown and shows clear error messages

---

**Last Updated:** 2025-10-18  
**Version:** 2.0  
**Module:** Unified 2FA System — Complete API Reference
