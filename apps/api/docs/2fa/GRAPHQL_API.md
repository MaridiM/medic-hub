# GraphQL API Reference: Unified 2FA System

## 📚 Overview

This document provides a complete, detailed reference for all available **queries** and **mutations** for interacting with the Unified 2FA system. It is intended for frontend developers and anyone consuming this API.

**Base URL:** `/graphql`
**Authentication:** Requires a valid `Authorization: Bearer <sessionToken>` header for all operations.

---

## 📋 Table of Contents

- [GraphQL API Reference: Unified 2FA System](#graphql-api-reference-unified-2fa-system)
  - [📚 Overview](#-overview)
  - [📋 Table of Contents](#-table-of-contents)
  - [🔍 Queries (Reading Data)](#-queries-reading-data)
    - [`generateTotpSetup`](#generatetotpsetup)
    - [`my2FAMethods`](#my2famethods)
    - [`backupCodesStatus`](#backupcodesstatus)
    - [`myTrustedDevices`](#mytrusteddevices)
    - [`is2FAEnabled`](#is2faenabled)
    - [`isSession2FAVerified`](#issession2faverified)
  - [⚙️ Mutations (Modifying Data)](#️-mutations-modifying-data)
    - [TOTP Setup](#totp-setup)
      - [`completeTotpSetup`](#completetotpsetup)
    - [OTP Setup](#otp-setup)
      - [`setupOtp`](#setupotp)
      - [`sendOtpCode`](#sendotpcode)
      - [`verifyOtpSetup`](#verifyotpsetup)
    - [Verification](#verification)
      - [`verify2FA`](#verify2fa)
      - [`verifyBackupCode`](#verifybackupcode)
    - [Method Management](#method-management)
      - [`update2FAMethod`](#update2famethod)
      - [`remove2FAMethod`](#remove2famethod)
    - [Backup Codes Management](#backup-codes-management)
      - [`regenerateBackupCodes`](#regeneratebackupcodes)
    - [Device Trust Management](#device-trust-management)
      - [`revokeDeviceTrust`](#revokedevicetrust)
  - [📘 GraphQL Types (Data Structures)](#-graphql-types-data-structures)
    - [**Table of Contents**](#table-of-contents)
    - [Object Types (Типы ответов)](#object-types-типы-ответов)
      - [`TotpSetup`](#totpsetup)
      - [`OtpSetup`](#otpsetup)
      - [`TwoFactorMethod`](#twofactormethod)
      - [`TwoFactorMethodsList`](#twofactormethodslist)
      - [`BackupCodesStatus`](#backupcodesstatus-1)
      - [`TrustedDevice`](#trusteddevice)
      - [`TwoFactorSetupComplete`](#twofactorsetupcomplete)
      - [`BackupCodesRegenerated`](#backupcodesregenerated)
      - [`TwoFactorSuccess`](#twofactorsuccess)
    - [Input Types (Типы входных данных)](#input-types-типы-входных-данных)
    - [Enums (Перечисления)](#enums-перечисления)
  - [⚠️ Error Handling (Обработка ошибок)](#️-error-handling-обработка-ошибок)
    - [Структура ответа с ошибкой](#структура-ответа-с-ошибкой)
    - [Таблица кодов и сообщений об ошибках](#таблица-кодов-и-сообщений-об-ошибках)
    - [Пример обработки ошибок на Frontend (React)](#пример-обработки-ошибок-на-frontend-react)

---

## 🔍 Queries (Reading Data)

### `generateTotpSetup`
Starts the TOTP (Authenticator App) setup process. Generates a unique secret and provides it as a QR code and a manual entry key. This secret is valid for **10 minutes**.

**GraphQL Query:**
```graphql
query GenerateTotpSetup($data: GenerateTotpSetupInput) {
  generateTotpSetup(data: $data) {
    methodId
    qrCodeUrl
    manualEntryKey
    issuer
    accountName
  }
}
```

**Arguments:**
| Name   | Type                     | Description                                                                   |
| ------ | ------------------------ | ----------------------------------------------------------------------------- |
| `data` | `GenerateTotpSetupInput` | (Optional) Contains a `name` for the new method to help the user identify it. |

**Example Variables (Maximal):**
```json
{
  "data": {
    "name": "My MacBook Pro Authenticator"
  }
}
```

**Response Fields:**
| Field            | Type      | Description                                                                        |
| ---------------- | --------- | ---------------------------------------------------------------------------------- |
| `methodId`       | `String!` | A temporary ID (`"temp"`). Not needed for the next step.                           |
| `qrCodeUrl`      | `String!` | A data URL (`data:image/png;base64,...`) for the QR code image.                    |
| `manualEntryKey` | `String!` | The secret key for manual entry. **This is the `secret` for `completeTotpSetup`.** |
| `issuer`         | `String!` | The name of your application (e.g., "YourApp").                                    |
| `accountName`    | `String!` | The user's email, displayed in the authenticator app.                              |

---
### `my2FAMethods`
Retrieves a list of all active 2FA methods for the currently authenticated user, sorted with the primary method first.

**GraphQL Query:**
```graphql
query GetMy2FAMethods {
  my2FAMethods {
    methods {
      id
      method
      name
      isPrimary
      lastUsedAt
      useCount
      createdAt
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
```

**Example Response (User with TOTP and Email OTP):**
```json
{
  "data": {
    "my2FAMethods": {
      "methods": [
        {
          "id": "c1b2a3d4-e5f6-7890-1234-567890abcdef",
          "method": "TOTP",
          "name": "Google Authenticator",
          "isPrimary": true,
          "lastUsedAt": "2025-10-26T10:00:00.000Z",
          "useCount": 42,
          "createdAt": "2025-01-15T09:00:00.000Z"
        },
        {
          "id": "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
          "method": "OTP_EMAIL",
          "name": "Backup Email",
          "isPrimary": false,
          "lastUsedAt": "2025-09-01T14:30:00.000Z",
          "useCount": 3,
          "createdAt": "2025-08-20T11:00:00.000Z"
        }
      ],
      "primary": {
        "id": "c1b2a3d4-e5f6-7890-1234-567890abcdef",
        "method": "TOTP",
        "name": "Google Authenticator"
      },
      "totalActive": 2,
      "is2FAEnabled": true
    }
  }
}
```

---
### `backupCodesStatus`
Checks the status of backup codes for a specific 2FA method.

**Arguments:**
| Name       | Type     | Description                                                                          |
| ---------- | -------- | ------------------------------------------------------------------------------------ |
| `methodId` | `String` | (Optional) The ID of the method to check. If omitted, checks the **primary** method. |

**GraphQL Query:**
```graphql
query GetBackupCodesStatus($methodId: String) {
  backupCodesStatus(methodId: $methodId) {
    total
    used
    remaining
    expired
    isLow
  }
}
```

**Example Variables:**
```json
{
  "methodId": "c1b2a3d4-e5f6-7890-1234-567890abcdef"
}
```

**Example Response (2 codes used, 8 remaining):**
```json
{
  "data": {
    "backupCodesStatus": {
      "total": 10,
      "used": 2,
      "remaining": 8,
      "expired": 0,
      "isLow": false
    }
  }
}
```

---
### `myTrustedDevices`
Retrieves a list of all devices the user has marked as "trusted".

**GraphQL Query:**
```graphql
query GetMyTrustedDevices {
  myTrustedDevices {
    id
    deviceId
    name
    browser
    os
    device
    trustScore
    lastCountry
    lastCity
    isActive
    lastSeenAt
    expiresAt
    createdAt
  }
}
```

**Example Response:**
```json
{
  "data": {
    "myTrustedDevices": [
      {
        "id": "a1b2c3d4-e5f6-...",
        "deviceId": "a1b2c3d4e5f6...",
        "name": "Work Laptop",
        "browser": "Chrome",
        "os": "Windows",
        "device": "desktop",
        "trustScore": 85,
        "lastCountry": "US",
        "lastCity": "New York",
        "isActive": true,
        "lastSeenAt": "2025-10-26T10:00:00.000Z",
        "expiresAt": "2025-11-25T10:00:00.000Z",
        "createdAt": "2025-01-15T09:00:00.000Z"
      }
    ]
  }
}
```

---
### `is2FAEnabled`
A quick boolean check to see if the current user has any active 2FA method.

**GraphQL Query:**
```graphql
query Is2FAEnabled {
  is2FAEnabled
}
```

---
### `isSession2FAVerified`
A quick boolean check to see if the current session has already been verified with 2FA.

**GraphQL Query:**
```graphql
query IsSession2FAVerified {
  isSession2FAVerified
}
```

---

## ⚙️ Mutations (Modifying Data)

### TOTP Setup

#### `completeTotpSetup`
Finalizes the TOTP setup by verifying the first code. On success, it activates the method and returns a new set of backup codes.

**Arguments:**
| Name   | Type                      | Description                                                                                       |
| ------ | ------------------------- | ------------------------------------------------------------------------------------------------- |
| `data` | `CompleteTotpSetupInput!` | **Required.** Contains the `secret` from `generateTotpSetup` and the 6-digit `code` from the app. |

**Example Mutation:**
```graphql
mutation CompleteTotpSetup($data: CompleteTotpSetupInput!) {
  completeTotpSetup(data: $data) {
    success
    methodId
    backupCodes
    message
  }
}
```

**Example Variables (Maximal):**
```json
{
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "code": "123456",
    "name": "My Google Authenticator"
  }
}
```
**CRITICAL:** You **MUST** show the `backupCodes` to the user immediately, as this is their only chance to save them.

---

### OTP Setup

#### `setupOtp`
Creates a new, inactive OTP method (Email or SMS) and returns its ID for verification.

**Arguments:**
| Name   | Type             | Description                                                                                           |
| ------ | ---------------- | ----------------------------------------------------------------------------------------------------- |
| `data` | `SetupOtpInput!` | **Required.** Specifies the method (`OTP_EMAIL` or `OTP_SMS`), the destination, and an optional name. |

**Example Mutation:**
```graphql
mutation SetupOtp($data: SetupOtpInput!) {
  setupOtp(data: $data) {
    methodId
    destination
    message
  }
}
```

**Example Variables (Email):**
```json
{
  "data": {
    "method": "OTP_EMAIL",
    "email": "user.backup@email.com",
    "name": "Backup Email"
  }
}
```

#### `sendOtpCode`
Sends a 6-digit verification code to the destination specified in an OTP method.

**Arguments:**
| Name   | Type                | Description                                                                |
| ------ | ------------------- | -------------------------------------------------------------------------- |
| `data` | `SendOtpCodeInput!` | **Required.** Contains the `methodId` of the OTP method to send a code to. |

**Example Mutation:**
```graphql
mutation SendOtpCode($data: SendOtpCodeInput!) {
  sendOtpCode(data: $data) {
    success
    message
  }
}
```

**Example Variables:**
```json
{
  "data": {
    "methodId": "f0e9d8c7-b6a5-4321-fedc-ba9876543210"
  }
}
```

#### `verifyOtpSetup`
Verifies the OTP code to finalize and activate the new OTP method. Returns backup codes.

**Arguments:**
| Name   | Type                   | Description                                                                |
| ------ | ---------------------- | -------------------------------------------------------------------------- |
| `data` | `VerifyOtpSetupInput!` | **Required.** Contains the `methodId` and the `code` received by the user. |

**Example Mutation:**
```graphql
mutation VerifyOtpSetup($data: VerifyOtpSetupInput!) {
  verifyOtpSetup(data: $data) {
    success
    methodId
    backupCodes
    message
  }
}
```

**Example Variables:**
```json
{
  "data": {
    "methodId": "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
    "code": "654321"
  }
}
```

---

### Verification

#### `verify2FA`
The universal verification endpoint used during login. It smartly detects whether the code is a 6-digit TOTP/OTP or an 8-character backup code.

**Arguments:**
| Name   | Type              | Description                                                           |
| ------ | ----------------- | --------------------------------------------------------------------- |
| `data` | `Verify2FAInput!` | **Required.** Contains the `code` and an optional `trustDevice` flag. |

**Example Mutation:**
```graphql
mutation Verify2FA($data: Verify2FAInput!) {
  verify2FA(data: $data) {
    success
    message
  }
}
```

**Example Variables (Maximal):**
```json
{
  "data": {
    "code": "123456",
    "methodId": "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
    "trustDevice": true
  }
}
```

#### `verifyBackupCode`
Explicitly verifies an 8-character backup code.

**Arguments:**
| Name   | Type                     | Description                              |
| ------ | ------------------------ | ---------------------------------------- |
| `data` | `VerifyBackupCodeInput!` | **Required.** Contains the `backupCode`. |

**Example Mutation:**
```graphql
mutation VerifyBackupCode($data: VerifyBackupCodeInput!) {
  verifyBackupCode(data: $data) {
    success
    message
  }
}
```

**Example Variables:**
```json
{
  "data": {
    "backupCode": "A1B2C3D4",
    "methodId": "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
  }
}
```

---
### Method Management

#### `update2FAMethod`
Updates a 2FA method's properties, such as its name or primary status.

**Arguments:**
| Name   | Type                    | Description                                                                           |
| ------ | ----------------------- | ------------------------------------------------------------------------------------- |
| `data` | `Update2FAMethodInput!` | **Required.** Contains the `methodId` and the fields to update (`name`, `isPrimary`, `isActive`). |

**Example Mutation:**
```graphql
mutation Update2FAMethod($data: Update2FAMethodInput!) {
  update2FAMethod(data: $data) {
    success
  }
}
```

**Example Variables (Set a method as primary):**
```json
{
  "data": {
    "methodId": "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
    "isPrimary": true,
    "isActive": true,
    "name": "Primary Email"
  }
}
```

#### `remove2FAMethod`
Permanently deletes a 2FA method. **Requires password confirmation.**

**Arguments:**
| Name   | Type                    | Description                                                                                                    |
| ------ | ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| `data` | `Remove2FAMethodInput!` | **Required.** Contains the `methodId` and the user's `password`. A `code` is required if it's the last method. |

**Example Mutation:**
```graphql
mutation Remove2FAMethod($data: Remove2FAMethodInput!) {
  remove2FAMethod(data: $data) {
    success
  }
}
```

**Example Variables (Removing the LAST method):**
```json
{
  "data": {
    "methodId": "c1b2a3d4-e5f6-7890-1234-567890abcdef",
    "password": "my-secret-password",
    "code": "123456"
  }
}
```

---
### Backup Codes Management

#### `regenerateBackupCodes`
Generates a new set of backup codes, invalidating all old ones. **Requires password confirmation.**

**Arguments:**
| Name   | Type                          | Description                                                              |
| ------ | ----------------------------- | ------------------------------------------------------------------------ |
| `data` | `RegenerateBackupCodesInput!` | **Required.** Contains the user's `password` and an optional `methodId`. |

**Example Mutation:**
```graphql
mutation RegenerateBackupCodes($data: RegenerateBackupCodesInput!) {
  regenerateBackupCodes(data: $data) {
    success
    backupCodes
    message
  }
}
```

**Example Variables (for a specific method):**
```json
{
  "data": {
    "methodId": "c1b2a3d4-e5f6-7890-1234-567890abcdef",
    "password": "my-secret-password"
  }
}
```

---
### Device Trust Management

#### `revokeDeviceTrust`
Revokes the "trusted" status of a device, forcing 2FA on the next login from it.

**Arguments:**
| Name       | Type      | Description                                                                                    |
| ---------- | --------- | ---------------------------------------------------------------------------------------------- |
| `deviceId` | `String!` | **Required.** The `deviceId` of the device to revoke (obtained from `myTrustedDevices` query). |

**Example Mutation:**
```graphql
mutation RevokeDeviceTrust($deviceId: String!) {
  revokeDeviceTrust(deviceId: $deviceId) {
    success
    message
  }
}
```

**Example Variables:**
```json
{
  "deviceId": "a1b2c3d4e5f6..."
}
```

---

## 📘 GraphQL Types (Data Structures)

Этот раздел описывает все кастомные GraphQL-типы, используемые в 2FA API.

### **Table of Contents**
1.  [Object Types (Типы ответов)](#object-types-типы-ответов)
2.  [Input Types (Типы входных данных)](#input-types-типы-входных-данных)
3.  [Enums (Перечисления)](#enums-перечисления)

---

### Object Types (Типы ответов)

Это типы, которые вы получаете в ответах от сервера.

#### `TotpSetup`
Содержит все необходимое для начала настройки TOTP (Authenticator App).

| Field            | Type      | Description                                                                                     |
| ---------------- | --------- | ----------------------------------------------------------------------------------------------- |
| `methodId`       | `String!` | Временный ID (`"temp"`). Не используется на клиенте.                                            |
| `qrCodeUrl`      | `String!` | Data URL (`data:image/png;base64,...`) для отображения QR-кода.                                 |
| `manualEntryKey` | `String!` | Секретный ключ для ручного ввода в приложение-аутентификатор.                                   |
| `issuer`         | `String!` | Название вашего приложения (например, "YourApp"), которое будет отображаться в аутентификаторе. |
| `accountName`    | `String!` | Email пользователя, который будет отображаться в аутентификаторе.                               |

#### `OtpSetup`
Ответ после начала настройки OTP (Email/SMS).

| Field         | Type      | Description                                                                                                |
| ------------- | --------- | ---------------------------------------------------------------------------------------------------------- |
| `methodId`    | `String!` | Уникальный ID созданного (но еще не активного) метода. Используется для отправки и верификации кода.       |
| `destination` | `String!` | Частично скрытый email (`us***@example.com`) или номер телефона (`+1*****6789`), куда будет отправлен код. |
| `message`     | `String!` | Сообщение с инструкциями для пользователя.                                                                 |

#### `TwoFactorMethod`
Представляет один настроенный метод 2FA.

| Field        | Type          | Description                                                   |
| ------------ | ------------- | ------------------------------------------------------------- |
| `id`         | `String!`     | Уникальный ID метода.                                         |
| `method`     | `E2FAMethod!` | Тип метода (например, `TOTP`, `OTP_EMAIL`).                   |
| `name`       | `String`      | Кастомное имя, данное пользователем (например, "Мой iPhone"). |
| `isPrimary`  | `Boolean!`    | `true`, если это основной метод для входа.                    |
| `isActive`   | `Boolean!`    | `true`, если метод активен и может быть использован.          |
| `lastUsedAt` | `DateTime`    | Дата и время последнего успешного использования этого метода. |
| `useCount`   | `Int!`        | Общее количество успешных использований.                      |
| `createdAt`  | `DateTime!`   | Дата и время создания метода.                                 |

#### `TwoFactorMethodsList`
Ответ на запрос `my2FAMethods`, содержащий сводную информацию.

| Field          | Type                  | Description                                                      |
| -------------- | --------------------- | ---------------------------------------------------------------- |
| `methods`      | `[TwoFactorMethod!]!` | Массив всех активных методов 2FA пользователя.                   |
| `primary`      | `TwoFactorMethod`     | Метод, помеченный как основной. `null`, если такового нет.       |
| `totalActive`  | `Int!`                | Общее количество активных методов.                               |
| `is2FAEnabled` | `Boolean!`            | Глобальный флаг, показывающий, включена ли 2FA для пользователя. |

#### `BackupCodesStatus`
Информация о состоянии резервных кодов.

| Field       | Type       | Description                                                     |
| ----------- | ---------- | --------------------------------------------------------------- |
| `total`     | `Int!`     | Общее количество сгенерированных кодов (обычно 10).             |
| `used`      | `Int!`     | Количество уже использованных кодов.                            |
| `remaining` | `Int!`     | Количество оставшихся, неиспользованных кодов.                  |
| `expired`   | `Int!`     | Количество кодов, срок действия которых истек (если применимо). |
| `isLow`     | `Boolean!` | `true`, если количество оставшихся кодов меньше или равно 3.    |

#### `TrustedDevice`
Информация о доверенном устройстве.

| Field         | Type        | Description                                               |
| ------------- | ----------- | --------------------------------------------------------- |
| `id`          | `String!`   | Уникальный ID записи о доверенном устройстве.             |
| `deviceId`    | `String!`   | Хеш-идентификатор самого устройства.                      |
| `name`        | `String`    | Имя, данное пользователем (например, "Домашний ноутбук"). |
| `browser`     | `String!`   | Название браузера (например, "Chrome").                   |
| `os`          | `String!`   | Название операционной системы (например, "Windows").      |
| `device`      | `String!`   | Тип устройства (`desktop`, `mobile`, `tablet`).           |
| `trustScore`  | `Float!`    | Оценка доверия от 0 до 100.                               |
| `lastCountry` | `String`    | Последняя известная страна использования.                 |
| `lastCity`    | `String`    | Последний известный город использования.                  |
| `isActive`    | `Boolean!`  | `true`, если доверие активно.                             |
| `lastSeenAt`  | `DateTime!` | Дата и время последнего использования.                    |
| `expiresAt`   | `DateTime`  | Дата, когда доверие автоматически истечет.                |
| `createdAt`   | `DateTime!` | Дата добавления устройства в доверенные.                  |

#### `TwoFactorSetupComplete`
Ответ после успешного завершения настройки любого 2FA метода.

| Field         | Type         | Description                                                                                       |
| ------------- | ------------ | ------------------------------------------------------------------------------------------------- |
| `success`     | `Boolean!`   | Всегда `true` в случае успеха.                                                                    |
| `methodId`    | `String!`    | ID созданного и активированного метода.                                                           |
| `backupCodes` | `[String!]!` | **КРИТИЧЕСКИ ВАЖНО:** Массив из 10 одноразовых резервных кодов. **Показывается только один раз!** |
| `message`     | `String!`    | Сообщение-предупреждение о необходимости сохранить коды.                                          |

#### `BackupCodesRegenerated`
Ответ после успешной регенерации резервных кодов.

| Field         | Type         | Description                                                                                |
| ------------- | ------------ | ------------------------------------------------------------------------------------------ |
| `success`     | `Boolean!`   | Всегда `true` в случае успеха.                                                             |
| `backupCodes` | `[String!]!` | **КРИТИЧЕСКИ ВАЖНО:** Новый набор из 10 резервных кодов. **Показывается только один раз!** |
| `message`     | `String!`    | Сообщение-предупреждение.                                                                  |

#### `TwoFactorSuccess`
Универсальный ответ для простых мутаций, которые не возвращают сложных данных.

| Field     | Type       | Description                               |
| --------- | ---------- | ----------------------------------------- |
| `success` | `Boolean!` | `true` в случае успеха.                   |
| `message` | `String`   | (Опционально) Сообщение с подтверждением. |

---

### Input Types (Типы входных данных)

Это типы, которые вы используете для передачи данных в аргументах (`data: ...`) мутаций.

-   **`GenerateTotpSetupInput`**:
    -   `name: String` (Опционально) - Кастомное имя для нового TOTP-метода (например, "Рабочий телефон").

-   **`CompleteTotpSetupInput`**:
    -   `secret: String!` - **Обязательно.** `manualEntryKey`, полученный от `generateTotpSetup`.
    -   `code: String!` - **Обязательно.** 6-значный код из приложения-аутентификатора.
    -   `name: String` (Опционально) - Кастомное имя для метода.

-   **`SetupOtpInput`**:
    -   `method: E2FAMethod!` - **Обязательно.** Должен быть `OTP_EMAIL` или `OTP_SMS`.
    -   `email: String` (Опционально) - **Обязательно**, если `method` - `OTP_EMAIL`.
    -   `phone: String` (Опционально) - **Обязательно**, если `method` - `OTP_SMS`. Должен быть в формате E.164 (например, `+1234567890`).
    -   `name: String` (Опционально) - Кастомное имя для метода.

-   **`SendOtpCodeInput`**:
    -   `methodId: String!` - **Обязательно.** ID OTP-метода, на который нужно отправить код (полученный из `setupOtp`).

-   **`VerifyOtpSetupInput`**:
    -   `methodId: String!` - **Обязательно.** ID OTP-метода.
    -   `code: String!` - **Обязательно.** 6-значный код, полученный пользователем.

-   **`Verify2FAInput`**:
    -   `code: String!` - **Обязательно.** 6-значный TOTP/OTP код ИЛИ 8-символьный резервный код.
    -   `methodId: String` (Опционально) - ID конкретного метода для проверки. Если не указан, система попытается проверить по основному методу.
    -   `trustDevice: Boolean` (Опционально) - Установите в `true`, чтобы добавить текущее устройство в доверенные на 30 дней. По умолчанию `false`.

-   **`VerifyBackupCodeInput`**:
    -   `backupCode: String!` - **Обязательно.** 8-символьный резервный код.
    -   `methodId: String` (Опционально) - ID метода, к которому относится код.

-   **`Update2FAMethodInput`**:
    -   `methodId: String!` - **Обязательно.** ID метода, который нужно обновить.
    -   `name: String` (Опционально) - Новое имя для метода.
    -   `isPrimary: Boolean` (Опционально) - Установите в `true`, чтобы сделать этот метод основным.
    -   `isActive: Boolean` (Опционально) - Установите в `true`, чтобы активировать метод.

-   **`Remove2FAMethodInput`**:
    -   `methodId: String!` - **Обязательно.** ID метода для удаления.
    -   `password: String!` - **Обязательно.** Текущий пароль пользователя для подтверждения.
    -   `code: String` (Опционально) - Действующий 2FA-код. **Обязателен**, если это последний удаляемый метод.

-   **`RegenerateBackupCodesInput`**:
    -   `methodId: String` (Опционально) - ID метода для регенерации кодов. Если не указан, коды будут пересозданы для **всех** активных методов.
    -   `password: String!` - **Обязательно.** Текущий пароль пользователя для подтверждения.

---

### Enums (Перечисления)

Фиксированные наборы строковых значений.

-   **`E2FAMethod`**:
    -   `TOTP`: Приложение-аутентификатор (Google Authenticator, Authy).
    -   `OTP_EMAIL`: Одноразовый код по Email.
    -   `OTP_SMS`: Одноразовый код по SMS.
    -   `WEBAUTHN`: Аппаратный ключ безопасности (YubiKey) (в будущем).
    -   `PASSKEY`: Биометрия (Touch/Face ID) (в будущем).

-   **`ESecuritySeverity`**:
    -   `LOW`: Низкая серьезность (информационное событие).
    -   `MEDIUM`: Средняя серьезность (необычная активность, требует внимания).
    -   `HIGH`: Высокая серьезность (подозрительная активность, требует оповещения).
    -   `CRITICAL`: Критическая серьезность (вероятная атака, требует немедленных действий).

---

## ⚠️ Error Handling (Обработка ошибок)

API использует стандартный формат ошибок GraphQL. При возникновении ошибки ответ будет содержать поле `errors` вместо поля `data`.

### Структура ответа с ошибкой

Каждая ошибка в массиве `errors` имеет следующую структуру:
```json
{
  "errors": [
    {
      "message": "The verification code is incorrect. Please check your authenticator app and try again.",
      "locations": [ { "line": 2, "column": 3 } ],
      "path": [ "verify2FA" ],
      "extensions": {
        "code": "BAD_USER_INPUT",
        "timestamp": "2025-10-27T10:30:00.123Z",
        "originalError": {
            "message": "Invalid verification code",
            "error": "Bad Request",
            "statusCode": 400
        }
      }
    }
  ]
}
```
-   **`message`**: Дружелюбное, локализованное сообщение для пользователя. **Его можно и нужно показывать напрямую в UI.**
-   **`extensions.code`**: Машиночитаемый код ошибки (например, `BAD_USER_INPUT`, `UNAUTHENTICATED`). Используется для программной логики на клиенте.
-   **`extensions.originalError.message`**: Более техническое сообщение об ошибке, полезное для отладки.

### Таблица кодов и сообщений об ошибках

Ниже приведен список специфичных для 2FA ошибок, которые может вернуть API.

| `message` (содержит текст)              | `extensions.code`       | Причина                                                                                 | Действие на Frontend                                                                                                |
| :-------------------------------------- | :---------------------- | :-------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Setup & Configuration**               |                         |                                                                                         |                                                                                                                     |
| `Setup session has expired`             | `BAD_USER_INPUT`        | Пользователь потратил более 10 минут на настройку TOTP.                                 | Показать сообщение "Сессия истекла" и предложить начать настройку заново (запросить новый QR-код).                  |
| `Invalid secret provided`               | `BAD_USER_INPUT`        | Секретный ключ, отправленный для верификации, не совпадает с тем, что был сгенерирован. | Это внутренняя ошибка, маловероятная при правильной реализации. Предложить начать заново.                           |
| `Maximum of {max} methods`              | `BAD_USER_INPUT`        | Пользователь пытается добавить 6-й метод 2FA.                                           | Показать сообщение "Достигнут лимит методов" и предложить удалить один из существующих.                             |
| **Verification**                        |                         |                                                                                         |                                                                                                                     |
| `The verification code is incorrect`    | `BAD_USER_INPUT`        | Пользователь ввел неверный 6-значный код.                                               | Показать "Неверный код". Можно добавить счетчик оставшихся попыток.                                                 |
| `The backup code is invalid`            | `BAD_USER_INPUT`        | Пользователь ввел неверный 8-значный резервный код.                                     | Показать "Неверный резервный код".                                                                                  |
| `Code has expired`                      | `BAD_USER_INPUT`        | Срок действия OTP-кода (обычно 5 минут) истек.                                          | Показать "Срок действия кода истек" и активировать кнопку "Отправить код повторно".                                 |
| `Code does not match the method`        | `BAD_USER_INPUT`        | Код был сгенерирован для одного метода, а верификация запрошена для другого.            | Внутренняя логическая ошибка. Попросить пользователя попробовать еще раз.                                           |
| `Too many attempts`                     | `TOO_MANY_REQUESTS`     | Сработал rate-limit после нескольких неудачных попыток.                                 | Заблокировать форму ввода и показать сообщение с таймером: "Слишком много попыток. Попробуйте снова через X минут." |
| **Method Management**                   |                         |                                                                                         |                                                                                                                     |
| `The password you entered is incorrect` | `UNAUTHENTICATED`       | Пароль, введенный для подтверждения удаления или регенерации, неверен.                  | Показать "Неверный пароль".                                                                                         |
| `A valid 2FA code is required`          | `BAD_USER_INPUT`        | Пользователь пытается удалить последний метод 2FA, не предоставив код подтверждения.    | Показать дополнительное поле для ввода 2FA-кода и объяснить, что это необходимо для безопасности.                   |
| `method was not found`                  | `BAD_USER_INPUT`        | ID метода, который пытаются удалить или обновить, не существует.                        | Обновить список методов в UI, так как он, вероятно, устарел.                                                        |
| **General**                             |                         |                                                                                         |                                                                                                                     |
| `Cannot send email/SMS`                 | `BAD_REQUEST`           | Адрес email или номер телефона невалиден, заблокирован или отписан.                     | Показать сообщение "Не удалось отправить код на указанный адрес/номер. Проверьте его или выберите другой метод."    |
| `Unauthorized`                          | `UNAUTHENTICATED`       | Сессионный токен отсутствует или недействителен.                                        | Перенаправить пользователя на страницу входа.                                                                       |
| `Forbidden resource`                    | `FORBIDDEN`             | У пользователя нет прав на выполнение этого действия (например, админская операция).    | Показать страницу "Доступ запрещен" (403).                                                                          |
| `Internal server error`                 | `INTERNAL_SERVER_ERROR` | Ошибка на сервере, не зависящая от пользователя.                                        | Показать общее сообщение "Что-то пошло не так. Пожалуйста, попробуйте позже."                                       |

### Пример обработки ошибок на Frontend (React)

Этот пример показывает, как можно обрабатывать ошибки от мутации `verify2FA`, используя `message` для пользователя и `extensions.code` для логики.

```tsx
import { useState } from 'react';
import { useMutation } from '@apollo/client';

// ... импорт мутации VERIFY_2FA

function TwoFactorVerificationForm() {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const [verify2FA, { loading }] = useMutation(VERIFY_2FA, {
    onCompleted: () => {
      // Успех, перенаправляем на дашборд
      window.location.href = '/dashboard';
    },
    onError: (error) => {
      // Анализируем ошибку GraphQL
      const gqlError = error.graphQLErrors[0];
      const extensions = gqlError?.extensions;

      if (extensions?.code === 'TOO_MANY_REQUESTS') {
        // Если сработал rate-limit, извлекаем время из сообщения
        const minutesMatch = gqlError.message.match(/(\d+)\sminutes?/);
        const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 5;
        setErrorMessage(`Слишком много попыток. Попробуйте снова через ${minutes} мин.`);
        
        // Запускаем таймер на клиенте
        let seconds = minutes * 60;
        setCooldown(seconds);
        const interval = setInterval(() => {
          seconds--;
          setCooldown(seconds);
          if (seconds <= 0) clearInterval(interval);
        }, 1000);
      } else {
        // Для всех остальных пользовательских ошибок просто показываем message
        setErrorMessage(gqlError.message);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(''); // Сбрасываем старую ошибку
    if (cooldown > 0) return;
    verify2FA({ variables: { data: { code } } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Two-Factor Authentication</h2>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="123456"
        disabled={loading || cooldown > 0}
      />

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <button type="submit" disabled={loading || cooldown > 0}>
        {loading ? 'Verifying...' : cooldown > 0 ? `Try again in ${cooldown}s` : 'Verify'}
      </button>
    </form>
  );
}
```






<!-- # GraphQL API Reference (2FA System)

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
**Last Updated:** 2025-10-12 -->
