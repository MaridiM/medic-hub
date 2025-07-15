import { Metadata } from 'next'
import { ReactNode } from 'react'

import { AuthFooter, AuthHeader } from '@/modules/auth'

import { SITE_DESCRIPTION, SITE_NAME } from '@/packages/constants'

export const metadata: Metadata = {
    title: {
        absolute: SITE_NAME,
        template: `%s - ${SITE_NAME}`
    },
    description: SITE_DESCRIPTION
}

export default async function RootLayout({
    children
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <div className='flex h-screen flex-col'>
            <AuthHeader />
            <div className='flex flex-1 items-center justify-center'>{children}</div>
            <AuthFooter />
        </div>
    )
}
