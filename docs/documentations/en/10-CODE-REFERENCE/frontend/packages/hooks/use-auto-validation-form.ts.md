# File: packages\hooks\use-auto-validation-form.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/hooks/use-auto-validation-form.ts`

## Category
Frontend

## File Type
TS (use-auto-validation-form.ts)

## Size
2684 characters, 88 lines

## Full Code

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

## Description

This file is part of the MedicHub Frontend (Next.js) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.607Z*
