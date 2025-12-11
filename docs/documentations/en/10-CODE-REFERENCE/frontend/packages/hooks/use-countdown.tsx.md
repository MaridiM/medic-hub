# File: packages\hooks\use-countdown.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/hooks/use-countdown.tsx`

## Category
Frontend

## File Type
TSX (use-countdown.tsx)

## Size
1532 characters, 47 lines

## Full Code

```typescript
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A countdown hook.
 *
 * @param initialDuration The number of seconds to count down from.
 * @returns
 *  - remaining: current seconds left
 *  - start(): begin counting down (from initialDuration)
 *  - reset(): reset immediately to initialDuration without starting
 */
export function useCountdown(initialDuration: number) {
    const [remaining, setRemaining] = useState(initialDuration)
    const timeoutRef = useRef<number | null>(null)

    // cleanup on unmount
    useEffect(() => {
        return () => clearTimeout(timeoutRef?.current ?? undefined)
    }, [])

    // ticking effect
    useEffect(() => {
        if (remaining <= 0) return
        timeoutRef.current = window.setTimeout(() => {
            setRemaining(r => r - 1)
        }, 1000)
        return () => clearTimeout(timeoutRef?.current ?? undefined)
    }, [remaining])

    /** reset to the initial value, but don’t start ticking */
    const reset = useCallback(() => {
        clearTimeout(timeoutRef?.current ?? undefined)
        setRemaining(initialDuration)
    }, [initialDuration])

    /** reset _and_ begin countdown from the initial value */
    const start = useCallback(() => {
        reset()
        // small delay to let reset flush, then begin ticking
        timeoutRef.current = window.setTimeout(() => {
            setRemaining(r => r - 1)
        }, 1000)
    }, [reset])

    return { remaining, start, reset }
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.611Z*
