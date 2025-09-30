import type { i18n as I18nInstance, TOptions } from 'i18next'

import { i18n as core } from '@/core/config/i18n.config'
import { Inject, Injectable, Scope } from '@nestjs/common'

import { isObjectRecord, LeafKeys, NodeKeys, ObjOptions, Res, ScopedT, StrOptions, ValueAtPath } from './i18n'
import { I18N_CORE } from './i18n.tokens'

@Injectable({ scope: Scope.DEFAULT })
export class I18nService {
	constructor(@Inject(I18N_CORE) private readonly coreI18n: I18nInstance) {}

	// --- перегрузки t(...) ---
	t<K extends LeafKeys<Res>>(key: K, opts?: StrOptions): string
	t<K extends NodeKeys<Res>>(key: K, opts: ObjOptions): ValueAtPath<Res, K>
	t<K extends NodeKeys<Res>>(key: K): ScopedT<K>
	t(key: string, opts?: TOptions): unknown {
		// единая «безопасная» сигнатура локальной обёртки
		const coreT = this.coreI18n.t as unknown as (key: string, options?: TOptions) => unknown

		// 1) явно запросили объект
		if (opts && (opts as { returnObjects?: boolean }).returnObjects) {
			return coreT(key, { ...opts, returnObjects: true })
		}

		// 2) ключ — узел → отдаём scope-функцию
		const probe = coreT(key, { returnObjects: true })
		if (isObjectRecord(probe)) {
			const makeScope = <B extends string>(base: B): ScopedT<B> => {
				const scoped = (<C extends string>(child: C, childOpts?: TOptions) => {
					const full = `${base}.${child}`

					if (childOpts && (childOpts as { returnObjects?: boolean }).returnObjects) {
						return coreT(full, { ...childOpts, returnObjects: true }) as ValueAtPath<Res, `${B}.${C}`>
					}

					const nextProbe = coreT(full, { returnObjects: true })
					if (isObjectRecord(nextProbe)) {
						return makeScope(full as `${B}.${C}`)
					}

					return coreT(full, childOpts) as string
				}) as ScopedT<B>
				return scoped
			}
			return makeScope(key)
		}

		// 3) лист — обычная строка
		return coreT(key, opts) as string
	}

	// --- getFixedT(...) с теми же перегрузками ---
	getFixedT(...args: Parameters<I18nInstance['getFixedT']>) {
		const fixed = this.coreI18n.getFixedT(...args)
		const coreT = fixed as unknown as (key: string, options?: TOptions) => unknown

		const makeScope = <B extends string>(base: B): ScopedT<B> => {
			const scoped = (<C extends string>(child: C, childOpts?: TOptions) => {
				const full = `${base}.${child}`

				if (childOpts && (childOpts as { returnObjects?: boolean }).returnObjects) {
					return coreT(full, { ...childOpts, returnObjects: true }) as ValueAtPath<Res, `${B}.${C}`>
				}

				const probe = coreT(full, { returnObjects: true })
				if (isObjectRecord(probe)) return makeScope(full as `${B}.${C}`)

				return coreT(full, childOpts) as string
			}) as ScopedT<B>
			return scoped
		}

		const typed = (<K extends string>(key: K, opts?: TOptions) => {
			if (opts && (opts as { returnObjects?: boolean }).returnObjects) {
				return coreT(key, { ...opts, returnObjects: true })
			}
			const probe = coreT(key, { returnObjects: true })
			if (isObjectRecord(probe)) return makeScope(key)
			return coreT(key, opts) as string
		}) as {
			<K extends LeafKeys<Res>>(key: K, opts?: StrOptions): string
			<K extends NodeKeys<Res>>(key: K, opts: ObjOptions): ValueAtPath<Res, K>
			<K extends NodeKeys<Res>>(key: K): ScopedT<K>
		}

		return typed
	}

	// --- прочее
	get language() {
		return this.coreI18n.language
	}
	changeLanguage(...args: Parameters<I18nInstance['changeLanguage']>) {
		return this.coreI18n.changeLanguage(...args)
	}
	getLanguage(options?: { req?: { language?: string } }) {
		return options?.req?.language ?? this.coreI18n.language ?? 'en'
	}

	// --- статический доступ (утилиты)
	static t<K extends LeafKeys<Res>>(key: K, opts?: StrOptions): string
	static t<K extends NodeKeys<Res>>(key: K, opts: ObjOptions): ValueAtPath<Res, K>
	static t<K extends NodeKeys<Res>>(key: K): ScopedT<K>
	static t(key: string, opts?: TOptions): unknown {
		const inst = core as unknown as I18nInstance
		const coreT = inst.t as unknown as (key: string, options?: TOptions) => unknown

		if (opts && (opts as { returnObjects?: boolean }).returnObjects) {
			return coreT(key, { ...opts, returnObjects: true })
		}

		const probe = coreT(key, { returnObjects: true })
		if (isObjectRecord(probe)) {
			const makeScope = <B extends string>(base: B): ScopedT<B> => {
				const scoped = (<C extends string>(child: C, childOpts?: TOptions) => {
					const full = `${base}.${child}`
					if (childOpts && (childOpts as { returnObjects?: boolean }).returnObjects) {
						return coreT(full, { ...childOpts, returnObjects: true }) as ValueAtPath<Res, `${B}.${C}`>
					}
					const next = coreT(full, { returnObjects: true })
					if (isObjectRecord(next)) return makeScope(full as `${B}.${C}`)
					return coreT(full, childOpts) as string
				}) as ScopedT<B>
				return scoped
			}
			return makeScope(key)
		}

		return coreT(key, opts) as string
	}
}
