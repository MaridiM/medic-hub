import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { ForgotPassword } from '@/modules/auth'

import { NO_INDEX_PAGE } from '@/packages/constants'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('auth.forgotPassword')

    return {
        title: t('heading'),
        description: t('description'),
        ...NO_INDEX_PAGE
    }
}

export default function Auth() {
    return <ForgotPassword />
}
