# File: shared\utils\generate-token.util.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/shared/utils/generate-token.util.ts`

## Category
Backend

## File Type
TS (generate-token.util.ts)

## Size
1788 characters, 53 lines

## Full Code

```typescript
import { randomInt, randomUUID } from 'node:crypto'

import { PrismaService } from '@/core/prisma'
import { ETokenType, Token, type User } from '@prisma/__generated__'

const TOKEN_TTL_MS = 5 * 60 * 1000 // 5 минут

/**
 * Function for generation uuid or numeric code
 * Генерация токена (UUID или 6-значный код) и сохранение в БД.
 * Если для пары (userId, type) токен уже существует — заменяем на новый.
 * @param prisma - prisma service
 * @param user - current user
 * @param type - token type
 * @param isUUID - if true then generate uuid if false (default) generate numeric code from 6 letters
 * @returns return new token
 *
 * Требования к схеме (рекомендовано):
 *   - уникальный составной индекс: @@unique([userId, type], name: "token_user_type_unique")
 */
export async function generateToken(
	prisma: PrismaService,
	user: User,
	type: ETokenType,
	isUUID: boolean = true,
): Promise<Token> {
	const token = isUUID ? randomUUID() : generateNumericCode(6)
	const expiresIn = new Date(Date.now() + TOKEN_TTL_MS)

	// Если в схеме есть @@unique([userId, type]) — используем upsert.
	// Иначе — можешь оставить delete/create как было.
	return prisma.token.upsert({
		where: { userId_type: { userId: user.id, type } }, // <- имя поля под твой @@unique
		update: { token, expiresIn },
		create: {
			token,
			expiresIn,
			type,
			user: { connect: { id: user.id } },
		},
	})
}

/** Генератор криптографически стойкого числового кода нужной длины. */
function generateNumericCode(length: number): string {
	if (length <= 0) return ''
	// Диапазон: [10^(len-1), 10^len - 1]
	const min = 10 ** (length - 1)
	const max = 10 ** length - 1
	// randomInt(min, max + 1) — включительно сверху
	return String(randomInt(min, max + 1))
}

```

## Description

This file is part of the MedicHub API (NestJS) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.727Z*
