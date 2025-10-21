# Password Management System Documentation

## 📋 Table of Contents

1. [Overview](#overview)  
2. [Architecture](#architecture)  
3. [Password Change Flow](#password-change-flow)  
4. [Password Reset Flow](#password-reset-flow)  
5. [Security Features](#security-features)  
6. [GraphQL API Reference](#graphql-api-reference)  
7. [Email Notifications](#email-notifications)  
8. [Security Best Practices](#security-best-practices)  
9. [Configuration](#configuration)  
10. [Troubleshooting](#troubleshooting)

---

## Overview

The Password Management System provides enterprise-grade password change and recovery functionality with comprehensive security features including:

- ✅ **Argon2id** password hashing (OWASP recommended)  
- ✅ **Session invalidation** across all devices  
- ✅ **Security event logging** with risk assessment  
- ✅ **Email notifications** for all password operations  
- ✅ **Email enumeration protection**  
- ✅ **Multi-language support** (EN/RU)

---

## Architecture

### Components Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Password Management System                │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
        ┌───────▼───────┐           ┌──────▼──────┐
        │ AccountService│           │RecoveryServ.│
        └───────┬───────┘           └──────┬──────┘
                │                           │
    ┌───────────┼───────────────────────────┼──────────┐
    │           │                           │          │
┌───▼───┐ ┌────▼────┐ ┌────────────┐ ┌─────▼─────┐ ┌──▼──┐
│Session│ │Security │ │    Mail    │ │  Prisma   │ │Redis│
│Service│ │  Event  │ │  Service   │ │   (PG)    │ │     │
└───────┘ └─────────┘ └────────────┘ └───────────┘ └─────┘
```

### Module Responsibilities

| Module                   | Responsibility                                   |
| ------------------------ | ------------------------------------------------ |
| **AccountService**       | Password change logic, validation, orchestration |
| **RecoveryService**      | Password reset flow, token management            |
| **SessionService**       | Session lifecycle, bulk invalidation             |
| **SecurityEventService** | Audit logging, risk scoring                      |
| **MailService**          | Email delivery, template rendering               |

---

## Password Change Flow

### 🔄 Step-by-Step Process

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant API
    participant AccountService
    participant SessionService
    participant SecurityEvent
    participant MailService
    participant Database
    participant Redis

    User->>Client: Enters old & new password
    Client->>API: mutation changePassword(data)
    
    API->>AccountService: changePassword(req, user, input)
    AccountService->>AccountService: Verify old password (Argon2id)
    
    alt Invalid old password
        AccountService-->>API: ❌ BadRequestException
        API-->>Client: Error: Invalid password
    else Same password
        AccountService-->>API: ❌ BadRequestException
        API-->>Client: Error: Passwords must differ
    else Valid
        AccountService->>AccountService: Hash new password (Argon2id)
        AccountService->>Database: UPDATE user SET password, passwordChangedAt
        
        AccountService->>SessionService: invalidateUserSessions(userId, currentSessionId)
        SessionService->>Redis: Find all user sessions
        SessionService->>Redis: DELETE sessions (except current)
        SessionService-->>AccountService: sessionsInvalidated: 3
        
        AccountService->>AccountService: Calculate risk score
        AccountService->>SecurityEvent: create(PASSWORD_CHANGED, metadata)
        SecurityEvent->>Database: INSERT security_events
        
        AccountService->>MailService: sendPasswordChangedNotification(email, metadata)
        MailService->>MailService: Render React Email template
        MailService->>MailService: Send via SMTP (non-blocking)
        
        AccountService-->>API: ✅ { success: true, sessionsInvalidated: 3 }
        API-->>Client: Success response
        Client->>User: "Password changed. Logged out from 3 devices."
    end
```

### 📝 GraphQL Example

```graphql
mutation ChangePassword {
  changePassword(data: {
    oldPassword: "current_password_123"
    newPassword: "new_secure_password_456"
  }) {
    success
    sessionsInvalidated
  }
}
```

**Response:**

```json
{
  "data": {
    "changePassword": {
      "success": true,
      "sessionsInvalidated": 3
    }
  }
}
```

### 🔐 Security Features

1. **Old Password Verification**
   - Uses Argon2id for constant-time comparison
   - Prevents unauthorized password changes

2. **Session Invalidation**
   - Logs out all other devices automatically
   - Keeps current session active for UX
   - Returns count of invalidated sessions

3. **Risk Assessment**
   ```typescript
   riskFactors = [
     { type: 'password_change', weight: 20 },
     { type: 'multiple_sessions', weight: 15 } // if > 2 sessions
   ]
   severity = LOW | MEDIUM | HIGH  // based on riskScore
   ```

4. **Email Notification**
   - Sent to user's email (non-blocking)
   - Contains IP, location, device info
   - Action links (Security Activity, Support)

---

## Password Reset Flow

### 🔄 Complete Recovery Process

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant API
    participant RecoveryService
    participant SecurityEvent
    participant MailService
    participant Database
    participant Email

    Note over User,Email: STEP 1: Request Password Reset
    
    User->>Client: Clicks "Forgot Password"
    User->>Client: Enters email address
    Client->>API: mutation resetPassword(email)
    
    API->>RecoveryService: resetPassword(req, {email}, userAgent)
    RecoveryService->>Database: findUnique(email)
    
    alt User not found
        RecoveryService->>SecurityEvent: create(PASSWORD_RESET_REQUESTED, {userExists: false})
        RecoveryService-->>API: ✅ true (enumeration protection)
    else User exists
        RecoveryService->>Database: generateToken(PASSWORD_RESET)
        RecoveryService->>SecurityEvent: create(PASSWORD_RESET_REQUESTED, metadata)
        RecoveryService->>MailService: sendPasswordResetToken(email, token, metadata)
        MailService->>Email: 📧 Reset link with token
        RecoveryService-->>API: ✅ true
    end
    
    API-->>Client: Success
    Client->>User: "Check your email"
    
    Note over User,Email: STEP 2: Complete Password Reset
    
    Email->>User: 📧 "Reset your password" email
    User->>Email: Clicks reset link
    Email->>Client: Opens /reset-password?token=xxx
    User->>Client: Enters new password
    Client->>API: mutation newPassword(token, password)
    
    API->>RecoveryService: newPassword(req, {token, password})
    RecoveryService->>Database: findUnique(token)
    
    alt Token invalid/expired
        RecoveryService-->>API: ❌ NotFoundException/BadRequestException
    else Token valid
        RecoveryService->>RecoveryService: Hash password (Argon2id)
        RecoveryService->>Database: BEGIN TRANSACTION
        RecoveryService->>Database: UPDATE user SET password
        RecoveryService->>Database: DELETE token
        RecoveryService->>Database: COMMIT
        
        RecoveryService->>SecurityEvent: create(PASSWORD_RESET_COMPLETED, metadata)
        RecoveryService->>MailService: sendPasswordResetConfirmation(email, metadata)
        MailService->>Email: 📧 "Password reset successful"
        
        RecoveryService-->>API: ✅ true
        API-->>Client: Success
        Client->>User: "Password reset! Please login."
    end
```

### 📝 GraphQL Examples

#### Step 1: Request Reset

```graphql
mutation RequestPasswordReset {
  resetPassword(data: {
    email: "user@example.com"
  })
}
```

**Response:**

```json
{
  "data": {
    "resetPassword": true
  }
}
```

> ⚠️ **Всегда возвращает `true`** для предотвращения атак email enumeration.

#### Step 2: Complete Reset

```graphql
mutation CompletePasswordReset {
  newPassword(data: {
    token: "550e8400-e29b-41d4-a716-446655440000"
    password: "new_secure_password_789"
  })
}
```

**Response:**

```json
{
  "data": {
    "newPassword": true
  }
}
```

---

## Security Features

### 🔒 Password Hashing

**Algorithm:** Argon2id (OWASP recommended 2023)

```typescript
// Configuration
{
  memoryCost: 19456, // 19 MiB
  timeCost: 2,       // 2 iterations
  parallelism: 1     // Single thread
}
```

**Why Argon2id?**

- ✅ Resistant to GPU cracking attacks  
- ✅ Resistant to side-channel attacks  
- ✅ Memory-hard algorithm  
- ✅ Winner of Password Hashing Competition (2015)

### 🛡️ Email Enumeration Protection

**Problem:** Attackers can discover valid email addresses by observing different responses.  
**Solution:**

```typescript
// ❌ BAD: Reveals if user exists
if (!user) {
  return { error: "User not found" }
}

// ✅ GOOD: Always returns success
if (!user) {
  await securityEvent.create({
    userId: 'unknown',
    event: PASSWORD_RESET_REQUESTED,
    metadata: { email, userExists: false }
  })
  return true // Same response as success
}
```

### 📊 Risk Assessment

Риск-скоринг вычисляется на основе факторов:

| Risk Factor         | Weight | Description                          |
| ------------------- | ------ | ------------------------------------ |
| `password_change`   | 20     | Base risk for password change        |
| `multiple_sessions` | 15     | User had >2 active sessions          |
| `new_device`        | 30     | Password changed from unknown device |
| `unusual_location`  | 25     | Change from new geographic location  |
| `rapid_changes`     | 40     | Multiple changes in short time       |

**Severity Mapping:**

```typescript
if (riskScore >= 50) severity = HIGH
else if (riskScore >= 30) severity = MEDIUM
else severity = LOW
```

### 🔔 Security Event Types

Все операции с паролями логируются:

- `PASSWORD_CHANGED` — пользователь изменил пароль  
- `PASSWORD_RESET_REQUESTED` — запрос на сброс пароля  
- `PASSWORD_RESET_COMPLETED` — сброс пароля успешно завершён

**Event Data Structure:**

```typescript
{
  userId: string
  event: ESecurityEvent
  severity: ESecuritySeverity
  ip: string
  userAgent: string
  country: string
  city: string
  deviceId: string
  riskScore: number
  riskFactors: RiskFactor[]
  metadata: {
    sessionsInvalidated?: number
    tokenId?: string
    browser?: string
    os?: string
  }
  createdAt: Date
}
```

---

## Email Notifications

### 📧 Password Changed Email

**Triggered:** After successful password change  
**Template:** `PasswordChangedTemplate` (React Email)  

**Content:**
- 🔒 Alert about password change  
- 📍 Change details (time, IP, location, device)  
- ⚠️ Warning if unauthorized  
- 🔗 Action buttons (View Security Activity, Contact Support)

**Languages:** EN, RU

**Example:**

```
Subject: 🔒 Your password was changed

This is to let you know that the password for your account was changed successfully.

Change Details:
⏰ Time: January 27, 2025 at 2:30 PM
💻 IP Address: 192.168.1.100
🌍 Location: New York, USA
🌐 Browser: Chrome
📱 Operating System: Windows

⚠️ Wasn't you?
If you did not make this change, your account may be compromised.
Please contact support immediately.

[View Security Activity] [Contact Support]
```

### 📧 Password Reset Request Email

**Triggered:** When user requests password reset  
**Template:** `ResetPasswordTemplate` (React Email) — *to be created*  

**Content:**
- 🔑 Reset password link with token  
- 📍 Request details (time, IP, location, device)  
- ⚠️ Ignore if not requested  
- ⏱️ Token expiration notice (1 hour)

### 📧 Password Reset Confirmation Email

**Triggered:** After successful password reset  
**Template:** `PasswordResetConfirmationTemplate` (React Email)

**Content:**
- ✅ Success confirmation  
- 📍 Reset details (time, IP, location, device)  
- 🔐 Security recommendations  
- 🔗 Action buttons (Enable 2FA, View Security Activity)

**Example:**

```
Subject: ✅ Password successfully reset

Your password reset request has been completed successfully.
You can now log in with your new password.

✅ Success!
Your password has been reset and you can now log in with your new password.

Reset Details:
⏰ Reset Time: January 27, 2025 at 3:15 PM
💻 IP Address: 192.168.1.100
🌍 Location: New York, USA

🔐 Security Recommendations
• Enable two-factor authentication (2FA) for additional security
• Use a unique password that you don't use on other websites
• Review your recent security activity regularly
• Never share your password with anyone

[Enable 2FA Now]

View Security Activity →

If you did not request this password reset, please contact support immediately.
```

---

## GraphQL API Reference

### Mutations

#### `changePassword` — Change authenticated user's password

```graphql
mutation ChangePassword($data: ChangePasswordInput!) {
  changePassword(data: $data) {
    success
    sessionsInvalidated
  }
}
```

**Input:**

```typescript
{
  oldPassword: string  // Current password (min 8 chars)
  newPassword: string  // New password (min 8 chars, must differ)
}
```

**Output:**

```typescript
{
  success: boolean
  sessionsInvalidated: number  // Count of logged out sessions
}
```

**Errors:**

| Error                 | Description                             |
| --------------------- | --------------------------------------- |
| `Unauthenticated`     | User not logged in                      |
| `BadRequest`          | Old password invalid or passwords match |
| `InternalServerError` | Database or unexpected error            |

---

#### `resetPassword` — Request password reset token

```graphql
mutation RequestReset($data: ResetPasswordInput!) {
  resetPassword(data: $data)
}
```

**Input:**

```typescript
{
  email: string  // User email address
}
```

**Output:**

```typescript
boolean  // Always true (enumeration protection)
```

**Behavior:**
- Always returns `true` regardless of email existence
- Sends email if user exists
- Logs security event for both cases

---

#### `newPassword` — Complete password reset with token

```graphql
mutation CompleteReset($data: NewPasswordInput!) {
  newPassword(data: $data)
}
```

**Input:**

```typescript
{
  token: string     // Reset token from email (UUID)
  password: string  // New password (min 8 chars)
}
```

**Output:**

```typescript
boolean  // true if successful
```

**Errors:**

| Error                 | Description                   |
| --------------------- | ----------------------------- |
| `NotFound`            | Token not found or wrong type |
| `BadRequest`          | Token expired                 |
| `InternalServerError` | Database error                |

---

### Queries

#### `profile` — Get current user profile

```graphql
query GetProfile {
  profile {
    id
    email
    fullName
    is2FAEnabled
    passwordChangedAt
    lastLoginAt
  }
}
```

**Authorization:** Required

---

## Security Best Practices

### For Developers

1. **Password Storage**
   - ✅ Always use Argon2id for hashing
   - ✅ Never log passwords (even hashed)
   - ✅ Store `passwordChangedAt` for audit trail

2. **Session Management**
   - ✅ Invalidate sessions on password change
   - ✅ Use secure session cookies (`httpOnly`, `secure`, `sameSite`)
   - ✅ Implement session timeout

3. **Email Security**
   - ✅ Use non-blocking email sending
   - ✅ Include security metadata in emails
   - ✅ Provide clear action buttons
   - ✅ Never include sensitive data in emails

4. **Error Handling**
   - ✅ Use generic error messages for users
   - ✅ Log detailed errors server-side
   - ✅ Prevent information leakage

5. **Rate Limiting**
   - ⚠️ TODO: Implement rate limiting on password reset
   - ⚠️ TODO: Implement account lockout after N failed attempts

### For Users

1. **Password Requirements**
   - Minimum 8 characters (current)
   - Should contain: uppercase, lowercase, numbers, symbols
   - Must differ from old password
   - ⚠️ TODO: Enforce complexity requirements

2. **Security Recommendations**
   - Enable 2FA for additional protection
   - Use unique password (not reused)
   - Use password manager
   - Review security activity regularly

3. **What to Do If Compromised**
   1. Change password immediately
   2. Check security activity log
   3. Enable 2FA if not already
   4. Contact support if suspicious activity

---

## Configuration

### Environment Variables

```bash
# SMTP Configuration (for emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Your App <noreply@yourapp.com>"

# Frontend URL (for email links)
CLIENT_URL=https://yourapp.com
FRONTEND_URL=https://yourapp.com

# Session Configuration
SESSION_FOLDER=session:
SESSION_COOKIE=connect.sid
SESSION_SECRET=your-secret-key-min-32-chars

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Database
POSTGRES_URL=postgresql://user:pass@localhost:5432/dbname
```

### Token Expiration

Default token expiration is **1 hour**:

```typescript
// In generateToken utility
expiresIn: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
```

To customize, modify `src/shared/utils/token.util.ts`.

---

## Troubleshooting

### Common Issues

#### Email not received

**Symptoms:** User doesn't receive password reset or confirmation email

**Possible Causes & Solutions:**

1. **Email in spam folder** — check spam/junk  
2. **SMTP configuration incorrect** — verify `SMTP_*` env variables (см. логи `MailService`)  
3. **Email bounced (invalid address)** — проверьте `emailBouncedAt` в БД  
4. **User unsubscribed** — проверьте `isUnsubscribed` в БД

**Debug Steps:**

```bash
# 1. Check application logs
docker-compose logs api | grep MailService

# 2. Check email sendability (Node REPL)
await mailService.canSendEmail('user@example.com')

# 3. Check SMTP connection manually
```

#### Session not invalidated

**Symptoms:** User still logged in on other devices after password change

**Possible Causes & Solutions:**

1. **Redis connection issue** — проверьте доступность Redis  
2. **Session key mismatch** — проверьте префикс `SESSION_FOLDER`

**Debug Steps:**

```bash
# 1. Inspect Redis keys
docker-compose exec redis redis-cli
> KEYS session:*
> GET session:abc123...

# 2. Compare session count before/after (GraphQL)
query {
  userSessions {
    id
    createdAt
  }
}
```

#### Password change fails

**Symptoms:** `changePassword` returns error

**Possible Causes & Solutions:**

1. **Old password incorrect** — верните сообщение “Invalid password”  
2. **Same password provided** — “New password must differ from the old one”  
3. **Database connection error** — проверьте подключение к БД

**Debug Steps:**

```bash
# Server logs
docker-compose logs api | grep AccountService

# Check user row
SELECT id, email, "passwordChangedAt" FROM users WHERE email = 'user@example.com';

# Verify password (Node REPL)
import { HashUtil } from '@/shared/utils/hash.util'
await HashUtil.verify(user.password, 'test_password')
```

#### Token expired or not found

**Symptoms:** `newPassword` fails with token error

**Possible Causes & Solutions:**

1. **Token already used** — запросить новый сброс  
2. **Token expired (>1 hour)** — запросить новый сброс  
3. **Wrong token type** — убедиться, что тип `PASSWORD_RESET`

**Debug Steps:**

```sql
-- Check token
SELECT 
  id, 
  type, 
  "expiresIn", 
  "usedAt",
  "createdAt"
FROM tokens
WHERE token = 'your-token-here';

-- Expiry/usage flags
SELECT 
  token,
  "expiresIn" < NOW() as is_expired,
  "usedAt" IS NOT NULL as is_used
FROM tokens
WHERE token = 'your-token-here';
```

---

## Appendix

### Related Documentation

- [Security Event System](./SECURITY_EVENTS.md)  
- [Session Management](./SESSION_MANAGEMENT.md)  
- [Email System](./EMAIL_SYSTEM.md)  
- [2FA Documentation](./2FA_SYSTEM.md)

### Database Schema Reference

```prisma
model User {
  password          String
  passwordChangedAt DateTime?
  // ... other fields
}

model Token {
  id        String
  token     String    @unique
  type      ETokenType // EMAIL_VERIFY, PASSWORD_RESET, etc.
  expiresIn DateTime
  userId    String?
  createdAt DateTime
  // ... other fields
}

model SecurityEvent {
  userId      String
  event       ESecurityEvent
  severity    ESecuritySeverity
  riskScore   Float?
  riskFactors Json?
  metadata    Json?
  // ... other fields
}
```

### API Response Examples

#### Successful Password Change

```json
{
  "data": {
    "changePassword": {
      "success": true,
      "sessionsInvalidated": 2
    }
  }
}
```

#### Password Change Error

```json
{
  "errors": [
    {
      "message": "Invalid password",
      "extensions": {
        "code": "BAD_REQUEST"
      }
    }
  ],
  "data": null
}
```

---

**Last Updated:** January 27, 2025  
**Version:** 1.0.0  
**Author:** Development Team
