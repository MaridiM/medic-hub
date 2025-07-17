import { useCallback, useEffect, useRef } from 'react'

/**
 * Returns a debounced version of `fn` that will only run
 * after `delay`ms have elapsed since the last call.
 */
export function useDebouncedCallback<T extends any[]>(fn: (...args: T) => void, delay: number) {
    // store timer ID
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    // clear on unmount
    useEffect(() => {
        return () => {
            if (timer.current) clearTimeout(timer.current)
        }
    }, [])

    // the debounced function
    return useCallback(
        (...args: T) => {
            if (timer.current) clearTimeout(timer.current)
            timer.current = setTimeout(() => {
                fn(...args)
            }, delay)
        },
        [fn, delay]
    )
}
