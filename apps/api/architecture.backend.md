# Архитектура backend (шаблон для повторного использования)

Документ описывает текущую архитектуру `apps/api` и то, как перенести её как шаблон в другое приложение.

## Технологический стек
- Node.js 20+ с TypeScript 5.8, NestJS 11 (HTTP на Express 5, GraphQL на Apollo driver).
- GraphQL code-first (схема генерируется в `src/core/graphql/schema.gql`), загрузка файлов через `graphql-upload-minimal`.
- PostgreSQL через Prisma 6 (`prisma/schema.prisma` + миграции), Redis 5 для сессий, rate limit и кешей.
- i18n на i18next (typed-обёртки), валидация через `class-validator` + глобальные pipes.
- Почта: Nest Mailer + React Email + провайдеры Brevo/SendGrid/SMTP; SMS через Twilio (core/provider).
- Инфраструктура: Docker файлы в `docker/`, Bun/Node entrypoints, Vercel адаптер, Jest unit/e2e.

## Каркас приложения
- `src/main.ts` — bootstrap: init i18n, создание Nest приложения, Helmet, i18n middleware, JSON + fallback языка, cookie-parser, загрузка файлов, глобальные ValidationPipe, сессии на Redis (`sessionConfig`), CORS, запуск по `SERVER_PORT`.
- `src/core/core.module.ts` — собирает всё приложение:
  - `ConfigModule` (env как источник конфигурации).
  - `GraphQLModule` с контекстом `{ req, res, language }`.
  - `ScheduleModule` (планировщик).
  - Глобальные инфраструктурные модули: `I18nModule`, `RedisModule`, `PrismaModule`, `ProviderModule` (почта/SMS), `UrlModule`.
  - Галерея бизнес‑модулей: `SecurityModule`, `Auth` (account/recovery/session/2fa/verification), `NotificationModule`, `SecurityEventModule`, `RbacModule`.
  - Глобальные кросс-срезы: `I18nValidationPipe` как `APP_PIPE`, `RateLimitGuard` как `APP_GUARD`, `GraphQLLoggerMiddleware` через consumer.
- Базовый сервис `CoreService` даёт типизированный доступ к Prisma/Redis/Config/i18n и готовые helper’ы для работы с Redis (строки, JSON, sets, ttl).

## Слои и директории
- `src/core/*` — инфраструктура и общие сервисы:
  - `config/` — функции конфигурации (GraphQL, Helmet, session, mailer, app, i18n).
  - `i18n/` — сервис, декораторы (`@Lang`), typed-ключи переводов.
  - `prisma/` — модуль и seed, глобальный `PrismaService`.
  - `redis/` — глобальный `RedisService`.
  - `provider/` — модули почты (React Email + Brevo/SendGrid/SMTP) и SMS.
  - `middleware/` — GraphQL logger.
- `src/shared/*` — переиспользуемые элементы:
  - `decorators/` (`@Authorization`, `@Authorized`, `@UserAgent`, `@Lang` и др), `guards/` (GraphQL auth guard), `pipes/` (валидация файлов), `middlewares/` (raw body), `utils/` (hash/token/ms/session metadata/errors/url).
- `src/modules/*` — бизнес-модули. Внутри типовой разрез: `dtos/`, `models/`, `services/`, `resolvers/`, плюс `constants/`, `guards/`, `types/`, `__tests__/` при необходимости.
- `prisma/` — схема и миграции; `emails/` — React Email шаблоны; `docker/` — dev/prod образы и entrypoints.

## Поток запроса
1. Express middleware цепочка из `main.ts`: Helmet → i18n handler → JSON body + language fallback → cookie-parser → GraphQL upload → глобальные ValidationPipe → session middleware (Redis store) → CORS.
2. Nest → `RateLimitGuard` (Redis sliding window) для всех маршрутов.
3. GraphQL слой: резолвер → сервис фичи → инфраструктура (Prisma, Redis, Mail/SMS) → обратная дорога к клиенту. Контекст несёт `req/res/language`, поэтому декораторы (`@Lang`, `@UserAgent`) работают в резолверах.
4. Логи GraphQL проходят через `GraphQLLoggerMiddleware`; валидационные сообщения локализуются `I18nValidationPipe`.

## Ключевые бизнес-модули (можно брать как шаблоны)
- **Auth**: `account` (регистрация/удаление), `session` (логин/логаут, список/инвалидация сессий в Redis), `recovery` (сброс пароля через токены), `verification` (email‑токены и подтверждение), `2fa` (TOTP, backup codes, WebAuthn — хранение в Prisma + токены в Redis).
- **Security**: `rate-limit` (Redis ZSET sliding window, whitelist/blacklist, декораторы для разных лимитов), `account-lock` (счётчик неудачных логинов, блокировки на TTL), подключено глобально.
- **Security Event**: аудит действий/рисков с расчётом score, хранение в `securityEvent` таблице Prisma, фильтрация/резолв.
- **Notification** (глобальный): отправка security/2FA/админ уведомлений через Mail/SMS, приоритет каналов, дедупликация в Redis, трекинг отправок.
- **RBAC**: простые декораторы/guards для проверки ролей/прав.

## Хранилища и конфигурации
- Env‑ключи находятся в `.env`, читаются `ConfigService`; `module-alias` привязывает `@/` к `dist`.
- Сессии: `express-session` + `connect-redis`, префикс и cookie-настройки из `SESSION_*`, метаданные устройства/IP собираются в `shared/utils/session-metadata.util.ts`.
- Структура Prisma: пользователи (`User`), факторы MFA, recovery tokens, security events и др. Миграции лежат в `prisma/migrations`.
- i18n: переводы в `src/core/i18n/locales`, default язык из `DEFAULT_LANGUAGE`, middleware кладёт `req.language`.
- Почтовые шаблоны: `emails/*` на React Email; отправка через `core/provider/mail/mail.service.ts` с fallback между Brevo/SendGrid/SMTP.

## Как использовать как шаблон в новом проекте
1. Старт: создайте каркас NestJS, подключите `module-alias`, скопируйте `main.ts` и `core/core.module.ts` с цепочкой middleware/guards/pipes.
2. Инфраструктура: перенесите `core/config`, `core/i18n`, `core/prisma`, `core/redis`, `core/provider`, прожмите свои env-ключи (`GRAPHQL_PREFIX`, `SESSION_*`, `MAIL_*`, `REDIS_URL`, `POSTGRES_URL` и др).
3. Базовый слой: используйте `CoreService` как родителя для сервисов, чтобы иметь Prisma/Redis/Config/i18n без повторяющегося кода.
4. Фичи: создавайте модули по шаблону `dtos/models/resolvers/services/constants/types`, держите резолверы тонкими, а бизнес‑логику в сервисах. Общие декораторы и guards кладите в `shared`.
5. Безопасность: подключите `SecurityModule` глобально, расставляйте rate‑limit декораторы и используйте `AccountLockService` в аутентификации; пишите аудит через `SecurityEventService`.
6. Интеграции: используйте `NotificationService` для всех исходящих сообщений (Mail/SMS), чтобы централизовано управлять дедупликацией и лимитами.
7. CI/Runtime: собирайте `nest build`, запускайте миграции `prisma migrate deploy`, прогоняйте тесты `jest`/`test:e2e`; для Docker используйте базовые `Dockerfile.dev/ prod` из `docker/`.

Такой разрез позволяет переносить основу (core/shared/security/notification) без переписывания и добавлять новые домены, следуя одному и тому же паттерну модуль → сервис → резолвер.
