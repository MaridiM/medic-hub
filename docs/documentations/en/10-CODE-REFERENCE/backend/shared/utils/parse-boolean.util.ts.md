# File: shared\utils\parse-boolean.util.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/shared/utils/parse-boolean.util.ts`

## Category
Backend

## File Type
TS (parse-boolean.util.ts)

## Size
1309 characters, 38 lines

## Full Code

```typescript
/**
 * Преобразует строковое значение в логическое значение (boolean).
 *
 * Эта функция принимает строку, представляющую логическое значение,
 * и возвращает соответствующее логическое значение. Если строка равна
 * "true" (игнорируя регистр), функция вернет `true`. Если строка равна
 * "false", функция вернет `false`. Если передано значение другого типа
 * или строка не соответствует ожидаемым значениям, будет выброшено
 * исключение.
 *
 * @param value - Строка, представляющая логическое значение ("true" или "false").
 * @returns {boolean} Логическое значение, соответствующее переданной строке.
 * @throws {Error} Если переданное значение не может быть преобразовано в логическое значение.
 *
 * @example
 * parseBoolean('true');  // вернет true
 * parseBoolean('false'); // вернет false
 * parseBoolean('TRUE');  // вернет true
 * parseBoolean('False'); // вернет false
 */
export function parseBoolean(value: string): boolean {
	if (typeof value === 'boolean') {
		return value
	}

	if (typeof value === 'string') {
		const lowerValue = value.trim().toLowerCase()
		if (lowerValue === 'true') {
			return true
		}
		if (lowerValue === 'false') {
			return false
		}
	}

	throw new Error(`Не удалось преобразовать значение "${value}" в логическое значение.`)
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.746Z*
