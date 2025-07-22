import { ComponentProps } from 'react'

import { Button } from '@/packages/components'

interface IProps extends ComponentProps<'div'> {
    text: string
    link: string
    onClick?: () => void
}

export const TryAgain = ({ text, link, onClick }: IProps) => {
    return (
        <div className='text-p-sm text-text-secondary flex items-center justify-center gap-1'>
            {text}
            <Button
                type='button'
                className='text-primary hover:text-primary-700 w-fill h-auto cursor-pointer rounded-none bg-transparent p-0 hover:bg-transparent'
                onClick={() => onClick?.()}
            >
                {link}
            </Button>
        </div>
    )
}
