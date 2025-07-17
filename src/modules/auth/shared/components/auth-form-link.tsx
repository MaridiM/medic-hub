'use client'

import { useRouter } from 'next/navigation'
import { ComponentProps } from 'react'

import { Button } from '@/packages/components'

interface IProps extends ComponentProps<'div'> {
    href: string
    buttonText: string
    text: string
    onClick?: () => void
}

export const AuthFormLink = ({ href, buttonText, text, onClick, ...props }: IProps) => {
    const router = useRouter()
    return (
        <footer className='text-text text-p-sm flex items-center justify-center gap-1' {...props}>
            {text}
            <Button
                className='text-primary hover:text-primary-700 cursor-pointer p-0 hover:bg-transparent'
                onClick={() => {
                    router.push(href)
                    onClick?.()
                }}
            >
                {buttonText}
            </Button>
        </footer>
    )
}
