# File: app\layout.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/app/layout.tsx`

## Category
Frontend

## File Type
TSX (layout.tsx)

## Size
1800 characters, 54 lines

## Full Code

```typescript
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Roboto } from 'next/font/google'
import { ReactNode } from 'react'

import { Toaster } from '@/packages/components'
import { ThemeProvider } from '@/packages/config'
import { SITE_DESCRIPTION, SITE_NAME } from '@/packages/constants'
import { ApolloClientProvider } from '@/packages/libs'
import { sanitizeForRSC } from '@/packages/utils'

import './styles/globals.css'

const roboto = Roboto({
    variable: '--font-roboto',
    subsets: ['latin'],
    weight: ['100', '300', '400', '500', '700', '900']
})

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
    const locale = await getLocale()
    const rawMessages = await getMessages()
    const messages = sanitizeForRSC(rawMessages)

    return (
        <html lang={locale} className='h-full'>
            <body className={`${roboto.variable} h-full antialiased`}>
                <ApolloClientProvider>
                    <NextIntlClientProvider messages={messages}>
                        <ThemeProvider attribute='class' defaultTheme='light' enableSystem disableTransitionOnChange>
                            {/* ВЕСЬ APP = ровно высота окна */}
                            <main className='flex h-full min-h-0 w-full flex-col overflow-hidden'>{children}</main>
                            <Toaster />
                        </ThemeProvider>
                    </NextIntlClientProvider>
                </ApolloClientProvider>
            </body>
        </html>
    )
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.896Z*
