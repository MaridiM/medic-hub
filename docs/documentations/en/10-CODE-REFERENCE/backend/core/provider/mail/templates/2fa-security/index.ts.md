# File: core\provider\mail\templates\2fa-security\index.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/core/provider/mail/templates/2fa-security/index.ts`

## Category
Backend

## File Type
TS (index.ts)

## Size
611 characters, 19 lines

## Full Code

```typescript
// 2FA Security Notifications
export * from './2fa-method-added.template'
export * from './2fa-method-removed.template'
export * from './2fa-disabled.template'

// Device & Login
export * from './2fa-disabled.template'
export * from './suspicious-activity.template'

// Backup Codes
export * from './new-device-login.template'
export * from './low-backup-codes.template'
export * from './backup-codes-regenerated.template'

// Admin Actions
export * from './2fa-disabled-by-admin.template'
export * from './backup-codes-regenerated.template'
export * from './device-revoked-by-admin.template'

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.088Z*
