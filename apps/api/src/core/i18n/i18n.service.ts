import type { i18n as I18nInstance } from 'i18next'

import { i18n as core } from '@/core/config/i18n.config'
import { Inject, Injectable, Scope } from '@nestjs/common'

import { I18N_CORE } from './i18n.tokens'

@Injectable({ scope: Scope.DEFAULT })
export class I18nService {
	constructor(@Inject(I18N_CORE) private readonly coreI18n: I18nInstance) {}

	// t(...)
	t(...args: Parameters<I18nInstance['t']>): ReturnType<I18nInstance['t']> {
		return (this.coreI18n.t as unknown as I18nInstance['t'])(...args)
	}

	// getFixedT(...)
	getFixedT(...args: Parameters<I18nInstance['getFixedT']>): ReturnType<I18nInstance['getFixedT']> {
		return (this.coreI18n.getFixedT as unknown as I18nInstance['getFixedT'])(...args)
	}

	get language() {
		return this.coreI18n.language
	}

	changeLanguage(...args: Parameters<I18nInstance['changeLanguage']>) {
		return this.coreI18n.changeLanguage(...args)
	}

	getLanguage(options?: { req?: { language?: string } }): string {
		return options?.req?.language ?? this.coreI18n.language ?? 'en'
	}

	// если нужен статический доступ
	static t(...args: Parameters<I18nInstance['t']>): ReturnType<I18nInstance['t']> {
		return (core.t as unknown as I18nInstance['t'])(...args)
	}
}
