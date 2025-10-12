# GraphQL API Reference (2FA System)

## 📚 Overview

This document describes all available **queries** and **mutations** for interacting with the Unified 2FA system.

---

## 🔍 Queries

### `generateTotpSetup`

Generate a new TOTP setup configuration for the user.

**Example:**

```graphql
query {
  generateTotpSetup {
    qrCodeUrl
    manualEntryKey
    issuer
    accountName
  }
}
```

**Response:**

```json
{
  "data": {
    "generateTotpSetup": {
      "qrCodeUrl": "data:image/png;base64,...",
      "manualEntryKey": "JBSWY3DPEHPK3PXP",
      "issuer": "DoctorLab",
      "accountName": "user@example.com"
    }
  }
}
```

---

### `get2faMethods`

List all active 2FA methods of the current user.

**Example:**

```graphql
query {
  get2faMethods {
    id
    method
    name
    isPrimary
    lastUsedAt
  }
}
```

---

### `getSecurityEvents`

Return the list of security-related actions for the current user.

**Example:**

```graphql
query {
  getSecurityEvents {
    id
    event
    severity
    createdAt
    ip
    country
  }
}
```

---

## ⚙️ Mutations

### `completeTotpSetup`

Activate TOTP after user enters the correct 6-digit code.

**Example:**

```graphql
mutation CompleteTotpSetup($data: CompleteTotpSetupInput!) {
  completeTotpSetup(data: $data) {
    success
    backupCodes
  }
}
```

**Variables:**

```json
{
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "code": "123456"
  }
}
```

---

### `sendOtp`

Send a one-time password (OTP) to email or SMS.

**Example:**

```graphql
mutation SendOtp($data: SendOtpInput!) {
  sendOtp(data: $data) {
    success
    channel
    expiresIn
  }
}
```

**Variables:**

```json
{ "data": { "channel": "EMAIL", "purpose": "LOGIN" } }
```

---

### `verifyOtp`

Verify a one-time password.

**Example:**

```graphql
mutation VerifyOtp($data: VerifyOtpInput!) {
  verifyOtp(data: $data) {
    success
    message
  }
}
```

---

### `disable2faMethod`

Disable a specific 2FA method.

**Example:**

```graphql
mutation Disable2faMethod($id: String!) {
  disable2faMethod(id: $id) {
    success
    message
  }
}
```

---

### `regenerateBackupCodes`

Generate a new set of backup codes.

**Example:**

```graphql
mutation {
  regenerateBackupCodes {
    success
    codes
  }
}
```

**Response:**

```json
{
  "data": {
    "regenerateBackupCodes": {
      "success": true,
      "codes": [
        "A1B2-C3D4",
        "E5F6-G7H8"
      ]
    }
  }
}
```

---

## ⚠️ Error Handling

| Code                   | Message                   | Description                              |
| ---------------------- | ------------------------- | ---------------------------------------- |
| `invalid_code`         | Invalid verification code | Code entered is incorrect                |
| `already_enabled`      | 2FA already active        | The user already has this method active  |
| `rate_limit_exceeded`  | Too many attempts         | Try again after timeout                  |
| `backup_codes_warning` | Some codes used           | User has limited codes left              |
| `not_found`            | Method not found          | User tried to remove non-existing method |

---

## 📘 Types

```graphql
type OtpSent {
  success: Boolean!
  channel: String!
  expiresIn: Int!
  message: String!
}

type TwoFactorMethod {
  id: String!
  method: String!
  name: String
  isPrimary: Boolean
  lastUsedAt: DateTime
}

type SecurityEvent {
  id: String!
  event: String!
  severity: String!
  createdAt: DateTime!
  ip: String
  country: String
}
```

---
**Last Updated:** 2025-10-12
