# Архитектура и UML-схема авторизации

Этот документ описывает методы, компоненты и последовательность действий для реализации авторизации на фронтенде.

---

## 1. Анализ методов авторизации на Frontend

Для реализации полного цикла авторизации нам потребуется несколько ключевых элементов, работающих в связке.

### 1.1. GraphQL-операции (API Layer)

На основе `schema.prisma` и `requirements.md`, фронтенд будет взаимодействовать со следующими GraphQL-операциями. Типы для них будут сгенерированы автоматически с помощью `graphql-code-generator`.

- **`mutation Login($input: LoginInput!)`**: Принимает `email` и `password`, возвращает `{ token, user }`.
- **`mutation Register($input: RegisterInput!)`**: Принимает данные для создания `User` и `Tenant`, возвращает `{ token, user }`.
- **`query Me()`**: Не принимает аргументов, использует JWT из заголовков, возвращает данные по текущему пользователю `User` или `null`.

### 1.2. Хуки данных (Data Layer)

Эти хуки, сгенерированные `graphql-code-generator`, будут обертками над TanStack Query и нашими GraphQL-операциями.

- **`useLoginMutation()`**: Хук для выполнения мутации логина. Предоставляет методы `mutate` или `mutateAsync`, а также состояния `isPending`, `isError`.
- **`useRegisterMutation()`**: Аналогичный хук для регистрации.
- **`useUserQuery()`**: Хук для выполнения запроса `Me`. Предоставляет `data` (данные пользователя), `isLoading`, `isError`, `refetch`.

### 1.3. Сервис-обертка и хук состояния (Business Logic Layer)

Чтобы не размазывать логику по компонентам, мы создадим единый центр управления состоянием авторизации.

- **`useAuth()` (кастомный хук):**
    - **Назначение:** Глобальный хук, доступный всему приложению через React Context.
    - **Состояние:** Предоставляет `user`, `isAuthenticated`, `isLoading`.
    - **Методы:**
        - `login(email, password)`: Вызывает `useLoginMutation`, сохраняет токен, обновляет состояние.
        - `register(...)`: Вызывает `useRegisterMutation`, сохраняет токен, обновляет состояние.
        - `logout()`: Удаляет токен, очищает состояние.
        - `checkSession()`: Вызывает `useUserQuery` при инициализации приложения для проверки существующего токена.

### 1.4. Компоненты (Presentation Layer)

- **`login-form.tsx`**: Форма входа, использующая RHF+Zod и вызывающая `login()` из `useAuth()`.
- **`register-form.tsx`**: Форма регистрации, вызывающая `register()`.
- **`auth-provider.tsx`**: Компонент-провайдер, который оборачивает приложение и предоставляет `useAuth()` всем дочерним элементам.
- **`protected-route.tsx`**: Компонент-обертка или логика в `middleware.ts` для защиты страниц от неавторизованного доступа.

---

## 2. UML-диаграмма последовательности (Login Flow)

Ниже представлена UML-диаграмма, описывающая процесс входа пользователя в систему.

```mermaid
sequenceDiagram
    actor User
    participant Component as Browser (React Component)
    participant AuthService as FE Auth Service (useAuth hook)
    participant Server as GraphQL Server (NestJS)
    participant DB as Database (PostgreSQL)

    User->>+Component: Вводит email и пароль
    User->>+Component: Нажимает "Войти"
    Component->>+AuthService: Вызывает login(email, password)
    
    AuthService->>+Server: Отправляет mutation Login($input)
    Server->>+DB: SELECT * FROM users WHERE email = ...
    DB-->>-Server: Возвращает данные пользователя (с хэшем пароля)
    
    alt Пароль верный
        Server->>Server: Генерирует JWT
        Server-->>-AuthService: Возвращает { token, user }
        AuthService->>AuthService: Сохраняет JWT (в cookie/localStorage)
        AuthService-->>-Component: Обновляет состояние (isAuthenticated = true)
        Component-->>-User: Показывает главный экран приложения
    else Пароль неверный
        Server-->>-AuthService: Возвращает ошибку GraphQL
        AuthService-->>-Component: Передает ошибку
        Component-->>-User: Показывает сообщение об ошибке
    end
```
