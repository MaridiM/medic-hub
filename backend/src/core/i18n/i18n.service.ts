import { i18n } from '@/core/config/i18n.config'
import { Injectable, Scope } from '@nestjs/common'

@Injectable({ scope: Scope.DEFAULT })
export class I18nService {
	/**
	 * Получить перевод по ключу
	 * @param key ключ перевода
	 * @param options опции (lng, значения для подстановки и т.д.)
	 */
	t(key: string, options?: { lng?: string; [key: string]: any }) {
		return i18n.t(key, options)
	}

	/**
	 * Получить текущий язык (если нужно — можно расширить)
	 */
	getLanguage(options?: { req?: any }): string {
		if (options?.req?.language) return options.req.language
		return i18n.language
	}

	/**
	 * Статический доступ к i18n (например, для утилит)
	 */
	static t(key: string, options?: { lng?: string; [key: string]: any }) {
		return i18n.t(key, options)
	}
}
