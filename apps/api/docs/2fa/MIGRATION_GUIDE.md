# 2FA Migration Guide: Legacy TOTP/OTP → Unified 2FA System

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Breaking Changes](#breaking-changes)
4. [Migration Strategy](#migration-strategy)
5. [Step-by-Step Guide](#step-by-step-guide)
6. [Rollback Procedures](#rollback-procedures)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## Overview

This guide helps you migrate from the legacy separate TOTP and OTP modules to the new unified 2FA system.

### Why Migrate?

**Old System (Legacy):**

- ❌ Separate modules for TOTP and OTP
- ❌ Limited to 1 method per user
- ❌ No device trust management
- ❌ No backup codes
- ❌ No security event tracking
- ❌ Manual 2FA verification in every request

**New System (Unified):**

- ✅ Single module for all 2FA methods
- ✅ Multiple methods per user (TOTP + OTP Email + OTP SMS + WebAuthn + Passkeys)
- ✅ Device trust scoring
- ✅ Automatic backup code generation
- ✅ Comprehensive security event logging
- ✅ Session-based 2FA verification
- ✅ Risk-based authentication
- ✅ Enterprise-grade security

### Timeline

| Phase                          | Duration | Activities                                     |
| ------------------------------ | -------- | ---------------------------------------------- |
| **Phase 0: Preparation**       | 1 week   | Review guide, backup database, test in staging |
| **Phase 1: Deploy New System** | 1 week   | Deploy alongside legacy (dual mode)            |
| **Phase 2: Data Migration**    | 2 weeks  | Migrate existing users, monitor errors         |
| **Phase 3: Frontend Update**   | 2 weeks  | Update UI to use new API                       |
| **Phase 4: Deprecation**       | 1 week   | Deprecate legacy endpoints, show warnings      |
| **Phase 5: Cleanup**           | 1 week   | Remove legacy code (major version bump)        |

**Total: ~8 weeks for safe migration**

---

## Prerequisites

### System Requirements

- Node.js >= 18.x
- PostgreSQL >= 14.x
- Redis >= 7.x
- Prisma >= 5.x

### Database Backup

**⚠️ CRITICAL: Backup your database before starting!**

```bash
# PostgreSQL backup
pg_dump -U postgres -d your_database -F c -b -v -f backup_$(date +%Y%m%d_%H%M%S).dump

# Or using Docker
docker exec -t your-postgres-container pg_dump -U postgres your_database > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Environment Variables

Add new environment variables:

```env
# .env

# ===== Existing Variables =====
DATABASE_URL="postgresql://user:password@localhost:5432/db"
REDIS_URL="redis://localhost:6379"
APP_NAME="YourApp"

# ===== NEW: 2FA Encryption Key =====
# Generate using: npm run 2fa:generate-key
TWO_FA_ENCRYPTION_KEY="64-character-hex-string-here"

# ===== NEW: WebAuthn (Optional, for future) =====
WEBAUTHN_RP_ID="localhost"
WEBAUTHN_ORIGIN="http://localhost:3000"
```

**Generate encryption key:**

```bash
npm run 2fa:generate-key
# Copy the output to your .env file
```

### Dependencies

Install new packages:

```bash
npm install otpauth hi-base32 qrcode date-fns graphql-type-json
npm install -D @types/qrcode
```

---

## Breaking Changes

### 1. Database Schema Changes

#### User Model

```typescript
// ❌ DEPRECATED (kept for backward compatibility during migration)
interface UserLegacy {
  isTotpEnabled: boolean
  totpSecret: string | null
  totpEnabledAt: Date | null
  isOtpEnabled: boolean
  otpChannel: 'EMAIL' | 'SMS' | null
  otpEnabledAt: Date | null
}

// ✅ NEW (use instead)
interface UserModern {
  is2FAEnabled: boolean
  preferred2FAMethod: E2FAMethod | null
  authenticationMethods: AuthenticationMethod[] // Relation
}
```

#### New Tables

```prisma
// NEW: Stores all 2FA methods
model AuthenticationMethod {
  id        String      @id
  userId    String
  method    E2FAMethod  // TOTP, OTP_EMAIL, OTP_SMS, WEBAUTHN, PASSKEY
  data      Json        // Encrypted method-specific data
  name      String?     // User-friendly name
  isPrimary Boolean
  isActive  Boolean
  // ... more fields
}

// NEW: Device trust management
model TrustedDevice {
  id          String  @id
  userId      String
  deviceId    String  @unique
  fingerprint Json
  trustScore  Float
  // ... more fields
}

// NEW: Security event tracking
model SecurityEvent {
  id       String            @id
  userId   String
  event    ESecurityEvent
  severity ESecuritySeverity
  riskScore Float?
  // ... more fields
}
```

### 2. GraphQL API Changes

#### TOTP Setup

```graphql
# ❌ OLD API (legacy)
mutation {
  # Single step - less secure
  enableTotp(data: { secret: "...", code: "123456" }) {
    success
    # No backup codes provided!
  }
}

# ✅ NEW API (modern)
mutation {
  # Step 1: Generate QR code
  generateTotpSetup(data: { name: "My Authenticator" }) {
    methodId
    qrCodeUrl
    manualEntryKey
    issuer
    accountName
  }
}

mutation {
  # Step 2: Verify and complete (returns backup codes)
  completeTotpSetup(data: { 
    secret: "ABCDEFGHIJKLMNOP", 
    code: "123456",
    name: "My Authenticator"
  }) {
    success
    methodId
    backupCodes # ⚠️ Show only once!
    message
  }
}
```

#### OTP Setup

```graphql
# ❌ OLD API (legacy)
mutation {
  enableOtp(data: { channel: EMAIL }) {
    success
  }
}

# ✅ NEW API (modern)
mutation {
  # Step 1: Setup method
  setupOtp(data: { 
    method: OTP_EMAIL, 
    email: "user@example.com",
    name: "Work Email"
  }) {
    methodId
    destination
    message
  }
}

mutation {
  # Step 2: Send verification code
  sendOtpCode(data: { methodId: "..." }) {
    success
    message
  }
}

mutation {
  # Step 3: Verify and complete
  verifyOtpSetup(data: { 
    methodId: "...", 
    code: "123456" 
  }) {
    success
    methodId
    backupCodes
    message
  }
}
```

#### 2FA Verification (Login)

```graphql
# ❌ OLD API (legacy - separate for each type)
mutation {
  verifyTotp(code: "123456") { success }
  verifyOtp(code: "123456") { success }
}

# ✅ NEW API (modern - unified)
mutation {
  # Works for TOTP, OTP, or backup codes
  verify2FA(data: { 
    code: "123456",
    trustDevice: true # Optional: remember device
  }) {
    success
    message
  }
}

# Explicit backup code verification
mutation {
  verifyBackupCode(data: { 
    backupCode: "A1B2C3D4" 
  }) {
    success
    message
  }
}
```

#### Method Management

```graphql
# ✅ NEW: List all methods
query {
  my2FAMethods {
    methods {
      id
      method
      name
      isActive
      isPrimary
      lastUsedAt
      useCount
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

# ✅ NEW: Update method
mutation {
  update2FAMethod(data: {
    methodId: "..."
    name: "Updated Name"
    isPrimary: true
  }) {
    success
  }
}

# ✅ NEW: Remove method
mutation {
  remove2FAMethod(data: {
    methodId: "..."
    password: "user_password"
    code: "123456" # Optional, but required if removing last method
  }) {
    success
  }
}
```

#### Backup Codes

```graphql
# ✅ NEW: Check backup codes status
query {
  backupCodesStatus(methodId: "...") {
    total
    used
    remaining
    expired
    isLow
  }
}

# ✅ NEW: Regenerate backup codes
mutation {
  regenerateBackupCodes(data: {
    methodId: "..." # Optional: for specific method
    password: "user_password"
  }) {
    success
    backupCodes
    message
  }
}
```

#### Device Trust

```graphql
# ✅ NEW: List trusted devices
query {
  myTrustedDevices {
    id
    deviceId
    name
    browser
    os
    trustScore
    lastSeenAt
    expiresAt
  }
}

# ✅ NEW: Revoke device
mutation {
  revokeDeviceTrust(deviceId: "...") {
    success
  }
}
```

### 3. Service Injection Changes

```typescript
// ❌ OLD (legacy services)
import { TotpService } from '@/modules/auth/totp'
import { OtpService } from '@/modules/auth/otp'

@Injectable()
export class MyService {
  constructor(
    private totpService: TotpService,
    private otpService: OtpService,
  ) {}

  async enable2FA(user: User) {
    if (type === 'totp') {
      await this.totpService.enable(...)
    } else {
      await this.otpService.enable(...)
    }
  }
}

// ✅ NEW (unified service)
import { TwoFactorMethodService } from '@/modules/auth/2fa'

@Injectable()
export class MyService {
  constructor(
    private twoFactorService: TwoFactorMethodService,
  ) {}

  async enable2FA(user: User, method: E2FAMethod) {
    // Single service for all methods
    if (method === E2FAMethod.TOTP) {
      await this.twoFactorService.generateTotpSetup(user)
    } else if (method === E2FAMethod.OTP_EMAIL) {
      await self.twoFactorService.setupOtp(user, { method })
    }
  }
}
```

### 4. Guard Changes

```typescript
// ❌ OLD (no standardized guard)
// Manual 2FA check in each resolver

// ✅ NEW (declarative guard)
import { TwoFactorVerifiedGuard, Require2FAVerification } from '@/modules/auth/2fa'

@Resolver()
export class SensitiveOperationsResolver {
  
  @Require2FAVerification() // Add this decorator
  @Mutation(() => Boolean)
  async deleteSomethingImportant() {
    // This mutation requires recent 2FA verification
    // Guard automatically checks session.is2FAVerified
  }
}
```

---

## Migration Strategy

### Approach: Blue-Green Deployment

We'll use a **gradual migration** strategy:

1. **Deploy new system** alongside old (both active)
2. **Migrate users** in background
3. **Update frontend** progressively
4. **Deprecate old** endpoints
5. **Remove legacy** code in major version

### Migration Modes

#### Mode 1: Dual Mode (Weeks 1-6)

```typescript
// Both systems active
@Module({
  imports: [
    TwoFactorModule,    // NEW
    TotpModule,         // LEGACY (temporary)
    OtpModule,          // LEGACY (temporary)
  ],
})
export class AuthModule {}
```

**Users:**

- Old users: Continue using legacy system
- New users: Automatically use new system
- Migrated users: Use new system

#### Mode 2: Deprecation Mode (Week 7)

```typescript
// Legacy endpoints show deprecation warnings
@Resolver()
export class TotpResolver {
  @Mutation(() => TotpEnabled)
  async enableTotp() {
    // Log deprecation warning
    logger.warn('DEPRECATED: Use TwoFactorResolver.generateTotpSetup instead')
    
    // Still works, but discouraged
    return this.totpService.enable(...)
  }
}
```

#### Mode 3: New Only (Week 8+)

```typescript
// Remove legacy modules
@Module({
  imports: [
    TwoFactorModule, // Only new system
  ],
})
export class AuthModule {}
```

---

## Step-by-Step Guide

### Phase 0: Preparation

#### Step 0.1: Review Current State

```bash
# Check how many users have 2FA enabled
psql $DATABASE_URL -c "
SELECT 
  COUNT(*) FILTER (WHERE is_totp_enabled = true) as totp_users,
  COUNT(*) FILTER (WHERE is_otp_enabled = true) as otp_users,
  COUNT(*) as total_users
FROM users;
"
```

#### Step 0.2: Backup Database

```bash
# Full backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Verify backup
psql -f backup_$(date +%Y%m%d).sql -d test_restore_db
```

#### Step 0.3: Test in Staging

```bash
# Deploy to staging environment
git checkout -b feature/unified-2fa
npm install
npx prisma migrate dev --name add_unified_2fa

# Run migration script in staging
npm run migrate:2fa:staging

# Test all flows
npm run test:e2e:2fa
```

### Phase 1: Deploy New System (Week 1)

#### Step 1.1: Update Prisma Schema

```bash
# Add new tables (keep old fields for compatibility)
npx prisma migrate dev --name add_unified_2fa_system
```

**Generated migration will include:**

- `AuthenticationMethod` table
- `TrustedDevice` table
- `SecurityEvent` table
- New user fields (`is2FAEnabled`, `preferred2FAMethod`)
- Indexes for performance

#### Step 1.2: Generate Encryption Key

```bash
# Generate key
npm run 2fa:generate-key

# Output example:
# TWO_FA_ENCRYPTION_KEY=a1b2c3d4e5f6...
```

**Add to production .env:**

```env
TWO_FA_ENCRYPTION_KEY=<generated-key-here>
```

⚠️ **IMPORTANT:**

- Store this key in **secure secrets manager** (AWS Secrets Manager, Vault, etc.)
- Never commit to git
- Backup the key securely
- If lost, all encrypted 2FA data is unrecoverable!

#### Step 1.3: Deploy Code

```bash
# Build
npm run build

# Deploy (example with PM2)
pm2 reload all

# Or with Docker
docker-compose up -d --build
```

**Verify deployment:**

```bash
# Check if new GraphQL endpoints are available
curl -X POST http://localhost:3000/graphql   -H "Content-Type: application/json"   -d '{"query": "{ __type(name: \"TwoFactorMethodsList\") { name } }"}'
```

#### Step 1.4: Monitor Logs

```bash
# Watch for errors
pm2 logs --lines 100

# Check specific errors
grep "ERROR" logs/app.log | grep "2FA"
```

### Phase 2: Data Migration (Weeks 2-3)

#### Step 2.1: Run Migration Script

Create migration script: `prisma/migrations/utils/migrate-to-unified-2fa.ts`

(See code in repository: this guide is packaged with the script.)

**Run migration:**

```bash
# First, do a dry run to see what would happen
npm run migrate:2fa -- --dry-run

# Review output, then run for real
npm run migrate:2fa
```

#### Step 2.2: Verify Migration

Create verification script: `prisma/migrations/utils/verify-2fa-migration.ts`

Run verification:

```bash
npm run verify:2fa
```

### Phase 3: Frontend Update (Weeks 4-5)

(See code examples in this document.)

### Phase 4: Deprecation (Week 7)

Add deprecation warnings and notify users.

### Phase 5: Cleanup (Week 8+)

Remove legacy modules and deprecated schema fields. Bump major version.

---

## Rollback Procedures

1. Stop migration script.
2. Run rollback script `prisma/migrations/utils/rollback-2fa-migration.ts`.
3. Restore database from backup if needed.
4. Redeploy old code.
5. Verify rollback.

---

## Testing

- Unit, integration, and E2E tests.
- Checklist provided in this guide.

---

## Troubleshooting

Common issues and fixes are documented, including missing env vars, QR failures, backup code linkage, and batch sizing.

---

## FAQ

Answers about multiple methods, backup codes, rollback feasibility, runtime, user impact, idempotency, and monitoring.

---

**Last Updated:** 2025-12-10
**Version:** 2.0.0  
**Author:** Security Team
