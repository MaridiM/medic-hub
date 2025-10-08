# Testing Guide

## Запуск тестов

```bash
# Все тесты
pnpm run test

# С покрытием
pnpm run test:cov

# Watch mode
pnpm run test:watch

# Только TOTP модуль
pnpm run test -- totp
```

## Структура тестов

- `__tests__/unit/` - Unit тесты
- `__tests__/integration/` - Integration тесты
- `__tests__/e2e/` - End-to-End тесты
- `__tests__/helpers/` - Вспомогательные функции

## Helpers

### Factories
```typescript
const user = createUser()
const userWithTotp = createUserWithTotp()
const backupCode = createBackupCode()
```

### Mocks
```typescript
const { prisma, redis, i18n, config } = createAllMocks()
```

## Примеры

См. существующие тесты в модуле `totp`.