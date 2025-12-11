# File: packages\components\shared\select\preset-or-custom-input.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/shared/select/preset-or-custom-input.tsx`

## Category
Frontend

## File Type
TSX (preset-or-custom-input.tsx)

## Size
2177 characters, 75 lines

## Full Code

```typescript
'use client'

import { AnimatePresence, motion } from 'framer-motion'

import { Input, SingleSelect } from '@/packages/components'

import { Option } from './types'

interface IProps {
    mode: 'preset' | 'custom'
    value: string
    onChange: (value: string) => void

    options: Option[]
    selectPlaceholder?: string
    selectEmptyText?: string

    inputPlaceholder?: string
    inputType?: 'text' | 'number'
    min?: number
    max?: number
}

export function PresetOrCustomInput({
    mode,
    value,
    onChange,
    options,
    selectPlaceholder = 'Select option...',
    selectEmptyText = 'Nothing found',
    inputPlaceholder = 'Enter value',
    inputType = 'text',
    min,
    max
}: IProps) {
    return (
        <AnimatePresence mode='wait'>
            {mode === 'preset' ? (
                <motion.div
                    key='preset'
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                >
                    <SingleSelect
                        options={options}
                        value={value}
                        onChange={onChange}
                        placeholder={selectPlaceholder}
                        emptyText={selectEmptyText}
                    />
                </motion.div>
            ) : (
                <motion.div
                    key='custom'
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                >
                    <Input
                        type={inputType}
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        placeholder={inputPlaceholder}
                        min={min}
                        max={max}
                    />
                </motion.div>
            )}
        </AnimatePresence>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.256Z*
