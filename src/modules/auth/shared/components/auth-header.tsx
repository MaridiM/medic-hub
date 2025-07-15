import { ChangeLanguage, ChangeTheme, LogoIcon } from '@/packages/components'

export const AuthHeader = () => {
    return (
        <header className='flex h-16 items-center justify-between px-4'>
            <LogoIcon mini={false} className='h-8' />

            <div className='flex items-center gap-2'>
                <ChangeLanguage />
                <ChangeTheme />
            </div>
        </header>
    )
}
