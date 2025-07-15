'use client'

import { Building2, LucideIcon, PanelRightOpen, User, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/packages/components'
import { LogoIcon } from '@/packages/components'
import { PATHS } from '@/packages/config/routes/paths'
import { useStore } from '@/packages/libs'
import { cn } from '@/packages/utils'

const sidebarNav: { label: string; icon: LucideIcon; href: string }[] = [
    {
        label: 'organizations',
        icon: Building2,
        href: PATHS.organizations()
    },
    {
        label: 'patients',
        icon: User,
        href: PATHS.patients
    }
]

export const Sidebar = () => {
    const t = useTranslations('core')
    const { isSidebarOpen, setIsSidebarOpen } = useStore()
    const pathname = usePathname()

    return (
        <aside
            className={cn(
                'bg-card border-border/20 fixed z-1000 flex h-full w-full max-w-0 flex-col items-center overflow-hidden border-r transition-[max-width] duration-300 ease-in-out md:static md:max-w-16',
                {
                    'xs:max-w-64 max-w-full md:max-w-64': !isSidebarOpen
                }
            )}
        >
            <header className='border-border/20 relative flex h-16 min-h-16 w-full items-center justify-between gap-1 border-b pr-2 pl-4'>
                <span className='flex items-center'>
                    <LogoIcon className='size-8' />
                    <LogoIcon
                        className={cn('h-6 transition-opacity duration-300 ease-in-out', {
                            'opacity-0': isSidebarOpen
                        })}
                        onlyText
                    />
                </span>

                <Button
                    variant='outline'
                    size='icon'
                    className={cn('transition-opacity duration-300 ease-in-out', {
                        'opacity-0': isSidebarOpen
                    })}
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <PanelRightOpen className='hidden !size-5 md:block' />
                    <X className='!size-5 md:hidden' />
                </Button>
            </header>

            <ul className='flex w-full flex-col overflow-auto'>
                {sidebarNav.map((item, idx) => {
                    const isActive = pathname === item.href
                    return (
                        <li
                            key={idx}
                            className={cn('hover:bg-hover flex h-12 min-h-12 w-full overflow-hidden px-4', {
                                'bg-primary hover:bg-primary': isActive
                            })}
                        >
                            <Link href={item.href} className='flex w-full items-center gap-1'>
                                <span className='flex size-8 min-w-8 items-center justify-center'>
                                    <item.icon
                                        className={cn('stroke-text size-5', {
                                            'stroke-text-foreground': isActive
                                        })}
                                    />
                                </span>
                                <span
                                    className={cn('text-p-md text-text transition-opacity duration-300 ease-in-out', {
                                        'opacity-0': isSidebarOpen,
                                        'text-text-foreground': isActive
                                    })}
                                >
                                    {t(`sidebar.${item.label}`)}
                                </span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </aside>
    )
}
