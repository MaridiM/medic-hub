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
