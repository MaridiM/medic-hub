# 2FA System Architecture

## Overview

This document describes the architecture of the unified 2FA system.

## System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     GraphQL API Layer                        │
│                   (TwoFactorResolver)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Service Layer                              │
├──────────────────┬──────────────────┬──────────────────────┤
│ TwoFactorMethod  │ BackupCode       │ DeviceTrust          │
│ Service          │ Service          │ Service              │
├──────────────────┴──────────────────┴──────────────────────┤
│               SecurityEvent Service                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Data Access Layer                           │
│                  (Prisma ORM)                                │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   PostgreSQL         Redis            External APIs
   - User data        - Sessions       - SMS (Twilio)
   - Methods          - Codes          - Email (SendGrid)
   - Events           - Rate limits    - WebAuthn
```

## Data Flow

### TOTP Setup Flow

```
1. User clicks "Enable 2FA"
   └─> Frontend calls: generateTotpSetup()
       └─> Service generates secret
           └─> Creates QR code
               └─> Stores temp secret in Redis (10 min TTL)
                   └─> Returns QR code to frontend

2. User scans QR code in authenticator app

3. User enters verification code
   └─> Frontend calls: completeTotpSetup(secret, code)
       └─> Service retrieves temp secret from Redis
           └─> Verifies code against secret
               └─> Creates AuthenticationMethod record
                   └─> Generates 10 backup codes
                       └─> Updates user.is2FAEnabled = true
                           └─> Returns backup codes (SHOW ONCE!)
```

### 2FA Login Flow

```
1. User enters username/password
   └─> Backend validates credentials
       └─> Checks user.is2FAEnabled
           └─> If true:
               └─> Creates session with is2FAVerified=false
                   └─> Returns: { requires2FA: true }

2. Frontend shows 2FA prompt

3. User enters 2FA code
   └─> Frontend calls: verify2FA(code)
       └─> Service gets primary method
           └─> Verifies code (TOTP/OTP/backup)
               └─> If valid:
                   └─> Updates session.is2FAVerified = true
                       └─> Sets session.verified2FAAt = now()
                           └─> Logs SecurityEvent
                               └─> Returns: { success: true }
```

## Database Schema

### Core Tables

#### AuthenticationMethod

```sql
CREATE TABLE authentication_methods (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  method VARCHAR(50) NOT NULL, -- TOTP, OTP_EMAIL, etc.
  data JSONB NOT NULL,         -- Encrypted method-specific data
  name VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP,
  use_count INT DEFAULT 0,
  credential_id VARCHAR(255),  -- For WebAuthn
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, method, credential_id)
);

CREATE INDEX idx_auth_methods_user ON authentication_methods(user_id);
CREATE INDEX idx_auth_methods_primary ON authentication_methods(user_id, is_primary);
```

#### TrustedDevice

```sql
CREATE TABLE trusted_devices (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  device_id VARCHAR(64) UNIQUE NOT NULL,
  fingerprint JSONB,
  name VARCHAR(255),
  user_agent TEXT,
  browser VARCHAR(100),
  os VARCHAR(100),
  device VARCHAR(50),
  trust_score FLOAT DEFAULT 0,
  last_ip VARCHAR(45),
  last_country VARCHAR(2),
  last_city VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  last_seen_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_trusted_devices_user ON trusted_devices(user_id);
CREATE INDEX idx_trusted_devices_active ON trusted_devices(user_id, is_active);
```

## Security Considerations

### Encryption

All sensitive data is encrypted at rest using AES-256-GCM:

```typescript
// TOTP secrets
{
  secret: "encrypted:iv:tag:ciphertext"
}

// Encrypted with TWO_FA_ENCRYPTION_KEY (256-bit)
```

### Rate Limiting

Protection against brute force:

```typescript
const RATE_LIMITS = {
  TOTP_VERIFY: { max: 5, window: 300 },      // 5 attempts per 5 min
  OTP_SEND: { max: 5, window: 3600 },        // 5 sends per hour
  BACKUP_CODE_USE: { max: 3, window: 3600 }, // 3 uses per hour
}
```

### Code Reuse Prevention

Used codes are blacklisted for 90 seconds:

```typescript
// After successful verification
redis.set(`totp:used:${userId}:${code}`, '1', 90)
```

## Performance

### Benchmarks

| Operation   | Target  | Actual |
| ----------- | ------- | ------ |
| Generate QR | < 500ms | ~200ms |
| Verify TOTP | < 100ms | ~50ms  |
| Verify OTP  | < 100ms | ~30ms  |
| Send SMS    | < 2s    | ~800ms |

### Optimizations

1. **Redis Caching**
   - Temp secrets cached for 10 minutes
   - Rate limit counters in memory
   - Used codes blacklist

2. **Database Indexes**
   - Composite indexes on (userId, method)
   - Index on is2FAVerified for session queries
   - Index on isPrimary for fast primary method lookup

3. **Batch Operations**
   - Backup code generation in single transaction
   - Bulk device cleanup jobs

## Monitoring

### Metrics

Track these in your monitoring system:

```typescript
// Success rates
2fa.totp.setup.success_rate
2fa.otp.verify.success_rate

// Latency
2fa.verify.duration_ms

// Errors
2fa.errors.invalid_code
2fa.errors.rate_limited

// Usage
2fa.methods.active_count
2fa.backup_codes.used_percentage
```

### Alerts

Set up alerts for:

- High verification failure rate (> 30%)
- Slow verification (> 1s p95)
- Many rate limit hits
- Encryption failures
- Low backup code remaining (< 3)

---

**Next:** [Migration Guide](./2FA_MIGRATION_GUIDE.md)
