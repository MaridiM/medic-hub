import fs from 'fs'
import i18next from 'i18next'
import Backend from 'i18next-fs-backend'
import LanguageDetector from 'i18next-http-middleware'
import path from 'path'

import { DEFAULT_LANGUAGE, LANGUAGES, LOCALE_FILE_PATH, NAMESPACES } from '@/core/i18n'
import { I18nLogger, I18nLogType } from '@/core/i18n/logging/i18n.logger'
import { IS_DEV_ENV } from '@/shared/utils'

export async function initI18n() {
	await i18next
		.use(Backend)
		.use(LanguageDetector.LanguageDetector)
		.init({
			fallbackLng: DEFAULT_LANGUAGE,
			preload: LANGUAGES,
			nsSeparator: '.',
			ns: NAMESPACES,
			defaultNS: 'auth',
			backend: {
				loadPath: LOCALE_FILE_PATH,
			},
			detection: {
				order: ['querystring', 'cookie', 'header'],
				caches: ['cookie'],
			},
			saveMissing: IS_DEV_ENV,
			missingKeyHandler: IS_DEV_ENV ? missingKeyHandler : undefined,
		})
}

function missingKeyHandler(lng, ns, key, fallbackValue) {
	const nsStr = Array.isArray(ns) ? ns[0] : ns
	const fallback = fallbackValue ?? ''

	for (const lang of LANGUAGES) {
		I18nLogger.log(I18nLogType.MISSING, key, nsStr, lang)

		const filePath = path.join(process.cwd(), 'src/core/i18n/locales', lang, `${nsStr}.json`)
		try {
			const content = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : {}

			if (!content[key]) {
				content[key] = fallback
				fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8')
			}
		} catch (err) {
			console.error(`[i18n] Failed to write key: ${err}`)
		}
	}
}

export const i18n = i18next
