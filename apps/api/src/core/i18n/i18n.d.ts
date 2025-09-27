import 'i18next'

import languages from '@/core/i18n/locales'

declare module 'i18next' {
	interface CustomTypeOptions {
		defaultNS: 'auth'
		resources: (typeof languages)['en']
		nsSeparator: '.' // <— хотим "ns.key"
		keySeparator: '.' // <— точки внутри ключа не режем
		returnNull: false // чтобы t() не возвращал null
	}
}
