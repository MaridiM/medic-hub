# File: packages\components\shared\ui\form.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/shared/ui/form.tsx`

## Category
Frontend

## File Type
TSX (form.tsx)

## Size
4189 characters, 149 lines

## Full Code

```typescript
'use client'

import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import { ComponentProps, createContext, useContext, useId, useMemo } from 'react'
import {
    Controller,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
    FormProvider,
    useFormContext
} from 'react-hook-form'

import { Label } from '@/packages/components/shared/ui/label'
import { cn } from '@/packages/utils/index'

const Form = FormProvider

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
    name: TName
}

const FormFieldContext = createContext<FormFieldContextValue | undefined>(undefined)

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    ...props
}: ControllerProps<TFieldValues, TName>) => {
    // Memoize provider value to avoid creating a new object each render.
    const value = useMemo(() => ({ name: props.name } as FormFieldContextValue), [props.name])

    return (
        <FormFieldContext.Provider value={value}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    )
}

const useFormField = () => {
    const fieldContext = useContext(FormFieldContext)
    const itemContext = useContext(FormItemContext)

    // FIX: use only formState and getFieldState from the context
    const { getFieldState, formState } = useFormContext()

    if (!fieldContext) {
        throw new Error('useFormField should be used within <FormField>')
    }

    // FIX: read field state directly without additional hooks
    const fieldState = getFieldState(fieldContext.name, formState)

    const { id } = itemContext

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState
    }
}

type FormItemContextValue = {
    id: string
}

const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue)

function FormItem({ className, ...props }: ComponentProps<'div'>) {
    const id = useId()

    return (
        <FormItemContext.Provider value={{ id }}>
            <div data-slot='form-item' className={cn('grid gap-2', className)} {...props} />
        </FormItemContext.Provider>
    )
}

function FormLabel({ className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) {
    const { error, formItemId } = useFormField()

    return (
        <Label
            data-slot='form-label'
            data-error={!!error}
            className={cn('data-[error=true]:text-destructive', className)}
            htmlFor={formItemId}
            {...props}
        />
    )
}

function FormControl({ ...props }: ComponentProps<typeof Slot>) {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

    return (
        <Slot
            data-slot='form-control'
            id={formItemId}
            aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
            aria-invalid={!!error}
            {...props}
        />
    )
}

function FormDescription({ className, ...props }: ComponentProps<'p'>) {
    const { formDescriptionId } = useFormField()

    return (
        <p
            data-slot='form-description'
            id={formDescriptionId}
            className={cn('text-muted-foreground text-p-sm', className)}
            {...props}
        />
    )
}

function FormMessage({ className, ...props }: ComponentProps<'p'>) {
    const { error, formMessageId } = useFormField()
    const body = error ? String(error?.message ?? '') : props.children

    if (!body) {
        return null
    }

    return (
        <p
            data-slot='form-message'
            id={formMessageId}
            className={cn('text-destructive text-p-sm', className)}
            {...props}
        >
            {body}
        </p>
    )
}

export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField }

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.279Z*
