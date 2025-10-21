# Changelog

## 📋 Table of Contents
- [Changelog](#changelog)
  - [📋 Table of Contents](#-table-of-contents)
  - [Module: 2FA System Modernization](#module-2fa-system-modernization)
    - [Step 1: Prisma Schema Enhancement](#step-1-prisma-schema-enhancement)
    - [Step 2: Core Types \& Constants](#step-2-core-types--constants)
    - [Step 2.1: Fixes \& Utilities Creation](#step-21-fixes--utilities-creation)
    - [Step 2.2: Refactor Utils to Use Existing Infrastructure](#step-22-refactor-utils-to-use-existing-infrastructure)
    - [Step 3: Core 2FA Services](#step-3-core-2fa-services)
    - [Step 3.1: Main 2FA Method Service \& DTOs](#step-31-main-2fa-method-service--dtos)
    - [Step 4: GraphQL API \& Module Integration](#step-4-graphql-api--module-integration)
    - [Step 5: Migration Documentation](#step-5-migration-documentation)
    - [Step 6: Complete Documentation](#step-6-complete-documentation)
    - [Step 7: Service Integration \& Testing Foundation](#step-7-service-integration--testing-foundation)
    - [Step 8: Full Service Integration \& Type Safety](#step-8-full-service-integration--type-safety)
    - [Step 9: Type Safety Refactoring for Security Events](#step-9-type-safety-refactoring-for-security-events)
    - [Step 10: Advanced Email Validation \& Reputation](#step-10-advanced-email-validation--reputation)
    - [Step 11: Correct Security Event Logging](#step-11-correct-security-event-logging)
    - [Step 12: Final Type Safety \& Service Refactoring](#step-12-final-type-safety--service-refactoring)
    - [Step 12.1: Final Type Corrections \& Logic Enhancements](#step-121-final-type-corrections--logic-enhancements)
  - [Module: 2FA System Modernization \& RBAC Foundation](#module-2fa-system-modernization--rbac-foundation)
    - [Step 0: RBAC Foundation Implementation](#step-0-rbac-foundation-implementation)
    - [Step 0.1: TypeScript \& Session Typing Refinement](#step-01-typescript--session-typing-refinement)
    - [Step 1: Admin 2FA Management Module](#step-1-admin-2fa-management-module)
    - [Step 1.1: Admin Action Types Fix](#step-11-admin-action-types-fix)
    - [Step 2: Automated Maintenance (Cron Jobs)](#step-2-automated-maintenance-cron-jobs)
    - [Step 2.1: Cron Service Type Fixes](#step-21-cron-service-type-fixes)
    - [Step 3: WebAuthn/Passkeys Implementation](#step-3-webauthnpasskeys-implementation)
    - [Step 3.1: WebAuthn TypeScript Fixes](#step-31-webauthn-typescript-fixes)
  - [Module: Account \& Session Modules Migration](#module-account--session-modules-migration)
    - [Step 1: Prisma Schema Migration \& Model Updates](#step-1-prisma-schema-migration--model-updates)
    - [Step 1.1: Prisma Schema Migration \& Model Updates](#step-11-prisma-schema-migration--model-updates)
    - [Step 2: WebAuthn GraphQL Schema Fix](#step-2-webauthn-graphql-schema-fix)
    - [Step 2.1: WebAuthn GraphQL Schema Fix](#step-21-webauthn-graphql-schema-fix)
    - [Step 2.2: WebAuthn GraphQL Schema Fix](#step-22-webauthn-graphql-schema-fix)
  - [Module: 2FA System Modernization \& RBAC Foundation](#module-2fa-system-modernization--rbac-foundation-1)
    - [Step 1: Core Infrastructure Updates for Notifications](#step-1-core-infrastructure-updates-for-notifications)
    - [Step 2: Notification Module Foundation](#step-2-notification-module-foundation)
    - [Step 3: Email Templates \& MailService Integration](#step-3-email-templates--mailservice-integration)
    - [Step 4: i18n Nested Paths Support](#step-4-i18n-nested-paths-support)
    - [Step 5: Template \& i18n Corrections](#step-5-template--i18n-corrections)
    - [Step 6: Integration of NotificationService](#step-6-integration-of-notificationservice)
    - [Step 7: 2FA Code Verification Implementation](#step-7-2fa-code-verification-implementation)
    - [Step 7.1: Access Modifier and Method Naming Correction](#step-71-access-modifier-and-method-naming-correction)
  - [Module: Password Management \& Security Event System](#module-password-management--security-event-system)
    - [Step 1: Security Event Service Foundation (Global Module)](#step-1-security-event-service-foundation-global-module)
    - [Step 2: Session Invalidation \& Password Change Enhancement](#step-2-session-invalidation--password-change-enhancement)
    - [Step 3: Email Notifications for Password Operations (React Email)](#step-3-email-notifications-for-password-operations-react-email)
    - [Step 4: Password Reset Template \& Recovery Service Testing](#step-4-password-reset-template--recovery-service-testing)
  - [Module: Rate Limiting \& Security Hardening](#module-rate-limiting--security-hardening)
    - [Step 1: Rate Limiting Module Foundation](#step-1-rate-limiting-module-foundation)
    - [Step 2: Account Lockout \& Progressive Delays](#step-2-account-lockout--progressive-delays)
    - [Step 3: Security Headers Middleware](#step-3-security-headers-middleware)
    - [Step 4: Brute-Force Protection Integration](#step-4-brute-force-protection-integration)
  - [Module: Architecture Refactoring](#module-architecture-refactoring)
    - [Step 1: Centralize Security Module](#step-1-centralize-security-module)
    - [Step 2 (Revised): Consolidate Communication Adapters](#step-2-revised-consolidate-communication-adapters)

---

## Module: 2FA System Modernization

---

### Step 1: Prisma Schema Enhancement 

:calendar: `2025-10-11`

**Added**

- ✅ `AuthenticationMethod` — unified 2FA storage.
- ✅ `TrustedDevice` — device trust management.
- ✅ `SecurityEvent` — enhanced security audit.
- ✅ `E2FAMethod`, `ESecurityEvent`, `ESecuritySeverity` enums.
- ✅ WebAuthn/Passkey fields in schema.
- ✅ Risk-based authentication fields.
- ✅ Device fingerprinting fields.

**Changed**

- `User`: added `is2FAEnabled`, `preferred2FAMethod`, `riskScore`.
- `Session`: added `is2FAVerified`, `isTrusted`, `riskScore`.
- `BackupCode`: linked to `AuthenticationMethod`, added `expiresAt`.
- Improved indexing for performance.

**Deprecated**

- `User.isTotpEnabled` → use `AuthenticationMethod`.
- `User.isOtpEnabled` → use `AuthenticationMethod`.
- `User.totpSecret` → move to `AuthenticationMethod.data`.
- `User.otpChannel` → move to `AuthenticationMethod.data`.

---

### Step 2: Core Types & Constants 

:calendar: `2025-10-11`

**Added**

- ✅ Common 2FA types & interfaces.
- ✅ `I2FAMethodData` for each method.
- ✅ Device fingerprint types.
- ✅ Risk assessment types.
- ✅ Security event metadata types.
- ✅ Unified 2FA/device/risk constants.
- ✅ WebAuthn/Passkey config.

**Changed**

- Centralized 2FA constants.
- Standardized naming.
- Stronger type-safety via discriminated unions.

**Files Created**

- `src/modules/auth/2fa/types/index.ts`
- `src/modules/auth/2fa/types/method-data.types.ts`
- `src/modules/auth/2fa/types/device.types.ts`
- `src/modules/auth/2fa/types/risk.types.ts`
- `src/modules/auth/2fa/types/security-event.types.ts`
- `src/modules/auth/2fa/constants/index.ts`
- `src/modules/auth/2fa/constants/2fa.constants.ts`
- `src/modules/auth/2fa/constants/device.constants.ts`
- `src/modules/auth/2fa/constants/risk.constants.ts`
- `src/modules/auth/2fa/constants/webauthn.constants.ts`

---

### Step 2.1: Fixes & Utilities Creation

:calendar: `2025-10-11`

**Fixed**

- ✅ Type errors with `process.env` in constants.
- ✅ Removed invalid `as const` on dynamic objects.
- ✅ Safer config typing.

**Added**

- ✅ Device fingerprint util.
- ✅ Risk score calculator.
- ✅ Encryption util for 2FA data.
- ✅ Haversine distance helper.
- ✅ User agent parser integration.
- ✅ Utils barrel export.

---

###  Step 2.2: Refactor Utils to Use Existing Infrastructure

:calendar: `2025-10-12`

**Changed**

- ✅ Switched to `device-detector-js`; removed `ua-parser-js`.
- ✅ Integrated with existing `getSessionMetadata`.
- ✅ Reused `ISessionMetadata`.
- ✅ Updated `FingerprintUtil` to platform types.

**Removed**

- ❌ Redundant `IDeviceInfo`, `IDeviceLocation`.
- ❌ `ua-parser-js` dependency.

---

### Step 3: Core 2FA Services

:calendar: `2025-10-12`

**Added**

- ✅ `TwoFactorMethodService` — unified orchestration.
- ✅ `DeviceTrustService` — trust scoring & lifecycle.
- ✅ `BackupCodeService` — generation/verification.
- ✅ `SecurityEventService` — centralized audit.
- ✅ Risk-based auth flow & device fingerprinting.
- ✅ Robust error handling & Prisma transactions.

**Changed**

- ✅ `RiskCalculatorUtil` uses `latitude` (typo fix).

**Files Created**

- `src/modules/auth/2fa/services/index.ts`
- `src/modules/auth/2fa/services/2fa-method.service.ts`
- `src/modules/auth/2fa/services/device-trust.service.ts`
- `src/modules/auth/2fa/services/backup-code.service.ts`
- `src/modules/auth/2fa/services/security-event.service.ts`

---

### Step 3.1: Main 2FA Method Service & DTOs

:calendar: `2025-10-12`

**Added**

- ✅ Full integration with TOTP/OTP services.
- ✅ WebAuthn/Passkey foundation.
- ✅ GraphQL DTOs & response models.
- ✅ 2FA guard for route protection.
- ✅ Method priority & auto backup codes.

**Files Created**

- `src/modules/auth/2fa/services/2fa-method.service.ts`
- `src/modules/auth/2fa/dtos/index.ts`
- `src/modules/auth/2fa/dtos/setup-totp.dto.ts`
- `src/modules/auth/2fa/dtos/setup-otp.dto.ts`
- `src/modules/auth/2fa/dtos/verify-2fa.dto.ts`
- `src/modules/auth/2fa/dtos/manage-methods.dto.ts`
- `src/modules/auth/2fa/models/index.ts`
- `src/modules/auth/2fa/models/2fa-method.model.ts`
- `src/modules/auth/2fa/models/2fa-setup.model.ts`
- `src/modules/auth/2fa/guards/index.ts`
- `src/modules/auth/2fa/guards/2fa-verified.guard.ts`

---

### Step 4: GraphQL API & Module Integration

:calendar: `2025-10-12`

**Added**

- ✅ `TwoFactorResolver` (complete API).
- ✅ `TwoFactorModule`.
- ✅ Rate limits, risk-based verification, device trust, i18n.
- ✅ Full error handling.

**Features**

- TOTP setup (generate → verify → backup codes).
- OTP setup (configure → send code → verify → backup codes).
- Universal verification for TOTP/OTP/backup codes.
- Methods: list, update, remove.
- Backup codes: status, regenerate.
- Trusted devices: list, trust, revoke.
- Security events monitoring.

**Files Created**

- `src/modules/auth/2fa/2fa.resolver.ts`
- `src/modules/auth/2fa/2fa.module.ts`
- `src/modules/auth/2fa/index.ts`

---

### Step 5: Migration Documentation

:calendar: `2025-10-12`

**Added**

- ✅ Migration guide, scripts, rollback, checklist, prod notes.

**Files Created**

- `docs/2fa/MIGRATION_GUIDE.md`
- `docs/2fa/ARCHITECTURE.md`
- `prisma/migrations/utils/migrate-to-unified-2fa.ts`
- `prisma/migrations/utils/rollback-2fa-migration.ts`
- `prisma/migrations/utils/verify-2fa-migration.ts`

---

### Step 6: Complete Documentation

:calendar: `2025-10-12`

**Added**

- ✅ API reference, usage, flows, integrations, testing, troubleshooting, best practices.

**Files Created**

- `docs/2fa/ARCHITECTURE.md`
- `docs/2fa/FAQ.md`
- `docs/2fa/FLOWS.md`
- `docs/2fa/GRAPHQL_API.md`
- `docs/2fa/INTEGRATION.md`
- `docs/2fa/MIGRATION_GUIDE.md`
- `docs/2fa/QUICK_START.md`
- `docs/2fa/README.md`
- `docs/2fa/TROUBLESHOOTING.md`
- `docs/2fa/TESTING_GUIDE.md`

---

### Step 7: Service Integration & Testing Foundation

:calendar: `2025-10-12`

**Added**

- ✅ Email template `otp-code.tsx`.
- ✅ `MailService.sendOtpCodeEmail`.
- ✅ Unit test skeletons for 2FA services.
- ✅ `try...catch` around OTP delivery.

**Changed**

- ✅ `TwoFactorMethodService` now uses `MailService` & `SmsService`.
- ✅ `sendOtpCode` delivers real emails/SMS.
- ✅ `TwoFactorModule` wires mail/SMS deps.

**Files Created**

- `src/modules/libs/mail/templates/otp-code.tsx`
- `src/modules/auth/2fa/services/2fa-method.service.spec.ts`
- `src/modules/auth/2fa/services/backup-code.service.spec.ts`
- `src/modules/auth/2fa/services/device-trust.service.spec.ts`
- `src/modules/auth/2fa/services/security-event.service.spec.ts`

**Files Modified**

- `src/modules/libs/mail/mail.service.ts`
- `src/modules/libs/mail/templates/index.ts`
- `src/modules/auth/2fa/services/2fa-method.service.ts`
- `src/modules/auth/2fa/2fa.module.ts`

---

### Step 8: Full Service Integration & Type Safety

:calendar: `2025-10-12`

**Added**

- ✅ `SecurityEventService` integration & auditing.

**Changed**

- ✅ `TwoFactorMethodService` delegates security logging.

**Fixed**

- ✅ `Prisma.JsonValue` typing & unsafe assertions removed.
- ✅ Correct `Prisma.TransactionClient` usage.

**Files Modified**

- `src/modules/auth/2fa/services/2fa-method.service.spec.ts`

---

### Step 9: Type Safety Refactoring for Security Events

:calendar: `2025-10-12`

**Fixed**

- ✅ `SecurityEventService.logEvent` accepts specific metadata types.
- ✅ All calls from `TwoFactorMethodService` are type-safe.
- ✅ Resolved `TS2353`.

**Changed**

- ✅ `security-event.types.ts`: discriminated union for `metadata`.

**Files Modified**

- `src/modules/auth/2fa/types/security-event.types.ts`
- `src/modules/auth/2fa/services/2fa-method.service.ts`

---

### Step 10: Advanced Email Validation & Reputation

:calendar: `2025-10-12`

**Added**

- ✅ `MailService.canSendEmail` guard.
- ✅ DNS MX validation, disposable-email block.
- ✅ `emailBouncedAt`, `isUnsubscribed` in `User`.

**Changed**

- ✅ All mail methods protected by guard; improved errors.

**Files Modified**

- `src/prisma/schema.prisma`
- `src/modules/libs/mail/mail.service.ts`

---

### Step 11: Correct Security Event Logging

:calendar: `2025-10-13`

**Added**

- ✅ `TWO_FA_BACKUP_CODES_REGENERATED` to `ESecurityEvent`.

**Fixed**

- ✅ `TwoFactorMethodService.regenerateBackupCodes` logs correct event.

**Files Modified**

- `src/prisma/schema.prisma`
- `src/modules/auth/2fa/services/2fa-method.service.ts`

---

### Step 12: Final Type Safety & Service Refactoring

:calendar: `2025-10-13`

**Added**

- ✅ `SmsService.canSendSms`; `phoneBouncedAt` in `User`.
- ✅ Low-backup notification in `BackupCodeService`.

**Changed**

- ✅ Consistent `canSend...` guard pattern across services.
- ✅ Throw `BadRequestException` on delivery failures.

**Fixed**

- ✅ `2fa-verified.guard.ts` decorator typing (`TS2322`).
- ✅ Casting fixes in `device-trust.service.ts`, `security-event.service.ts`.
- ✅ `Prisma.JsonValue` casts.

**Files Modified**

- `src/prisma/schema.prisma`
- `src/modules/auth/2fa/guards/2fa-verified.guard.ts`
- `src/modules/auth/2fa/services/backup-code.service.ts`

---

### Step 12.1: Final Type Corrections & Logic Enhancements

:calendar: `2025-10-13`

**Added**

- ✅ `ip` param in `BackupCodeService.verifyBackupCode`.

**Fixed**

- ✅ ESLint unsafe-arg in `Require2FAVerification` decorator.
- ✅ `DeviceTrustService` score typed as `number`.
- ✅ Safe metadata casting in `SecurityEventService`.
- ✅ Twilio Lookup v2: `lineTypeIntelligence`.

**iles Modified**

- `src/modules/auth/2fa/guards/2fa-verified.guard.ts`
- `src/modules/auth/2fa/services/backup-code.service.ts`
- `src/modules/auth/2fa/services/device-trust.service.ts`
- `src/modules/auth/2fa/services/security-event.service.ts`
- `src/modules/libs/sms/sms.service.ts`

---

## Module: 2FA System Modernization & RBAC Foundation

---

### Step 0: RBAC Foundation Implementation

:calendar: `2025-10-15`

**Added**

- ✅ **RBAC Module**: Created a new `RbacModule` to manage role-based access control across the application.
- ✅ **User Roles**: Added `EUserRole` enum with `USER` and `SUPER_ADMIN` roles to Prisma schema.
- ✅ **Multiple Roles Support**: Users can now have multiple roles stored as an array (`roles EUserRole[]`).
- ✅ **`RolesGuard`**: Implemented a guard that checks user roles from the database for each protected request.
- ✅ **`@Roles()` Decorator**: Created a decorator to specify required roles for GraphQL resolvers and mutations.
- ✅ **Super Admin Seed**: Updated seed script to create a super admin user with `['USER', 'SUPER_ADMIN']` roles.
- ✅ **Documentation**: Added comprehensive RBAC documentation in `docs/rbac/` directory.

**Changed**

- ✅ **User Model**: Modified Prisma `User` model to include `roles` field with default value `[USER]`.
- ✅ **Seed Script**: Enhanced existing seed to support role assignment and create both regular and admin users.
- ✅ **App Module**: Integrated `RbacModule` as a global module for application-wide access.

**Fixed**

- N/A

**Removed**

- N/A

**Files Modified**

- `prisma/schema.prisma`
- `src/core/prisma/prisma.seed.ts`
- `src/app.module.ts`

**Files Created**

- `src/modules/rbac/rbac.module.ts`
- `src/modules/rbac/guards/roles.guard.ts`
- `src/modules/rbac/guards/index.ts`
- `src/modules/rbac/decorators/roles.decorator.ts`
- `src/modules/rbac/decorators/index.ts`
- `src/modules/rbac/types/rbac.types.ts`
- `src/modules/rbac/index.ts`
- `docs/rbac/README.md`
- `docs/rbac/ROLES.md`

---

### Step 0.1: TypeScript & Session Typing Refinement

:calendar: `2025-10-15`

**Added**

- ✅ **`session.types.ts`**: Created a dedicated file to extend `express-session` types using declaration merging. This provides global, type-safe access to custom session properties like `userId` and `metadata`.
- ✅ **`AuthenticatedRequest`**: Introduced a new interface in `context.types.ts` to extend the base Express `Request` with our typed `user` and `session` objects.

**Changed**

- ✅ **`AuthenticatedUser`**: Switched from `interface` to a `type` alias to correctly represent a type transformation (`Omit`) and resolve the `no-empty-object-type` ESLint warning.
- ✅ **`GqlContext`**: The context type now uses the new `AuthenticatedRequest` for better type safety within resolvers.

**Fixed**

- ✅ Resolved TypeScript compilation error in `session.util.ts` that prevented `prisma:seed` and other scripts from running.
- ✅ The compiler now correctly recognizes custom properties on the session object (`userId`, `createdAt`, `metadata`).

**Removed**

- N/A

**Files Modified**

- `src/shared/types/context.types.ts`

**Files Created**

- `src/shared/types/session.types.ts`

---

### Step 1: Admin 2FA Management Module

:calendar: `2023-10-27`

**Added**

- ✅ **`AdminTwoFactorResolver`**: Created a new GraphQL resolver for administrative 2FA operations, protected with `@Roles(SUPER_ADMIN)`.
- ✅ **`AdminTwoFactorService`**: Implemented business logic for admin operations with enhanced security auditing.
- ✅ **Admin Mutations**: Added `disableUser2FA`, `revokeUserDevice`, and `revokeAllUserDevices` mutations for emergency access management.
- ✅ **Admin Queries**: Added `getUser2FAStatus`, `getUserSecurityEvents`, and `getUserTrustedDevices` queries for monitoring.
- ✅ **Enhanced Auditing**: All admin actions are logged with `CRITICAL` severity in SecurityEventService.
- ✅ **Admin DTOs**: Created input/output types for all admin operations with proper validation.
- ✅ **Documentation**: Added comprehensive admin operations guide in `docs/2fa/ADMIN_OPERATIONS.md`.

**Changed**

- ✅ **`TwoFactorModule`**: Integrated AdminTwoFactorResolver and AdminTwoFactorService as providers.
- ✅ **`SecurityEventService`**: Added specialized methods for logging admin actions with enhanced metadata.
- ✅ **`DeviceTrustService`**: Added `revokeAllDevices` method for emergency situations.

**Fixed**

- N/A

**Removed**

- N/A

**Files Modified**

- `src/modules/auth/2fa/2fa.module.ts`
- `src/modules/auth/2fa/services/security-event.service.ts`
- `src/modules/auth/2fa/services/device-trust.service.ts`
- `src/modules/auth/2fa/services/index.ts`
- `src/modules/auth/2fa/dtos/index.ts`
- `src/modules/auth/2fa/models/index.ts`

**Files Created**

- `src/modules/auth/2fa/resolvers/admin-2fa.resolver.ts`
- `src/modules/auth/2fa/resolvers/index.ts`
- `src/modules/auth/2fa/services/admin-2fa.service.ts`
- `src/modules/auth/2fa/dtos/admin-2fa.dto.ts`
- `src/modules/auth/2fa/models/admin-2fa.model.ts`
- `docs/2fa/ADMIN_OPERATIONS.md`

---

### Step 1.1: Admin Action Types Fix

:calendar: `2023-10-27`

**Added**

- ✅ **`IAdminActionMetadata`**: Created a new interface for administrative action metadata with fields like `adminId`, `adminEmail`, `reason`, etc.

**Changed**

- ✅ **`TSecurityEventMetadata`**: Updated union type to include `IAdminActionMetadata` for proper typing of admin actions.

**Fixed**

- ✅ Fixed TypeScript errors in `admin-2fa.service.ts` where admin-specific fields were not recognized in metadata.

**Files Modified**

- `src/modules/auth/2fa/types/security-event.types.ts`
- `src/modules/auth/2fa/services/admin-2fa.service.ts`

---

### Step 2: Automated Maintenance (Cron Jobs)

:calendar: `2023-10-27`

**Added**

- ✅ **`TwoFactorCronService`**: Created automated maintenance service with scheduled tasks for cleanup operations.
- ✅ **Cleanup Jobs**: Implemented 4 cron jobs for system maintenance:
  - `cleanupExpiredBackupCodes` - Daily at 02:00 AM
  - `cleanupOldDevices` - Daily at 03:00 AM  
  - `cleanupOldSecurityEvents` - Weekly on Sunday at 04:00 AM
  - `enforceDeviceLimits` - Every 6 hours
- ✅ **Environment Configuration**: Added cron schedule configuration via environment variables.
- ✅ **Metrics & Logging**: Each job reports execution metrics (items processed, duration, errors).
- ✅ **Schedule Module Integration**: Integrated `@nestjs/schedule` for cron job management.
- ✅ **Documentation**: Created comprehensive cron jobs guide in `docs/2fa/CRON_JOBS.md`.

**Changed**

- ✅ **`BackupCodeService`**: Enhanced `cleanupExpiredCodes` method to return detailed metrics.
- ✅ **`DeviceTrustService`**: Enhanced `cleanupDevices` and added `enforceAllUsersDeviceLimits` method.
- ✅ **`SecurityEventService`**: Added `archiveOldEvents` method for event retention management.
- ✅ **`TwoFactorModule`**: Added `TwoFactorCronService` and imported `ScheduleModule`.
- ✅ **`AppModule`**: Added global `ScheduleModule.forRoot()` import.

**Fixed**

- N/A

**Removed**

- N/A

**Files Modified**

- `src/app.module.ts`
- `src/modules/auth/2fa/2fa.module.ts`
- `src/modules/auth/2fa/services/backup-code.service.ts`
- `src/modules/auth/2fa/services/device-trust.service.ts`
- `src/modules/auth/2fa/services/security-event.service.ts`
- `src/modules/auth/2fa/services/index.ts`
- `.env.example`
- `package.json`

**Files Created**

- `src/modules/auth/2fa/services/2fa-cron.service.ts`
- `docs/2fa/CRON_JOBS.md`

---

### Step 2.1: Cron Service Type Fixes

:calendar: `2023-10-27`

**Fixed**

- ✅ Fixed TypeScript error with `CronJob.running` property by implementing safer status checking.
- ✅ Fixed ESLint floating promise warning by using `void` operator for fire-and-forget operations.
- ✅ Added alternative `getCronJobsStatusSafe` method with better type safety and error handling.

**Files Modified**

- `src/modules/auth/2fa/services/2fa-cron.service.ts`

---

### Step 3: WebAuthn/Passkeys Implementation

:calendar: `2023-10-27`

**Added**

- ✅ **WebAuthnService**: Created comprehensive service for WebAuthn/FIDO2 protocol handling.
- ✅ **Registration Flow**: Implemented `generateRegistrationOptions` and `verifyRegistration` for credential creation.
- ✅ **Authentication Flow**: Implemented `generateAuthenticationOptions` and `verifyAuthentication` for passwordless login.
- ✅ **WebAuthn DTOs**: Created input/output types for all WebAuthn operations with proper validation.
- ✅ **WebAuthn Models**: Created GraphQL models for registration and authentication responses.
- ✅ **GraphQL API**: Added mutations and queries for complete WebAuthn flow.
- ✅ **Credential Storage**: Integrated WebAuthn credentials into `AuthenticationMethod` model.
- ✅ **Device Support**: Added support for both platform authenticators (biometrics) and cross-platform (hardware keys).
- ✅ **Documentation**: Created comprehensive WebAuthn integration guide in `docs/2fa/WEBAUTHN.md`.

**Changed**

- ✅ **TwoFactorResolver**: Added WebAuthn registration and authentication endpoints.
- ✅ **TwoFactorModule**: Integrated WebAuthnService as provider.
- ✅ **AuthenticationMethod**: Enhanced to properly store WebAuthn credential data.

**Fixed**

- N/A

**Removed**

- N/A

**Files Modified**

- `package.json`
- `src/modules/auth/2fa/2fa.module.ts`
- `src/modules/auth/2fa/2fa.resolver.ts`
- `src/modules/auth/2fa/services/index.ts`
- `src/modules/auth/2fa/dtos/index.ts`
- `src/modules/auth/2fa/models/index.ts`

**Files Created**

- `src/modules/auth/2fa/services/webauthn.service.ts`
- `src/modules/auth/2fa/dtos/webauthn.dto.ts`
- `src/modules/auth/2fa/models/webauthn.model.ts`
- `docs/2fa/WEBAUTHN.md`

---

### Step 3.1: WebAuthn TypeScript Fixes

:calendar: `2023-10-27`

**Fixed**

- ✅ Fixed TypeScript errors in WebAuthn service with proper type conversions
- ✅ Fixed `generateRegistrationOptions` userID type (string to Uint8Array)
- ✅ Fixed credential format for `verifyAuthenticationResponse`
- ✅ Removed GraphQLJSONObject dependency, using Object type for GraphQL
- ✅ Fixed CronJob status method to handle missing 'running' property
- ✅ Added missing WEBAUTHN_CONFIG export in constants

**Changed**

- ✅ Updated WebAuthn DTOs to use Object type instead of GraphQLJSONObject
- ✅ Updated WebAuthn models for better GraphQL compatibility
- ✅ Simplified credential verification flow

**Added**

- ✅ Added i18n translations for WebAuthn (en/ru)
- ✅ Added WebAuthn Redis keys to main constants file

**Files Modified**

- `src/modules/auth/2fa/services/2fa-cron.service.ts`
- `src/modules/auth/2fa/services/webauthn.service.ts`
- `src/modules/auth/2fa/dtos/webauthn.dto.ts`
- `src/modules/auth/2fa/models/webauthn.model.ts`
- `src/modules/auth/2fa/constants/webauthn.constants.ts`
- `src/modules/auth/2fa/constants/2fa.constants.ts`
- `src/core/i18n/locales/en/auth.json`
- `src/core/i18n/locales/ru/auth.json`

---

## Module: Account & Session Modules Migration

---

### Step 1: Prisma Schema Migration & Model Updates

:calendar: `2025-10-19`

**Added**

- ✅ **New User fields** aligned with unified 2FA system:
  - `roles` (array of `EUserRole` for RBAC)
  - `is2FAEnabled`, `preferred2FAMethod`, `require2FA` (unified 2FA status)
  - `riskScore`, `lastRiskAssessAt` (risk assessment tracking)
  - `lastLoginAt`, `lastLoginIp`, `passwordChangedAt` (security audit)
  - `phoneVerifiedAt`, `phoneBouncedAt` (phone verification tracking)
  - `emailBouncedAt`, `isUnsubscribed` (email reputation)
  - `deletedAt` (soft delete support)
- ✅ **GraphQL enums** for `EUserRole` and `E2FAMethod` registered in User model.
- ✅ **Session model fields** for 2FA and trust:
  - `isTrusted`, `riskScore`, `is2FAVerified`, `verified2FAAt`
- ✅ **JSDoc documentation** for all public methods and fields (English).

**Changed**

- ✅ **User GraphQL model** (`user.model.ts`):
  - Removed deprecated fields: `isTotpEnabled`, `totpSecret`, `isOtpEnabled`, `otpSecret`
  - Added all new Prisma schema fields with proper GraphQL decorators
  - All fields now have descriptions for auto-generated GraphQL schema documentation
- ✅ **AccountService** (`account.service.ts`):
  - `changePassword()` now updates `passwordChangedAt` timestamp
  - `changeEmail()` now resets `emailVerifiedAt` to `null`
  - Added JSDoc comments for Enterprise-grade documentation
- ✅ **SessionService** (`session.service.ts`):
  - `login()` now updates `lastLoginAt` and `lastLoginIp` on successful authentication
  - Added JSDoc comments with security considerations
- ✅ **Session GraphQL model** (`session.model.ts`):
  - Added optional fields: `isTrusted`, `riskScore`, `is2FAVerified`, `verified2FAAt`
  - All fields now have GraphQL descriptions

**Fixed**

- ✅ **Type safety**: All `User` type casts now use `as unknown as User` pattern to avoid Prisma/GraphQL type conflicts.
- ✅ **HashUtil usage**: Replaced direct `argon2` imports with centralized `HashUtil.hash()` and `HashUtil.verify()`.
- ✅ **Email normalization**: Consistent use of `normalizeEmail()` private method in `AccountService`.

**Removed**

- ❌ Removed deprecated 2FA fields from User model:
  - `isTotpEnabled`, `totpSecret`
  - `isOtpEnabled`, `otpSecret`
- ❌ Removed direct `argon2` imports (replaced with `HashUtil`).

**Files Modified**

- `src/modules/auth/account/models/user.model.ts`
- `src/modules/auth/account/account.service.ts`
- `src/modules/auth/session/session.service.ts`
- `src/modules/auth/session/models/session.model.ts`

**Files Created**

- (No new files created in this step)

---

**Notes:**

- ⚠️ **Breaking Change**: Old 2FA fields (`isTotpEnabled`, `totpSecret`, etc.) are **removed**. Clients using these fields must migrate to the new unified 2FA system via `AuthenticationMethod` model.
- 🔒 **Security**: Password changes now track `passwordChangedAt` for audit purposes.
- 🔒 **Security**: Login tracking via `lastLoginAt` and `lastLoginIp` enables suspicious activity detection.
- 📊 **Risk Assessment**: `riskScore` and `lastRiskAssessAt` fields are now available for future ML-based risk scoring.

---

### Step 1.1: Prisma Schema Migration & Model Updates

:calendar: `2025-10-19`

**Added**

- ✅ **Comprehensive GraphQL documentation**:
  - All ObjectTypes have descriptions
  - All fields have detailed descriptions
  - All enums have descriptions with value explanations
  - All InputTypes have descriptions
  - All queries/mutations have descriptions
- ✅ Enhanced enum registration with `valuesMap` for auto-documentation

**Changed**

- ✅ All GraphQL models now include enterprise-grade documentation
- ✅ Field descriptions follow security-first approach (e.g., "Password hidden from schema")
- ✅ Descriptions include format hints (e.g., "E.164 format", "UUID v4", "ISO 8601")

**Files Modified**

- `src/modules/auth/account/models/enums.ts` (added valuesMap descriptions)
- `src/modules/auth/account/models/user.model.ts` (added field descriptions)
- `src/modules/auth/session/models/session.model.ts` (added field descriptions)
- `src/modules/auth/account/dtos/*.ts` (added descriptions to all DTOs)
- `src/modules/auth/session/dtos/*.ts` (added descriptions to all DTOs)
- `src/modules/auth/account/account.resolver.ts` (enhanced mutation/query descriptions)
- `src/modules/auth/session/session.resolver.ts` (enhanced mutation/query descriptions)

---

### Step 2: WebAuthn GraphQL Schema Fix

:calendar: `2025-10-19`

**Fixed**

- ✅ **GraphQL Schema Error**: Fixed "Cannot determine GraphQL output type for 'options'" in WebAuthn models
  - Replaced `@Field(() => Object)` with `@Field(() => GraphQLJSON)` in registration/authentication options
  - All WebAuthn models now generate valid GraphQL schema

**Changed**

- ✅ **Enhanced descriptions** for all WebAuthn models and fields:
  - `WebAuthnRegistrationOptionsModel`: Added detailed descriptions for credential creation flow
  - `WebAuthnAuthenticationOptionsModel`: Added detailed descriptions for credential verification flow
  - `WebAuthnCredentialModel`: Added platform authenticator vs cross-platform explanations
  - All fields now have Enterprise-grade documentation with examples

**Dependencies**

- ✅ Added `graphql-type-json@1.x` for JSON field support in GraphQL schema

**Files Modified**

- `src/modules/auth/2fa/models/webauthn.model.ts`

**Notes**

- 📚 WebAuthn `options` fields contain `PublicKeyCredentialCreationOptions` or `PublicKeyCredentialRequestOptions`
- 🔒 Backup codes are shown only once during registration (users must store them securely)
- 🔢 Signature counter prevents cloned authenticator attacks (counter must monotonically increase)

---

### Step 2.1: WebAuthn GraphQL Schema Fix

:calendar: `2025-10-19`

**Fixed**

- ✅ **GraphQL Input/Output Type Errors**: Fixed all WebAuthn schema generation issues
  - Replaced `@Field(() => Object)` with `@Field(() => GraphQLJSON)` in all DTOs and models
  - `CompleteWebAuthnRegistrationInput.response` now uses GraphQLJSON (supports `RegistrationResponseJSON`)
  - `CompleteWebAuthnAuthenticationInput.response` now uses GraphQLJSON (supports `AuthenticationResponseJSON`)
  - All WebAuthn `options` fields now properly serialize PublicKeyCredential types

**Added**

- ✅ **SimpleWebAuthn integration documentation** (`docs/webauthn-simplewebauthn-example.md`)
  - Complete registration flow example
  - Complete authentication flow example
  - Error handling with `WebAuthnError`
- ✅ **Enhanced descriptions** for all WebAuthn DTOs and models
  - References to `@simplewebauthn/browser` helper functions
  - Field-level documentation with examples

**Changed**

- ✅ All WebAuthn DTOs now include `description` for better GraphQL schema documentation
- ✅ Response fields explicitly mention compatibility with `@simplewebauthn/typescript-types`

**Dependencies**

- ✅ `graphql-type-json@1.x` - Required for JSON field support in GraphQL

**Files Modified**

- `src/modules/auth/2fa/dtos/webauthn.dto.ts`
- `src/modules/auth/2fa/models/webauthn.model.ts`

**Files Created**

- `docs/webauthn-simplewebauthn-example.md` (frontend integration guide)

**Notes**

- 🔑 **TypeScript types**: `RegistrationResponseJSON` and `AuthenticationResponseJSON` from `@simplewebauthn/typescript-types` are used for type safety but serialize as JSON in GraphQL
- 📦 **SimpleWebAuthn**: Frontend should use `@simplewebauthn/browser` for automatic base64url encoding/decoding
- 🔒 **Security**: Backup codes shown only once during registration (users must store securely)

---

### Step 2.2: WebAuthn GraphQL Schema Fix

:calendar: `2025-10-19`

**Fixed**

- ✅ **Missing WebAuthn models**: Added all missing GraphQL models
  - `WebAuthnRegistrationCompleteModel` - response after successful registration
  - `WebAuthnAuthenticationCompleteModel` - response after successful authentication
  - `WebAuthnCredentialModel` - represents a registered credential
- ✅ **TypeScript compilation errors**: Fixed resolver imports

**Added**

- ✅ All 5 WebAuthn GraphQL models with comprehensive documentation:
  1. `WebAuthnRegistrationOptionsModel` - registration challenge
  2. `WebAuthnRegistrationCompleteModel` - registration result
  3. `WebAuthnAuthenticationOptionsModel` - authentication challenge
  4. `WebAuthnAuthenticationCompleteModel` - authentication result
  5. `WebAuthnCredentialModel` - credential info

**Files Modified**

- `src/modules/auth/2fa/models/webauthn.model.ts` (added 3 missing models)

---

## Module: 2FA System Modernization & RBAC Foundation

---

### Step 1: Core Infrastructure Updates for Notifications

:calendar: `2025-10-19`

**Added**

- ✅ `CoreService.rExpire()`: Added method to set TTL for existing Redis keys
- ✅ Type-safe constant for priority-based notification channels

**Changed**

- ✅ **`PRIORITY_CHANNELS` constant**: Fixed TypeScript inference from literal types to `ENotificationChannel[]`
- ✅ **`CoreService`**: Extended with Redis TTL management helper

**Fixed**

- ✅ TypeScript error: `ENotificationChannel.EMAIL` literal type in `PRIORITY_CHANNELS`
- ✅ Missing `rExpire` method in `CoreService`

**Files Modified**

- `src/core/core.service.ts`
- `src/modules/notification/constants/notification.constants.ts`

---

### Step 2: Notification Module Foundation

:calendar: `2025-10-19`

**Added**

- ✅ **`NotificationModule`**: Created global notification module with `@Global()` decorator
- ✅ **`NotificationService`**: Centralized notification orchestration service
- ✅ **Notification Types**: Complete TypeScript type system for all notification scenarios
  - `ENotificationCategory`: SECURITY, AUTHENTICATION, USER, ADMIN, SYSTEM
  - `ENotificationChannel`: EMAIL, SMS, PUSH, IN_APP
  - `ENotificationPriority`: LOW, NORMAL, HIGH, CRITICAL
  - Specialized interfaces for 2FA, device, admin, and suspicious activity notifications
- ✅ **Rate Limiting**: Configurable hourly/daily limits per user (10/hour, 50/day)
- ✅ **Duplicate Detection**: 5-minute cooldown for identical notifications
- ✅ **Delivery Tracking**: Result tracking for all notification channels
- ✅ **Email Reputation Check**: Integration with `MailService.canSendEmail()`
- ✅ **Phone Validation**: Integration with `SmsService.canSendSms()`

**Changed**

- ✅ **Architecture**: Moved notification logic from `2fa/` to standalone `modules/notification/`
- ✅ **Separation of Concerns**: Decoupled notification delivery from business logic

**Security Enhancements**

- ✅ Email verification requirement for security notifications
- ✅ Phone verification requirement for SMS notifications
- ✅ Bounced/unsubscribed email filtering
- ✅ Configurable rate limits to prevent spam

**Files Created**

- `src/modules/notification/notification.module.ts`
- `src/modules/notification/notification.service.ts`
- `src/modules/notification/index.ts`
- `src/modules/notification/types/notification.types.ts`
- `src/modules/notification/types/index.ts`
- `src/modules/notification/constants/notification.constants.ts`
- `src/modules/notification/constants/index.ts`

**Files Modified**

- `src/core/core.service.ts` (added Redis helpers)

---

### Step 3: Email Templates & MailService Integration

:calendar: `2025-10-19`

**Added**

- ✅ **9 Security Email Templates** (React Email):
  - `2fa-method-added.template.tsx` - New 2FA method notification
  - `2fa-method-removed.template.tsx` - 2FA method removal alert
  - `2fa-disabled.template.tsx` - Critical: 2FA completely disabled
  - `new-device-login.template.tsx` - New device login detection
  - `suspicious-activity.template.tsx` - Suspicious activity with risk scoring
  - `low-backup-codes.template.tsx` - Running low on backup codes
  - `backup-codes-regenerated.template.tsx` - Backup codes regenerated
  - `2fa-disabled-by-admin.template.tsx` - Admin disabled 2FA
  - `device-revoked-by-admin.template.tsx` - Admin revoked device
- ✅ **9 New MailService Methods**:
  - `send2FAMethodAddedEmail()`
  - `send2FAMethodRemovedEmail()`
  - `send2FADisabledEmail()`
  - `sendNewDeviceLoginEmail()`
  - `sendSuspiciousActivityEmail()`
  - `sendLowBackupCodesEmail()`
  - `sendBackupCodesRegeneratedEmail()`
  - `send2FADisabledByAdminEmail()`
  - `sendDeviceRevokedByAdminEmail()`
- ✅ **Email Template Features**:
  - Responsive Tailwind CSS design
  - Multilingual support (en/ru)
  - Risk score visualization (progress bars)
  - Device/login details display
  - Action buttons with direct links
  - Security warnings with color coding
  - Timestamp localization

**Changed**

- ✅ **MailService.canSendEmail()**: Now returns boolean (simplified API)
- ✅ Added `checkEmailSendability()` as private method for detailed checks
- ✅ All security emails include device fingerprint validation

**Security Enhancements**

- ✅ Email reputation checking before send
- ✅ Disposable email detection
- ✅ DNS MX record validation
- ✅ Bounce and unsubscribe tracking
- ✅ Automatic email validation

**Documentation**

- ✅ JSDoc for all new methods
- ✅ TypeScript interfaces for all template props
- ✅ Inline comments for security considerations

**Files Created**

- `src/modules/libs/mail/templates/2fa-method-added.template.tsx`
- `src/modules/libs/mail/templates/2fa-method-removed.template.tsx`
- `src/modules/libs/mail/templates/2fa-disabled.template.tsx`
- `src/modules/libs/mail/templates/new-device-login.template.tsx`
- `src/modules/libs/mail/templates/suspicious-activity.template.tsx`
- `src/modules/libs/mail/templates/low-backup-codes.template.tsx`
- `src/modules/libs/mail/templates/backup-codes-regenerated.template.tsx`
- `src/modules/libs/mail/templates/2fa-disabled-by-admin.template.tsx`
- `src/modules/libs/mail/templates/device-revoked-by-admin.template.tsx`

**Files Modified**

- `src/modules/libs/mail/mail.service.ts`

---

### Step 4: i18n Nested Paths Support

:calendar: `2025-10-19`

**Added**

- ✅ **Nested paths support in `ScopedT`**: Now you can use `t('details.title')` instead of `t('details')('title')`
- ✅ **`NestedPaths<T>` type**: Generates all possible nested paths within an object
- ✅ **`RelativeValue<T, P>` type**: Extracts value type by relative path

**Changed**

- ✅ **`ScopedT` type**: Extended with new overload for nested paths
- ✅ Improved TypeScript inference for deeply nested translations

**Example**

```typescript
const t = i18n.t('mail.2fa_method_added', { lng })

// ✅ Both work now:
t('details.title')           // NEW: direct nested path
t('details')('title')        // OLD: still works

// ✅ All these work:
t('warning.message')
t('details.type', { type: 'TOTP' })
t('intro', { app: 'MyApp', method: 'TOTP' })
```

**Files Modified**

- `src/core/i18n/types/typed.ts`

---

### Step 5: Template & i18n Corrections

:calendar: `2025-10-19`

**Fixed**

- ✅ **`SuspiciousActivityTemplate.tsx`**: Fixed a JSX error where dynamic `eventDescription` was not wrapped in a `<Text>` component.
- ✅ **i18n JSON structure**: Removed unused translation keys from `en/mail.json` and `ru/mail.json`.
- ✅ **i18n Type Mismatches**: Corrected a type mismatch in `legalNote` for `2fa_disabled`, ensuring all locales have consistent string/array structures.

**Changed**

- ✅ **`i18n/locales/mail.json`**: Cleaned up translation files, removing fields not used in the templates to reduce complexity and improve maintainability.
- ✅ **Code Readability**: Improved the readability of security email templates.

**Files Modified**

- `src/modules/libs/mail/templates/suspicious-activity.template.tsx`
- `src/core/i18n/locales/en/mail.json`
- `src/core/i18n/locales/ru/mail.json`

---

### Step 6: Integration of NotificationService

:calendar: `2025-10-19`

**Added**

-   ✅ **Dependency Injection**: `NotificationService` is now injected into `TwoFactorMethodService`, `BackupCodeService`, `DeviceTrustService`, `AdminTwoFactorService`, and `SecurityEventService`.
-   ✅ **`notify2FAMethodAdded`**: Called after successful setup of TOTP or OTP methods.
-   ✅ **`notify2FAMethodRemoved` / `notify2FADisabled`**: Called when a 2FA method is removed.
-   ✅ **`notifyBackupCodesRegenerated`**: Called after backup codes are regenerated.
-   ✅ **`notifyLowBackupCodes`**: Called when the number of remaining backup codes drops below the configured threshold.
-   ✅ **`notifyNewDeviceLogin`**: Called when a login from a new, unrecognized device is detected.
-   ✅ **`notify2FADisabledByAdmin`**: Called when an administrator disables 2FA for a user.
-   ✅ **`notifyDeviceRevokedByAdmin`**: Called when an administrator revokes a trusted device.
-   ✅ **`notifySuspiciousActivity`**: Called when a high-risk security event is logged.

**Changed**

-   ✅ **`AppModule`**: Now imports the global `NotificationModule` to make `NotificationService` available application-wide.
-   ✅ **Core Business Logic**: The logic of all relevant 2FA services has been enhanced to trigger user notifications at critical security-related touchpoints.

**Files Modified**

-   `src/app.module.ts`
-   `src/modules/auth/2fa/services/2fa-method.service.ts`
-   `src/modules/auth/2fa/services/backup-code.service.ts`
-   `src/modules/auth/2fa/services/device-trust.service.ts`
-   `src/modules/auth/2fa/services/admin-2fa.service.ts`
-   `src/modules/auth/2fa/services/security-event.service.ts`

---

### Step 7: 2FA Code Verification Implementation

:calendar: `2025-10-20`

**Added**

-   ✅ **`TwoFactorMethodService.verifyTotpCode()`**: New method to validate TOTP codes by decrypting the secret and checking against the provided code.
-   ✅ **`TwoFactorMethodService.verifyOtpCode()`**: New method to validate OTP (Email/SMS) codes against the value stored in Redis, with a built-in anti-replay mechanism (deletes code on success).

**Changed**

-   ✅ **`TwoFactorResolver.verify2FA()`**: The `TODO` has been completed. The method now performs method-specific verification for `TOTP`, `OTP_EMAIL`, and `OTP_SMS` codes.
-   ✅ **Security Flow**: Incorrect codes now trigger a `log2FAFailed` event and throw a proper `UnauthorizedException`.

**Fixed**

-   ✅ **Critical Flaw**: Removed the security vulnerability where 2FA codes were not actually being verified, and success was always returned.

**Files Modified**

-   `src/modules/auth/2fa/services/2fa-method.service.ts`
-   `src/modules/auth/2fa/resolvers/2fa.resolver.ts`
-   
---

### Step 7.1: Access Modifier and Method Naming Correction

:calendar: `2025-10-20`

**Fixed**

-   ✅ **Access Modifier Error**: Corrected `private` access modifiers on `verifyTotpCode` and `verifyOtpCode` in `TwoFactorMethodService` to `public`, allowing them to be called from the resolver.
-   ✅ **Method Naming**: Renamed `verifyOtpCode` to `verifyOneTimeCode` for clarity, as it handles generic one-time password verification.
-   ✅ **Error Handling**: `verifyOneTimeCode` now returns `false` for expired/missing codes instead of throwing an exception, centralizing error handling in the resolver.

**Changed**

-   ✅ **`TwoFactorResolver.verify2FA`**: Updated to call the correctly named public methods (`verifyTotpCode`, `verifyOneTimeCode`).

**Files Modified**

-   `src/modules/auth/2fa/services/2fa-method.service.ts`
-   `src/modules/auth/2fa/resolvers/2fa.resolver.ts`

---

## Module: Password Management & Security Event System

---

### Step 1: Security Event Service Foundation (Global Module)

:calendar: `2025-10-20`

**Added**

- ✅ Created **global** `SecurityEventService` for platform-wide security event tracking.
- ✅ Added `create()` method for creating security events with full metadata (IP, location, device, risk analysis).
- ✅ Added `findByUser()` method with advanced filtering (event type, severity, resolution status, pagination).
- ✅ Added `resolve()` method for marking events as resolved by administrators.
- ✅ Added `calculateRiskScore()` utility method for risk factor aggregation.
- ✅ Created `CreateSecurityEventInput` interface for type-safe event creation.
- ✅ Created `RiskFactor` interface for structured risk analysis data.
- ✅ Full JSDoc documentation for all public methods (English).
- ✅ Unit test suite for `SecurityEventService` with 100% coverage of core methods.
- ✅ Marked module as `@Global()` for automatic availability across all modules.

**Changed**

- ✅ Moved `SecurityEventModule` from `src/modules/auth/security-event/` to `src/modules/security-event/` (root level).
- ✅ Updated JSDoc to reflect platform-wide usage (not auth-specific).
- ✅ Simplified imports in `AccountModule`, `SessionModule`, `RecoveryModule` (no explicit SecurityEventModule import needed due to @Global decorator).

**Files Created**

- `src/modules/security-event/security-event.service.ts`
- `src/modules/security-event/security-event.service.spec.ts`
- `src/modules/security-event/security-event.module.ts`
- `src/modules/security-event/index.ts`

**Files Modified**

- `src/modules/auth/account/account.module.ts`
- `src/modules/auth/session/session.module.ts`
- `src/modules/auth/recovery/recovery.module.ts`

**Removed**

- ❌ Removed explicit `SecurityEventModule` imports from auth modules (now using @Global decorator).

---

### Step 2: Session Invalidation & Password Change Enhancement

:calendar: `2025-10-20`

**Added**

- ✅ Added `invalidateUserSessions(userId, excludeSessionId?)` method to `SessionService` for bulk session removal.
- ✅ Integrated `SessionService` and `SecurityEventService` into `AccountService`.
- ✅ Enhanced `changePassword()` method with enterprise security features:
  - Invalidates all user sessions except current one (logout from other devices)
  - Creates `SecurityEvent` with type `PASSWORD_CHANGED`
  - Calculates risk score based on factors (password change activity, multiple sessions)
  - Determines severity dynamically (LOW/MEDIUM/HIGH) based on risk score
  - Returns number of invalidated sessions to client
- ✅ Created `ChangePasswordResponse` GraphQL type with `success` and `sessionsInvalidated` fields.
- ✅ Added comprehensive unit tests for `invalidateUserSessions()` in `SessionService`.
- ✅ Added comprehensive unit tests for enhanced `changePassword()` in `AccountService`.
- ✅ Full JSDoc documentation for all new methods (English).

**Changed**

- ✅ Updated `AccountService.changePassword()` signature to accept `Request` object and `userAgent`.
- ✅ Updated `AccountResolver.changePassword()` mutation to return `ChangePasswordResponse` instead of `Boolean`.
- ✅ Updated `AccountModule` to provide `SessionService`.
- ✅ Enhanced session invalidation logic to handle invalid JSON gracefully.
- ✅ Improved risk factor calculation with multi-session detection.

**Fixed**

- ✅ Fixed edge case where invalid session data could crash `invalidateUserSessions()`.

**Files Created**

- `src/modules/auth/account/account.service.spec.ts`
- `src/modules/auth/session/session.service.spec.ts`

**Files Modified**

- `src/modules/auth/session/session.service.ts`
- `src/modules/auth/account/account.service.ts`
- `src/modules/auth/account/account.resolver.ts`
- `src/modules/auth/account/account.module.ts`

---

### Step 3: Email Notifications for Password Operations (React Email)

:calendar: `2025-10-20`

**Added**

- ✅ Created `PasswordChangedTemplate` React Email component for password change alerts.
- ✅ Created `PasswordResetConfirmationTemplate` React Email component for password reset confirmations.
- ✅ Added `sendPasswordChangedNotification()` method to `MailService`.
- ✅ Added `sendPasswordResetConfirmation()` method to `MailService`.
- ✅ Integrated email notifications into `AccountService.changePassword()` (non-blocking).
- ✅ Integrated email notifications into `RecoveryService.newPassword()` (non-blocking).
- ✅ Added security event logging for `PASSWORD_RESET_REQUESTED` in `RecoveryService`.
- ✅ Added security event logging for `PASSWORD_RESET_COMPLETED` in `RecoveryService`.
- ✅ Implemented email enumeration protection in `resetPassword()` (always returns true).
- ✅ Enhanced email templates with:
  - Security metadata (IP, location, device, timestamp)
  - Action buttons (View Security Activity, Contact Support, Enable 2FA)
  - Security recommendations with styled lists
  - Warning banners for unauthorized changes
  - Localized content (EN/RU) via i18n
  - Responsive Tailwind CSS styling
- ✅ Added comprehensive i18n translations for password email templates (EN/RU).

**Changed**

- ✅ Migrated from Handlebars to React Email (@react-email/components) for modern template rendering.
- ✅ Updated `RecoveryService.resetPassword()` to log security events for both existing and non-existing users.
- ✅ Updated `RecoveryService.newPassword()` signature to accept `Request` and `userAgent` for metadata extraction.
- ✅ Updated `RecoveryResolver.newPassword()` to pass request context to service.
- ✅ Updated `AccountModule` to provide `MailService`.
- ✅ Updated `RecoveryModule` to provide `MailService`.
- ✅ Enhanced JSDoc documentation for all updated methods.
- ✅ Improved template structure with TemplateWrapper for consistent branding.

**Fixed**

- ✅ Fixed email enumeration vulnerability in `resetPassword()` (now always returns success).
- ✅ Fixed missing metadata in password reset security events.

**Removed**

- ❌ Removed Handlebars template files (replaced with React Email components).
- ❌ Removed Handlebars dependency for email rendering.

**Files Created**

- `src/modules/libs/mail/templates/password-changed.template.tsx`
- `src/modules/libs/mail/templates/password-reset-confirmation.template.tsx`

**Files Modified**

- `src/modules/libs/mail/mail.service.ts`
- `src/modules/libs/mail/templates/index.ts`
- `src/modules/auth/account/account.service.ts`
- `src/modules/auth/account/account.module.ts`
- `src/modules/auth/recovery/recovery.service.ts`
- `src/modules/auth/recovery/recovery.resolver.ts`
- `src/modules/auth/recovery/recovery.module.ts`
- `src/core/i18n/locales/en.json`
- `src/core/i18n/locales/ru.json`

---

### Step 4: Password Reset Template & Recovery Service Testing

:calendar: `2025-10-21`

**Added**

- ✅ Created `ResetPasswordTemplate` React Email component for password reset requests.
- ✅ Added comprehensive unit tests for `RecoveryService`:
  - `resetPassword()` with email enumeration protection tests
  - `newPassword()` with token validation tests
  - Email sending failure resilience tests
  - Security event creation tests
- ✅ Enhanced `sendPasswordResetToken()` in `MailService` to use React Email template.
- ✅ Added non-blocking error handling with logging for reset email sending.

**Changed**

- ✅ Replaced placeholder HTML in `sendPasswordResetToken()` with proper `ResetPasswordTemplate`.
- ✅ Updated `ResetPasswordTemplate` to include:
  - Security metadata display (IP, location, device, timestamp)
  - Main CTA button with reset link
  - Link fallback for email clients that block buttons
  - Warning banner for unauthorized requests
  - Token expiration notice (1 hour)
  - Request details box with full metadata
- ✅ Enhanced JSDoc documentation for `sendPasswordResetToken()`.
- ✅ Reverted `newPassword()` signature to original (2 parameters) - method is called without authentication.
- ✅ Updated security event logging in `newPassword()` to use 'unknown' for IP/userAgent (no request context).

**Fixed**

- ✅ Fixed missing React Email template for password reset flow (was using HTML string).
- ✅ Fixed error handling in `sendPasswordResetToken()` to properly log and re-throw.
- ✅ Fixed TypeScript errors in `RecoveryService` tests (incorrect method signature).
- ✅ Fixed unsafe `any` type assertion in argon2 mock.

**Files Created**

- `src/modules/libs/mail/templates/reset-password.template.tsx`
- `src/modules/auth/recovery/recovery.service.spec.ts`

**Files Modified**

- `src/modules/libs/mail/mail.service.ts`
- `src/modules/libs/mail/templates/index.ts`
- `src/modules/auth/recovery/recovery.service.ts`
- `src/modules/auth/recovery/recovery.resolver.ts`

**Testing**

- ✅ Added 8 unit tests for `RecoveryService`:
  - ✅ `resetPassword` sends email for existing user
  - ✅ `resetPassword` returns true for non-existent user (enumeration protection)
  - ✅ `resetPassword` doesn't fail if email sending fails
  - ✅ `newPassword` resets password with valid token
  - ✅ `newPassword` throws NotFoundException for invalid token
  - ✅ `newPassword` throws NotFoundException for wrong token type
  - ✅ `newPassword` throws BadRequestException for expired token
  - ✅ `newPassword` doesn't fail if confirmation email fails

---

## Module: Rate Limiting & Security Hardening

---

### Step 1: Rate Limiting Module Foundation

:calendar: `2025-10-21`

**Added**

- ✅ **`RateLimitModule`**: Создан новый модуль для управления ограничением запросов.
- ✅ **`RateLimitService`**: Реализован сервис на базе Redis с алгоритмом **sliding window** (`ZSET`).
- ✅ **`RateLimitGuard`**: Создан глобальный `APP_GUARD` для автоматической защиты всех эндпоинтов (по IP или `userId`).
- ✅ **`@RateLimit()` & `@SkipRateLimit()` Decorators**: Созданы декораторы для гибкой настройки и исключения лимитов.
- ✅ **Security Auditing**: При превышении лимита логируется событие `BRUTE_FORCE_DETECTED`.
- ✅ **Whitelist/Blacklist Support**: Реализованы методы для управления списками доверенных и заблокированных IP.
- ✅ **Fail-Open Strategy**: При ошибках Redis запросы разрешаются для обеспечения доступности сервиса.

**Changed**

- ✅ **`CoreModule`**: `RateLimitGuard` зарегистрирован как глобальный страж.
- ✅ **`RedisService`**: Расширен методами для работы с `SET` и `ZSET`.
- ✅ **`.env.example`**: Добавлены переменные для глобальных лимитов.

**Fixed**

- ✅ Устранены ошибки типизации клиента `redis` v4, обеспечив корректную работу с транзакциями и командами `sIsMember`.

**Files Created**

- `src/modules/security/rate-limit/*`

---

### Step 2: Account Lockout & Progressive Delays

:calendar: `2025-10-21`

**Added**

- ✅ **`AccountLockModule`**: Создан модуль для инкапсуляции логики блокировки аккаунтов.
- ✅ **`AccountLockService`**: Реализован сервис для отслеживания неудачных попыток входа и применения блокировок.
- ✅ **Progressive Delays**: Внедрены искусственные задержки ответа (1-2 секунды) после 3-й и 4-й неудачных попыток.
- ✅ **Persistent Locking**: При достижении порога неудач создается запись в таблице `AccountLock` в PostgreSQL.
- ✅ **`SecurityEvent` Integration**: При блокировке аккаунта логируется критическое событие `ACCOUNT_LOCKED`.

**Changed**

- ✅ **`SessionService`**: Метод `login()` теперь полностью интегрирован с `AccountLockService` для проверки и отслеживания попыток входа.
- ✅ **`SessionModule`**: Импортирован `AccountLockModule` для внедрения зависимостей.

**Files Created**

- `src/modules/security/account-lock/*`

---

### Step 3: Security Headers Middleware

:calendar: `2025-10-21`

**Added**

- ✅ **Security Headers**: Приложение теперь отправляет набор HTTP-заголовков для усиления безопасности с помощью библиотеки `helmet`.
- ✅ **Content Security Policy (CSP)**: Настроена строгая политика, разрешающая контент только с доверенных источников (`self`, `Cloudinary`, `Google Fonts`).
- ✅ **HSTS, Clickjacking, MIME Sniffing Protection**: Включены и настроены все стандартные защитные заголовки.

**Changed**

- ✅ **`main.ts`**: `helmet` интегрирован как глобальный middleware, который применяется одним из первых в конвейере обработки запросов.

**Fixed**

- ✅ Устранены ошибки типизации `HelmetOptions`, обеспечив совместимость конфигурации с установленной версией `helmet`.

**Files Created**

- `src/modules/security/config/helmet.config.ts`

---

### Step 4: Brute-Force Protection Integration

:calendar: `2025-10-21`

**Added**

- ✅ **Endpoint-specific Rate Limiting**: Критически важные эндпоинты теперь защищены индивидуальными, более строгими лимитами с помощью декоратора `@RateLimit`.

**Changed**

- ✅ **`SessionResolver`**: Мутация `login` защищена лимитом в 5 попыток за 15 минут.
- ✅ **`RecoveryResolver`**: Мутации `resetPassword` и `newPassword` защищены от спама и перебора токенов.
- ✅ **`TwoFactorResolver`**: Мутация `verify2FA` защищена от перебора кодов.
- ✅ **`AccountResolver`**: Мутация `changePassword` защищена от перебора старого пароля.
- ✅ **`VerificationResolver`**: Мутация `verifyEmail` защищена от перебора токенов.

**Files Modified**

- Все соответствующие файлы резолверов в `src/modules/auth/`.

---

## Module: Architecture Refactoring

---

### Step 1: Centralize Security Module

:calendar: `2025-10-21`

**Added**

- ✅ **`SecurityModule`**: Создан новый главный модуль (`@Global()`) в `src/modules/security`, который объединяет `RateLimitModule` и `AccountLockModule`.

**Changed**

- ✅ **Структура проекта**: Модуль `RateLimitModule` был перемещен из корня `modules` в `modules/security/rate-limit`.
- ✅ **`CoreModule`**: Упрощен путем замены импорта `RateLimitModule` на единый `SecurityModule`.

**Fixed**

- ✅ **Циклические зависимости**: Устранена ошибка `UnknownDependenciesException` путем разрыва цикла между `CoreModule` и `SecurityModule`.

**Removed**

- ❌ Удалена директория `src/modules/rate-limit` (ее содержимое теперь находится в `src/modules/security/rate-limit`).

---

### Step 2 (Revised): Consolidate Communication Adapters

:calendar: `2025-10-21`

**Added**

- ✅ **`CommunicationModule`**: Создан новый глобальный модуль в `src/core/communication`, который объединяет `MailModule` и `SmsModule`.

**Changed**

- ✅ **Структура проекта**: Модули-адаптеры `MailModule` и `SmsModule` были перемещены из `src/modules/libs` в `src/core/communication`.
- ✅ **`CoreModule`**: Упрощен путем замены импортов `MailModule` и `SmsModule` на единый `CommunicationModule`.
- ✅ **Пути импорта**: Обновлены все пути импорта для `MailService` и `SmsService` во всем приложении.

**Removed**

- ❌ **Директория `src/modules/libs`**: Эта директория была удалена.

---
