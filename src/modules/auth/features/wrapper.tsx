import { PropsWithChildren } from 'react'

import { cn } from '@/packages/utils'

import { Footer, Header } from '@/auth/shared/components'

interface WrapperProps extends PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
    className?: string
}

export const Wrapper = ({ children, className, ...props }: WrapperProps) => {
    return (
        <div className={cn('flex min-h-screen w-full flex-col gap-6', className)} {...props}>
            <Header />
            <div className='flex flex-1 items-center justify-center p-4'>{children}</div>
            <Footer />
        </div>
    )
}
