import { useEffect } from 'react'
import { FieldValues, Path, UseFormReturn, useWatch } from 'react-hook-form'

import { useDebouncedCallback } from '@/packages/hooks'

export function useAutoValidateForm<T extends FieldValues>(
    form: UseFormReturn<T>,
    fieldNames: (keyof T)[],
    delay = 100
) {
    const triggerDebounced = useDebouncedCallback((names: (keyof T)[]) => {
        form.trigger(names as Path<T>[])
    }, delay)

    const watchedValues = useWatch({
        control: form.control,
        name: fieldNames as Path<T>[]
    }) as unknown as any[]

    useEffect(() => {
        const toTrigger: (keyof T)[] = []
        const toClear: (keyof T)[] = []

        fieldNames.forEach((name, i) => {
            const val = watchedValues[i]
            const state = form.getFieldState(name as Path<T>)
            const hasErr = !!form.formState.errors[name]
            const nonEmpty = typeof val === 'string' ? val.trim() !== '' : val != null

            if (nonEmpty) {
                // Перезапускаем валидацию непустых полей
                toTrigger.push(name)
            } else {
                // Если поле пустое...
                if (state.isTouched || state.isDirty) {
                    // ...и пользователь его тронул или пытался отправить — оставляем required‑ошибку
                    // (ничего не делаем, чтобы сообщение осталось)
                } else if (hasErr) {
                    // ...а пользователь ещё не трогал — можно убирать прошлую ошибку (например, после reset)
                    toClear.push(name)
                }
            }
        })

        if (toClear.length) {
            form.clearErrors(toClear as Path<T>[])
        }
        if (toTrigger.length) {
            triggerDebounced(toTrigger)
        }
        // Депсы: watchedValues, form.formState.errors, triggerDebounced, fieldNames
    }, [watchedValues, form.formState.errors, triggerDebounced, fieldNames, form])
}
