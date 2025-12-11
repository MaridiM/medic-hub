# File: packages\components\shared\select\single-select.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/shared/select/single-select.tsx`

## Category
Frontend

## File Type
TSX (single-select.tsx)

## Size
5426 characters, 135 lines

## Full Code

```typescript
'use client'

import { Check, ChevronDown, X } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/packages/utils'

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    Popover,
    PopoverContent,
    PopoverTrigger
} from '../ui'

import { Option } from './types'

interface IProps {
    options: Option[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    searchable?: boolean
    clearable?: boolean
    className?: string
}

const inputBaseClasses =
    'border-border/20 bg-card text-p-sm placeholder:text-muted-foreground md:text-p-sm ' +
    'flex h-10 w-full items-center overflow-hidden rounded-md border px-4 py-2 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ' +
    'disabled:cursor-not-allowed disabled:opacity-50'

export function SingleSelect({
    options,
    value,
    onChange,
    placeholder = 'Select option...',
    searchPlaceholder = 'Search...',
    emptyText = 'Nothing found',
    searchable = false,
    clearable = false,
    className
}: IProps) {
    const [open, setOpen] = useState(false)

    const handleSelect = (optionValue: string) => {
        onChange(optionValue)
        setOpen(false)
    }

    const clearValue = () => onChange('')

    const getSelectedLabel = () => options.find(opt => opt.value === value)?.label || ''

    const showClearButton = clearable && !!value && !open

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {/* тоже div, не button */}
                <div className={cn(inputBaseClasses, 'cursor-pointer justify-between gap-2', className)}>
                    <div className='flex min-w-0 flex-1 overflow-hidden text-left'>
                        {value ? (
                            <span className='text-text truncate text-sm'>{getSelectedLabel()}</span>
                        ) : (
                            <span className='text-text-tertiary truncate text-sm'>{placeholder}</span>
                        )}
                    </div>
                    <div className='flex flex-shrink-0 items-center gap-1'>
                        {clearable && (
                            <button
                                type='button'
                                className={cn(
                                    'flex h-5 w-5 items-center justify-center rounded-full p-0.5 outline-none',
                                    'transition-all duration-200 ease-in-out',
                                    showClearButton ? 'scale-100 opacity-100' : 'pointer-events-none scale-0 opacity-0'
                                )}
                                onMouseDown={e => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                }}
                                onClick={e => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    clearValue()
                                }}
                                tabIndex={-1}
                                aria-label='Clear selection'
                            >
                                <X className='h-3 w-3 flex-shrink-0 opacity-50 transition-opacity hover:opacity-100' />
                            </button>
                        )}
                        <ChevronDown
                            className={cn(
                                'h-4 w-4 flex-shrink-0 opacity-50 transition-transform duration-200',
                                open && 'rotate-180'
                            )}
                        />
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0' align='start'>
                <Command>
                    {searchable && <CommandInput placeholder={searchPlaceholder} />}
                    <CommandEmpty>{emptyText}</CommandEmpty>
                    <CommandGroup className='max-h-64 overflow-auto'>
                        {options.map(option => {
                            const isSelected = value === option.value
                            return (
                                <CommandItem
                                    key={option.value}
                                    value={option.label}
                                    onSelect={() => handleSelect(option.value)}
                                    className='cursor-pointer'
                                >
                                    <span className='w-full'>{option.label}</span>
                                    <div className='mr-2 flex h-4 w-4 items-center justify-center'>
                                        {isSelected && <Check className='stroke-primary size-4' />}
                                    </div>
                                </CommandItem>
                            )
                        })}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.258Z*
