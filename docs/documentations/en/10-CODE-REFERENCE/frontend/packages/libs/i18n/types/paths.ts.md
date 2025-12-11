# File: packages\libs\i18n\types\paths.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/libs/i18n/types/paths.ts`

## Category
Frontend

## File Type
TS (paths.ts)

## Size
3791 characters, 117 lines

## Full Code

```typescript
type Primitive = string | number | boolean | bigint | symbol | null | undefined | Date

type AnyFunction = (...args: any[]) => any

type IsPlainObject<T> = T extends object
    ? T extends readonly any[]
        ? false
        : T extends AnyFunction
          ? false
          : true
    : false

export type Join<A extends string, B extends string> = `${A}.${B}`

/**
 * Single digit type (0-9)
 */
type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

/**
 * Array indices generation (0-99)
 * Генерация индексов массива (0-99)
 */
type ArrayIndices =
    | Digit // 0-9
    | `1${Digit}` // 10-19
    | `2${Digit}` // 20-29
    | `3${Digit}` // 30-39
    | `4${Digit}` // 40-49
    | `5${Digit}` // 50-59
    | `6${Digit}` // 60-69
    | `7${Digit}` // 70-79
    | `8${Digit}` // 80-89
    | `9${Digit}` // 90-99

/**
 * Recursively generates all possible paths to object properties
 * Updated PathKeys with array support
 *
 * Рекурсивно генерирует все возможные пути к свойствам объекта
 * Обновленный PathKeys с поддержкой массивов
 *
 * @template T - Object to generate paths for
 * @example
 * type Obj = { user: { name: string, tags: string[] } }
 * type Paths = PathKeys<Obj>
 * // 'user' | 'user.name' | 'user.tags' | 'user.tags.0' | 'user.tags.1' | ...
 */
export type PathKeys<T> = T extends readonly any[]
    ? ArrayIndices // If array, return indices / Если массив, возвращаем индексы
    : T extends object
      ? {
            [K in Extract<keyof T, string>]: T[K] extends readonly any[]
                ? K | Join<K, ArrayIndices> // Array: add paths with indices / Массив: добавляем пути с индексами
                : IsPlainObject<T[K]> extends true
                  ? K | Join<K, PathKeys<T[K]>> // Object: recursion / Объект: рекурсия
                  : K // Primitive / Примитив
        }[Extract<keyof T, string>]
      : never

/**
 * Splits string path into array of segments
 * Разбивает строковый путь на массив сегментов
 *
 * @example Split<'a.b.c'> = ['a', 'b', 'c']
 */
type Split<S extends string> = S extends `${infer H}.${infer R}` ? [H, ...Split<R>] : [S]

/**
 * Gets type by array of path segments
 * Updated GetBySegments with numeric index support
 *
 * Получает тип по массиву сегментов пути
 * Обновленный GetBySegments с поддержкой числовых индексов
 */
type GetBySegments<T, Segs extends readonly string[]> = Segs extends [
    infer H extends string,
    ...infer R extends string[]
]
    ? H extends keyof T
        ? GetBySegments<T[H], R>
        : T extends readonly any[]
          ? H extends `${number}`
              ? GetBySegments<T[number], R> // Access array element / Доступ к элементу массива
              : never
          : never
    : T

/**
 * Gets type by string path
 * Получает тип по строковому пути
 *
 * @template T - Source object / Исходный объект
 * @template P - Path to property / Путь к свойству
 * @example GetByPath<{ user: { name: string } }, 'user.name'> = string
 */
export type GetByPath<T, P extends string> = P extends '' ? T : GetBySegments<T, Split<P>>

/**
 * Typed translation function
 * TypedT returns exact type
 * Supports autocomplete for keys and returns string or array of strings
 *
 * Типизированная функция перевода
 * TypedT возвращает точный тип
 * Поддерживает автодополнение ключей и возвращает строку или массив строк
 *
 * @template Scope - Translation scope / Область переводов
 * @example
 * const t: TypedT<AllMessages> = useTranslations()
 * t('auth.login.title') // string
 * t('auth.login.lines.0') // string
 */
export type TypedT<Scope> = {
    <K extends PathKeys<Scope>>(key: K, values?: Record<string, unknown>): GetByPath<Scope, K>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.727Z*
