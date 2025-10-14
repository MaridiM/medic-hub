### **[НАЧАЛО ПРОМПТА ДЛЯ ГЕНЕРАЦИИ COMMIT MESSAGE]**

**[РОЛЬ]**
Ты — ассистент по написанию Git коммитов. Твоя задача — создать идеальное commit message на основе предоставленного списка изменений, следуя строгому формату **Conventional Commits**. Сообщение должно быть на **английском языке**.

**[КОНТЕКСТ]**
Я только что завершил работу над большой фичей или набором исправлений. Мне нужно, чтобы ты сгенерировал для этого коммит, который будет понятен другим разработчикам, легко читаем в истории Git и подходит для автоматической генерации changelog'ов.

**[ТРЕБОВАНИЯ К ФОРМАТУ]**

1.  **Заголовок (Subject):**
    *   Формат: `type(scope): short description`
    *   `type`: `feat` (новая фича), `fix` (исправление бага), `refactor` (рефакторинг), `docs` (документация), `test` (тесты), `chore` (прочие изменения).
    *   `scope`: Область изменений (например, `auth`, `2fa`, `core`, `api`).
    *   `short description`: Краткое описание в настоящем времени (например, `implement unified 2FA module`, а не `implemented...`).
    *   Длина: не более 72 символов.

2.  **Тело (Body):**
    *   **Вступление:** Начните с одного-двух предложений, описывающих, **что** было сделано и **почему** это важно.
        *   *Пример:* `This commit introduces a comprehensive, unified Two-Factor Authentication (2FA) system. It replaces the previous separate and limited modules with a single, powerful solution.`
    *   **Секция "Key Features Implemented" (для `feat`):**
        *   Используйте Markdown-списки с эмодзи (✅) или звездочками (*).
        *   Сгруппируйте фичи по логическим блокам (например, `Unified 2FA Core`, `Device Trust`, `GraphQL API`).
        *   Кратко опишите каждую фичу.
    *   **Секция "Bug Fixes" (для `fix`):**
        *   Опишите, какая проблема была решена.
        *   Укажите причину ошибки, если она известна.
    *   **Секция "Technical Details & Refactoring" (опционально):**
        *   Упомяните важные технические решения, рефакторинг, исправления типизации и т.д.
        *   *Пример:* `Resolved numerous TypeScript errors related to Prisma.JsonValue casting and dependency injection.`

3.  **Подвал (Footer):**
    *   **BREAKING CHANGE:** Если есть обратно несовместимые изменения, опишите их здесь, начиная с `BREAKING CHANGE:`.
    *   **Resolves:** Укажите номер задачи в трекере (например, `Resolves: #123`, `Closes: TICKET-456`).

**[ПРИМЕР ИДЕАЛЬНОГО КОММИТА]**

```markdown
feat(auth): implement enterprise-grade unified 2FA module

This commit introduces a comprehensive, unified Two-Factor Authentication (2FA) system designed for enterprise-level security, scalability, and maintainability.

### Key Features Implemented:

- **Unified 2FA Core:**
  - `AuthenticationMethod` model in Prisma to support multiple 2FA methods per user.
  - `TwoFactorMethodService` to orchestrate all 2FA operations.

- **Device Trust & Risk Assessment:**
  - `TrustedDevice` model and `DeviceTrustService` to manage trusted devices.
  - `RiskCalculatorUtil` for real-time risk scoring.

- **Complete GraphQL API:**
  - Implemented `TwoFactorResolver` with a full suite of queries and mutations.

### Technical Details & Refactoring:

- All new code is strictly typed (zero `any` types).
- Resolved dependency injection issues in `MailModule`.
- The entire module is now fully documented with JSDoc and Markdown files.

Resolves: #42
```

**[ЗАДАЧА]**
Проанализируй следующий список изменений и сгенерируй для него commit message в указанном формате.

---markdown
**СПИСОК ИЗМЕНЕНИЙ:**

[**Здесь вставьте краткое описание того, что вы сделали. Чем детальнее, тем лучше.**]

**Пример 1 (для новой фичи):**
*   *Тип коммита: `feat`*
*   *Область: `admin`*
*   *Изменения: Я создал новый модуль для админ-панели. Добавил `AdminResolver` с мутацией `disableUser2FA`. Защитил его гардом по роли 'ADMIN'. Добавил логирование всех действий в `SecurityEventService`. Также написал unit-тесты для нового сервиса и обновил `README.md`.*

**Пример 2 (для исправления бага):**
*   *Тип коммита: `fix`*
*   *Область: `2fa`*
*   *Изменения: Я исправил ошибку в `TwoFactorMethodService`, где при регенерации резервных кодов логировалось неправильное событие (`TWO_FA_BACKUP_CODE_USED`). Я добавил новый enum `TWO_FA_BACKUP_CODES_REGENERATED` в `schema.prisma`, применил миграцию и обновил вызов `securityEventService.logEvent` на правильный.*

---

**[ФИНАЛЬНАЯ ИНСТРУКЦИЯ]**
Сгенерируй только текст коммита (заголовок, тело, подвал) без лишних объяснений. Убедись, что он соответствует всем требованиям и примерам.

### **[КОНЕЦ ПРОМПТА]**