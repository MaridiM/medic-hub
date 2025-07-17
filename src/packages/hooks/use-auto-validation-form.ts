import { useEffect } from 'react'
import { FieldValues, Path, UseFormReturn, useWatch } from 'react-hook-form'

import { useDebouncedCallback } from '@/packages/hooks'

export function useAutoValidateForm<T extends FieldValues>(
    form: UseFormReturn<T>,
    fieldNames: (keyof T)[],
    delay = 100
) {
    // 1) Обязательно вызываем этот хук на верхнем уровне
    const triggerDebounced = useDebouncedCallback((names: (keyof T)[]) => {
        form.trigger(names as Path<T>[])
    }, delay)

    // 2) Слежка за нужными полями
    const watchedValues = useWatch({
        control: form.control,
        name: fieldNames as Path<T>[]
    }) as unknown as any[]

    useEffect(() => {
        const toTrigger: (keyof T)[] = []
        const toClear: (keyof T)[] = []

        fieldNames.forEach((name, i) => {
            const val = watchedValues[i]
            const hasErr = !!form.formState.errors[name]
            const nonEmpty = typeof val === 'string' ? val.trim() !== '' : val != null

            if (nonEmpty) {
                toTrigger.push(name)
            } else if (hasErr) {
                toClear.push(name)
            }
        })

        if (toClear.length) {
            form.clearErrors(toClear as Path<T>[])
        }
        if (toTrigger.length) {
            triggerDebounced(toTrigger)
        }
        // В зависимостях — watchedValues и клир/триггер хуки
    }, [watchedValues, form.formState.errors, triggerDebounced, fieldNames])
}
