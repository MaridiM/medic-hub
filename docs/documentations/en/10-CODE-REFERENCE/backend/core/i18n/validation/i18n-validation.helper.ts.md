# File: core\i18n\validation\i18n-validation.helper.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/core/i18n/validation/i18n-validation.helper.ts`

## Category
Backend

## File Type
TS (i18n-validation.helper.ts)

## Size
885 characters, 31 lines

## Full Code

```typescript
import type { ValidationArguments } from 'class-validator'

import { I18nService } from '../i18n.service'
import type { LeafKeys, Res } from '../types'

/**
 * Хелпер для использования i18n в сообщениях class-validator.
 * @param key - Ключ перевода (например, 'validation.length.exact')
 * @param vars - Дополнительные переменные для интерполяции.
 * @returns Функция, которую `class-validator` использует для генерации сообщения.
 */
export const t = <K extends LeafKeys<Res>>(key: K, vars: Record<string, unknown> = {}) => {
	return (args: ValidationArguments): string => {
		const lang = args.context?.lang || 'en'

		const combinedVars = {
			...vars,
			property: args.property,
			value: args.value,
			constraints: args.constraints,
		}

		const message = I18nService.t(key, {
			lng: lang,
			...combinedVars,
		})

		return String(message)
	}
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.044Z*
