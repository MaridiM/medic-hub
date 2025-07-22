'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { cn } from '@/packages/utils'

interface CountdownProps {
    /** Start value in seconds */
    duration: number
    className?: string
}

export const Countdown = ({ duration, className }: CountdownProps) => {
    const t = useTranslations('core')

    const [remaining, setRemaining] = useState(duration)

    // reset when duration changes
    useEffect(() => {
        setRemaining(duration)
    }, [duration])

    // tick every second
    useEffect(() => {
        if (remaining <= 0) return
        const id = window.setTimeout(() => setRemaining(r => r - 1), 1000)
        return () => clearTimeout(id)
    }, [remaining])

    return (
        <span className={cn('text-text-secondary text-p-xs', className)}>
            {remaining}
            {t('time.seconds.short')}
        </span>
    )
}
