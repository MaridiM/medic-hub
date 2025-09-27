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
			keySeparator: '.',
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

function missingKeyHandler(lngs: readonly string[], ns: string | string[], key: string, fallbackValue: string): void {
	const nsStr = Array.isArray(ns) ? ns[0] : ns
	const fallback = fallbackValue ?? ''

	for (const lang of LANGUAGES) {
		I18nLogger.log(I18nLogType.MISSING, key, nsStr, lang)

		const filePath = path.join(process.cwd(), 'src/core/i18n/locales', lang, `${nsStr}.json`)
		try {
			// ensure we don't assign `any` from JSON.parse directly
			let content: Record<string, string> = {}
			if (fs.existsSync(filePath)) {
				const raw = fs.readFileSync(filePath, 'utf-8')
				try {
					content = JSON.parse(raw) as Record<string, string>
				} catch {
					// if the file contains invalid JSON, fallback to empty object
					content = {}
				}
			}

			// use hasOwnProperty to avoid overwriting existing falsy values
			if (!Object.prototype.hasOwnProperty.call(content, key)) {
				content[key] = fallback
				fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8')
			}
		} catch (err) {
			console.error(`[i18n] Failed to write key: ${err}`)
		}
	}
}

export const i18n = i18next
