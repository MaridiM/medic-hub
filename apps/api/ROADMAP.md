# 🗺️ Roadmap & Tasks

## Статусные группы

- 🔴 **HIGH** — критически важные задачи для первого стабильного релиза.
- 🟠 **MEDIUM** — важные улучшения для повышения безопасности и удобства (Enterprise-уровень).
- 🟢 **LOW** — перспективные задачи для будущего развития.
- 🔵 **Definition of Done** — критерии готовности.

**Легенда:**

- ✅ — задача полностью выполнена.
- 🟡 — задача выполнена частично или заложена основа.
- [ ] — задача ещё не начата.

---

## 📊 Progress Overview

```
Authentication Core:  ████████░░ 80%
2FA System:          ██████░░░░ 60%
Security Features:   ████░░░░░░ 40%
Admin Tools:         ███░░░░░░░ 30%
Documentation:       ██████░░░░ 60%
Testing Coverage:    ███░░░░░░░ 30%
Infrastructure:      ██░░░░░░░░ 20%
```

---

## 🎯 Модуль: 2FA и система RBAC

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

---

### 🔴 HIGH: Критически важные для запуска

#### ✅ Архитектура и фундамент модуля 2FA

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

#### ✅ Интеграция с системами безопасности

- ✅ Интегрирован `SecurityEventService` во все критические операции  
- ✅ Логирование при добавлении/удалении методов 2FA  
- ✅ Типы для метаданных событий (`ISecurityEventMetadata`, `IAdminActionMetadata`)  
- ✅ Исправлена логическая ошибка при регенерации резервных кодов

#### ✅ Исправления типизации

- ✅ Устранены ошибки `TypeScript` и `ESLint`  
- ✅ Исправлены небезопасные аргументы, корректно применён `Prisma.JsonValue`  
- ✅ Приведена в порядок типизация декораторов

#### ✅ Интеграция провайдеров уведомлений

- ✅ **[MailService]** Добавлен `sendOtpCodeEmail` для отправки OTP  
- ✅ **[MailService]** Реализован `canSendEmail` для защиты репутации домена  
- ✅ **[SmsService]** Реализован `canSendSms` для валидации номеров  
- ✅ `MailService` подключён в `TwoFactorMethodService`  
- ✅ `SmsService (Twilio)` подключён в `TwoFactorMethodService`  
- ✅ Адаптированы шаблоны писем и SMS

#### ✅ Административный функционал

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

#### ✅ Автоматизация обслуживания (Cron Jobs)

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

#### ✅ Поддержка WebAuthn / Passkeys

- ✅ **[Шаг 3]** WebAuthn/Passkeys Implementation
  - ✅ Установлена библиотека `@simplewebauthn/server`
  - ✅ Создан `WebAuthnService` для инкапсуляции логики работы с протоколом
  - ✅ Реализован метод `generateRegistrationOptions` для создания опций регистрации
  - ✅ Реализован метод `verifyRegistration` для верификации ответа регистрации
  - ✅ Реализован метод `generateAuthenticationOptions` для создания опций аутентификации
  - ✅ Реализован метод `verifyAuthentication` для верификации ответа аутентификации
  - ✅ Созданы WebAuthn DTOs (`StartWebAuthnRegistrationInput`, `CompleteWebAuthnRegistrationInput`, etc.)
  - ✅ Созданы WebAuthn GraphQL Models (5 моделей с полными descriptions)
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

- ✅ **[Шаг 3.1]** WebAuthn TypeScript Fixes & GraphQL Schema
  - ✅ Исправлены ошибки преобразования типов `IWebAuthnMethodData`/`IPasskeyMethodData`
  - ✅ Удалены избыточные type assertions
  - ✅ Добавлен метод `detectPlatform` для определения платформы
  - ✅ Добавлены i18n переводы для WebAuthn (ru/en)
  - ✅ Исправлены типы для `@simplewebauthn/server` API
  - ✅ Добавлены константы WebAuthn в общий файл констант
  - ✅ Установлен `graphql-type-json` для поддержки JSON полей
  - ✅ Заменены все `@Field(() => Object)` на `@Field(() => GraphQLJSON)`
  - ✅ Добавлены comprehensive descriptions для всех WebAuthn моделей и DTOs

#### [ ] TOTP (Google Authenticator) - полная реализация

- [ ] **[Feature]** TOTP registration flow
  - [ ] Генерация secret с `otplib`
  - [ ] Создание QR-кода (data URI)
  - [ ] Верификация setup кода перед активацией
  - [ ] Хранение зашифрованного secret в `AuthenticationMethod`
  - **Effort:** 6-8 часов
  - **Dependencies:** `otplib`, `qrcode` package

- [ ] **[Feature]** TOTP verification с временной погрешностью
  - [ ] Принимать коды ±1 временное окно (30 секунд)
  - [ ] Предотвращать повторное использование кодов (Redis)
  - [ ] Счётчик неудачных попыток
  - **Effort:** 4-5 часов

#### [ ] OTP Email/SMS - улучшения

- [ ] **[Security]** OTP code expiration и cleanup
  - [ ] Коды истекают через 5 минут
  - [ ] Хранение в Redis с TTL
  - [ ] Auto-cleanup с TTL
  - **Effort:** 3-4 часа

- [ ] **[Security]** Предотвращение повторного использования OTP
  - [ ] Пометка кода как использованного в Redis
  - [ ] Отклонение уже использованных кодов
  - **Effort:** 2-3 часа

- [ ] **[Rate Limiting]** Ограничение отправки OTP
  - [ ] Максимум 3 email за 5 минут
  - [ ] Максимум 3 SMS за 15 минут
  - [ ] Прогрессивные задержки при злоупотреблении
  - **Effort:** 4-5 часов

#### [ ] WebAuthn - дополнительные возможности

- [ ] **[Config]** WebAuthn RP configuration
  - [ ] Environment variables: `WEBAUTHN_RP_NAME`, `WEBAUTHN_RP_ID`, `WEBAUTHN_ORIGIN`
  - [ ] Валидация: RP ID должен соответствовать домену
  - **Effort:** 2-3 часа

- [ ] **[Security]** WebAuthn challenge validation
  - [ ] Хранение challenges в Redis с 5-минутным TTL
  - [ ] Верификация соответствия challenge при проверке
  - [ ] Предотвращение replay-атак
  - **Effort:** 4-5 часов

- [ ] **[Feature]** Credential counter verification
  - [ ] Обнаружение клонированных authenticators (счётчик уменьшился)
  - [ ] Логирование security event при аномалии счётчика
  - [ ] Отключение credential при обнаружении клонирования
  - **Effort:** 3-4 часа

#### 🟡 Тестирование *(основа заложена, требуется наполнение)*

- 🟡 **[Testing]** Юнит‑тесты (Jest): созданы файлы `.spec.ts` для:  
  - 🟡 `mail.service.spec.ts`  
  - 🟡 `2fa-method.service.spec.ts`  
  - 🟡 `device-trust.service.spec.ts`  
  - 🟡 `backup-code.service.spec.ts`  
  - 🟡 `security-event.service.spec.ts`
  - [ ] `webauthn.service.spec.ts` - **Effort:** 10-12 часов
  - [ ] `totp.service.spec.ts` (когда будет создан) - **Effort:** 6-8 часов
  - [ ] `admin-2fa.service.spec.ts` - **Effort:** 8-10 часов
  - [ ] **Target:** >80% code coverage

- [ ] **[Testing]** Интеграционные тесты: критические сценарии с БД/Redis
  - [ ] Транзакции создания методов + резервных кодов
  - [ ] Сквозной поток скоринга доверенных устройств
  - [ ] Админ‑операции с аудитом
  - [ ] WebAuthn registration/authentication flow (с mocked @simplewebauthn)
  - [ ] TOTP setup → verify → remove
  - [ ] OTP email/SMS flow с Redis TTL
  - **Effort:** 20-25 часов

- [ ] **[Testing]** E2E‑тесты (Supertest/Playwright):
  - [ ] Полная цепочка: TOTP setup → login → verify → remove
  - [ ] Поток OTP email/SMS
  - [ ] Поток WebAuthn/Passkeys (с browser automation)
  - [ ] Поток админ‑операций
  - [ ] Выполнение cron‑задач (с временным ускорением)
  - [ ] Backup codes usage и regeneration
  - **Effort:** 16-20 часов

#### [ ] Наблюдаемость и метрики

- [ ] **[Monitoring]** Сбор метрик для 2FA операций
  - [ ] Метрики Prometheus для всех 2FA методов
  - [ ] Счётчики успешных/неудачных верификаций
  - [ ] Histograms для latency операций
  - [ ] Gauge для активных методов по типам
  - **Effort:** 8-10 часов
  - **Dependencies:** `@willsoto/nestjs-prometheus`

- [ ] **[Monitoring]** Метрики для cron‑задач
  - [ ] Время выполнения каждой задачи
  - [ ] Количество обработанных записей
  - [ ] Количество ошибок
  - **Effort:** 4-5 часов

- [ ] **[Health Checks]** Health checks для 2FA сервисов
  - [ ] Проверка подключения к Redis
  - [ ] Проверка доступности email/SMS провайдеров
  - [ ] Проверка работы encryption/decryption
  - **Effort:** 6-8 часов

- [ ] **[Alerts]** Правила оповещений
  - [ ] Alert при высокой частоте неудачных 2FA верификаций
  - [ ] Alert при недоступности email/SMS провайдеров
  - [ ] Alert при сбоях cron-задач
  - **Effort:** 4-6 часов

---

### 🟠 MEDIUM: Важные улучшения (Enterprise)

#### [ ] NotificationService для событий безопасности

- [ ] **[Service]** Создать базовый `NotificationService` (абстракция)
  - [ ] Интерфейс для различных каналов (email, SMS, push)
  - [ ] Шаблонизация сообщений
  - [ ] Очередь отправки (Bull/BullMQ)
  - **Effort:** 10-12 часов

- [ ] **[Templates]** Email‑шаблоны для событий безопасности
  - [ ] `notify2FAMethodAdded` - уведомление о добавлении метода
  - [ ] `notify2FAMethodRemoved` - уведомление об удалении метода
  - [ ] `notifyNewDeviceLogin` - вход с нового устройства
  - [ ] `notifyLowBackupCodes` - осталось мало резервных кодов
  - [ ] `notifySuspiciousActivity` - подозрительная активность
  - [ ] `notify2FADisabledByAdmin` - 2FA отключена администратором
  - [ ] `notifyPasswordChanged` - пароль был изменён
  - [ ] `notifyEmailChanged` - email был изменён
  - **Effort:** 12-15 часов

- [ ] **[Integration]** Интеграция с `SecurityEventService`
  - [ ] Автоматическая отправка на основе severity
  - [ ] Дедупликация уведомлений
  - [ ] Throttling для избежания спама
  - **Effort:** 6-8 часов

- [ ] **[Feature]** Управление предпочтениями уведомлений
  - [ ] User preferences для каналов уведомлений
  - [ ] GraphQL mutations для настройки
  - [ ] Хранение в БД (новая таблица или JSON field)
  - **Effort:** 8-10 часов

#### [ ] Step‑up аутентификация

- [ ] **[Service]** Создать `StepUpVerificationService`
  - [ ] Запрос повторной 2FA для чувствительных операций
  - [ ] Хранение "свежести" верификации в Redis
  - [ ] Конфигурируемое время действия (default: 15 минут)
  - **Effort:** 8-10 часов

- [ ] **[Guard]** Расширить `TwoFactorVerifiedGuard` проверкой «свежести»
  - [ ] Проверка timestamp последней верификации
  - [ ] Автоматический запрос step-up при истечении
  - **Effort:** 4-5 часов

- [ ] **[API]** Добавить мутацию `requestStepUpVerification`
  - [ ] Генерация challenge для step-up
  - [ ] Поддержка всех методов 2FA
  - [ ] GraphQL mutation + response model
  - **Effort:** 6-8 часов

- [ ] **[Decorator]** Создать декоратор `@RequireStepUp`
  - [ ] Параметр: максимальный возраст верификации
  - [ ] Автоматическая проверка через guard
  - **Effort:** 3-4 часа

- [ ] **[Feature]** Маркировка «чувствительных» операций
  - [ ] Изменение email/password
  - [ ] Удаление аккаунта
  - [ ] Изменение 2FA настроек
  - [ ] Финансовые операции (если применимо)
  - **Effort:** 4-6 часов

#### [ ] Rate Limiting для 2FA операций

- [ ] **[Rate Limiting]** Ограничение частоты отправки OTP
  - [ ] Использование `@nestjs/throttler` или Redis
  - [ ] Лимиты: 3 запроса за 5 минут (email), 3 за 15 минут (SMS)
  - [ ] Отдельные лимиты для разных методов
  - **Effort:** 6-8 часов

- [ ] **[Security]** Прогрессивные задержки при неудачных попытках
  - [ ] 1-я неудача: без задержки
  - [ ] 2-я: 5 секунд
  - [ ] 3-я: 15 секунд
  - [ ] 4-я: 60 секунд
  - [ ] 5+: временная блокировка (15 минут)
  - **Effort:** 8-10 часов

- [ ] **[Security]** Механизм блокировки учётной записи
  - [ ] Автоматическая блокировка после N неудачных попыток
  - [ ] Запись в `AccountLock` таблицу
  - [ ] Email уведомление владельцу
  - [ ] Разблокировка через time-based expiration или admin action
  - **Effort:** 10-12 часов

- [ ] **[Security]** Ограничение по IP‑адресу
  - [ ] Отдельные лимиты для IP (защита от distributed attacks)
  - [ ] Глобальный rate limit на endpoint
  - [ ] Whitelist для доверенных IP (опционально)
  - **Effort:** 6-8 часов

- [ ] **[Feature]** Исключения для доверенных устройств
  - [ ] Ослабление лимитов для `isTrusted` устройств
  - [ ] Конфигурируемые множители лимитов
  - **Effort:** 4-5 часов

#### [ ] Восстановление 2FA (Recovery Flow)

- [ ] **[Service]** Создать `AccountRecoveryService`
  - [ ] Генерация recovery tokens
  - [ ] Хранение в БД с expiration
  - [ ] Валидация токенов
  - **Effort:** 8-10 часов

- [ ] **[Flow]** Реализовать поток верификации личности
  - [ ] Email verification (отправка кода на email)
  - [ ] Security questions (опционально)
  - [ ] Admin approval для критических случаев
  - **Effort:** 12-15 часов

- [ ] **[API]** Генерация ссылок для восстановления
  - [ ] GraphQL mutation: `requestAccountRecovery`
  - [ ] Email с recovery link
  - [ ] Mutation: `completeAccountRecovery`
  - **Effort:** 6-8 часов

- [ ] **[Audit]** Аудит‑лог восстановления
  - [ ] Логирование всех попыток восстановления
  - [ ] Security severity: HIGH
  - [ ] Email уведомления о восстановлении
  - **Effort:** 4-5 часов

- [ ] **[Docs]** Документация для пользователей
  - [ ] Инструкции по восстановлению
  - [ ] FAQ
  - **Effort:** 3-4 часа

#### [ ] Расширенная работа с устройствами

- [ ] **[Feature]** Улучшенное fingerprinting устройств
  - [ ] Расширенный набор параметров (canvas, WebGL, fonts)
  - [ ] Probabilistic matching (для изменяющихся fingerprints)
  - [ ] Версионирование fingerprints
  - **Effort:** 10-12 часов
  - **Dependencies:** `fingerprintjs` pro (платная) или custom implementation

- [ ] **[UX]** Device management UI flows
  - [ ] Просмотр всех доверенных устройств
  - [ ] Отзыв доверия конкретного устройства
  - [ ] Массовый отзыв всех устройств
  - [ ] Уведомления при действиях с устройствами
  - **Effort:** 8-10 часов

- [ ] **[Feature]** Автоматическое доверие устройствам
  - [ ] Опция "Trust this device" после успешной 2FA
  - [ ] Конфигурируемая длительность доверия (default: 30 дней)
  - [ ] Checkbox в UI при 2FA verification
  - **Effort:** 6-8 часов

- [ ] **[Security]** Аномалии в поведении устройств
  - [ ] Обнаружение изменений fingerprint
  - [ ] Suspicious device activity (частая смена IP/location)
  - [ ] Автоматический отзыв при подозрении
  - **Effort:** 12-15 часов

---

### 🟢 LOW: Продвинутые возможности и развитие

#### ✅ Документация API

- ✅ **[Шаг 4]** GraphQL API Documentation
  - ✅ Создана полная документация всех queries и mutations
  - ✅ Документированы WebAuthn и админские операции
  - ✅ Добавлены примеры обработки ошибок и все GraphQL типы
  - ✅ SimpleWebAuthn integration guide (`docs/webauthn-simplewebauthn-example.md`)

#### [ ] Админ‑панель (UI)

- [ ] **[Frontend]** UI для управления 2FA
  - [ ] Просмотр всех методов пользователя
  - [ ] Отключение методов
  - [ ] Принудительная активация 2FA
  - [ ] Просмотр backup codes (зашифрованных)
  - **Effort:** 16-20 часов (frontend)

- [ ] **[Frontend]** Дашборд мониторинга cron‑задач
  - [ ] Статус выполнения задач
  - [ ] История выполнений
  - [ ] Ручной запуск задач
  - [ ] Логи ошибок
  - **Effort:** 12-15 часов

- [ ] **[Feature]** Интерфейс массовых операций
  - [ ] Bulk enable/disable 2FA для групп пользователей
  - [ ] Bulk device revocation
  - [ ] Export/Import пользователей с 2FA настройками
  - **Effort:** 20-25 часов

- [ ] **[UX]** Поиск и фильтры
  - [ ] Поиск пользователей по email, ID, 2FA status
  - [ ] Фильтры по методам 2FA
  - [ ] Фильтры по security events
  - [ ] Сортировка и пагинация
  - **Effort:** 10-12 часов

- [ ] **[Feature]** Экспорт данных
  - [ ] Export security events (CSV, JSON)
  - [ ] Export audit logs
  - [ ] Export user 2FA statistics
  - **Effort:** 8-10 часов

- [ ] **[Analytics]** Виджеты аналитики
  - [ ] 2FA adoption rate (% пользователей с 2FA)
  - [ ] Popular 2FA methods (TOTP vs WebAuthn vs OTP)
  - [ ] Security events timeline
  - [ ] Failed verification attempts graph
  - **Effort:** 15-18 часов

#### [ ] Расширенный риск‑скоринг

- [ ] **[AI/ML]** ML‑оценка рисков
  - [ ] Сбор training data из `SecurityEvent`
  - [ ] Feature engineering (time patterns, location patterns, device patterns)
  - [ ] Обучение модели (Python service или TensorFlow.js)
  - [ ] API для предсказания риска
  - **Effort:** 40-60 часов
  - **Dependencies:** Python ML service, scikit-learn/TensorFlow

- [ ] **[Analytics]** Поведенческая аналитика
  - [ ] Анализ паттернов логина (время, частота)
  - [ ] Анализ используемых устройств
  - [ ] Анализ географии входов
  - [ ] Baseline behavior profiling
  - **Effort:** 30-40 часов

- [ ] **[Feature]** Дашборд risk‑score
  - [ ] Визуализация risk score для пользователя
  - [ ] История изменения risk score
  - [ ] Факторы влияющие на score
  - [ ] Рекомендации по снижению риска
  - **Effort:** 12-15 часов (frontend)

- [ ] **[Security]** Автоматические реакции на риск
  - [ ] Auto step-up при high risk
  - [ ] Auto device untrust при anomaly
  - [ ] Auto account lock при critical risk
  - [ ] Настраиваемые пороги риска
  - **Effort:** 15-18 часов

- [ ] **[Integration]** Интеграция IP‑репутации
  - [ ] Проверка IP через сервисы (AbuseIPDB, IPQualityScore)
  - [ ] Кеширование результатов
  - [ ] Увеличение risk score для known bad IPs
  - **Effort:** 8-10 часов
  - **Dependencies:** External API keys

- [ ] **[Feature]** Гео‑правила
  - [ ] Whitelist/blacklist стран
  - [ ] Auto-block logins from blacklisted countries
  - [ ] Alert на login из необычной страны
  - **Effort:** 10-12 часов

#### [ ] Дополнительные методы аутентификации

- [ ] **[Feature]** Push‑уведомления как 2FA
  - [ ] Интеграция с Firebase Cloud Messaging
  - [ ] Backend: генерация push challenges
  - [ ] Mobile app: прием и одобрение/отклонение
  - [ ] Timeout и fallback на другие методы
  - **Effort:** 25-30 часов
  - **Dependencies:** Mobile app, FCM

- [ ] **[Feature]** Аппаратные токены (FIDO U2F legacy)
  - [ ] Поддержка старых U2F токенов (не WebAuthn)
  - [ ] Compatibility layer
  - **Effort:** 12-15 часов

- [ ] **[Feature]** Вход по QR‑коду
  - [ ] Генерация QR с временным токеном
  - [ ] Mobile app сканирует и подтверждает
  - [ ] WebSocket для instant login
  - **Effort:** 20-25 часов

- [ ] **[Feature]** Passwordless‑аутентификация
  - [ ] Email magic links
  - [ ] SMS OTP для входа (без пароля)
  - [ ] WebAuthn для входа (без пароля)
  - **Effort:** 15-20 часов

- [ ] **[Feature]** Биометрическая аутентификация
  - [ ] Интеграция с платформенной биометрией (через WebAuthn)
  - [ ] Standalone биометрия (fingerprint/face на mobile)
  - **Effort:** 20-25 часов

#### [ ] Геофенсинг и геолокация

- [ ] **[Feature]** Разрешённые/запрещённые страны
  - [ ] User settings: allowed countries
  - [ ] Admin settings: organization-wide geo-fencing
  - [ ] Auto-block из запрещённых локаций
  - **Effort:** 10-12 часов

- [ ] **[Integration]** Проверка страны в `RiskCalculatorUtil`
  - [ ] Интеграция GeoIP lookup (MaxMind, IP-API)
  - [ ] Добавление country factor в risk calculation
  - [ ] Кеширование geo данных
  - **Effort:** 6-8 часов
  - **Dependencies:** `maxmind` или `node-geoip`

- [ ] **[Feature]** Политики геофенсинга
  - [ ] Настраиваемые правила (allow only EU, block specific countries)
  - [ ] Временные исключения (business travel)
  - [ ] Audit log для geo blocks
  - **Effort:** 12-15 часов

- [ ] **[Compliance]** Организационные правила
  - [ ] GDPR: только EU access
  - [ ] Compliance-driven geo restrictions
  - [ ] Legal hold capabilities
  - **Effort:** 15-18 часов

#### [ ] Соответствие требованиям (Compliance) и отчётность

- [ ] **[GDPR]** Инструменты соответствия GDPR
  - [ ] Data export (JSON): все данные пользователя
  - [ ] Right to be forgotten: полное удаление
  - [ ] Consent tracking
  - [ ] Data processing agreements
  - **Effort:** 20-25 часов

- [ ] **[Reports]** Формирование отчётов аудита
  - [ ] Configurable audit reports
  - [ ] Scheduled report generation
  - [ ] Email delivery
  - **Effort:** 12-15 часов

- [ ] **[Feature]** Политики хранения данных
  - [ ] Automatic archival старых security events
  - [ ] Automatic deletion после retention period
  - [ ] Configurable retention rules
  - **Effort:** 10-12 часов

- [ ] **[UI]** Дашборд compliance
  - [ ] Compliance status overview
  - [ ] Missing compliance items
  - [ ] Audit trail completeness
  - **Effort:** 15-18 часов

- [ ] **[Export]** Экспорт регуляторной отчётности
  - [ ] SOC 2 report templates
  - [ ] ISO 27001 evidence export
  - [ ] Custom compliance reports
  - **Effort:** 12-15 часов

#### [ ] Оптимизация производительности

- [ ] **[Cache]** Redis‑кеширование методов 2FA
  - [ ] Кеш активных методов пользователя
  - [ ] Cache invalidation при изменениях
  - [ ] TTL optimization
  - **Effort:** 6-8 часов

- [ ] **[DB]** Оптимизация запросов БД
  - [ ] Анализ slow queries
  - [ ] Добавление недостающих индексов
  - [ ] Query optimization
  - [ ] Connection pooling tuning
  - **Effort:** 8-10 часов

- [ ] **[Performance]** Стратегия пулов подключений
  - [ ] Prisma pool configuration
  - [ ] Redis connection pool
  - [ ] Load testing и tuning
  - **Effort:** 6-8 часов

- [ ] **[Scalability]** Горизонтальное масштабирование
  - [ ] Stateless design verification
  - [ ] Load balancer configuration
  - [ ] Redis cluster для shared state
  - [ ] Session affinity considerations
  - **Effort:** 12-15 часов

- [ ] **[Performance]** Оптимизация fingerprinting
  - [ ] Асинхронное вычисление fingerprint
  - [ ] Кеширование результатов
  - [ ] Batch processing
  - **Effort:** 6-8 часов

- [ ] **[CDN]** CDN для статических ресурсов
  - [ ] QR-коды TOTP через CDN
  - [ ] Email templates assets
  - **Effort:** 4-6 часов

---

## 🎯 Модуль: Account & Session Management

### ✅ Миграция на новую Prisma схему

- ✅ **[Schema]** Migrate User model to unified 2FA system
  - ✅ Removed deprecated fields: `isTotpEnabled`, `totpSecret`, `isOtpEnabled`, `otpSecret`
  - ✅ Added unified 2FA fields: `is2FAEnabled`, `preferred2FAMethod`, `require2FA`

- ✅ **[Model]** Update GraphQL User model with new Prisma fields
  - ✅ **RBAC**: `roles` (массив `EUserRole`)
  - ✅ **Unified 2FA**: `is2FAEnabled`, `preferred2FAMethod`, `require2FA`
  - ✅ **Risk Assessment**: `riskScore`, `lastRiskAssessAt`
  - ✅ **Security Audit**: `lastLoginAt`, `lastLoginIp`, `passwordChangedAt`
  - ✅ **Verification**: `phoneVerifiedAt`, `phoneBouncedAt`, `emailBouncedAt`, `isUnsubscribed`
  - ✅ **Soft Delete**: `deletedAt`

- ✅ **[Service]** Track `passwordChangedAt` on password change

- ✅ **[Service]** Track `lastLoginAt` and `lastLoginIp` on successful login

- ✅ **[GraphQL]** Enum registration for GraphQL schema
  - ✅ Import `EUserRole` and `E2FAMethod` from `@prisma/__generated__`
  - ✅ Register enums with `registerEnumType()`
  - ✅ Comprehensive descriptions for all enum values

- ✅ **[Types]** Fixed type conflicts between Prisma and GraphQL
  - ✅ Use Prisma enums as Single Source of Truth
  - ✅ Proper type casting: `as PrismaUser` for DB operations
  - ✅ GraphQL models use Prisma enums directly

---

### 🔴 HIGH: Критически важные задачи

#### [ ] Database Migration

- [ ] **[Migration]** Create Prisma migration script for production
  - [ ] Drop old columns: `isTotpEnabled`, `totpSecret`, `isOtpEnabled`, `otpSecret`
  - [ ] Add new columns: `is2FAEnabled`, `preferred2FAMethod`, `require2FA`, etc.
  - [ ] Data migration: move existing 2FA settings to `AuthenticationMethod` table
  - [ ] Test on staging environment
  - **Effort:** 6-8 часов
  - **Risk:** High (requires production data migration)

- [ ] **[Migration]** Rollback strategy
  - [ ] Create backup script for production data
  - [ ] Document rollback procedure
  - [ ] Test rollback on staging
  - **Effort:** 3-4 часа

#### [ ] Security Essentials

- [ ] **[Security]** Implement session invalidation on password change
  - [ ] Delete all Redis sessions except current one
  - [ ] GraphQL mutation: `changePassword` → auto invalidate sessions
  - [ ] Email notification about terminated sessions
  - **Effort:** 4-5 часов

- [ ] **[Security]** Send email notification on password change
  - [ ] Email template: "Your password was changed"
  - [ ] Include: timestamp, IP, device info
  - [ ] Include "Not you?" recovery link
  - **Effort:** 3-4 часа

- [ ] **[Security]** Implement rate limiting for login attempts
  - [ ] Use `@nestjs/throttler` or Redis-based
  - [ ] 5 failed attempts → 15 min lockout (IP-based)
  - [ ] 10 failed attempts → 1 hour lockout (user-based)
  - [ ] 20 failed attempts → 24 hour lockout + admin notification
  - [ ] Progressive delays (exponential backoff)
  - **Effort:** 8-10 часов
  - **Dependencies:** `@nestjs/throttler`

- [ ] **[Security]** Strengthen password requirements
  - [ ] Minimum 12 characters (current: 8)
  - [ ] Require: uppercase, lowercase, number, special char
  - [ ] Check against common passwords (zxcvbn)
  - [ ] Check against Have I Been Pwned API
  - [ ] Custom validator decorator
  - **Effort:** 5-6 часов
  - **Dependencies:** `zxcvbn`, `hibp` package

#### [ ] Account Recovery

- [ ] **[Feature]** "Forgot password" flow
  - [ ] GraphQL mutation: `requestPasswordReset(email: String!)`
  - [ ] Generate secure reset token (crypto.randomBytes)
  - [ ] Store in `Token` table with expiration (1 hour)
  - [ ] Send email with reset link
  - **Effort:** 6-8 hours

- [ ] **[Feature]** Password reset completion
  - [ ] GraphQL mutation: `resetPassword(token: String!, newPassword: String!)`
  - [ ] Validate token (not expired, not used)
  - [ ] Hash new password
  - [ ] Update `passwordChangedAt`
  - [ ] Invalidate all sessions
  - [ ] Mark token as used
  - **Effort:** 4-5 hours

- [ ] **[Security]** Password reset rate limiting
  - [ ] Max 3 reset requests per hour per email
  - [ ] Max 10 requests per hour per IP
  - **Effort:** 2-3 hours

---

### 🟠 MEDIUM: Важные улучшения

#### 🟡 Risk Scoring

- 🟡 **[Security]** Basic risk score calculation (foundation laid)
  - [ ] Login from new country: +30 points
  - [ ] Login from new device: +20 points
  - [ ] Multiple failed login attempts: +10 per attempt
  - [ ] Time since last login (>30 days): +15 points
  - [ ] Unusual login time (3-6 AM): +10 points
  - [ ] Update `riskScore` and `lastRiskAssessAt` fields
  - **Effort:** 12-15 часов

- [ ] **[Security]** Risk-based 2FA prompts
  - [ ] If `riskScore > 50` → always require 2FA (even on trusted device)
  - [ ] If `riskScore > 70` → require backup code or WebAuthn (no SMS/email)
  - [ ] Configurable thresholds
  - **Effort:** 6-8 часов

- [ ] **[Security]** Impossible travel detection
  - [ ] Calculate distance between last login location and current
  - [ ] If >500km in <1 hour → flag as impossible travel
  - [ ] Log security event: `IMPOSSIBLE_TRAVEL`
  - [ ] Auto step-up 2FA requirement
  - **Effort:** 10-12 часов
  - **Dependencies:** Geolocation library (haversine formula)

#### [ ] Security Event System

- [ ] **[Audit]** Complete security event logging
  - [ ] Log all login attempts (success/failure) → `SecurityEvent` table
  - [ ] Log password changes, email changes
  - [ ] Log 2FA operations (enable, disable, verify)
  - [ ] Include: IP, user agent, device ID, risk score
  - [ ] Auto-calculate event severity based on risk
  - **Effort:** 15-18 часов

- [ ] **[Admin]** Security event review dashboard
  - [ ] GraphQL query: filter by user, event type, severity, date range
  - [ ] Mutation: mark event as reviewed/resolved
  - [ ] Statistics: events by severity, trends over time
  - [ ] Auto-resolve low severity events after 30 days
  - **Effort:** 20-25 часов

- [ ] **[Alerting]** Critical security event notifications
  - [ ] Email admin on CRITICAL severity events
  - [ ] Slack/Discord webhook integration
  - [ ] Configurable alert rules (threshold-based)
  - [ ] Alert throttling (no spam)
  - **Effort:** 10-12 часов

#### [ ] Account Management

- [ ] **[Feature]** Email change confirmation
  - [ ] Send verification email to NEW address
  - [ ] Send notification to OLD address
  - [ ] Email change only completes after NEW email verified
  - [ ] Rollback mechanism if user didn't initiate change
  - [ ] Time window for rollback (24 hours)
  - **Effort:** 6-8 часов

- [ ] **[Feature]** Account deletion (GDPR compliance)
  - [ ] GraphQL mutation: `deleteAccount(password: String!)`
  - [ ] Soft delete with `deletedAt` timestamp
  - [ ] Hard delete after 30 days (cron job)
  - [ ] Export all user data as JSON before deletion
  - [ ] Email confirmation before deletion
  - **Effort:** 10-12 часов

- [ ] **[UX]** Profile completion tracking
  - [ ] Calculate profile completeness % (avatar, bio, phone verified, etc.)
  - [ ] GraphQL field on User: `profileCompleteness: Int`
  - [ ] Encouragement to complete profile
  - **Effort:** 3-4 часа

#### [ ] Session Management

- [ ] **[Feature]** Session expiration policy
  - [ ] Configurable TTL (default: 30 days) via env var
  - [ ] Auto-refresh on activity (sliding expiration)
  - [ ] Absolute expiration (max 90 days, even with activity)
  - [ ] Cron job: cleanup expired sessions
  - **Effort:** 6-8 часов

- [ ] **[Feature]** Session renewal mechanism
  - [ ] GraphQL mutation: `renewSession`
  - [ ] Generate new session ID (security best practice)
  - [ ] Transfer session data to new ID
  - [ ] Delete old session
  - **Effort:** 4-5 часов

- [ ] **[Admin]** View user sessions as admin
  - [ ] GraphQL query: `adminGetUserSessions(userId: ID!)`
  - [ ] Show all active sessions for any user
  - [ ] Mutation: `adminRevokeUserSession(sessionId: ID!)`
  - [ ] Audit log for admin actions
  - **Effort:** 4-5 часов

#### [ ] Email/SMS Reputation

- [ ] **[Integration]** Email bounce handling
  - [ ] Webhook from email service (SendGrid, AWS SES)
  - [ ] Update `emailBouncedAt` on hard bounce
  - [ ] Stop sending emails after 3 hard bounces
  - [ ] Soft bounce tracking (retry logic)
  - **Effort:** 8-10 часов

- [ ] **[Integration]** SMS bounce handling
  - [ ] Webhook from SMS service (Twilio)
  - [ ] Update `phoneBouncedAt` on delivery failure
  - [ ] Mark invalid phone numbers
  - [ ] Stop sending SMS to invalid numbers
  - **Effort:** 6-8 часов

- [ ] **[Feature]** Unsubscribe mechanism
  - [ ] Unsubscribe link in email footer
  - [ ] GraphQL mutation: `unsubscribeFromEmails`
  - [ ] Update `isUnsubscribed` flag
  - [ ] Still send critical emails (password reset, security alerts)
  - [ ] Preference center for granular control
  - **Effort:** 6-8 часов

#### [ ] Account Locking

- [ ] **[Security]** Enhanced account locking
  - [ ] Auto-lock after N failed login attempts
  - [ ] Store in `AccountLock` table (already exists in schema)
  - [ ] Auto-unlock after expiration time
  - [ ] Admin can manually unlock
  - [ ] Email notification on lock/unlock
  - [ ] GraphQL query: `isAccountLocked(email: String!): Boolean`
  - **Effort:** 8-10 часов

- [ ] **[Admin]** Account lock management
  - [ ] GraphQL query: `getLockedAccounts(limit: Int, offset: Int)`
  - [ ] Mutation: `adminUnlockAccount(userId: ID!)`
  - [ ] Mutation: `adminExtendLock(lockId: ID!, duration: Int!)`
  - [ ] Audit log for lock operations
  - **Effort:** 5-6 часов

---

### 🟢 LOW: Продвинутые возможности

#### [ ] Analytics & Monitoring

- [ ] **[Analytics]** User activity dashboard
  - [ ] GraphQL query: `myActivityHistory`
  - [ ] Login history with map visualization (frontend)
  - [ ] Device list with last seen timestamps
  - [ ] Security events timeline
  - [ ] Export activity data (CSV, JSON)
  - **Effort:** 15-20 часов (backend + frontend)

- [ ] **[Analytics]** Admin analytics
  - [ ] Total users, active users, new signups
  - [ ] 2FA adoption rate
  - [ ] Most common security events
  - [ ] Geographic distribution of users
  - **Effort:** 12-15 часов

#### [ ] Location-based Features

- [ ] **[Feature]** Detect login from new country
  - [ ] GeoIP lookup (MaxMind GeoLite2 or IP-API)
  - [ ] Store user's typical countries in profile
  - [ ] Flag logins from unusual countries
  - [ ] Security event: `UNUSUAL_LOCATION`
  - **Effort:** 8-10 часов
  - **Dependencies:** `maxmind` or `node-geoip` package

- [ ] **[Security]** "Unusual Location" detection
  - [ ] Define "usual" locations based on history
  - [ ] Alert on login from new city/country
  - [ ] Email notification with map
  - **Effort:** 10-12 часов

#### [ ] Advanced Authentication

- [ ] **[Feature]** Social login (OAuth2)
  - [ ] Google OAuth integration
  - [ ] GitHub OAuth integration
  - [ ] Facebook OAuth (optional)
  - [ ] Link social accounts to existing account
  - [ ] Disconnect social accounts
  - **Effort:** 20-25 часов
  - **Dependencies:** `@nestjs/passport`, `passport-google-oauth20`, `passport-github2`

- [ ] **[Feature]** Passwordless login via magic link
  - [ ] GraphQL mutation: `sendMagicLink(email: String!)`
  - [ ] Generate one-time token
  - [ ] Send email with login link
  - [ ] Auto-login on link click
  - [ ] Token expires after 15 minutes
  - **Effort:** 10-12 часов

- [ ] **[Feature]** Account merge functionality
  - [ ] Merge duplicate accounts (same email)
  - [ ] Transfer data from old account to new
  - [ ] Admin-initiated only (complex operation)
  - [ ] Comprehensive audit log
  - **Effort:** 12-15 часов

#### [ ] Performance Optimization

- [ ] **[Performance]** Optimize session listing query
  - [ ] Add pagination (limit, offset)
  - [ ] Use Redis sorted sets for session ordering
  - [ ] Cursor-based pagination for GraphQL
  - **Effort:** 6-8 часов

- [ ] **[Performance]** Database query optimization
  - [ ] Add missing indexes (analyze slow queries)
  - [ ] Optimize N+1 queries with Prisma includes
  - [ ] Connection pool tuning
  - **Effort:** 8-10 часов

- [ ] **[Cache]** Redis caching for user profile
  - [ ] Cache frequently accessed user data
  - [ ] Cache invalidation on updates
  - [ ] TTL configuration
  - **Effort:** 6-8 часов

#### [ ] Compliance

- [ ] **[GDPR]** Data export functionality
  - [ ] GraphQL query: `exportMyData`
  - [ ] Generate JSON with all user data
  - [ ] Include: profile, sessions, 2FA methods, audit logs, security events
  - [ ] Email download link
  - **Effort:** 10-12 часов

- [ ] **[GDPR]** Data deletion (right to be forgotten)
  - [ ] Full cascade deletion of user data
  - [ ] Remove from all tables
  - [ ] Anonymize audit logs (keep for compliance)
  - [ ] Confirmation required
  - **Effort:** 8-10 часов

---

## 🎯 Модуль: Infrastructure & DevOps

### 🔴 HIGH: Критически важные для запуска

#### [ ] Database

- [ ] **[DB]** Connection pooling optimization
  - [ ] Tune Prisma pool size (`connection_limit`)
  - [ ] Connection timeout configuration
  - [ ] Monitor pool utilization
  - **Effort:** 4-5 часов

- [ ] **[DB]** Database indexes verification
  - [ ] Audit all `@@index` directives in schema
  - [ ] Add missing indexes (e.g., `sessions.userId`, `securityEvents.userId`)
  - [ ] Analyze query performance with `EXPLAIN`
  - [ ] Remove redundant indexes
  - **Effort:** 6-8 часов

- [ ] **[DB]** Backup automation
  - [ ] Daily automated PostgreSQL backups
  - [ ] Backup to S3 or similar
  - [ ] Retention policy (30 days)
  - [ ] Automated restore testing (weekly)
  - **Effort:** 8-10 часов

#### [ ] Redis

- [ ] **[Cache]** Redis cluster setup (high availability)
  - [ ] Redis Sentinel for automatic failover
  - [ ] Master-replica configuration
  - [ ] Connection retry logic
  - **Effort:** 10-12 часов

- [ ] **[Monitoring]** Redis key expiration monitoring
  - [ ] Track memory usage
  - [ ] Alert on high memory consumption (>80%)
  - [ ] Eviction policy configuration
  - **Effort:** 5-6 часов

#### [ ] Monitoring & Observability

- [ ] **[Monitoring]** Application metrics (Prometheus)
  - [ ] Install `@willsoto/nestjs-prometheus`
  - [ ] Metrics: request rate, error rate, latency (histograms)
  - [ ] Custom metrics: login success/failure, 2FA verification rate
  - [ ] Grafana dashboards
  - **Effort:** 12-15 часов
  - **Dependencies:** `@willsoto/nestjs-prometheus`, Prometheus, Grafana

- [ ] **[Logging]** Structured logging
  - [ ] Replace `console.log` with Winston or Pino
  - [ ] JSON log format
  - [ ] Log levels (error, warn, info, debug)
  - [ ] Correlation IDs for request tracing
  - [ ] Log aggregation (ELK stack or Datadog)
  - **Effort:** 10-12 часов
  - **Dependencies:** `winston` or `pino`

- [ ] **[Alerts]** Error tracking (Sentry)
  - [ ] Sentry integration
  - [ ] Alert on critical errors
  - [ ] Error grouping and deduplication
  - [ ] Source maps for stack traces
  - [ ] Release tracking
  - **Effort:** 5-6 часов
  - **Dependencies:** `@sentry/node`

#### [ ] CI/CD

- [ ] **[DevOps]** GitHub Actions workflow
  - [ ] Run tests on every PR
  - [ ] Lint and type-check
  - [ ] Build Docker image
  - [ ] Deploy to staging on merge to `develop`
  - [ ] Deploy to production on merge to `main`
  - **Effort:** 10-12 часов

- [ ] **[DevOps]** Automated database migrations
  - [ ] Run `prisma migrate deploy` in CI/CD
  - [ ] Rollback on migration failure
  - [ ] Migration status check before deployment
  - **Effort:** 5-6 часов

---

### 🟠 MEDIUM: Важные улучшения инфраструктуры

#### [ ] Security

- [ ] **[Security]** Secrets management
  - [ ] Use AWS Secrets Manager or HashiCorp Vault
  - [ ] Rotate secrets automatically
  - [ ] Never commit secrets to git
  - [ ] Environment-specific secrets
  - **Effort:** 8-10 часов

- [ ] **[Security]** Network security
  - [ ] VPC configuration (private subnets for DB/Redis)
  - [ ] Security groups (whitelist only necessary ports)
  - [ ] WAF (Web Application Firewall)
  - **Effort:** 10-12 часов

#### [ ] Performance

- [ ] **[Performance]** CDN for static assets
  - [ ] Serve avatar images via CDN
  - [ ] Serve email template assets
  - [ ] CloudFlare or AWS CloudFront
  - **Effort:** 5-6 часов

- [ ] **[Scalability]** Horizontal scaling
  - [ ] Load balancer configuration (AWS ALB, nginx)
  - [ ] Session affinity (sticky sessions) or Redis-backed sessions
  - [ ] Auto-scaling groups
  - [ ] Health checks for instances
  - **Effort:** 10-12 часов

#### [ ] Deployment

- [ ] **[DevOps]** Docker optimization
  - [ ] Multi-stage builds (smaller images)
  - [ ] Layer caching optimization
  - [ ] `.dockerignore` configuration
  - [ ] Security scanning (Trivy, Snyk)
  - **Effort:** 6-8 часов

- [ ] **[DevOps]** Environment configuration
  - [ ] Separate configs for dev/staging/production
  - [ ] Environment validation on startup
  - [ ] Config documentation (`.env.example`)
  - **Effort:** 4-5 часов

---

### 🟢 LOW: Продвинутая инфраструктура

#### [ ] Advanced DevOps

- [ ] **[DevOps]** Blue-green deployments
  - [ ] Zero-downtime deployments
  - [ ] Quick rollback capability
  - [ ] Traffic splitting for gradual rollout
  - **Effort:** 12-15 часов

- [ ] **[DevOps]** Infrastructure as Code
  - [ ] Terraform for AWS resources
  - [ ] Version control for infrastructure
  - [ ] Automated provisioning
  - **Effort:** 15-20 часов

#### [ ] Disaster Recovery

- [ ] **[DR]** Disaster recovery plan
  - [ ] Documented recovery procedures
  - [ ] RTO/RPO definitions
  - [ ] Regular DR drills
  - **Effort:** 10-12 часов

- [ ] **[DR]** Multi-region setup
  - [ ] Database replication across regions
  - [ ] Redis replication
  - [ ] Failover procedures
  - **Effort:** 20-25 часов

---

## 🎯 Модуль: Documentation

### ✅ Существующая документация

- ✅ GraphQL API documentation (`docs/2fa/GRAPHQL_API.md`)
- ✅ WebAuthn integration guide (`docs/2fa/WEBAUTHN.md`)
- ✅ Admin operations guide (`docs/2fa/ADMIN_OPERATIONS.md`)
- ✅ Cron jobs documentation (`docs/2fa/CRON_JOBS.md`)
- ✅ RBAC documentation (`docs/rbac/`)
- ✅ SimpleWebAuthn example (`docs/webauthn-simplewebauthn-example.md`)

---

### 🔴 HIGH: Критически важная документация

#### [ ] API Documentation

- [ ] **[Docs]** Complete GraphQL API reference
  - [ ] Auto-generate from schema (Spectaql, GraphQL Voyager)
  - [ ] Examples for all queries/mutations
  - [ ] Error code reference (all possible errors)
  - [ ] Rate limiting documentation
  - **Effort:** 10-12 часов

- [ ] **[Docs]** Authentication flow diagrams
  - [ ] Registration flow (Mermaid diagram)
  - [ ] Login flow (with/without 2FA)
  - [ ] 2FA setup flows (TOTP, OTP, WebAuthn)
  - [ ] Password reset flow
  - [ ] Step-up authentication flow
  - **Effort:** 8-10 часов

- [ ] **[Docs]** Environment variables reference
  - [ ] All required variables with descriptions
  - [ ] Optional variables with defaults
  - [ ] Examples for dev/staging/production
  - [ ] Validation rules
  - **Effort:** 4-5 часов

#### [ ] Deployment Documentation

- [ ] **[Docs]** Production deployment guide
  - [ ] Docker setup (docker-compose example)
  - [ ] Kubernetes manifests (if applicable)
  - [ ] Environment configuration steps
  - [ ] Database migration steps
  - [ ] Health checks configuration
  - [ ] SSL/TLS setup
  - **Effort:** 10-12 часов

- [ ] **[Docs]** Disaster recovery procedures
  - [ ] Database backup/restore steps
  - [ ] Redis backup/restore steps
  - [ ] Rollback procedures
  - [ ] Contact information for emergencies
  - **Effort:** 6-8 часов

---

### 🟠 MEDIUM: Developer Experience

#### [ ] Developer Guides

- [ ] **[Docs]** Frontend integration guide
  - [ ] React examples for all auth flows
  - [ ] Apollo Client setup and configuration
  - [ ] Error handling patterns
  - [ ] TypeScript types generation from GraphQL
  - [ ] Best practices
  - **Effort:** 12-15 часов

- [ ] **[Docs]** Testing guide
  - [ ] How to run unit tests
  - [ ] How to run integration tests
  - [ ] How to run E2E tests
  - [ ] Writing new tests (examples)
  - [ ] Mocking strategies
  - **Effort:** 6-8 часов

- [ ] **[Docs]** Architecture Decision Records (ADRs)
  - [ ] Why unified 2FA? (vs separate tables)
  - [ ] Why Redis for sessions? (vs DB)
  - [ ] Why Prisma? (vs TypeORM)
  - [ ] Why GraphQL? (vs REST)
  - **Effort:** 8-10 часов

#### [ ] Tools & Resources

- [ ] **[Docs]** Postman/Insomnia collection
  - [ ] All GraphQL operations
  - [ ] Pre-request scripts for authentication
  - [ ] Environment variables setup
  - [ ] Example requests/responses
  - **Effort:** 5-6 часов

- [ ] **[Docs]** Troubleshooting guide
  - [ ] Common errors and solutions
  - [ ] Debugging tips
  - [ ] FAQ
  - **Effort:** 6-8 часов

---

### 🟢 LOW: Дополнительная документация

#### [ ] Advanced Documentation

- [ ] **[Docs]** Video tutorials
  - [ ] Project setup walkthrough
  - [ ] 2FA integration tutorial
  - [ ] Admin panel tour
  - [ ] Deployment walkthrough
  - **Effort:** 15-20 часов

- [ ] **[Docs]** OpenAPI/Swagger spec
  - [ ] Generate from GraphQL schema (if possible)
  - [ ] Alternative to GraphQL Playground
  - **Effort:** 6-8 часов

- [ ] **[Docs]** Security best practices
  - [ ] Password policies
  - [ ] Session management
  - [ ] 2FA recommendations
  - [ ] Common vulnerabilities to avoid
  - **Effort:** 6-8 часов

---

## 🔵 Definition of Done (Критерии готовности)

### Code Quality

- [ ] **TypeScript:** Нет ошибок компиляции, нет `any`, нет `@ts-ignore`
- [ ] **ESLint:** Нет warnings, все правила соблюдены
- [ ] **Prettier:** Код отформатирован
- [ ] **Code Review:** Код прошёл ревью минимум одним другим разработчиком
- [ ] **TODOs:** Все `TODO` комментарии удалены или преобразованы в задачи

### Testing

- [ ] **Unit Tests:** Покрытие ≥80% для новых сервисов и утилит
- [ ] **Integration Tests:** Ключевые сценарии покрыты (API endpoints, DB transactions)
- [ ] **E2E Tests:** Критические user flows протестированы (login, 2FA, password reset)
- [ ] **Edge Cases:** Тесты покрывают граничные случаи и error paths
- [ ] **Performance Tests:** Load testing для критичных endpoint'ов (>100 req/s)

### Security

- [ ] **Rate Limiting:** Настроены лимиты для всех публичных endpoint'ов
- [ ] **Validation:** Все входящие данные валидируются (class-validator)
- [ ] **Encryption:** Чувствительные данные зашифрованы (AES-256-GCM)
- [ ] **Audit Logging:** Все критические операции логируются в `SecurityEvent` или `AuditLog`
- [ ] **Secrets:** Нет hardcoded secrets, все через environment variables
- [ ] **Dependencies:** Нет known vulnerabilities (`npm audit`)

### Observability

- [ ] **Logging:** Все errors логируются с достаточным контекстом
- [ ] **Metrics:** Ключевые метрики собираются (Prometheus)
- [ ] **Alerts:** Настроены alerts для критических событий
- [ ] **Tracing:** Correlation IDs для request tracing

### Documentation

- [ ] **JSDoc:** Все публичные методы, классы, интерфейсы документированы (English)
- [ ] **GraphQL Descriptions:** Все queries, mutations, types имеют descriptions
- [ ] **README:** Обновлён с новой функциональностью
- [ ] **CHANGELOG:** Добавлена запись по шаблону (Step X format)
- [ ] **API Docs:** GraphQL schema documentation актуальна
- [ ] **Migration Guide:** Если breaking changes, есть migration guide

### Performance

- [ ] **Response Time:** API endpoints < 500ms (p95)
- [ ] **Database Queries:** Нет N+1 queries, все индексы на месте
- [ ] **Caching:** Используется кеширование где применимо (Redis)
- [ ] **Cron Jobs:** Выполняются за < 5 секунд (или асинхронно для длинных задач)

### Deployment

- [ ] **Environment Variables:** Все новые переменные задокументированы в `.env.example`
- [ ] **Database Migration:** Prisma migration создана и протестирована
- [ ] **Rollback Plan:** Есть план отката изменений
- [ ] **Health Checks:** Новые сервисы интегрированы в health checks
- [ ] **CI/CD:** Все тесты проходят в CI

---

## 📅 Recommended Implementation Phases

### **Phase 1: Production Readiness (4-6 weeks)** 🔴

**Focus:** Стабилизация существующего кода + критичная функциональность

**Week 1-2: Database & Core Security**
- ✅ Prisma migration script (HIGH risk, requires careful planning)
- ✅ Rate limiting для login endpoints
- ✅ Session invalidation on password change
- ✅ Password reset flow (forgot password)
- ✅ Enhanced password requirements

**Week 3-4: 2FA Core Implementation**
- ✅ TOTP full implementation (QR code generation, verification)
- ✅ OTP code expiration & anti-reuse (Redis)
- ✅ WebAuthn challenge validation (secure implementation)
- ✅ Backup codes validation improvements
- ✅ Rate limiting для 2FA operations

**Week 5-6: Testing & Monitoring**
- ✅ Complete unit test coverage (>80%)
- ✅ Integration tests для всех 2FA flows
- ✅ E2E tests для critical paths
- ✅ Prometheus metrics setup
- ✅ Sentry error tracking
- ✅ Production deployment guide

**Deliverable:** Production-ready authentication system ✅

---

### **Phase 2: Advanced Security & Risk (3-4 weeks)** 🟠

**Focus:** Enterprise-grade security features

**Week 7-8: Risk Assessment**
- ✅ Basic risk score calculation implementation
- ✅ Impossible travel detection
- ✅ Risk-based 2FA prompts
- ✅ Enhanced account locking system
- ✅ Complete security event logging

**Week 9-10: Admin & Monitoring**
- ✅ Security event dashboard (GraphQL API)
- ✅ Admin password reset functionality
- ✅ Admin security events review
- ✅ Audit log export
- ✅ Alert system for critical events

**Deliverable:** Enterprise-grade security monitoring ✅

---

### **Phase 3: User Experience & Recovery (2-3 weeks)** 🟠

**Focus:** Улучшение UX и recovery flows

**Week 11-12: Device Trust & Notifications**
- ✅ Enhanced device fingerprinting
- ✅ Trusted device management UI (GraphQL)
- ✅ NotificationService для security events
- ✅ Email notifications (password change, new device, etc.)
- ✅ Step-up authentication для sensitive operations

**Week 13: Recovery & Polish**
- ✅ Account recovery flow (2FA lost access)
- ✅ Email/SMS bounce handling
- ✅ Bug fixes и edge cases
- ✅ Performance optimization

**Deliverable:** Seamless user experience ✅

---

### **Phase 4: Compliance & Scale (4-6 weeks)** 🟢

**Focus:** Enterprise-scale и compliance

**Week 14-15: Compliance**
- ✅ GDPR data export
- ✅ GDPR data deletion
- ✅ 2FA enforcement policies (admin-driven)
- ✅ Compliance audit reports

**Week 16-17: Advanced Features**
- ✅ ML-based risk scoring (if applicable)
- ✅ Push notification 2FA (if mobile app exists)
- ✅ Social login (OAuth2)
- ✅ Passwordless authentication

**Week 18-19: Infrastructure & DevOps**
- ✅ Redis cluster setup
- ✅ Database optimization (indexes, pooling)
- ✅ CI/CD pipeline enhancements
- ✅ Blue-green deployments
- ✅ Infrastructure as Code (Terraform)

**Deliverable:** Enterprise-scale production system ✅

---

## 📊 Effort Summary by Category

| Category | 🔴 HIGH | 🟠 MEDIUM | 🟢 LOW | **TOTAL** |
|----------|---------|-----------|--------|-----------|
| **2FA System** | 60-70h | 80-90h | 120-140h | **260-300h** |
| **Account & Session** | 45-55h | 60-70h | 70-85h | **175-210h** |
| **Security & Risk** | 70-80h | 60-70h | 140-160h | **270-310h** |
| **Admin & Monitoring** | 25-30h | 35-40h | 50-60h | **110-130h** |
| **Testing** | 55-65h | 18-24h | 25-30h | **98-119h** |
| **Documentation** | 35-45h | 25-35h | 30-40h | **90-120h** |
| **Infrastructure** | 55-65h | 20-25h | 30-40h | **105-130h** |
| **TOTAL** | **345-410h** | **298-354h** | **465-555h** | **1108-1319h** |

**Timeline Estimates:**
- 🔴 **HIGH Priority:** ~7-9 weeks (full-time developer)
- 🟠 **MEDIUM Priority:** ~6-8 weeks
- 🟢 **LOW Priority:** ~10-12 weeks
- **Full Implementation:** ~23-29 weeks (5.5-7 months)

**Team Recommendations:**
- **1 developer:** ~6-7 months для полной реализации
- **2 developers:** ~3-4 месяца (parallel work on modules)
- **3 developers:** ~2-3 месяца (optimal team size)

---

## 🎯 Key Success Metrics

**Security Metrics:**
- 🎯 2FA adoption rate: **>70%**
- 🎯 WebAuthn/Passkey adoption: **>30%**
- 🎯 Failed login rate: **<5%**
- 🎯 Average user risk score: **<30**
- 🎯 Security event resolution time: **<24h** (for HIGH severity)

**Performance Metrics:**
- 🎯 Login latency: **<500ms** (p95)
- 🎯 2FA verification: **<300ms** (p95)
- 🎯 Session lookup: **<50ms** (p95)
- 🎯 GraphQL query response: **<200ms** (p95)

**Reliability Metrics:**
- 🎯 Uptime: **>99.9%**
- 🎯 Error rate: **<0.1%**
- 🎯 Test coverage: **>80%**
- 🎯 Mean time to recovery (MTTR): **<1h**

**User Experience Metrics:**
- 🎯 Password reset completion rate: **>80%**
- 🎯 2FA setup completion rate: **>60%**
- 🎯 Support tickets related to auth: **<5%** of total

---

## 🚀 Next Immediate Actions (Priority Order)

1. **[CRITICAL]** Create and test Prisma migration script (6-8h)
2. **[CRITICAL]** Implement login rate limiting (8-10h)
3. **[HIGH]** Complete TOTP implementation (6-8h)
4. **[HIGH]** Implement OTP expiration & anti-reuse (3-4h)
5. **[HIGH]** WebAuthn challenge validation (4-5h)
6. **[HIGH]** Session invalidation on password change (4-5h)
7. **[HIGH]** Password reset flow (10-13h)
8. **[MEDIUM]** Basic risk score calculation (12-15h)
9. **[MEDIUM]** Complete security event logging (15-18h)
10. **[MEDIUM]** NotificationService implementation (10-12h)

**Estimated time for top 10 priorities:** ~80-100 hours (2-2.5 weeks full-time)

---

**Generated:** 2025-01-30  
**Last Updated:** 2025-01-30  
**Next Review:** 2025-02-15  
**Maintained by:** MedicHub Engineering Team

---