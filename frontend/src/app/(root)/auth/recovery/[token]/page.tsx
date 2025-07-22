import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { ChangePassword } from '@/modules/auth'

import { NO_INDEX_PAGE } from '@/packages/constants'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('auth.changePassword')

    return {
        title: t('heading'),
        description: t('description'),
        ...NO_INDEX_PAGE
    }
}

export default function ChangePasswordPage() {
    return <ChangePassword />
}
