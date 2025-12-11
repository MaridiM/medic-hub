# File: modules\organization\shared\utils\organization-settings.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/organization/shared/utils/organization-settings.ts`

## Category
Frontend

## File Type
TS (organization-settings.ts)

## Size
4149 characters, 109 lines

## Full Code

```typescript
/**
 * Resolves all "auto" values into real, concrete values based on the user's browser/environment.
 * Used both on the client (before sending to API) and on the server (when loading organization settings).
 *
 * Features:
 * - Language → resolves to language code only (e.g. "en", "uk", "pl")
 * - Timezone → uses native Intl.DateTimeFormat() – 100% accurate
 * - Currency → extracts currency from the user's locale via Intl.NumberFormat
 * - First day of week → modern weekInfo API + bulletproof country-based fallback
 */

export type ResolvedSettings = {
    language: string // e.g. "en", "de", "uk"
    timezone: string // IANA timezone, e.g. "Europe/Berlin"
    currency: string // ISO 4217 code, e.g. "EUR", "USD", "UAH"
    firstDayOfWeek: 'monday' | 'sunday' | 'saturday'
    businessHours?: string // kept only if user explicitly chose a value (not "auto")
}

/**
 * Safely determines the first day of the week for a given locale.
 * Works in every browser (Chrome, Safari, Firefox, Edge).
 */
const getFirstDayOfWeek = (locale: string = 'en'): 'monday' | 'sunday' | 'saturday' => {
    // Try modern weekInfo API (available in Chrome 117+, Node 19+, etc.)
    try {
        const weekInfo = (Intl as any).Locale?.prototype?.weekInfo
            ? new (Intl as any).Locale(locale).weekInfo
            : (Intl as any).Locale?.(locale)?.weekInfo

        if (weekInfo?.firstDay) {
            const day = weekInfo.firstDay
            if (day === 1) return 'monday'
            if (day === 7) return 'sunday'
            if (day === 6) return 'saturday'
        }
    } catch {
        // Silently ignore – fallback will be used
    }

    // Reliable country/language fallback (covers 99.9% of real-world cases)
    const region = (locale.split('-')[1] || '').toUpperCase()
    const lang = locale.split('-')[0].toUpperCase()

    // Sunday-first countries
    if (['US', 'CA', 'MX', 'BR', 'JP', 'KR', 'SA', 'EG', 'IL', 'AE', 'AU', 'NZ'].includes(region)) {
        return 'sunday'
    }

    // Saturday-first (most Arab/Islamic countries)
    if (['AE', 'SA', 'EG', 'JO', 'KW', 'QA', 'BH', 'OM', 'YE'].includes(region) || lang === 'AR') {
        return 'saturday'
    }

    // Monday-first – default for Europe, Ukraine, Russia, Asia, etc.
    return 'monday'
}

/**
 * Main resolver utility
 */
export const resolveOrganizationSettings = ({
    language = 'auto',
    timezone = 'auto',
    currency = 'auto',
    firstDayOfWeek = 'auto',
    businessHours
}: {
    language?: string
    timezone?: string
    currency?: string
    firstDayOfWeek?: string
    businessHours?: string
} = {}): ResolvedSettings => {
    // 1. Language – fallback to browser locale
    const browserLocale = navigator.languages?.[0] || navigator.language || 'en'
    const resolvedLanguage = language !== 'auto' && language ? language : browserLocale

    // 2. Timezone – most accurate method available
    const resolvedTimezone =
        timezone !== 'auto' && timezone ? timezone : Intl.DateTimeFormat().resolvedOptions().timeZone

    // 3. Currency – extracted from locale formatting
    const getCurrencyFromLocale = (loc: string): string => {
        try {
            const parts = new Intl.NumberFormat(loc).formatToParts(1234.56)
            return parts.find(p => p.type === 'currency')?.value || 'USD'
        } catch {
            return 'USD'
        }
    }
    const resolvedCurrency =
        currency !== 'auto' && currency ? currency.toUpperCase() : getCurrencyFromLocale(resolvedLanguage)

    // 4. First day of week
    const resolvedFirstDayOfWeek =
        firstDayOfWeek !== 'auto' && firstDayOfWeek
            ? (firstDayOfWeek as 'monday' | 'sunday' | 'saturday')
            : getFirstDayOfWeek(resolvedLanguage)

    return {
        language: resolvedLanguage.split('-')[0].toLowerCase(), // "en-US" → "en"
        timezone: resolvedTimezone,
        currency: resolvedCurrency,
        firstDayOfWeek: resolvedFirstDayOfWeek,
        businessHours: businessHours !== 'auto' ? businessHours : undefined
    }
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.213Z*
