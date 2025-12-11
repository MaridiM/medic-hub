# File: modules\organization\pages\create-organization copy.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/organization/pages/create-organization copy.tsx`

## Category
Frontend

## File Type
TSX (create-organization copy.tsx)

## Size
11331 characters, 201 lines

## Full Code

```typescript
'use client'

import { Check, ChevronRight, LucideIcon, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { mockUser } from '@/packages/api/mocks'
import {
    Badge,
    Button,
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Header,
    buttonVariants
} from '@/packages/components'
import { PATHS } from '@/packages/config'
import { cn } from '@/packages/utils'

import { OrgTypeIcon, SpecialistTypeIcon } from '../shared/assets'

type TMode = 'organization' | 'specialist'

interface IPlanItems {
    exist: boolean
    value: string
}
interface IPlans {
    type: TMode
    icon: any
    title: string
    description: string
    recomend: boolean
    items: Array<IPlanItems>
    fotterItems: Array<string>
}

const plans: IPlans[] = [
    {
        type: 'specialist',
        icon: SpecialistTypeIcon,
        title: 'Specialist',
        description:
            'Ideal for private practitioners — doctors, dentists, or cosmetologists — who manage appointments independently without administrative staff. All patient management tools in one place.',
        recomend: true,
        items: [
            { exist: true, value: 'Flexible appointment scheduling (drag & drop)' },
            { exist: true, value: 'Electronic medical records and treatment plans' },
            { exist: true, value: "Photo documentation: 'before / after'" },
            { exist: true, value: 'Receipts and payments (cash / card / QR)' },
            { exist: true, value: 'Automated patient reminders' },
            { exist: false, value: 'Voice assistant DL Assistant' }
        ],
        fotterItems: ['1 office', 'no staff', 'individual practice']
    },
    {
        type: 'organization',
        icon: OrgTypeIcon,
        title: 'Organization',
        description:
            'For clinics or medical centers with multiple offices and specialist teams. Centralized management of schedules, staff, and finances.',
        recomend: false,
        items: [
            { exist: true, value: 'Branches, offices, and staff in a unified system' },
            { exist: true, value: 'Flexible scheduling for doctors and rooms' },
            { exist: true, value: 'Medical records, treatment plans, and consent forms' },
            { exist: true, value: 'Accounting for payments, expenses, and inventory' },
            { exist: true, value: 'Role-based access and permissions for staff' },
            { exist: false, value: 'Voice assistant DL Assistant' }
        ],
        fotterItems: ['1+ offices', 'staff', 'role and permission management']
    }
]

export const CreateOrganization = () => {
    const [activeMode, setActiveMode] = useState<TMode | null>(null)

    return (
        <div className='flex min-h-screen w-full flex-col'>
            <Header user={mockUser} />
            <main className='flex flex-1 flex-col gap-4 p-2'>
                <header className='flex flex-col items-center gap-2'>
                    <h1 className='text-text text-h3 text-center font-medium'>Organization Setup</h1>
                    <p className='text-text-secondary text-p flex max-w-[700px] flex-col items-center px-5 text-center'>
                        Choose your work format: individual practice or clinic. This will determine role, access, staff,
                        scheduling, and financial management settings. You can change this later.
                    </p>
                </header>

                <div className='flex flex-1 justify-center'>
                    <div className='flex w-full flex-col items-center gap-4'>
                        <div className='flex w-full justify-center gap-4'>
                            {plans.map(plan => {
                                const isSelected = plan.type === activeMode
                                return (
                                    <Card
                                        key={plan.type}
                                        className={cn(
                                            'hover:border-primary/40 hover:bg-hover flex h-fit w-[480px] max-w-[480px] flex-col gap-2 border-2 border-transparent p-2 transition-all duration-300 ease-in-out',
                                            { 'border-primary hover:border-primary hover:bg-card': isSelected }
                                        )}
                                        onClick={() => setActiveMode(plan.type)}
                                    >
                                        <CardHeader className='gap-2 p-0'>
                                            <div className='flex gap-2'>
                                                <plan.icon className='h-[80px] min-w-[46px]' />
                                                <div className='flex flex-col gap-1'>
                                                    <div className='flex h-5 gap-2'>
                                                        <CardTitle className='text-text text-h5 w-full !leading-5'>
                                                            {plan.title}
                                                        </CardTitle>
                                                        <CardAction>
                                                            {plan.recomend && !isSelected ? (
                                                                <Badge className='border-ettention bg-ettention/20 text-ettention hover:bg-ettention/20 px-2 py-0'>
                                                                    Recommend
                                                                </Badge>
                                                            ) : (
                                                                isSelected && (
                                                                    <Badge className='border-primary bg-primary/20 text-primary hover:bg-primary/20 gap-2 px-2 py-0'>
                                                                        {/* <Check className='stroke-primary size-4' /> */}
                                                                        Selected
                                                                    </Badge>
                                                                )
                                                            )}
                                                        </CardAction>
                                                    </div>
                                                    <CardDescription className='text-text-secondary text-p-xs p-0'>
                                                        {plan.description}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className='border-border/10 border-y p-2'>
                                            <ul className='w-full'>
                                                {plan.items.map((item, idx) => {
                                                    const Icon = item.exist ? Check : X
                                                    return (
                                                        <li key={idx} className='flex items-center gap-2'>
                                                            <span className='size-4 min-w-4'>
                                                                <Icon
                                                                    className={cn(
                                                                        'size-4',
                                                                        item.exist
                                                                            ? 'stroke-primary'
                                                                            : 'stroke-destructive'
                                                                    )}
                                                                />
                                                            </span>
                                                            <span
                                                                className={cn(
                                                                    'text-text-secondary text-p-xs',
                                                                    item.exist
                                                                        ? 'text-text-secondary'
                                                                        : 'text-text-tertiary'
                                                                )}
                                                            >
                                                                {item.value}
                                                            </span>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </CardContent>
                                        <CardFooter className='flex items-center gap-2 p-0'>
                                            <div className='flex w-full items-center gap-2 pl-3.5'>
                                                {plan.fotterItems.map((item, idx) => {
                                                    const isLastIdx = plan.fotterItems.length - 1 === idx
                                                    return (
                                                        <div key={idx} className='flex w-fit items-center gap-2'>
                                                            <p className='text-text-secondary text-p-xs'>{item}</p>
                                                            {!isLastIdx && (
                                                                <span className='bg-text-secondary size-1 min-w-1 rounded-full' />
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <span className='flex size-4 min-w-4 items-center justify-center'>
                                                <ChevronRight className='stroke-text-secondary size-3' />
                                            </span>
                                        </CardFooter>
                                    </Card>
                                )
                            })}
                        </div>
                        <footer className='flex w-fit'>
                            <Link href={PATHS.dashboard()} className={buttonVariants({ variant: 'outline' })}>
                                Cancel
                            </Link>
                        </footer>
                    </div>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.145Z*
