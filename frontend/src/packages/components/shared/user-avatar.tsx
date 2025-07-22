import { CSSProperties } from 'react'

import { cn, generateAbbreviation } from '@/packages/utils'

import { Avatar, AvatarFallback, AvatarImage } from './ui'

interface IProps {
    className?: string
    style?: CSSProperties
    radius?: string
    src?: string
    fullName?: string
}

export function UserAvatar({ className, radius, style, fullName, src }: IProps) {
    return (
        <Avatar className={cn('', className, radius)}>
            <AvatarImage src={src} alt={fullName ?? 'User avatar'} style={style} />
            <AvatarFallback
                className={cn(
                    'border-border/5 text-p-md text-text-secondary border pt-px tracking-wider uppercase',
                    radius
                )}
            >
                {generateAbbreviation(fullName ?? 'US')}
            </AvatarFallback>
        </Avatar>
    )
}
