# 2FA Security Architecture

**Version:** 1.0  
**Last Updated:** 2025-01-28  
**Maintainer:** Security Team

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Encryption Architecture](#encryption-architecture)
3. [Data Protection Mechanisms](#data-protection-mechanisms)
4. [Security Features](#security-features)
5. [Implementation Guide](#implementation-guide)
6. [Best Practices](#best-practices)
7. [Compliance & Standards](#compliance--standards)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The 2FA (Two-Factor Authentication) system in MedicHub implements enterprise-grade security measures to protect sensitive authentication data. All 2FA method credentials (TOTP secrets, OTP destinations, WebAuthn keys) are encrypted at rest using **AES-256-GCM** before being stored in the database.

### Key Security Principles

- ✅ **Encryption at Rest**: All sensitive 2FA data is encrypted before database storage
- ✅ **Defense in Depth**: Multiple layers of validation and verification
- ✅ **Zero Trust**: Assume all external data is potentially malicious
- ✅ **Least Privilege**: Minimal access to decrypted data
- ✅ **Auditability**: All security operations are logged

---

## 🔐 Encryption Architecture

### Algorithm: AES-256-GCM

**Why AES-256-GCM?**
- **AES-256**: Industry-standard symmetric encryption with 256-bit key
- **GCM Mode**: Provides both confidentiality and authenticity (AEAD - Authenticated Encryption with Associated Data)
- **OWASP Recommended**: Meets OWASP cryptographic requirements for sensitive data

### Encryption Flow

```
┌─────────────────┐
│  Plain Data     │
│  (TOTP Secret)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Generate Random IV (16B)   │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  AES-256-GCM Encryption     │
│  Key: TWO_FA_ENCRYPTION_KEY │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Get Auth Tag (16B)         │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Format: IV:AuthTag:Cipher  │
│  Store in Database          │
└─────────────────────────────┘
```

### Encryption Format

**Stored Format:**
```
<IV (hex)>:<AuthTag (hex)>:<Ciphertext (hex)>
```

**Example:**
```
a1b2c3d4e5f6...:<16 bytes>:<encrypted data>
```

---

## 🛡️ Data Protection Mechanisms

### 1. Encryption Service

**Location:** `src/modules/auth/2fa/utils/encryption.util.ts`

```typescript
// ✅ Encrypt method data before storing
const encryptedData = EncryptionUtil.encryptJSON(methodData)

// ✅ Decrypt method data after reading
const methodData = EncryptionUtil.decryptJSON<ITotpMethodData>(encrypted)
```

### 2. Centralized Encryption Wrappers

**Location:** `src/modules/auth/2fa/services/2fa-method.service.ts`

```typescript
/**
 * All encryption/decryption goes through these private methods:
 */
private encryptMethodData<T>(data: T): string
private decryptMethodData<T>(encrypted: string, methodType?: E2FAMethod): T
```

**Benefits:**
- Single point of failure/fix
- Consistent error handling
- Centralized logging
- Easy to audit

### 3. Data Validation

**Location:** `src/modules/auth/2fa/utils/validation.util.ts`

After decryption, all data is validated using type guards:

```typescript
// ✅ Validate TOTP data structure
isTotpMethodData(data) → boolean

// ✅ Validate OTP Email data
isOtpEmailMethodData(data) → boolean

// ✅ Validate OTP SMS data  
isOtpSmsMethodData(data) → boolean
```

**Validation Rules:**

| Method Type | Required Fields | Constraints |
|-------------|----------------|-------------|
| **TOTP** | `secret`, `algorithm`, `digits`, `period`, `issuer`, `accountName` | `algorithm` ∈ {SHA1, SHA256, SHA512}<br>`digits` ∈ {6, 8}<br>`period` ∈ {30, 60} |
| **OTP_EMAIL** | `email`, `sentCount` | `email` contains `@`<br>`sentCount` ≥ 0 |
| **OTP_SMS** | `phone`, `sentCount` | `phone` starts with `+`<br>`phone.length` ≥ 10<br>`sentCount` ≥ 0 |

---

## 🔒 Security Features

### 1. Protection Against Data Tampering

**Auth Tag Verification:**
- Every encrypted payload includes a GCM authentication tag
- Tag is verified during decryption
- Tampered data fails decryption automatically

### 2. Protection Against Replay Attacks

**Unique IVs:**
- Every encryption uses a cryptographically random IV
- Same plaintext produces different ciphertexts
- Prevents pattern analysis

### 3. Protection Against Corrupted Data

**Multi-Layer Validation:**

```typescript
try {
  // Layer 1: Decryption (auth tag verification)
  const data = EncryptionUtil.decryptJSON(encrypted)
  
  // Layer 2: Structure validation
  if (!validateMethodData(data, methodType)) {
    throw new Error('Invalid structure')
  }
  
  return data
} catch (error) {
  // Layer 3: Safe failure
  throw new BadRequestException('Corrupted method data')
}
```

### 4. Legacy Data Compatibility

**Backward Compatibility:**
```typescript
// Gracefully handle unencrypted data from migration
if (typeof encrypted === 'object' && encrypted !== null) {
  logger.warn('Legacy format detected')
  // Still validate structure
  if (!validateMethodData(encrypted, methodType)) {
    throw new Error('Invalid legacy data')
  }
  return encrypted
}
```

---

## 📖 Implementation Guide

### Setting Up Encryption

**Step 1: Generate Encryption Key**

```bash
# Generate a secure 256-bit key (64 hex characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Step 2: Configure Environment**

```env
# .env
TWO_FA_ENCRYPTION_KEY=<64-character-hex-key>
```

**Step 3: Verify Key Format**

The key **must** be:
- Exactly 64 hex characters (0-9, a-f)
- Generated using a cryptographically secure random number generator
- Stored securely (never committed to version control)

### Using Encryption in Code

**Example 1: Storing TOTP Secret**

```typescript
async completeTotpSetup(user: User, input: CompleteTotpSetupInput) {
  // 1. Prepare data
  const methodData: ITotpMethodData = {
    secret: input.secret,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    issuer: APP_NAME,
    accountName: user.email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // 2. Encrypt before storing
  const encryptedData = this.encryptMethodData(methodData)

  // 3. Store encrypted string
  await this.prisma.authenticationMethod.create({
    data: {
      userId: user.id,
      method: E2FAMethod.TOTP,
      data: encryptedData, // ← Encrypted string
    },
  })
}
```

**Example 2: Reading TOTP Secret**

```typescript
async verifyTotpCode(email: string, encryptedMethodData: string, code: string) {
  // 1. Decrypt and validate
  const methodData = this.decryptMethodData<ITotpMethodData>(
    encryptedMethodData,
    E2FAMethod.TOTP // ← Type for validation
  )

  // 2. Use decrypted data
  const totp = this.createTOTP(email, methodData.secret)
  return totp.validate({ token: code })
}
```

---

## ✅ Best Practices

### DO ✅

1. **Always use the wrapper methods**
   ```typescript
   ✅ const encrypted = this.encryptMethodData(data)
   ❌ const encrypted = EncryptionUtil.encryptJSON(data) // Skip validation
   ```

2. **Always pass methodType for validation**
   ```typescript
   ✅ this.decryptMethodData(encrypted, E2FAMethod.TOTP)
   ❌ this.decryptMethodData(encrypted) // Skip validation
   ```

3. **Handle decryption errors gracefully**
   ```typescript
   ✅ try { decrypt() } catch { return false }
   ❌ const data = decrypt() // Can crash app
   ```

4. **Rotate encryption keys regularly** (every 6-12 months)

5. **Log all encryption/decryption failures** for security monitoring

### DON'T ❌

1. **Never store encryption keys in code**
   ```typescript
   ❌ const KEY = 'hardcoded-key-123'
   ✅ const KEY = process.env.TWO_FA_ENCRYPTION_KEY
   ```

2. **Never log decrypted data**
   ```typescript
   ❌ logger.log('Secret:', methodData.secret)
   ✅ logger.log('Decryption successful for method:', methodId)
   ```

3. **Never return raw decrypted data in API responses**
   ```typescript
   ❌ return { secret: methodData.secret }
   ✅ return { methodId, name, isActive }
   ```

4. **Never skip validation**
   ```typescript
   ❌ return EncryptionUtil.decryptJSON(data) // No validation
   ✅ return this.decryptMethodData(data, methodType)
   ```

---

## 📜 Compliance & Standards

### OWASP Compliance

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| **Encryption at Rest** | ✅ | AES-256-GCM |
| **Key Management** | ✅ | Environment variables, external secrets manager recommended |
| **Authentication** | ✅ | GCM auth tags |
| **Secure Random** | ✅ | Node.js `crypto.randomBytes()` |
| **Input Validation** | ✅ | Type guards + structure validation |

### GDPR Compliance

- **Right to Erasure**: All encrypted data can be permanently deleted
- **Data Minimization**: Only essential fields are stored
- **Encryption**: PII (email, phone) is encrypted before storage
- **Audit Trail**: All operations logged in `SecurityEvent` table

### HIPAA Compliance (Healthcare)

- **Access Controls**: RBAC enforced at service level
- **Encryption**: 256-bit encryption exceeds HIPAA requirements
- **Audit Logs**: All access to 2FA data is logged
- **Data Integrity**: GCM auth tags ensure data hasn't been modified

---

## 🔧 Troubleshooting

### Error: "Decryption failed"

**Possible Causes:**
1. Encryption key changed (key rotation without data re-encryption)
2. Database corruption
3. Manual data modification

**Solution:**
```typescript
// Check if legacy unencrypted data exists
if (typeof encrypted === 'object') {
  // Migrate to encrypted format
  const reencrypted = this.encryptMethodData(encrypted)
  await this.prisma.authenticationMethod.update({
    where: { id: methodId },
    data: { data: reencrypted },
  })
}
```

### Error: "Invalid data structure"

**Possible Causes:**
1. Missing required fields
2. Invalid field types
3. Schema migration incomplete

**Solution:**
```typescript
// Run validation manually
import { isTotpMethodData } from './utils/validation.util'

const data = decryptedData
if (!isTotpMethodData(data)) {
  console.log('Missing fields:', 
    Object.keys(requiredSchema).filter(k => !(k in data))
  )
}
```

### Error: "TWO_FA_ENCRYPTION_KEY is not defined"

**Solution:**
```bash
# Generate new key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env
echo "TWO_FA_ENCRYPTION_KEY=<generated-key>" >> .env
```

---

## 🔄 Key Rotation Procedure

When rotating encryption keys (recommended annually):

**Step 1: Generate New Key**
```bash
NEW_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
```

**Step 2: Set Both Keys**
```env
TWO_FA_ENCRYPTION_KEY=<old-key>
TWO_FA_ENCRYPTION_KEY_NEW=<new-key>
```

**Step 3: Run Migration Script**
```typescript
// scripts/rotate-2fa-encryption-key.ts
async function rotateKeys() {
  const methods = await prisma.authenticationMethod.findMany()
  
  for (const method of methods) {
    // Decrypt with old key
    const data = EncryptionUtil.decryptJSON(method.data, OLD_KEY)
    
    // Re-encrypt with new key
    const reencrypted = EncryptionUtil.encryptJSON(data, NEW_KEY)
    
    // Update
    await prisma.authenticationMethod.update({
      where: { id: method.id },
      data: { data: reencrypted },
    })
  }
}
```

**Step 4: Switch to New Key**
```env
TWO_FA_ENCRYPTION_KEY=<new-key>
# Remove TWO_FA_ENCRYPTION_KEY_NEW
```

---

## 📞 Support

For security concerns or questions:
- **Security Team**: security@medichub.com
- **Documentation**: `docs/2fa/`
- **Code Owner**: @security-team

---

## 📝 Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-28 | Initial security documentation |
| | | - AES-256-GCM encryption implementation |
| | | - Data validation layer |
| | | - Best practices guide |

---

**Last Review Date:** 2025-01-28  
**Next Review Due:** 2025-07-28 (6 months)
```

---
