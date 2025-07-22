'use client'

import { Bell, Menu, PanelLeftOpen, Settings } from 'lucide-react'
import { FC } from 'react'

import { Button, ChangeLanguage, ChangeTheme, LogoIcon, UserAvatar } from '@/packages/components'
import { useStore } from '@/packages/libs'
import { cn } from '@/packages/utils'

interface HeaderProps {
    heading: string
    headingCount?: number
}

export const Header: FC<HeaderProps> = ({ heading, headingCount }) => {
    const { isSidebarOpen, setIsSidebarOpen } = useStore()

    return (
        <header className='flex h-16 min-h-16 w-full items-center justify-between gap-4 pr-2 pl-0 md:pl-2'>
            <div className='flex items-center gap-2'>
                <span className='flex size-16 items-center justify-center md:hidden'>
                    <LogoIcon className='size-8' />
                </span>
                <Button
                    variant='outline'
                    size='icon'
                    className={cn('hidden opacity-0 transition-opacity duration-300 ease-in-out', {
                        'flex opacity-100': isSidebarOpen
                    })}
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <PanelLeftOpen className='stroke-text hidden !size-5 md:block' />
                    <Menu className='stroke-text !size-5 md:hidden' />
                </Button>

                <h1 className='text-h4 text-text hidden items-center gap-1 font-medium tracking-wide md:flex'>
                    {heading}
                    {headingCount && <span className='text-text-secondary text-p-md pt-px font-normal'>(10)</span>}
                </h1>
            </div>

            <div className='flex items-center gap-2'>
                {/* <Button variant='primary' className='cursor-pointer' onClick={() => console.log('Add patient')}>
                    <Plus className='stroke-text-foreground' />
                    <span className='text-text-foreground tracking-wide'>Add patient</span>
                </Button> */}
                <ChangeTheme />
                <ChangeLanguage />
                <Button
                    variant='outline'
                    size='icon'
                    className='hover:bg-hover cursor-pointer'
                    onClick={() => console.log('Notifications')}
                >
                    <Bell className='stroke-text !size-5' />
                </Button>
                <Button
                    variant='outline'
                    size='icon'
                    className='hover:bg-hover cursor-pointer'
                    onClick={() => console.log('Settings')}
                >
                    <Settings className='stroke-text !size-5' />
                </Button>

                <UserAvatar
                    fullName='Marlow Grand'
                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyBnY2OmVc4EJcVSkmvrVZFHgFDVedUQ56GA&s'
                />
            </div>
        </header>
    )
}
