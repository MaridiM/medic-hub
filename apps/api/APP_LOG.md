src/core/config/app.config.ts
[ Код из файла ]

export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
export const COMPANY_NAME = process.env.COMPANY_NAME || 'MedicHub Inc.'
export const APP_NAME = process.env.APP_NAME || 'DoctorLab'
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'maridim.dev@gmail.com'


src/core/config/graphql.config.ts
[ Код из файла ]

import { Request, Response } from 'express'
import { join } from 'path'

import { DEFAULT_LANGUAGE } from '@/core/i18n'
import { ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigService } from '@nestjs/config'

export function getGraphQLConfig(configService: ConfigService): ApolloDriverConfig {
	const path = configService.getOrThrow<string>('GRAPHQL_PREFIX')
	const autoSchemaFile = join(process.cwd(), 'src/core/graphql/schema.gql')

	return {
		path,
		autoSchemaFile,
		sortSchema: true,
		context: ({ req, res }: { req: Request; res: Response }) => ({
			req,
			res,
			language: req.language || DEFAULT_LANGUAGE,
		}),
		installSubscriptionHandlers: true,
	}
}


src/core/config/i18n.config.ts
[ Код из файла ]

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
			let content: Record<string, string> = {}
			if (fs.existsSync(filePath)) {
				const raw = fs.readFileSync(filePath, 'utf-8')
				try {
					content = JSON.parse(raw) as Record<string, string>
				} catch {
					content = {}
				}
			}

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


src/core/config/index.ts
[ Код из файла ]

export * from './app.config'
export * from './graphql.config'
export * from './i18n.config'
export * from './mailer.config'
export * from './paths.config'
export * from './session.config'


src/core/config/mailer.config.ts
[ Код из файла ]

import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export function getMailerConfig(configService: ConfigService): MailerOptions {
	return {
		transport: {
			host: configService.getOrThrow<string>('MAIL_HOST'),
			port: configService.getOrThrow<number>('MAIL_PORT'),
			secure: false,
			auth: {
				user: configService.getOrThrow<string>('MAIL_LOGIN'),
				pass: configService.getOrThrow<string>('MAIL_PASSWORD'),
			},
		},
	}
}


src/core/config/paths.config.ts
[ Код из файла ]

export const PATHS = {
	VERIFY_EMAIL: (domain: string, token: string) => `${domain}/auth/verify?token=${token}`,
	RECOVERY_PASSWORD: (domain: string) => `${domain}/auth/recovery`,
	RESET_PASSWORD: (domain: string, token: string) => `${domain}/auth/recovery/${token}`,
}


src/core/config/session.config.ts
[ Код из файла ]

import { RedisStore } from 'connect-redis'
import session from 'express-session'
import ms from 'ms'

import { RedisService } from '@/core/redis/redis.service'
import { parseBoolean, StringValue } from '@/shared/utils'
import { ConfigService } from '@nestjs/config'

export const sessionConfig = (config: ConfigService, redis: RedisService) => {
	const redisClient = redis.getClient()

	const store = new RedisStore({
		client: redisClient,
		prefix: config.getOrThrow<string>('SESSION_FOLDER') || 'sessions:',
		ttl: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
	})

	return session({
		store,
		secret: config.getOrThrow<string>('SESSION_SECRET'),
		name: config.getOrThrow<string>('SESSION_NAME'),
		resave: false,
		saveUninitialized: false,
		cookie: {
			domain: config.getOrThrow<string>('SESSION_DOMAIN') || 'localhost',
			maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
			httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
			secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
			sameSite: 'lax' as const,
		},
	})
}


src/core/core.service.ts
[ Код из файла ]

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { I18nService } from './i18n'
import { LeafKeys, Res, StrOptions } from './i18n/types'
import { PrismaService } from './prisma'
import { RedisService } from './redis'


@Injectable()
export abstract class CoreService {
	constructor(
		protected readonly i18n?: I18nService,
		protected readonly prisma?: PrismaService,
		protected readonly redis?: RedisService,
		protected readonly config?: ConfigService,
	) {}


	protected msg<K extends LeafKeys<Res>>(key: K, fallback?: string, opts?: StrOptions): string
	protected msg(key: string, fallback?: string, opts?: StrOptions): string
	protected msg(key: string, fallback?: string, opts?: StrOptions): string {
		if (!this.i18n?.t) {
			return fallback ?? key
		}

		try {
			const val = this.i18n.t(key as LeafKeys<Res>, { ...opts })
			return typeof val === 'string' ? val : (fallback ?? key)
		} catch {
			return fallback ?? key
		}
	}


	protected get cfg() {
		return this.config
	}


	protected get redisClient() {
		return this.redis?.getClient?.()
	}


	protected rKey(prefix: string, id: string): string {
		return `${prefix}${id}`
	}


	protected rGetJSON<T>(key: string) {
		return this.redis?.getJSON<T>(key)
	}


	protected rSetJSON<T extends object>(key: string, value: T, ttlSec?: number) {
		return this.redis?.setJSON<T>(key, value, ttlSec)
	}



	protected async rGet(key: string): Promise<string | null> {
		return this.redis?.get(key) ?? null
	}


	protected async rSet(key: string, value: string, ttlSec?: number): Promise<void> {
		await this.redis?.set(key, value, ttlSec)
	}


	protected async rDel(key: string): Promise<number> {
		return (await this.redis?.del(key)) ?? 0
	}


	protected async rExists(key: string): Promise<boolean> {
		return (await this.redis?.exists(key)) ?? false
	}


	protected async rTTL(key: string): Promise<number> {
		return (await this.redis?.ttl(key)) ?? -2
	}


	protected async rIncr(key: string, ttlSec?: number): Promise<number> {
		if (ttlSec) {
			return (await this.redis?.incrWithExpire(key, ttlSec)) ?? 0
		}
		return (await this.redis?.incr(key)) ?? 0
	}


	protected async rGetNumber(key: string): Promise<number | null> {
		const value = await this.rGet(key)
		if (value === null) return null
		const num = parseInt(value, 10)
		return isNaN(num) ? null : num
	}


	protected async rSetNumber(key: string, value: number, ttlSec?: number): Promise<void> {
		await this.rSet(key, value.toString(), ttlSec)
	}
}


src/core/i18n/decorators/index.ts
[ Код из файла ]

export * from './lang.decorator'


src/core/i18n/decorators/lang.decorator.ts
[ Код из файла ]

import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

type ReqLike = {
	cookies?: Record<string, string | undefined>
	language?: string
	headers?: Record<string, string | string[] | undefined>
}


function getReq(ctx: ExecutionContext): ReqLike {
	const gql = GqlExecutionContext.create(ctx)
	const g = gql.getContext<{ req?: ReqLike }>()
	return g?.req ?? ctx.switchToHttp().getRequest<ReqLike>()
}


function norm(v?: string | string[]): string | undefined {
	const raw = Array.isArray(v) ? v[0] : v
	if (!raw) return
	return raw.split(',')[0]?.split(';')[0]?.trim().toLowerCase() || undefined
}


export const Lang = createParamDecorator<unknown, string>((_data, ctx) => {
	const req = getReq(ctx)
	return norm(req.cookies?.language) ?? norm(req.language) ?? norm(req.headers?.['accept-language']) ?? 'en'
})


src/core/i18n/i18n.constants.ts
[ Код из файла ]

import fs from 'fs'
import path from 'path'

import languages from './locales'

export const LANGUAGES = Object.keys(languages) as (keyof typeof languages)[]
export type Language = (typeof LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = 'en'

export const DEV_LOCALE_PATH = path.join(process.cwd(), 'src/core/i18n/locales')
export const LOCALE_DIR = path.join(__dirname, 'locales')
export const LOCALE_FILE_PATH = path.join(LOCALE_DIR, '{{lng}}/{{ns}}.json')

for (const lang of LANGUAGES) {
	const langPath = path.join(LOCALE_DIR, lang)
	if (!fs.existsSync(langPath)) {
		console.warn(`[i18n] Missing translations folder for language: ${lang}`)
	}
}

export const NAMESPACES = fs
	.readdirSync(path.join(LOCALE_DIR, LANGUAGES[0]))
	.filter(file => file.endsWith('.json'))
	.map(file => file.replace('.json', ''))


src/core/i18n/i18n.service.ts
[ Код из файла ]

import type { i18n as I18nInstance, TOptions } from 'i18next'

import { i18n as core } from '@/core/config/i18n.config'
import { Inject, Injectable, Scope } from '@nestjs/common'

import { I18N_CORE } from './i18n.tokens'
import {
	ArrayLeafKeys,
	isObjectRecord,
	LeafKeys,
	NodeKeys,
	ObjOptions,
	Res,
	ScopedT,
	StrOptions,
	ValueAtPath,
} from './types'

@Injectable({ scope: Scope.DEFAULT })
export class I18nService {
	constructor(@Inject(I18N_CORE) private readonly coreI18n: I18nInstance) {}



	t<K extends LeafKeys<Res>>(key: K, opts?: StrOptions): string
	t<K extends ArrayLeafKeys<Res>>(key: K, opts?: StrOptions): string[]
	t<K extends NodeKeys<Res>>(key: K, opts: ObjOptions): ValueAtPath<Res, K>
	t<K extends NodeKeys<Res>>(key: K, opts?: StrOptions): ScopedT<K>

	t(key: string, opts?: TOptions): unknown {
		const coreT = this.coreI18n.t as unknown as (k: string, o?: TOptions) => unknown

		if (opts && (opts as { returnObjects?: boolean }).returnObjects) {
			return coreT(key, { ...opts, returnObjects: true })
		}

		const probe = coreT(key, { returnObjects: true })

		if (Array.isArray(probe)) {
			return coreT(key, { ...(opts ?? {}), returnObjects: true }) as string[]
		}

		if (isObjectRecord(probe)) {
			const makeScope = <B extends string>(base: B): ScopedT<B> => {
				const scoped = (<C extends string>(child: C, childOpts?: TOptions) => {
					const full = `${base}.${child}`

					if (childOpts && (childOpts as { returnObjects?: boolean }).returnObjects) {
						return coreT(full, { ...childOpts, returnObjects: true }) as ValueAtPath<Res, `${B}.${C}`>
					}

					const nextProbe = coreT(full, { returnObjects: true })
					if (Array.isArray(nextProbe)) {
						return coreT(full, { ...(childOpts ?? {}), returnObjects: true }) as string[]
					}
					if (isObjectRecord(nextProbe)) return makeScope(full as `${B}.${C}`)

					return coreT(full, childOpts) as string
				}) as ScopedT<B>
				return scoped
			}
			return makeScope(key)
		}

		return coreT(key, opts) as string
	}


	getFixedT(...args: Parameters<I18nInstance['getFixedT']>) {
		const fixed = this.coreI18n.getFixedT(...args)
		const coreT = fixed as unknown as (k: string, o?: TOptions) => unknown

		const makeScope = <B extends string>(base: B): ScopedT<B> => {
			const scoped = (<C extends string>(child: C, childOpts?: TOptions) => {
				const full = `${base}.${child}`
				if (childOpts && (childOpts as { returnObjects?: boolean }).returnObjects) {
					return coreT(full, { ...childOpts, returnObjects: true }) as ValueAtPath<Res, `${B}.${C}`>
				}
				const probe = coreT(full, { returnObjects: true })
				if (Array.isArray(probe)) {
					return coreT(full, { ...(childOpts ?? {}), returnObjects: true }) as string[]
				}
				if (isObjectRecord(probe)) return makeScope(full as `${B}.${C}`)
				return coreT(full, childOpts) as string
			}) as ScopedT<B>
			return scoped
		}

		const typed = ((key: string, opts?: TOptions) => {
			if (opts && (opts as { returnObjects?: boolean }).returnObjects) {
				return coreT(key, { ...opts, returnObjects: true })
			}
			const probe = coreT(key, { returnObjects: true })
			if (Array.isArray(probe)) {
				return coreT(key, { ...(opts ?? {}), returnObjects: true }) as string[]
			}
			if (isObjectRecord(probe)) return makeScope(key)
			return coreT(key, opts) as string
		}) as {
			<K extends LeafKeys<Res>>(key: K, opts?: StrOptions): string
			<K extends ArrayLeafKeys<Res>>(key: K, opts?: StrOptions): string[]
			<K extends NodeKeys<Res>>(key: K, opts: ObjOptions): ValueAtPath<Res, K>
			<K extends NodeKeys<Res>>(key: K, opts?: StrOptions): ScopedT<K>
		}

		return typed
	}



	raw<K extends string>(key: K): ValueAtPath<Res, K> {
		const coreT = this.coreI18n.t as unknown as (k: string, o?: TOptions) => unknown
		return coreT(key, { returnObjects: true }) as ValueAtPath<Res, K>
	}



	rich<K extends string>(key: K, handlers: Record<string, (chunks: string) => unknown>, opts?: StrOptions): unknown {
		const coreT = this.coreI18n.t as unknown as (k: string, o?: TOptions) => unknown

		const val: unknown = coreT(key, opts)

		let text = ''

		switch (typeof val) {
			case 'string':
				text = val
				break

			case 'number':
			case 'boolean':
			case 'bigint':
			case 'symbol':
				text = String(val)
				break

			case 'undefined':
				text = ''
				break

			case 'function':
				text = val.toString()
				break

			case 'object': {
				if (val === null) {
					text = ''
					break
				}
				if (Array.isArray(val)) {
					const parts = (val as unknown[]).map(x => (typeof x === 'string' ? x : JSON.stringify(x)))
					text = parts.join('')
					break
				}
				text = JSON.stringify(val)
				break
			}
		}

		const out: unknown[] = []
		const re = /<([a-zA-Z][\w-]*)>(.*?)<\/\1>/g
		let last = 0
		let m: RegExpExecArray | null

		while ((m = re.exec(text))) {
			if (m.index > last) out.push(text.slice(last, m.index))
			const tag = m[1]
			const inner = m[2]
			const h = handlers[tag]
			out.push(h ? h(inner) : inner)
			last = m.index + m[0].length
		}
		if (last < text.length) out.push(text.slice(last))

		return out.length === 1 ? out[0] : out
	}


	exists(key: string, opts?: TOptions) {
		return this.coreI18n.exists(key, opts)
	}
	dir(lng?: string) {
		return this.coreI18n.dir(lng)
	}


	get language() {
		return this.coreI18n.language
	}
	changeLanguage(...args: Parameters<I18nInstance['changeLanguage']>) {
		return this.coreI18n.changeLanguage(...args)
	}
	getLanguage(options?: { req?: { language?: string } }) {
		return options?.req?.language ?? this.coreI18n.language ?? 'en'
	}


	static t<K extends LeafKeys<Res>>(key: K, opts?: StrOptions): string
	static t<K extends ArrayLeafKeys<Res>>(key: K, opts?: StrOptions): string[]
	static t<K extends NodeKeys<Res>>(key: K, opts: ObjOptions): ValueAtPath<Res, K>
	static t<K extends NodeKeys<Res>>(key: K): ScopedT<K>
	static t(key: string, opts?: TOptions): unknown {
		const inst = core as unknown as I18nInstance
		const coreT = inst.t as unknown as (k: string, o?: TOptions) => unknown

		if (opts && (opts as { returnObjects?: boolean }).returnObjects) {
			return coreT(key, { ...opts, returnObjects: true })
		}

		const probe = coreT(key, { returnObjects: true })

		if (Array.isArray(probe)) {
			return coreT(key, { ...(opts ?? {}), returnObjects: true }) as string[]
		}

		if (isObjectRecord(probe)) {
			const makeScope = <B extends string>(base: B): ScopedT<B> => {
				const scoped = (<C extends string>(child: C, childOpts?: TOptions) => {
					const full = `${base}.${child}`
					if (childOpts && (childOpts as { returnObjects?: boolean }).returnObjects) {
						return coreT(full, { ...childOpts, returnObjects: true }) as ValueAtPath<Res, `${B}.${C}`>
					}
					const next = coreT(full, { returnObjects: true })
					if (Array.isArray(next)) {
						return coreT(full, { ...(childOpts ?? {}), returnObjects: true }) as string[]
					}
					if (isObjectRecord(next)) return makeScope(full as `${B}.${C}`)
					return coreT(full, childOpts) as string
				}) as ScopedT<B>
				return scoped
			}
			return makeScope(key)
		}

		return coreT(key, opts) as string
	}

	static raw<K extends string>(key: K): ValueAtPath<Res, K> {
		const inst = core as unknown as I18nInstance
		const coreT = inst.t as unknown as (k: string, o?: TOptions) => unknown
		return coreT(key, { returnObjects: true }) as ValueAtPath<Res, K>
	}

	static rich<K extends string>(
		key: K,
		handlers: Record<string, (chunks: string) => unknown>,
		opts?: StrOptions,
	): unknown {
		const inst = core as unknown as I18nInstance
		const service = new I18nService(inst)
		return service.rich(key, handlers, opts)
	}

	static exists(key: string, opts?: TOptions) {
		const inst = core as unknown as I18nInstance
		return inst.exists(key, opts)
	}
	static dir(lng?: string) {
		const inst = core as unknown as I18nInstance
		return inst.dir(lng)
	}
}


src/core/i18n/i18n.tokens.ts
[ Код из файла ]

export const I18N_CORE = Symbol('I18N_CORE')


src/core/i18n/index.ts
[ Код из файла ]

export * from './i18n.module'
export * from './i18n.service'
export * from './i18n.constants'
export * from './decorators'


src/core/i18n/logging/i18n.logger.ts
[ Код из файла ]

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

		fs.writeFileSync(path.join(this.getLogDir(), `${type}.json`), JSON.stringify(jsonOut, null, 2), 'utf-8')

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


src/core/i18n/types/i18n.d.ts
[ Код из файла ]

import 'i18next'

import languages from '@/core/i18n/locales'

declare module 'i18next' {
	interface CustomTypeOptions {
		defaultNS: 'auth'
		resources: (typeof languages)['en']
		nsSeparator: '.'
		keySeparator: '.'
		returnNull: true
	}
}


src/core/i18n/types/index.ts
[ Код из файла ]

export * from './typed'


src/core/i18n/types/typed.ts
[ Код из файла ]

import type { TOptions } from 'i18next'

import languages from '@/core/i18n/locales'


export type Res = (typeof languages)['en']


type Depth = 0 | 1 | 2 | 3 | 4 | 5 | 6
type DecMap = { 0: 0; 1: 0; 2: 1; 3: 2; 4: 3; 5: 4; 6: 5 }
type Dec<D extends Depth> = DecMap[D]

type NonArrayObject<T> = T extends readonly any[] ? never : T extends object ? T : never


export type ValueAtPath<T, P extends string> = P extends `${infer K}.${infer R}`
	? K extends keyof T
		? ValueAtPath<T[K], R>
		: never
	: P extends keyof T
		? T[P]
		: never


export type DotPaths<T, D extends Depth = 6, P extends string = ''> = [D] extends [0]
	? never
	: {
			[K in keyof T & string]: T[K] extends object ? `${P}${K}` | DotPaths<T[K], Dec<D>, `${P}${K}.`> : `${P}${K}`
		}[keyof T & string]


export type NodeKeys<T> = {
	[K in DotPaths<T>]: NonArrayObject<ValueAtPath<T, K>> extends never ? never : K
}[DotPaths<T>]


export type LeafKeys<T> = {
	[K in DotPaths<T>]: ValueAtPath<T, K> extends string ? K : never
}[DotPaths<T>]


export type ArrayLeafKeys<T> = {
	[K in DotPaths<T>]: ValueAtPath<T, K> extends readonly string[] ? K : never
}[DotPaths<T>]


export type NodeValue<K extends string> =
	NonArrayObject<ValueAtPath<Res, K>> extends never ? never : NonArrayObject<ValueAtPath<Res, K>>


export type ChildLeafKeys<K extends string> = {
	[C in keyof NodeValue<K> & string]: NodeValue<K>[C] extends string | readonly string[] ? C : never
}[keyof NodeValue<K> & string]


export type ChildNodeKeys<K extends string> = {
	[C in keyof NodeValue<K> & string]: NodeValue<K>[C] extends readonly string[]
		? never
		: NodeValue<K>[C] extends object
			? C
			: never
}[keyof NodeValue<K> & string]


export type StrOptions = Omit<TOptions, 'returnObjects'> & {
	lng?: string
	returnObjects?: false | undefined
}
export type ObjOptions = Omit<TOptions, 'returnObjects'> & {
	lng?: string
	returnObjects: true
}


export type ScopedT<K extends string> = {
	<C extends ChildLeafKeys<K>>(
		child: C,
		opts?: StrOptions,
	): NodeValue<K>[C] extends readonly string[] ? string[] : string
} & {
	<C extends ChildNodeKeys<K>>(child: C, opts: ObjOptions): ValueAtPath<Res, `${K}.${C}`>
} & {
	<C extends ChildNodeKeys<K>>(child: C, opts?: StrOptions): ScopedT<`${K}.${C}`>
}


export const isObjectRecord = (x: unknown): x is Record<string, unknown> =>
	typeof x === 'object' && x !== null && !Array.isArray(x)


export type CoreT = (key: string, opts?: TOptions) => unknown


src/core/prisma/index.ts
[ Код из файла ]

export * from './prisma.service'
export * from './prisma.module'


src/core/prisma/prisma.seed.ts
[ Код из файла ]

import { HashUtil } from '@/shared/utils'
import { BadRequestException, Logger } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/__generated__'

const prisma = new PrismaClient({
	transactionOptions: {
		maxWait: 5000,
		timeout: 15000,
		isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
	},
})

async function main() {
	try {
		Logger.log('☑️ Seeding database...')

		await prisma.$transaction([prisma.user.deleteMany()])

		const hashedPassword = await HashUtil.hash('12345678')

		const user = await prisma.user.upsert({
			where: { email: 'maridim.dev@gmail.com' },
			update: {},
			create: {
				email: 'maridim.dev@gmail.com',
				fullName: 'maridiM',
				firstName: 'Test',
				lastName: 'User',
				password: hashedPassword,
				isEmailVerified: true,
			},
		})

		console.log('✅ Created test user:', user.email)
		console.log('📧 Email: maridim.dev@gmail.com')
		console.log('🔑 Password: 12345678')
	} catch (error) {
		Logger.error(error)
		throw new BadRequestException('❌ Ошибка при заполнении базы данных')
	} finally {
		Logger.log('☑️ Закрытие соединения с базой данных...')
		await prisma.$disconnect()
		Logger.log('☑️ Соединение с базой данных успешно закрыто')
	}
}

main().catch(e => {
	console.error('❌ Seed failed:', e)
	process.exit(1)
})


src/core/prisma/prisma.service.ts
[ Код из файла ]

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/__generated__'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	async onModuleInit(): Promise<void> {
		await this.$connect()
	}
	async onModuleDestroy(): Promise<void> {
		await this.$disconnect()
	}
}


src/core/redis/index.ts
[ Код из файла ]

export * from './redis.service'
export * from './redis.module'

src/core/redis/redis.service.ts
[ Код из файла ]

import { createClient, type RedisClientType } from 'redis'

import { logUnknownError } from '@/shared/utils'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RedisService {
	private client: RedisClientType
	private readonly logger = new Logger(RedisService.name)

	constructor(private readonly config: ConfigService) {
		this.client = createClient({ url: this.config.getOrThrow<string>('REDIS_URL') })
		this.client.connect().catch((err: unknown) => {
			logUnknownError(this.logger, 'Redis connect error', err, RedisService.name)
		})
	}

	getClient(): RedisClientType {
		return this.client
	}



	async get(key: string): Promise<string | null> {
		const res = await this.client.get(key)
		return typeof res === 'string' ? res : null
	}


	async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
		if (ttlSeconds && ttlSeconds > 0) {
			await this.client.set(key, value, { EX: ttlSeconds })
		} else {
			await this.client.set(key, value)
		}
	}


	async del(key: string): Promise<number> {
		return this.client.del(key)
	}


	async expire(key: string, ttlSeconds: number): Promise<boolean> {
		const n = await this.client.expire(key, ttlSeconds)
		return n === 1
	}


	async exists(key: string): Promise<boolean> {
		const n = await this.client.exists(key)
		return n === 1
	}


	async ttl(key: string): Promise<number> {
		return this.client.ttl(key)
	}


	async incr(key: string): Promise<number> {
		return this.client.incr(key)
	}


	async decr(key: string): Promise<number> {
		return this.client.decr(key)
	}


	async incrWithExpire(key: string, ttlSeconds: number): Promise<number> {
		const value = await this.client.incr(key)
		if (value === 1) {
			await this.client.expire(key, ttlSeconds)
		}
		return value
	}



	async setJSON<T extends object>(key: string, value: T, ttlSeconds?: number): Promise<void> {
		const raw = JSON.stringify(value)
		await this.set(key, raw, ttlSeconds)
	}


	async getJSON<T = unknown>(key: string): Promise<T | null> {
		const raw = await this.get(key)
		if (raw == null) return null
		try {
			return JSON.parse(raw) as T
		} catch {
			return null
		}
	}



	async keys(pattern: string): Promise<string[]> {
		const list: string[] = await this.client.keys(pattern)
		return list
	}


	async delPattern(pattern: string): Promise<number> {
		const keys = await this.keys(pattern)
		if (keys.length === 0) return 0
		return this.client.del(keys)
	}



	async setNX(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
		const result = ttlSeconds
			? await this.client.set(key, value, { NX: true, EX: ttlSeconds })
			: await this.client.set(key, value, { NX: true })
		return result === 'OK'
	}


	async getdel(key: string): Promise<string | null> {
		const result = await this.client.getDel(key)
		return result === null || typeof result !== 'string' ? null : result
	}
}


src/main.ts
[ Код из файла ]

import cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import { json, type NextFunction, type Request, Response } from 'express'
import { graphqlUploadExpress } from 'graphql-upload-minimal'
import i18nextMiddleware from 'i18next-http-middleware'

import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { i18n, initI18n, sessionConfig } from './core/config'
import { CoreModule } from './core/core.module'
import { DEFAULT_LANGUAGE } from './core/i18n'
import { RedisService } from './core/redis'

const myEnv = dotenv.config({ path: 'backend/.env' })
dotenvExpand.expand(myEnv)

async function bootstrap() {
	await initI18n()

	const app = await NestFactory.create(CoreModule, { rawBody: true })

	const config = app.get(ConfigService)
	const redis = app.get(RedisService)

	app.use(i18nextMiddleware.handle(i18n))

	app.use(json({ limit: '1mb', type: 'application/json' }))
	app.use((req: Request, res: Response, next: NextFunction) => {
		req.language =
			req.language ||
			req.i18n?.language ||
			String(req.headers['accept-language'] || '').split(',')[0] ||
			DEFAULT_LANGUAGE
		next()
	})

	app.use(cookieParser(config.get<string>('COOKIES_SECRET')))
	app.use(config.get<string>('GRAPHQL_PREFIX') || '/graphql', graphqlUploadExpress())
	app.useGlobalPipes(new ValidationPipe({ transform: true }))

	app.use(sessionConfig(config, redis))

	const clientUrl = config.get<string>('CLIENT_URL') || 'http://localhost:3000'
	app.enableCors({
		origin: [clientUrl, 'http://localhost:3000'],
		credentials: true,
		exposedHeaders: ['set-cookie'],
	})

	const port = Number(config.get<string>('SERVER_PORT')) || 8000
	await app.listen(port)
}

bootstrap().catch(err => {
	console.error('Nest bootstrap failed:', err)
	process.exit(1)
})


src/modules/auth/account/account.resolver.ts
[ Код из файла ]

import { Lang, Language } from '@/core/i18n'
import { Authorization, Authorized } from '@/shared/decorators'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AccountService } from './account.service'
import { ChangeEmailInput, ChangePasswordInput, CreateAccountInput } from './dtos'
import { User } from './models'

@Resolver()
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}


	@Authorization()
	@Query(() => User, {
		name: 'profile',
		description:
			'Get the currently authenticated user profile. Requires auth. Returns a safe projection (no password).',
	})
	async me(@Authorized('id') id: string) {
		return this.accountService.me(id)
	}


	@Mutation(() => User, {
		name: 'createAccount',
		description:
			'Create a new user account. Normalizes email, hashes password, and sends a verification email token.',
	})
	create(@Args('data') input: CreateAccountInput, @Lang() lng: Language): Promise<User> {
		return this.accountService.create(input, lng)
	}


	@Authorization()
	@Mutation(() => Boolean, {
		name: 'changeEmail',
		description:
			'Change the current user email. Normalizes email, rejects same email, resets verification and sends a new verification token.',
	})
	async changeEmail(
		@Authorized() user: User,
		@Args('data') input: ChangeEmailInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.accountService.changeEmail(user, input, lng)
	}


	@Authorization()
	@Mutation(() => Boolean, {
		name: 'changePassword',
		description:
			'Change the current user password. Verifies old password, rejects identical new password, hashes and updates on success.',
	})
	async changePassword(
		@Authorized() user: User,
		@Args('data') input: ChangePasswordInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.accountService.changePassword(user, input, lng)
	}
}


src/modules/auth/account/account.service.ts
[ Код из файла ]

import { hash, verify } from 'argon2'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { isPrismaError } from '@/shared/utils'
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common'

import { VerificationService } from '../verification'

import { ChangeEmailInput, ChangePasswordInput, CreateAccountInput } from './dtos'
import { User } from './models'


@Injectable()
export class AccountService extends CoreService {
	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		private readonly verification: VerificationService,
	) {
		super(i18n, prisma)
	}


	private normalizeEmail(email: string): string {
		return email.trim().toLowerCase()
	}


	async me(id: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				fullName: true,
				firstName: true,
				lastName: true,
				phone: true,
				email: true,
				isEmailVerified: true,
				isTotpEnabled: true,
				isOtpEnabled: true,
				createdAt: true,
				updatedAt: true,
			},
		})

		return user as unknown as User | null
	}


	async create(input: CreateAccountInput, lng: Language): Promise<User> {
		const email = this.normalizeEmail(input.email)
		const hashedPassword = await hash(input.password)

		try {
			const user = await this.prisma.user.create({
				data: { ...input, email, password: hashedPassword },
				select: {
					id: true,
					email: true,
					fullName: true,
					firstName: true,
					lastName: true,
					isEmailVerified: true,
					createdAt: true,
					updatedAt: true,
				},
			})

			await this.verification.sendEmailVerificationToken(user as unknown as User, lng)

			return user as unknown as User
		} catch (e) {
			if (isPrismaError(e, 'P2002')) {
				throw new ConflictException(
					this.msg('auth.errors.user.already_exists', 'This email is already in use', { lng }),
				)
			}
			throw new InternalServerErrorException(this.msg('common.errors.unexpected', 'Unexpected error', { lng }))
		}
	}


	async changeEmail(user: User, input: ChangeEmailInput, lng: Language): Promise<boolean> {
		const email = this.normalizeEmail(input.email)

		if (email === this.normalizeEmail(user.email)) {
			throw new BadRequestException(
				this.msg('auth.errors.user.same_email', 'This email is already your current email', { lng }),
			)
		}

		try {
			const updated = await this.prisma.user.update({
				where: { id: user.id },
				data: { email, isEmailVerified: false },
				select: { id: true, email: true, isEmailVerified: true },
			})

			await this.verification.sendEmailVerificationToken(updated as unknown as User, lng)
			return true
		} catch (e) {
			if (isPrismaError(e, 'P2002')) {
				throw new ConflictException(
					this.msg('auth.errors.user.already_exists', 'This email is already in use', { lng }),
				)
			}
			throw new InternalServerErrorException(this.msg('common.errors.unexpected', 'Unexpected error', { lng }))
		}
	}


	async changePassword(user: User, input: ChangePasswordInput, lng: Language): Promise<boolean> {
		const { oldPassword, newPassword } = input

		const isValidOld = await verify(user.password, oldPassword)
		if (!isValidOld) {
			throw new BadRequestException(this.msg('auth.errors.password.invalid', 'Invalid password', { lng }))
		}

		if (oldPassword === newPassword) {
			throw new BadRequestException(
				this.msg('auth.errors.password.same', 'New password must differ from the old one', { lng }),
			)
		}

		try {
			const hashed = await hash(newPassword)
			await this.prisma.user.update({
				where: { id: user.id },
				data: { password: hashed },
				select: { id: true },
			})
			return true
		} catch {
			throw new InternalServerErrorException(
				this.msg('auth.errors.password.change_failed', 'Failed to change password', { lng }),
			)
		}
	}
}


src/modules/auth/account/dtos/change-email.dto.ts
[ Код из файла ]

import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ChangeEmailInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string
}


src/modules/auth/account/dtos/change-password.dto.ts
[ Код из файла ]

import { IsNotEmpty, IsString, MinLength } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ChangePasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	oldPassword: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	newPassword: string
}


src/modules/auth/account/dtos/create.dto.ts
[ Код из файла ]

import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MinLength } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateAccountInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
	fullName: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@IsPhoneNumber()
	phone: string
}


src/modules/auth/account/dtos/index.ts
[ Код из файла ]

export * from './change-email.dto'
export * from './change-password.dto'
export * from './create.dto'


src/modules/auth/account/index.ts
[ Код из файла ]

export * from './account.module'
export * from './account.service'
export * from './models'


src/modules/auth/account/models/index.ts
[ Код из файла ]

export * from './user.model'


src/modules/auth/account/models/user.model.ts
[ Код из файла ]

import { Field, HideField, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class User {
	@Field(() => ID)
	id: string

	@Field(() => String)
	fullName: string

	@Field(() => String)
	email: string

	@Field(() => String, { nullable: true })
	phone: string

	@HideField()
	password: string | null

	@Field(() => String, { nullable: true })
	firstName: string

	@Field(() => String, { nullable: true })
	lastName: string

	@Field(() => String, { nullable: true })
	avatar: string

	@Field(() => String, { nullable: true })
	bio: string

	@Field(() => Boolean)
	isEmailVerified: boolean

	@Field(() => Boolean)
	isTotpEnabled: boolean

	@Field(() => String, { nullable: true })
	totpSecret: string

	@Field(() => Boolean)
	isOtpEnabled: boolean

	@Field(() => String, { nullable: true })
	otpSecret: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}


src/modules/auth/index.ts
[ Код из файла ]

export * from './account'
export * from './otp'
export * from './recovery'
export * from './session'
export * from './totp'
export * from './verification'


src/modules/auth/otp/constants/index.ts
[ Код из файла ]

export * from './otp.constants'


src/modules/auth/otp/constants/otp.constants.ts
[ Код из файла ]

import type { Prisma } from '@prisma/__generated__'




export const OTP_CODE_LENGTH = 6
export const OTP_CODE_EXPIRY = 300
export const OTP_MAX_ATTEMPTS = 3


export const OTP_CHANNELS = Object.freeze({
	EMAIL: 'email',
	SMS: 'sms',
}) as Readonly<{
	EMAIL: 'email'
	SMS: 'sms'
}>

export type OtpChannel = (typeof OTP_CHANNELS)[keyof typeof OTP_CHANNELS]


export const OTP_BACKUP_CODES_COUNT = 10
export const OTP_BACKUP_CODE_BYTES = 4


export const OTP_CODE_TTL = 300
export const OTP_COOLDOWN = 60
export const OTP_RATE_LIMIT_WINDOW = 3600
export const OTP_CODE_REUSE_WINDOW = 90


export const OTP_MAX_REQUESTS_PER_HOUR = 5
export const OTP_MAX_ATTEMPTS_PER_CODE = 3

export const OTP_RATE_LIMIT_ACTIONS = Object.freeze({
	ENABLE: 'enable',
	DISABLE: 'disable',
	SEND: 'send',
	VERIFY: 'verify',
	REGENERATE: 'regenerate',
}) as Readonly<{
	ENABLE: 'enable'
	DISABLE: 'disable'
	SEND: 'send'
	VERIFY: 'verify'
	REGENERATE: 'regenerate'
}>

export type OtpAction = (typeof OTP_RATE_LIMIT_ACTIONS)[keyof typeof OTP_RATE_LIMIT_ACTIONS]


export const OTP_REDIS_KEY_PREFIX = Object.freeze({
	CODE: (userId: string): string => `otp:code:${userId}`,
	USED_CODE: (userId: string, code: string): string => `otp:used:${userId}:${code}`,
	ATTEMPTS: (userId: string): string => `otp:attempts:${userId}`,
	RATE_LIMIT: (userId: string, action: string): string => `otp:rate:${userId}:${action}`,
	COOLDOWN: (userId: string): string => `otp:cooldown:${userId}`,
}) as Readonly<{
	CODE: (userId: string) => string
	USED_CODE: (userId: string, code: string) => string
	ATTEMPTS: (userId: string) => string
	RATE_LIMIT: (userId: string, action: string) => string
	COOLDOWN: (userId: string) => string
}>


export const OTP_AUDIT_ACTIONS = Object.freeze({
	ENABLED: 'OTP_ENABLED',
	DISABLED: 'OTP_DISABLED',
	SENT: 'OTP_SENT',
	VERIFIED: 'OTP_VERIFIED',
	FAILED: 'OTP_FAILED',
	MAX_ATTEMPTS: 'OTP_MAX_ATTEMPTS',
	BACKUP_CODE_VERIFIED: 'OTP_BACKUP_CODE_VERIFIED',
	BACKUP_CODES_REGENERATED: 'OTP_BACKUP_CODES_REGENERATED',
}) as Readonly<{
	ENABLED: 'OTP_ENABLED'
	DISABLED: 'OTP_DISABLED'
	SENT: 'OTP_SENT'
	VERIFIED: 'OTP_VERIFIED'
	FAILED: 'OTP_FAILED'
	MAX_ATTEMPTS: 'OTP_MAX_ATTEMPTS'
	BACKUP_CODE_VERIFIED: 'OTP_BACKUP_CODE_VERIFIED'
	BACKUP_CODES_REGENERATED: 'OTP_BACKUP_CODES_REGENERATED'
}>

export type OtpAuditAction = (typeof OTP_AUDIT_ACTIONS)[keyof typeof OTP_AUDIT_ACTIONS]


export const OTP_VALIDATION_PATTERNS = Object.freeze({
	OTP_CODE: /^\d{6}$/,
	BACKUP_CODE: /^[A-F0-9]{8}$/,
	PHONE: /^\+[1-9]\d{1,14}$/,
}) as Readonly<{
	OTP_CODE: RegExp
	BACKUP_CODE: RegExp
	PHONE: RegExp
}>


export interface OtpCodeCache {
	code: string
	channel: OtpChannel
	expiresAt: number
}

export type OtpAuditMetadata = Prisma.JsonObject & {
	channel?: OtpChannel
	timestamp: string
	ip?: string
	userAgent?: string
	attempts?: number
}

export const createOtpAuditMetadata = (
	data: Partial<Omit<OtpAuditMetadata, 'timestamp'>> & { timestamp?: string } = {},
): Prisma.InputJsonObject => {
	return {
		timestamp: new Date().toISOString(),
		...data,
	}
}


src/modules/auth/otp/dtos/disable-otp.dto.ts
[ Код из файла ]

import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { OTP_VALIDATION_PATTERNS } from '../constants'

@InputType()
export class DisableOtpInput {
	@Field(() => String, { description: 'User password for verification' })
	@IsString({ message: 'Password must be a string' })
	@IsNotEmpty({ message: 'Password is required' })
	@MinLength(1, { message: 'Password cannot be empty' })
	password: string

	@Field(() => String, { description: 'Current OTP code' })
	@IsString({ message: 'Code must be a string' })
	@IsNotEmpty({ message: 'Code is required' })
	@Matches(OTP_VALIDATION_PATTERNS.OTP_CODE, { message: 'Code must be exactly 6 digits' })
	code: string
}


src/modules/auth/otp/dtos/enable-otp.dto.ts
[ Код из файла ]

import { IsEnum, IsOptional, IsString, Matches } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { OTP_CHANNELS, OTP_VALIDATION_PATTERNS, type OtpChannel } from '../constants'

@InputType()
export class EnableOtpInput {
	@Field(() => String, { description: 'Preferred delivery channel' })
	@IsEnum(OTP_CHANNELS, { message: 'Channel must be either email or sms' })
	channel: OtpChannel

	@Field(() => String, { nullable: true, description: 'Phone number (required for SMS)' })
	@IsOptional()
	@IsString()
	@Matches(OTP_VALIDATION_PATTERNS.PHONE, {
		message: 'Phone must be in E.164 format (e.g., +1234567890)',
	})
	phone?: string
}


src/modules/auth/otp/dtos/index.ts
[ Код из файла ]

export * from './disable-otp.dto'
export * from './enable-otp.dto'
export * from './send-otp.dto'
export * from './verify-otp.dto'


src/modules/auth/otp/dtos/send-otp.dto.ts
[ Код из файла ]

import { IsEnum } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { OTP_CHANNELS, type OtpChannel } from '../constants'

@InputType()
export class SendOtpInput {
	@Field(() => String, { description: 'Delivery channel for OTP code' })
	@IsEnum(OTP_CHANNELS, { message: 'Channel must be either email or sms' })
	channel: OtpChannel
}


src/modules/auth/otp/dtos/verify-otp.dto.ts
[ Код из файла ]

import { IsNotEmpty, IsString, Matches } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { OTP_VALIDATION_PATTERNS } from '../constants'

@InputType()
export class VerifyOtpInput {
	@Field(() => String, { description: '6-digit OTP code' })
	@IsString({ message: 'Code must be a string' })
	@IsNotEmpty({ message: 'Code is required' })
	@Matches(OTP_VALIDATION_PATTERNS.OTP_CODE, { message: 'Code must be exactly 6 digits' })
	code: string
}

@InputType()
export class VerifyBackupCodeInput {
	@Field(() => String, { description: 'Backup recovery code' })
	@IsString({ message: 'Backup code must be a string' })
	@IsNotEmpty({ message: 'Backup code is required' })
	@Matches(OTP_VALIDATION_PATTERNS.BACKUP_CODE, { message: 'Invalid backup code format' })
	backupCode: string
}


src/modules/auth/otp/guards/index.ts
[ Код из файла ]

export * from './otp-rate-limit.guard'


src/modules/auth/otp/guards/otp-rate-limit.guard.ts
[ Код из файла ]

import { I18nService } from '@/core/i18n'
import { RedisService } from '@/core/redis'
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { OTP_MAX_REQUESTS_PER_HOUR, OTP_RATE_LIMIT_WINDOW } from '../constants'

export const OTP_RATE_LIMIT = 'otp_rate_limit'

export interface OtpRateLimitOptions {
	maxAttempts: number
	windowMs: number
	action: string
}

interface GraphQLContext {
	req: {
		user?: {
			id: string
			email: string
		}
	}
}

@Injectable()
export class OtpRateLimitGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly redis: RedisService,
		private i18n: I18nService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const options = this.reflector.get<OtpRateLimitOptions>(OTP_RATE_LIMIT, context.getHandler())

		if (!options) {
			return true
		}

		const ctx = GqlExecutionContext.create(context)
		const gqlContext = ctx.getContext<GraphQLContext>()
		const user = gqlContext.req.user

		if (!user) {
			return true
		}

		const key = `otp:rate:${user.id}:${options.action}`
		const attemptsStr = await this.redis.get(key)
		const attempts = attemptsStr ? parseInt(attemptsStr, 10) : 0

		if (attempts >= options.maxAttempts) {
			const ttl = await this.redis.ttl(key)
			const minutesLeft = Math.ceil(ttl / 60)

			const translatedMessage = this.i18n.t('otp.rate_limit_exceeded' as any, {
				args: { minutes: minutesLeft },
			})

			const message =
				typeof translatedMessage === 'string'
					? translatedMessage
					: `Too many attempts. Try again in ${minutesLeft} minutes`

			throw new HttpException(message, HttpStatus.TOO_MANY_REQUESTS)
		}

		return true
	}
}

export const SetOtpRateLimit = (
	action: string,
	maxAttempts: number = OTP_MAX_REQUESTS_PER_HOUR,
	windowMs: number = OTP_RATE_LIMIT_WINDOW * 1000,
): MethodDecorator => {
	return <T>(
		target: object,
		propertyKey: string | symbol,
		descriptor: TypedPropertyDescriptor<T>,
	): TypedPropertyDescriptor<T> => {
		if (descriptor.value && typeof descriptor.value === 'function') {
			Reflect.defineMetadata(
				OTP_RATE_LIMIT,
				{ maxAttempts, windowMs, action } as OtpRateLimitOptions,
				descriptor.value,
			)
		}

		return descriptor
	}
}


src/modules/auth/otp/index.ts
[ Код из файла ]

export * from './otp.module'
export * from './otp.service'


src/modules/auth/otp/models/backup-codes.model.ts
[ Код из файла ]

import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('OtpBackupCodesStatus')
export class OtpBackupCodesStatusModel {
	@Field(() => Int, { description: 'Total backup codes' })
	total: number

	@Field(() => Int, { description: 'Remaining unused codes' })
	remaining: number

	@Field(() => Int, { description: 'Used backup codes' })
	used: number
}


src/modules/auth/otp/models/index.ts
[ Код из файла ]

export * from './backup-codes.model'
export * from './otp-enabled.model'
export * from './otp-sent.model'


src/modules/auth/otp/models/otp-enabled.model.ts
[ Код из файла ]

import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OtpEnabled')
export class OtpEnabledModel {
	@Field(() => Boolean, { description: 'Success status' })
	success: boolean

	@Field(() => [String], {
		description: 'Backup recovery codes (store securely!)',
	})
	backupCodes: string[]

	@Field(() => String, {
		description: 'Warning message about backup codes',
	})
	message: string
}


src/modules/auth/otp/models/otp-sent.model.ts
[ Код из файла ]

import { Field, Int, ObjectType } from '@nestjs/graphql'

import { OTP_CHANNELS } from '../constants'

@ObjectType('OtpSent')
export class OtpSentModel {
	@Field(() => Boolean, { description: 'Success status' })
	success: boolean

	@Field(() => String, { description: 'Delivery channel used', defaultValue: OTP_CHANNELS.EMAIL })
	channel: string

	@Field(() => Int, { description: 'Code expires in (seconds)' })
	expiresIn: number

	@Field(() => String, { description: 'Success message' })
	message: string
}


src/modules/auth/otp/otp.resolver.ts
[ Код из файла ]

import { Lang, Language } from '@/core/i18n'
import { Authorization, Authorized } from '@/shared/decorators'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@prisma/__generated__'

import { OTP_MAX_REQUESTS_PER_HOUR, OTP_RATE_LIMIT_ACTIONS, OTP_RATE_LIMIT_WINDOW } from './constants'
import { DisableOtpInput, EnableOtpInput, SendOtpInput, VerifyBackupCodeInput, VerifyOtpInput } from './dtos'
import { OtpRateLimitGuard, SetOtpRateLimit } from './guards/otp-rate-limit.guard'
import { OtpBackupCodesStatusModel, OtpEnabledModel, OtpSentModel } from './models'
import { OtpService } from './otp.service'

@Resolver('Otp')
export class OtpResolver {
	constructor(private readonly otpService: OtpService) {}

	@Authorization()
	@UseGuards(OtpRateLimitGuard)
	@SetOtpRateLimit(OTP_RATE_LIMIT_ACTIONS.ENABLE, OTP_MAX_REQUESTS_PER_HOUR, OTP_RATE_LIMIT_WINDOW * 1000)
	@Mutation(() => OtpEnabledModel, {
		name: 'enableOtp',
		description: 'Enable OTP two-factor authentication',
	})
	async enable(
		@Authorized() user: User,
		@Args('data') input: EnableOtpInput,
		@Lang() lng: Language,
	): Promise<OtpEnabledModel> {
		return this.otpService.enable(user, input, lng)
	}

	@Authorization()
	@UseGuards(OtpRateLimitGuard)
	@SetOtpRateLimit(OTP_RATE_LIMIT_ACTIONS.DISABLE, OTP_MAX_REQUESTS_PER_HOUR, OTP_RATE_LIMIT_WINDOW * 1000)
	@Mutation(() => Boolean, {
		name: 'disableOtp',
		description: 'Disable OTP two-factor authentication',
	})
	async disable(
		@Authorized() user: User,
		@Args('data') input: DisableOtpInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.otpService.disable(user, input, lng)
	}

	@Authorization()
	@UseGuards(OtpRateLimitGuard)
	@SetOtpRateLimit(OTP_RATE_LIMIT_ACTIONS.SEND, OTP_MAX_REQUESTS_PER_HOUR, OTP_RATE_LIMIT_WINDOW * 1000)
	@Mutation(() => OtpSentModel, {
		name: 'sendOtp',
		description: 'Send OTP code via email or SMS',
	})
	async send(
		@Authorized() user: User,
		@Args('data') input: SendOtpInput,
		@Lang() lng: Language,
	): Promise<OtpSentModel> {
		return this.otpService.send(user, input, lng)
	}

	@Authorization()
	@UseGuards(OtpRateLimitGuard)
	@SetOtpRateLimit(OTP_RATE_LIMIT_ACTIONS.VERIFY, OTP_MAX_REQUESTS_PER_HOUR, OTP_RATE_LIMIT_WINDOW * 1000)
	@Mutation(() => Boolean, {
		name: 'verifyOtp',
		description: 'Verify OTP code',
	})
	async verify(
		@Authorized() user: User,
		@Args('data') input: VerifyOtpInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.otpService.verify(user, input, lng)
	}

	@Authorization()
	@Mutation(() => Boolean, {
		name: 'verifyOtpBackupCode',
		description: 'Verify OTP backup code',
	})
	async verifyBackupCode(
		@Authorized() user: User,
		@Args('data') input: VerifyBackupCodeInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.otpService.verifyBackupCode(user, input.backupCode, lng)
	}

	@Authorization()
	@Query(() => OtpBackupCodesStatusModel, {
		name: 'otpBackupCodesStatus',
		description: 'Get OTP backup codes status',
	})
	async getBackupCodesStatus(@Authorized() user: User, @Lang() lng: Language): Promise<OtpBackupCodesStatusModel> {
		return this.otpService.getBackupCodesStatus(user, lng)
	}

	@Authorization()
	@Mutation(() => OtpEnabledModel, {
		name: 'regenerateOtpBackupCodes',
		description: 'Regenerate OTP backup codes',
	})
	async regenerateBackupCodes(
		@Authorized() user: User,
		@Args('password') password: string,
		@Lang() lng: Language,
	): Promise<OtpEnabledModel> {
		return this.otpService.regenerateBackupCodes(user, password, lng)
	}
}


src/modules/auth/otp/otp.service.ts
[ Код из файла ]

import { randomBytes, randomInt } from 'crypto'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { HashUtil } from '@/shared/utils/hash.util'
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { E2FAMethod, type User } from '@prisma/__generated__'

import { VerificationService } from '../verification'

import {
	createOtpAuditMetadata,
	OTP_AUDIT_ACTIONS,
	OTP_BACKUP_CODE_BYTES,
	OTP_BACKUP_CODES_COUNT,
	OTP_CHANNELS,
	OTP_CODE_EXPIRY,
	OTP_CODE_LENGTH,
	OTP_CODE_REUSE_WINDOW,
	OTP_CODE_TTL,
	OTP_COOLDOWN,
	OTP_MAX_ATTEMPTS_PER_CODE,
	OTP_MAX_REQUESTS_PER_HOUR,
	OTP_RATE_LIMIT_WINDOW,
	OTP_REDIS_KEY_PREFIX,
	OtpAuditMetadata,
	type OtpCodeCache,
} from './constants'
import { DisableOtpInput, EnableOtpInput, VerifyOtpInput } from './dtos'
import { SendOtpInput } from './dtos/send-otp.dto'
import { OtpBackupCodesStatusModel, OtpEnabledModel, OtpSentModel } from './models'

@Injectable()
export class OtpService extends CoreService {
	private readonly logger = new Logger(OtpService.name)

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly verification: VerificationService,
	) {
		super(i18n, prisma, redis)
	}


	async enable(user: User, input: EnableOtpInput, lng: Language): Promise<OtpEnabledModel> {
		await this.checkRateLimit(user.id, 'enable', lng)

		if (user.isOtpEnabled) {
			throw new BadRequestException(
				this.msg('auth.errors.otp.already_enabled', 'OTP is already enabled', { lng }),
			)
		}

		if (input.channel === OTP_CHANNELS.SMS && !input.phone && !user.phone) {
			throw new BadRequestException(
				this.msg('auth.errors.otp.phone_required', 'Phone number is required for SMS channel', { lng }),
			)
		}

		if (input.phone && input.phone !== user.phone) {
			await this.prisma.user.update({
				where: { id: user.id },
				data: { phone: input.phone },
			})
		}

		const backupCodes = this.generateBackupCodes()
		const hashedBackupCodes = await Promise.all(backupCodes.map(code => HashUtil.hash(code)))

		await this.prisma.$transaction(async tx => {
			await tx.user.update({
				where: { id: user.id },
				data: {
					isOtpEnabled: true,
				},
			})

			await tx.backupCode.createMany({
				data: hashedBackupCodes.map(hash => ({
					userId: user.id,
					type: E2FAMethod.OTP,
					code: hash,
				})),
			})

			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: OTP_AUDIT_ACTIONS.ENABLED,
					metadata: createOtpAuditMetadata({
						channel: input.channel,
					}),
				},
			})
		})

		await this.clearRateLimit(user.id, 'enable')

		this.logger.log(`OTP enabled for user ${user.id} via ${input.channel}`)

		return {
			success: true,
			backupCodes,
			message: this.msg(
				'auth.errors.otp.backup_codes_warning',
				'Save these backup codes in a secure place. Each code can only be used once',
				{ lng },
			),
		}
	}


	async disable(user: User, input: DisableOtpInput, lng: Language): Promise<boolean> {
		await this.checkRateLimit(user.id, 'disable', lng)

		if (!user.isOtpEnabled) {
			throw new BadRequestException(this.msg('auth.errors.otp.not_enabled', 'OTP is not enabled', { lng }))
		}

		const isPasswordValid = await HashUtil.verify(user.password, input.password)

		if (!isPasswordValid) {
			await this.incrementFailedAttempts(user.id, 'disable')
			throw new UnauthorizedException(this.msg('auth.errors.password.invalid', 'Invalid password', { lng }))
		}

		const isCodeValid = await this.verifyCode(user.id, input.code, lng)

		if (!isCodeValid) {
			await this.incrementFailedAttempts(user.id, 'disable')
			throw new BadRequestException(this.msg('auth.errors.otp.invalid_code', 'Invalid OTP code', { lng }))
		}

		await this.prisma.$transaction(async tx => {
			await tx.user.update({
				where: { id: user.id },
				data: {
					isOtpEnabled: false,
				},
			})

			await tx.backupCode.deleteMany({
				where: {
					userId: user.id,
					type: E2FAMethod.OTP,
				},
			})

			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: OTP_AUDIT_ACTIONS.DISABLED,
					metadata: createOtpAuditMetadata(),
				},
			})
		})

		await this.clearOtpData(user.id)
		await this.clearRateLimit(user.id, 'disable')

		this.logger.warn(`OTP disabled for user ${user.id}`)

		return true
	}


	async send(user: User, input: SendOtpInput, lng: Language): Promise<OtpSentModel> {
		await this.checkRateLimit(user.id, 'send', lng)

		if (!user.isOtpEnabled) {
			throw new BadRequestException(this.msg('auth.errors.otp.not_enabled', 'OTP is not enabled', { lng }))
		}

		await this.checkCooldown(user.id, lng)

		if (input.channel === OTP_CHANNELS.SMS && !user.phone) {
			throw new BadRequestException(
				this.msg('auth.errors.otp.phone_not_set', 'Phone number is not set for this user', { lng }),
			)
		}

		const code = this.generateOtpCode()
		const hashedCode = await HashUtil.hash(code)

		const cacheData: OtpCodeCache = {
			code: hashedCode,
			channel: input.channel,
			expiresAt: Date.now() + OTP_CODE_TTL * 1000,
		}

		const codeKey = OTP_REDIS_KEY_PREFIX.CODE(user.id)
		await this.rSetJSON(codeKey, cacheData, OTP_CODE_TTL)

		const cooldownKey = OTP_REDIS_KEY_PREFIX.COOLDOWN(user.id)
		await this.rSet(cooldownKey, '1', OTP_COOLDOWN)

		try {
			if (input.channel === OTP_CHANNELS.EMAIL) {
				await this.verification.sendEmailVerificationOtpToken(user, lng)
			} else if (input.channel === OTP_CHANNELS.SMS && user.phone) {
				await this.verification.sendSmsVerificationOtpToken(user, lng)
			}
		} catch (error) {
			this.logger.error(`Failed to send OTP to user ${user.id}: ${error}`)
			throw new BadRequestException(this.msg('auth.errors.otp.send_failed', 'Failed to send OTP code', { lng }))
		}

		await this.prisma.auditLog.create({
			data: {
				userId: user.id,
				action: OTP_AUDIT_ACTIONS.SENT,
				metadata: createOtpAuditMetadata({ channel: input.channel }),
			},
		})

		this.logger.log(`OTP sent to user ${user.id} via ${input.channel}`)

		return {
			success: true,
			channel: input.channel,
			expiresIn: OTP_CODE_EXPIRY,
			message: this.msg('auth.errors.otp.sent', `OTP code sent to your ${input.channel}`, { lng }),
		}
	}


	async verify(user: User, input: VerifyOtpInput, lng: Language): Promise<boolean> {
		return this.verifyCode(user.id, input.code, lng)
	}


	private async verifyCode(userId: string, code: string, lng: Language): Promise<boolean> {
		await this.checkRateLimit(userId, 'verify', lng)

		const codeKey = OTP_REDIS_KEY_PREFIX.CODE(userId)
		const cached = await this.rGetJSON<OtpCodeCache>(codeKey)

		if (!cached) {
			throw new BadRequestException(
				this.msg('auth.errors.otp.not_found', 'OTP code not found or expired', { lng }),
			)
		}

		if (Date.now() > cached.expiresAt) {
			await this.rDel(codeKey)
			throw new BadRequestException(this.msg('auth.errors.otp.expired', 'OTP code has expired', { lng }))
		}

		const attemptsKey = OTP_REDIS_KEY_PREFIX.ATTEMPTS(userId)
		const attempts = (await this.rGetNumber(attemptsKey)) || 0

		if (attempts >= OTP_MAX_ATTEMPTS_PER_CODE) {
			await this.rDel(codeKey)
			await this.logAudit(userId, OTP_AUDIT_ACTIONS.MAX_ATTEMPTS, { attempts })
			throw new BadRequestException(
				this.msg('auth.errors.otp.max_attempts', 'Maximum verification attempts exceeded', { lng }),
			)
		}

		const isValid = await HashUtil.verify(cached.code, code)

		await this.rIncr(attemptsKey, OTP_CODE_TTL)

		if (!isValid) {
			await this.incrementFailedAttempts(userId, 'verify')
			await this.logAudit(userId, OTP_AUDIT_ACTIONS.FAILED, { attempts: attempts + 1 })
			throw new BadRequestException(this.msg('auth.errors.otp.invalid_code', 'Invalid OTP code', { lng }))
		}

		const usedKey = OTP_REDIS_KEY_PREFIX.USED_CODE(userId, code)
		const isUsed = await this.rExists(usedKey)

		if (isUsed) {
			throw new BadRequestException(
				this.msg('auth.errors.otp.already_used', 'This code has already been used', { lng }),
			)
		}

		await this.rSet(usedKey, '1', OTP_CODE_REUSE_WINDOW)

		await this.rDel(codeKey)
		await this.rDel(attemptsKey)
		await this.clearRateLimit(userId, 'verify')

		await this.logAudit(userId, OTP_AUDIT_ACTIONS.VERIFIED)

		this.logger.log(`OTP verified for user ${userId}`)

		return true
	}


	async verifyBackupCode(user: User, backupCode: string, lng: Language): Promise<boolean> {
		if (!user.isOtpEnabled) {
			throw new BadRequestException(this.msg('auth.errors.otp.not_enabled', 'OTP is not enabled', { lng }))
		}

		const normalizedCode = backupCode.replace(/\s/g, '').toUpperCase()

		const backupCodes = await this.prisma.backupCode.findMany({
			where: {
				userId: user.id,
				type: E2FAMethod.OTP,
				usedAt: null,
			},
		})

		for (const backup of backupCodes) {
			const isMatch = await HashUtil.verify(backup.code, normalizedCode)

			if (isMatch) {
				await this.prisma.$transaction(async tx => {
					await tx.backupCode.update({
						where: { id: backup.id },
						data: { usedAt: new Date() },
					})

					await tx.auditLog.create({
						data: {
							userId: user.id,
							action: OTP_AUDIT_ACTIONS.BACKUP_CODE_VERIFIED,
							metadata: createOtpAuditMetadata(),
						},
					})
				})

				this.logger.log(`Backup code used for user ${user.id}`)
				return true
			}
		}

		throw new BadRequestException(
			this.msg('auth.errors.otp.invalid_backup_code', 'Invalid or already used backup code', { lng }),
		)
	}


	async getBackupCodesStatus(user: User, lng: Language): Promise<OtpBackupCodesStatusModel> {
		if (!user.isOtpEnabled) {
			throw new BadRequestException(this.msg('auth.errors.otp.not_enabled', 'OTP is not enabled', { lng }))
		}

		const allCodes = await this.prisma.backupCode.count({
			where: {
				userId: user.id,
				type: E2FAMethod.OTP,
			},
		})

		const usedCodes = await this.prisma.backupCode.count({
			where: {
				userId: user.id,
				type: E2FAMethod.OTP,
				usedAt: { not: null },
			},
		})

		return {
			total: allCodes,
			remaining: allCodes - usedCodes,
			used: usedCodes,
		}
	}


	async regenerateBackupCodes(user: User, password: string, lng: Language): Promise<OtpEnabledModel> {
		if (!user.isOtpEnabled) {
			throw new BadRequestException(this.msg('auth.errors.otp.not_enabled', 'OTP is not enabled', { lng }))
		}

		const isPasswordValid = await HashUtil.verify(user.password, password)

		if (!isPasswordValid) {
			throw new UnauthorizedException(this.msg('auth.errors.password.invalid', 'Invalid password', { lng }))
		}

		const backupCodes = this.generateBackupCodes()
		const hashedBackupCodes = await Promise.all(backupCodes.map(code => HashUtil.hash(code)))

		await this.prisma.$transaction(async tx => {
			await tx.backupCode.deleteMany({
				where: {
					userId: user.id,
					type: E2FAMethod.OTP,
				},
			})

			await tx.backupCode.createMany({
				data: hashedBackupCodes.map(hash => ({
					userId: user.id,
					type: E2FAMethod.OTP,
					code: hash,
				})),
			})

			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: OTP_AUDIT_ACTIONS.BACKUP_CODES_REGENERATED,
					metadata: createOtpAuditMetadata(),
				},
			})
		})

		this.logger.log(`Backup codes regenerated for user ${user.id}`)

		return {
			success: true,
			backupCodes,
			message: this.msg(
				'auth.errors.otp.backup_codes_warning',
				'Save these backup codes in a secure place. Each code can only be used once',
				{ lng },
			),
		}
	}



	private generateOtpCode(): string {
		return randomInt(0, 999999).toString().padStart(OTP_CODE_LENGTH, '0')
	}


	private generateSecret(): string {
		return randomBytes(32).toString('hex')
	}


	private generateBackupCodes(): string[] {
		return Array.from({ length: OTP_BACKUP_CODES_COUNT }, () =>
			randomBytes(OTP_BACKUP_CODE_BYTES).toString('hex').toUpperCase(),
		)
	}


	private async checkRateLimit(userId: string, action: string, lng: Language): Promise<void> {
		const key = OTP_REDIS_KEY_PREFIX.RATE_LIMIT(userId, action)
		const attempts = await this.rGetNumber(key)

		if (attempts !== null && attempts >= OTP_MAX_REQUESTS_PER_HOUR) {
			const ttl = await this.rTTL(key)
			const minutesLeft = Math.ceil(ttl / 60)

			throw new BadRequestException(
				this.msg(
					'auth.errors.otp.rate_limit_exceeded',
					`Too many attempts. Try again in ${minutesLeft} minutes`,
					{ lng, minutes: minutesLeft },
				),
			)
		}
	}


	private async checkCooldown(userId: string, lng: Language): Promise<void> {
		const key = OTP_REDIS_KEY_PREFIX.COOLDOWN(userId)
		const cooldown = await this.rExists(key)

		if (cooldown) {
			const ttl = await this.rTTL(key)
			throw new BadRequestException(
				this.msg('auth.errors.otp.cooldown', `Please wait ${ttl} seconds before requesting a new code`, {
					lng,
					seconds: ttl,
				}),
			)
		}
	}


	private async incrementFailedAttempts(userId: string, action: string): Promise<void> {
		const key = OTP_REDIS_KEY_PREFIX.RATE_LIMIT(userId, action)
		await this.rIncr(key, OTP_RATE_LIMIT_WINDOW)
	}


	private async clearRateLimit(userId: string, action: string): Promise<void> {
		const key = OTP_REDIS_KEY_PREFIX.RATE_LIMIT(userId, action)
		await this.rDel(key)
	}


	private async clearOtpData(userId: string): Promise<void> {
		const keys = [
			OTP_REDIS_KEY_PREFIX.CODE(userId),
			OTP_REDIS_KEY_PREFIX.ATTEMPTS(userId),
			OTP_REDIS_KEY_PREFIX.COOLDOWN(userId),
		]

		await Promise.all(keys.map(key => this.rDel(key)))
	}


	private async logAudit(userId: string, action: string, metadata?: any): Promise<void> {
		await this.prisma.auditLog.create({
			data: {
				userId,
				action,
				metadata: createOtpAuditMetadata(
					metadata as Partial<Omit<OtpAuditMetadata, 'timestamp'>> & { timestamp?: string },
				),
			},
		})
	}
}


src/modules/auth/recovery/dtos/index.ts
[ Код из файла ]

export * from './new-password.dto'
export * from './reset-password.dto'


src/modules/auth/recovery/dtos/new-password.dto.ts
[ Код из файла ]

import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class NewPasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string

	@Field(() => String)
	@IsUUID(4)
	@IsNotEmpty()
	token: string
}


src/modules/auth/recovery/dtos/reset-password.dto.ts
[ Код из файла ]

import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ResetPasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string
}


src/modules/auth/recovery/index.ts
[ Код из файла ]

export * from './recovery.module'
export * from './recovery.service'


src/modules/auth/recovery/recovery.resolver.ts
[ Код из файла ]

import { Lang, Language } from '@/core/i18n'
import { UserAgent } from '@/shared/decorators'
import type { GqlContext } from '@/shared/types'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { NewPasswordInput, ResetPasswordInput } from './dtos'
import { RecoveryService } from './recovery.service'

@Resolver('Recovery')
export class RecoveryResolver {
	constructor(private readonly recoveryService: RecoveryService) {}


	@Mutation(() => Boolean, {
		name: 'resetPassword',
		description: 'Initiate password reset: generate a one-time token and send a reset link to the user’s email.',
	})
	async resetPassword(
		@Context() { req }: GqlContext,
		@Args('data', {
			type: () => ResetPasswordInput,
			description: 'Payload with the email address that requests a password reset.',
		})
		input: ResetPasswordInput,
		@UserAgent() userAgent: string,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.recoveryService.resetPassword(req, input, userAgent, lng)
	}


	@Mutation(() => Boolean, {
		name: 'newPassword',
		description: 'Complete password reset: validate token, set a new password, and consume the token.',
	})
	async newPassword(
		@Args('data', {
			type: () => NewPasswordInput,
			description: 'Payload with the reset token and the new password.',
		})
		input: NewPasswordInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.recoveryService.newPassword(input, lng)
	}
}


src/modules/auth/recovery/recovery.service.ts
[ Код из файла ]

import { hash } from 'argon2'
import { Request } from 'express'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { MailService } from '@/modules/libs'
import { generateToken, getSessionMetadata } from '@/shared/utils'
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ETokenType, User } from '@prisma/__generated__'

import { NewPasswordInput, ResetPasswordInput } from './dtos'

@Injectable()
export class RecoveryService extends CoreService {
	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		private readonly mail: MailService,
	) {
		super(i18n, prisma)
	}


	private normalizeEmail(email: string): string {
		return email.trim().toLowerCase()
	}


	async resetPassword(req: Request, input: ResetPasswordInput, userAgent: string, lng: Language): Promise<boolean> {
		const email = this.normalizeEmail(input.email)

		const user = await this.prisma.user.findUnique({
			where: { email },
			select: { id: true, email: true },
		})

		if (!user) {
			throw new NotFoundException(this.msg('auth.errors.user.not_found', 'User not found', { lng }))
		}

		try {
			const token = await generateToken(this.prisma, user as User, ETokenType.PASSWORD_RESET)

			const meta = getSessionMetadata(req, userAgent)
			try {
				await this.mail.sendPasswordResetToken(user.email, token.token, meta, lng)
			} catch {
				throw new InternalServerErrorException(
					this.msg('auth.errors.mail.reset_send_failed', 'Could not send password reset email', { lng }),
				)
			}

			return true
		} catch {
			throw new InternalServerErrorException(this.msg('common.errors.unexpected', 'Unexpected error', { lng }))
		}
	}


	async newPassword(input: NewPasswordInput, lng: Language): Promise<boolean> {
		const { password, token } = input

		const t = await this.prisma.token.findUnique({
			where: { token },
			select: { id: true, type: true, expiresIn: true, userId: true },
		})

		if (!t || t.type !== ETokenType.PASSWORD_RESET) {
			throw new NotFoundException(this.msg('auth.errors.token.not_found', 'Token not found', { lng }))
		}

		if (new Date(t.expiresIn) < new Date()) {
			throw new BadRequestException(this.msg('auth.errors.token.expired', 'Token expired', { lng }))
		}

		try {
			const hashed = await hash(password)

			await this.prisma.$transaction([
				this.prisma.user.update({
					where: { id: t.userId },
					data: { password: hashed },
					select: { id: true },
				}),
				this.prisma.token.delete({ where: { id: t.id } }),
			])

			return true
		} catch {
			throw new InternalServerErrorException(
				this.msg('auth.errors.password.change_failed', 'Failed to change password', { lng }),
			)
		}
	}
}


src/modules/auth/session/dtos/index.ts
[ Код из файла ]

export * from './login.dto'


src/modules/auth/session/dtos/login.dto.ts
[ Код из файла ]

import { User } from '@/modules/auth'
import { Field, InputType, ObjectType } from '@nestjs/graphql'

@InputType()
export class LoginInput {
	@Field(() => String)
	email: string

	@Field(() => String)
	password: string
}

@ObjectType()
export class LoginResponse {
	@Field(() => String, { nullable: true })
	accessToken?: string

	@Field(() => User, { nullable: true })
	user?: User
}


src/modules/auth/session/index.ts
[ Код из файла ]

export * from './session.module'
export * from './session.service'


src/modules/auth/session/models/index.ts
[ Код из файла ]

export * from './session.model'


src/modules/auth/session/models/session.model.ts
[ Код из файла ]

import type { IDevice, ILocation, ISessionMetadata } from '@/shared/types'
import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Location implements ILocation {
	@Field(() => String)
	country: string

	@Field(() => String)
	city: string

	@Field(() => Number)
	latitude: number

	@Field(() => Number)
	longitude: number
}

@ObjectType()
export class Device implements IDevice {
	@Field(() => String)
	browser: string

	@Field(() => String)
	os: string

	@Field(() => String)
	type: string
}

@ObjectType()
export class SessionMetadata implements ISessionMetadata {
	@Field(() => Location)
	location: Location

	@Field(() => Device)
	device: Device

	@Field(() => String)
	ip: string
}

@ObjectType()
export class Session {
	@Field(() => ID)
	id: string

	@Field(() => String)
	userId: string

	@Field(() => SessionMetadata)
	metadata: SessionMetadata

	@Field(() => String)
	createdAt: string
}


src/modules/auth/session/session.resolver.ts
[ Код из файла ]

import { Lang, Language } from '@/core/i18n'
import { Authorization, UserAgent } from '@/shared/decorators'
import type { GqlContext } from '@/shared/types'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { LoginInput, LoginResponse } from './dtos'
import { Session } from './models'
import { SessionService } from './session.service'

@Resolver()
export class SessionResolver {
	constructor(private readonly sessionService: SessionService) {}


	@Mutation(() => LoginResponse, {
		name: 'login',
		description: 'Authenticate the user and create a session (cookie-based). Returns session metadata.',
	})
	login(
		@Context() { req }: GqlContext,
		@Args('data') data: LoginInput,
		@UserAgent() userAgent: string,
		@Lang() lng: Language,
	): Promise<LoginResponse> {
		return this.sessionService.login(req, userAgent, data, lng)
	}


	@Authorization()
	@Mutation(() => Boolean, {
		name: 'logout',
		description: 'Destroy the current session (logout).',
	})
	logout(@Context() { req }: GqlContext): Promise<boolean> {
		return this.sessionService.logout(req)
	}


	@Authorization()
	@Query(() => Session, {
		name: 'findCurrentSession',
		description: 'Get the current session by the request session id.',
	})
	findCurrent(@Context() { req }: GqlContext): Promise<Session | null> {
		return this.sessionService.findCurrent(req)
	}


	@Authorization()
	@Query(() => [Session], {
		name: 'findSessionsByUser',
		description: 'List all active sessions for the current user (the current session is excluded).',
	})
	findByUser(@Context() { req }: GqlContext, @Lang() lng: Language): Promise<Session[]> {
		return this.sessionService.findByUser(req, lng)
	}


	@Authorization()
	@Mutation(() => Boolean, {
		name: 'clearSessionCookie',
		description: 'Clear the session cookie from the response.',
	})
	clearSession(@Context() { req }: GqlContext): boolean {
		return this.sessionService.clear(req)
	}


	@Authorization()
	@Mutation(() => Boolean, {
		name: 'removeSession',
		description: 'Remove a specific session by id (fails if the id belongs to the current session).',
	})
	removeSession(@Context() { req }: GqlContext, @Args('id') id: string, @Lang() lng: Language): Promise<boolean> {
		return this.sessionService.remove(req, id, lng)
	}
}


src/modules/auth/session/session.service.ts
[ Код из файла ]

import { verify } from 'argon2'
import type { Request } from 'express'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { destroySession, getSessionMetadata, saveSession } from '@/shared/utils'
import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { VerificationService } from '../verification'

import { LoginInput, LoginResponse } from './dtos'
import { Session } from './models'


@Injectable()
export class SessionService extends CoreService {

	private readonly prefix: string

	private readonly cookieName: string

	constructor(
		prisma: PrismaService,
		redis: RedisService,
		i18n: I18nService,
		config: ConfigService,
		private readonly verification: VerificationService,
	) {
		super(i18n, prisma, redis, config)
		this.prefix = this.config.get<string>('SESSION_FOLDER') ?? 'session:'
		this.cookieName = this.config.get<string>('SESSION_COOKIE') ?? 'connect.sid'
	}


	private key(sessionId: string): string {
		return `${this.prefix}${sessionId}`
	}


	async login(req: Request, userAgent: string, data: LoginInput, lng: Language): Promise<LoginResponse> {
		const user = await this.prisma.user.findUnique({ where: { email: data.email } })
		if (!user) {
			throw new NotFoundException(this.msg('auth.errors.user.not_found', 'User not found', { lng }))
		}

		const ok = await verify(user.password, data.password)
		if (!ok) {
			throw new NotFoundException(this.msg('auth.errors.password.invalid', 'Invalid password', { lng }))
		}

		if (!user.isEmailVerified) {
			await this.verification.sendEmailVerificationToken(user, lng).catch(() => {})
			throw new BadRequestException(
				this.msg(
					'auth.errors.account.not_verified',
					'Account not verified. Please check your email for verification',
					{ lng },
				),
			)
		}

		const meta = getSessionMetadata(req, userAgent)
		return saveSession(req, user, meta)
	}


	async logout(req: Request): Promise<boolean> {
		return destroySession(req, this.config)
	}


	async findCurrent(req: Request) {
		const sessionId = req.session.id
		const session = await this.redis.getJSON<Session>(this.key(sessionId))
		return session ? { ...session, id: sessionId } : null
	}


	async findByUser(req: Request, lng: Language) {
		const userId = req.session.userId
		if (!userId) {
			throw new NotFoundException(this.msg('auth.errors.user.not_found', 'User not found', { lng }))
		}

		const keys = await this.redis.keys(`${this.prefix}*`)
		if (keys.length === 0) return []

		const raw = (await this.redis.getClient().mGet(keys)) as (string | null)[]

		const sessions = keys.flatMap((key, i) => {
			const s = raw[i]
			if (!s) return []
			try {
				const parsed = JSON.parse(s) as Session
				if (parsed?.userId !== userId) return []
				const id = key.slice(this.prefix.length)
				return [{ ...parsed, id }]
			} catch {
				return []
			}
		})

		sessions.sort((a, b) => Number(b.createdAt) - Number(a.createdAt))

		const currentId = req.session?.id
		return sessions.filter(s => s.id !== currentId)
	}


	clear(req: Request): boolean {
		req.res?.clearCookie(this.cookieName)
		return true
	}


	async remove(req: Request, id: string, lng: Language): Promise<boolean> {
		const currentId = req.session?.id

		if (currentId && currentId === id) {
			throw new ConflictException(
				this.msg('auth.errors.session.cannot_delete_current', 'You can’t delete the current session', { lng }),
			)
		}

		try {
			await this.redis.del(this.key(id))
			return true
		} catch {
			throw new InternalServerErrorException(this.msg('common.errors.unexpected', 'Unexpected error', { lng }))
		}
	}
}


src/modules/auth/totp/constants/index.ts
[ Код из файла ]

export * from './totp.constants'


src/modules/auth/totp/constants/totp.constants.ts
[ Код из файла ]

import type { Prisma } from '@prisma/__generated__'




export const TOTP_WINDOW = 1
export const TOTP_ALGORITHM = 'SHA1' as const
export const TOTP_DIGITS = 6
export const TOTP_PERIOD = 30
export const TOTP_SECRET_LENGTH = 24


export const BACKUP_CODES_COUNT = 10
export const BACKUP_CODE_BYTES = 4


export const TEMP_SECRET_TTL = 600
export const CODE_REUSE_WINDOW = 90
export const RATE_LIMIT_WINDOW = 300


export const MAX_ATTEMPTS = 5

export const RATE_LIMIT_ACTIONS = Object.freeze({
	ENABLE: 'enable',
	DISABLE: 'disable',
	VERIFY: 'verify',
	REGENERATE: 'regenerate',
	GENERATE: 'generate',
}) as Readonly<{
	ENABLE: 'enable'
	DISABLE: 'disable'
	VERIFY: 'verify'
	REGENERATE: 'regenerate'
	GENERATE: 'generate'
}>

export type TotpAction = (typeof RATE_LIMIT_ACTIONS)[keyof typeof RATE_LIMIT_ACTIONS]


export const REDIS_KEY_PREFIX = Object.freeze({
	TEMP_SECRET: (userId: string): string => `totp:temp:${userId}`,
	USED_CODE: (userId: string, code: string): string => `totp:used:${userId}:${code}`,
	RATE_LIMIT: (userId: string, action: string): string => `totp:rate:${userId}:${action}`,
}) as Readonly<{
	TEMP_SECRET: (userId: string) => string
	USED_CODE: (userId: string, code: string) => string
	RATE_LIMIT: (userId: string, action: string) => string
}>


export const TOTP_AUDIT_ACTIONS = Object.freeze({
	ENABLED: 'TOTP_ENABLED',
	DISABLED: 'TOTP_DISABLED',
	VERIFIED: 'TOTP_VERIFIED',
	BACKUP_CODE_VERIFIED: 'TOTP_BACKUP_CODE_VERIFIED',
	BACKUP_CODES_REGENERATED: 'TOTP_BACKUP_CODES_REGENERATED',
}) as Readonly<{
	ENABLED: 'TOTP_ENABLED'
	DISABLED: 'TOTP_DISABLED'
	VERIFIED: 'TOTP_VERIFIED'
	BACKUP_CODE_VERIFIED: 'TOTP_BACKUP_CODE_VERIFIED'
	BACKUP_CODES_REGENERATED: 'TOTP_BACKUP_CODES_REGENERATED'
}>

export type TotpAuditAction = (typeof TOTP_AUDIT_ACTIONS)[keyof typeof TOTP_AUDIT_ACTIONS]



export const QR_CODE_OPTIONS = Object.freeze({
	errorCorrectionLevel: 'H' as const,
	margin: 1,
	width: 300,
	type: 'image/png' as const,
	color: {
		dark: '#000000',
		light: '#FFFFFF',
	},
}) as Readonly<{
	errorCorrectionLevel: 'H'
	margin: number
	width: number
	type: 'image/png'
	color: {
		dark: string
		light: string
	}
}>


export const VALIDATION_PATTERNS = Object.freeze({
	TOTP_CODE: /^\d{6}$/,
	BACKUP_CODE: /^[A-F0-9]{8}$/,
	TOTP_SECRET: /^[A-Z2-7]{16,}$/,
	TOTP_OR_BACKUP: /^(\d{6}|[A-F0-9]{8})$/,
}) as Readonly<{
	TOTP_CODE: RegExp
	BACKUP_CODE: RegExp
	TOTP_SECRET: RegExp
	TOTP_OR_BACKUP: RegExp
}>


export interface TempSecretCache {
	secret: string
}

export type TotpAuditMetadata = Prisma.JsonObject & {
	email?: string
	timestamp: string
	ip?: string
	userAgent?: string
}

export const createAuditMetadata = (
	data: Partial<Omit<TotpAuditMetadata, 'timestamp'>> & { timestamp?: string } = {},
): Prisma.InputJsonObject => {
	return {
		timestamp: new Date().toISOString(),
		...data,
	}
}


src/modules/auth/totp/dtos/disable-totp.dto.ts
[ Код из файла ]

import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { VALIDATION_PATTERNS } from '../constants'

@InputType()
export class DisableTotpInput {
	@Field(() => String, { description: 'User password for verification' })
	@IsString({ message: 'Password must be a string' })
	@IsNotEmpty({ message: 'Password is required' })
	@MinLength(1, { message: 'Password cannot be empty' })
	password: string

	@Field(() => String, { description: 'Current TOTP code' })
	@IsString({ message: 'Code must be a string' })
	@IsNotEmpty({ message: 'Code is required' })
	@Matches(VALIDATION_PATTERNS.TOTP_CODE, { message: 'Code must be exactly 6 digits' })
	code: string
}


src/modules/auth/totp/dtos/enable-totp.dto.ts
[ Код из файла ]

import { IsNotEmpty, IsString, Length, Matches } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { TOTP_SECRET_LENGTH, VALIDATION_PATTERNS } from '../constants'

@InputType()
export class EnableTotpInput {
	@Field(() => String, { description: 'TOTP secret from generation step' })
	@IsString({ message: 'Secret must be a string' })
	@IsNotEmpty({ message: 'Secret is required' })
	@Length(TOTP_SECRET_LENGTH, TOTP_SECRET_LENGTH, {
		message: `Secret must be exactly ${TOTP_SECRET_LENGTH} characters`,
	})
	@Matches(VALIDATION_PATTERNS.TOTP_SECRET, { message: 'Invalid secret format' })
	secret: string

	@Field(() => String, { description: '6-digit TOTP code' })
	@IsString({ message: 'Code must be a string' })
	@IsNotEmpty({ message: 'Code is required' })
	@Matches(VALIDATION_PATTERNS.TOTP_CODE, { message: 'Code must be exactly 6 digits' })
	code: string
}


src/modules/auth/totp/dtos/index.ts
[ Код из файла ]

export * from './disable-totp.dto'
export * from './enable-totp.dto'
export * from './verify-totp.dto'


src/modules/auth/totp/dtos/verify-totp.dto.ts
[ Код из файла ]

import { IsNotEmpty, IsString, Matches } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { VALIDATION_PATTERNS } from '../constants'

@InputType()
export class VerifyTotpInput {
	@Field(() => String, { description: '6-digit TOTP code or backup code' })
	@IsString({ message: 'Code must be a string' })
	@IsNotEmpty({ message: 'Code is required' })
	@Matches(VALIDATION_PATTERNS.TOTP_OR_BACKUP, {
		message: 'Code must be 6 digits or 8-character backup code',
	})
	code: string
}


src/modules/auth/totp/guards/index.ts
[ Код из файла ]

export * from './totp-rate-limit.guard'


src/modules/auth/totp/guards/totp-rate-limit.guard.ts
[ Код из файла ]

import { I18nService } from '@/core/i18n'
import { RedisService } from '@/core/redis'
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { MAX_ATTEMPTS, RATE_LIMIT_WINDOW } from '../constants'

export const TOTP_RATE_LIMIT = 'totp_rate_limit'

export interface TotpRateLimitOptions {
	maxAttempts: number
	windowMs: number
	action: string
}

interface GraphQLContext {
	req: {
		user?: {
			id: string
			email: string
		}
	}
}


@Injectable()
export class TotpRateLimitGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly redis: RedisService,
		private i18n: I18nService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const options = this.reflector.get<TotpRateLimitOptions>(TOTP_RATE_LIMIT, context.getHandler())

		if (!options) {
			return true
		}

		const ctx = GqlExecutionContext.create(context)
		const gqlContext = ctx.getContext<GraphQLContext>()
		const user = gqlContext.req.user

		if (!user) {
			return true
		}

		const key = `totp:rate:${user.id}:${options.action}`

		const attemptsStr = await this.redis.get(key)
		const attempts = attemptsStr ? parseInt(attemptsStr, 10) : 0

		if (attempts >= options.maxAttempts) {
			const ttl = await this.redis.ttl(key)
			const minutesLeft = Math.ceil(ttl / 60)

			const translatedMessage = this.i18n.t('totp.rate_limit_exceeded' as any, {
				args: { minutes: minutesLeft },
			})

			const message =
				typeof translatedMessage === 'string'
					? translatedMessage
					: `Too many attempts. Try again in ${minutesLeft} minutes`

			throw new HttpException(message, HttpStatus.TOO_MANY_REQUESTS)
		}

		return true
	}
}


export const SetTotpRateLimit = (
	action: string,
	maxAttempts: number = MAX_ATTEMPTS,
	windowMs: number = RATE_LIMIT_WINDOW * 1000,
): MethodDecorator => {
	return <T>(
		target: object,
		propertyKey: string | symbol,
		descriptor: TypedPropertyDescriptor<T>,
	): TypedPropertyDescriptor<T> => {
		if (descriptor.value && typeof descriptor.value === 'function') {
			Reflect.defineMetadata(
				TOTP_RATE_LIMIT,
				{ maxAttempts, windowMs, action } as TotpRateLimitOptions,
				descriptor.value,
			)
		}

		return descriptor
	}
}


src/modules/auth/totp/index.ts
[ Код из файла ]

export * from './totp.module'
export * from './totp.service'


src/modules/auth/totp/models/backup-codes.model.ts
[ Код из файла ]

import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('BackupCodesStatus')
export class BackupCodesStatusModel {
	@Field(() => Int, { description: 'Total backup codes' })
	total: number

	@Field(() => Int, { description: 'Remaining unused codes' })
	remaining: number

	@Field(() => Int, { description: 'Used backup codes' })
	used: number
}


src/modules/auth/totp/models/index.ts
[ Код из файла ]

export * from './backup-codes.model'
export * from './totp-enabled.model'
export * from './totp.model'


src/modules/auth/totp/models/totp-enabled.model.ts
[ Код из файла ]

import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('TotpEnabled')
export class TotpEnabledModel {
	@Field(() => Boolean, { description: 'Success status' })
	success: boolean

	@Field(() => [String], {
		description: 'Backup recovery codes (store securely!)',
	})
	backupCodes: string[]

	@Field(() => String, {
		description: 'Warning message about backup codes',
	})
	message: string
}


src/modules/auth/totp/models/totp.model.ts
[ Код из файла ]

import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('Totp')
export class TotpModel {
	@Field(() => String, { description: 'QR code as data URL' })
	qrCodeUrl: string

	@Field(() => String, {
		description: 'Manual entry key (same as in QR code)',
	})
	manualEntryKey: string

	@Field(() => String, { description: 'Issuer name (app name)' })
	issuer: string

	@Field(() => String, { description: 'Account name (user email)' })
	accountName: string
}


src/modules/auth/totp/totp.resolver.ts
[ Код из файла ]

import { Lang, Language } from '@/core/i18n'
import { Authorization, Authorized } from '@/shared/decorators'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@prisma/__generated__'

import { MAX_ATTEMPTS, RATE_LIMIT_ACTIONS, RATE_LIMIT_WINDOW } from './constants'
import { DisableTotpInput, EnableTotpInput, VerifyTotpInput } from './dtos'
import { SetTotpRateLimit, TotpRateLimitGuard } from './guards/totp-rate-limit.guard'
import { BackupCodesStatusModel, TotpEnabledModel, TotpModel } from './models'
import { TotpService } from './totp.service'

@Resolver('Totp')
export class TotpResolver {
	constructor(private readonly totpService: TotpService) {}

	@Authorization()
	@Query(() => TotpModel, {
		name: 'generateTotpSecret',
		description: 'Generate TOTP secret and QR code',
	})
	async generate(@Authorized() user: User, @Lang() lng: Language): Promise<TotpModel> {
		return this.totpService.generate(user, lng)
	}

	@Authorization()
	@UseGuards(TotpRateLimitGuard)
	@SetTotpRateLimit(RATE_LIMIT_ACTIONS.ENABLE, MAX_ATTEMPTS, RATE_LIMIT_WINDOW * 1000)
	@Mutation(() => TotpEnabledModel, {
		name: 'enableTotp',
		description: 'Enable TOTP two-factor authentication',
	})
	async enable(
		@Authorized() user: User,
		@Args('data') input: EnableTotpInput,
		@Lang() lng: Language,
	): Promise<TotpEnabledModel> {
		return this.totpService.enable(user, input, lng)
	}

	@Authorization()
	@UseGuards(TotpRateLimitGuard)
	@SetTotpRateLimit(RATE_LIMIT_ACTIONS.DISABLE, MAX_ATTEMPTS, RATE_LIMIT_WINDOW * 1000)
	@Mutation(() => Boolean, {
		name: 'disableTotp',
		description: 'Disable TOTP two-factor authentication',
	})
	async disable(
		@Authorized() user: User,
		@Args('data') input: DisableTotpInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.totpService.disable(user, input, lng)
	}

	@Authorization()
	@UseGuards(TotpRateLimitGuard)
	@SetTotpRateLimit(RATE_LIMIT_ACTIONS.VERIFY, MAX_ATTEMPTS, RATE_LIMIT_WINDOW * 1000)
	@Mutation(() => Boolean, {
		name: 'verifyTotp',
		description: 'Verify TOTP code',
	})
	async verify(
		@Authorized() user: User,
		@Args('data') input: VerifyTotpInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.totpService.verify(user, input.code, lng)
	}

	@Authorization()
	@Query(() => BackupCodesStatusModel, {
		name: 'totpBackupCodesStatus',
		description: 'Get backup codes status',
	})
	async getBackupCodesStatus(@Authorized() user: User, @Lang() lng: Language): Promise<BackupCodesStatusModel> {
		return this.totpService.getBackupCodesStatus(user, lng)
	}

	@Authorization()
	@Mutation(() => TotpEnabledModel, {
		name: 'regenerateTotpBackupCodes',
		description: 'Regenerate backup codes',
	})
	async regenerateBackupCodes(
		@Authorized() user: User,
		@Args('password') password: string,
		@Lang() lng: Language,
	): Promise<TotpEnabledModel> {
		return this.totpService.regenerateBackupCodes(user, password, lng)
	}
}


src/modules/auth/totp/totp.service.ts
[ Код из файла ]

import { randomBytes } from 'crypto'
import { encode } from 'hi-base32'
import { TOTP } from 'otpauth'
import * as QRCode from 'qrcode'

import { APP_NAME } from '@/core/config'
import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { HashUtil } from '@/shared/utils/hash.util'
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { E2FAMethod, type User } from '@prisma/__generated__'

import {
	BACKUP_CODE_BYTES,
	BACKUP_CODES_COUNT,
	CODE_REUSE_WINDOW,
	createAuditMetadata,
	MAX_ATTEMPTS,
	QR_CODE_OPTIONS,
	RATE_LIMIT_WINDOW,
	REDIS_KEY_PREFIX,
	TEMP_SECRET_TTL,
	type TempSecretCache,
	TOTP_ALGORITHM,
	TOTP_AUDIT_ACTIONS,
	TOTP_DIGITS,
	TOTP_PERIOD,
	TOTP_SECRET_LENGTH,
	TOTP_WINDOW,
} from './constants'
import { DisableTotpInput, EnableTotpInput } from './dtos'
import { BackupCodesStatusModel, TotpEnabledModel, TotpModel } from './models'
import { CryptoUtil } from './utils/crypto.util'

@Injectable()
export class TotpService extends CoreService {
	private readonly logger = new Logger(TotpService.name)

	constructor(i18n: I18nService, prisma: PrismaService, redis: RedisService) {
		super(i18n, prisma, redis)
	}


	async generate(user: User, lng: Language): Promise<TotpModel> {
		await this.checkRateLimit(user.id, 'generate', lng)

		if (user.isTotpEnabled) {
			throw new BadRequestException(
				this.msg('auth.errors.totp.already_enabled', 'Two-factor authentication is already enabled', { lng }),
			)
		}

		const secret = this.generateSecret()
		const totp = this.createTOTP(user.email, secret)
		const otpAuthUrl = totp.toString()
		const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl, QR_CODE_OPTIONS)

		const tempKey = REDIS_KEY_PREFIX.TEMP_SECRET(user.id)
		const cacheData: TempSecretCache = { secret }
		await this.rSetJSON(tempKey, cacheData, TEMP_SECRET_TTL)

		this.logger.log(`TOTP secret generated for user ${user.id}`)

		return {
			qrCodeUrl,
			manualEntryKey: secret,
			issuer: APP_NAME,
			accountName: user.email,
		}
	}


	async enable(user: User, input: EnableTotpInput, lng: Language): Promise<TotpEnabledModel> {
		await this.checkRateLimit(user.id, 'enable', lng)

		if (user.isTotpEnabled) {
			throw new BadRequestException(
				this.msg('auth.errors.totp.already_enabled', 'Two-factor authentication is already enabled', { lng }),
			)
		}

		const tempKey = REDIS_KEY_PREFIX.TEMP_SECRET(user.id)
		const cached = await this.rGetJSON<TempSecretCache>(tempKey)

		if (!cached?.secret) {
			throw new BadRequestException(
				this.msg('auth.errors.totp.secret_expired', 'TOTP secret has expired. Please generate a new one', {
					lng,
				}),
			)
		}

		if (cached.secret !== input.secret) {
			throw new BadRequestException(this.msg('auth.errors.totp.invalid_secret', 'Invalid TOTP secret', { lng }))
		}

		const isValid = await this.validateCode(user.email, input.secret, input.code)

		if (!isValid) {
			await this.incrementFailedAttempts(user.id, 'enable')
			throw new BadRequestException(
				this.msg('auth.errors.totp.invalid_code', 'Invalid verification code', { lng }),
			)
		}

		const backupCodes = this.generateBackupCodes()
		const hashedBackupCodes = await Promise.all(backupCodes.map(code => HashUtil.hash(code)))
		const encryptedSecret = CryptoUtil.encrypt(input.secret)

		await this.prisma.$transaction(async tx => {
			await tx.user.update({
				where: { id: user.id },
				data: {
					isTotpEnabled: true,
					totpSecret: encryptedSecret,
				},
			})

			await tx.backupCode.createMany({
				data: hashedBackupCodes.map(hash => ({
					userId: user.id,
					type: E2FAMethod.TOTP,
					code: hash,
				})),
			})

			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: TOTP_AUDIT_ACTIONS.ENABLED,
					metadata: createAuditMetadata({ email: user.email }),
				},
			})
		})

		await this.rDel(tempKey)
		await this.clearRateLimit(user.id, 'enable')

		this.logger.log(`TOTP enabled for user ${user.id}`)

		return {
			success: true,
			backupCodes,
			message: this.msg(
				'auth.errors.totp.backup_codes_warning',
				'Save these backup codes in a secure place. Each code can only be used once',
				{ lng },
			),
		}
	}


	async disable(user: User, input: DisableTotpInput, lng: Language): Promise<boolean> {
		await this.checkRateLimit(user.id, 'disable', lng)

		if (!user.isTotpEnabled) {
			throw new BadRequestException(
				this.msg('auth.errors.totp.not_enabled', 'Two-factor authentication is not enabled', { lng }),
			)
		}

		const isPasswordValid = await HashUtil.verify(user.password, input.password)

		if (!isPasswordValid) {
			await this.incrementFailedAttempts(user.id, 'disable')
			throw new UnauthorizedException(this.msg('auth.errors.password.invalid', 'Invalid password', { lng }))
		}

		const decryptedSecret = CryptoUtil.decrypt(user.totpSecret)
		const isCodeValid = await this.validateCode(user.email, decryptedSecret, input.code)

		if (!isCodeValid) {
			await this.incrementFailedAttempts(user.id, 'disable')
			throw new BadRequestException(
				this.msg('auth.errors.totp.invalid_code', 'Invalid verification code', { lng }),
			)
		}

		await this.prisma.$transaction(async tx => {
			await tx.user.update({
				where: { id: user.id },
				data: {
					isTotpEnabled: false,
					totpSecret: null,
				},
			})

			await tx.backupCode.deleteMany({
				where: {
					userId: user.id,
					type: E2FAMethod.TOTP,
				},
			})

			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: TOTP_AUDIT_ACTIONS.DISABLED,
					metadata: createAuditMetadata({ email: user.email }),
				},
			})
		})

		await this.clearRateLimit(user.id, 'disable')

		this.logger.warn(`TOTP disabled for user ${user.id}`)

		return true
	}


	async verify(user: User, code: string, lng: Language): Promise<boolean> {
		await this.checkRateLimit(user.id, 'verify', lng)

		if (!user.isTotpEnabled || !user.totpSecret) {
			throw new BadRequestException(
				this.msg('auth.errors.totp.not_enabled', 'Two-factor authentication is not enabled', { lng }),
			)
		}

		const normalizedCode = code.replace(/\s/g, '').toUpperCase()

		const usedKey = REDIS_KEY_PREFIX.USED_CODE(user.id, normalizedCode)
		const isUsed = await this.rExists(usedKey)

		if (isUsed) {
			await this.incrementFailedAttempts(user.id, 'verify')
			throw new BadRequestException(
				this.msg('auth.errors.totp.code_already_used', 'This code has already been used', { lng }),
			)
		}

		const decryptedSecret = CryptoUtil.decrypt(user.totpSecret)
		const isValid = await this.validateCode(user.email, decryptedSecret, code)

		if (isValid) {
			await this.rSet(usedKey, '1', CODE_REUSE_WINDOW)
			await this.clearRateLimit(user.id, 'verify')
			await this.logSuccessfulVerification(user.id)
			return true
		}

		const isBackupValid = await this.validateBackupCode(user.id, normalizedCode)

		if (isBackupValid) {
			await this.clearRateLimit(user.id, 'verify')
			await this.logSuccessfulVerification(user.id, true)
			return true
		}

		await this.incrementFailedAttempts(user.id, 'verify')
		throw new BadRequestException(this.msg('auth.errors.totp.invalid_code', 'Invalid verification code', { lng }))
	}


	async getBackupCodesStatus(user: User, lng: Language): Promise<BackupCodesStatusModel> {
		if (!user.isTotpEnabled) {
			throw new BadRequestException(
				this.msg('auth.errors.totp.not_enabled', 'Two-factor authentication is not enabled', { lng }),
			)
		}

		const allCodes = await this.prisma.backupCode.count({
			where: {
				userId: user.id,
				type: E2FAMethod.TOTP,
			},
		})

		const usedCodes = await this.prisma.backupCode.count({
			where: {
				userId: user.id,
				type: E2FAMethod.TOTP,
				usedAt: { not: null },
			},
		})

		return {
			total: allCodes,
			remaining: allCodes - usedCodes,
			used: usedCodes,
		}
	}


	async regenerateBackupCodes(user: User, password: string, lng: Language): Promise<TotpEnabledModel> {
		if (!user.isTotpEnabled) {
			throw new BadRequestException(
				this.msg('auth.errors.totp.not_enabled', 'Two-factor authentication is not enabled', { lng }),
			)
		}

		const isPasswordValid = await HashUtil.verify(user.password, password)

		if (!isPasswordValid) {
			throw new UnauthorizedException(this.msg('auth.errors.password.invalid', 'Invalid password', { lng }))
		}

		const backupCodes = this.generateBackupCodes()
		const hashedBackupCodes = await Promise.all(backupCodes.map(code => HashUtil.hash(code)))

		await this.prisma.$transaction(async tx => {
			await tx.backupCode.deleteMany({
				where: {
					userId: user.id,
					type: E2FAMethod.TOTP,
				},
			})

			await tx.backupCode.createMany({
				data: hashedBackupCodes.map(hash => ({
					userId: user.id,
					type: E2FAMethod.TOTP,
					code: hash,
				})),
			})

			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: TOTP_AUDIT_ACTIONS.BACKUP_CODES_REGENERATED,
					metadata: createAuditMetadata(),
				},
			})
		})

		this.logger.log(`Backup codes regenerated for user ${user.id}`)

		return {
			success: true,
			backupCodes,
			message: this.msg(
				'auth.errors.totp.backup_codes_warning',
				'Save these backup codes in a secure place. Each code can only be used once',
				{ lng },
			),
		}
	}


	private generateSecret(): string {
		return encode(randomBytes(15)).replace(/=/g, '').substring(0, TOTP_SECRET_LENGTH)
	}

	private createTOTP(email: string, secret: string): TOTP {
		return new TOTP({
			issuer: APP_NAME,
			label: email,
			algorithm: TOTP_ALGORITHM,
			digits: TOTP_DIGITS,
			period: TOTP_PERIOD,
			secret,
		})
	}

	private async validateCode(email: string, secret: string, code: string): Promise<boolean> {
		const totp = this.createTOTP(email, secret)
		const delta = totp.validate({
			token: code,
			window: TOTP_WINDOW,
		})
		return Promise.resolve(delta !== null)
	}

	private generateBackupCodes(): string[] {
		return Array.from({ length: BACKUP_CODES_COUNT }, () =>
			randomBytes(BACKUP_CODE_BYTES).toString('hex').toUpperCase(),
		)
	}

	private async validateBackupCode(userId: string, code: string): Promise<boolean> {
		const backupCodes = await this.prisma.backupCode.findMany({
			where: {
				userId,
				type: E2FAMethod.TOTP,
				usedAt: null,
			},
		})

		for (const backup of backupCodes) {
			const isMatch = await HashUtil.verify(backup.code, code)

			if (isMatch) {
				await this.prisma.backupCode.update({
					where: { id: backup.id },
					data: { usedAt: new Date() },
				})

				this.logger.log(`Backup code used for user ${userId}`)
				return true
			}
		}

		return false
	}

	private async checkRateLimit(userId: string, action: string, lng: Language): Promise<void> {
		const key = REDIS_KEY_PREFIX.RATE_LIMIT(userId, action)
		const attempts = await this.rGetNumber(key)

		if (attempts !== null && attempts >= MAX_ATTEMPTS) {
			const ttl = await this.rTTL(key)
			const minutesLeft = Math.ceil(ttl / 60)

			throw new BadRequestException(
				this.msg(
					'auth.errors.totp.rate_limit_exceeded',
					`Too many attempts. Try again in ${minutesLeft} minutes`,
					{ lng, minutes: minutesLeft },
				),
			)
		}
	}

	private async incrementFailedAttempts(userId: string, action: string): Promise<void> {
		const key = REDIS_KEY_PREFIX.RATE_LIMIT(userId, action)
		await this.rIncr(key, RATE_LIMIT_WINDOW)
	}

	private async clearRateLimit(userId: string, action: string): Promise<void> {
		const key = REDIS_KEY_PREFIX.RATE_LIMIT(userId, action)
		await this.rDel(key)
	}

	private async logSuccessfulVerification(userId: string, isBackupCode: boolean = false): Promise<void> {
		await this.prisma.auditLog.create({
			data: {
				userId,
				action: isBackupCode ? TOTP_AUDIT_ACTIONS.BACKUP_CODE_VERIFIED : TOTP_AUDIT_ACTIONS.VERIFIED,
				metadata: createAuditMetadata(),
			},
		})
	}
}


src/modules/auth/totp/utils/crypto.util.ts
[ Код из файла ]

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'


export class CryptoUtil {
	private static readonly ALGORITHM = 'aes-256-gcm'
	private static readonly IV_LENGTH = 16
	private static readonly AUTH_TAG_LENGTH = 16


	private static getEncryptionKey(): Buffer {
		const key = process.env.TOTP_ENCRYPTION_KEY

		if (!key) {
			throw new Error('TOTP_ENCRYPTION_KEY is not defined in environment')
		}

		if (key.length !== 64) {
			throw new Error('TOTP_ENCRYPTION_KEY must be 64 hex characters (256 bits)')
		}

		return Buffer.from(key, 'hex')
	}


	static encrypt(plaintext: string): string {
		try {
			const key = this.getEncryptionKey()
			const iv = randomBytes(this.IV_LENGTH)

			const cipher = createCipheriv(this.ALGORITHM, key, iv)

			let encrypted = cipher.update(plaintext, 'utf8', 'hex')
			encrypted += cipher.final('hex')

			const authTag = cipher.getAuthTag()

			return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
		} catch (error) {
			throw new Error(`Encryption failed: ${(error as Error).message}`)
		}
	}


	static decrypt(encryptedData: string): string {
		try {
			const key = this.getEncryptionKey()
			const parts = encryptedData.split(':')

			if (parts.length !== 3) {
				throw new Error('Invalid encrypted data format')
			}

			const [ivHex, authTagHex, encryptedHex] = parts

			const iv = Buffer.from(ivHex, 'hex')
			const authTag = Buffer.from(authTagHex, 'hex')
			const encrypted = Buffer.from(encryptedHex, 'hex')

			const decipher = createDecipheriv(this.ALGORITHM, key, iv)
			decipher.setAuthTag(authTag)

			let decrypted = decipher.update(encrypted)
			decrypted = Buffer.concat([decrypted, decipher.final()])

			return decrypted.toString('utf8')
		} catch (error) {
			throw new Error(`Decryption failed: ${(error as Error).message}`)
		}
	}


	static generateEncryptionKey(): string {
		return randomBytes(32).toString('hex')
	}
}


src/modules/auth/totp/utils/index.ts
[ Код из файла ]

export * from './crypto.util'


src/modules/auth/verification/dtos/index.ts
[ Код из файла ]

export * from './verification.dto'


src/modules/auth/verification/dtos/verification.dto.ts
[ Код из файла ]

import { IsNotEmpty, IsUUID } from 'class-validator'

import { User } from '@/modules/auth/account'
import { Field, InputType, ObjectType } from '@nestjs/graphql'

@InputType()
export class VerificationInput {
	@Field(() => String)
	@IsUUID(4)
	@IsNotEmpty()
	token: string
}

@ObjectType()
export class VerificationResponse {
	@Field(() => User, { nullable: true })
	user?: User
}


src/modules/auth/verification/index.ts
[ Код из файла ]

export * from './verification.module'
export * from './verification.service'


src/modules/auth/verification/verification.resolver.ts
[ Код из файла ]

import { Lang, Language } from '@/core/i18n'
import { UserAgent } from '@/shared/decorators'
import type { GqlContext } from '@/shared/types'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { VerificationInput, VerificationResponse } from './dtos'
import { VerificationService } from './verification.service'

@Resolver('Verification')
export class VerificationResolver {
	constructor(private readonly verificationService: VerificationService) {}


	@Mutation(() => VerificationResponse, {
		name: 'verificationEmail',
		description: 'Send a verification email with a one-time token and return delivery/meta info.',
	})
	verificationEmail(
		@Context() { req }: GqlContext,
		@Args('data') input: VerificationInput,
		@UserAgent() userAgent: string,
		@Lang() lng: Language,
	): Promise<VerificationResponse> {
		return this.verificationService.verificationEmail(req, input, userAgent, lng)
	}
}


src/modules/auth/verification/verification.service.ts
[ Код из файла ]

import { Request } from 'express'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { MailService, SmsService } from '@/modules/libs'
import { generateToken, getSessionMetadata, saveSession } from '@/shared/utils'
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ETokenType, type User } from '@prisma/__generated__'

import { VerificationInput, VerificationResponse } from './dtos'

@Injectable()
export class VerificationService extends CoreService {
	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		private readonly mail: MailService,
		private readonly sms: SmsService,
	) {
		super(i18n, prisma)
	}


	async verificationEmail(
		req: Request,
		input: VerificationInput,
		userAgent: string,
		lng: Language,
	): Promise<VerificationResponse> {
		const { token } = input

		const t = await this.prisma.token.findUnique({
			where: { token },
			select: { id: true, type: true, expiresIn: true, userId: true },
		})

		if (!t || t.type !== ETokenType.EMAIL_VERIFY) {
			throw new NotFoundException(this.msg('auth.errors.token.not_found', 'Token not found', { lng }))
		}

		if (new Date(t.expiresIn) < new Date()) {
			throw new BadRequestException(this.msg('auth.errors.token.expired', 'Token expired', { lng }))
		}

		const [updatedUser] = await this.prisma.$transaction([
			this.prisma.user.update({
				where: { id: t.userId },
				data: { isEmailVerified: true },
				select: {
					id: true,
					email: true,
					fullName: true,
					firstName: true,
					lastName: true,
					isEmailVerified: true,
					createdAt: true,
					updatedAt: true,
				},
			}),
			this.prisma.token.delete({ where: { id: t.id } }),
		])

		const meta = getSessionMetadata(req, userAgent)
		return saveSession(req, updatedUser as unknown as User, meta)
	}


	async sendEmailVerificationToken(user: User, lng: Language): Promise<boolean> {
		const verificationToken = await generateToken(this.prisma, user, ETokenType.EMAIL_VERIFY)

		try {
			await this.mail.sendVerificationEmailToken(user.email, verificationToken.token, lng)
			return true
		} catch {
			throw new InternalServerErrorException(
				this.msg('mail.errors.message_send_failed', 'Failed to send the message.', { lng }),
			)
		}
	}


	async sendEmailVerificationOtpToken(user: User, lng: Language): Promise<boolean> {
		const verificationOtpToken = await generateToken(this.prisma, user, ETokenType.EMAIL_VERIFY, false)

		try {
			await this.mail.sendVerificationEmailOtpToken(user.email, verificationOtpToken.token, lng)
			return true
		} catch {
			throw new InternalServerErrorException(
				this.msg('mail.errors.message_send_failed', 'Failed to send the message.', { lng }),
			)
		}
	}


	async sendSmsVerificationOtpToken(user: User, lng: Language): Promise<boolean> {
		const verificationOtpToken = await generateToken(this.prisma, user, ETokenType.EMAIL_VERIFY, false)

		try {
			await this.sms.sendOtpSMS(user.email, verificationOtpToken.token, lng)
			return true
		} catch {
			throw new InternalServerErrorException(
				this.msg('sms.errors.message_send_failed', 'Failed to send the message.', { lng }),
			)
		}
	}
}


src/modules/libs/index.ts
[ Код из файла ]

export * from './mail'
export * from './sms'


src/modules/libs/mail/index.ts
[ Код из файла ]

export * from './mail.module'
export * from './mail.service'


src/modules/libs/mail/mail.service.ts
[ Код из файла ]

import { CLIENT_URL, PATHS } from '@/core/config'
import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { ISessionMetadata } from '@/shared/types'
import { Inject, Injectable } from '@nestjs/common'
import { render } from '@react-email/components'

import { IEmailProvider } from './providers'
import { VerificationEmailTemplate } from './templates'
import { ResetPasswordTemplate } from './templates/reset-password'

@Injectable()
export class MailService extends CoreService {
	constructor(
		i18n: I18nService,
		@Inject(IEmailProvider) private readonly emailProvider: IEmailProvider,
	) {
		super(i18n)
	}


	async sendVerificationEmailToken(email: string, token: string, lng: Language) {
		const url = PATHS.VERIFY_EMAIL(CLIENT_URL, token)
		const html = await render(VerificationEmailTemplate({ url, i18n: this.i18n, lng }))
		const subject = this.i18n.t('mail.verification_email.subject', { lng })
		return this.sendMail(email, subject, html)
	}


	async sendVerificationEmailOtpToken(email: string, token: string, lng: Language) {
		const url = PATHS.VERIFY_EMAIL(CLIENT_URL, token)
		const html = await render(VerificationEmailTemplate({ url, i18n: this.i18n, lng }))
		const subject = this.i18n.t('mail.verification_email.subject', { lng })
		return this.sendMail(email, subject, html)
	}


	async sendPasswordResetToken(email: string, token: string, metadata: ISessionMetadata, lng: Language) {
		const url: string = PATHS.RESET_PASSWORD(CLIENT_URL, token)
		const html = await render(ResetPasswordTemplate({ url, i18n: this.i18n, metadata, lng }))
		return this.sendMail(email, this.i18n.t('mail.reset_password.subject'), html)
	}


	async canSendEmail(_email: string): Promise<boolean> {
		return Promise.resolve(true)
	}

	private async sendMail(email: string, subject: string, html: string) {
		return this.emailProvider.sendMail(email, subject, html)
	}
}


src/modules/libs/mail/providers/brevo/brevo.service.ts
[ Код из файла ]

import { COMPANY_NAME } from '@/core/config'
import * as brevo from '@getbrevo/brevo'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { IEmailProvider } from '../email.provider.interface'

@Injectable()
export class BrevoService implements IEmailProvider {
	private apiInstance: brevo.TransactionalEmailsApi

	constructor(private readonly configService: ConfigService) {
		this.apiInstance = new brevo.TransactionalEmailsApi()
		this.apiInstance.setApiKey(
			brevo.TransactionalEmailsApiApiKeys.apiKey,
			this.configService.getOrThrow<string>('MAIL_BREVO_API_KEY'),
		)
	}


	async sendMail(email: string, subject: string, html: string) {
		const sendSmtpEmail: brevo.SendSmtpEmail = new brevo.SendSmtpEmail()

		sendSmtpEmail.subject = subject
		sendSmtpEmail.htmlContent = html
		sendSmtpEmail.sender = {
			name: COMPANY_NAME,
			email: this.configService.getOrThrow<string>('MAIL_BREVO_SENDER'),
		}
		sendSmtpEmail.to = [{ email }]

		try {
			const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail)
			return response.body
		} catch (error) {
			console.log('[BREVO_ERROR] - ', error)
			throw new BadRequestException('Ошибка отправки сообщения')
		}
	}
}


src/modules/libs/mail/providers/brevo/index.ts
[ Код из файла ]

export * from './brevo.service'


src/modules/libs/mail/providers/email.provider.interface.ts
[ Код из файла ]

export const IEmailProvider = Symbol('IEmailProvider')

export interface IEmailProvider {
	sendMail(email: string, subject: string, html: string): Promise<unknown>
}


src/modules/libs/mail/providers/index.ts
[ Код из файла ]

export * from './brevo'
export * from './sendgrid'
export * from './email.provider.interface'
export * from './smtp.service'


src/modules/libs/mail/providers/sendgrid/index.ts
[ Код из файла ]

export * from './sendgrid.service'


src/modules/libs/mail/providers/sendgrid/sendgrid.service.ts
[ Код из файла ]

import { COMPANY_NAME } from '@/core/config'
import { I18nService } from '@/core/i18n'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import sgMail from '@sendgrid/mail'

import { IEmailProvider } from '../email.provider.interface'

@Injectable()
export class SendgridService implements IEmailProvider {
	private sgMail: typeof sgMail

	constructor(
		private readonly config: ConfigService,
		private readonly i18n: I18nService,
	) {
		const apiKey = this.config.getOrThrow<string>('MAIL_SENDGRID_API_KEY')
		if (!apiKey) {
			throw new Error('API key is missing.')
		}
		sgMail.setApiKey(apiKey)
		this.sgMail = sgMail
	}


	async sendMail(email: string, subject: string, html: string, lng?: string): Promise<boolean> {
		try {
			await this.sgMail.send({
				to: email,
				from: `"${COMPANY_NAME}" <${this.config.getOrThrow<string>('MAIL_SENDGRID_SENDER')}>`,
				subject,
				html,
			})
			return true
		} catch (error) {
			console.log('[SENDGRID_ERROR] - ', error)
			throw new BadRequestException(
				this.i18n.t('mail.errors.message_send_failed', { lng }) || 'Failed to send the message.',
			)
		}
	}
}


src/modules/libs/mail/providers/smtp.service.ts
[ Код из файла ]

import { COMPANY_NAME } from '@/core/config'
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { IEmailProvider } from './email.provider.interface'

@Injectable()
export class SmtpService implements IEmailProvider {
	constructor(
		private readonly mailer: MailerService,
		private readonly config: ConfigService,
	) {}

	async sendMail(email: string, subject: string, html: string): Promise<unknown> {
		return this.mailer.sendMail({
			from: `"${COMPANY_NAME}" <${this.config.getOrThrow<string>('MAIL_LOGIN')}>`,
			to: email,
			subject,
			html,
		})
	}
}


src/modules/libs/mail/templates/components/index.ts
[ Код из файла ]

export * from './template-wrapper'


src/modules/libs/mail/templates/components/template-wrapper.tsx
[ Код из файла ]


import { APP_NAME, COMPANY_NAME, SUPPORT_EMAIL } from "@/core/config";
import { type I18nService } from "@/core/i18n";
import {
  Body,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text
} from "@react-email/components";
import { PropsWithChildren } from "react";

type TTemplateName = 'verification_email' | 'reset_password'

export interface IProps {
  template: TTemplateName;
  i18n?: I18nService;
  lng?: string;
}

export function TemplateWrapper({ template, children, i18n, lng='en' }: PropsWithChildren<IProps>) {
    const currentYear: number = new Date().getFullYear()
    const t = i18n.t(`mail.${template}`, { lng })
    const tTemp = i18n.t(`mail.template`, { lng })

    return (
        <Html lang={lng}>
            <Preview>{t('preview') || "Confirm your email to finish signing up."}</Preview>
            <Tailwind>
                <Head />
                <Body className="bg-[#efefef] max-w-[600px] m-auto py-3 px-3">
                    <div className="bg-white h-fit px-4 py-6 rounded-md space-y-4 text-center">
                        <Section>
                            <div className="h-12 flex justify-center items-center" role="svg" aria-label={COMPANY_NAME}>
                                <Img
                                    src='https://res.cloudinary.com/dki4lxdki/image/upload/v1759181992/doctorlab/app/logo-full.png'
                                    width="180"
                                    height="44"
                                    alt={COMPANY_NAME}
                                    style={{ display: "block", margin: "0 auto", border: "0", outline: "none", textDecoration: "none" }}
                                />
                            </div>
                        </Section>

                        {children}
                    </div>

                    <Section className="px-1 pt-4">
                        <Text className="m-0 text-xs text-[#656565]">
                         {tTemp('signature')[0] || "Regards, the"} <span className="font-semibold text-[#143394]">{tTemp('signature', {company: COMPANY_NAME})[1] || `${COMPANY_NAME} team`}</span>
                        </Text>
                        <Text className="mt-2 text-xs text-[#656565]">
                            {tTemp('supportNote') || "This is an automated message; please do not reply. Contact support: "}
                        <Link href={`mailto:${SUPPORT_EMAIL}`} className="text-[#656565] underline">
                            {SUPPORT_EMAIL}
                        </Link>
                        </Text>
                        <Text className="font-sans leading-[14px] font-normal text-[#656565] text-xs mb-2">
                            {t('legalNote', { app: APP_NAME}) || `You're receiving this email because you created a ${APP_NAME} account. If you didn’t request this, you can safely ignore this email.`}
                        </Text>
                    </Section>

                    <Section className="text-center px-2">
                        <Text className="font-sans tracking-wide font-normal text-[#656565] text-xs mb-4">{tTemp('copyright', {year: currentYear, company: APP_NAME }) || `© ${currentYear} ${APP_NAME}. All rights reserved.`}</Text>
                        <div className="size-12 flex justify-center items-center  m-auto" role="img" aria-label={COMPANY_NAME}>
                            <Img
                                src='https://res.cloudinary.com/dki4lxdki/image/upload/v1759181993/doctorlab/app/logo-mini.png'
                                width="44"
                                height="44"
                                alt={COMPANY_NAME}
                                style={{ display: "block", margin: "0 auto", border: "0", outline: "none", textDecoration: "none" }}
                            />
                        </div>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    );
}

src/modules/libs/mail/templates/index.ts
[ Код из файла ]

export * from './verification-email'


src/modules/libs/mail/templates/reset-password.tsx
[ Код из файла ]

import {
  Button,
  Heading,
  Link,
  Section,
  Tailwind,
  Text
} from "@react-email/components";
import { TemplateWrapper } from "./components";
import { ISessionMetadata } from "@/shared/types";
import { type I18nService } from "@/core/i18n";
import { APP_NAME } from "@/core/config";

export interface IProps {
  url: string;
  i18n?: I18nService;
  lng?: string;
  metadata: ISessionMetadata
}

export function ResetPasswordTemplate({ url, i18n, lng='en', metadata }: IProps) {

    const t = i18n.t('mail.reset_password', { lng })
    const request_info = i18n.t('mail.reset_password.request_info', { lng })
    const tTemp = i18n.t('mail.template', { lng })

    return (
        <TemplateWrapper template='reset_password' lng={lng} i18n={i18n} >
            <Tailwind>
                <Section className="font-sans tracking-wide font-normal text-[#222222] mb-2 px-2">
                    <Heading as="h2" className="text-center">{t('title') || "Verify your email address"}</Heading>

                    <Text className="text-center">{t('intro', {app: APP_NAME}) || `We received a request to reset the password for your ${APP_NAME} account. If it was you, click the button below to choose a new password.`}</Text>
                </Section>

                <Button
                    className="box-border w-fit rounded-lg m-auto bg-[#2B7AFF] px-6 py-3 text-center font-normal font-sans traking-wider text-white"
                    href={url}
                >
                    {t('cta') || "Create new password"}
                </Button>

                <Section className="text-center px-2 mt-4">
                    <Text className="text-center font-sans tracking-wide font-normal text-[#222222] m-0">{tTemp('copyLinkHint') || "Or paste this link into your browser:"}</Text>
                    <Link href={url} className="font-sans tracking-[0px] text-center text-sm w-full" >{url}</Link>
                </Section>

                <Section className='text-left bg-gray-100 rounded-lg p-6 mb-6 mt-4'>
                    <Heading
                        className='text-xl font-semibold text-[#2B7AFF]'
                    >
                        {request_info('title') || "Request details:"}
                    </Heading>
                    <ul className="list-disc list-inside text-black mt-2">
                        <li>{request_info('location', {country: metadata.location.country, city: metadata.location.city}) || `🌍 Location: ${metadata.location.country}, ${metadata.location.city}`}</li>
                        <li>{request_info('os', {os: metadata.device.os}) || `📱 Operating system: ${metadata.device.os}`}</li>
                        <li>{request_info('browser', {browser: metadata.device.browser}) || `🌐 Browser: ${metadata.device.browser}`}</li>
                        <li>{request_info('ip', {ip: metadata.ip}) || `💻 IP address:: ${metadata.ip}`}</li>
                    </ul>
                    <Text className='text-gray-600 mt-2'>
                       {request_info('note')}
                    </Text>
                </Section>
            </Tailwind>
        </TemplateWrapper>
    );
}

src/modules/libs/mail/templates/verification-email.tsx
[ Код из файла ]


import {
  Button,
  Heading,
  Link,
  Section,
  Tailwind,
  Text
} from "@react-email/components";
import { TemplateWrapper } from "./components";
import { type I18nService } from "@/core/i18n";
import { APP_NAME } from "@/core/config";

export interface IProps {
  url: string;
  i18n?: I18nService;
  lng?: string;
}

export function VerificationEmailTemplate({
  url, i18n, lng='en'
}: IProps) {

    const t = i18n.t('mail.verification_email', { lng })
    const tTemp = i18n.t('mail.template', { lng })

    return (
        <TemplateWrapper template='verification_email' lng={lng} i18n={i18n} >
            <Tailwind>
                <Section className="font-sans tracking-wide font-normal text-[#222222] mb-2 px-2">
                    <Heading as="h2" className="text-center">{t('title') || "Verify your email address"}</Heading>

                    <Text className="text-center">{t('intro', {app: APP_NAME}) || `Please confirm that you’d like to use this email address for your ${APP_NAME} account. Once confirmed, you’ll be able to start using ${APP_NAME}.`}</Text>
                </Section>

                <Button
                    className="box-border w-fit rounded-lg m-auto bg-[#2B7AFF] px-6 py-3 text-center font-normal font-sans traking-wider text-white"
                    href={url}
                >
                    {t('cta') || "Verify email"}
                </Button>

                <Section className="text-center px-2 mt-4">
                    <Text className="text-center font-sans tracking-wide font-normal text-[#222222] m-0">{tTemp('copyLinkHint') || "Or paste this link into your browser:"}</Text>
                    <Link href={url} className="font-sans tracking-[0px] text-center text-sm w-full" >{url}</Link>
                </Section>
            </Tailwind>
        </TemplateWrapper>
    );
}

src/modules/libs/sms/index.ts
[ Код из файла ]

export * from './sms.module'
export * from './sms.service'


src/modules/libs/sms/sms.service.ts
[ Код из файла ]

import twilio from 'twilio'
import type { Twilio } from 'twilio'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

interface TwilioError {
	message: string
	code?: number
	status?: number
	moreInfo?: string
	[key: string]: unknown
}

@Injectable()
export class SmsService extends CoreService {
	private readonly logger: Logger = new Logger(SmsService.name)
	private readonly twilioClient: Twilio
	private readonly defaultFrom: string

	constructor(i18n: I18nService, config: ConfigService) {
		super(i18n, undefined, undefined, config)

		const accountSid: string = this.config.getOrThrow<string>('TWILIO_SID')
		const authToken: string = this.config.getOrThrow<string>('TWILIO_TOKEN')
		this.defaultFrom = this.config.getOrThrow<string>('TWILIO_PHONE')

		this.twilioClient = twilio(accountSid, authToken)
	}

	private isTwilioError(error: unknown): error is TwilioError {
		return (
			typeof error === 'object' &&
			error !== null &&
			'message' in error &&
			typeof (error as TwilioError).message === 'string'
		)
	}

	private logError(error: unknown): void {
		if (this.isTwilioError(error)) {
			const codeInfo: string = error.code ? ` (code: ${error.code})` : ''
			const statusInfo: string = error.status ? ` (status: ${error.status})` : ''

			this.logger.error(`Twilio SMS send failed${codeInfo}${statusInfo}: ${error.message}`)
			this.logger.debug(`Twilio error payload: ${JSON.stringify(error)}`)
		} else if (error instanceof Error) {
			this.logger.error(`Twilio SMS send failed: ${error.message}`)
		} else {
			this.logger.error('Twilio SMS send failed: Unknown error')
		}
	}

	async sendSMS(to: string, body: string, from?: string): Promise<boolean> {
		try {
			await this.twilioClient.messages.create({
				body,
				to,
				from: from ?? this.defaultFrom,
			})
			return true
		} catch (error: unknown) {
			this.logError(error)
			return false
		}
	}


	async sendVerificationPhoneSMS(to: string, code: string, lng: Language): Promise<boolean> {
		return this.sendSMS(to, this.msg('sms.verification.phone', `Your verification code is: ${code}`, { lng, code }))
	}

	async sendOtpSMS(to: string, code: string, lng: Language): Promise<boolean> {
		return this.sendSMS(to, this.msg('sms.verification.otp', `Your verification code is: ${code}`, { lng, code }))
	}


	async canSendSms(_phone: string): Promise<boolean> {
		return Promise.resolve(true)
	}
}


src/shared/decorators/auth.decorator.ts
[ Код из файла ]

import { applyDecorators, UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from '../guards'

export function Authorization() {
	return applyDecorators(UseGuards(GqlAuthGuard))
}


src/shared/decorators/authorized.decorator.ts
[ Код из файла ]

import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { User } from '@prisma/__generated__'

export const Authorized = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
	let user: User

	if (ctx.getType() === 'http') {
		const req = ctx.switchToHttp().getRequest<{ user: User }>()
		user = req.user
	} else {
		const context = GqlExecutionContext.create(ctx)
		const gqlContext = context.getContext<{ req: { user: User } }>()
		user = gqlContext.req.user

		if (!user) return null
	}

	return data ? user[data] : user
})


src/shared/decorators/index.ts
[ Код из файла ]

export * from './auth.decorator'
export * from './authorized.decorator'
export * from './user-agent.decorator'

src/shared/decorators/user-agent.decorator.ts
[ Код из файла ]

import type { Request } from 'express'

import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const UserAgent = createParamDecorator((data: unknown, context: ExecutionContext) => {
	if (context.getType() === 'http') {
		const request = context.switchToHttp().getRequest<Request>()

		return request.headers['user-agent']
	} else {
		const ctx = GqlExecutionContext.create(context)
		const gqlContext = ctx.getContext<{ req?: Request }>()

		return gqlContext.req?.headers['user-agent'] ?? null
	}
})


src/shared/guards/gql-auth.guard.ts
[ Код из файла ]

import { DEFAULT_LANGUAGE, I18nService } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class GqlAuthGuard implements CanActivate {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly i18n: I18nService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const gqlContext = ctx.getContext<{ req: { session: { userId?: string }; language?: string; user?: any } }>()
		const request = gqlContext.req
		const lang = request.language || DEFAULT_LANGUAGE

		const user_not_authorized: string =
			this.i18n.t('common.errors.auth.user_not_authorized', { lng: lang }) || 'User not authorized'

		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException(user_not_authorized)
		}

		const user = await this.prismaService.user.findUnique({
			where: { id: request.session.userId },
		})

		if (!user) {
			throw new UnauthorizedException(user_not_authorized)
		}

		request.user = user

		return true
	}
}


src/shared/guards/index.ts
[ Код из файла ]

export * from './gql-auth.guard'


src/shared/middlewares/index.ts
[ Код из файла ]

export * from './raw-body.middleware'


src/shared/middlewares/raw-body.middleware.ts
[ Код из файла ]

import type { NextFunction, Request, Response } from 'express'
import getRawBody from 'raw-body'

import { DEFAULT_LANGUAGE, I18nService } from '@/core/i18n'
import { BadRequestException, Injectable, InternalServerErrorException, NestMiddleware } from '@nestjs/common'

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
	constructor(private readonly i18n: I18nService) {}
	use(req: Request, res: Response, next: NextFunction) {
		const lang = req.language || DEFAULT_LANGUAGE
		if (!req.readable) {
			const message =
				this.i18n.t('common.errors.request.invalid_data', { lng: lang }) || 'Invalid data from request'
			return next(new BadRequestException(message))
		}

		getRawBody(req, { encoding: 'utf-8' })
			.then(rawBody => {
				req.body = rawBody
				next()
			})
			.catch(() => {
				const message =
					this.i18n.t('common.errors.request.error_getting_raw_body', { lng: lang }) ||
					'Error getting raw body'
				return next(new InternalServerErrorException(message))
			})
	}
}
src/shared/pipes/file-validation.pipe.ts
[ Код из файла ]

import { Readable } from 'node:stream'

import { DEFAULT_LANGUAGE, I18nService } from '@/core/i18n'
import { type ArgumentMetadata, BadRequestException, Injectable, type PipeTransform } from '@nestjs/common'

import { bufferToStream, streamToBuffer, validateFileFormat } from '../utils'


export type GqlUpload = {
	filename: string
	mimetype?: string
	encoding?: string
	createReadStream: () => Readable
}


function isGqlUpload(x: unknown): x is GqlUpload {
	if (typeof x !== 'object' || x === null) return false
	const o = x as Record<string, unknown>
	if (!('filename' in o) || !('createReadStream' in o)) return false

	const filename = o.filename
	const createReadStream = o.createReadStream

	return typeof filename === 'string' && typeof createReadStream === 'function'
}


export type BufferedUpload = Omit<GqlUpload, 'createReadStream'> & {
	createReadStream: () => Readable
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
	constructor(private readonly i18n: I18nService) {}

	async transform(value: unknown, _metadata: ArgumentMetadata): Promise<BufferedUpload> {
		if (!isGqlUpload(value)) {
			const message =
				this.i18n.t('common.errors.file.not_loaded', { lng: DEFAULT_LANGUAGE }) ??
				'File not loaded or invalid structure'
			throw new BadRequestException(message)
		}

		const { filename, createReadStream } = value

		const allowedExt: Array<'jpg' | 'jpeg' | 'png' | 'webp' | 'gif'> = ['jpg', 'jpeg', 'png', 'webp', 'gif']
		const okFormat = validateFileFormat(filename, allowedExt)
		if (!okFormat) {
			const message =
				this.i18n.t('common.errors.file.unsupported_format', { lng: DEFAULT_LANGUAGE }) ??
				'Unsupported file format'
			throw new BadRequestException(message)
		}

		const originalStream = createReadStream()
		const fileBuffer = await streamToBuffer(originalStream)

		const MAX_SIZE_BYTES = 10 * 1024 * 1024
		if (fileBuffer.length > MAX_SIZE_BYTES) {
			const message =
				this.i18n.t('common.errors.file.size_exceeded_10mb', { lng: DEFAULT_LANGUAGE }) ??
				'File size exceeds 10 MB'
			throw new BadRequestException(message)
		}

		const buffered: BufferedUpload = {
			...value,
			createReadStream: () => bufferToStream(fileBuffer),
		}

		return buffered
	}
}

src/shared/pipes/index.ts
[ Код из файла ]

export * from './file-validation.pipe'


src/shared/types/express-session.d.ts
[ Код из файла ]

import 'express-session'

import type { ISessionMetadata } from './session-metadata.types'

declare module 'express-session' {
	interface SessionData {
		userId?: string
		createdAt?: Date | string
		metadata?: ISessionMetadata
		userAgent?: string
		ip?: string
	}
}


src/shared/types/gql-context.types.ts
[ Код из файла ]

import type { Request, Response } from 'express'

export interface GqlContext {
	req: Request
	res: Response
}


src/shared/types/index.ts
[ Код из файла ]

export * from './gql-context.types'
export * from './session-metadata.types'


src/shared/types/session-metadata.types.ts
[ Код из файла ]

export interface ILocation {
	country: string
	city: string
	latitude: number
	longitude: number
}

export interface IDevice {
	browser: string
	os: string
	type: string
}

export interface ISessionMetadata {
	location: ILocation
	device: IDevice
	ip: string
}



