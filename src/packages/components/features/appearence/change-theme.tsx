'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/packages/components'
import { cn } from '@/packages/utils'

interface IProps {
    className?: string
}

export function ChangeTheme({ className }: IProps) {
    const { theme, setTheme } = useTheme()

    const isDark = theme === 'dark'

    return (
        <Button
            variant='outline'
            size='icon'
            className={cn('border-none bg-transparent transition-all duration-300 ease-in-out', className)}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
            {isDark ? <Sun className='!size-5 stroke-yellow-500' /> : <Moon className='!size-5' />}
        </Button>
    )
}