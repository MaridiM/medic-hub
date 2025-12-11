# File: modules\auth\features\forms\contact-form.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/features/forms/contact-form.tsx`

## Category
Frontend

## File Type
TSX (contact-form.tsx)

## Size
3031 characters, 70 lines

## Full Code

```typescript
import React, { ComponentProps, PropsWithChildren } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { FormControl, FormItem, FormLabel, FormMessage, Input, PhoneInput } from '@/packages/components'
import { Form } from '@/packages/components'
import { FormField } from '@/packages/components'

import { type TCreateAccountTranslation } from '@/auth/shared/libs/i18n'
import { TCreateAccountFormSchema } from '@/auth/shared/schemas'

interface IProps extends PropsWithChildren<Omit<ComponentProps<'form'>, 'onSubmit'>> {
    form: UseFormReturn<TCreateAccountFormSchema>
    t: TCreateAccountTranslation
}

export const ContactForm = ({ children, form, t, ...props }: IProps) => {
    return (
        <Form key='contact-info-form' {...form}>
            <form className='space-y-4' {...props}>
                <FormField
                    control={form.control}
                    name='fullName'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('inputs.fullName.label')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('inputs.fullName.placeholder')} autoComplete='name' {...field} />
                            </FormControl>
                            <FormMessage className='!text-p-xs text-destructive' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('inputs.email.label')}</FormLabel>
                            <FormControl>
                                <Input
                                    type='email'
                                    placeholder={t('inputs.email.placeholder')}
                                    autoComplete='email'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className='!text-p-xs text-destructive' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='phone'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('inputs.phone.label')}</FormLabel>
                            <FormControl>
                                <PhoneInput placeholder={t('inputs.phone.placeholder')} autoComplete='tel' {...field} />
                            </FormControl>
                            <FormMessage className='!text-p-xs text-destructive' />
                        </FormItem>
                    )}
                />

                {children}
            </form>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.901Z*
