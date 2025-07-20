import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import { Verify } from '@/modules/auth'

import { PATHS } from '@/packages/config'
import { NO_INDEX_PAGE } from '@/packages/constants'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('auth.verify')

    return {
        title: t('heading'),
        description: t('description'),
        ...NO_INDEX_PAGE
    }
}
export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token: string }> }) {
    const token = (await searchParams).token

    if (!token) {
        return redirect(PATHS.auth('create-account'))
    }
    return <Verify token={token} />
}
