# Анализ фронтенд кодовой базы: Medic HUB → Doctor Lab (DL)

> Ревизия по загруженному архиву `/frontend` (Next.js App Router). Дата анализа: 2025‑09‑19 (Europe/Kyiv).

## 📁 Структура проекта

```text
frontend/
├─ docker/
│  ├─ Dockerfile
│  └─ Dockerfile.prod
├─ docs/
│  ├─ Medic Hub - DoctorLab-auth.drawio
│  └─ print_ticket.pdf
├─ public/ …
├─ src/
│  ├─ app/
│  │  ├─ (root)/
│  │  │  └─ auth/
│  │  │     ├─ create-account/page.tsx
│  │  │     ├─ recovery/[token]/page.tsx
│  │  │     ├─ verify/page.tsx
│  │  │     └─ page.tsx
│  │  ├─ privacy-policy/page.tsx
│  │  ├─ term-of-service/page.tsx
│  │  ├─ styles/_vars/ …
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx (redirect на /auth)
│  ├─ modules/
│  │  └─ auth/
│  │     ├─ features/
│  │     │  ├─ forms/ (login, otp, reset, change-password и т.д.)
│  │     │  ├─ status-message.tsx
│  │     │  └─ wrapper.tsx
│  │     ├─ pages/ (Login, CreateAccount, Reset, Verify …)
│  │     ├─ shared/
│  │     │  ├─ assets/icons (svg)
│  │     │  ├─ components (Footer, Headers, Social и т.п.)
│  │     │  ├─ libs/
│  │     │  │  ├─ i18n (локализация auth)
│  │     │  │  └─ store (zustand-slices auth)
│  │     │  ├─ schemas (zod схемы форм)
│  │     │  └─ types
│  │     ├─ widgets/auth-form.tsx
│  │     └─ index.ts
│  ├─ packages/
│  │  ├─ assets/icons (google.svg, tooth.svg …)
│  │  ├─ components/
│  │  │  ├─ shared/ui (shadcn/radix обёртки: button, input, dialog …)
│  │  │  ├─ features/appearence (смена темы/языка)
│  │  │  └─ widgets (Header, Sidebar)
│  │  ├─ config (PATHS, ThemeProvider, constants …)
│  │  ├─ hooks (use-countdown, use-debounce-callback, use-auto-validate-form …)
│  │  ├─ libs/
│  │  │  ├─ i18n (next-intl конфиг и локали en/ru/core.json)
│  │  │  └─ store (zustand app store + slices)
│  │  ├─ schemas (zod, в т.ч. смена языка)
│  │  └─ utils (cn/tw-merge/colors/abbr/age …)
│  └─ packages/index.ts и реэкспорты
├─ components.json (shadcn/ui registry, алиасы)
├─ eslint.config.mjs (Flat config)
├─ next.config.ts (Next 15, svg через @svgr/webpack, next-intl plugin)
├─ postcss.config.mjs (Tailwind v4 via @tailwindcss/postcss)
├─ tsconfig.json / tsconfig.base.json (алиасы @/*, @/modules/*, @/packages/*, strict)
├─ package.json (scripts dev/build/start/lint)
└─ bun.lock
```

**Организация кода:** смешанный **feature‑based + package (shared‑lib) подход**. Доменные модули живут в `src/modules/*` (сейчас фокус на `auth`), общие библиотеки/компоненты — в `src/packages/*` (UI, hooks, i18n, store, utils). Роутинг — App Router в `src/app` с маршрутом‑контейнером `(root)/auth` и статическими страницами.

## 🛠 Технологический стек

| Категория | Технология | Версия/детали |
|---|---|---|
| Фреймворк | **Next.js** | **15.5.3** (`dependencies.next`) |
| ЯП | **TypeScript** | 5.9.x (strict, moduleResolution=bundler) |
| Рендер | App Router, RSC, `output: "standalone"` |
| Стили | **Tailwind CSS v4** | через `@tailwindcss/postcss`; 1 файл `globals.css` + токены в `:root` |
| UI‑база | **Radix UI** + **shadcn/ui** | registry в `components.json`, кастомные обёртки в `packages/components` |
| Иконки | lucide-react, svg через **@svgr/webpack** | спец. правило в `next.config.ts` |
| Формы | **react-hook-form** + **zod** | RHF с `@hookform/resolvers` |
| State | **zustand** | App store (`packages/libs/store`), Auth store (`modules/auth/shared/libs/store`) |
| Локализация | **next-intl** + `i18next-resources-to-backend` | server `getLocale()/getMessages()`, провайдер в `layout.tsx` |
| Темизация | **next-themes** | `ThemeProvider` в корневом layout |
| Даты | date-fns | точечное использование |
| Прочее | clsx, tailwind-merge, class-variance-authority, cmdk, react-day-picker, react-use, react-phone-number-input | — |
| Линтинг | **ESLint 9**, `eslint-config-next@15.5.3` | flat config |
| Форматирование | Prettier + `prettier-plugin-tailwindcss` + sort‑imports | — |
| Сборка (dev/prod) | next build/start; **Docker** (bun Runner + node Runner) | `docker/Dockerfile*` |
| Package manager | **Bun** | `bun.lock`, докер‑слои deps/build/runner |

## 🏗 Архитектура

### Компонентная архитектура
- **Feature‑модуль** `modules/auth`: слои **features/pages/shared/widgets** — чистая FSD‑логика (формы, страницы, общие компоненты, локальные сторы, схемы, типы).
- **Shared‑пакеты** `packages/*`: универсальные UI‑обёртки Radix/shadcn, хуки, i18n, store и утилиты. Все экспортируются из index.ts для плоских импортов через TS‑алиасы.

**Пример: корневой layout с RSC и провайдерами**
```tsx
// src/app/layout.tsx (фрагмент)
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { ThemeProvider } from '@/packages/config'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <main className="min-h-screen w-full">{children}</main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### Разделение логики
- **Hooks**: `packages/hooks` (напр. `use-countdown`, `use-debounce-callback`, `use-auto-validate-form`), переиспользуются в auth‑формах.
- **Композиция компонентов**: shadcn‑обёртки (`Button`, `Input`, `Dialog` и пр.) инкапсулируют Radix + Tailwind + cva вариативность.
- **SVG как React‑компоненты**: кастомное правило в `next.config.ts` для `@svgr/webpack`.

**Пример: конфиг webpack для .svg**
```ts
// next.config.ts (фрагмент)
const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.('.svg'))
config.module.rules.push(
  { ...fileLoaderRule, test: /\.svg$/i, resourceQuery: /url/ },
  { test: /\.svg$/i, issuer: fileLoaderRule.issuer, resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, use: ['@svgr/webpack'] }
)
fileLoaderRule.exclude = /\.svg$/i
```

### Управление состоянием
- **App‑store** (`packages/libs/store/app`): глобальные вещи UI (напр. `isSidebarOpen`) через **zustand** slices.
- **Auth‑store** (`modules/auth/shared/libs/store`): локальный стор модуля (шаги, 2FA флаги, статусы).
  
**Пример: slice zustand**
```ts
// src/packages/libs/store/app/slices/app.slice.ts
import { StateCreator } from 'zustand'
import { IAppSlice } from '../types'
export const appSlice: StateCreator<IAppSlice> = (set) => ({
  isSidebarOpen: true,
  setIsSidebarOpen: (isSidebarOpen: boolean) => set({ isSidebarOpen })
})
```

### API‑слой и работа с данными
- В текущей ревизии **сетевого слоя нет** (нет axios/tanstack‑query/rtk‑query). Формы пока имитируют локальную валидацию/стейт. Предполагается интеграция с BFF/REST (см. спецификацию DL ниже).

### Роутинг/навигация
- App Router. Вход `/` → `redirect(PATHS.auth())`.
- Сегмент `(root)/auth` со страницами login/create-account/reset/verify, плюс статические policy/terms.

**Пример: страница логина (pages‑proxy)**
```tsx
// src/app/(root)/auth/page.tsx
import { getTranslations } from 'next-intl/server'
import { Login } from '@/modules/auth'
export async function generateMetadata() {
  const t = await getTranslations('auth.login')
  return { title: t('heading'), description: t('description') }
}
export default function LoginPage() { return <Login /> }
```

### Ошибки и загрузка
- Паттерн **status‑страниц** и компоненты статусов в `modules/auth/features/status-message.tsx`.
- В формах: `react-hook-form` + `zodResolver` + кастом‑хуки (`useAutoValidateForm`, `useCountdown`) для UX. Глобальные ErrorBoundary/`error.tsx`/`loading.tsx` не обнаружены — стоит добавить на ключевых маршрутах.

**Пример: фрагмент login‑form**
```tsx
'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAutoValidateForm, useCountdown } from '@/packages/hooks'
import { loginSchema } from '@/auth/shared/schemas'
export const LoginForm = () => {
  const form = useForm({ resolver: zodResolver(loginSchema), mode: 'onChange' })
  useAutoValidateForm(form)
  const { timeLeft, start } = useCountdown(60)
  // submit -> call API (TODO), set status in zustand
  return (/* JSX: fields + Button disabled={!form.formState.isValid} */)
}
```

## 🎨 UI/UX и стилизация

- **Tailwind v4** с `@theme inline` и CSS‑переменными в `:root`; глобальная типографика через `next/font` (Roboto).
- **shadcn/ui + Radix**: собственные компоненты в `packages/components/shared/ui/*` (button, input, select, dialog, sheet, tooltip, table, date-picker и т.д.). Варианты через **class‑variance‑authority (cva)**, мердж классов через `tailwind-merge`.
- **Widgets**: `Header`, `Sidebar` — собранные блоки для каркаса будущего приложения.
- **Адаптив**: классы Tailwind (`md:*`, `hidden md:block`) в шапке/сайдбаре; каркас уже responsive.
- **Темизация**: `next-themes`, переключатель темы в `features/appearence/change-theme.tsx`. Токены через CSS‑vars.
- **A11y**: базовая поддержка от Radix (aria‑атрибуты); стоит дополнить: фокус‑кольца, skip‑links, контрасты, тесты axe.

## ✅ Качество кода

- **ESLint 9 + eslint-config-next 15.5.3** (flat): снят ряд строгих правил (`no-default-export`, `@typescript-eslint/no-explicit-any: off`, `no-unused-vars: warn`). Рекомендую усилить конфиг к прод‑релизу.
- **Prettier** с сортировкой импортов и `prettier-plugin-tailwindcss` — единый кодстайл.
- **TypeScript**: строгий, алиасы настроены (`@/*`, `@/packages/*`, `@/modules/*`). Типы для zustand‑слайсов определены. В целом — **middle+**.
- **Тесты**: не обнаружены (unit/integration/e2e). Рекомендация — Vitest + React Testing Library для UI; Cypress/Playwright для критических сценариев (auth flows).
- **Документация**: читаемые имена файлов/папок, `README.md` базовый. Хорошо бы добавить ADR/архитектурные заметки (docs/) по слоям FE.

## 🔧 Ключевые компоненты

### 1) `packages/components/shared/ui/button.tsx`
**Роль:** универсальная кнопка с вариациями (cva), тултип поддержка.
**Ключевые пропсы:** `variant`, `size`, `asChild`, `tooltip`.
```tsx
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'
import { cn } from '@/packages/utils'
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip'
const buttonVariants = cva('inline-flex items-center rounded-md transition-all disabled:opacity-50', {
  variants: {
    variant: { default:'', primary:'bg-primary text-primary-foreground hover:bg-primary-hover', outline:'border' },
    size: { sm:'h-8 px-3', md:'h-10 px-4', lg:'h-12 px-6' }
  }, defaultVariants: { variant:'primary', size:'md' }
})
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean; tooltip?: string }
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, tooltip, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  const btn = <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  return tooltip ? (<Tooltip><TooltipTrigger asChild>{btn}</TooltipTrigger><TooltipContent>{tooltip}</TooltipContent></Tooltip>) : btn
})
```

### 2) `packages/components/widgets/header.tsx`
**Роль:** верхняя панель с бургером, переключателями темы/языка, аватаром.
**Зависимости:** `zustand` (app store), `lucide-react`, `ChangeTheme/Language`.
```tsx
'use client'
import { Menu, PanelLeftOpen } from 'lucide-react'
import { Button, ChangeLanguage, ChangeTheme, LogoIcon, UserAvatar } from '@/packages/components'
import { useStore } from '@/packages/libs'
export const Header = ({ heading, headingCount }: { heading: string; headingCount?: number }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useStore()
  return (
    <header className="flex h-16 items-center justify-between gap-4 pr-2 pl-0 md:pl-2">
      <div className="flex items-center gap-2">
        <span className="md:hidden"><LogoIcon className="size-10" /></span>
        <Button variant="ghost" onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle sidebar">
          {isSidebarOpen ? <PanelLeftOpen /> : <Menu />}
        </Button>
        <h1 className="text-lg font-semibold">{heading}{headingCount ? <span className="ml-2 text-muted-foreground">({headingCount})</span> : null}</h1>
      </div>
      <div className="flex items-center gap-2"><ChangeLanguage /><ChangeTheme /><UserAvatar /></div>
    </header>
  )
}
```

### 3) `modules/auth/features/forms/login-form/*`
**Роль:** составной flow логина с OTP/паролем, countdown на повторную отправку.
**Зависимости:** RHF, zod, локальный zustand, кастом‑хуки.
```tsx
'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { loginSchema } from '@/auth/shared/schemas'
import { useAuthStore } from '@/auth/shared/libs'
import { Button, CardContent, Input } from '@/packages/components'
export const LoginForm = () => {
  const form = useForm({ resolver: zodResolver(loginSchema), mode: 'onChange' })
  const { setStatusPage } = useAuthStore()
  const onSubmit = form.handleSubmit(async (data) => {
    // TODO: call BFF /auth/login; setStatusPage('success'|'error'); handle OTP
  })
  return (
    <form onSubmit={onSubmit}>
      <CardContent className="space-y-4">
        <Input {...form.register('email')} placeholder="you@example.com" />
        <Input type="password" {...form.register('password')} placeholder="••••••••" />
        <Button type="submit" disabled={!form.formState.isValid}>Sign in</Button>
      </CardContent>
    </form>
  )
}
```

### 4) `packages/libs/i18n/*` + интеграция в App Router
**Роль:** next‑intl настройка ресурсов и серверная загрузка сообщений.
```ts
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin('./src/packages/libs/i18n/request.ts')
export default withNextIntl({ output: 'standalone', reactStrictMode: true })
```
```tsx
// src/app/layout.tsx (см. выше) — провайдер с server messages
```

### 5) `docker/Dockerfile*`
**Роль:** Dev and Prod pipelines на **Bun** + Node runner (standalone output).
- `deps` слой — bun install `--frozen-lockfile`
- `dev` — bun run dev (порт 3000)
- `prod` — bun build → Node `server.js` из `.next/standalone`

## 📋 Паттерны и best practices

- **FSD/FMIC**‑раскладка модулей (`features/pages/shared/widgets`), чистые реэкспорты `index.ts` → удобные импорты.
- **UI как слой**: собственные обёртки shadcn под единые токены/варианты → контроль дизайна.
- **Алиасы TS** (`@/packages/*`, `@/modules/*`) → короткие импорты, контроль границ.
- **SVG через SVGR** → единый способ встраивать иконки/логотипы как компоненты.
- **Формы: zod + RHF** → декларативные схемы, понятная валидация.
- **Zustand slices** → компактное локальное состояние без Redux‑шаблонов.

### Оптимизация производительности (рекомендации)
- Вынести тяжёлые UI‑блоки в **RSC** там, где нет интерактива.
- Добавить **dynamic import** для низкоприоритетных виджетов (например, Sidebar в мобильном).
- Запретить сорс‑мапы в проде (уже `productionBrowserSourceMaps: false`).
- Включить **image optimization** (next/image) и `preload` для критических шрифтов.

### Асинхронщина
- Добавить **TanStack Query** или собственный `fetcher` + abort/идемпотентность для auth‑вызовов.
- Единый **API‑клиент**: обёртка над `fetch` c `baseURL`, обработкой 401/419, ретраями и т.п.

### Валидация данных
- Zod‑схемы уже есть для auth‑форм; расширить на все формы (настройки, профили, EMR‑формы).

### Локализация
- next‑intl уже интегрирован; добавить **рутинговые стратегии** (locale prefixes), ensure серверные метаданные переводятся.

## 🧰 Инфраструктура разработки

- **package.json scripts:** `dev`, `build`, `start`, `lint` — минимально.
- **ESLint/Prettier** настроены; Stylelint отсутствует (не обязателен с Tailwind).
- **CI/CD**: в репозитории не обнаружены workflow‑файлы. Рекомендую GH Actions (lint → typecheck → build → docker build/push).
- **Docker**: dev/prod готов. Для Windows‑окружений возможны проблемы watch (см. ниже).

## 📌 Выводы и рекомендации

**Сильные стороны**
- Чистая FSD‑структура модулей (`auth`) и грамотный `packages/*` слой (UI/hooks/libs/utils).
- Современный стек: Next 15, Tailwind v4, shadcn/radix, zustand, next‑intl, Bun‑контейнеры.
- Готовность к мульти‑языку и темизации из коробки.

**Зоны роста (под MVP DL v0.2)**
1. **API‑слой**: ввести BFF‑клиент (REST/OpenAPI), стейт данных (TanStack Query), обработку 401/refresh, токен‑менеджмент.
2. **Ошибки/Loading**: добавить `error.tsx`/`loading.tsx` на корневых сегментах; унифицированные toasts/snackbars.
3. **A11y**: пройтись axe‑чеклистом, добавить skip‑links, роле‑атрибуты для основных шаблонов.
4. **Тесты**: Vitest + RTL, как минимум для auth‑форм и store; e2e (Playwright) для login/otp/reset.
5. **Security**: строгие заголовки (Next middleware / `next-safe`), CSRF (если формы), маскирование PII в логах.
6. **Perf**: audit Lighthouse/Next trace; code‑splitting виджетов; `next/font` с `display=swap`.
7. **DX**: добавить `typecheck` скрипт, строгие TS‑правила (`no-explicit-any`: warn), pre-commit (lint-staged).

**Сложность проекта:** **middle‑friendly** (в текущей ревизии). С ростом домена (EMR/календарь/склад/биллинг) поднимется до **senior** из‑за интеграций, RBAC и производительности.

---

# Привязка к спецификации DL v0.2 (из запроса)

Ниже — как текущая FE‑база мапится к спецификации и что добавить к MVP.

## Каркас (готово/частично)
- ✅ App shell: `Header`, `Sidebar`, темы, локали.
- ✅ Auth UI (логин/создание/восстановление/верификация) — **UI‑уровень**.
- ⏳ Нет сетевого слоя / RBAC‑гейтинга / сессий.

## Что добавить для **MVP (R1)**
- **Auth‑клиент**: `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/otp` (OpenAPI) + cookie/token storage; интерцепторы.
- **RBAC UI‑гейтинг**: скрытие/редиректы по ролям (Owner/Admin/Doctor/Reception/Solo).
- **Пациенты/EMR‑лайт** (просмотр/CRUD): списки, карточка, файлы (upload via S3 proxy).
- **Расписание/визиты**: day/week/month, DnD, статусы; формы записи.
- **Счета/оплаты**: список, детали, PDF/печать; интеграция провайдера.
- **Аудит событий UI**: отправка на BE (schedule created/changed, file viewed).

## Тех‑блок
- **TanStack Query** + `@/packages/libs/api/fetcher.ts` (abort/retry), `zod` для runtime‑валидации ответов.
- **Машины состояний** (XState/создать вручную) для `Schedule`/`Invoice`/`TreatmentPlan` UI‑flows.
- **Feature toggles** per tenant (branding, policies) через контекст/загрузку метаданных на сервере.
- **i18n**: RU/UK/EN ключи для всех новых экранов (таблицы/формы/диалоги).

---

## Приложение: возможные файлы/скрипты к добавлению

- `src/packages/libs/api/fetcher.ts` — обёртка над fetch (timeouts, baseURL, auth headers, JSON parse safe).
- `src/packages/libs/api/queryClient.ts` — TanStack Query клиент/провайдер.
- `src/middleware.ts` — locale + auth redirects (protect routes).
- `scripts/typecheck` — `tsc --noEmit`.
- `.github/workflows/ci.yml` — lint → typecheck → build → docker push.

---

## Known caveats (Windows / watchpack)

В репозитории ранее фиксировались ошибки watch на Windows (`EINVAL: lstat 'G:\System Volume Information'`). Для стабильности dev на Windows WSL/Network дисках:
- Запускать `next dev --no-turbo` (turbo может усиливать watch‑сканирование).
- В `next.config.ts` по необходимости включить `webpack.watchOptions.ignored = [/node_modules/, /\.git/, /System Volume Information/]` или использовать переменную окружения `CHOKIDAR_USEPOLLING=1` (менее эффективно).

---

**Готово.** Полный отчёт сохранён в `frontend.md`.

