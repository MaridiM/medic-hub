# File: packages\components\widgets\header.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/widgets/header.tsx`

## Category
Frontend

## File Type
TSX (header.tsx)

## Size
2868 characters, 69 lines

## Full Code

```typescript
'use client'

import { ChevronsUpDown } from 'lucide-react'
import { FC } from 'react'

import { User } from '@/packages/api/graphql'
import { Avatar, AvatarFallback, AvatarImage, Badge, LogoIcon, Navbar, UserInfoDropdown } from '@/packages/components'
import { cn } from '@/packages/utils'

interface IProps {
    user: User
}

export const Header = ({ user }: IProps) => {
    const isWithOrganization = false // ! FOR TESTING
    return (
        <header
            className={cn('bg-card border-border/20 grid h-24 w-full grid-rows-2 border-b shadow-lg', {
                'flex h-12': !isWithOrganization
            })}
        >
            <div className='flex w-full items-center justify-between gap-4'>
                <div className='flex items-center gap-2'>
                    <span
                        className={cn(
                            'flex h-12 w-fit items-center justify-center px-3',
                            isWithOrganization && 'w-12 px-0'
                        )}
                    >
                        <LogoIcon mini={isWithOrganization} className='h-6' />
                    </span>

                    {isWithOrganization && (
                        <div
                            className='flex h-8 cursor-pointer items-center gap-2'
                            onClick={() => console.log('click to organization')}
                        >
                            <Avatar className='size-6 min-w-6'>
                                <AvatarImage src='https://github.com/shadcn.png' />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex items-center justify-center gap-2'>
                                <span className='pt-0.5 text-sm font-semibold'>Medic Hub</span>
                                <Badge className='bg-background hover:bg-background border-border/10 border px-1.5 py-0.5'>
                                    <span className='text-text text-label-md leading-3 font-normal'>Organization</span>
                                </Badge>
                            </div>
                            <span>
                                <ChevronsUpDown className='text-text-secondary size-4' />
                            </span>
                        </div>
                    )}

                    {!isWithOrganization && <Navbar />}
                </div>

                <div className='flex items-center gap-4 px-4'>
                    <UserInfoDropdown user={user} />
                </div>
            </div>
            {isWithOrganization && (
                <div className='flex w-full items-center'>
                    <Navbar />
                </div>
            )}
        </header>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.432Z*
