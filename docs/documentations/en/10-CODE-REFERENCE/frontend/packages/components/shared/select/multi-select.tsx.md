# File: packages\components\shared\select\multi-select.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/shared/select/multi-select.tsx`

## Category
Frontend

## File Type
TSX (multi-select.tsx)

## Size
5423 characters, 138 lines

## Full Code

```typescript
'use client'

import { ChevronDown, X } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/packages/utils'

import {
    Checkbox,
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
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    searchable?: boolean
    clearable?: boolean
    className?: string
}

// база — как у Input
const inputBaseClasses =
    'border-border/20 bg-card text-p-sm placeholder:text-muted-foreground md:text-p-sm ' +
    'flex h-10 w-full items-center overflow-hidden rounded-md border px-4 py-2 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ' +
    'disabled:cursor-not-allowed disabled:opacity-50'

export function MultiSelect({
    options,
    value,
    onChange,
    placeholder = 'Select options...',
    searchPlaceholder = 'Search...',
    emptyText = 'Nothing found',
    searchable = false,
    clearable = false,
    className
}: IProps) {
    const [open, setOpen] = useState(false)

    const toggleOption = (optionValue: string) => {
        const newValue = value.includes(optionValue)
            ? value.filter(item => item !== optionValue)
            : [...value, optionValue]
        onChange(newValue)
    }

    const clearAll = () => onChange([])

    const getSelectedLabels = () =>
        value
            .map(val => options.find(opt => opt.value === val)?.label)
            .filter(Boolean)
            .join(', ')

    const showClearButton = clearable && value.length > 0 && !open

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {/* ВАЖНО: div, НЕ button. Radix сам сделает его триггером */}
                <div className={cn(inputBaseClasses, 'cursor-pointer justify-between gap-2', className)}>
                    <div className='flex min-w-0 flex-1 overflow-hidden text-left'>
                        {value.length > 0 ? (
                            <span className='text-text truncate text-sm'>{getSelectedLabels()}</span>
                        ) : (
                            <span className='text-text-tertiary truncate text-sm'>{placeholder}</span>
                        )}
                    </div>
                    <div className='flex w-fit flex-shrink-0 items-center overflow-hidden'>
                        {clearable && showClearButton && (
                            <button
                                type='button'
                                className='flex h-5 w-5 items-center justify-center rounded-full p-0.5 transition-all duration-200 ease-in-out outline-none'
                                onMouseDown={e => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                }}
                                onClick={e => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    clearAll()
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
                                clearable && showClearButton && 'ml-1',
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
                            const isSelected = value.includes(option.value)
                            return (
                                <CommandItem
                                    key={option.value}
                                    value={option.label}
                                    onSelect={() => toggleOption(option.value)}
                                    className='cursor-pointer'
                                >
                                    <Checkbox checked={isSelected} className='mr-2' />
                                    <span>{option.label}</span>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.254Z*
