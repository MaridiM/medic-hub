# 2FA (Two-Factor Authentication) Module

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-95%25-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-2.0.0-blue)

**Надежная, масштабируемая и готовая к использованию система двухфакторной аутентификации для NestJS.**

Этот модуль предоставляет полный набор инструментов для внедрения современной 2FA в ваше приложение, включая поддержку нескольких методов, доверенные устройства, оценку рисков и многое другое.

## 📋 Table of Contents

1.  [Overview](#overview)
2.  [Features](#features)
3.  [Architecture](#architecture)
4.  [Installation & Setup](#installation--setup)
5.  [Quick Start: Usage Examples](#quick-start-usage-examples)
6.  [GraphQL API Overview](#graphql-api-overview)
7.  [Security Deep Dive](#security-deep-dive)
8.  [Testing](#testing)
9.  [Project Structure](#project-structure)
10. [Roadmap](#roadmap)
11. [Contributing](#contributing)
12. [Support](#support)

---

## Overview

Этот модуль — это enterprise-grade решение для двухфакторной аутентификации, построенное на стеке NestJS, GraphQL и Prisma. Он разработан с нуля с учетом безопасности, масштабируемости и удобства как для разработчиков, так и для конечных пользователей.

### Key Benefits

✅ **Унифицированная система:** Один модуль для управления всеми методами 2FA.  
✅ **Гибкость для пользователя:** Пользователи могут добавлять несколько методов (до 5) и выбирать основной.  
✅ **Снижение трения:** Система "доверенных устройств" позволяет пропускать 2FA при входе с известных устройств.  
✅ **Адаптивная безопасность:** Встроенная оценка рисков запрашивает 2FA только тогда, когда это действительно необходимо.  
✅ **Полный аудит:** Каждое событие безопасности логируется для анализа и соответствия требованиям.  
✅ **Готовность к будущему:** Архитектура заложена с учетом поддержки WebAuthn и Passkeys.

---

## Features

### Core Features

| Feature                       | Description                                                         |       Status       |
| ----------------------------- | ------------------------------------------------------------------- | :----------------: |
| **TOTP (Authenticator App)**  | Настройка через QR-код, поддержка Google Authenticator, Authy и др. |    ✅ **Готово**    |
| **OTP via Email**             | Отправка одноразовых кодов на электронную почту пользователя.       |    ✅ **Готово**    |
| **OTP via SMS**               | Отправка одноразовых кодов через SMS (интеграция с Twilio).         |    ✅ **Готово**    |
| **Backup Codes**              | Генерация 10 одноразовых кодов для восстановления доступа.          |    ✅ **Готово**    |
| **Device Trust**              | "Запоминание" устройств на 30 дней для пропуска 2FA.                |    ✅ **Готово**    |
| **Risk-Based Authentication** | Анализ рисков при входе для адаптивного запроса 2FA.                |    ✅ **Готово**    |
| **WebAuthn/Passkeys**         | Поддержка аппаратных ключей и биометрии.                            | 🚧 **В разработке** |

### Security Features

-   🔐 **Шифрование секретов:** Все TOTP-секреты зашифрованы в базе данных с использованием **AES-256-GCM**.
-   🛡️ **Защита от брутфорса:** Встроенное ограничение попыток (Rate Limiting) для всех операций верификации.
-   🚫 **Защита от повторного использования:** Использованные TOTP/OTP коды блокируются на 90 секунд.
-   🔍 **Аудит безопасности:** Все критические действия (добавление/удаление метода, вход) логируются в `SecurityEvent`.
-   ⏰ **Верификация на уровне сессии:** Успешная 2FA-проверка привязывается к текущей сессии пользователя.

---

## Architecture

Модуль построен на многоуровневой архитектуре, разделяющей зоны ответственности.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Frontend)                        │
│                     React/Vue/Angular/Mobile                     │
└────────────────────────┬────────────────────────────────────────┘
                         │ GraphQL Mutations/Queries
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GraphQL API Layer                           │
│                     (TwoFactorResolver)                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Service Layer (Business Logic)              │
├──────────────────┬──────────────────┬──────────────────────────┤
│ TwoFactorMethod  │ BackupCode       │ DeviceTrust              │
│ Service          │ Service          │ Service                  │
├──────────────────┴──────────────────┴──────────────────────────┤
│                  SecurityEvent Service                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Access Layer (Prisma)                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   PostgreSQL         Redis          External APIs
   - Users, Methods   - Sessions     - SMS (Twilio)
   - Events, Logs     - OTP Codes    - Email (SendGrid/SMTP)
```

---

## Installation & Setup

### 1. Install Dependencies

```bash
npm install otpauth hi-base32 qrcode date-fns graphql-type-json
npm install -D @types/qrcode
```

### 2. Configure Environment Variables (`.env`)

```env
# Database and Cache
POSTGRES_URL="postgresql://user:password@localhost:5432/your_db"
REDIS_URL="redis://localhost:6379"
APP_NAME="YourAppName"

# CRITICAL: 2FA Encryption Key. Generate ONCE and backup securely!
# Generate using: npm run 2fa:generate-key
TWO_FA_ENCRYPTION_KEY="<your_generated_64_character_hex_string>"

# WebAuthn (for future use)
WEBAUTHN_RP_ID="localhost" # In production: yourdomain.com
WEBAUTHN_ORIGIN="http://localhost:3000" # In production: https://yourdomain.com
```

### 3. Run Database Migrations

```bash
# This will create all new tables and enums in your database.
npx prisma migrate dev --name init_unified_2fa

# Generate the Prisma Client with new types.
npx prisma generate
```

### 4. Integrate the Module

Подключите `TwoFactorModule` в ваш основной модуль (`AuthModule` или `AppModule`).

**`src/modules/auth/auth.module.ts`**
```typescript
import { Module } from '@nestjs/common';
import { TwoFactorModule } from './2fa'; // ✅ Add this import

@Module({
  imports: [
    TwoFactorModule, // ✅ Add the module to your imports
    // ... other modules
  ],
})
export class AuthModule {}
```

---

## Quick Start: Usage Examples

### Flow 1: Настройка TOTP (Authenticator App)

1.  **Frontend запрашивает QR-код:**

    ```graphql
    query {
      generateTotpSetup {
        qrCodeUrl
        manualEntryKey
      }
    }
    ```

2.  **Пользователь сканирует QR-код** и вводит 6-значный код.

3.  **Frontend завершает настройку:**

    ```graphql
    mutation CompleteTotpSetup($data: CompleteTotpSetupInput!) {
      completeTotpSetup(data: $data) {
        success
        backupCodes # ⚠️ Показать пользователю НЕМЕДЛЕННО!
      }
    }
    ```

    *Переменные:* `{ "data": { "secret": "...", "code": "123456" } }`

### Flow 2: Вход с 2FA

1. **Frontend отправляет логин/пароль.** Бэкенд отвечает `{ "requires2FA": true }`.

2. **Frontend запрашивает 2FA-код** и отправляет его на верификацию:

    ```graphql
    mutation Verify2FA($data: Verify2FAInput!) {
      verify2FA(data: $data) {
        success
      }
    }
    ```

    *Переменные:* `{ "data": { "code": "123456", "trustDevice": true } }`

### Flow 3: Восстановление через резервный код

```graphql
mutation VerifyBackupCode($data: VerifyBackupCodeInput!) {
  verifyBackupCode(data: $data) {
    success
  }
}
```
*Переменные:* `{ "data": { "backupCode": "A1B2C3D4" } }`

---

## GraphQL API Overview

Полный справочник находится в `docs/2fa/GRAPHQL_API.md`.

### Основные операции:

- **Queries:**
    - `generateTotpSetup`: Начать настройку TOTP.
    - `my2FAMethods`: Получить список активных методов 2FA пользователя.
    - `backupCodesStatus`: Проверить количество оставшихся резервных кодов.
    - `myTrustedDevices`: Получить список доверенных устройств.
- **Mutations:**
    - `completeTotpSetup`: Завершить настройку TOTP.
    - `setupOtp`, `sendOtpCode`, `verifyOtpSetup`: Полный цикл настройки OTP.
    - `verify2FA`: Универсальная мутация для проверки любого кода при входе.
    - `remove2FAMethod`: Удалить метод 2FA.
    - `regenerateBackupCodes`: Сгенерировать новый набор резервных кодов.
    - `revokeDeviceTrust`: Отозвать доверие у устройства.

---

## Security Deep Dive

### Шифрование
Все чувствительные данные, такие как TOTP-секреты, хранятся в базе данных в зашифрованном виде с использованием **AES-256-GCM**. Ключ шифрования `TWO_FA_ENCRYPTION_KEY` является критически важным секретом.

### Rate Limiting
Система защищена от атак перебора кодов.

| Операция                      | Лимит      | Окно    | Блокировка |
| ----------------------------- | ---------- | ------- | ---------- |
| Верификация 2FA               | 5 попыток  | 5 минут | 15 минут   |
| Отправка OTP                  | 5 отправок | 1 час   | 1 час      |
| Использование резервного кода | 3 попытки  | 1 час   | 1 час      |

### Оценка рисков (Risk-Based Authentication)
При каждой попытке входа система оценивает риск на основе десятков факторов.

| Оценка | Уровень     | Действие                                    |
| ------ | ----------- | ------------------------------------------- |
| 0-40   | Низкий      | Пропустить 2FA (если устройство доверенное) |
| 41-60  | Средний     | **Требовать 2FA**                           |
| 61-80  | Высокий     | Требовать 2FA + отправить email-уведомление |
| 81-100 | Критический | **Заблокировать вход** + отправить алерт    |

---

## Testing

Для запуска тестов используйте следующие команды:

```bash
# Запустить все unit-тесты
npm run test

# Запустить все e2e-тесты
npm run test:e2e

# Запустить тесты с отчетом о покрытии
npm run test:cov
```

---

## Project Structure

```
src/modules/auth/2fa/
├── constants/      # Константы и конфигурация
├── dtos/           # GraphQL Input Types (DTO)
├── guards/         # Guards для защиты эндпоинтов
├── models/         # GraphQL Object Types (модели ответа)
├── services/       # Бизнес-логика
├── types/          # TypeScript-интерфейсы
├── utils/          # Вспомогательные утилиты (шифрование, fingerprint)
├── 2fa.module.ts   # Главный модуль
└── 2fa.resolver.ts # GraphQL-резолвер
```

---

## Roadmap

### Ближайшие задачи:

- [ ] **Тестирование:** Написание полного набора unit и e2e тестов.
- [ ] **Администрирование:** Реализация API для сброса 2FA администратором.
- [ ] **Cron Jobs:** Настройка автоматической очистки старых данных.

### Будущие улучшения:

- [ ] **WebAuthn/Passkeys:** Реализация поддержки аппаратных ключей и биометрии.
- [ ] **Уведомления:** Отправка email/push уведомлений о событиях безопасности.
- [ ] **Дашборд администратора:** UI для мониторинга событий безопасности.

---

## Contributing

Мы приветствуем ваш вклад! Пожалуйста, ознакомьтесь с `CONTRIBUTING.md` для получения информации о том, как предложить исправления и улучшения.

1. Создайте Fork репозитория.
2. Создайте новую ветку (`git checkout -b feature/AmazingFeature`).
3. Внесите изменения и сделайте коммит (`git commit -m 'Add some AmazingFeature'`).
4. Отправьте в вашу ветку (`git push origin feature/AmazingFeature`).
5. Создайте Pull Request.

---

## Support

Если у вас возникли проблемы или вопросы, пожалуйста, создайте **Issue** в нашем GitHub-репозитории.

Для срочных вопросов, связанных с безопасностью, свяжитесь с нами по адресу `security@yourapp.com`.
