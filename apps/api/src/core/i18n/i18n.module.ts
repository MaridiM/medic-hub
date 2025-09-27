import { Global, Module } from '@nestjs/common'

import { i18n, initI18n } from '../config'

import { I18nService } from './i18n.service'
import { I18N_CORE } from './i18n.tokens'

@Global()
@Module({
	providers: [
		{
			provide: I18N_CORE,
			useFactory: async () => {
				await initI18n() // если уже инициализировано – можно убрать
				return i18n // возвращаем singleton i18next
			},
		},
		I18nService,
	],
	exports: [I18nService, I18N_CORE],
})
export class I18nModule {}
