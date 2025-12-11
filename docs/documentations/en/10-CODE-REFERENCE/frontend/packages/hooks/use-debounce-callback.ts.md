# File: packages\hooks\use-debounce-callback.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/hooks/use-debounce-callback.ts`

## Category
Frontend

## File Type
TS (use-debounce-callback.ts)

## Size
2265 characters, 79 lines

## Full Code

```typescript
import { useCallback, useEffect, useRef } from 'react'

type DebouncedFn<T extends any[]> = ((...args: T) => void) & {
    cancel: () => void
    flush: () => void
    pending: () => boolean
}

export function useDebouncedCallback<T extends any[]>(fn: (...args: T) => void, delay: number): DebouncedFn<T> {
    // Храним актуальную версию функции
    const fnRef = useRef(fn)
    const delayRef = useRef(delay)

    useEffect(() => {
        fnRef.current = fn
        delayRef.current = delay
    }, [fn, delay])

    const timerRef = useRef<number | null>(null)
    const pendingRef = useRef(false)
    const lastArgsRef = useRef<T | null>(null)

    // Стабильные функции
    const cancel = useCallback(() => {
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current)
            timerRef.current = null
        }
        pendingRef.current = false
        lastArgsRef.current = null
    }, [])

    const flush = useCallback(() => {
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current)
            timerRef.current = null
        }
        if (lastArgsRef.current !== null) {
            fnRef.current(...lastArgsRef.current)
            lastArgsRef.current = null
            pendingRef.current = false
        }
    }, [])

    const pending = useCallback(() => pendingRef.current, [])

    // Cleanup на анмаунт
    useEffect(() => cancel, [cancel])

    // Сам debounced callback
    const debounced = useCallback(
        (...args: T) => {
            lastArgsRef.current = args

            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current)
            }

            pendingRef.current = true

            timerRef.current = window.setTimeout(() => {
                if (lastArgsRef.current !== null) {
                    fnRef.current(...lastArgsRef.current)
                    lastArgsRef.current = null
                }
                pendingRef.current = false
                timerRef.current = null
            }, delayRef.current)
        },
        [] // Пустые зависимости - функция стабильна
    ) as DebouncedFn<T>

    debounced.cancel = cancel
    debounced.flush = flush
    debounced.pending = pending

    return debounced
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.616Z*
