import fs from 'fs'
import i18next from 'i18next'
import Backend from 'i18next-fs-backend'
import LanguageDetector from 'i18next-http-middleware'
import path from 'path'

import { DEFAULT_LANGUAGE, LANGUAGES, LOCALE_FILE_PATH, NAMESPACES } from '@/core/i18n'
import { I18nLogger, I18nLogType } from '@/core/i18n/logging/i18n.logger'
import { isDev } from '@/shared/utils'

// const LOG_DIR = path.join(process.cwd(), 'logs', 'i18n')
// const RAW_LOG_PATH = path.join(LOG_DIR, 'missing-keys.log')
// const JSON_LOG_PATH = path.join(LOG_DIR, 'missing-keys.json')
// const CSV_LOG_PATH = path.join(LOG_DIR, 'missing-keys.csv')

// const missingKeysMap: Record<string, Set<string>> = {}
// function flushMissingLogs() {
// 	// JSON
// 	const jsonExport: Record<string, string[]> = {}
// 	for (const key in missingKeysMap) {
// 		jsonExport[key] = Array.from(missingKeysMap[key])
// 	}
// 	fs.writeFileSync(JSON_LOG_PATH, JSON.stringify(jsonExport, null, 2), 'utf-8')

// 	// CSV
// 	const langs = LANGUAGES
// 	const headers = ['key', 'namespace', ...langs]
// 	const rows: string[] = [headers.join(',')]

// 	for (const fullKey in missingKeysMap) {
// 		const [ns, ...rest] = fullKey.split('.')
// 		const k = rest.join('.')
// 		const langsWithMiss = missingKeysMap[fullKey]
// 		const row = [fullKey, ns, ...langs.map(l => (langsWithMiss.has(l) ? 'MISSING' : 'OK'))]
// 		rows.push(row.join(','))
// 	}

// 	fs.writeFileSync(CSV_LOG_PATH, rows.join('\n'), 'utf-8')
// }

// export function missingKeyHandler(lng, ns, key, fallbackValue) {
// 	if (!fs.existsSync(LOG_DIR)) {
// 		fs.mkdirSync(LOG_DIR, { recursive: true })
// 	}

// 	const nsStr = Array.isArray(ns) ? ns[0] : ns
// 	const fallback = fallbackValue ?? ''
// 	const entryKey = `${nsStr}.${key}`

// 	for (const lang of LANGUAGES) {
// 		// RAW LOG
// 		const logLine = `[${lang}/${nsStr}] ➜ "${key}"\n`
// 		const currentLog = fs.existsSync(RAW_LOG_PATH) ? fs.readFileSync(RAW_LOG_PATH, 'utf-8') : ''
// 		if (!currentLog.includes(logLine.trim())) {
// 			fs.appendFileSync(RAW_LOG_PATH, logLine, 'utf-8')
// 		}

// 		// JSON MAP
// 		if (!missingKeysMap[entryKey]) {
// 			missingKeysMap[entryKey] = new Set()
// 		}
// 		missingKeysMap[entryKey].add(lang)

// 		// ADD TO LANGUAGE FILE
// 		const filePath = path.join(process.cwd(), 'src/core/i18n/locales', lang, `${nsStr}.json`)
// 		try {
// 			const content = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : {}

// 			if (!content[key]) {
// 				content[key] = fallback
// 				fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8')
// 				console.log(`[i18n] Added "${key}" to ${lang}/${nsStr}.json`)
// 			}
// 		} catch (err) {
// 			console.error(`[i18n] Failed to write "${key}" in ${lang}/${nsStr}.json:`, err)
// 		}
// 	}

// 	// ОБНОВЛЕНИЕ ФАЙЛОВ JSON и CSV
// 	flushMissingLogs()
// }

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
			saveMissing: isDev ? true : false,
			missingKeyHandler: isDev ? missingKeyHandler : undefined,
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
