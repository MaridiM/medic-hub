# Анализ бэкенд кодовой базы: Medic HUB → Doctor Lab (DL)

> Ревизия по загруженному архиву `backend/` (NestJS + GraphQL + Prisma). Дата анализа: 2025‑09‑19 (Europe/Kyiv).

## 📁 Структура проекта

```text
backend/
├─ docker/
│  ├─ Dockerfile
│  ├─ Dockerfile.prod
│  ├─ entrypoint.dev.sh
│  ├─ entrypoint.prod.sh
│  └─ wait-for-it.sh
├─ logs/
│  └─ i18n/
│     ├─ missing-keys.csv
│     ├─ missing-keys.json
│     └─ missing-keys.log
├─ prisma/
│  ├─ __generated__/
│  │  ├─ runtime/
│  │  │  ├─ edge-esm.js
│  │  │  ├─ edge.js
│  │  │  ├─ index-browser.d.ts
│  │  │  ├─ index-browser.js
│  │  │  ├─ library.d.ts
│  │  │  ├─ library.js
│  │  │  ├─ react-native.js
│  │  │  ├─ wasm-compiler-edge.js
│  │  │  └─ wasm-engine-edge.js
│  │  ├─ client.d.ts
│  │  ├─ client.js
│  │  ├─ default.d.ts
│  │  ├─ default.js
│  │  ├─ edge.d.ts
│  │  ├─ edge.js
│  │  ├─ index-browser.js
│  │  ├─ index.d.ts
│  │  ├─ index.js
│  │  ├─ libquery_engine-debian-openssl-3.0.x.so.node
│  │  ├─ package.json
│  │  ├─ query_engine-windows.dll.node
│  │  ├─ query_engine-windows.dll.node.tmp23316
│  │  ├─ query_engine-windows.dll.node.tmp25048
│  │  ├─ schema.prisma
│  │  ├─ wasm.d.ts
│  │  └─ wasm.js
│  └─ schema.prisma
├─ src/
│  ├─ core/
│  │  ├─ config/
│  │  │  ├─ graphql.config.ts
│  │  │  ├─ i18n.config.ts
│  │  │  ├─ index.ts
│  │  │  └─ session.config.ts
│  │  ├─ graphql/
│  │  │  └─ schema.gql
│  │  ├─ i18n/
│  │  │  ├─ decorators/
│  │  │  ├─ locales/
│  │  │  ├─ logging/
│  │  │  ├─ test/
│  │  │  ├─ i18n.constants.ts
│  │  │  ├─ i18n.module.ts
│  │  │  ├─ i18n.service.ts
│  │  │  └─ index.ts
│  │  ├─ prisma/
│  │  │  ├─ index.ts
│  │  │  ├─ prisma.module.ts
│  │  │  └─ prisma.service.ts
│  │  ├─ redis/
│  │  │  ├─ index.ts
│  │  │  ├─ redis.module.ts
│  │  │  └─ redis.service.ts
│  │  ├─ core.module.ts
│  │  └─ index.ts
│  ├─ modules/
│  │  └─ auth/
│  │     ├─ account/
│  │     ├─ session/
│  │     └─ index.ts
│  ├─ shared/
│  │  ├─ decorators/
│  │  │  ├─ auth.decorator.ts
│  │  │  ├─ authorized.decorator.ts
│  │  │  ├─ index.ts
│  │  │  ├─ is-password-matching-constraint.decoration.ts
│  │  │  └─ user-agent.decorator.ts
│  │  ├─ guards/
│  │  │  ├─ gql-auth.guard.ts
│  │  │  └─ index.ts
│  │  ├─ middlewares/
│  │  │  ├─ index.ts
│  │  │  └─ raw-body.middleware.ts
│  │  ├─ pipes/
│  │  │  ├─ file-validation.pipe.ts
│  │  │  └─ index.ts
│  │  ├─ types/
│  │  │  ├─ express-session.d.ts
│  │  │  ├─ gql-context.types.ts
│  │  │  ├─ index.ts
│  │  │  └─ session-metadata.types.ts
│  │  └─ utils/
│  │     ├─ file.util.ts
│  │     ├─ generate-token.util.ts
│  │     ├─ index.ts
│  │     ├─ is-dev.util.ts
│  │     ├─ ms.util.ts
│  │     ├─ parse-boolean.util.ts
│  │     ├─ session-metadata.util.ts
│  │     └─ session.util.ts
│  └─ main.ts
├─ test/
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ .dockerignore
├─ .env
├─ .eslintignore
├─ .eslintrc.js
├─ .gitignore
├─ .prettierignore
├─ .prettierrc
├─ bun.lock
├─ eslint.config.mjs
├─ jest.config.js
├─ nest-cli.json
├─ package.json
├─ README.md
├─ tsconfig.build.json
├─ tsconfig.json
└─ vercel.json
```

**Ключевые директории и назначение**
- `src/core/*` — инфраструктурное ядро: конфиги (GraphQL/i18n/session), Prisma/Redis модули, i18n сервис, базовые константы.
- `src/modules/auth/*` — доменный модуль аутентификации/аккаунта: GraphQL резолверы/сервисы для создания пользователя и сессий.
- `src/shared/*` — общие декораторы, гард аутентификации, пайпы, типы и утилиты (сессии, парсинг значений, и т. п.).
- `prisma/*` — схема `schema.prisma`, сгенерированный клиент в `__generated__/` (Git-включён), миграции не обнаружены.
- `src/main.ts` — точка входа: bootstrapping Nest, middleware (i18n, JSON, cookies, upload), CORS, настройки сессий.
- Конфиги `.env` — **хранятся в корне `backend/.env`** (есть реальные токены/ключи — см. раздел «Безопасность»).

**Организация кода**: модульная **layered** архитектура в рамках **монолита** (NestJS modules). Слои: `Resolver/Guard` → `Service` → `PrismaService` (репозиторий как отдельный слой не введён). Контракты — **GraphQL** (Apollo Driver) с авто‑генерацией схемы.

**Где лежит что**
- Конфигурации: `src/core/config/*.ts` (+ `.env`), i18n ресурсы в `src/core/i18n/locales/*`.
- Миграции БД: **нет** (Prisma schema есть, но папки `prisma/migrations` нет).
- Контракты API: GraphQL, авто‑схема в `src/core/graphql/schema.gql`.
- Скрипты запуска: `package.json` → `start`, `start:dev`, `build`, `prisma:*` и т. п.
- Docker/Compose: явных файлов нет (в архиве пусто), запуск ожидается через локальный Node/Nest.

## 🧰 Технологический стек

| Категория | Технология | Версия/детали |
|---|---|---|
| Язык/рантайм | TypeScript / Node.js | TS (ES2022), Node 18+ (по синтаксису/зависимостям) |
| Фреймворк | **NestJS** | `@nestjs/core` ^11.1.5 |
| Транспорт | **GraphQL (Apollo)** | `@nestjs/graphql` ^13.1.0, `@apollo/server` 4.12.2 |
| ORM | **Prisma** | `@prisma/client` ^6.12.0 (PostgreSQL) |
| БД | **PostgreSQL** | строка подключения `POSTGRES_URL` из `.env` |
| Сессии/кэш | **Redis** | `redis` клиент, `connect-redis` + `express-session` |
| Аутентификация | Сессионная (cookie + Redis) | Гард `GqlAuthGuard` читает `req.session.userId` |
| Валидация | `class-validator` + `ValidationPipe` | На входных GraphQL‑типах (частично) |
| Загрузка файлов | `graphql-upload-minimal` | middleware в `main.ts` |
| I18n | i18next (+ http‑middleware) | серверные словари `en/ru` |
| Логирование/Health | Terminus, Godaddy/terminus (в deps) | **в коде не использованы** |
| Тесты | Jest/ts-jest | unit‑тесты для `account` (spec файлы) |
| Email/Files (планы) | react-email, SendGrid, Cloudinary | пакеты и переменные присутствуют, интеграции в коде нет |
| Прочее | argon2 | хэш паролей |

**Таблица зависимостей (фрагменты)**
- `@nestjs/*` → каркас модулей, DI, GraphQL-драйвер.
- `@apollo/server` → сервер GraphQL.
- `@nestjs/config` → доступ к `.env`/конфига.
- `redis`, `connect-redis`, `express-session` → хранение сессий.
- `@prisma/client` → доступ к БД, генерация клиента.
- `class-validator` → декларативная валидация входа.
- `argon2` → безопасное хранение паролей.
- `i18next-http-middleware` → язык из заголовков/сессии.
- (в deps, **но не используются**): `@nestjs/typeorm`, `@nestjs/swagger`, `@nestjs/terminus` — потенциальный техдолг.

## 🏗 Архитектура

**Слои и границы**
- **Resolvers (GraphQL)** принимают входные типы/аргументы и делегируют в **Services**.
- **Services** инкапсулируют бизнес‑логику, работают через **PrismaService** (репозитории не вынесены).
- **Core** модуль поднимает инфраструктуру: GraphQL, Prisma, Redis, i18n, вешает middleware и глобальные пайпы.

**Пример (контроллер/handler → сервис → БД)**

*Resolver:*
```ts
import { Lang } from '@/core'
import { Authorization, Authorized } from '@/shared/decorators'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AccountService } from './account.service'
import { CreateAccountInput } from './inputs'
import { User } from './models'

@Resolver()
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	/**
	 * Create a new user
	 * @param data - The data for the new user
	 * @param language - The language of the user
	 * @returns The new user
	 */
	@Mutation(() => User, { name: 'createAccount', description: 'Create a new user' })
	create(@Args('data') data: CreateAccountInput, @Lang() language: string): Promise<User> {
		return this.accountService.create(data, language)
	}

	/**
	 * Get current user
```

*Service:*
```ts
import { hash, verify } from 'argon2'

import { I18nService, PrismaService } from '@/core'
import { ConflictException, Injectable } from '@nestjs/common'

import { CreateAccountInput } from './inputs'
import { User } from './models'

@Injectable()
export class AccountService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly i18n: I18nService,
	) {}

	/**
	 * Create a new user
	 * @param data - The data for the new user
	 * @param language - The language of the user
	 * @returns The new user
	 */
	async create(data: CreateAccountInput, language: string): Promise<User> {
		const user = await this.prisma.user.findUnique({ where: { email: data.email } })
		if (user) {
			throw new ConflictException(this.i18n.t('auth.user_already_exists', { lng: language }))
```

**Аутентификация и гард (session‑based, GraphQL context)**

*GqlAuthGuard:*
```ts
import { DEFAULT_LANGUAGE, I18nService, PrismaService } from '@/core'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class GqlAuthGuard implements CanActivate {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly i18n: I18nService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const request = ctx.getContext().req
		const lang = request.language || DEFAULT_LANGUAGE

		const user_not_authorized = this.i18n.t('common.user_not_authorized', { lng: lang }) as string

		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException(user_not_authorized)
		}

		const user = await this.prismaService.user.findUnique({
			where: { id: request.session.userId },
		})
```

*Работа сессий (сохранение/удаление):*
```ts
import type { Request } from 'express'

import { DEFAULT_LANGUAGE, i18n } from '@/core'
import { InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { User } from '@prisma/__generated__'

import type { ISessionMetadata } from '../types'

/**
 * Save user session and set userId, metadata, createdAt
 * @param req - request
 * @param user - current user
 * @param metadata - user's metadata
 * @returns - user
 */
export function saveSession(req: Request, user: User, metadata: ISessionMetadata) {
	const lang = req.language || DEFAULT_LANGUAGE
	return new Promise((resolve, reject) => {
		req.session.createdAt = new Date()
		req.session.userId = user.id
		req.session.metadata = metadata

		req.session.save(err => {
			if (err) {
```

**Конфигурация GraphQL и приложения**
- `getGraphQLConfig()` задаёт путь (`GRAPHQL_PREFIX`), автогенерацию схемы (`schema.gql`), сортировку и прокидывает `language` в контекст.
- `main.ts` подключает JSON парсер, i18n‑middleware, cookieParser, upload‑middleware, **sessionConfig(redis)**, CORS (origin — из `CLIENT_URL`, cookie — `credentials: true`), глобальный `ValidationPipe`.

**DDD/тактики**
- Явного DDD нет; доменная логика сосредоточена в `account/session` сервисах. Доменные события/outbox отсутствуют.

**Конфигурация и 12‑Factor**
- `.env` → все параметры (Postgres/Redis/секреты/внешние сервисы). Профили окружений не разведены, feature‑flags отсутствуют.

**Работа с БД и транзакции**
- Prisma используется напрямую из сервисов; транзакций/Unit of Work нет — стоит добавить в местах, где несколько мутаций.

**Интеграции/ретраи/таймауты**
- HTTP‑клиентов нет (на будущее: SendGrid/Cloudinary/Telegram). Политики retry/backoff/circuit breaker отсутствуют.

**Асинхронность**
- Очереди/планировщики отсутствуют. Redis — только для сессий.

**Обработка ошибок и ответы**
- Исключения Nest (`ConflictException`, `UnauthorizedException`) → в GraphQL мапятся в стандартные ошибки. Единого «error envelope» нет (для REST было бы актуально; для GraphQL — ok).

**Роутинг и версии API**
- Только GraphQL, версионирование схемы не описано (поддержка нескольких схем/типовых версий отсутствует).

## 🔌 API и данные

**Контракты**
- **GraphQL schema** автогенерируется из декораторов (`@ObjectType`, `@InputType`). Файл `src/core/graphql/schema.gql` присутствует; OpenAPI/REST — отсутствует.

**Примеры входов/выходов**
*LoginInput (валидации нет — зона роста):*
```ts
import { User } from '@/modules/auth'
import { Field, InputType, ObjectType } from '@nestjs/graphql'

@InputType()
export class LoginInput {
	@Field(() => String)
	email: string

	@Field(() => String)
	password: string
}

@ObjectType()
export class LoginResponse {
	@Field(() => User, { nullable: true })
	user?: User
}
```

*CreateAccountInput (валидации есть):*
```ts
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MinLength } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateAccountInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
	fullName: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@IsPhoneNumber()
	phone: string
}
```

**Схема данных (Prisma, PostgreSQL)**
```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider      = "prisma-client-js"
  output        = "./__generated__"
  binaryTargets = ["native", "debian-openssl-3.0.x", "windows"]
}

datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_URL")
}

model User {
  id String @id @default(uuid())

  // TODO: add fields for profile
  fullName  String  @map("full_name")
  firstName String? @map("first_name")
  lastName  String? @map("last_name")
  phone String? @unique
  email String  @unique
  
  password  String

  tokens Token[]
```

- Модели: `User`, `Token` (+ перечисление `ETokenType`), с датами `createdAt/updatedAt`, уникальные `email/phone`.
- Часть расширенной схемы (`Profile`, `Role`, `UserRole`, `AuthSettings`, `SocialLink`) присутствует в комментариях — планируемое развитие.
- Индексы/констрейнты: уникальные поля отмечены; составные индексы не заданы.

**Миграции/сиды**
- Папки `prisma/migrations` нет — миграции ещё не сгенерированы (`npx prisma migrate dev`). Сиды отсутствуют.

**Кэширование**
- Нет прикладного кэша (только сессии). На будущее: cache‑aside для справочников, rate‑limiting tokens в Redis.

**Консистентность**
- Сильная консистентность БД (единственная Postgres). В коде нет явного управления уровнем изоляции; для сложных операций — добавить транзакции.

## 🔒 Безопасность

- **AuthN/AuthZ**: логин по email/password → `argon2` → сохранение `session.userId` в Redis. Гард проверяет сессию и загружает `user` в `req`.
- **Роли/права**: RBAC пока отсутствует (в схеме Role закомментирован). Декоратор `@Authorized()` позволяет доставать текущего пользователя/поля из контекста.
- **Валидация**: `class-validator` подключён, но **не везде** — `LoginInput` без декораторов. Рекомендуется добавить `@IsEmail`, `@MinLength` и т. п.
- **Headers/TLS**: `helmet`, `HSTS`, `rate limiting` отсутствуют. CORS ограничен до `CLIENT_URL`, cookies httpOnly/secure/sameSite настраиваются через `.env`.
- **CSRF**: при session‑based auth для GraphQL целесообразно double‑submit cookie или origin‑проверку.
- **Секреты**: **реальные ключи в `.env`** (почта/Cloudinary/Telegram). Требуется немедленная ротация и перенос в секрет‑менеджер (KMS/Vault/Cloud Secrets). `.env.example` пустой — добавить перечень переменных без значений.
- **SCA**: автоматические сканы/Dependabot не настроены (в репозитории не видно).

## 📈 Наблюдаемость и производительность

- **Логи**: стандартные Nest‑логи; структурированных логов (pino/winston) нет. Корреляция trace/request id — отсутствует.
- **Метрики/Хелсчеки**: пакеты Terminus подключены, но health‑эндпоинта нет. Метрик Prometheus/OTel нет.
- **Трейсинг**: OTel/Jaeger отсутствуют.
- **Пулы/профилирование**: управляет Prisma (db pool), настройки по умолчанию. Redis клиент единственный (singleton).

## ✅ Качество кода и тесты

- **ESLint/Prettier**: настроены (есть .eslintrc.js), форматирование консистентно.
- **SOLID/структура**: модули логично разнесены; типы/модели отделены; сервисы не перегружены.
- **Типизация**: строгий TS; для GraphQL моделей местами `password` размечен как `@Field()` — не стоит возвращать пароль во внешнюю схему.
- **Тесты**: unit для `account` resolver/service (Jest). Интеграционных/e2e/контрактных тестов нет. Testcontainers для Postgres/Redis не используется.

## 🚚 Инфраструктура и CI/CD

- **Запуск**: `nest start`/`start:dev`; `.env` читается из `backend/.env` (см. `main.ts`), что отличается от стандартного `.env` в корне — учтите в Docker.
- **Контейнеризация**: Dockerfile/Compose в архиве отсутствуют (пустые). Нужна multi‑stage сборка, non‑root user, `HEALTHCHECK`, переменные окружения.
- **Оркестрация**: нет Helm/Manifests. Конфиги и секреты нужно перенести в K8s Secrets/ConfigMap.
- **CI/CD**: pipeline не найден. Предложение: GitHub Actions → lint+test+build → prisma migrate → build/push image → deploy. SCA/secret‑scan включить.

## 🔧 Ключевые модули

### 1) `Account` (создание пользователя)
**Роль:** регистрация, хранение и выдача профиля. **Зависимости:** Prisma, i18n, argon2.

```ts
import { hash, verify } from 'argon2'

import { I18nService, PrismaService } from '@/core'
import { ConflictException, Injectable } from '@nestjs/common'

import { CreateAccountInput } from './inputs'
import { User } from './models'

@Injectable()
export class AccountService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly i18n: I18nService,
	) {}

	/**
	 * Create a new user
	 * @param data - The data for the new user
	 * @param language - The language of the user
	 * @returns The new user
	 */
	async create(data: CreateAccountInput, language: string): Promise<User> {
		const user = await this.prisma.user.findUnique({ where: { email: data.email } })
		if (user) {
			throw new ConflictException(this.i18n.t('auth.user_already_exists', { lng: language }))
```

**Публичные методы:** `create(data, lang)`, `findProfile(lang, id)`.

### 2) `Session` (логин/логаут, сессии в Redis)
**Роль:** аутентификация, управление cookie‑сессией. **Зависимости:** ConfigService, RedisService, Prisma.

```ts
import { User } from '@/modules/auth'
import { Field, InputType, ObjectType } from '@nestjs/graphql'

@InputType()
export class LoginInput {
	@Field(() => String)
	email: string

	@Field(() => String)
	password: string
}

@ObjectType()
export class LoginResponse {
	@Field(() => User, { nullable: true })
	user?: User
}
```

**Публичные методы:** `login(req, data, lang, userAgent)`, `logout(req)`.

### 3) `GqlAuthGuard` (глобальный гард для GraphQL)
**Роль:** авторизация резолверов по наличию сессии и пользователя. **Интеграции:** Prisma (чтение пользователя), i18n.

```ts
import { DEFAULT_LANGUAGE, I18nService, PrismaService } from '@/core'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class GqlAuthGuard implements CanActivate {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly i18n: I18nService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const request = ctx.getContext().req
		const lang = request.language || DEFAULT_LANGUAGE

		const user_not_authorized = this.i18n.t('common.user_not_authorized', { lng: lang }) as string

		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException(user_not_authorized)
		}

		const user = await this.prismaService.user.findUnique({
			where: { id: request.session.userId },
		})
```

### 4) `PrismaService` (инфра‑адаптер БД)
**Роль:** lifecycle `$connect/$disconnect`, DI клиента. **Используется** во всех сервисах домена.

```ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/__generated__'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	// Connect with db
	async onModuleInit(): Promise<void> {
		await this.$connect()
	}
	// Disconnect with db
	async onModuleDestroy(): Promise<void> {
		await this.$disconnect()
	}
}
```

## ⚠️ Риски и техдолг

**Быстрые победы (quick wins)**
- Удалить `password` из GraphQL `User` модели; возвращать только безопасные поля.
- Добавить валидацию в `LoginInput` (`@IsEmail()`, `@MinLength(8)`) и везде, где её нет.
- Включить `helmet`, `@nestjs/throttler` (rate limiting), ограничить CORS (точные origin, методы).
- Вынести секреты из `.env` → секрет‑менеджер; **срочная ротация** уже засветившихся ключей.
- Добавить `error formatting` для GraphQL (скрывать stack/внутренние детали в проде).

**Среднесрочно**
- Ввести **RBAC** (Role/Permission) — модель есть в комментариях Prisma; добавить декораторы `@Roles()` и Guard.
- Сформировать **миграции Prisma**, придумать стратегию expand/contract и сиды (admin user).
- Обновить/удалить неиспользуемые зависимости (`@nestjs/typeorm`, Terminus, Swagger) либо начать использовать.
- Структурные логи (pino), **requestId** middleware, базовые бизнес‑метрики (логины, регистрация, ошибки).
- Интеграционные и e2e‑тесты с **Testcontainers** (Postgres/Redis).

**Долгосрочно**
- Внешние интеграции (SendGrid/Cloudinary/Telegram) — клиент, ретраи с jitter, таймауты, идемпотентные ключи.
- Idempotency для мутаций (например, регистрация с повторной доставкой писем).
- Outbox паттерн для рассылок/событий, если пойдут Kafka/очереди.
- Перейти на JWT (access/refresh) либо оставить session‑based, но закрыть CSRF/rotation/TTL‑политики.

**Single Points of Failure**
- Единственный экземпляр Redis/DB (по коду) — при проде нужен кластер/HA/мониторинг.
- Отсутствие таймаутов к Redis/DB в коде — настроить на уровне клиента/ORM.

## 📋 Выводы и рекомендации

**Уровень сложности:** **middle‑friendly** — стек и архитектура стандартны для NestJS, но присутствуют инфраструктурные аспекты (Redis/Prisma/i18n), требующие опыта.

**Приоритетные шаги (MVP‑готовность)**
1. Безопасность: убрать `password` из GraphQL, добавить валидации, `helmet`/rate‑limit, ротация секретов.
2. Данные: сгенерировать Prisma‑миграции, сид admin, транзакции в критичных местах.
3. Auth: довести login/logout, унифицировать ответы/ошибки, защитить CSRF для session‑based.
4. DX/CI: GitHub Actions (lint+test+build+migrate), Docker multi‑stage, образ non‑root, HEALTHCHECK.
5. Наблюдаемость: структурные логи, requestId, health‑эндпоинт (Terminus), базовые метрики.

---

**Файл подготовлен автоматически.**
