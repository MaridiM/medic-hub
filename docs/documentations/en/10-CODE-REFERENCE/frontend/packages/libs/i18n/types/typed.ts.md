# File: packages\libs\i18n\types\typed.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/libs/i18n/types/typed.ts`

## Category
Frontend

## File Type
TS (typed.ts)

## Size
1985 characters, 46 lines

## Full Code

```typescript
import { useTranslations as useTranslationsIntl } from 'next-intl'
import { getTranslations as getTranslationsIntl } from 'next-intl/server'

import { TAuthTranslationsKeys } from '@/modules/auth'
import { TOrganizationTranslationsKeys } from '@/modules/organization'

import { TTranslations } from '../locales'

import { GetByPath, PathKeys, TypedT } from './paths'

// Combined view of all messages (core + auth + beyond)
export type AllMessages = TTranslations & TAuthTranslationsKeys & TOrganizationTranslationsKeys

// Allowed namespaces: "auth", "auth.changePassword", "core", ...
export type Namespace = PathKeys<AllMessages>

/* =======================
   Client: useT()
   ======================= */
export function useTranslations<N extends Namespace>(ns: N): TypedT<GetByPath<AllMessages, N>>
export function useTranslations(): TypedT<AllMessages>
export function useTranslations(ns?: string) {
    // Typing only — runtime delegated to next-intl
    return useTranslationsIntl(ns as any) as any
}

/* =======================
   Server: getT()
   ======================= */
type GetTOptions<N extends string = string> = { locale: string; namespace?: N }

export async function getTranslations<N extends Namespace>(ns: N): Promise<TypedT<GetByPath<AllMessages, N>>>
export async function getTranslations(): Promise<TypedT<AllMessages>>
export async function getTranslations<N extends Namespace>(
    opts: GetTOptions<N>
): Promise<TypedT<GetByPath<AllMessages, N>>>
export async function getTranslations(arg?: string | GetTOptions): Promise<TypedT<any>> {
    // 1) String → overload getTranslations(namespace?: string)
    if (typeof arg === 'string' || typeof arg === 'undefined') {
        return getTranslationsIntl(arg as string | undefined) as any
    }
    // 2) Object → overload getTranslations({ locale, namespace? })
    const { locale, namespace } = arg
    return getTranslationsIntl({ locale, namespace }) as any
}

```

## Description

This file is part of the MedicHub Frontend (Next.js) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.729Z*
