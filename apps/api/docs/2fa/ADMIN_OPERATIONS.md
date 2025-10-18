# 2FA Administrative Operations Guide

## Overview

This guide covers administrative operations for managing user 2FA settings. All operations require `SUPER_ADMIN` role and are heavily audited for security compliance.

## Security Model

### Authorization
- All admin operations require `SUPER_ADMIN` role
- Role is verified on each request via `RolesGuard`
- Fresh role data is fetched from database

### Auditing
- Every admin action creates an `AuditLog` entry
- Critical actions create `SecurityEvent` with `CRITICAL` severity
- All actions include admin ID, timestamp, and reason

## Available Operations

### 1. Disable User 2FA

**Use Case**: Emergency access when user loses all 2FA methods

**GraphQL Mutation**:
```graphql
mutation AdminDisableUser2FA($input: DisableUser2FAInput!) {
  adminDisableUser2FA(input: $input) {
    success
    message
    affectedUserId
    auditLogId
  }
}
```

**Variables**
```json
{
  "input": {
    "userId": "user-uuid",
    "reason": "User lost phone and backup codes",
    "notifyUser": true
  }
}
```

**What it does**:
- Disables 2FA on user account
- Deactivates all authentication methods
- Deletes all backup codes
- Logs action in audit trail
- Optionally notifies user via email

### 2. Get User 2FA Status

**Use Case**: Investigate user issues or security incidents

**GraphQL Query**:
```graphql
query AdminGetUser2FAStatus($userId: ID!) {
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
    }
    trustedDevices {
      id
      deviceId
      name
      browser
      os
      trustScore
      lastCountry
      lastSeenAt
    }
    backupCodesRemaining
    riskScore
    recentEvents {
      id
      event
      severity
      ip
      country
      resolved
      createdAt
    }
  }
}
```

### 3. Revoke User Device

**Use Case**: Remove compromised or suspicious device

**GraphQL Mutation**:
```graphql
mutation AdminRevokeUserDevice($input: RevokeUserDeviceInput!) {
  adminRevokeUserDevice(input: $input) {
    success
    message
    affectedUserId
    auditLogId
  }
}
```

**Variables**
```json
{
  "input": {
    "userId": "user-uuid",
    "deviceId": "device-hash",
    "reason": "Suspicious activity detected from this device"
  }
}
```

### 4. Revoke All User Devices

**Use Case**: Account compromise, force re-authentication

**GraphQL Mutation**:
```graphql
mutation AdminRevokeAllUserDevices($input: RevokeAllUserDevicesInput!) {
  adminRevokeAllUserDevices(input: $input) {
    success
    message
    affectedUserId
  }
}
```

**Variables**
```json
{
  "input": {
    "userId": "user-uuid",
    "reason": "Account compromise suspected"
  }
}
```

**What it does**:
- Revokes all trusted devices
- Invalidates all active sessions
- Forces user to re-authenticate

### 5. Get User Security Events

**Use Case**: Review user's security history

**GraphQL Query**:
```graphql
query AdminGetUserSecurityEvents($input: GetUserSecurityEventsInput!) {
  adminGetUserSecurityEvents(input: $input) {
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

**Variables**
```json
{
  "input": {
    "userId": "user-uuid",
    "limit": 50,
    "severities": ["HIGH", "CRITICAL"]
  }
}
```

## Best Practices

### 1. Always Document Reason
Every admin action requires a reason. Be specific:
- ❌ Bad: "User request"
- ✅ Good: "User lost phone, verified identity via support ticket #12345"

### 2. Verify User Identity
Before disabling 2FA:
1. Verify user identity through alternative means
2. Check support ticket or communication history
3. Document verification method in reason field

### 3. Monitor Admin Actions
- Review audit logs regularly
- Set up alerts for critical admin actions
- Implement four-eyes principle for sensitive operations

### 4. Emergency Procedures

#### Account Lockout
1. Get user 2FA status
2. Review recent security events
3. If legitimate: Disable 2FA with clear reason
4. If suspicious: Revoke all devices first

#### Suspected Compromise
1. Immediately revoke all devices
2. Review security events
3. Contact user through verified channel
4. Re-enable 2FA only after identity verification

## Audit Trail

### AuditLog Entry
```json
{
  "userId": "admin-uuid",
  "action": "ADMIN_DISABLED_USER_2FA",
  "category": "ADMIN",
  "success": true,
  "metadata": {
    "targetUserId": "user-uuid",
    "targetEmail": "user@example.com",
    "reason": "Lost phone and backup codes",
    "previousMethod": "TOTP",
    "timestamp": "2023-10-27T10:30:00Z"
  }
}
```

### SecurityEvent Entry
```json
{
  "userId": "user-uuid",
  "event": "TWO_FA_DISABLED",
  "severity": "CRITICAL",
  "metadata": {
    "disabledBy": "admin@example.com",
    "adminId": "admin-uuid",
    "reason": "Lost phone and backup codes",
    "timestamp": "2023-10-27T10:30:00Z"
  }
}
```

## Compliance

### Data Protection
- Admin can view but not export user 2FA secrets
- All sensitive data remains encrypted
- Actions are logged but don't expose secrets

### Accountability
- Every action tied to admin's account
- Timestamp and reason required
- IP address and session recorded

### Notification
- Users should be notified of critical changes
- Email notifications include admin action reference
- Support contact information provided

## Error Handling

### Common Errors

1. **User not found**
   - Verify user ID is correct
   - Check if user was deleted

2. **Insufficient permissions**
   - Verify admin has SUPER_ADMIN role
   - Check if session is valid

3. **Device not found**
   - Device may already be revoked
   - Use getUser2FAStatus to see current devices

## Testing Admin Operations

### Test Scenarios

1. **Disable 2FA for test user**
   ```bash
   # Create test user with 2FA
   # Run admin mutation
   # Verify user can login without 2FA
   # Check audit logs
   ```

2. **Revoke suspicious device**
   ```bash
   # Identify device in user's device list
   # Revoke specific device
   # Verify sessions from that device are invalid
   ```

3. **Emergency account recovery**
   ```bash
   # Disable 2FA
   # User resets password
   # User re-enables 2FA
   # Verify audit trail complete
   ```

## Monitoring

### Key Metrics
- Number of 2FA disables per day/week
- Average time to resolve 2FA issues
- Admin actions per admin user
- Failed admin authentication attempts

### Alerts
Set up alerts for:
- Multiple 2FA disables in short period
- Admin accessing multiple user accounts rapidly
- Failed admin role checks
- Critical security events
