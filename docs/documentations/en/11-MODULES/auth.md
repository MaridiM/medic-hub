# Authentication Module Documentation

## Version: v0.0.1 (2025.12.11)

---

## Table of Contents
- [Overview](#overview)
- [Module Structure](#module-structure)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Authentication Flows](#authentication-flows)
- [2FA Implementation](#2fa-implementation)
- [Security Features](#security-features)

---

## Overview

The Authentication module is the core security module of MedicHub, providing comprehensive user authentication, authorization, and account management functionality.

### Key Capabilities
- User registration and account management
- Multi-method authentication (password, 2FA)
- Session management
- Password reset and recovery
- Email/phone verification
- Two-factor authentication (TOTP, OTP, WebAuthn)
- Security event logging

---

## Module Structure

\`\`\`
modules/auth/
├── account/              # Account management
│   ├── account.service.ts
│   ├── account.resolver.ts
│   ├── dtos/
│   ├── models/
│   └── __tests__/
├── session/              # Session management
│   ├── session.service.ts
│   ├── session.resolver.ts
│   ├── dtos/
│   ├── models/
│   └── __tests__/
├── recovery/             # Password recovery
│   ├── recovery.service.ts
│   ├── recovery.resolver.ts
│   └── dtos/
├── verification/         # Email/phone verification
│   ├── verification.service.ts
│   ├── verification.resolver.ts
│   └── dtos/
└── 2fa/                  # Two-factor authentication
    ├── services/
    │   ├── two-factor-method.service.ts
    │   ├── backup-code.service.ts
    │   ├── webauthn.service.ts
    │   └── device-trust.service.ts
    ├── resolvers/
    │   ├── 2fa.resolver.ts
    │   └── admin-2fa.resolver.ts
    ├── dtos/
    ├── models/
    ├── utils/
    └── constants/
\`\`\`

---

## Features

### Account Management
- **User Registration**: Email/password with phone (optional)
- **Profile Management**: Update name, email, phone, avatar
- **Account Deletion**: Soft delete with audit trail
- **Email Change**: Verification required for new email
- **Password Change**: Requires current password

### Session Management
- **Login**: Email/password authentication
- **Logout**: Session termination
- **Session Tracking**: All active sessions with device info
- **Session Revocation**: Remove specific or all sessions
- **Automatic Expiration**: Configurable session TTL

### Password Recovery
- **Reset Request**: Email-based password reset
- **Token Generation**: One-time use tokens with expiration
- **Password Update**: Set new password with token validation

### Email/Phone Verification
- **Email Verification**: Token-based verification
- **Phone Verification**: OTP-based verification
- **Resend Verification**: Rate-limited resend functionality

### Two-Factor Authentication
- **TOTP**: Time-based One-Time Password (Google Authenticator, Authy)
- **OTP Email**: One-time password via email
- **OTP SMS**: One-time password via SMS
- **WebAuthn**: Hardware security keys (YubiKey, etc.)
- **Passkeys**: Platform authenticators (Face ID, Touch ID, Windows Hello)
- **Backup Codes**: 12 one-time use recovery codes

---

## API Endpoints

### GraphQL Mutations

#### Account Management
\`\`\`graphql
# Create new user account
mutation CreateAccount($data: CreateAccountInput!) {
  createAccount(data: $data) {
    id
    fullName
    email
    isEmailVerified
  }
}

# Change email address
mutation ChangeEmail($data: ChangeEmailInput!) {
  changeEmail(data: $data)
}

# Change password
mutation ChangePassword($data: ChangePasswordInput!) {
  changePassword(data: $data) {
    requiresRelogin
  }
}
\`\`\`

#### Session Management
\`\`\`graphql
# User login
mutation Login($data: LoginInput!) {
  login(data: $data) {
    user {
      id
      fullName
      email
    }
    requires2FA
    preferred2FAMethod
  }
}

# Logout current session
mutation Logout {
  logout
}

# Remove specific session
mutation RemoveSession($id: String!) {
  removeSession(id: $id)
}
\`\`\`

#### Password Recovery
\`\`\`graphql
# Request password reset
mutation ResetPassword($data: ResetPasswordInput!) {
  resetPassword(data: $data)
}

# Set new password with token
mutation NewPassword($data: NewPasswordInput!) {
  newPassword(data: $data) {
    id
    fullName
  }
}
\`\`\`

#### Email Verification
\`\`\`graphql
# Send verification email
mutation SendVerificationEmail {
  sendVerificationEmail
}

# Verify email with token
mutation VerifyEmail($data: VerificationInput!) {
  verifyEmail(data: $data)
}
\`\`\`

#### Two-Factor Authentication
\`\`\`graphql
# Generate TOTP setup
mutation GenerateTotpSetup {
  generateTotpSetup {
    secret
    qrCode
    manualEntryCode
  }
}

# Complete TOTP setup
mutation CompleteTotpSetup($data: CompleteTotpSetupInput!) {
  completeTotpSetup(data: $data) {
    method
    backupCodes
  }
}

# Verify 2FA code
mutation Verify2FA($data: Verify2FAInput!) {
  verify2FA(data: $data) {
    success
  }
}

# Setup OTP (Email/SMS)
mutation SetupOtp($data: SetupOtpInput!) {
  setupOtp(data: $data) {
    method
    masked
  }
}

# Start WebAuthn registration
mutation StartWebAuthnRegistration($data: StartWebAuthnRegistrationInput!) {
  startWebAuthnRegistration(data: $data) {
    options
  }
}

# Complete WebAuthn registration
mutation CompleteWebAuthnRegistration($data: CompleteWebAuthnRegistrationInput!) {
  completeWebAuthnRegistration(data: $data) {
    method
    backupCodes
  }
}
\`\`\`

### GraphQL Queries
\`\`\`graphql
# Get current user profile
query Profile {
  profile {
    id
    fullName
    email
    phone
    is2FAEnabled
    preferred2FAMethod
  }
}

# Get current session
query CurrentSession {
  currentSession {
    id
    deviceId
    browser
    os
    lastUsedAt
  }
}

# Get all user sessions
query UserSessions {
  userSessions {
    id
    deviceId
    browser
    os
    ip
    country
    city
    isTrusted
    lastUsedAt
  }
}
\`\`\`

---

## Data Models

### User Model
\`\`\`typescript
model User {
  id: string
  fullName: string
  email: string (unique)
  phone?: string (unique)
  password: string (Argon2 hashed)

  // 2FA
  is2FAEnabled: boolean
  preferred2FAMethod?: E2FAMethod
  require2FA: boolean

  // Verification
  isEmailVerified: boolean
  emailVerifiedAt?: DateTime
  isPhoneVerified: boolean
  phoneVerifiedAt?: DateTime

  // Security
  lastLoginAt?: DateTime
  lastLoginIp?: string
  riskScore?: number
}
\`\`\`

### Session Model
\`\`\`typescript
model Session {
  id: string
  userId: string
  token: string (unique)

  // Device info
  deviceId?: string
  userAgent?: string
  browser?: string
  os?: string
  ip?: string
  country?: string
  city?: string

  // Security
  isTrusted: boolean
  riskScore?: number
  is2FAVerified: boolean

  expiresAt: DateTime
  lastUsedAt: DateTime
}
\`\`\`

### AuthenticationMethod Model
\`\`\`typescript
model AuthenticationMethod {
  id: string
  userId: string
  method: E2FAMethod  // TOTP, OTP_EMAIL, OTP_SMS, WEBAUTHN, PASSKEY
  data: Json  // Encrypted method-specific data
  name?: string
  isActive: boolean
  isPrimary: boolean
  lastUsedAt?: DateTime
}
\`\`\`

---

## Authentication Flows

### Registration Flow
1. User submits registration form (email, password, fullName, phone)
2. Server validates input (email format, password strength)
3. Password hashed with Argon2
4. User created in database
5. Verification email sent
6. User object returned

### Login Flow (Without 2FA)
1. User submits credentials (email, password)
2. Rate limit check (5 attempts / 15 min)
3. User lookup by email
4. Password verification
5. Session creation (Redis + DB)
6. Security event logged
7. Session cookie returned

### Login Flow (With 2FA)
1. Credentials verified (steps 1-4 above)
2. Check if 2FA enabled
3. Return requires2FA flag with preferred method
4. User enters 2FA code
5. Code verified
6. Session created with is2FAVerified=true
7. Session cookie returned

### Password Reset Flow
1. User requests reset (email)
2. Rate limit check (3 / 3 hours)
3. Generate unique token
4. Store token in DB (15 min expiry)
5. Send email with reset link
6. User clicks link and enters new password
7. Token validated
8. Password updated
9. All sessions revoked
10. User must login again

---

## 2FA Implementation

### TOTP (Time-based One-Time Password)
**Setup**:
1. Generate random secret (32 bytes, base32 encoded)
2. Create QR code with otpauth:// URI
3. User scans QR code with authenticator app
4. User enters verification code
5. Code verified (30-second window)
6. Secret encrypted and stored
7. 12 backup codes generated

**Verification**:
1. User enters 6-digit code
2. Server generates expected code
3. Compare with 30-second window (±1 period)
4. Update lastUsedAt if valid
5. Increment use counter

### OTP Email/SMS
**Setup**:
1. User selects OTP method (email or SMS)
2. Method activated
3. Backup codes generated

**Verification**:
1. Generate 6-digit random code
2. Store in Redis (5 min TTL)
3. Send via email or SMS
4. User enters code
5. Compare with stored value
6. Delete code from Redis on success

### WebAuthn
**Registration**:
1. Generate challenge (random bytes)
2. Create registration options
3. Send to client
4. Client calls navigator.credentials.create()
5. User authenticates with biometric/key
6. Client sends attestation response
7. Server verifies attestation
8. Store credential in DB
9. Backup codes generated

**Authentication**:
1. Fetch user credentials
2. Generate challenge
3. Create authentication options
4. Send to client
5. Client calls navigator.credentials.get()
6. User authenticates
7. Client sends assertion response
8. Server verifies assertion
9. Update credential counter

---

## Security Features

### Password Security
- **Hashing**: Argon2id (industry standard)
- **Strength Validation**: Minimum 8 characters
- **Change Protection**: Requires current password
- **Reset Protection**: One-time tokens with short expiry

### Rate Limiting
- **Login**: 5 attempts / 15 minutes
- **Password Reset**: 3 attempts / 3 hours
- **2FA Verification**: 5 attempts / 5 minutes
- **Email Verification**: 3 attempts / 15 minutes

### Account Lockout
- **Trigger**: 5 failed login attempts
- **Duration**: 30 minutes
- **Notification**: Email sent to user
- **Progressive Delays**: 50ms → 500ms → 1s per attempt

### Session Security
- **Storage**: Redis (fast) + PostgreSQL (persistent)
- **Expiration**: Configurable (default: 7 days)
- **Cookie Flags**: HttpOnly, Secure, SameSite
- **Revocation**: Manual logout or timeout
- **Device Tracking**: Full device metadata

### Security Events
All authentication events logged:
- LOGIN_SUCCESS / LOGIN_FAILED
- PASSWORD_CHANGED / PASSWORD_RESET_REQUESTED
- TWO_FA_SETUP / TWO_FA_VERIFIED / TWO_FA_FAILED
- ACCOUNT_LOCKED / ACCOUNT_DELETED
- EMAIL_CHANGED / PHONE_CHANGED

---

*For implementation details, see [10-CODE-REFERENCE/backend/modules/auth/](../../10-CODE-REFERENCE/backend/modules/auth/)*
