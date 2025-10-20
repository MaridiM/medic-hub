# Security Notifications System

## Overview

The Notification System is a global, enterprise-grade module responsible for sending security-related notifications to users across multiple channels (Email, SMS). It is designed to be reliable, scalable, and secure, ensuring that users are promptly informed about critical events related to their account security.

### Core Features

-   **Global Service**: Available throughout the application via NestJS's global module system.
-   **Multi-Channel Delivery**: Supports Email and SMS (future-proof for Push, In-App).
-   **Rate Limiting**: Prevents spamming users with excessive notifications (10/hour, 50/day).
-   **Duplicate Detection**: Avoids sending identical notifications within a 5-minute window.
-   **i18n Support**: All templates are fully internationalized (en/ru).
-   **Email Reputation Management**: Checks for bounced or unsubscribed emails before sending.
-   **Prioritization**: Notifications are categorized by priority (Normal, High, Critical) to determine delivery channels.
-   **Robust Error Handling**: Notification failures are logged but do not interrupt critical application flows.

---

## 1. Notification Types

The system handles a wide range of security events:

| Event Type                   | Description                                       | Category | Priority | Channels   | Triggered By                              |
| ---------------------------- | ------------------------------------------------- | -------- | -------- | ---------- | ----------------------------------------- |
| **2FA Method Added**         | A new 2FA method was added to the user's account. | SECURITY | HIGH     | Email, SMS | `TwoFactorMethodService`                  |
| **2FA Method Removed**       | A 2FA method was removed.                         | SECURITY | HIGH     | Email, SMS | `TwoFactorMethodService`                  |
| **2FA Disabled**             | 2FA was completely disabled.                      | SECURITY | CRITICAL | Email, SMS | `TwoFactorMethodService`                  |
| **New Device Login**         | Login detected from a new, unrecognized device.   | SECURITY | HIGH     | Email, SMS | `DeviceTrustService`                      |
| **Suspicious Activity**      | Login attempt with a high risk score.             | SECURITY | CRITICAL | Email, SMS | `SecurityEventService` / `RiskCalculator` |
| **Low Backup Codes**         | User is running low on backup codes.              | SECURITY | NORMAL   | Email      | `BackupCodeService`                       |
| **Backup Codes Regenerated** | User has regenerated their backup codes.          | SECURITY | NORMAL   | Email      | `BackupCodeService`                       |
| **2FA Disabled by Admin**    | An admin has disabled 2FA for the user.           | ADMIN    | CRITICAL | Email, SMS | `AdminTwoFactorService`                   |
| **Device Revoked by Admin**  | An admin has revoked a user's trusted device.     | ADMIN    | HIGH     | Email, SMS | `AdminTwoFactorService`                   |

---

## 2. Architecture

The `NotificationModule` is a **`@Global()`** module, making `NotificationService` available for dependency injection in any service across the application without needing to import `NotificationModule` into each feature module.

### Core Components

-   **`NotificationModule`**: Registers `NotificationService` and its dependencies (`MailService`, `SmsService`) as global providers.
-   **`NotificationService`**: The orchestrator. It contains the business logic for when and how to send notifications, including rate limiting, duplicate checks, and channel selection.
-   **`MailService`**: A low-level service responsible for rendering React Email templates and sending emails via a provider (e.g., SendGrid, SES).
-   **`SmsService`**: A low-level service for sending SMS messages (e.g., via Twilio).
-   **Email Templates**: A set of `.tsx` files in `src/modules/libs/mail/templates/` that define the structure and content of each email using `@react-email/components`.
-   **i18n JSON Files**: All text content is managed in `src/core/i18n/locales/` for easy translation.

### Workflow Example: New 2FA Method Added

1.  **`TwoFactorMethodService`**: A user successfully adds a TOTP method.
2.  **Call `NotificationService`**: The service calls `this.notificationService.notify2FAMethodAdded(...)`.
3.  **`NotificationService` Logic**:
    -   Checks global notification settings.
    -   Performs rate-limiting and duplicate checks for the user.
    -   Determines delivery channels based on priority (e.g., `[EMAIL, SMS]`).
    -   Calls `sendViaEmail()` helper.
4.  **`sendViaEmail()` Helper**:
    -   Checks if the user's email is verified and not bounced.
    -   Calls the specific `MailService` method: `this.mailService.send2FAMethodAddedEmail(...)`.
5.  **`MailService` Logic**:
    -   Renders the `TwoFAMethodAddedTemplate.tsx` template with the provided data and i18n instance.
    -   Sends the resulting HTML to the email provider.
6.  **Result**: The user receives a formatted, translated email about the new 2FA method.

---

## 3. Configuration

The notification system is configured via environment variables.

### File: `.env.example`

```bash
# ==================================
# NOTIFICATION SETTINGS
# ==================================

# Globally enable/disable security notifications (true/false)
SECURITY_NOTIFICATIONS_ENABLED=true

# URLs used in email templates
# APP_URL should be your frontend application URL
APP_URL="http://localhost:3000"
SECURITY_SETTINGS_URL="${APP_URL}/settings/security"
SECURITY_ACTIVITY_URL="${APP_URL}/security/activity"
LOCK_ACCOUNT_URL="${APP_URL}/security/lock-account"
SUPPORT_URL="${APP_URL}/support"