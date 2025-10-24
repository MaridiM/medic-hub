# Roadmap & Tasks - MedicHub Authentication System

### Статусные группы

* 🔴 **HIGH** — критически важные задачи для первого стабильного релиза.
* 🟠 **MEDIUM** — важные улучшения для повышения безопасности и удобства (Enterprise-уровень).
* 🟢 **LOW** — перспективные задачи для будущего развития.
* 🔵 **Definition of Done** — критерии готовности.

**Легенда:**

* ✅ — задача полностью выполнена.
* 🟡 — задача выполнена частично или заложена основа.
* [ ] — задача ещё не начата.

---

## 📊 Progress Overview

```
Authentication Core:  ████████░░ 80%
2FA System:          ███████░░░ 70%
Security Features:   █████░░░░░ 50%
Admin Tools:         ███░░░░░░░ 30%
Documentation:       ███████░░░ 70%
Testing Coverage:    ███░░░░░░░ 30%
Infrastructure:      ██░░░░░░░░ 20%
```

---

## 🔴 HIGH: Критически важные для запуска

### ✅ База RBAC (Role‑Based Access Control)

- ✅ **[Шаг 0.1]** Уточнение типизации сессии TypeScript
  - ✅ Создан `session.types.ts` с declaration merging для `express-session`
  - ✅ Исправлён тип `AuthenticatedUser` (interface → type alias)
  - ✅ Обновлён `GqlContext` с интерфейсом `AuthenticatedRequest`
  - ✅ Устранены ошибки компиляции TypeScript в `session.util.ts`
- ✅ **[Шаг 0]** Внедрение основы RBAC
  - ✅ Добавлен enum `EUserRole` в Prisma‑схему (`USER`, `SUPER_ADMIN`)
  - ✅ Модель `User` модифицирована для поддержки нескольких ролей (`roles EUserRole[]`)
  - ✅ Создан глобальный `RbacModule`
  - ✅ Реализован `RolesGuard` с актуальной проверкой ролей в БД
  - ✅ Создан декоратор `@Roles()` для требований к ролям
  - ✅ Обновлён seed‑скрипт с созданием пользователя `super_admin`
  - ✅ Добавлена подробная документация по RBAC (`docs/rbac/`)
  - ✅ Интегрирован `RbacModule` в `AppModule`

### ✅ Архитектура и фундамент модуля 2FA

- ✅ **[Schema]** Модернизация Prisma‑схемы
  - ✅ Модель `AuthenticationMethod` для унифицированного хранения методов
  - ✅ Модель `TrustedDevice` для доверенных устройств
  - ✅ Модель `SecurityEvent` для детального логирования
  - ✅ Модель `BackupCode` для резервных кодов
  - ✅ Enum `E2FAMethod` (`TOTP`, `OTP_EMAIL`, `OTP_SMS`, `WEBAUTHN`, `PASSKEY`, `BACKUP_CODE`)
  - ✅ Enum `ESecurityEvent`, `ESecuritySeverity` для событий безопасности
- ✅ **[Core]** Базовые типы, константы и утилиты
  - ✅ `EncryptionUtil` (AES‑256‑GCM)
  - ✅ `FingerprintUtil` (отпечаток устройства)
  - ✅ `RiskCalculatorUtil` (оценка риска)
  - ✅ Типы данных методов (`ITotpMethodData`, `IOtpEmailMethodData`, и т. д.)
  - ✅ Константы конфигурации (`TOTP_CONFIG`, `OTP_CONFIG`, `BACKUP_CODE_CONFIG`)
- ✅ **[Services]** Основные сервисы
  - ✅ `TwoFactorMethodService` (оркестрация)
  - ✅ `BackupCodeService` (резервные коды)
  - ✅ `DeviceTrustService` (скоринг доверия устройств)
  - ✅ `SecurityEventService` (логирование безопасности)
- ✅ **[API]** Полный GraphQL‑API
  - ✅ `TwoFactorResolver` с полным набором queries/mutations
  - ✅ DTO для всех операций (`SetupTotpInput`, `VerifyOtpSetupInput`, и др.)
  - ✅ Модели для ответов (`TotpSetupModel`, `TwoFactorMethodModel`, и др.)
  - ✅ Гварды (`TwoFactorVerifiedGuard`, `@Require2FAVerification`)
- ✅ **[Module]** Финализация `TwoFactorModule` с корректными зависимостями

### ✅ Интеграция с системами безопасности

- ✅ Интегрирован `SecurityEventService` во все критические операции
- ✅ Логирование при добавлении/удалении методов 2FA
- ✅ Типы для метаданных событий (`ISecurityEventMetadata`, `IAdminActionMetadata`)
- ✅ Исправлена логическая ошибка при регенерации резервных кодов

### ✅ Исправления типизации и GraphQL Schema

- ✅ Устранены ошибки `TypeScript` и `ESLint` (`no-case-declarations`, `private` access).
- ✅ Исправлены небезопасные аргументы, корректно применён `Prisma.JsonValue`
- ✅ Приведена в порядок типизация декораторов
- ✅ **[GraphQL]** Устранены ошибки `CannotDetermineOutputTypeError` и `CannotDetermineInputTypeError`
  - ✅ Установлена зависимость `graphql-type-json` для поддержки JSON в GraphQL.
  - ✅ Заменены все `@Field(() => Object)` на `@Field(() => GraphQLJSON)` в DTO и моделях WebAuthn.
  - ✅ Все 5 моделей WebAuthn (`RegistrationOptions`, `AuthenticationOptions`, `RegistrationComplete`, `AuthenticationComplete`, `Credential`) полностью реализованы с корректными типами.
- ✅ **[Type Safety]** Решены конфликты enum-типов между Prisma и GraphQL
  - ✅ Создан централизованный файл `enums.ts`, импортирующий enum'ы из `@prisma/__generated__` как единый источник правды.
  - ✅ Настроен правильный порядок импорта (`enums` → `models` → `modules`) для корректной генерации схемы.
- ✅ **[i18n]** Исправлены ошибки типов и структуры в файлах переводов (en/ru).
- ✅ **[DI]** Исправлена ошибка `UnknownDependenciesException` путем корректной организации глобальных модулей.

### ✅ Интеграция провайдеров уведомлений

- ✅ **[MailService]** Добавлен `sendOtpCodeEmail` для отправки OTP
- ✅ **[MailService]** Реализован `canSendEmail` для защиты репутации домена
- ✅ **[SmsService]** Реализован `canSendSms` для валидации номеров
- ✅ `MailService` подключён в `TwoFactorMethodService`
- ✅ `SmsService (Twilio)` подключён в `TwoFactorMethodService`
- ✅ Адаптированы шаблоны писем и SMS

### ✅ TOTP & OTP - Верификация

- ✅ **[Шаг 7]** Реализована полноценная верификация 2FA кодов
    - ✅ `TwoFactorMethodService` дополнен методами `verifyTotpCode` и `verifyOneTimeCode`.
    - ✅ Мутация `verify2FA` теперь выполняет реальную проверку кодов.
    - ✅ **[Security]** Устранена уязвимость, при которой коды не проверялись (удален `TODO`).
    - ✅ **[Security]** Реализован механизм anti-replay для OTP кодов (удаление из Redis после использования).

### ✅ Административный функционал

- ✅ **[Шаг 1]** Модуль администрирования 2FA
  - ✅ Создан `AdminTwoFactorResolver` с защитой `@Roles(SUPER_ADMIN)`
  - ✅ Создан `AdminTwoFactorService` для бизнес‑логики
  - ✅ Реализована мутация `disableUser2FA` (экстренное отключение)
  - ✅ Добавлен запрос `getUser2FAStatus` (просмотр статуса)
  - ✅ Реализована мутация `revokeUserDevice` (отзыв устройства)
  - ✅ Добавлена мутация `revokeAllUserDevices` (массовый отзыв)
  - ✅ Добавлен запрос `getUserSecurityEvents` (просмотр событий)
  - ✅ Созданы admin‑DTO (`DisableUser2FAInput`, `RevokeUserDeviceInput`)
  - ✅ Созданы admin‑модели (`AdminActionSuccessModel`, `User2FAStatusModel`)
  - ✅ Усилен аудит‑лог (`CRITICAL` severity)
  - ✅ Добавлена документация для админ‑операций (`docs/2fa/ADMIN_OPERATIONS.md`)
- ✅ **[Шаг 1.1]** Правки типов метаданных админ‑действий
  - ✅ Создан интерфейс `IAdminActionMetadata`
  - ✅ Обновлён union‑тип `TSecurityEventMetadata`

### ✅ Автоматизация обслуживания (Cron Jobs)

- ✅ **[Шаг 2]** Реализация задач обслуживания
  - ✅ Создан `TwoFactorCronService` на `@nestjs/schedule`
  - ✅ `cleanupExpiredBackupCodes` — ежедневно 02:00
  - ✅ `cleanupOldDevices` — ежедневно 03:00
  - ✅ `cleanupOldSecurityEvents` — еженедельно, воскресенье 04:00
  - ✅ `enforceDeviceLimits` — каждые 6 часов
  - ✅ Конфигурация расписаний через переменные окружения
  - ✅ Метрики выполнения в методах очистки
  - ✅ Метод `enforceAllUsersDeviceLimits`
  - ✅ Метод `archiveOldEvents` в `SecurityEventService`
  - ✅ Интеграция `ScheduleModule` в `AppModule` и `TwoFactorModule`
  - ✅ Документация по cron‑задачам (`docs/2fa/CRON_JOBS.md`)
- ✅ **[Шаг 2.1]** Правки TypeScript
  - ✅ Исправлен тип свойства `CronJob.running`
  - ✅ Устранено предупреждение ESLint о «плавающем» промисе
  - ✅ Добавлен метод `getCronJobsStatusSafe`

### 🟡 Тестирование

- [ ]  **Юнит‑тесты (Jest):** созданы файлы `.spec.ts` для:
  - [ ] `mail.service.spec.ts`
  - [ ] `2fa-method.service.spec.ts`
  - [ ] `device-trust.service.spec.ts`
  - [ ] `backup-code.service.spec.ts`
  - [ ] `security-event.service.spec.ts`
  - [ ] `webauthn.service.spec.ts` - Effort: 10-12 часов
  - [ ] `notification.service.spec.ts` - Effort: 6-8 часов
  - [ ] `2fa.resolver.spec.ts` (для `verify2FA`) - Effort: 4-6 часов
  - [ ] `admin-2fa.service.spec.ts` - Effort: 8-10 часов
  - [ ] **Target:** >80% code coverage
- [ ] **Интеграционные тесты:** критические сценарии с БД/Redis
  - [ ] Транзакции создания методов + резервных кодов
  - [ ] Сквозной поток скоринга доверенных устройств
  - [ ] Админ‑операции с аудитом
  - [ ] WebAuthn registration/authentication flow
- [ ] **E2E‑тесты (Supertest/Playwright):**
  - [ ] Цепочка: TOTP setup → login → verify → remove
  - [ ] Поток OTP email/SMS
  - [ ] Поток WebAuthn/Passkeys
  - [ ] Поток админ‑операций
  - [ ] Выполнение cron‑задач
  - [ ] E2E-тест для отправки email-уведомлений (с MailHog).

### [ ] Наблюдаемость и метрики

- [ ] Сбор метрик для cron‑задач
- [ ] Health‑checks для сервисов 2FA
- [ ] Мониторинг производительности
- [ ] Правила оповещений

---

## 🟠 MEDIUM: Важные улучшения (Enterprise)

### [ ] NotificationService для событий безопасности

- ✅ **[Шаг 5 & 6]** Реализован `NotificationService` и его интеграция
  - ✅ **[Service]** Создан глобальный `NotificationModule`.
  - ✅ **[Service]** `NotificationService` с rate-limiting и duplicate-detection.
  - ✅ **[Templates]** Создано 9 email-шаблонов на React Email с i18n.
  - ✅ **[Integration]** `NotificationService` интегрирован во все ключевые сервисы 2FA.
  - ✅ **[Docs]** Добавлена документация в `docs/2fa/NOTIFICATIONS.md`.
- [ ] Добавить `notify2FAMethodAdded`
- [ ] Добавить `notify2FAMethodRemoved`
- [ ] Добавить `notifyNewDeviceLogin`
- [ ] Добавить `notifyLowBackupCodes`
- [ ] Добавить `notifySuspiciousActivity`
- [ ] Добавить `notify2FADisabledByAdmin`
- [ ] Интегрировать с `SecurityEventService`
- 🟡 **[Feature]** Заложена основа для SMS‑уведомлений (требуется реализация шаблонов).
- [ ] **[Feature]** Реализовать управление предпочтениями уведомлений (UI + API).

### ✅ Поддержка WebAuthn / Passkeys

- ✅  **[Шаг 3]** WebAuthn/Passkeys Implementation
  - ✅ Установлена библиотека `@simplewebauthn/server`
  - ✅ Создан `WebAuthnService` для инкапсуляции логики работы с протоколом
  - ✅ Реализован метод `generateRegistrationOptions` для создания опций регистрации
  - ✅ Реализован метод `verifyRegistration` для верификации ответа регистрации
  - ✅ Реализован метод `generateAuthenticationOptions` для создания опций аутентификации
  - ✅ Реализован метод `verifyAuthentication` для верификации ответа аутентификации
  - ✅ Созданы WebAuthn DTOs (`StartWebAuthnRegistrationInput`, `CompleteWebAuthnRegistrationInput`, etc.)
  - ✅ Добавлены GraphQL мутации и запросы в `TwoFactorResolver`:
    - ✅ `startWebAuthnRegistration` mutation
    - ✅ `completeWebAuthnRegistration` mutation
    - ✅ `startWebAuthnAuthentication` query
    - ✅ `completeWebAuthnAuthentication` mutation
    - ✅ `myWebAuthnCredentials` query
    - ✅ `removeWebAuthnCredential` mutation
  - ✅ Реализовано хранение credential-данных в `AuthenticationMethod` (через `IWebAuthnMethodData`/`IPasskeyMethodData`)
  - ✅ Подготовлена документация для frontend-команды по интеграции (`docs/2fa/WEBAUTHN.md`)
  - ✅ Добавлена базовая поддержка attestation устройств (attestationFormat в методе data)
- ✅ **[Шаг 3.1]** WebAuthn TypeScript Fixes
  - ✅ Исправлены ошибки преобразования типов `IWebAuthnMethodData`/`IPasskeyMethodData`
  - ✅ Удалены избыточные type assertions
  - ✅ Добавлен метод `detectPlatform` для определения платформы
  - ✅ Добавлены i18n переводы для WebAuthn (ru/en)
  - ✅ Исправлены типы для `@simplewebauthn/server` API
  - ✅ Добавлены константы WebAuthn в общий файл констант

### [ ] Step‑up аутентификация

- [ ] Создать `StepUpVerificationService`
- [ ] Расширить `TwoFactorVerifiedGuard` проверкой «свежести»
- [ ] Добавить мутацию `requestStepUpVerification`
- [ ] Создать декоратор `@RequireStepUp`
- [ ] Настроить конфигурируемые окна верификации
- [ ] Хранить состояние step‑up в Redis
- [ ] Подготовить спецификации UI
- [ ] Маркировать «чувствительные» операции

### [ ] Rate Limiting для 2FA

- [ ] Ограничение частоты отправки OTP
- [ ] Прогрессивные задержки при неудачных попытках
- [ ] Механизм блокировки учётной записи
- [ ] Ограничение по IP‑адресу
- [ ] Исключения для доверенных устройств
- [ ] Конфигурирование лимитов

### [ ] Восстановление 2FA (Recovery Flow)

- [ ] Создать сервис восстановления учётной записи
- [ ] Реализовать поток верификации личности
- [ ] Генерация ссылок для восстановления
- [ ] Подготовить спецификации UI
- [ ] Аудит‑лог восстановления
- [ ] Уведомления о восстановлении

---

## 🟢 LOW: Продвинутые возможности и развитие

### ✅ Документация API
- ✅ **[Шаг 4]** GraphQL API Documentation
  - ✅ Создана полная документация всех queries и mutations
  - ✅ Документированы WebAuthn и админские операции
  - ✅ Добавлены примеры обработки ошибок и все GraphQL типы
- ✅ Расширенная документация
  - ✅ Все поля в моделях `User`, `Session` и DTO получили подробные описания.
  - ✅ Создан `SimpleWebAuthn` integration guide для frontend.
  - ✅ Сгенерирован и структурирован детальный Roadmap и Changelog.
- ✅ Расширенная документация для моделей и DTO
- ✅ SimpleWebAuthn integration guide

### [ ] Админ‑панель

- [ ] UI для управления 2FA
- [ ] Дашборд мониторинга cron‑задач
- [ ] Интерфейс массовых операций
- [ ] Поиск и фильтры
- [ ] Экспорт данных
- [ ] Виджеты аналитики

### [ ] Расширенный риск‑скоринг

- [ ] ML‑оценка рисков
- [ ] Поведенческая аналитика
- [ ] Дашборд risk‑score
- [ ] Автоматические реакции на риск
- [ ] Интеграция IP‑репутации
- [ ] Гео‑правила

### [ ] Дополнительные методы аутентификации

- [ ] Push‑уведомления как 2FA
- [ ] Аппаратные токены (FIDO U2F)
- [ ] Вход по QR‑коду
- [ ] Passwordless‑аутентификация
- [ ] Magic‑links
- [ ] Биометрическая аутентификация

### [ ] Геофенсинг

- [ ] Разрешённые/запрещённые страны в настройках пользователя
- [ ] Проверка страны в `RiskCalculatorUtil`
- [ ] Политики геофенсинга
- [ ] Организационные правила геофенсинга

### [ ] Соответствие требованиям (Compliance) и отчётность

- [ ] Инструменты соответствия GDPR
- [ ] Формирование отчётов аудита
- [ ] Политики хранения данных
- [ ] Дашборд compliance
- [ ] Экспорт регуляторной отчётности
- [ ] Регламентированные отчёты

### [ ] Оптимизация производительности

- [ ] Redis‑кеширование методов 2FA
- [ ] Оптимизация запросов БД
- [ ] Стратегия пулов подключений
- [ ] Горизонтальное масштабирование
- [ ] Оптимизация отпечатка устройства
- [ ] CDN для QR‑кодов

---

## 🔵 Definition of Done (Критерии готовности)

- **Тесты:** покрытие юнит‑тестами затронутых сервисов ≥ 80%; интеграционные и E2E‑тесты закрывают ключевые сценарии и регрессии.
- **Безопасность:** настроены rate‑limit, TTL/anti‑reuse для кодов; все чувствительные данные шифруются; все действия аудируются.
- **Наблюдаемость:** события пишутся в `SecurityEvent`; на критические события настроены уведомления.
- **Документация:** обновлены `GRAPHQL_API.md`, `README.md` и прочие релевантные документы; добавлена запись в `CHANGELOG.md` по шаблону.
- **Код:** отсутствуют `TODO`, `any`, ошибки линтера и компиляции; код прошёл ревью.
- **Производительность:** операции выполняются в целевых пределах (< 500 ms для API, < 5 s для cron‑задач).

---

## Account & Session Modules

### 🔴 HIGH: Критически важные задачи

- ✅ **[Schema]** Migrate User model to unified 2FA system (удалены `isTotpEnabled`, `totpSecret`, `isOtpEnabled`, `otpSecret`).
- ✅ **[Model]** Update GraphQL User model with new Prisma fields
  - ✅ **RBAC**: `roles` (массив EUserRole)
  - ✅ **Unified 2FA**: `is2FAEnabled`, `preferred2FAMethod`, `require2FA`
  - ✅ **Risk Assessment**: `riskScore`, `lastRiskAssessAt`
  - ✅ **Security Audit**: `lastLoginAt`, `lastLoginIp`, `passwordChangedAt`
  - ✅ **Verification**: `phoneVerifiedAt`, `phoneBouncedAt`, `emailBouncedAt`, `isUnsubscribed`
  - ✅ **Soft Delete**: `deletedAt`
- ✅ **[Service]** Track `passwordChangedAt` on password change
- ✅ **[Service]** Track `lastLoginAt` and `lastLoginIp` on successful login
- [ ] **[Migration]** Create Prisma migration script for production database migration
- [ ] **[Security]** Implement session invalidation on password change (invalidate all sessions except current)
- [ ] **[Security]** Send email notification on password change
- [ ] **[Security]** Implement rate limiting for login attempts (brute-force protection)

### 🟠 MEDIUM: Важные улучшения

- 🟡 **[Security]** Add `riskScore` calculation logic based on login patterns (foundation laid)
- [ ] **[Security]** Implement automatic account locking after N failed login attempts
- [ ] **[Security]** Log security events (login success/failure, password change) to `SecurityEvent` table
- [ ] **[Admin]** Add admin mutation to reset user password (with email notification)
- [ ] **[Admin]** Add admin query to view user security events
- [ ] **[Session]** Implement session expiration policy (auto-cleanup old sessions)
- [ ] **[Session]** Add session renewal/refresh mechanism
- [ ] **[UX]** Add "Remember this device" functionality using `TrustedDevice` model
- [ ] **[Email]** Implement email bounce handling (update `emailBouncedAt` on bounce)
- [ ] **[SMS]** Implement SMS bounce handling (update `phoneBouncedAt` on delivery failure)

### 🟢 LOW: Продвинутые возможности

- [ ] **[Analytics]** Add user activity dashboard (login history, device list, security events)
- [ ] **[Security]** Implement "Unusual Location" detection (flag logins from new countries)
- [ ] **[Security]** Implement "Impossible Travel" detection (flag rapid location changes)
- [ ] **[AI/ML]** Train risk scoring model based on historical security events
- [ ] **[Compliance]** Add GDPR data export functionality (export all user data as JSON)
- [ ] **[Compliance]** Add GDPR data deletion functionality (full account deletion with cascade)
- [ ] **[Feature]** Add passwordless login via magic link (OTP_EMAIL)
- [ ] **[Feature]** Add social login integration (OAuth2: Google, GitHub, etc.)
- [ ] **[Performance]** Optimize session listing query (add pagination, use Redis sorted sets)

---

## Notes

- 🎯 **Next Priority**: Prisma migration script + rate limiting + security event logging.
- 📚 **Documentation**: Consider adding Swagger/OpenAPI docs for REST endpoints (if applicable).
- 🧪 **E2E Testing**: Add end-to-end tests for critical flows (login, password change, email change).

---

## 🔴 HIGH: Критически важные для запуска

### ✅ Уведомления о событиях безопасности

- ✅ **[Шаг 5]** NotificationService для событий безопасности
  - ✅ **[Service]** Создан глобальный `NotificationModule` с `@Global()`
  - ✅ **[Service]** Реализован `NotificationService` с поддержкой Email/SMS, rate-limiting и duplicate-detection.
  - ✅ **[Templates]** Создано 9 email-шаблонов на React Email с полной поддержкой i18n (en/ru).
  - ✅ **[Integration]** `NotificationService` интегрирован во все релевантные сервисы: `TwoFactorMethodService`, `DeviceTrustService`, `BackupCodeService`, `AdminTwoFactorService`.
  - ✅ **[i18n]** Структура переводов унифицирована и исправлены ошибки типов.
  - ✅ **[Docs]** Добавлена документация в `docs/2fa/NOTIFICATIONS.md`.
- ✅ **[Шаг 6]** Интеграция `NotificationService`
  - ✅ `notify2FAMethodAdded` интегрирован.
  - ✅ `notify2FAMethodRemoved` интегрирован.
  - ✅ `notifyNewDeviceLogin` интегрирован.
  - ✅ `notifyLowBackupCodes` интегрирован.
  - ✅ `notifySuspiciousActivity` интегрирован.
  - ✅ `notify2FADisabledByAdmin` интегрирован.
  - ✅ Интегрированы вызовы уведомлений во все ключевые сервисы 2FA.
- 🟡 **[Feature]** Заложена основа для SMS-уведомлений (требуется реализация шаблонов).
- [ ] **[Feature]** Реализовать управление предпочтениями уведомлений (UI + API).

### [ ] Тестирование (Unit)

- [ ] `notification.service.spec.ts`: Написать юнит-тесты для `NotificationService`.
  - [ ] Проверить логику rate-limiting и duplicate-detection.
  - [ ] Проверить правильный вызов `MailService` и `SmsService` с корректными параметрами.
  - [ ] Замокать зависимости и проверить обработку ошибок (например, если `canSendEmail` возвращает `false`).
- [ ] Расширить тесты для `2fa-method.service.ts`, `backup-code.service.ts`, и других, добавив `verify` для вызовов `notificationService` (`.toHaveBeenCalledWith(...)`).

### [ ] Тестирование (Integration & E2E)

- [ ] Написать E2E тест, который триггерит отправку email (например, добавление 2FA метода) и проверяет результат через mock email-сервиса (например, MailHog/Mailtrap).
- [ ] Написать интеграционный тест для `AdminTwoFactorService`, который проверяет, что при отключении 2FA отправляется корректное уведомление.

---

## 🟠 MEDIUM: Важные улучшения

### [ ] Расширение NotificationService

- [ ] Реализовать поддержку **SMS-уведомлений**. Сейчас `NotificationService` вызывает `smsMethod`, но сами методы в `SmsService` для конкретных событий (например, `send2FAMethodAddedSms`) не реализованы.
- [ ] Добавить **очередь (Bull/BullMQ)** для отправки уведомлений, чтобы не блокировать основной поток выполнения при задержках у email/SMS провайдеров.
- [ ] Добавить поддержку **Push-уведомлений** как задел на будущее.

### [ ] Управление предпочтениями уведомлений

- [ ] Добавить в Prisma-схему поле `notificationPreferences` (например, `Json`) для модели `User`.
- [ ] Реализовать GraphQL API для управления предпочтениями (какие уведомления и по каким каналам получать).
- [ ] Интегрировать проверку предпочтений в `NotificationService` перед отправкой.

---

## 🟢 LOW: Продвинутые возможности

### [ ] Аналитика уведомлений

- [ ] Собирать метрики по доставке уведомлений (открытия, клики) с помощью webhooks от email-провайдера.
- [ ] Создать дашборд в админ-панели для мониторинга статуса уведомлений.

---

## Account & Recovery Modules

---

## 🔴 HIGH: Критически важные задачи безопасности

### Security & Session Management

- ✅ **[Security] Инвалидация сессий при смене пароля** *(Completed in Step 2)*
  - ✅ Создать метод `invalidateUserSessions(userId, excludeSessionId?)` в `SessionService`
  - ✅ Интегрировать `SessionService` в `AccountService`
  - ✅ Вызывать инвалидацию всех сессий (кроме текущей) после успешной смены пароля
  - ✅ Добавить unit-тесты для проверки удаления сессий из Redis

- ✅ **[Security] Email-уведомления о смене пароля** *(Completed in Step 3)*
  - ✅ Создать метод `sendPasswordChangedNotification(email, metadata, lng)` в `MailService`
  - ✅ Интегрировать отправку уведомления в `AccountService.changePassword()`
  - ✅ Добавить email-шаблон `PasswordChangedTemplate` с деталями (IP, устройство, время, ссылка на помощь)
  - ✅ Обработать ошибки отправки (non-blocking)

- ✅ **[Security] Email-уведомления о сбросе пароля** *(Completed in Step 3)*
  - ✅ Создать метод `sendPasswordResetConfirmation(email, metadata, lng)` в `MailService`
  - ✅ Интегрировать отправку уведомления в `RecoveryService.newPassword()`
  - ✅ Добавить email-шаблон `PasswordResetConfirmationTemplate` с рекомендациями по безопасности
  - ✅ Обработать ошибки отправки (non-blocking)

- ✅ **[Security] Email-шаблон для запроса сброса пароля** *(Partially completed)*
  - ✅ Метод `sendPasswordResetToken()` существует в `MailService`
  - ✅ Создать React Email шаблон `ResetPasswordTemplate` (сейчас используется заглушка)
  - ✅ Добавить метаданные запроса (IP, location, device) в email

### Audit & Security Events

- ✅ **[Audit] Создать базовый SecurityEventService** *(Completed in Step 1)*
  - ✅ Создать сервис с методами create(), findByUser(), resolve()
  - ✅ Добавить поддержку risk scoring и факторов
  - ✅ Интегрировать в Account, Session, Recovery модули как @Global()
  - ✅ Добавить unit-тесты

- ✅ **[Audit] Логирование событий смены пароля** *(Completed in Step 2)*
  - ✅ Создать `SecurityEvent` с типом `PASSWORD_CHANGED` в `AccountService.changePassword()`
  - ✅ Записывать IP, userAgent, deviceId, metadata
  - ✅ Установить severity = `MEDIUM` (динамически на основе risk score)
  - ✅ Добавить riskFactors (смена с нового устройства, множественные сессии)

- ✅ **[Audit] Логирование событий сброса пароля** *(Completed in Step 3)*
  - ✅ Создать `SecurityEvent` с типом `PASSWORD_RESET_REQUESTED` в `RecoveryService.resetPassword()`
  - ✅ Создать `SecurityEvent` с типом `PASSWORD_RESET_COMPLETED` в `RecoveryService.newPassword()`
  - ✅ Записывать полные метаданные запроса
  - ✅ Установить severity = `MEDIUM/HIGH` для сброса

### Error Handling & Resilience

- ✅ **[Resilience] Улучшить обработку ошибок в `resetPassword`** *(Completed in Step 3)*
  - ✅ Сделать отправку email non-blocking (не прерывать flow при ошибке mail-сервиса)
  - ✅ Логировать ошибки отправки email отдельно (в MailService через Logger)
  - ✅ Всегда возвращать success (для защиты от email enumeration)

- ✅ **[Security] Защита от email enumeration** *(Completed in Step 3)*
  - ✅ Унифицировать ответы `resetPassword` (всегда возвращать success)
  - ✅ Логировать попытки сброса для несуществующих email с userId='unknown'
  - ✅ Документировать поведение в JSDoc
  - [ ] Добавить rate limiting на endpoint сброса пароля (TODO: требует rate-limit middleware)

---

## 🟠 MEDIUM: Важные улучшения

### User Experience

- ✅ **[UX] Улучшить содержимое email-уведомлений** *(Completed in Step 3)*
  - ✅ Добавить красивый HTML-шаблон с брендингом (React Email + Tailwind)
  - ✅ Включить действия: "View Security Activity" / "Contact Support" / "Enable 2FA"
  - ✅ Добавить ссылку на историю безопасности аккаунта
  - ✅ Локализовать все шаблоны (EN, RU) через i18n

- [ ] **[UX] Отображение активных сессий после смены пароля**
  - [ ] Добавить GraphQL Query для получения списка завершенных сессий
  - [ ] Показывать пользователю уведомление "Вы вышли со всех устройств"
  - [ ] Добавить возможность повторного входа одним кликом

### Security Enhancements

- 🟡 **[Security] Анализ риска при смене пароля** *(Partially completed in Step 2)*
  - ✅ Вычислять riskScore на основе факторов (новое устройство, новая локация, частота смены)
  - ✅ Повышать severity события при высоком риске (LOW/MEDIUM/HIGH динамически)
  - [ ] Требовать дополнительную верификацию (2FA) при подозрительной активности

- [ ] **[Security] Blacklist для скомпрометированных паролей**
  - [ ] Интегрировать проверку через HaveIBeenPwned API
  - [ ] Отклонять установку скомпрометированных паролей
  - [ ] Добавить кастомную валидацию в DTO

### Testing

- ✅ **[Testing] Unit-тесты для SecurityEventService** *(Completed in Step 1)*
  - ✅ Протестировать create() с минимальными и полными данными
  - ✅ Протестировать findByUser() с фильтрацией
  - ✅ Протестировать resolve()
  - ✅ Протестировать calculateRiskScore()

- ✅ **[Testing] Unit-тесты для AccountService** *(Completed in Step 2)*
  - ✅ Протестировать `changePassword` с валидацией старого пароля
  - ✅ Протестировать инвалидацию сессий
  - ✅ Протестировать создание SecurityEvent
  - ✅ Протестировать отправку email-уведомлений (mocked)

- ✅ **[Testing] Unit-тесты для SessionService** *(Completed in Step 2)*
  - ✅ Протестировать `invalidateUserSessions` с фильтрацией
  - ✅ Протестировать обработку невалидных данных

- ✅ **[Testing] Unit-тесты для RecoveryService** *(Completed in Step 4)*
  - ✅ Протестировать `resetPassword` с email enumeration protection
  - ✅ Протестировать `newPassword` с валидацией токена
  - ✅ Протестировать отправку email-уведомлений
  - ✅ Протестировать создание SecurityEvent

- [ ] **[Testing] E2E тесты для полного flow**
  - [ ] Полный цикл сброса пароля (запрос → email → установка нового)
  - [ ] Полный цикл смены пароля (старый → новый → logout других сессий)

---

## 🟢 LOW: Продвинутые возможности

### Advanced Security

- [ ] **[Security] Multi-factor подтверждение смены пароля**
  - [ ] Требовать 2FA для смены пароля, если он включен
  - [ ] Отправлять OTP на email/SMS перед изменением пароля
  - [ ] Добавить опциональный challenge-question механизм

- [ ] **[Security] История паролей**
  - [ ] Создать модель `PasswordHistory` для хранения хэшей предыдущих паролей
  - [ ] Запретить повторное использование последних N паролей
  - [ ] Добавить настройку `PASSWORD_HISTORY_LIMIT` в конфиг

- [ ] **[Security] Политики паролей**
  - [ ] Создать таблицу настроек политик паролей
  - [ ] Добавить требования: сложность, длина, спецсимволы
  - [ ] Реализовать принудительную смену пароля через N дней
  - [ ] Добавить Admin API для управления политиками

### Notifications & Monitoring

- [ ] **[Monitoring] Dashboard активности безопасности**
  - [ ] GraphQL Query для получения истории SecurityEvents
  - [ ] Фильтрация по типам событий, датам, severity
  - [ ] Визуализация попыток сброса/смены паролей

- [ ] **[Notifications] Push-уведомления о смене пароля**
  - [ ] Интегрировать сервис push-уведомлений (Firebase, OneSignal)
  - [ ] Отправлять push на доверенные устройства при смене пароля
  - [ ] Добавить настройку предпочтений уведомлений

### Admin Features

- [ ] **[Admin] Принудительный сброс пароля администратором**
  - [ ] Создать мутацию `adminForcePasswordReset(userId)` для SUPER_ADMIN
  - [ ] Генерировать временный пароль или токен
  - [ ] Отправлять пользователю инструкции по восстановлению
  - [ ] Логировать действие администратора в AuditLog

- [ ] **[Admin] Блокировка аккаунта при подозрительной активности**
  - [ ] Автоматически блокировать аккаунт после N неудачных попыток сброса
  - [ ] Создавать `AccountLock` с причиной "SUSPICIOUS_PASSWORD_RESET"
  - [ ] Требовать ручной разблокировки через support

### Documentation

- 🟡 **[Docs] Создать `PASSWORD_MANAGEMENT.md`** *(In progress - Step 3)*
  - 🟡 Документировать архитектуру смены и сброса пароля (создается сейчас)
  - 🟡 Описать flow-диаграммы для каждого процесса
  - 🟡 Добавить примеры использования GraphQL API
  - 🟡 Описать security best practices

- [ ] **[Docs] Обновить `SECURITY.md`**
  - [ ] Добавить раздел "Password Security"
  - [ ] Описать используемые алгоритмы хеширования (Argon2id)
  - [ ] Документировать защиту от атак (enumeration, brute-force)

## 📈 Выполнено в Steps 1-4

### Step 1: Security Event Service Foundation
- ✅ Глобальный сервис аудита безопасности
- ✅ Risk scoring система
- ✅ Unit-тесты с 100% покрытием

### Step 2: Session Invalidation & Password Change Enhancement
- ✅ Инвалидация сессий при смене пароля
- ✅ SecurityEvent логирование для PASSWORD_CHANGED
- ✅ Динамический risk assessment
- ✅ Unit-тесты для AccountService и SessionService

### Step 3: Email Notifications for Password Operations
- ✅ React Email шаблоны (PasswordChanged, PasswordResetConfirmation)
- ✅ SecurityEvent логирование для PASSWORD_RESET_REQUESTED/COMPLETED
- ✅ Email enumeration protection
- ✅ i18n для EN/RU
- ✅ Non-blocking error handling

### Step 4: Password Reset Template & Recovery Service Testing
- ✅ React Email шаблон для password reset запросов
- ✅ Полное покрытие RecoveryService unit-тестами (8 тестов)
- ✅ Тесты для email enumeration protection
- ✅ Тесты для token validation
---

## 🎯 Следующие приоритеты

1. **Step 5**: E2E тесты для полного password flow
2. **Step 6**: Rate limiting для password reset endpoint
3. **Step 7**: HaveIBeenPwned интеграция для compromised passwords
4. **Step 8**: Password history tracking
5. **Step 9**: Admin features (force password reset)

---

*Последнее обновление: 2025-01-27 (Step 4 completed)*


Понял. Я полностью переработаю TODO-список в формате детального Roadmap, как вы показали. Это отличный способ визуализировать прогресс и зависимости.

---

# Module: Rate Limiting & Security Hardening Module

---

## 📊 Progress Overview

```
Rate Limiting Core: ██████████ 100%
Account Lockout:    [                    ] 0%
Security Headers:   [                    ] 0%
Brute-Force Guard:  █████░░░░░ 50%
Documentation:      [                    ] 0%
Testing Coverage:   [                    ] 0%
```

---

## Module: Rate Limiting & Security Hardening Module

---

## 📊 Progress Overview

```
Rate Limiting Core: ██████████ 100%
Account Lockout:    ██████████ 100%
Security Headers:   ██████████ 100%
Brute-Force Guard:  [█████░░░░░] 50%
Documentation:      [                    ] 0%
Testing Coverage:   [                    ] 0%
```

---

## 🔴 HIGH: Критически важные для запуска

### ✅ Step 1: Rate Limiting Module Foundation

- ✅ **[Module] Создать глобальный `RateLimitModule`**
  - ✅ Определить `RateLimitService` и `RateLimitGuard` как провайдеры.
  - ✅ Экспортировать сервисы для доступности в других модулях.
- ✅ **[Service] Реализовать `RateLimitService` на базе Redis**
  - ✅ Реализовать метод `consume()` с алгоритмом *sliding window* (Redis `ZSET`).
  - ✅ Реализовать методы для управления белыми/черными списками (`isWhitelisted`, `isBlacklisted`, `addToWhitelist`, `addToBlacklist`).
- ✅ **[Guard] Реализовать `RateLimitGuard` как глобальный `APP_GUARD`**
  - ✅ Определять ключ для ограничения (IP-адрес или `userId`).
  - ✅ Проверять белые/черные списки перед применением лимитов.
  - ✅ Обрабатывать исключение `ThrottlerException` (HTTP 429) при превышении лимита.
- ✅ **[Decorators] Создать декораторы для гибкой настройки**
  - ✅ `@RateLimit(options)` для переопределения глобальных лимитов.
  - ✅ `@SkipRateLimit()` для исключения эндпоинтов из проверки.
- ✅ **[Integration] Интегрировать модуль в ядро приложения**
  - ✅ Импортировать `RateLimitModule` в `CoreModule`.
  - ✅ Зарегистрировать `RateLimitGuard` как глобальный `APP_GUARD`.
- ✅ **[Config] Вынести глобальные лимиты в `.env`**
  - ✅ `RATE_LIMIT_POINTS` и `RATE_LIMIT_DURATION` добавлены в `.env.example`.

### ✅ Step 2: Account Lockout & Progressive Delays

- ✅ **[Module] Создать `AccountLockModule`**
  - ✅ Создать `src/modules/security/account-lock/account-lock.module.ts`.
  - ✅ Провайдить и экспортировать `AccountLockService`.
- ✅ **[Service] Реализовать `AccountLockService`**
  - ✅ Создать `src/modules/security/account-lock/account-lock.service.ts`.
  - ✅ Реализовать метод `isAccountLocked(userId)` для проверки статуса блокировки в БД.
  - ✅ Реализовать `incrementFailedAttempts(userId, ip, userAgent)` для инкремента счетчика в Redis и применения прогрессивных задержек.
  - ✅ Реализовать `lockAccount(...)` для создания записи `AccountLock` в Prisma, логирования события и отправки уведомления.
  - ✅ Реализовать `clearFailedAttempts(userId)` для сброса счетчика при успехе.
- ✅ **[Integration] Интегрировать сервис в `SessionService`**
  - ✅ Внедрить `AccountLockService` в `SessionService`.
  - ✅ Модифицировать метод `login()` для вызова `isAccountLocked`, `incrementFailedAttempts` и `clearFailedAttempts`.
- ✅ **[Constants] Определить конфигурационные константы**
  - ✅ `MAX_FAILED_ATTEMPTS` (порог блокировки).
  - ✅ `LOCKOUT_DURATION_SECONDS` (длительность блокировки).
  - ✅ `PROGRESSIVE_DELAYS` (массив с порогами и задержками).

### ✅ Step 4: Brute-Force Protection Integration

- ✅ **[Integration] Применить декоратор `@RateLimit()` к критическим эндпоинтам**
  - ✅ `SessionResolver.login` (5 попыток / 15 минут).
  - ✅ `RecoveryResolver.resetPassword` (3 попытки / 1 час).
  - ✅ `TwoFactorResolver.verify2FA` (5 попыток / 5 минут).
  - ✅ `AccountResolver.changePassword` (5 попыток / 1 час).
  - ✅ `VerificationResolver.verificationEmail` (5 попыток / 1 час).
- ✅ **[Audit] Логировать событие `BRUTE_FORCE_DETECTED`**
  - ✅ `RateLimitGuard` теперь логирует событие при превышении лимита.

---

## 🟠 MEDIUM: Важные улучшения (Enterprise)

### ✅ Step 3: Security Headers Middleware

- ✅ **[Config] Создать конфигурационный файл для `helmet`**
  - ✅ Создать `src/modules/security/config/helmet.config.ts`.
  - ✅ Настроить строгую, но рабочую `Content-Security-Policy` (CSP).
  - ✅ Включить HSTS, `nosniff`, `deny`, и `xssFilter`.
- ✅ **[Integration] Интегрировать `helmet` в `main.ts`**
  - ✅ Добавить `app.use(helmet(helmetConfig))` в `bootstrap()`.

### [ ] Расширение Rate Limiting

- [ ] **[Whitelist/Blacklist] Добавить API для управления списками**
  - [ ] Создать GraphQL-мутации (`adminAddToWhitelist`, `adminRemoveFromBlacklist`) для `SUPER_ADMIN`.
- [ ] **[Metrics] Реализовать сбор метрик**
  - [ ] Создать метод в `RateLimitService` для сбора статистики по заблокированным запросам (например, `getRateLimitStats`).
  - [ ] Хранить счетчики в Redis `HASH` для агрегации.

---

## 🟢 LOW: Продвинутые возможности и развитие

### [ ] Динамические лимиты и адаптивная защита

- [ ] **[Feature] Реализовать адаптивное ужесточение лимитов**
  - [ ] Создать механизм, который отслеживает IP-адреса с высокой частотой ошибок и временно понижает для них `points`.
- [ ] **[Feature] Интегрировать с `RiskCalculatorUtil`**
  - [ ] Модифицировать `RateLimitGuard`, чтобы лимиты `points` и `duration` могли зависеть от `riskScore` пользователя.

### [ ] Тестирование

- [ ] **[Unit Tests] Написать юнит-тесты для новых сервисов**
  - [ ] `rate-limit.service.spec.ts`: проверить логику sliding window, граничные случаи и обработку ошибок.
  - [ ] `account-lock.service.spec.ts`: проверить логику блокировок, прогрессивных задержек и взаимодействия с Redis/Prisma.
- [ ] **[Integration Tests] Написать интеграционные тесты для Guard**
  - [ ] `rate-limit.guard.spec.ts`: проверить, как Guard читает метаданные с декораторов и применяет разные лимиты.
- [ ] **[E2E Tests] Написать сквозные тесты**
  - [ ] Симулировать атаку перебора на `login` и проверить, что сначала срабатывает Rate Limiter (HTTP 429), а затем Account Lockout (HTTP 403).

### [ ] Документация

- [ ] **[Docs] Создать `docs/security/RATE_LIMITING.md`**
  - [ ] Описать архитектуру, конфигурацию и использование модуля.
- [ ] **[Docs] Создать `docs/security/ACCOUNT_LOCKOUT.md`**
  - [ ] Описать механизм блокировки, его триггеры и способы разблокировки.
- [ ] **[Docs] Обновить `CHANGELOG.md`**
  - [ ] Добавить запись для каждого завершенного шага.

---

## 🔵 Definition of Done (Критерии готовности)

- **Тесты:** Покрытие юнит-тестами новых сервисов ≥ 80%; интеграционные и E2E-тесты закрывают сценарии brute-force и блокировки.
- **Безопасность:** Все критические эндпоинты защищены; все блокировки и превышения лимитов логируются в `SecurityEvent`.
- **Производительность:** Проверка rate limit занимает менее 5ms.
- **Конфигурация:** Все пороги, длительности и лимиты настраиваются через `.env` переменные.
- **Документация:** Созданы и обновлены все релевантные документы.
- **Код:** Отсутствуют `TODO`, `any`, ошибки линтера и компиляции; код прошел ревью.

---

Отлично! Вот план по рефакторингу и улучшению архитектуры, оформленный в виде детализированного Roadmap/TODO-списка, как вы просили.

---

# Module: Architecture Refactoring & Improvement

---

## 📊 Progress Overview

```
Security Module Centralization:  [████████████████████] 100%
Core Infrastructure Refactoring: [                    ] 0%
Domain Events Implementation:    [                    ] 0%
```
---

## 🔴 HIGH: Централизация модуля безопасности

**Цель:** Объединить всю логику активной защиты (rate limiting, account locking) в едином, интуитивно понятном `SecurityModule`.

### ✅Step 1: Centralize Security Features

- ✅ **[Refactor] Переместить модуль `rate-limit`**
  - ✅ Переместить директорию `src/modules/rate-limit` в `src/modules/security/rate-limit`.
  - ✅Обновить все пути импорта, ссылающиеся на `modules/rate-limit` (например, в резолверах и `CoreModule`).
- ✅ **[Module] Создать и настроить `SecurityModule`**
  - ✅ Создать файл `src/modules/security/security.module.ts`.
  - ✅ В `SecurityModule` импортировать `RateLimitModule` и `AccountLockModule`.
  - ✅ Сделать `SecurityModule` глобальным (`@Global()`).
  - ✅ Экспортировать `RateLimitModule` и `AccountLockModule`, чтобы их сервисы (`RateLimitService`, `AccountLockService`) были доступны для DI в других модулях.
- ✅ **[Integration] Обновить `CoreModule`**
  - ✅ Удалить `RateLimitModule` из `imports` в `src/core/core.module.ts`.
  - ✅ Добавить `SecurityModule` в `imports` в `src/core/core.module.ts`.
- ✅ **[Cleanup] Обновить `index` файлы**
  - ✅ Убедиться, что `src/modules/security/index.ts` корректно экспортирует все необходимые компоненты.

---

## 🟠 MEDIUM: Реструктуризация инфраструктурных адаптеров

**Цель:** Четко отделить инфраструктурный слой (адаптеры к внешним сервисам) от бизнес-логики, переместив `mail` и `sms` в `core`.

### [ ] Step 2: Refactor Core Adapters

- ✅ **[Refactor] Переместить модуль `mail`**
  - ✅ Переместить директорию `src/modules/libs/mail` в `src/core/mail`.
  - ✅ Обновить пути импорта `MailModule` и `MailService` во всем приложении (особенно в `CoreModule` и `NotificationService`).
- ✅ **[Refactor] Переместить модуль `sms`**
  - ✅ Переместить директорию `src/modules/libs/sms` в `src/core/sms`.
  - ✅ Обновить пути импорта `SmsModule` и `SmsService` во всем приложении.
- ✅ **[Cleanup] Удалить директорию `src/modules/libs`**
  - ✅ После перемещения всех модулей, директория `libs` должна стать пустой и ее можно удалить.
- ✅ **[Docs] Обновить проектную документацию**
  - ✅ Обновить файл `backend.md` или аналогичный, чтобы отразить новую структуру `core`.

### ✅ Step 2.1 (Revised): Consolidate Communication Adapters

-   ✅ **[Module] Создать `CommunicationModule`**
    -   ✅ Создать директорию `src/core/communication`.
    -   ✅ Создать главный `CommunicationModule`, импортирующий `MailModule` и `SmsModule`.
-   ✅ **[Refactor] Переместить `mail` и `sms` модули**
    -   ✅ Переместить `src/modules/libs/mail` в `src/core/communication/mail`.
    -   ✅ Переместить `src/modules/libs/sms` в `src/core/communication/sms`.
    -   ✅ Обновить все пути импорта в проекте.
-   ✅ **[Integration] Обновить `CoreModule`**
    -   ✅ Заменить импорты `MailModule` и `SmsModule` на единый `CommunicationModule`.
-   ✅ **[Cleanup] Удалить директорию `src/modules/libs`**.

---

## 🟢 LOW / ADVANCED: Внедрение Domain Events

**Цель:** Уменьшить прямую связанность между сервисами, заменив прямые вызовы на систему событий и слушателей для улучшения расширяемости.

### [ ] Step 3: Implement Domain Events Pattern

- [ ] **[Infra] Настроить `EventEmitterModule`**
  - [ ] Добавить зависимость `@nestjs/event-emitter`.
  - [ ] Импортировать `EventEmitterModule.forRoot()` в `CoreModule`.
- [ ] **[Core] Определить доменные события**
  - [ ] Создать файл `src/shared/events/domain-events.constants.ts` с перечислением всех событий (e.g., `user.password_changed`, `security.account_locked`).
  - [ ] Создать файл `src/shared/events/domain-events.types.ts` с интерфейсами `payload` для каждого события (e.g., `UserPasswordChangedPayload`).
- [ ] **[Refactor] Модифицировать сервисы-источники для "излучения" событий**
  - [ ] Внедрить `EventEmitter2` в сервисы (`AccountService`, `TwoFactorMethodService` и т.д.).
  - [ ] Заменить прямые вызовы `securityEventService.create()` и `notificationService.notify...()` на `this.eventEmitter.emit('event.name', payload)`.
- [ ] **[Refactor] Реализовать слушателей событий (Listeners)**
  - [ ] В `SecurityEventService` создать методы, декорированные `@OnEvent('event.name')`, которые будут принимать `payload` и вызывать `this.create()`.
  - [ ] В `NotificationService` создать методы, декорированные `@OnEvent('event.name')`, которые будут вызывать соответствующие методы `notify...()`.
- [ ] **[Testing] Обновить юнит-тесты**
  - [ ] Тесты для сервисов-источников теперь должны проверять, что `eventEmitter.emit` был вызван с правильными параметрами (`jest.spyOn(...)`).
  - [ ] Написать новые тесты для слушателей, чтобы проверить, что они корректно реагируют на события.

---

# Module: Core Security Testing Initiative

## 📊 Progress Overview

```
Test Environment Setup: [████████████████████] 100% ✅ Complete
Unit Test Coverage:     [████████████████████] 100% ✅ Complete
Integration Points:     [████████████████████] 100% ✅ Complete
Documentation & CI:     [████████████████████] 100% ✅ Complete
```

---

## 🔴 HIGH: Критически важные для стабилизации

### ✅ Step 1: Test Environment & Mocks Setup

- ✅ **[Test File]** Создать файл `src/modules/security/account-lock/account-lock.service.spec.ts`.
- ✅ **[Boilerplate]** Настроить базовую структуру теста с использованием `Test.createTestingModule` из `@nestjs/testing`.
- ✅ **[Mocking]** Реализовать моки для всех зависимостей сервиса:
    - ✅ **`PrismaService`:** Создать `mockPrismaService` с `jest.fn()` для методов `accountLock.findFirst` и `accountLock.create`.
    - ✅ **`RedisService`:** Создать `mockRedisService` с `jest.fn()` для методов, используемых `CoreService`.
    - ✅ **`SecurityEventService`:** Создать `mockSecurityEventService` с `jest.fn()` для метода `create`.
    - ✅ **`NotificationService`:** Создать `mockNotificationService` с `jest.fn()` для метода `notifyAccountLocked`.
- ✅ **[DI]** Сконфигурировать `Test.createTestingModule` для инъекции моков вместо реальных сервисов.
- ✅ **[Sanity Check]** Написать первый простой тест `it('should be defined', ...)` и убедиться, что он проходит.

### ✅ Step 2: Unit Testing Core Logic

- ✅ **[Test Suite]** Написать `describe('isAccountLocked', ...)`:
    - ✅ `it('should return true if an active lock exists')`
    - ✅ `it('should return true for a permanent lock (expiresAt is null)')`
    - ✅ `it('should return false if no lock exists')`
    - ✅ `it('should return false if the lock has expired')`
    - ✅ `it('should return false if the lock has been manually unlocked')`
- ✅ **[Test Suite]** Написать `describe('clearFailedAttempts', ...)`:
    - ✅ `it('should call del with the correct Redis key')`
- ✅ **[Test Suite]** Написать `describe('incrementFailedAttempts', ...)`:
    - ✅ `it('should only increment the counter if the threshold is not reached')`
    - ✅ `it('should apply a progressive delay on specific attempt numbers')`
    - ✅ **(Ключевой тест)** `it('should lock the account when MAX_FAILED_ATTEMPTS is reached')`:
        - ✅ Проверить вызов `prisma.accountLock.create` с корректными данными.
        - ✅ Проверить вызов `securityEventService.create` с `ESecurityEvent.ACCOUNT_LOCKED`.
        - ✅ Проверить, что счетчик в Redis (`del`) был очищен после создания персистентной блокировки.
    - ✅ `it('should handle Redis errors gracefully without crashing')`
- ✅ **[TypeScript]** Исправить все ошибки типизации и линтинга.

### ✅ Step 3: Finalization & Integration

- ✅ **[CI]** Запустить тесты с флагом `--coverage` и убедиться, что покрытие для `account-lock.service.ts` **≥ 80%**.
- ✅ **[Refactoring]** Провести ревью написанных тестов на предмет читаемости и эффективности.
- ✅ **[Roadmap]** Обновить этот и основной Roadmap, отметив задачи как выполненные.

---

## 🔵 Definition of Done (Критерии готовности для этой задачи)

- ✅ **Тесты:** Покрытие юнит-тестами для `AccountLockService` составляет >90%. Все пограничные случаи проверены.
- ✅ **Код:** Отсутствуют `TODO`, `any`, ошибки линтера в тестовом файле.
- ✅ **CI:** Тесты успешно проходят в рамках локального запуска.
- ✅ **Документация:** Код тестов самодокументируемый.

---

# Module: Code Quality & Security Hardening

---

## 📊 Progress Overview

```
Security Hardening:     [████████████████████] 100% ✅ Step 1 Complete
Service Refactoring:    [████████████████████] 100% ✅ Step 2 Complete
                        [████████████████████] 100% ✅ Step 3 Complete
Template Architecture:  [████████████████████] 100% ✅ Step 4 Complete
Type System Cleanup:    [████████████████████] 100% ✅ Step 5 Complete
Error Handling:         [████████████████████] 100% ✅ Step 6 Complete
Testing Coverage:       [████████████░░░░░░░░] 60%  ✅ Greatly Improved
```

---

## 🔴 HIGH: Критическая безопасность

### ✅ Step 1: Encryption Verification & Implementation for 2FA Secrets

**Цель:** Гарантировать, что все чувствительные данные 2FA (TOTP-секреты, WebAuthn public keys) всегда шифруются перед записью в БД и расшифровываются при чтении.

- ✅ **[Audit]** Провести аудит текущей реализации в `TwoFactorMethodService`
  - ✅ Проверить все места записи в поле `AuthenticationMethod.data`
  - ✅ Проверить вызовы `EncryptionUtil.encryptJSON()` перед записью
  - ✅ Проверить вызовы `EncryptionUtil.decryptJSON()` после чтения
  - ✅ Документировать найденные проблемы
- ✅ **[Fix]** Реализовать/исправить шифрование данных
  - ✅ Добавить шифрование при создании методов (`setupOtp`, `completeTotpSetup`)
  - ✅ Добавить шифрование при обновлении методов - *не требуется*
  - ✅ Добавить расшифровку при чтении методов (`sendOtpCode`, `verifyTotpCode`)
  - ✅ Создать приватные методы-обертки для централизации логики
- ✅ **[TypeScript]** Исправить ошибки компиляции
  - ✅ Исправить unsafe type cast в `decryptMethodData()`
  - ✅ Добавить недостающее объявление `verifyTotpCodeDirect()`
- ✅ **[Testing]** Написать юнит-тесты для проверки шифрования
  - ✅ Тест: шифрование вызывается при создании TOTP метода
  - ✅ Тест: шифрование вызывается при создании OTP Email метода
  - ✅ Тест: шифрование вызывается при создании OTP SMS метода
  - ✅ Тест: расшифровка вызывается при верификации TOTP
  - ✅ Тест: расшифровка вызывается при отправке OTP кода
  - ✅ Тест: ошибка при невалидных зашифрованных данных
  - ✅ Тест: обратная совместимость с legacy данными
- ✅ **[Security]** Добавить дополнительную защиту
  - ✅ Валидация структуры данных после расшифровки
  - ✅ Обработка ошибок при failed decryption
- ✅ **[Docs]** Обновить документацию
  - ✅ Добавить JSDoc к методам шифрования/расшифровки
  - ✅ Создать/обновить `docs/2fa/SECURITY.md` с разделом о защите данных

---

## 🟠 MEDIUM: Рефакторинг и производительность

### [ ] Step 2: Consolidate OTP Sending Logic in VerificationService

**Цель:** Устранить дублирование кода, объединив три похожих метода отправки токенов (`sendEmailVerificationToken`, `sendEmailVerificationOtpToken`, `sendSmsVerificationOtpToken`) в один универсальный приватный метод.

- ✅ **[Refactor]** Создать универсальный приватный метод `sendVerificationToken`
  - ✅ Параметры: `user`, `channel: 'email' | 'sms'`, `type: 'link' | 'code'`, `lng`
  - ✅ Логика генерации токена (UUID или numeric)
  - ✅ Логика выбора канала отправки (email/SMS)
- ✅ **[Refactor]** Заменить существующие методы на обертки
  - ✅ `sendEmailVerificationToken` → вызов универсального метода
  - ✅ `sendEmailVerificationOtpToken` → вызов универсального метода
  - ✅ `sendSmsVerificationOtpToken` → вызов универсального метода
- ✅ **[Testing]** Обновить тесты
  - ✅ Написать тесты для нового приватного метода
  - ✅ Убедиться, что публичные методы продолжают работать
- [ ] **[Metrics]** Измерить улучшение
  - [ ] Количество удаленных строк дублированного кода

### ✅ Step 3: Centralize Risk Score Calculation Logic

**Цель:** Вынести логику расчета `riskScore` из `AccountService.changePassword` в `RiskCalculatorUtil` для обеспечения консистентности оценок во всей системе.

- ✅ **[Refactor]** Создать метод `RiskCalculatorUtil.assessPasswordChangeRisk`
  - ✅ Входные параметры: `sessionsInvalidated`, `isNewDevice`
  - ✅ Вычисление факторов риска (password change, multiple sessions, new device)
  - ✅ Возврат полного `IRiskAssessment` объекта
- ✅ **[Refactor]** Обновить `AccountService.changePassword`
  - ✅ Заменить inline-расчет на вызов утилиты
  - ✅ Использовать `riskAssessment.score` и `riskAssessment.factors`
  - ✅ Динамическое определение `severity` на основе `riskAssessment.level`
- ✅ **[Constants]** Добавить недостающие константы
  - ✅ `RISK_WEIGHTS.PASSWORD_CHANGE`, `MULTIPLE_SESSIONS_INVALIDATED` в `risk.constants.ts`
- ✅ **[TypeScript]** Исправить несоответствия типов
  - ✅ Создать `RiskMapperUtil` для преобразования `ERiskLevel` в `ESecuritySeverity`
  - ✅ Унифицировать `IRiskFactor` и `RiskFactor` типы
- ✅ **[Testing]** Написать тесты для нового метода
  - ✅ Тест: низкий риск (1 сессия, старое устройство)
  - ✅ Тест: средний риск (2-3 сессии)
  - ✅ Тест: высокий риск (>3 сессий, новое устройство)
- [ ] **[Future]** Применить тот же паттерн к другим операциям
  - [ ] Email change risk assessment
  - [ ] Login risk assessment

### ✅ Step 4: Refactor Email Template URL Handling

**Цель:** Убрать хардкод `process.env.CLIENT_URL` из React Email шаблонов, передавая URL как пропсы из `MailService`.

- ✅ **[Template]** Обновить интерфейсы пропсов всех шаблонов
  - ✅ Добавить `securityUrl`, `supportUrl` и другие URL как required props
  - ✅ Удалить прямое обращение к `process.env.CLIENT_URL` из тела шаблонов
- ✅ **[Service]** Обновить `MailService` для передачи URL
  - ✅ `sendPasswordChangedNotification` → передавать URL как пропсы
  - ✅ `sendPasswordResetConfirmation` → передавать URL как пропсы
  - ✅ Все другие методы отправки email
- ✅ **[Refactor]** Применить к всем шаблонам
  - ✅ `PasswordChangedTemplate`
  - ✅ `PasswordResetConfirmationTemplate`
  - ✅ `ResetPasswordTemplate`
  - ✅ Все шаблоны из `2fa-security/` (9 шаблонов)
- ✅ **[TypeScript]** Исправить ошибки компиляции `InvalidClassModuleException` и `UnknownDependenciesException`
- ✅ **[Utils]** (Опционально) Создать хелпер `UrlUtil.buildUrl`
  - ✅ Централизовать логику построения URL из `ConfigService`
  - ✅ Использовать в `MailService` для генерации всех URL
- ✅**[Testing]** Проверить тестируемость
  - ✅ Убедиться, что шаблоны можно тестировать без env-переменных
  - ✅ Написать тесты для `UrlUtil` (если создан)

---

## 🟢 LOW: Code Style & Clarity

### ✅ Step 5: Unify SessionMetadata Type Naming

**Цель:** Устранить путаницу между `ISessionMetadata` (shared/types) и `SessionMetadata` (GraphQL модель) путем унификации или четкого разделения назначения.

- ✅ **[Analysis]** Проанализировать использование обоих типов
  - ✅ Найти все места использования `ISessionMetadata`
  - ✅ Найти все места использования `SessionMetadata` (GraphQL)
  - ✅ Проверить структурную идентичность
- ✅ **[Decision]** Выбрать стратегию
  - ✅ **Вариант B:** Разделение с переименованием (`ISessionMetadataDTO` vs `SessionMetadataGraphQL`)
- ✅ **[Refactor]** Применить выбранную стратегию
  - ✅ Переименовать типы
  - ✅ Обновить все импорты в проекте
  - ✅ Обновить экспорты в `index.ts` файлах
- ✅ **[Documentation]** Добавить JSDoc-комментарии
  - ✅ Разъяснить назначение каждого типа
  - ✅ Указать, где какой тип должен использоваться

### ✅ Step 6: Improve Error Handling in Bootstrap

**Цель:** Заменить `console.error` в `main.ts` на полноценный `Logger` для консистентности логирования.

- ✅ **[Fix]** Обновить обработку ошибок в `bootstrap()`
  - ✅ Создать `bootstrapLogger = new Logger('Bootstrap')`
  - ✅ Заменить `console.error` на `bootstrapLogger.error`
  - ✅ Логировать stack trace корректно
- ✅ **[Enhancement]** Добавить логирование успешного старта
  - ✅ Логировать URL приложения после `app.listen()`
  - ✅ Логировать URL GraphQL Playground
- ✅ **[Graceful Shutdown]** Добавить обработку сигналов
  - ✅ Включить `app.enableShutdownHooks()`

---

## 🔵 Definition of Done (Критерии готовности)

- **Безопасность (Step 1):**
  - ✅ Все поля `AuthenticationMethod.data` шифруются/расшифровываются через `EncryptionUtil`.
  - ✅ Написаны и проходят тесты для шифрования.
  - ✅ Документация обновлена.
  
- **Рефакторинг (Steps 2-4):**
  - ✅ Код без дублирования: логика OTP, risk assessment, URL handling унифицирована.
  - ✅ Все изменения покрыты тестами.
  - ✅ Отсутствуют ошибки линтера.
  
- **Code Style (Steps 5-6):**
  - ✅ Нейминг типов унифицирован или четко разграничен.
  - ✅ Обработка ошибок использует `Logger` везде.
  - ✅ Код прошел ревью.

- **Документация:**
  - ✅ Обновлен `CHANGELOG.md` для всех шагов.
  - ✅ Созданы/обновлены релевантные `.md` файлы.

- **Производительность:**
  - ✅ Операции выполняются в целевых пределах (< 500ms для API).

---
