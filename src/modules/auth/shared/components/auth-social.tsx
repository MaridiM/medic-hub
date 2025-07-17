import { ComponentProps } from 'react'

import { Google } from '@/packages/assets/icons'
import { Button } from '@/packages/components'
import { TUseTranslations } from '@/packages/libs/i18n'

interface IProps extends ComponentProps<'div'> {
    t: TUseTranslations
}

export const AuthSocial = ({ t, ...props }: IProps) => {
    return (
        <div className='flex flex-col gap-6' {...props}>
            <div className='flex flex-col gap-2'>
                <Button variant='ghost' className='w-full gap-2 tracking-wide'>
                    <Google className='!size-4' />
                    {t('form.loginWithGoogle')}
                </Button>
            </div>
            <div className='after:border-border/20 text-p-sm relative text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                <span className='bg-card text-text-tertiary relative z-10 px-2'>{t('form.orContinue')}</span>
            </div>
        </div>
    )
}
