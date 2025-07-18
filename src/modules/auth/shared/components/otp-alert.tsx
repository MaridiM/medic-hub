'use client'

import { CircleX, LucideIcon } from 'lucide-react'
import { CircleCheckBig } from 'lucide-react'
import { ComponentProps } from 'react'

import { Alert, AlertTitle, Countdown } from '@/packages/components'

export type TStatus = 'success' | 'failed'

interface IStatusParamsItem {
    icon: LucideIcon
    color: string
}

type TStatusParams = Record<TStatus, IStatusParamsItem>

interface OtpAlertProps extends ComponentProps<typeof Alert> {
    status: TStatus
    title: string
    /** Countdown start in seconds (default 3) */
    duration?: number
}

export const OtpAlert = ({ status, title, duration = 3, ...props }: OtpAlertProps) => {
    const statusParams: TStatusParams = {
        success: {
            icon: CircleCheckBig,
            color: 'positive'
        },
        failed: {
            icon: CircleX,
            color: 'destructive'
        }
    }

    const { icon: Icon, color } = statusParams[status]

    return (
        <Alert className={`border-${color}/50 dark:border-${color} bg-${color}/10`} {...props}>
            <Icon className={`stroke-${color} size-4`} />
            <AlertTitle className={`text-${color} flex items-center justify-between`}>
                {title}
                {status === 'success' && <Countdown duration={duration} className='!text-positive' />}
            </AlertTitle>
        </Alert>
    )
}
