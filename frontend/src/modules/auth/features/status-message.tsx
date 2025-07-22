'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Button, CardContent, Countdown } from '@/packages/components'
import { PATHS } from '@/packages/config'
import { useCountdown } from '@/packages/hooks'

import { TryAgain } from '@/auth/shared/components'
import { TStatus } from '@/auth/shared/types'

interface StatusMessageProps {
    status: TStatus
    setStatusPage: (s: TStatus | null) => void
}

const DURATION = 15 // время обратного отсчёта в секундах

export const StatusMessage = ({ status, setStatusPage }: StatusMessageProps) => {
    const t = useTranslations('auth.resetPassword')
    const router = useRouter()

    const { remaining, start } = useCountdown(DURATION)

    useEffect(() => {
        if (status === 'success') start()
    }, [status, start])

    useEffect(() => {
        if (status === 'success' && remaining === 0) {
            router.push(PATHS.auth())
        }
    }, [status, remaining, router])

    return (
        <CardContent className='flex flex-col items-center gap-6'>
            {status === 'success' ? (
                <Button
                    variant='primary'
                    disabled={!remaining}
                    className='w-full gap-2'
                    onClick={() => router.push(PATHS.auth())}
                >
                    {remaining > 0 ? `${t('confirmation.backButton.0')} ` : t('confirmation.redirect')}
                    {remaining > 0 && <Countdown duration={remaining} className='!text-text-foreground' />}
                </Button>
            ) : (
                <>
                    <TryAgain
                        text={t('confirmation.tryAgain.text')}
                        link={t('confirmation.tryAgain.link')}
                        onClick={() => setStatusPage(null)}
                    />
                    <Button variant='ghost' className='w-fit' onClick={() => router.push(PATHS.auth())}>
                        {t('confirmation.backButton.1')}
                    </Button>
                </>
            )}
        </CardContent>
    )
}
