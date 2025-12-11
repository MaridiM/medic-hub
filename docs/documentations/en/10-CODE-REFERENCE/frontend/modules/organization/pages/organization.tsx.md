# File: modules\organization\pages\organization.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/organization/pages/organization.tsx`

## Category
Frontend

## File Type
TSX (organization.tsx)

## Size
1665 characters, 37 lines

## Full Code

```typescript
import { Plus } from 'lucide-react'
import Link from 'next/link'

import { mockUser } from '@/packages/api/mocks'
import { Header, buttonVariants } from '@/packages/components'
import { PATHS } from '@/packages/config'

import { CreateOrgIcon } from '@/organization/shared/assets'

export const Organisation = () => {
    return (
        <div className='flex min-h-screen w-full flex-col'>
            <Header user={mockUser} />
            <main className='bg-background flex flex-1 grid-cols-4 items-center justify-center gap-2 p-2'>
                <div className='flex w-[480px] flex-col items-center gap-6 p-6'>
                    <CreateOrgIcon className='min-h-[171px] min-w-[200px]' />

                    <div className='space-y-4 text-center'>
                        <h1 className='text-h3 text-text tracking-wide'>No organizations yet</h1>
                        <p className='text-text-secondary text-center'>
                            To start using the system, please register your first organization.
                        </p>
                        <p className='text-text-secondary text-center'>
                            After that, you’ll be able to add staff, set up schedules, and manage patient appointments.
                        </p>
                    </div>

                    <Link href={PATHS.organization('create')} className={buttonVariants({ variant: 'primary' })}>
                        <Plus className='stroke-text-foreground' />
                        <span className='pt-px text-current'>Create Organization</span>
                    </Link>
                </div>
            </main>
        </div>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.161Z*
