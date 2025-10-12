# Troubleshooting Guide

Сборник типовых проблем и решений при работе с модулем 2FA.

## 📋 Содержание
- [Troubleshooting Guide](#troubleshooting-guide)
  - [📋 Содержание](#-содержание)
  - [Prisma / База данных](#prisma--база-данных)
    - [❗ Ошибка миграции P3018: `type "security_events" already exists`](#-ошибка-миграции-p3018-type-security_events-already-exists)
    - [Prisma migrate застрял после ошибки](#prisma-migrate-застрял-после-ошибки)
  - [Redis / Rate Limits](#redis--rate-limits)
    - [`ECONNREFUSED` или таймауты](#econnrefused-или-таймауты)
    - [Rate limit срабатывает слишком часто](#rate-limit-срабатывает-слишком-часто)
  - [TOTP / Время и коды](#totp--время-и-коды)
    - [Постоянно «Invalid code»](#постоянно-invalid-code)
    - [Миграция секретов](#миграция-секретов)
  - [Email / Доставка](#email--доставка)
  - [SMS / Twilio](#sms--twilio)
  - [Сессии / Куки](#сессии--куки)
  - [Device Trust](#device-trust)
  - [WebAuthn / Passkeys](#webauthn--passkeys)

---

## Prisma / База данных

### ❗ Ошибка миграции P3018: `type "security_events" already exists`

**Симптомы**  
При применении миграции в PostgreSQL:
```
ERROR: type "security_events" already exists
HINT: A relation has an associated type of the same name...
```

**Причина**  
В PostgreSQL имя **relation type** для таблицы/представления конфликтует с именем создаваемого **ENUM** или пользовательского типа. Например, уже есть таблица `security_events`, а миграция пытается создать `CREATE TYPE security_events AS ENUM (...)`.

**Решения (любой из вариантов):**

1) **Переименовать ENUM**  
Используйте уникальное имя, например `security_event_type`:
```sql
-- в SQL миграции
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'security_event_type') THEN
    CREATE TYPE security_event_type AS ENUM ('LOGIN_SUCCESS','TWO_FA_FAILED', 'IMPOSSIBLE_TRAVEL');
  END IF;
END $$;
```

2) **Переименовать таблицу журналов**  
Если таблица называется `security_events`, переименуйте её в `security_event_logs` и поправьте Prisma schema/код.

```sql
ALTER TABLE IF EXISTS security_events RENAME TO security_event_logs;
```

3) **Удалить конфликтующий TYPE (если точно не используется)**  
```sql
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'security_events') THEN
    DROP TYPE security_events;
  END IF;
END $$;
```

> ⚠️ **Примечание:** В PostgreSQL нет нативного `CREATE TYPE IF NOT EXISTS` для ENUM на старых версиях. Используйте `DO $$ ... $$`.

**После ручной правки:**  
- Обновите SQL миграции
- Выполните `prisma migrate resolve --applied <migration_name>` чтобы пометить миграцию применённой, если вы вносили изменения вручную
- Затем продолжайте обычные миграции

---

### Prisma migrate застрял после ошибки

```bash
npx prisma migrate resolve --rolled-back <migration_name>
# или
npx prisma migrate resolve --applied <migration_name>
```
Затем перезапустите миграции.

---

## Redis / Rate Limits

### `ECONNREFUSED` или таймауты

- Проверьте `REDIS_URL`
- Убедитесь, что Redis запущен и доступен из контейнера
- Проверьте firewall / docker network
- Включите логи подключения

### Rate limit срабатывает слишком часто

- Проверьте TTL ключей в Redis
- Удостоверьтесь, что ключ составной: `rate:<userId>:<action>`
- Для админов временно снижайте чувствительность в конфиге

---

## TOTP / Время и коды

### Постоянно «Invalid code»

- Устройство пользователя должно иметь корректное время (NTP)
- Допустимо добавить окно проверки ±1 период (30s):
```ts
// пример: допускаем предыдущий/следующий шаг
totp.validate({ token: code, window: 1 })
```
- Убедитесь, что секрет корректно раскодирован (Base32)

### Миграция секретов

Если раньше использовалось другое шифрование — корректно расшифруйте старым методом и снова зашифруйте новым перед записью.

---

## Email / Доставка

- Проверьте SPF/DKIM/DMARC
- Используйте короткий и понятный шаблон письма
- Не отправляйте код в теме письма
- Логи провайдера (SendGrid/Brevo/SMTP) помогут найти причину недоставки
- Для частых запросов включите антиспам-защиту (cooldown 60s)

Шаблон:
```
Subject: Your verification code

Your verification code is: 123456
This code expires in 5 minutes.
If you didn't request this, please ignore.
```

---

## SMS / Twilio

- Формат номера: `+<country><number>` (E.164)
- Проверьте статусы сообщений в Twilio Console
- Учитывайте 10DLC/отправителя для США
- В некоторых странах возможны ограничения на прием A2P
- Обрабатывайте ошибки доставки и повторную отправку с бэкоффом

---

## Сессии / Куки

- Убедитесь, что cookie **httpOnly**, **Secure**, с корректным **domain** и **SameSite**
- Частичная сессия при `requires2FA: true` не должна давать доступ к защищённым ресурсам
- После `verify2FA` помечайте сессию `is2FAVerified=true` и обновляйте срок жизни

---

## Device Trust

- DeviceId должен быть детерминированным, но не раскрывать PII
- При первом доверии инициализируйте `trustScore=50`, срок — 30 дней
- Снижайте score при подозрительной активности; при `score<75` требуйте 2FA
- Позволяйте пользователю отзывать устройства (revoke)

---

## WebAuthn / Passkeys

- RP ID должен соответствовать домену (`yourdomain.com`)
- В dev-режиме используйте `localhost` с корректным origin
- Не храните приватные ключи — хранится только публичная часть/креденшел
- Обрабатывайте кросс-доменные ограничения браузеров
