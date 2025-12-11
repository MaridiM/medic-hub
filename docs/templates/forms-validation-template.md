# Шаблон форм и валидации

Этот документ содержит примеры и шаблоны для создания форм с валидацией, основанные на реализации из `apps/web`.

## Структура

### 1. Схемы валидации (Zod)

**Структура файлов:** `src/modules/{module}/shared/schemas/{form-name}.schema.ts`

**Пример простой схемы:** `src/modules/auth/shared/schemas/login-form.schema.ts`

```typescript
import { z } from 'zod'

import { type TLoginTranslation } from '../libs/i18n'

export function makeLoginFormSchema(t: TLoginTranslation) {
    return z.object({
        email: z
            .string()
            .nonempty({ message: t('validation.required', { field: t('inputs.email.label') }) })
            .pipe(z.email({ message: t('validation.invalidEmail') })),
        password: z
            .string()
            .nonempty({ message: t('validation.required', { field: t('inputs.password.label') }) })
            .min(8, { message: t('validation.minLength', { min: 8 }) })
    })
}

export function makeOtpFormSchema(t: TLoginTranslation) {
    return z.object({
        code: z.string().min(6, { message: t('validation.minLength', { min: 6 }) })
    })
}

export type TLoginFormSchema = z.infer<ReturnType<typeof makeLoginFormSchema>>
export type TOtpFormSchema = z.infer<ReturnType<typeof makeOtpFormSchema>>
```

**Пример схемы с валидацией телефона:** `src/modules/auth/shared/schemas/create-account-form.schema.ts`

```typescript
import { z } from 'zod'

import { type TCreateAccountTranslation } from '../libs/i18n'

export function makeCreateAccountFormSchema(t: TCreateAccountTranslation) {
    return z.object({
        fullName: z.string().nonempty({ message: t('validation.required', { field: t('inputs.fullName.label') }) }),

        email: z
            .string()
            .nonempty({ message: t('validation.required', { field: t('inputs.email.label') }) })
            .pipe(z.email({ message: t('validation.invalidEmail') })),

        phone: z
            .string()
            .nonempty({ message: t('validation.required', { field: t('inputs.phone.label') }) })
            .regex(/^\+[1-9]\d{1,14}$/, { message: t('validation.invalidPhone') })
    })
}

export type TCreateAccountFormSchema = z.infer<ReturnType<typeof makeCreateAccountFormSchema>>
```

**Пример схемы с кастомной валидацией (сравнение паролей):** `src/modules/auth/shared/schemas/password-form.schema.ts`

```typescript
import { z } from 'zod'

import { type TCreateAccountTranslation } from '../libs/i18n'

export function makePasswordFormSchema(t: TCreateAccountTranslation) {
    return z
        .object({
            password: z
                .string()
                .nonempty({ message: t('validation.required', { field: t('inputs.password.label') }) })
                .min(8, { message: t('validation.minLength', { min: 8 }) }),

            confirmPassword: z
                .string()
                .nonempty({ message: t('validation.required', { field: t('inputs.confirmPassword.label') }) })
                .min(8, { message: t('validation.minLength', { min: 8 }) })
        })
        .refine(data => data.password === data.confirmPassword, {
            message: t('validation.passwordsDoNotMatch'),
            path: ['confirmPassword'] // point validation error to the confirmPassword field
        })
}

export type TPasswordFormSchema = z.infer<ReturnType<typeof makePasswordFormSchema>>
```

**Экспорт схем:** `src/modules/{module}/shared/schemas/index.ts`

```typescript
export * from './login-form.schema'
export * from './create-account-form.schema'
export * from './password-form.schema'
export * from './reset-pasword-form.schema'
```

### 2. Хук автоматической валидации

**Файл:** `src/packages/hooks/use-auto-validation-form.ts`

```typescript
import { RefObject, useEffect, useRef } from 'react'
import { FieldValues, Path, UseFormReturn, useWatch } from 'react-hook-form'

export function useAutoValidateForm<T extends FieldValues>(
    form: UseFormReturn<T>,
    fieldNames: (keyof T)[],
    options?: {
        delay?: number
        suppressRef?: RefObject<boolean>
        validateEmpty?: boolean // валидировать ли пустые поля
    }
) {
    const { delay = 300, suppressRef, validateEmpty = false } = options || {}

    // Следим за значениями полей
    const watchedValues = useWatch({
        control: form.control,
        name: fieldNames as Path<T>[]
    }) as unknown as any[]

    // Стабильная ссылка на fieldNames
    const fieldNamesRef = useRef(fieldNames)
    fieldNamesRef.current = fieldNames

    // Таймер для debounce
    const timerRef = useRef<number | null>(null)

    useEffect(() => {
        // Очищаем предыдущий таймер
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current)
        }

        // Проверяем suppress ДО запуска таймера
        if (suppressRef?.current) {
            return
        }

        // Запускаем отложенную валидацию
        timerRef.current = window.setTimeout(() => {
            // Проверяем suppress еще раз перед валидацией
            if (suppressRef?.current) {
                return
            }

            const toValidate: (keyof T)[] = []

            fieldNamesRef.current.forEach((name, i) => {
                const val = watchedValues[i]

                // Определяем, пустое ли значение
                const isEmpty =
                    val === undefined || val === null || val === '' || (typeof val === 'string' && val.trim() === '')

                // Добавляем в список для валидации
                if (validateEmpty || !isEmpty) {
                    toValidate.push(name)
                }
            })

            // Триггерим валидацию вне цикла рендера
            if (toValidate.length > 0) {
                // Используем queueMicrotask для гарантированного выхода из рендера
                queueMicrotask(() => {
                    form.trigger(toValidate as Path<T>[])
                })
            }
        }, delay)

        // Cleanup
        return () => {
            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current)
            }
        }
    }, [watchedValues, delay, form]) // Минимальные зависимости

    // Утилита для отмены ожидающей валидации
    const cancel = () => {
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current)
            timerRef.current = null
        }
    }

    return { cancel }
}
```

### 3. Компоненты формы (shadcn/ui)

**Файл:** `src/packages/components/shared/ui/form.tsx`

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

### 4. Простая форма с одним полем

**Пример:** `src/modules/auth/features/forms/reset-password-form.tsx`

```typescript
'use client'

import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { ComponentProps, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ResetPasswordDocument } from '@/packages/api/graphql'
import {
    Button,
    CardContent,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input
} from '@/packages/components'
import { PATHS } from '@/packages/config'
import { useAutoValidateForm } from '@/packages/hooks'
import { useTranslations } from '@/packages/libs/i18n'

import { TResetPasswordFormSchema, makeResetPasswordFormSchema } from '@/auth/shared/schemas'

interface IProps extends ComponentProps<typeof CardContent> {
    setStatusPage: (statusPage: TStatus | null) => void
}

export const ResetPasswordForm = ({ setStatusPage }: IProps) => {
    const router = useRouter()
    const t = useTranslations('auth.resetPassword')
    const resetPasswordFormSchema = useMemo(() => makeResetPasswordFormSchema(t), [t])

    const [_resetPassword, { loading: resetPasswordLoading }] = useMutation(ResetPasswordDocument)

    // RHF form hook with Zod resolver for schema validation.
    const form = useForm<TResetPasswordFormSchema>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: { email: '' },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })

    // Автоматическая валидация при изменении поля
    useAutoValidateForm(form, ['email'])

    const { isValid } = form.formState

    const onSubmit = useCallback(
        async ({ email }: TResetPasswordFormSchema) => {
            const response = await _resetPassword({
                variables: { data: { email } }
            })

            if (response.error && response.error.message) {
                toast.error(response.error.message)
                return
            }

            if (!response.data?.resetPassword) {
                setStatusPage('failed')
                return
            }

            setStatusPage('success')
            setTimeout(() => {
                form.reset()
            }, 500)
        },
        [form, setStatusPage, _resetPassword]
    )

    return (
        <CardContent className='flex flex-col gap-6'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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

                    <Button
                        type='submit'
                        variant='primary'
                        className='mt-6 w-full'
                        disabled={!isValid || resetPasswordLoading}
                    >
                        {t('form.submit')}
                    </Button>
                </form>
            </Form>
        </CardContent>
    )
}
```

### 5. Форма с несколькими полями

**Пример:** `src/modules/auth/features/forms/contact-form.tsx`

```typescript
import React, { ComponentProps, PropsWithChildren } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { FormControl, FormItem, FormLabel, FormMessage, Input, PhoneInput, Form, FormField } from '@/packages/components'

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

### 6. Форма с паролем и подтверждением

**Пример:** `src/modules/auth/features/forms/password-form.tsx`

```typescript
'use client'

import { Eye, EyeOff } from 'lucide-react'
import { ComponentProps, PropsWithChildren, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/packages/components'

import { type TCreateAccountTranslation } from '@/auth/shared/libs/i18n'
import { TPasswordFormSchema } from '@/auth/shared/schemas'

interface IProps extends PropsWithChildren<Omit<ComponentProps<'form'>, 'onSubmit'>> {
    form: UseFormReturn<TPasswordFormSchema>
    onSubmit: (data: TPasswordFormSchema) => void
    t: TCreateAccountTranslation
}

export const PasswordForm = ({ children, form, onSubmit, t, ...props }: IProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <Form key='password-form' {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4' {...props}>
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('inputs.password.label')}</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <Input
                                        id='password'
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder={t('inputs.password.placeholder')}
                                        className='pr-14'
                                        autoComplete='off'
                                        {...field}
                                    />
                                    <Button
                                        type='button'
                                        className='absolute top-0 right-0 size-10 h-full min-w-10 rounded-l-none bg-transparent hover:bg-transparent'
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <Eye className='!size-4' /> : <EyeOff className='!size-4' />}
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage className='!text-p-xs text-destructive' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('inputs.confirmPassword.label')}</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <Input
                                        id='confirmPassword'
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder={t('inputs.confirmPassword.placeholder')}
                                        className='pr-14'
                                        autoComplete='off'
                                        {...field}
                                    />
                                    <Button
                                        type='button'
                                        className='absolute top-0 right-0 size-10 h-full min-w-10 rounded-l-none bg-transparent hover:bg-transparent'
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <Eye className='!size-4' />
                                        ) : (
                                            <EyeOff className='!size-4' />
                                        )}
                                    </Button>
                                </div>
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

### 7. Комплексная форма с несколькими шагами

**Пример:** `src/modules/auth/features/forms/create-account-form.tsx`

```typescript
'use client'

import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { CreateAccountDocument } from '@/packages/api/graphql'
import { Button, CardContent } from '@/packages/components'
import { PATHS } from '@/packages/config'
import { useAutoValidateForm } from '@/packages/hooks'
import { useTranslations } from '@/packages/libs/i18n'

import { FormLink, Social } from '@/auth/shared/components'
import { useAuthStore } from '@/auth/shared/libs/store'
import {
    TCreateAccountFormSchema,
    TPasswordFormSchema,
    makeCreateAccountFormSchema,
    makePasswordFormSchema
} from '@/auth/shared/schemas'

import { ContactForm } from './contact-form'
import { PasswordForm } from './password-form'

export const CreateAccountForm = () => {
    const t = useTranslations('auth.createAccount')
    const router = useRouter()

    const { passwordStep, setPasswordStep } = useAuthStore()

    const [_createAccount, { loading: createAccountLoading }] = useMutation(CreateAccountDocument)

    // Создаем схемы с мемоизацией для оптимизации
    const contactSchema = useMemo(() => makeCreateAccountFormSchema(t), [t])
    const passwordSchema = useMemo(() => makePasswordFormSchema(t), [t])

    // Форма контактной информации
    const contactForm = useForm<TCreateAccountFormSchema>({
        resolver: zodResolver(contactSchema),
        defaultValues: { fullName: '', email: '', phone: '' },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })

    // Форма пароля
    const passwordForm = useForm<TPasswordFormSchema>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { password: '', confirmPassword: '' },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })

    // Автоматическая валидация полей
    useAutoValidateForm(contactForm, ['email', 'fullName', 'phone'])
    useAutoValidateForm(passwordForm, ['password', 'confirmPassword'])

    const { isValid: validContact } = contactForm.formState
    const { isValid: validPassword } = passwordForm.formState

    // Обработчик отправки формы
    const onSubmit = useCallback(
        async (data: TPasswordFormSchema) => {
            try {
                // Объединяем данные из обеих форм
                const response = await _createAccount({
                    variables: {
                        data: {
                            ...contactForm.getValues(),
                            password: data.password
                        }
                    }
                })

                if (response.error?.message) {
                    toast.error(response.error.message)
                    return
                }

                if (response.data?.createAccount.id) {
                    router.push(PATHS.dashboard())
                    contactForm.reset()
                    passwordForm.reset()
                    return
                }
            } catch (error) {
                console.error('Account creation failed:', error)
            }
        },
        [_createAccount, contactForm, passwordForm, router]
    )

    // Переход к следующему шагу
    const handleNextStep = useCallback(async () => {
        const isValid = await contactForm.trigger()
        if (isValid) {
            setPasswordStep(true)
        }
    }, [contactForm, setPasswordStep])

    return (
        <CardContent key='create-account-form' className='flex flex-col gap-6'>
            {!passwordStep && <Social t={t} />}

            {passwordStep ? (
                <PasswordForm form={passwordForm} onSubmit={onSubmit} t={t}>
                    <div className='mt-6 flex flex-col gap-6'>
                        <Button
                            type='submit'
                            variant='primary'
                            className='w-full'
                            disabled={!validPassword || createAccountLoading}
                        >
                            {createAccountLoading ? t('form.submiting') : t('form.submit')}
                        </Button>
                        <Button
                            type='button'
                            variant='ghost'
                            className='w-full'
                            onClick={() => setPasswordStep(false)}
                            disabled={createAccountLoading}
                        >
                            {t('form.back')}
                        </Button>
                    </div>
                </PasswordForm>
            ) : (
                <ContactForm form={contactForm} t={t}>
                    <Button
                        type='button'
                        variant='primary'
                        className='mt-6 w-full'
                        onClick={handleNextStep}
                        disabled={!validContact}
                    >
                        {t('form.next')}
                    </Button>
                </ContactForm>
            )}

            <FormLink
                href={PATHS.auth()}
                text={t('form.haveAccount')}
                buttonText={t('form.signIn')}
                onClick={() => {
                    setTimeout(() => {
                        contactForm.reset()
                        passwordForm.reset()
                    }, 500)
                    setPasswordStep(false)
                }}
            />
        </CardContent>
    )
}
```

### 8. Настройки формы (useForm)

**Рекомендуемые настройки:**

```typescript
const form = useForm<TSchema>({
    resolver: zodResolver(schema),
    defaultValues: { /* начальные значения */ },
    mode: 'onTouched', // валидация при потере фокуса
    reValidateMode: 'onChange', // повторная валидация при изменении
    shouldFocusError: false // отключить автофокус на ошибку (опционально)
})
```

**Режимы валидации:**
- `mode: 'onTouched'` - валидация при потере фокуса (рекомендуется)
- `mode: 'onChange'` - валидация при каждом изменении
- `mode: 'onBlur'` - валидация только при потере фокуса
- `mode: 'onSubmit'` - валидация только при отправке
- `mode: 'all'` - валидация во всех случаях

**reValidateMode:**
- `'onChange'` - повторная валидация при изменении (рекомендуется)
- `'onBlur'` - повторная валидация при потере фокуса
- `'onSubmit'` - повторная валидация только при отправке

### 9. Паттерны валидации Zod

**Базовые валидации:**

```typescript
// Обязательное поле
z.string().nonempty({ message: 'Поле обязательно' })

// Минимальная длина
z.string().min(8, { message: 'Минимум 8 символов' })

// Максимальная длина
z.string().max(100, { message: 'Максимум 100 символов' })

// Email
z.string().email({ message: 'Неверный email' })

// Регулярное выражение
z.string().regex(/^\+[1-9]\d{1,14}$/, { message: 'Неверный формат телефона' })

// Число
z.number().min(0, { message: 'Число должно быть положительным' })
z.number().max(100, { message: 'Число не должно превышать 100' })

// Булево значение
z.boolean()

// Дата
z.date()

// Массив
z.array(z.string())

// Объект
z.object({ field: z.string() })
```

**Кастомная валидация:**

```typescript
// refine - для сложной валидации
z.object({
    password: z.string(),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'] // указать поле с ошибкой
})

// superRefine - для множественных ошибок
z.string().superRefine((val, ctx) => {
    if (val.length < 8) {
        ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            minimum: 8,
            type: 'string',
            inclusive: true,
            message: 'Минимум 8 символов'
        })
    }
    if (!/[A-Z]/.test(val)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Должна быть заглавная буква'
        })
    }
})

// transform - для преобразования данных
z.string().transform(val => val.trim().toLowerCase())

// pipe - для цепочки валидаций
z.string()
    .nonempty({ message: 'Обязательно' })
    .pipe(z.email({ message: 'Неверный email' }))
```

### 10. Зависимости

**package.json dependencies:**

```json
{
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "react-hook-form": "^7.62.0",
    "zod": "^4.1.9"
  }
}
```

## Шаги для создания формы в новом модуле

1. **Создать схему валидации** (`src/modules/{module}/shared/schemas/{form-name}.schema.ts`):
   - Импортировать `z` из `zod`
   - Создать функцию `make{FormName}Schema` с параметром `t` (переводы)
   - Экспортировать тип `T{FormName}Schema`

2. **Создать компонент формы** (`src/modules/{module}/features/forms/{form-name}.tsx`):
   - Импортировать `useForm` из `react-hook-form`
   - Импортировать `zodResolver` из `@hookform/resolvers/zod`
   - Импортировать компоненты формы из `@/packages/components`
   - Создать форму с `useForm` и `zodResolver`
   - Использовать `useAutoValidateForm` для автоматической валидации
   - Обернуть поля в `FormField` с `render` prop

3. **Использовать форму:**
   - Обернуть форму в `<Form {...form}>`
   - Использовать `form.handleSubmit(onSubmit)` для обработки отправки
   - Проверять `form.formState.isValid` для состояния валидности
   - Использовать `form.reset()` для сброса формы

## Важные моменты

- **Все схемы должны быть функциями**, принимающими `t` (переводы) для интернационализации
- **Используйте `useMemo`** для мемоизации схем при изменении переводов
- **Автоматическая валидация** через `useAutoValidateForm` с debounce 300ms по умолчанию
- **Режим валидации:** `mode: 'onTouched'` + `reValidateMode: 'onChange'` для лучшего UX
- **Обработка ошибок:** проверяйте `response.error` после мутаций
- **Типобезопасность:** используйте `z.infer<ReturnType<typeof makeSchema>>` для типов
- **Кастомная валидация:** используйте `.refine()` для сложных проверок
- **Путь ошибки:** указывайте `path` в `.refine()` для привязки ошибки к конкретному полю
- **Многошаговые формы:** используйте несколько форм и объединяйте данные через `getValues()`

