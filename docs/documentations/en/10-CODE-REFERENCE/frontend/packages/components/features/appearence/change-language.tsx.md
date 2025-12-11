# File: packages\components\features\appearence\change-language.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/features/appearence/change-language.tsx`

## Category
Frontend

## File Type
TSX (change-language.tsx)

## Size
4441 characters, 108 lines

## Full Code

```typescript
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale } from 'next-intl'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'

import {
    Form,
    FormField,
    FormItem,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/packages/components'
import { languages, setLanguage } from '@/packages/libs/i18n'
import { type TChangeLanguageSchema, changeLanguageSchema } from '@/packages/schemas'
import { cn } from '@/packages/utils'

interface IProps {
    className?: string
}

export function ChangeLanguage({ className }: IProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPanding, startTransition] = useTransition()
    const locale = useLocale()

    const form = useForm<TChangeLanguageSchema>({
        resolver: zodResolver(changeLanguageSchema)
    })

    function onSubmit(data: TChangeLanguageSchema) {
        startTransition(async () => {
            try {
                await setLanguage(data.language)
            } catch (error) {
                console.log(error)
            }
        })
    }

    return (
        <Form {...form}>
            <FormField
                control={form.control}
                name='language'
                render={({ field }) => (
                    <FormItem>
                        <Select
                            onValueChange={value => {
                                field.onChange(value)
                                form.handleSubmit(onSubmit)()
                            }}
                            open={isOpen}
                            onOpenChange={setIsOpen}
                        >
                            <SelectTrigger
                                className={cn(
                                    'hover:bg-hover !text-text w-10 items-center justify-center border-none px-1.5 font-normal shadow-none transition-colors duration-300 ease-in-out disabled:opacity-75 data-[size=default]:h-10 dark:bg-transparent',
                                    {
                                        'bg-card dark:bg-card shadow-sm': isOpen
                                    },
                                    className
                                )}
                                arrow={false}
                                disabled={isPanding}
                            >
                                <span className='!text-text'>{locale.toLocaleUpperCase()}</span>
                            </SelectTrigger>
                            <SelectContent
                                classNameViewport='flex flex-col gap-0.5'
                                className='min-w-[1rem]'
                                align='center'
                            >
                                {languages.map(language => {
                                    const currentLanguage = language === (locale ?? 'en')

                                    return (
                                        <SelectItem
                                            key={language}
                                            value={language}
                                            disabled={isPanding}
                                            icon={false}
                                            className={cn('flex w-full items-center justify-center px-0', {
                                                'bg-hover hover:!bg-hover': currentLanguage
                                            })}
                                        >
                                            <span
                                                className={cn('text-text', {
                                                    'text-primary-500 dark:text-primary-300': currentLanguage
                                                })}
                                            >
                                                {language.toLocaleUpperCase()}
                                            </span>
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}
            />
        </Form>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.226Z*
