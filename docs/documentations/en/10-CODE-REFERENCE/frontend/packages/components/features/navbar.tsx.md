# File: packages\components\features\navbar.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/features/navbar.tsx`

## Category
Frontend

## File Type
TSX (navbar.tsx)

## Size
2296 characters, 60 lines

## Full Code

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { PATHS } from '@/packages/config'
import { cn } from '@/packages/utils'

const navbarItems = [
    { label: 'Dashboard', href: (): string => PATHS.dashboard(), key: 'dashboard' },
    { label: 'Organization', href: (): string => PATHS.organization(), key: 'organization' },
    { label: 'Settings', href: PATHS.settings, key: 'settings' }
] as const

export const Navbar = () => {
    const pathname = usePathname()
    const [active, setActive] = useState<string>('organization')

    useEffect(() => {
        pathname.includes(active)
            ? setActive(active)
            : navbarItems.forEach(item => {
                  if (pathname.includes(item.key)) {
                      setActive(item.key)
                  }
              })
    }, [active, pathname])

    return (
        <nav className='flex h-12 px-1'>
            {navbarItems.map(item => {
                const isActive = item.key === active
                return (
                    <div
                        key={item.key}
                        className={cn(
                            'group hover:border-primary flex items-center border-b-2 border-transparent transition-[border] duration-300 ease-in-out',
                            { 'border-primary': isActive }
                        )}
                        onAbort={() => setActive(item.key)}
                    >
                        <Link
                            href={typeof item.href === 'function' ? item.href() : item.href}
                            className={cn(
                                'group-hover:bg-hover text-text rounded-lg bg-transparent px-3 py-2 text-sm font-normal tracking-wider transition-[background,color] duration-300 ease-in-out',
                                {
                                    'text-primary group-hover:bg-transparent': isActive
                                }
                            )}
                        >
                            {item.label}
                        </Link>
                    </div>
                )
            })}
        </nav>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.234Z*
