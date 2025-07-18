import Link from 'next/link'
import { ComponentProps } from 'react'

import { TUseTranslations } from '@/packages/libs/i18n'

interface IProps extends ComponentProps<'div'> {
    t: TUseTranslations
}

export const FormFooter = ({ className, t, ...props }: IProps) => {
    return (
        <div className='text-text-tertiary *:[a]:hover:text-primary text-p-xs px-4 text-center text-balance *:[a]:underline *:[a]:underline-offset-4'>
            {t('agreement.prefix')} <Link href='#'>{t('agreement.terms')}</Link> {t('agreement.and')}{' '}
            <Link href='#'>{t('agreement.privacy')}</Link>.
        </div>
    )
}
