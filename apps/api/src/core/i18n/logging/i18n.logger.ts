import fs from 'fs'
import path from 'path'

import { Language } from '../locales'

export type I18nLogEntry = {
	key: string
	namespace: string
	languages: string[]
}

export enum I18nLogType {
	MISSING = 'missing-keys',
	FALLBACK = 'fallback-keys',
	DUPLICATE = 'duplicate-keys',
}

export class I18nLogger {
	private static logMap: Record<I18nLogType, Map<string, Set<string>>> = {
		[I18nLogType.MISSING]: new Map(),
		[I18nLogType.FALLBACK]: new Map(),
		[I18nLogType.DUPLICATE]: new Map(),
	}

	private static getLogDir(): string {
		const dir = path.join(process.cwd(), 'logs', 'i18n')
		if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
		return dir
	}

	static log(type: I18nLogType, key: string, namespace: string, lng: Language) {
		const map = this.logMap[type]
		const entry = `${namespace}.${key}`

		if (!map.has(entry)) map.set(entry, new Set())
		map.get(entry)?.add(lng)

		this.appendRawLog(type, lng, namespace, key)
		this.flush(type)
	}

	private static appendRawLog(type: I18nLogType, lng: Language, ns: string, key: string) {
		const line = `[${lng}/${ns}] ➜ "${key}"\n`
		const filePath = path.join(this.getLogDir(), `${type}.log`)

		const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : ''
		if (!existing.includes(line.trim())) {
			fs.appendFileSync(filePath, line, 'utf-8')
		}
	}

	static flush(type: I18nLogType) {
		const map = this.logMap[type]
		const jsonOut: Record<string, string[]> = {}
		const langs = new Set<string>()

		for (const [entry, langSet] of map.entries()) {
			jsonOut[entry] = Array.from(langSet)
			Array.from(langSet).forEach(l => langs.add(l))
		}

		// JSON
		fs.writeFileSync(path.join(this.getLogDir(), `${type}.json`), JSON.stringify(jsonOut, null, 2), 'utf-8')

		// CSV
		const langArray = Array.from(langs)
		const rows = [['key', 'namespace', ...langArray]]

		for (const entry of Object.keys(jsonOut)) {
			const [ns, ...rest] = entry.split('.')
			const key = rest.join('.')
			const langsWith = new Set(jsonOut[entry])

			rows.push([entry, ns, ...langArray.map(l => (langsWith.has(l) ? 'MISSING' : 'OK'))])
		}

		fs.writeFileSync(path.join(this.getLogDir(), `${type}.csv`), rows.map(r => r.join(',')).join('\n'), 'utf-8')
	}
}
