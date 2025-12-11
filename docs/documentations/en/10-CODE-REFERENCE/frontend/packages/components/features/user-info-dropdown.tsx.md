# File: packages\components\features\user-info-dropdown.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/features/user-info-dropdown.tsx`

## Category
Frontend

## File Type
TSX (user-info-dropdown.tsx)

## Size
2639 characters, 61 lines

## Full Code

```typescript
import { Contact, LogOut, LucideIcon } from 'lucide-react'

import { User } from '@/packages/api/graphql'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    UserAvatar
} from '../shared'

import { ChangeThemeSwitcher } from './appearence'

const userMenu: { label: string; icon: LucideIcon; key: string }[] = [
    { label: 'Profile', icon: Contact, key: 'profile' },
    { label: 'Logout', icon: LogOut, key: 'logout' }
] as const

export const UserInfoDropdown = ({ user }: { user: User }) => {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
                <div className='flex cursor-pointer items-center gap-2'>
                    <UserAvatar fullName={user.fullName || ''} src={user.avatar || ''} className='min-w- size-8' />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-64'>
                <DropdownMenuLabel>
                    <div className='text-secondary flex flex-col items-start overflow-hidden'>
                        <span className='font-semibold tracking-wide'>{user.fullName}</span>
                        <span className='text-text-tertiary w-full overflow-hidden font-normal tracking-wide overflow-ellipsis whitespace-nowrap'>
                            {user.email}
                        </span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userMenu.map(item => (
                    <DropdownMenuItem key={item.key} onSelect={() => console.log(item.key)}>
                        <div className='flex items-center gap-2'>
                            <span className='flex size-6 min-w-6 items-center justify-center'>
                                <item.icon className='size-6' />
                            </span>
                            <span className='text-text pt-0.5 text-sm font-normal tracking-wide'>{item.label}</span>
                        </div>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>
                    <div className='text-secondary flex items-center overflow-hidden'>
                        <span className='w-full font-normal tracking-wide'>Theme</span>
                        <ChangeThemeSwitcher />
                    </div>
                </DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.237Z*
