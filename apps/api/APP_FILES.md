`/`
Корень репозитория: конфигурация окружения (`.env`), package-скрипты (`package.json`, `bun.lock`), документация (`README.md`, `ROADMAP.md`, `CHANGELOG.md`, `backend.md`), настройки TypeScript/линтеров и общие инфраструктурные файлы (.gitignore, tsconfig*).
___

`code/`
Архивные выгрузки и вспомогательные Markdown-файлы (например, разбитые дампы исходников `full_app_without_full_coer_part*.md`) для ревью и переноса кода.
___

`docker/`
Dockerfile-ы и compose-конфигурации для локального и продакшен-развёртывания сервиса.
___

`docs/`
Живая проектная документация (архитектура, инструкции по безопасности и интеграциям), синхронизированная с ROADMAP.
___

`prisma/`
Схема базы данных Prisma (`schema.prisma`), миграции и сиды, используемые сервисами в `src/core/prisma`.
___

`scripts/`
CLI-скрипты (сборка, деплой, вспомогательные утилиты) для поддержки CI/CD и обслуживания проекта.
___

`src/main.ts`
Точка входа NestJS: инициализация `CoreModule`, глобальных middleware (helmet, сессии, i18n), пайпов валидации и старт HTTP-сервера.
___

`src/core/core.module.ts`
Главный модуль инфраструктуры: собирает конфигурацию, GraphQL, Redis, Prisma, i18n и прикладные модули (Auth, Notification, Security).
___

`src/core/core.service.ts`
Базовый сервис со встроенными зависимостями (Prisma, Redis, Config, I18n) и набором вспомогательных методов для наследования в доменных сервисах.
___

`src/core/config/*`
Конфигурационные файлы приложения: HTTP/helmet (`security`), GraphQL, mailer, сессии, пути и ENV-провайдеры, считываемые в `CoreModule`.
___

`src/core/i18n/*`
Модуль локализации: настройка i18next, пайпы валидации, сервис локализации и словари (`locales/en`, `locales/ru`) для сообщений ошибок и шаблонов.
___

`src/core/prisma/*`
Интеграция с Prisma: модуль/сервис для DI, вспомогательные функции посева данных и точка подключения к базе.
___

`src/core/redis/*`
Обёртка над Redis: модуль, сервис и общий интерфейс подключения для rate limiting, сессий и других кэширующих задач.
___

`src/modules/auth/*`
Полный стек аутентификации: аккаунты, сессии, восстановление, двухфакторная авторизация (TOTP/OTP/WebAuthn), верификация email/OTP и DTO/модели GraphQL.
___

`src/modules/libs/mail/*`
Глобальный модуль отправки писем: провайдеры (SMTP, SendGrid, Brevo), сервис уведомлений и React-email шаблоны для auth/2FA.
___

`src/modules/libs/sms/*`
Twilio‑клиент для SMS-уведомлений и OTP (проверка отправляемости, шаблоны сообщений, обработка ошибок).
___

`src/modules/notification/*`
Централизованный `NotificationService`: отправка email/SMS, логирование, rate-limit уведомлений, интеграция с Mail/SMS и Redis.
___

`src/modules/rbac/*`
RBAC-инфраструктура: декоратор `@Roles`, `RolesGuard`, типы и глобальный модуль для проверки ролей `EUserRole`.
___

`src/modules/security/*`
Подсистемы безопасности (например, `account-lock`, конфиги секьюрити-хедеров) для anti-bruteforce и интеграции с rate limiting.
___

`src/modules/security-event/*`
Глобальный модуль логирования security-событий: сервис записи в БД, расчёт риск-оценки и предоставление API для анализа.
___

`src/shared/*`
Переиспользуемые элементы: кастомные декораторы, guards, Nest-middleware, pipes, общие типы и утилиты (hashing, токены, session helpers, error logging).
___

`test/*`
Интеграционные и E2E-тесты (Nest TestingModule, сценарии проверки auth/security), синхронизированные с roadmap-целями.
___
