# Анализ бэкенд кодовой базы: Medic Hub API

## 📁 Структура проекта

```
apps/api
├── docker/
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   ├── entrypoint.dev.sh
│   ├── entrypoint.prod.sh
│   ├── entrypoint.sh
│   └── wait-for-it.sh
├── emails/
│   ├── verification-email.tsx
│   └── verification-email-v1.tsx
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   │   └── 20250929124400_29092025_init/
│   │       └── migration.sql
│   └── __generated__/…
├── src/
│   ├── main.ts
│   ├── core/
│   │   ├── core.module.ts
│   │   ├── index.ts
│   │   ├── config/
│   │   ├── graphql/
│   │   ├── i18n/
│   │   ├── prisma/
│   │   └── redis/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── account/
│   │   │   └── session/
│   │   └── lib/
│   │       └── mail/
│   └── shared/
│       ├── decorators/
│       ├── guards/
│       ├── middlewares/
│       ├── pipes/
│       ├── types/
│       └── utils/
├── scripts/
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .env, package.json, tsconfig.json, vercel.json, bun.lock, api.zip
```

- `docker/` — многоступенчатые образы: dev-окружение на `oven/bun` с hot-reload (`CHOKIDAR_USEPOLLING`, `WATCHPACK_POLLING`) и prod-образ, который собирается Bun’ом и запускается на Node. `entrypoint.dev.sh` автоматически вызывает `prisma generate`, `entrypoint.prod.sh` ждёт базу через `wait-for-it.sh`.
- `emails/` — React Email шаблоны, отдельный `verification-email-v1.tsx` оставлен как дизайнерский эксперимент. Основной шаблон подключён в Nest-модуле.
- `prisma/` — схема (`schema.prisma`) с `binaryTargets` для разных окружений, миграции, сгенерированные клиенты (`client.js`, `edge.js`, WebAssembly-движок).
- `src/main.ts` — кастомный bootstrap: загрузка переменных окружения, инициация i18n, настройка middleware-цепочки (i18n, JSON-body, Accept-Language fallback, cookie-parser, `graphqlUploadExpress`, глобальный `ValidationPipe`, middleware сессий, CORS) и запуск `CoreModule`.
- `src/core/` — инфраструктурный слой:
  - `config/` — фабрики конфигурации (`app.config.ts`, `session.config.ts`, `mailer.config.ts`, `graphql.config.ts`, `i18n.config.ts`, `paths.config.ts`). Здесь же вычисляются константы (`CLIENT_URL`, `SESSION_MAX_AGE`, `MAIL_USE_SERVICE` и т.д.).
  - `graphql/` — сохранённая схема GraphQL (генерируется code-first подходом).
  - `i18n/` — глобальный модуль локализаций с typed-хелперами, логгером пропущенных ключей, декоратором `@Lang`.
  - `prisma/` и `redis/` — глобальные провайдеры клиентов БД и Redis; административные классы отмечены `@Global`.
- `src/modules/` — предметные области:
  - `auth/account` — DTO (`CreateAccountInput`), модель `User` для GraphQL, сервис/резолвер и тесты; в `test` папке лежат устаревшие сценарии.
  - `auth/session` — логин/логаут, чтение текущей и сторонних сессий, генерация метаданных устройств, интеграция с почтой.
  - `lib/mail` — модуль почты (`MailService`, интеграции с Brevo/SendGrid, React Email шаблоны, типизированные словари).
- `src/shared/` — общие компоненты:
  - `decorators/` — `Authorization()` (оборачивает `GqlAuthGuard`), `Authorized` (получение полей пользователя), `UserAgent`, `Lang`, `IsPasswordMatchingConstraint` (валидация совпадения паролей, пока не используется).
  - `guards/` — `GqlAuthGuard` проверяет сессию и подтягивает пользователя из Prisma.
  - `middlewares/` — `RawBodyMiddleware` для чтения необработанного тела (ещё не подключён в `main.ts`/`CoreModule`).
  - `pipes/` — `FileValidationPipe` валидирует загружаемые файлы (формат, размер, повторное использование стрима).
  - `types/` — расширения `express-session`, контекст GraphQL, типы метаданных сессии.
  - `utils/` — парсинг ошибок (`errors/*`), парсер интервалов (`ms.util.ts`), генерация токенов (`generate-token.util.ts`), работа с сессиями (`session.util.ts`, `session-metadata.util.ts`), проверка окружения (`is-dev.util.ts`), конверсия строк в boolean (`parse-boolean.util.ts`).
- `scripts/` — пока пустая заготовка под вспомогательные утилиты.
- `test/` — шаблонные e2e-тесты Nest, рассчитанные на `AppModule` (сейчас отсутствует).
- Корень содержит `.env` с секретами, конфиги ESLint/Prettier/TS, `bun.lock` (фиксирует lockfile Bun), `vercel.json` (маршрутизация на Vercel), `api.zip` (архив с билдом?) и другие служебные файлы.

Приложение — модульный монолит на NestJS. `module-alias/register` в `core.module.ts` мапит `@/* → dist/*`, что позволяет использовать одинаковые алиасы на этапе сборки и выполнения. `CoreModule` агрегирует инфраструктуру (`ConfigModule`, `GraphQLModule`, `PrismaModule`, `RedisModule`, `MailModule`, `I18nModule`) и бизнес-модули (`AccountModule`, `SessionModule`). Слои выстроены вокруг паттерна resolver → service → инфраструктура, но доменная логика и инфраструктурные вызовы пока смешаны. Конфигурации распределены между `.env`, `src/core/config/**` и Docker-окружением; миграции/схема БД лежат в `prisma`. OpenAPI/Proto отсутствуют — контракт только GraphQL. CI/CD не описан; в репозитории нет GitHub Actions или похожих сценариев.

## 🧰 Технологический стек

| Категория | Технологии (версии) | Назначение / комментарии |
| --- | --- | --- |
| Язык и рантайм | TypeScript 5.8.x, Node.js 20+ (Nest CLI) , Bun 1.x | TypeScript — основной язык; Nest CLI компилирует в `dist`. Bun используется в контейнерах и lockfile (`bun.lock`). |
| Фреймворк | NestJS 11.1.5 (`@nestjs/common/core/config`), `@nestjs/graphql` 13.1, `@apollo/server` 4.12, `express` 5.1 | Модульный каркас, GraphQL через Apollo Driver, HTTP-стек на Express (без Fastify). |
| API и транспорт | GraphQL (code-first), `graphql-upload-minimal`, `cookie-parser`, `i18next-http-middleware` | GraphQL — единственный контракт; поддерживаются multipart загрузки и локализация запроса, Accept-Language сохраняется в `req.language`. |
| БД и ORM | PostgreSQL (env `POSTGRES_URL`), Prisma 6.12, `@prisma/client` | Типобезопасный доступ к БД, миграции и генерация клиента под Node/Edge/WebAssembly. |
| Сессии и кэш | `express-session` 1.18, `connect-redis` 9, `redis` 5.6, `connect-timeout` отсутствует, кастомный `ms.util.ts` | Сессии хранятся в Redis, TTL вычисляется из строкового значения (`30D` → миллисекунды). |
| Аутентификация/валидация | `argon2` 0.43, `class-validator` 0.14, `class-transformer` 0.5, кастомные декораторы, `cookie-parser` | Хэширование паролей, валидация DTO, получение User-Agent/языка/пользователя из GraphQL контекста. |
| Email и коммуникации | `@nestjs-modules/mailer` 2.0, `nodemailer` 7, `@react-email/components/html/tailwind`, `@getbrevo/brevo` 3, `@sendgrid/mail` 8 | Единый сервис отправки писем, React Email шаблоны, поддержка Brevo/SendGrid/SMTP fallback. |
| Интернационализация | `i18next` 25, `i18next-fs-backend` 2.6, `i18next-http-middleware` 3.7 | Глобальная i18n, сохранение пропущенных ключей в файлы и CSV. |
| Интеграции и утилиты | `device-detector-js` 3, `geoip-lite` 1.4, `qrcode` 1.5, `otpauth` 9.4, `stripe` 18, `cloudinary` 2.7 | Сбор метаданных устройств/IP, генерация одноразовых кодов и токенов; Stripe/Cloudinary пока не используются, но задел подготовлен. |
| Тестирование | Jest 30, `ts-jest`, `@nestjs/testing`, `supertest` | Юнит/интеграционные тесты (нуждаются в актуализации), e2e через Supertest. |
| Линтинг и стиль | ESLint 9.31 + `@typescript-eslint` 8.38, Prettier 3.6, `@trivago/prettier-plugin-sort-imports` | Статический анализ, автоформатирование и сортировка импортов. Используются и старый `.eslintrc.js`, и новый flat-config. |
| Инфраструктура/DevOps | Docker, Vercel (`vercel.json`), `@godaddy/terminus`, `module-alias` 2.2 | Контейнеризация, маршрутизация на Vercel, заготовка для health-check, runtime-алиасы путей. |

> В `package.json` присутствуют зависимости `@nestjs/typeorm` и `typeorm`, но в коде они не используются — вероятно, технический долг от ранней итерации.

## 🏗 Архитектура

- **Bootstrap.** `src/main.ts` вручную читает `.env` (по ошибочному пути `backend/.env`), разворачивает переменные через `dotenv-expand`, вызывает `initI18n`, создаёт приложение Nest. Далее подключаются middleware: i18n (`i18next-http-middleware`), JSON body с fallback языка, обогащение `req.language`, `cookie-parser`, загрузчик файлов (`graphqlUploadExpress`), глобальный `ValidationPipe`, `sessionConfig`, CORS. Конечный порт берётся из `ConfigService`.
- **Конфигурация.** `ConfigModule.forRoot` объявлен глобальным, но `validate` возвращает конфиг без проверки. `IS_DEV_ENV` вычисляется в `src/shared/utils/is-dev.util.ts` и влияет на загрузку `.env` (есть риск, что prod-окружение останется без переменных). `session.config.ts` использует кастомный `ms.util.ts`, `parseBoolean` выбрасывает исключение при неожиданных строках.
- **GraphQL.** `GraphQLModule.forRootAsync` задаёт `autoSchemaFile`, сортировку, ручной контекст `{ req, res, language }`, включает subscription handlers. Схема лежит в репозитории (`src/core/graphql/schema.gql`), версионирование/документация отсутствуют.
- **Инфраструктура.** `PrismaModule` и `RedisModule` помечены как `@Global`, предоставляя singleton’ы. `I18nModule` и `MailModule` тоже глобальные. `module-alias/register` обеспечивает синхронизацию путей `@/` между TypeScript и Node.
- **Shared-слой.** `@Lang` берёт язык из cookie `language`, `req.language` или `Accept-Language`; `@UserAgent` подхватывает User-Agent. `Authorization()` навешивает `GqlAuthGuard` на резолверы. `RawBodyMiddleware` реализован, но не подключён — вероятно, задел под Stripe webhooks.
- **Бизнес-сервисы.** `AccountService` оперирует пользовательскими данными через Prisma, `SessionService` — выдаёт сессии, сохраняет `metadata`, обращается к Redis, I18n и Mail. `MailService` рендерит React Email, выбирает провайдер. Вся бизнес-логика находится в сервисах; выделенного доменного слоя или событий нет.
- **Сессии и метаданные.** `session.util.ts` сохраняет в `req.session` `userId`, `createdAt`, `metadata`, оборачивая ошибку в i18n-сообщение. `session-metadata.util.ts` вычисляет IP (dev → фиксированное значение), устройство и геолокацию. Хранение метаданных в Redis — объект целиком сериализуется как JSON.
- **Инфраструктурные утилиты.** `errors/*` реализуют безопасную сериализацию ошибок, `ms.util.ts` — parse/format интервалов, `parse-boolean.util.ts` — преобразование строк в boolean, `generate-token.util.ts` — генерацию UUID или 6-значного кода с ревокацией предыдущих токенов.

**Сильные стороны**

- Инфраструктура вынесена в глобальные модули (`PrismaModule`, `RedisModule`, `MailModule`, `I18nModule`), доступна в любой части приложения без циклических зависимостей.
- Typed i18n (`src/core/i18n/utils/i18n-typed.util.ts`) предотвращает обращение к несуществующим ключам и возвращает перевод как объект, что особенно полезно для React Email.
- Почтовый модуль объединяет разные провайдеры и fallback на SMTP; шаблоны разделены на компоненты (`src/modules/lib/mail/templates/components`), что упрощает поддержку дизайн-системы.
- Сессии сохраняют расширенную метаинформацию (устройство, гео, IP), что позволит реализовать уведомления о подозрительных входах.

**Зоны роста**

- `dotenv.config({ path: 'backend/.env' })` в `src/main.ts:13` — явная ошибка, приводящая к отсутствию конфигурации на старте и отключению `ConfigModule` из-за `ignoreEnvFile`.
- Бизнес-логика тесно связана с инфраструктурой: `SessionService` отправляет письма, читает Redis и формирует ответы, что усложняет тестирование и переиспользование.
- Отсутствует валидация конфигурации; любая опечатка в `.env` приведёт к runtime-ошибкам (например, неверное значение `SESSION_HTTP_ONLY` выбросит исключение в `parseBoolean`).
- Доменные функции (`generateToken`) и часть бизнес-логики (`session.util`) лежат в `shared/utils`, размывая архитектурные границы.
- `RawBodyMiddleware` не зарегистрирован, но лежит в shared — важно не забыть подключить его при внедрении webhooks.

**Интересные решения**

- Логгер i18n пропускаемых ключей (`src/core/i18n/logging/i18n.logger.ts`) сохранит JSON/CSV-файлы с недостающими переводами.
- React Email шаблоны используют те же словари `i18next`, что и backend, поэтому переводы синхронизированы.
- `ms.util.ts` поддерживает большое количество синонимов (`Days`, `d`, `Hrs`, `ms`), что делает конфигурацию интервалов гибкой и понятной.

## 🔌 API и данные

- **GraphQL операции.** `SessionResolver` (`src/modules/auth/session/session.resolver.ts`) объявляет:
  - Мутации `login`, `logout`, `clearSessionCookie`, `removeSession`.
  - Запросы `findCurrentSession`, `findSessionsByUser`.
  - Декораторы `@UserAgent` и `@Lang` пробрасывают User-Agent и язык в сервис.
  - Guard `@Authorization()` защищает приватные методы.
  `AccountResolver` (`src/modules/auth/account/account.resolver.ts`) предоставляет `createAccount` и `deleteAccount`; удаление требует авторизации и читает `id` из сессии через `@Authorized('id')`.
- **Типы и ошибки.** I18n обеспечивает человекопонятные сообщения (`auth.user_not_found`, `auth.invalid_password`). В случае логина все ошибки мапятся на `NotFoundException`, что может маскировать различие между неверным email/паролем. Положительный ответ `login` содержит только пользователя.
- **Модель данных.** `prisma/schema.prisma` описывает `User` (фио, email/phone, пароль, статусы верификации, TOTP/OTP-секреты) и `Token` (тип, значение, срок действия) с опцией каскадного удаления. Комментированные блоки указывают на будущие сущности (Profile, Role, UserRole, SocialLink, AuthSettings), но они выключены.
- **Миграции.** `prisma/migrations/20250929124400_29092025_init/migration.sql` создаёт базовые таблицы, индексы и FK. Других миграций нет — проект в ранней стадии.
- **Управление токенами.** `generateToken` (`src/shared/utils/generate-token.util.ts`) создаёт новый токен, удаляет старый, выставляет expiry через Prisma. Однако сервисы, которые вызывали бы эту утилиту (верификация email/восстановление пароля), отсутствуют.
- **Сессии в Redis.** `sessionConfig` добавляет `cookie.sameSite = 'lax'`, TTL (в миллисекундах) передаётся и в cookie, и в Redis Store. `SessionService.findByUser` получает весь список ключей по `redis.keys('*')`, парсит JSON и фильтрует по `userId`, исключая текущую сессию.
- **Consistency & caching.** Транзакций нет — `AccountService.delete` выполняет `findUnique` и трижды вызывает `delete`, возвращая `Boolean(Promise)`. Это не только неправильная логика, но и потенциальный источник ошибок. Кэширование данных (кроме сессий) не используется. Уровень изоляции транзакций не контролируется.

## 🔒 Безопасность

- **Авторизация и сессии.** Сессии хранятся в Redis через `connect-redis`. Cookie-конфигурация (`SESSION_HTTP_ONLY`, `SESSION_SECURE`, `SESSION_DOMAIN`, `SESSION_MAX_AGE`) читается из `.env` (`src/core/config/session.config.ts`). `parseBoolean` строжайше ожидает `true/false`, иначе выбросит `Error`.
- **Guard.** `GqlAuthGuard` проверяет наличие `req.session.userId`, ищет пользователя в БД и прикрепляет `req.user`. Ошибка `UnauthorizedException` локализуется через `common.user_not_authorized`.
- **Пароли.** Используется `argon2.verify`/`hash`. Контроль качества паролей ограничивается `@MinLength(8)`.
- **Валидация входных данных.** `CreateAccountInput` валидирует `fullName` по regex (только латинские буквы и дефис), `email`, `phone`. `LoginInput` не валидируется — стоит добавить `@IsEmail`, `@IsString`.
- **Почта.** `MailService` выбирает провайдера по `MAIL_USE_SERVICE`. Ошибка `SendgridService` локализует сообщение. Однако `VerificationEmailTemplate` принимает `locale`, а сервис передаёт `language`, из-за чего всегда используется английская версия.
- **Недочёты.** 
  - `SessionService.findCurrent` при каждом чтении рассылает письмо на `maridim92@gmail.com` (`src/modules/auth/session/session.service.ts:69`) — это и утечка, и источник спама.
  - `clear(req)` очищает cookie по префиксу Redis, а не по имени cookie (`SESSION_NAME`), cookie остаётся в браузере.
  - `.env` с реальными секретами лежит в репозитории и копируется в Docker-образ. Необходимо срочно убрать.
  - `Dockerfile.prod` копирует `.env`, что закрепляет секреты в артефакте.
  - Нет rate limiting, CSRF-защиты, audit-логов, secret manager. `MailService` fallback на SMTP использует `MAIL_LOGIN` и `MAIL_PASSWORD` — при dev-окружении эти значения обязательны.

## 📈 Наблюдаемость и производительность

- **Логирование.** Используется только стандартный `Logger` (например, при ошибке подключения к Redis). Структурированных логов, трассировки и метрик нет. Health-check модуль (`@nestjs/terminus`) в зависимостях, но не подключён.
- **i18n-логирование.** `I18nLogger` пишет пропущенные ключи в файлы/CSV (`logs/i18n`). Это полезно для локализации, но не заменяет мониторинг.
- **Redis.** `RedisService` создает один клиент и логирует ошибки подключения. Ошибки команд не перехватываются — при отказе Redis API вернёт `null`.
- **Performance-риски.**
  - `redis.keys('*')` + `mGet` в `findByUser` — O(N) операция; при большом количестве ключей может блокировать Redis.
  - `Number(createdAt)` для сортировки → `NaN`, порядок сессий непредсказуем.
  - `findCurrent` делает дорогостоящие вызовы (почта + Redis) даже при чтении данных.
  - `geoip-lite` загружает локальную базу при первом импорте, но дальнейшие вызовы тоже стоят времени.
  - Почтовый сервис не реализует retry/backoff. В случае ошибки SendGrid/Brevo запрос упадёт.
- **Отсутствуют**: метрики (Prometheus), трассировки (OpenTelemetry), алёртинг. Нет логирования бизнес-событий (логин/выход).

## ✅ Качество кода и тесты

- **Линтинг и стиль.** В репозитории два набора правил ESLint: `eslint.config.mjs` (flat) и `.eslintrc.js`. Они конфликтуют по ignore-списку и набору правил (новый включает `no-unsafe-*` как warning). Prettier настроен на 120 символов, табы и сортировку импортов.
- **TypeScript.** `tsconfig.json` отключает строгий режим (`strictNullChecks`, `noImplicitAny`, `noFallthroughCasesInSwitch` и др.), что снижает качество типов. `tsconfig.build.json` исключает `**/*spec.ts` и `test/`.
- **Комментарии и локализация.** Во многих файлах русские комментарии в CP866/KOI8 кодировке, что затрудняет чтение и поиск.
- **Тесты.** 
  - `i18n.service.spec.ts` мокирует i18n, показывает подход к unit-тестам.
  - `SessionService`/`SessionResolver` тесты лишь проверяют `should be defined`, зависимости не замоканы, поэтому тесты не запускаются.
  - `AccountService`/`AccountResolver` тесты устарели (ожидают `findProfile`).
  - `test/app.e2e-spec.ts` импортирует `AppModule`, которого в проекте нет.
  - Ни unit, ни e2e тесты не запускались (в рамках анализа). Перед запуском нужно обновить конфигурацию и зависимости.
- **Скрипты.** `prisma:seed` обращается к несуществующему `src/core/prisma/prisma.seed.ts`. `email:dev` запускает React Email Preview Server (`@react-email/preview-server`), но это не задокументировано.
- **Покрытие.** Команда `npm run test:cov` создаёт `coverage/`, но в репозитории папка отсутствует — метрики не собираются и не анализируются.

## 🚚 Инфраструктура и CI/CD

- **Docker.** Dev-образ собирает зависимости с Bun, копирует исходники, запускает `bun run start:dev`. Prod-образ: Bun генерирует Prisma и билдит Nest, затем всё переносится на `node:latest`. Секреты (`.env`) копируются в образ, что недопустимо.
- **Entrypoint.** `entrypoint.prod.sh` ждёт `DB_HOST:DB_PORT`, но `.env` определяет `POSTGRES_HOST/PORT`. В результате контейнер не ждёт готовности БД. Redis-ждун закомментирован.
- **Vercel.** `vercel.json` маршрутизирует все HTTP-методы на `dist/main.js`. Не описан build step (например, `nest build`). Нужно убедиться, что деплой действительно использует bundled версию.
- **Скрипты npm.** `build`, `start`, `start:dev`, `start:prod`, `lint`, `prisma:*`, `test*`, `email:dev`. Зависимости устанавливаются Bun’ом (см. Docker), но локально можно использовать `npm/pnpm`.
- **CI/CD.** Отсутствует. Рекомендуется добавить pipeline (lint → test → build → docker → deploy) и валидацию миграций.
- **Секреты.** `.env` хранится в репозитории, содержит реальные ключи и копируется в Docker. Нет разделения dev/stage/prod конфигов. Управление секретами следует перенести в .env.local/ENV переменные CI/CD.

## 🔧 Ключевые модули

- **SessionModule** (`SessionService`, `SessionResolver`)
  - Назначение: аутентификация, работа с Redis-сессиями, выдача списка устройств, рассылка уведомлений (пока в виде хардкода).
  - Резолвер использует `@UserAgent`, `@Lang`, `@Authorization`, возвращает типизированные GraphQL-ответы (`LoginResponse`, `Session`).
  - Пример — `src/modules/auth/session/session.service.ts:39-76`:
    ```ts
    async login(req: Request, userAgent: string, data: LoginInput, lng: Language): Promise<LoginResponse> {
        const user = await this.prisma.user.findUnique({ where: { email: data.email } })
        if (!user) {
            throw new NotFoundException(this.i18n.t('auth.user_not_found', { lng: language }))
        }

        const isPasswordValid = await verify(user.password, data.password)
        if (!isPasswordValid) {
            throw new NotFoundException(this.i18n.t('auth.invalid_password', { lng: language }))
        }

        const metadata = getSessionMetadata(req, userAgent)
        return saveSession(req, user, metadata)
    }

    async logout(req: Request) {
        return destroySession(req, this.config)
    }

    async findCurrent(req: Request, lng: Language) {
        await this.mailService.sendVerificationEmailToken('maridim92@gmail.com', '123314', language)
        const sessionId = req.session.id
        const session: Session = await this.redis.getJSON(this.key(sessionId))
        return { ...session, id: sessionId }
    }
    ```
  - Публичные методы: `login`, `logout`, `findCurrent`, `findByUser`, `clear`, `remove`. Зависят от Prisma, Redis, I18n, Config, Mail. Side-effect (email) нужно устранять.

- **AccountModule** (`AccountService`, `AccountResolver`)
  - Назначение: регистрация и self-service удаление пользователя.
  - Resolver `deleteAccount` требует авторизации и берёт `id` из `req.user`.
  - Пример — `src/modules/auth/account/account.service.ts:22-52`:
    ```ts
    async create(data: CreateAccountInput, lng: Language): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { email: data.email } })
        if (user) {
            throw new ConflictException(this.i18n.t('auth.user_already_exists', { lng: language }))
        }

        const hashedPassword = await hash(data.password)
        return this.prisma.user.create({ data: { ...data, password: hashedPassword } })
    }

    async delete(lng: Language, id: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({ where: { id } })
        if (user) {
            throw new ConflictException(this.i18n.t('auth.user_already_exists', { lng: language }))
        }

        return Boolean(this.prisma.user.delete({ where: { id } }))
    }
    ```
  - Публичные методы: `create`, `delete`. Зависимости: Prisma, I18n. Ошибочная логика удаления и отсутствие `await` делают метод нефункциональным.

- **MailModule** (`MailService`, `BrevoService`, `SendgridService`, React Email шаблоны)
  - Назначение: централизованная отправка писем, выбор провайдера, генерация HTML через React Email, использование i18n.
  - Пример — `src/modules/lib/mail/mail.service.ts:25-56`:
    ```ts
    async sendVerificationEmailToken(email: string, token: string, lng: Language) {
        const content = tObj('mail.verification_email', {
            lng: language ?? DEFAULT_LANGUAGE,
            hours: 24,
        })
        const html = await render(VerificationEmailTemplate({ token, language }))

        return this.sendMail(email, content.subject, html)
    }

    private async sendMail(email: string, subject: string, html: string) {
        if (this.config.getOrThrow<string>('MAIL_USE_SERVICE') === 'brevo') {
            return this.brevo.sendMail(email, subject, html)
        }

        if (this.config.getOrThrow<string>('MAIL_USE_SERVICE') === 'sendgrid') {
            return this.sendgrid.sendMail(email, subject, html)
        }

        return this.mailer.sendMail({
            from: `"${COMPANY_NAME}" <${this.config.getOrThrow<string>('MAIL_LOGIN')}>`,
            to: email,
            subject,
            html,
        })
    }
    ```
  - Публичные методы: `sendVerificationEmailToken`. Внутренние: `sendMail`. Зависимости: MailerService, Brevo, SendGrid, ConfigService, i18n. Нужно исправить `locale`, добавить обработку ошибок/ретраи.

- **RedisModule / RedisService**
  - Назначение: подключение к Redis, базовые CRUD-операции, JSON-хранение, expire.
  - Пример — `src/core/redis/redis.service.ts:10-44`:
    ```ts
    constructor(private readonly config: ConfigService) {
        this.client = createClient({ url: this.config.getOrThrow<string>('REDIS_URL') })
        this.client.connect().catch((err: unknown) => {
            logUnknownError(this.logger, 'Redis connect error', err, RedisService.name)
        })
    }

    getClient(): RedisClientType {
        return this.client
    }

    async get(key: string): Promise<string | null> {
        const res = await this.client.get(key)
        return typeof res === 'string' ? res : null
    }

    async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
        if (ttlSeconds && ttlSeconds > 0) {
            await this.client.set(key, value, { EX: ttlSeconds })
        } else {
            await this.client.set(key, value)
        }
    }
    ```
  - Публичные методы: `getClient`, `get`, `set`, `del`, `expire`, `setJSON`, `getJSON`, `keys`. Используется как напрямую (`SessionService`), так и в `sessionConfig`.

## ⚠️ Риски и техдолг

**Критический**

- Секреты в `.env` (Stripe, SendGrid, Brevo, Cloudinary, Telegram) лежат в репозитории и копируются в Docker-образ (`docker/Dockerfile.prod:35`). Требуется немедленно удалить из VCS и перевести на secret manager.
- `src/main.ts:13` пытается читать `backend/.env` (файл отсутствует). В сочетании с `IS_DEV_ENV` (по умолчанию `false`) это отключает загрузку `.env` в `ConfigModule`, что приводит к `ConfigService` без данных.
- `SessionService.findCurrent` рассылает письма на `maridim92@gmail.com` при каждом запросе (`src/modules/auth/session/session.service.ts:69`). Это утечка данных и источник дополнительной нагрузки/спама.
- `AccountService.delete` реализован некорректно: при наличии пользователя выбрасывает `ConflictException`, удаление вызывается трижды без `await` (`src/modules/auth/account/account.service.ts:39-52`).

**Высокий**

- Метод `clear` очищает cookie по префиксу Redis (`sessions:`) вместо имени cookie (`SESSION_NAME`) (`src/modules/auth/session/session.service.ts:132`). Клиентская cookie остаётся, что вызывает рассинхронизацию.
- Локализация писем сломана: `MailService` передаёт `language`, шаблон ожидает `locale` (`src/modules/lib/mail/mail.service.ts:30` + `src/modules/lib/mail/templates/verification-email.tsx:19`).
- `redis.keys('*')` и `mGet` в `findByUser` (`src/modules/auth/session/session.service.ts:92`) выполняют полный скан Redis, масштабируются плохо и могут вернуть чужие ключи при нескольких приложениях.
- `entrypoint.prod.sh` ждёт переменные `DB_HOST/DB_PORT`, которых нет в `.env` (используются `POSTGRES_HOST/PORT`). Контейнер не дожидается готовности БД.
- `.env` копируется в образ, секреты оказываются в артефактe. Нет разграничения dev/prod конфигураций.

**Средний**

- Тесты устарели: `account.service.spec.ts`/`account.resolver.spec.ts` ожидают несуществующие методы, `test/app.e2e-spec.ts` импортирует `AppModule`. CI/локальный запуск тестов невозможен.
- `tsconfig.json` отключает строгий режим, что скрывает ошибки типов (например, `session` может быть `undefined`).
- Скрипт `prisma:seed` обращается к несуществующему файлу. Seed-данные не создаются.
- Комментарии с повреждённой кодировкой усложняют поддержку и ревью.
- Несколько зависимостей (`stripe`, `cloudinary`, `otpauth`) пока не используются; стоит либо внедрить, либо удалить.
- `RawBodyMiddleware` объявлен, но не используется. При подключении нужно учесть влияние на GraphQL.

**Низкий**

- Папка `scripts/` пуста; инфраструктурные задачи (миграции, деплой) не автоматизированы.
- Дублирующиеся конфиги ESLint могут вести к разночтениям в правилах.

**План снижения рисков**

1. **Quick wins (1–3 дня)**
   - Исправить загрузку `.env` (`src/main.ts`), добавить fallback на `process.cwd()`.
   - Удалить хардкод отправки писем в `findCurrent`; заменить на оповещение только при соответствующих событиях.
   - Переписать `AccountService.delete` (проверять отсутствие пользователя, один вызов `delete`, `await`).
  - Исправить `clear` (использовать `config.getOrThrow('SESSION_NAME')`) и `MailService` (`locale`).
  - Убрать `.env` из репозитория и Docker-образа, перенести секреты в переменные окружения CI/CD.

2. **Mid-term (1–3 недели)**
   - Ввести валидацию конфигурации (например, `zod`/`env-var`), покрыть критические параметры (`SESSION_*`, `MAIL_*`, `POSTGRES_URL`, `REDIS_URL`).
  - Оптимизировать `findByUser`: использовать `SCAN` по префиксу, хранить список сессий пользователя структурировано, исправить сортировку дат.
  - Актуализировать тесты: замокать Prisma/Redis, восстановить e2e-тесты, подключить их к CI.
  - Создать реальный `prisma.seed.ts` или задокументировать процесс подготовки данных.
  - Пересмотреть `package.json` на предмет неиспользуемых зависимостей.

3. **Long-term (1–3 месяца)**
   - Ввести наблюдаемость: structured logging, health-check (`/health`), метрики (Prometheus/OpenTelemetry), трассировки.
   - Реализовать безопасность: rate limiting, аудит входов, secret manager, разделение dev/stage/prod конфигов, безопасное хранение токенов.
   - Пересмотреть архитектуру сервисов, отделить бизнес-правила, внедрить обработку событий (например, при создании пользователя → отправка письма).
   - Настроить CI/CD (lint/test -> build -> migrate -> deploy), автоматизировать обновление схемы.

## 📋 Выводы и рекомендации

Medic Hub API получил ядро аутентификации с GraphQL-интерфейсом, typed i18n и мульти-почтовый модуль на React Email. Структура модульная, инфраструктура вынесена в отдельные провайдеры, есть задел на профиль/роли/мультифактор. Однако базовые ошибки конфигурации, утечки секретов, неправильная реализация удаления пользователя и побочные эффекты в `findCurrent` препятствуют выводу проекта в продакшен. Отсутствие строгой типизации и актуальных тестов повышает риск регрессий.

**Уровень сложности** — upper-middle: требуется уверенное владение NestJS GraphQL, Prisma, Redis, i18n, React Email, Docker и контейнерным деплоем. Для стабилизации и дальнейшего развития необходим лидер уровня Senior, который сконцентрируется на безопасности, архитектурной чистоте и автоматизации.

**Приоритетные шаги:**

1. **Безопасность и конфигурация:** убрать секреты из репозитория/образов, починить загрузку `.env`, исправить `SessionService`/`AccountService`, актуализировать локализацию почты.
2. **Качество и тесты:** включить строгий TypeScript, обновить/написать тесты (юнит, интеграционные, e2e), подключить CI, добавить проверку конфигураций.
3. **Наблюдаемость и устойчивость:** внедрить health-check, логирование, метрики, оптимизировать Redis-операции, добавить защитные механизмы (rate limiting, аудит).
4. **Архитектурное развитие:** выделить доменные сервисы, реализовать события (создание пользователя → отправка письма), подготовить расширение модели (профили, роли, MFA).

**Отсутствующая информация:** нет сведений о реальном деплое, seed-скриптах, мониторинге. Чтобы восполнить:
- Добавить/запустить `prisma.seed.ts` (или задокументировать ручной процесс миграции).
- Запустить `bun run test`/`bun run test:e2e` после актуализации тестов.
- Описать/создать `docker-compose` или Helm chart (если требуется).
- Задокументировать использование `email:dev` и других служебных скриптов.
- Определить стратегию работы с секретами (Vault, AWS SSM, Vercel env).

После выполнения quick wins и настройки процессов проект станет готов для дальнейшего функционального развития: добавления MFA, интеграции с платежами, ролей и расширенных бизнес-процессов. Санирование текущего техдолга критично, чтобы обеспечить предсказуемость поведения и безопасность пользователей.
