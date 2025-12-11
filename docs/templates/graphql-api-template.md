# Шаблон выполнения GraphQL запросов к серверу

Этот документ содержит примеры и шаблоны для выполнения GraphQL запросов к серверу, основанные на реализации из `apps/web`.

## Структура

### 1. Конфигурация Apollo Client

**Файл:** `src/packages/libs/apollo/apollo-client.config.ts`

```typescript
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'
import { CombinedGraphQLErrors, CombinedProtocolErrors } from '@apollo/client/errors'
import { ErrorLink } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs'
import { createClient as createWsClient } from 'graphql-ws'

import { SERVER_URL, WEBSOCKET_URL } from '@/packages/constants'

const isBrowser = typeof window !== 'undefined'

/** HTTP link with upload (multipart) support */
const httpUploadLink = new UploadHttpLink({
    uri: SERVER_URL,
    credentials: 'include',
    headers: {
        'apollo-require-preflight': 'true'
    },
    fetchOptions: {
        credentials: 'include'
    }
}) as unknown as ApolloLink

/** WS link (browser only). On the server — null. */
const wsLink = isBrowser
    ? new GraphQLWsLink(
          createWsClient({
              url: WEBSOCKET_URL,
              // pass token/cookies if needed:
              // connectionParams: async () => ({ authorization: `Bearer ${token}` }),
              lazy: true,
              retryAttempts: 10,
              shouldRetry: () => true
          })
      )
    : null

/** Use WS for subscriptions, otherwise rely on HTTP only */
const link: ApolloLink = wsLink
    ? ApolloLink.split(
          ({ query }) => {
              const def = getMainDefinition(query)
              return def.kind === 'OperationDefinition' && def.operation === 'subscription'
          },
          wsLink,
          httpUploadLink
      )
    : httpUploadLink

const errorLink = new ErrorLink(({ error, operation }) => {
    if (CombinedGraphQLErrors.is(error)) {
        error.errors.forEach(({ message, locations, path }) =>
            console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        )
    } else if (CombinedProtocolErrors.is(error)) {
        error.errors.forEach(({ message, extensions }) =>
            console.log(`[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(extensions)}`)
        )
    } else {
        console.error(`[Network error]: ${error}`)
    }
})

export const client = new ApolloClient({
    ssrMode: !isBrowser, // important for Next
    link: ApolloLink.from([errorLink, link]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: { errorPolicy: 'all' },
        query: { errorPolicy: 'all' },
        mutate: { errorPolicy: 'all' } // do not throw; errors are returned in result.errors
    }
})
```

### 2. Apollo Provider

**Файл:** `src/packages/libs/apollo/apollo-client.provider.tsx`

```typescript
'use client'

import { ApolloProvider } from '@apollo/client/react'
import type { PropsWithChildren } from 'react'

import { client } from './apollo-client.config'

export function ApolloClientProvider({ children }: PropsWithChildren<unknown>) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>
}
```

**Использование в layout:**

```typescript
import { ApolloClientProvider } from '@/packages/libs/apollo'

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html>
            <body>
                <ApolloClientProvider>{children}</ApolloClientProvider>
            </body>
        </html>
    )
}
```

### 3. Константы для URL

**Файл:** `src/packages/constants/url.constants.ts`

```typescript
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL as string
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL as string
export const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL as string
```

**Переменные окружения (.env.local):**

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:8000/graphql
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8000/graphql
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. GraphQL запросы/мутации

**Структура файлов:** `src/modules/{module}/shared/api/graphql/{category}/{operation}.gql`

**Пример мутации:** `src/modules/auth/shared/api/graphql/session/login.gql`

```graphql
mutation Login($data: LoginInput!) {
    login(data: $data) {
        user {
            createdAt
            email
            firstName
            fullName
            id
            lastName
            phone
            updatedAt
            is2FAEnabled
            preferred2FAMethod
            require2FA
        }
    }
}
```

**Пример мутации создания:** `src/modules/auth/shared/api/graphql/account/create-account.gql`

```graphql
mutation CreateAccount($data: CreateAccountInput!) {
    createAccount(data: $data) {
        email
        firstName
        fullName
        id
        lastName
        phone
    }
}
```

### 5. Codegen конфигурация

**Файл:** `configs/graphql/graphql.config.ts`

```typescript
import { CodegenConfig } from '@graphql-codegen/cli'
import 'dotenv/config'

const config: CodegenConfig = {
    schema: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:8000/graphql',
    documents: ['./src/modules/**/shared/api/graphql/**/*.{ts,tsx,graphql,gql}'],
    generates: {
        './src/packages/api/graphql/__generated__/output.ts': {
            plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
            config: {
                avoidOptionals: true,
                useTypeImports: true,
                scalars: { DateTime: 'string', UUID: 'string' }
            }
        }
    },
    hooks: {
        afterAllFileWrite: ['prettier --write']
    },
    ignoreNoDocuments: true
}

export default config
```

**Скрипт в package.json:**

```json
{
  "scripts": {
    "codegen": "graphql-codegen --config ./configs/graphql/graphql.config.ts"
  }
}
```

### 6. Экспорт сгенерированных типов

**Файл:** `src/packages/api/graphql/index.ts`

```typescript
export * from './__generated__/output'
```

### 7. Использование мутаций в компонентах

**Пример:** `src/modules/auth/features/forms/login-form/login-form.tsx`

```typescript
'use client'

import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { LoginDocument } from '@/packages/api/graphql'
import { useTranslations } from '@/packages/libs/i18n'

export const LoginForm = () => {
    const t = useTranslations('auth.login')
    const router = useRouter()

    // Использование мутации
    const [_login, { loading: loginLoading }] = useMutation(LoginDocument)

    const loginForm = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })

    const onLoginSubmit = useCallback(
        async (data: TLoginFormSchema) => {
            // Выполнение мутации
            const response = await _login({ variables: { data } })

            // Обработка ошибок
            if (response.error && response.error.message) {
                toast.error(response.error.message)
                return
            }

            // Обработка успешного ответа
            const user = response.data?.login?.user ?? null
            if (!user) return

            loginForm.reset()
            router.push(PATHS.dashboard())
        },
        [_login, loginForm, router]
    )

    return (
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
            {/* форма */}
        </form>
    )
}
```

**Пример с мутацией создания аккаунта:** `src/modules/auth/features/forms/create-account-form.tsx`

```typescript
'use client'

import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { CreateAccountDocument } from '@/packages/api/graphql'

export const CreateAccountForm = () => {
    const router = useRouter()

    // Использование мутации
    const [_createAccount, { loading: createAccountLoading }] = useMutation(CreateAccountDocument)

    const contactForm = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: { fullName: '', email: '', phone: '' },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })

    const passwordForm = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: { password: '', confirmPassword: '' },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })

    const onSubmit = useCallback(
        async (data: TPasswordFormSchema) => {
            try {
                // Выполнение мутации с объединением данных из разных форм
                const response = await _createAccount({
                    variables: {
                        data: {
                            ...contactForm.getValues(),
                            password: data.password
                        }
                    }
                })

                // Обработка ошибок
                if (response.error?.message) {
                    toast.error(response.error.message)
                    return
                }

                // Обработка успешного ответа
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

    return (
        <form onSubmit={passwordForm.handleSubmit(onSubmit)}>
            {/* форма */}
        </form>
    )
}
```

### 8. Использование запросов (Queries)

**Пример с useQuery:**

```typescript
'use client'

import { useQuery } from '@apollo/client/react'
import { GetUserDocument } from '@/packages/api/graphql'

export const UserProfile = () => {
    const { data, loading, error } = useQuery(GetUserDocument, {
        variables: { id: 'user-id' },
        errorPolicy: 'all'
    })

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    return <div>{data?.getUser?.fullName}</div>
}
```

**Пример с useLazyQuery:**

```typescript
'use client'

import { useLazyQuery } from '@apollo/client/react'
import { SearchUsersDocument } from '@/packages/api/graphql'

export const UserSearch = () => {
    const [searchUsers, { data, loading }] = useLazyQuery(SearchUsersDocument)

    const handleSearch = () => {
        searchUsers({
            variables: { query: 'search term' }
        })
    }

    return (
        <div>
            <button onClick={handleSearch}>Search</button>
            {loading && <div>Loading...</div>}
            {data && <div>{/* результаты */}</div>}
        </div>
    )
}
```

### 9. Обработка ошибок

Все запросы настроены с `errorPolicy: 'all'`, что означает, что ошибки не выбрасываются как исключения, а возвращаются в `result.error`:

```typescript
const response = await _mutation({ variables: { data } })

// Проверка ошибок
if (response.error) {
    // response.error может быть:
    // - CombinedGraphQLErrors (GraphQL ошибки)
    // - CombinedProtocolErrors (протокольные ошибки)
    // - NetworkError (сетевые ошибки)
    
    toast.error(response.error.message)
    return
}

// Использование данных
const result = response.data?.mutationName
```

### 10. Зависимости

**package.json dependencies:**

```json
{
  "dependencies": {
    "@apollo/client": "^4.0.5",
    "apollo-upload-client": "^19.0.0",
    "graphql": "^16.11.0",
    "graphql-ws": "^6.0.6"
  },
  "devDependencies": {
    "@graphql-codegen/cli": "^6.0.0",
    "@graphql-codegen/typed-document-node": "^6.0.0",
    "@graphql-codegen/typescript": "^5.0.0",
    "@graphql-codegen/typescript-operations": "^5.0.0"
  }
}
```

## Шаги для настройки в новом приложении

1. **Установить зависимости:**
   ```bash
   bun add @apollo/client apollo-upload-client graphql graphql-ws
   bun add -d @graphql-codegen/cli @graphql-codegen/typed-document-node @graphql-codegen/typescript @graphql-codegen/typescript-operations
   ```

2. **Создать конфигурацию Apollo Client** (`src/packages/libs/apollo/apollo-client.config.ts`)

3. **Создать Apollo Provider** (`src/packages/libs/apollo/apollo-client.provider.tsx`)

4. **Добавить константы URL** (`src/packages/constants/url.constants.ts`)

5. **Настроить переменные окружения** (`.env.local`)

6. **Создать конфигурацию Codegen** (`configs/graphql/graphql.config.ts`)

7. **Добавить скрипт codegen** в `package.json`

8. **Создать GraphQL файлы** в `src/modules/{module}/shared/api/graphql/`

9. **Запустить codegen:**
   ```bash
   bun run codegen
   ```

10. **Использовать сгенерированные типы** в компонентах через `useMutation` и `useQuery`

## Важные моменты

- Все GraphQL операции должны быть в файлах `.gql` в структуре `src/modules/**/shared/api/graphql/**/*.gql`
- После изменения `.gql` файлов нужно запустить `codegen` для генерации типов
- Используется `typed-document-node` для типобезопасности
- Ошибки обрабатываются через `errorPolicy: 'all'` - проверяйте `response.error`
- Для загрузки файлов используется `apollo-upload-client` (multipart)
- WebSocket используется только для subscriptions и только в браузере
- SSR режим включен для Next.js (`ssrMode: !isBrowser`)

