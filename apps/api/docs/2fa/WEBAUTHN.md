# WebAuthn/Passkeys Integration Guide

> **Коротко:** WebAuthn — это стандарт W3C, позволяющий входить без пароля с помощью биометрии, аппаратных ключей и платформенных аутентификаторов (Passkeys). Ниже — полный гайд по внедрению: бекенд (GraphQL API + хранение), фронтенд (ceremony через `@simplewebauthn/browser`), безопасность, совместимость, отладка и лучшие практики.

---

## 📚 Обзор

**WebAuthn (Web Authentication)** — технология FIDO2, обеспечивающая:
- **Passwordless** (вход без пароля),
- **2FA/Многофакторность** (совместно с паролем/OTP),
- **Phishing‑resistance** (привязка к домену RP ID).

Поддерживаются **платформенные аутентификаторы** (Passkeys на устройствах) и **кроссплатформенные ключи** (например, YubiKey).

---

## 🔐 Поддерживаемые методы аутентификации

### Платформенные аутентификаторы (Passkeys)
- **Touch ID / Face ID** (Apple)
- **Windows Hello** (Windows 10/11)
- **Android Biometrics** (Android 7.0+)
- **Chrome Profile Passkeys** (синхронизация между устройствами)

### Кроссплатформенные аутентификаторы (Security Keys)
- **YubiKey** (USB, NFC, Lightning)
- **Google Titan**
- **Feitian**
- **Любой FIDO2‑совместимый ключ**

---

## 🧭 Потоки (Flows)

```text
Регистрация (Create / Attestation)
Client                Backend (RP)               Authenticator
  |   1) запрос options  |                               |
  |--------------------->|  генерирует challenge         |
  |                      |  и параметры регистрации      |
  |   2) options         |                               |
  |<---------------------|                               |
  |   3) navigator.credentials.create(options)           |
  |------------------------------>[биометрия/ключ]       |
  |   4) attestation response                             |
  |<------------------------------                        |
  |   5) отправка ответа                                  |
  |--------------------->| verify, сохранить credential   |
  |   6) ok/ошибка       |                               |
  |<---------------------|                               |

Аутентификация (Get / Assertion)
Client                Backend (RP)               Authenticator
  |   1) запрос options  |                               |
  |--------------------->|  challenge + allowCredentials |
  |   2) options         |                               |
  |<---------------------|                               |
  |   3) navigator.credentials.get(options)              |
  |------------------------------>[биометрия/ключ]       |
  |   4) assertion response                              |
  |<------------------------------                        |
  |   5) отправка ответа                                  |
  |--------------------->| verify counter/signature       |
  |   6) ok/ошибка       |                               |
  |<---------------------|                               |
```

---

## 🧱 Backend API (GraphQL)

> Бекенд — генерация/верификация **challenge**, проверка подписи, хранение credential и счётчиков (counter).

### 🔧 Регистрация

#### 1) Start Registration

```graphql
mutation StartWebAuthnRegistration($data: StartWebAuthnRegistrationInput) {
  startWebAuthnRegistration(data: $data) {
    challengeId
    options
    rpName
    rpId
    userDisplayName
  }
}
```

**Variables**
```json
{
  "data": {
    "authenticatorName": "YubiKey 5C",
    "authenticatorAttachment": "cross-platform",
    "preferPlatform": false
  }
}
```

#### 2) Complete Registration

```graphql
mutation CompleteWebAuthnRegistration($data: CompleteWebAuthnRegistrationInput!) {
  completeWebAuthnRegistration(data: $data) {
    success
    methodId
    credentialId
    authenticatorName
    isPlatform
    isBackedUp
    backupCodes
    message
  }
}
```

**Variables**
```json
{
  "data": {
    "challengeId": "challenge-id-from-step-1",
    "response": { "/* WebAuthn response object */": true },
    "authenticatorName": "YubiKey 5C"
  }
}
```

### 🔑 Аутентификация

#### 1) Start Authentication

```graphql
query StartWebAuthnAuthentication($data: StartWebAuthnAuthenticationInput) {
  startWebAuthnAuthentication(data: $data) {
    challengeId
    options
    rpId
    credentialCount
  }
}
```

**Variables (optional)**
```json
{
  "data": {
    "credentialId": "specific-credential-id",
    "email": "user@example.com"
  }
}
```

#### 2) Complete Authentication

```graphql
mutation CompleteWebAuthnAuthentication($data: CompleteWebAuthnAuthenticationInput!) {
  completeWebAuthnAuthentication(data: $data) {
    success
    credentialId
    authenticatorName
    counter
    message
  }
}
```

**Variables**
```json
{
  "data": {
    "challengeId": "challenge-id-from-step-1",
    "response": { "/* WebAuthn response object */": true }
  }
}
```

### 🧰 Операции управления

#### Список credential‑ов

```graphql
query MyWebAuthnCredentials {
  myWebAuthnCredentials {
    id
    credentialId
    name
    isPlatform
    isBackedUp
    transports
    lastUsedAt
    useCount
    createdAt
  }
}
```

#### Удаление credential‑а

```graphql
mutation RemoveWebAuthnCredential($data: RemoveWebAuthnCredentialInput!) {
  removeWebAuthnCredential(data: $data) {
    success
    message
  }
}
```

**Variables**
```json
{
  "data": {
    "credentialId": "credential-to-remove",
    "password": "user-password"
  }
}
```

---

## 🖥️ Frontend (TypeScript)

### Установка

```bash
npm install @simplewebauthn/browser
```

### Пример: Регистрация

```ts
import { startRegistration } from '@simplewebauthn/browser';

export async function registerWebAuthn() {
  try {
    // 1) Получаем options с бэка
    const { data } = await graphqlClient.mutate({
      mutation: START_WEBAUTHN_REGISTRATION,
      variables: {
        data: { authenticatorName: 'My Security Key', preferPlatform: true }
      }
    });

    const { challengeId, options } = data.startWebAuthnRegistration;

    // 2) Запускаем ceremony на клиенте
    const attResp = await startRegistration(options);

    // 3) Отправляем ответ на бэк
    const result = await graphqlClient.mutate({
      mutation: COMPLETE_WEBAUTHN_REGISTRATION,
      variables: {
        data: {
          challengeId,
          response: attResp,
          authenticatorName: 'My Security Key'
        }
      }
    });

    if (result.data.completeWebAuthnRegistration.success) {
      const { backupCodes } = result.data.completeWebAuthnRegistration;
      showBackupCodes(backupCodes);
    }
  } catch (error: any) {
    if (error?.name === 'NotAllowedError') {
      console.error('User cancelled or timeout');
    } else {
      console.error('Registration failed:', error);
    }
  }
}
```

### Пример: Аутентификация

```ts
import { startAuthentication } from '@simplewebauthn/browser';

export async function authenticateWebAuthn() {
  try {
    // 1) Получаем options с бэка
    const { data } = await graphqlClient.query({
      query: START_WEBAUTHN_AUTHENTICATION,
      variables: { data: { email: 'user@example.com' } } // опционально
    });

    const { challengeId, options } = data.startWebAuthnAuthentication;

    // 2) Ceremony: assertion
    const asseResp = await startAuthentication(options);

    // 3) Верификация на бэке
    const result = await graphqlClient.mutate({
      mutation: COMPLETE_WEBAUTHN_AUTHENTICATION,
      variables: { data: { challengeId, response: asseResp } }
    });

    if (result.data.completeWebAuthnAuthentication.success) {
      window.location.href = '/dashboard';
    }
  } catch (error) {
    console.error('Authentication failed:', error);
  }
}
```

### Условный UI

```ts
export function isWebAuthnSupported(): boolean {
  return !!(
    navigator.credentials &&
    navigator.credentials.create &&
    navigator.credentials.get &&
    (window as any).PublicKeyCredential
  );
}

export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isWebAuthnSupported()) return false;
  return (window as any).PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
}

export async function renderAuthOptions() {
  const webauthnSupported = isWebAuthnSupported();
  const platformAvailable = await isPlatformAuthenticatorAvailable();

  if (platformAvailable) showPasskeyOption();           // Face ID / Touch ID / Windows Hello
  if (webauthnSupported) showSecurityKeyOption();       // Security Key
}
```

---

## 🛡️ Безопасность и хранение

### Challenge‑менеджмент
- ⏱️ TTL: истекает через **5 минут**; **одноразовый**.
- 🧠 Хранение: **Redis** с TTL.
- 🔁 Повторное использование исключено.

### Хранение credential
- 🔐 Публичные ключи — **шифрование at rest**.
- 🆔 `credentialId` — **уникален** в системе.
- 📈 Контроль `counter` — защита от **replay / клонирования**.

### Верификация пользователя (User Verification)
- **Платформенные** аутентификаторы: как правило, **требуют** UV (биометрия/PIN).
- **Кроссплатформенные**: UV **может** быть опционален.
- Политика задаётся конфигом: `USER_VERIFICATION = required|preferred|discouraged`.

### Настройки окружения (пример)
```env
WEBAUTHN_RP_ID=example.com           # RP ID = ваш домен
WEBAUTHN_RP_NAME=Your App            # Название в системных диалогах
WEBAUTHN_ORIGIN=https://example.com  # Полный origin (https обязателен)
USER_VERIFICATION=preferred          # required|preferred|discouraged
CHALLENGE_TTL_SEC=300
```

### Модель хранения (пример Prisma)
```prisma
model AuthenticationMethod {
  id             String   @id @default(cuid())
  userId         String
  type           String   // 'WEBAUTHN' и др.
  name           String?
  credentialId   String?  @unique
  publicKey      Bytes?
  transports     String[]
  isPlatform     Boolean  @default(false)
  isBackedUp     Boolean  @default(false)
  counter        Int      @default(0)
  lastUsedAt     DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

---

## 🧪 Совместимость браузеров и платформ

| Платформа/Браузер         | Поддержка          |
| ------------------------- | ------------------ |
| **Chrome / Edge 67+**     | Полная             |
| **Firefox 60+**           | Полная             |
| **Safari 14+ (macOS)**    | Полная             |
| **iOS Safari 14.5+**      | Face ID / Touch ID |
| **Chrome Android 70+**    | Fingerprint        |
| **Samsung Internet 9.2+** | Поддерживается     |
| **Windows 10 1903+**      | Windows Hello      |
| **macOS 11+**             | Touch ID           |
| **Android 7.0+**          | Fingerprint/Face   |

> ⚠️ В продакшене необходим HTTPS (локально — исключение для `http://localhost`).

---

## 🧭 Troubleshooting

### Частые ошибки и решения
- **`NotAllowedError` (регистрация/логин)**  
  Пользователь отменил действие или таймаут (обычно ~60 сек). Повторите ceremony.
- **`InvalidStateError`**  
  Аутентификатор уже зарегистрирован. Проверьте `excludeCredentials` при регистрации.
- **`NotSupportedError`**  
  Браузер/среда не поддерживают WebAuthn, либо нет HTTPS.
- **`SecurityError`**  
  Несоответствие **RP ID**/**origin**, попытка использовать неподдерживаемый домен.

### Советы по отладке
- Консоль браузера содержит подробную ошибку.
- Проверьте HTTPS и корректный `WEBAUTHN_ORIGIN`.
- RP ID должен совпадать с доменом.  
- Chrome DevTools: `chrome://webauthn-internals` (эмуляция и диагностика).

---

## ✅ Best Practices

### UX
- **Progressive Enhancement:** сначала проверяйте поддержку — и только потом показывайте опции.
- **Чёткие ярлыки:** «Войти с Face ID / Touch ID / Windows Hello» вместо абстрактного «биометрия».
- **Фоллбеки:** всегда держите пароль/OTP как резервный вариант.
- **Backup Codes:** напоминайте сохранить резервные коды после регистрации.

### Security
- **User Presence/Verification:** проверяйте флаги UP/UV при верификации.  
- **Monitor Counters:** контролируйте рост `counter` — аномалии = тревога.  
- **Rate Limit:** ограничивайте попытки.  
- **Audit:** логируйте регистрацию/вход в `SecurityEvent`.

### Implementation
- **Ошибки:** возвращайте понятные сообщения и коды.  
- **Таймауты:** показывайте прогресс в системных диалогах.  
- **Кросс‑браузерность:** тестируйте на целевых платформах.  
- **A11y:** поддержка клавиатуры и СКУ.

---

## 🔄 Миграция от паролей (стратегия)

1) **Фаза 1:** WebAuthn как второй фактор  
   — Сохраняем парольный вход; WebAuthn — для чувствительных операций.

2) **Фаза 2:** Passwordless по желанию пользователя  
   — Разрешаем вход только по WebAuthn (пароль — как резерв).

3) **Фаза 3:** По умолчанию — passwordless  
   — Новым пользователям предлагаем WebAuthn сразу; существующих мигрируем постепенно.

4) **Фаза 4:** Пароль опционален  
   — WebAuthn — основной способ; пароль — для восстановления.

---

## 📎 Ресурсы

**Спецификации**
- W3C WebAuthn
- FIDO2

**Библиотеки**
- `@simplewebauthn/server`
- `@simplewebauthn/browser`

**Инструменты**
- WebAuthn.io — демо
- WebAuthn.guide — визуальный гайд
- `chrome://webauthn-internals` — отладка в Chrome

**Аппаратные ключи**
- YubiKey
- Google Titan
- Feitian

> ℹ️ Названия приведены для ориентира; интегрируйте в соответствии с вашей политикой и инфраструктурой.

---

## 🛠️ Финальная чек‑лист‑инструкция

### 1) Установить зависимости
```bash
npm install @simplewebauthn/server @simplewebauthn/typescript-types graphql-type-json @simplewebauthn/browser
```

### 2) Создать файлы
```
src/modules/auth/2fa/services/webauthn.service.ts
src/modules/auth/2fa/dtos/webauthn.dto.ts
src/modules/auth/2fa/models/webauthn.model.ts
docs/2fa/WEBAUTHN.md
```

### 3) Обновить существующие модули
- Добавить WebAuthn endpoints в `2fa.resolver.ts`  
- Обновить экспорты в `services/index.ts`, `dtos/index.ts`, `models/index.ts`  
- Подключить `WebAuthnService` в `2fa.module.ts`

### 4) Перезапустить приложение и проверить логи

```text
🤖 WebAuthn Service initialized
🔐 Endpoints: start/complete registration, start/complete authentication
```

---

## 📎 Приложение A — Пример DTO/Model (упрощённо)

```ts
// src/modules/auth/2fa/dtos/webauthn.dto.ts
export class StartWebAuthnRegistrationInput {
  authenticatorName?: string;
  authenticatorAttachment?: 'platform' | 'cross-platform';
  preferPlatform?: boolean;
}

export class CompleteWebAuthnRegistrationInput {
  challengeId!: string;
  response!: unknown; // тип из @simplewebauthn/typescript-types
  authenticatorName?: string;
}

export class StartWebAuthnAuthenticationInput {
  credentialId?: string;
  email?: string;
}

export class CompleteWebAuthnAuthenticationInput {
  challengeId!: string;
  response!: unknown;
}
```

```ts
// src/modules/auth/2fa/models/webauthn.model.ts
export class WebAuthnCredentialModel {
  id!: string;
  credentialId!: string;
  name?: string;
  isPlatform!: boolean;
  isBackedUp!: boolean;
  transports!: string[];
  lastUsedAt?: Date;
  useCount!: number;
  createdAt!: Date;
}
```

---

## 🧩 Примечания по безопасности интеграции

- RP ID = **точно** домен (без схемы/порта), например `example.com`.
- Origin должен быть **https://example.com** (включая схему).
- `excludeCredentials` при регистрации исключает повторную привязку того же ключа.
- При аутентификации используйте `allowCredentials` для таргетинга известных credential‑ов пользователя (или пустой список — для свободного выбора).
- Обязательно проверяйте: **подпись**, **challenge**, **origin**, **rpId**, **counter**.

---

> Готово! Документ можно поместить в `docs/2fa/WEBAUTHN.md` и ссылаться из общего `GRAPHQL_API.md` и `README.md`.
