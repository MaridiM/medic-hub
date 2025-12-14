# Universal Fullstack Application Generator Prompt

**Version**: 2.0.0
**Date**: 2025-12-12
**Architecture**: Monorepo (Backend + Frontend)

---

## Table of Contents

### Core Documentation
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Naming Conventions & Code Organization](#naming-conventions--code-organization)

### Templates
5. [Basic Template](#basic-template) - Minimal setup for simple applications
6. [Advanced Template](#advanced-template) - Full-featured setup with authentication and advanced features

### Infrastructure
7. [Backend Setup](#backend-setup)
8. [Frontend Setup](#frontend-setup)
9. [Internationalization (i18n)](#internationalization-i18n)
10. [Theme System](#theme-system)
11. [Routing Configuration](#routing-configuration)
12. [GraphQL Integration](#graphql-integration)

### Authentication & Security
13. [Authentication Module](#authentication-module)
14. [Email Service](#email-service)
15. [Dashboard & Protected Routes](#dashboard--protected-routes)

### Utilities & Advanced
16. [Utilities & Helpers](#utilities--helpers)
17. [Docker Setup](#docker-setup)
18. [Advanced Features](#advanced-features)
19. [Architecture Guide](#architecture-guide)

---

## Overview

This prompt template provides a complete foundation for building modern fullstack web applications with two template options:

### Basic Template
Perfect for simple applications, MVPs, and learning:
- **Backend**: NestJS + GraphQL + Prisma + PostgreSQL
- **Frontend**: Next.js 16 + Tailwind CSS 4 + Apollo Client
- **Language Support**: Multi-language (i18n) for both backend and frontend
- **Theme Support**: Light/Dark mode with CSS variables
- **Type Safety**: Full TypeScript support across the stack
- Simple CRUD operations and basic UI components

### Advanced Template
Full-featured setup for production applications:
- Everything in Basic Template, plus:
- **Session Management**: Redis-backed sessions
- **Authentication**: Email/password with email verification
- **Security**: Helmet, CORS, rate limiting
- **Email Service**: SMTP integration with Nodemailer
- **Protected Routes**: Frontend and backend guards
- **Advanced Utilities**: Password hashing, debouncing, form validation
- **Advanced Components**: Toast notifications, avatars, loading states

### Architecture Approach

This template uses a **monorepo** structure with separate applications for backend (`apps/api`) and frontend (`apps/web`), following strict naming conventions and code organization patterns.

---

## Technology Stack

### Backend
- **NestJS** 11+ - Progressive Node.js framework
- **Apollo Server** 4+ - GraphQL server
- **Prisma** 6+ - Next-generation ORM
- **PostgreSQL** 17+ - Primary database
- **Redis** 8+ - Caching and session storage
- **i18next** 25+ - Internationalization
- **TypeScript** 5.8+ - Type safety

### Frontend
- **Next.js** 16+ - React framework with App Router
- **React** 19+ - UI library
- **Tailwind CSS** 4+ - Utility-first CSS
- **Apollo Client** 4+ - GraphQL client
- **next-intl** 4+ - Internationalization
- **next-themes** 0.4+ - Theme management
- **Zustand** 5+ - State management
- **TypeScript** 5.9+ - Type safety

---

## Project Structure

```
your-app/
├── apps/
│   ├── api/                    # Backend application (NestJS)
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Database schema
│   │   ├── src/
│   │   │   ├── core/           # Infrastructure (Prisma, Redis, i18n)
│   │   │   ├── modules/        # Business logic modules
│   │   │   ├── shared/         # Shared utilities, decorators, guards
│   │   │   └── main.ts         # Application entry point
│   │   ├── locales/            # Translation files (en/, ru/)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── nest-cli.json
│   │
│   └── web/                    # Frontend application (Next.js)
│       ├── src/
│       │   ├── app/            # Next.js App Router pages
│       │   ├── packages/       # Shared code
│       │   │   ├── components/ # UI components
│       │   │   ├── libs/       # Apollo, i18n, stores
│       │   │   ├── config/     # Routes, constants
│       │   │   ├── utils/      # Helper functions
│       │   │   └── hooks/      # Custom hooks
│       │   └── modules/        # Feature modules
│       ├── messages/           # Translation files (en.json, ru.json)
│       ├── public/             # Static assets
│       ├── package.json
│       ├── next.config.ts
│       └── tsconfig.json
│
├── docs/                       # Documentation
├── docker-compose.yml          # Local development setup
└── README.md
```

---

## Naming Conventions & Code Organization

This section defines strict rules for naming files, components, and organizing exports/imports to maintain consistency across the entire codebase.

### 1. File Naming Conventions

#### Frontend Files

| Type | Convention | Example |
|------|-----------|---------|
| React Components | `kebab-case.tsx` | `button.tsx`, `change-theme.tsx`, `user-avatar.tsx` |
| Pages (App Router) | `kebab-case.tsx` or `page.tsx` | `login/page.tsx`, `dashboard/page.tsx` |
| TypeScript files | `kebab-case.ts` | `auth.store.ts`, `apollo-client.ts` |
| Utility files | `kebab-case.ts` | `tw-merge.ts`, `generate-abbreviation.ts` |
| Custom hooks | `use-kebab-case.ts` | `use-countdown.ts`, `use-debounce-callback.ts` |
| Type definitions | `kebab-case.types.ts` | `auth.types.ts`, `i18n.types.ts` |
| Schemas (Zod) | `kebab-case.schema.ts` | `login.schema.ts`, `user.schema.ts` |
| GraphQL operations | `camelCase.gql` | `getUsers.gql`, `createUser.gql`, `login.gql` |
| Barrel exports | `index.ts` | Every folder with exports has `index.ts` |

#### Backend Files

| Type | Convention | Example |
|------|-----------|---------|
| Services | `kebab-case.service.ts` | `user.service.ts`, `2fa-method.service.ts` |
| Controllers/Resolvers | `kebab-case.resolver.ts` | `user.resolver.ts`, `auth.resolver.ts` |
| Modules | `kebab-case.module.ts` | `user.module.ts`, `2fa.module.ts` |
| DTOs | `kebab-case.dto.ts` | `create-user.dto.ts`, `login.dto.ts` |
| Models (GraphQL) | `kebab-case.model.ts` | `user.model.ts`, `2fa-method.model.ts` |
| Guards | `kebab-case.guard.ts` | `auth.guard.ts`, `2fa-verified.guard.ts` |
| Decorators | `kebab-case.decorator.ts` | `current-user.decorator.ts`, `auth.decorator.ts` |
| Utilities | `kebab-case.util.ts` | `hash.util.ts`, `ms.util.ts` |
| Constants | `kebab-case.constants.ts` | `2fa.constants.ts`, `session.constants.ts` |
| Types | `kebab-case.types.ts` | `device.types.ts`, `risk.types.ts` |
| Configs | `kebab-case.config.ts` | `session.config.ts`, `helmet.config.ts` |

### 2. Component and Class Naming

#### Frontend

| Type | Convention | Example |
|------|-----------|---------|
| React Components | `PascalCase` | `Button`, `ChangeTheme`, `UserAvatar` |
| Component variables | `PascalCase const` | `export const Button = () => {}` |
| Custom hooks | `camelCase` function | `export function useCountdown() {}` |
| Utility functions | `camelCase` | `export function generateAbbreviation() {}` |
| Types/Interfaces | `PascalCase` with prefix | `IButtonProps`, `TAuthState`, `EUserRole` |
| Enums | `PascalCase` with `E` prefix | `EUserRole`, `EStatus` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_LENGTH`, `DEFAULT_TIMEOUT` |
| Zustand stores | `use + PascalCase + Store` | `useAuthStore`, `useAppStore` |

**Examples**:
```typescript
// button.tsx
export const Button = ({ children }: IButtonProps) => {
  return <button>{children}</button>
}

// use-countdown.ts
export function useCountdown(duration: number) {
  // ...
}

// auth.store.ts
export const useAuthStore = create<TAuthState>()((...args) => ({
  ...authSlice(...args)
}))

// auth.types.ts
export interface IAuthState {
  user: IUser | null
  isAuthenticated: boolean
}

export type TAuthStatus = 'idle' | 'loading' | 'authenticated' | 'error'

export enum EAuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google'
}
```

#### Backend

| Type | Convention | Example |
|------|-----------|---------|
| Services | `PascalCase` class | `UserService`, `TwoFactorMethodService` |
| Resolvers | `PascalCase` class | `UserResolver`, `AuthResolver` |
| Modules | `PascalCase` class | `UserModule`, `AuthModule` |
| DTOs (Input) | `PascalCase` class | `CreateUserInput`, `LoginInput` |
| Models (Output) | `PascalCase` class + Model suffix | `UserModel`, `TwoFactorMethodModel` |
| Guards | `PascalCase` class | `AuthGuard`, `TwoFactorVerifiedGuard` |
| Decorators | `PascalCase` function | `CurrentUser()`, `Authorization()` |
| Interfaces | `I` + `PascalCase` | `IUserService`, `IMailOptions` |
| Types | `T` + `PascalCase` | `TApiResponse`, `TUserRole` |
| Enums | `E` + `PascalCase` | `EUserRole`, `ESecurityEvent` |
| Constants | `UPPER_SNAKE_CASE` | `SESSION_MAX_AGE`, `OTP_LENGTH` |

**Examples**:
```typescript
// user.service.ts
@Injectable()
export class UserService {
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany()
  }
}

// create-user.dto.ts
@InputType('CreateUserInput')
export class CreateUserInput {
  @Field()
  email: string

  @Field()
  name: string
}

// user.model.ts
@ObjectType('User')
export class UserModel {
  @Field()
  id: string

  @Field()
  email: string
}

// current-user.decorator.ts
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req.session.userId
  }
)

// auth.types.ts
export interface IAuthService {
  login(data: LoginInput): Promise<UserModel>
}

export type TAuthResponse = {
  success: boolean
  token?: string
}

export enum EUserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}
```

### 3. Export Patterns

**CRITICAL RULE**: This application uses **ONLY named exports**. Default exports are **NEVER** used.

#### Frontend Export Patterns

**Component exports**:
```typescript
// ✅ CORRECT - Named export
export const Button = ({ children }: IButtonProps) => {
  return <button>{children}</button>
}

// ✅ CORRECT - Function declaration with export
export function ChangeTheme() {
  return <button>Toggle theme</button>
}

// ❌ WRONG - Never use default export
export default function Button() { }
```

**Multiple exports from single file**:
```typescript
// button.tsx
import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white',
        outline: 'border border-gray-300'
      }
    }
  }
)

export type IButtonProps = VariantProps<typeof buttonVariants> & {
  children: React.ReactNode
}

export const Button = ({ children, variant }: IButtonProps) => {
  return <button className={buttonVariants({ variant })}>{children}</button>
}

// Consumers import: import { Button, buttonVariants, IButtonProps } from './button'
```

**Utility exports**:
```typescript
// tw-merge.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// generate-abbreviation.ts
export function generateAbbreviation(input: string): string {
  // Implementation
}
```

**Hook exports**:
```typescript
// use-countdown.ts
export function useCountdown(initialDuration: number) {
  const [remaining, setRemaining] = useState(initialDuration)
  // ...
  return { remaining, start, stop, reset }
}

// use-debounce-callback.ts
export interface IDebouncedFn<T extends any[]> {
  (...args: T): void
  cancel: () => void
  flush: () => void
  isPending: () => boolean
}

export function useDebouncedCallback<T extends any[]>(
  fn: (...args: T) => void,
  delay: number
): IDebouncedFn<T> {
  // Implementation
}
```

#### Backend Export Patterns

**Service exports**:
```typescript
// user.service.ts
@Injectable()
export class UserService extends CoreService {
  constructor(private prisma: PrismaService) {
    super()
  }

  async findAll() { }
  async findOne(id: string) { }
}
```

**Resolver exports**:
```typescript
// user.resolver.ts
@Resolver(() => UserModel)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [UserModel])
  async users() { }

  @Mutation(() => UserModel)
  async createUser(@Args('data') data: CreateUserInput) { }
}
```

**DTO exports**:
```typescript
// create-user.dto.ts
@InputType('CreateUserInput')
export class CreateUserInput {
  @Field()
  email: string
}

@InputType('UpdateUserInput')
export class UpdateUserInput {
  @Field({ nullable: true })
  name?: string
}
```

**Model exports**:
```typescript
// user.model.ts
@ObjectType('User')
export class UserModel {
  @Field()
  id: string
}

@ObjectType('UsersList')
export class UsersListModel {
  @Field(() => [UserModel])
  users: UserModel[]

  @Field()
  total: number
}
```

**Decorator exports**:
```typescript
// current-user.decorator.ts
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    // Implementation
  }
)

// auth.decorator.ts
export function Authorization() {
  return applyDecorators(UseGuards(GqlAuthGuard))
}
```

### 4. Barrel Export Pattern (index.ts)

**Every folder with exports MUST have an index.ts file that re-exports everything using star exports.**

#### Frontend Barrel Exports

```typescript
// apps/web/src/packages/components/index.ts
export * from './shared'
export * from './features'
export * from './widgets'

// apps/web/src/packages/components/shared/index.ts
export * from './ui'
export * from './user-avatar'
export * from './countdown'
export * from './select'
export * from './hint'

// apps/web/src/packages/components/shared/ui/index.ts
export * from './alert'
export * from './avatar'
export * from './badge'
export * from './button'
export * from './card'
export * from './checkbox'
export * from './dialog'
export * from './form'
export * from './input'
export * from './label'
// ... all UI components

// apps/web/src/packages/utils/index.ts
export * from './calculate-age'
export * from './colors'
export * from './generate-abbreviation'
export * from './tw-merge'

// apps/web/src/packages/hooks/index.ts
export * from './use-auto-validation-form'
export * from './use-countdown'
export * from './use-debounce-callback'

// apps/web/src/modules/auth/features/index.ts
export * from './forms'
export * from './status-message'
export * from './wrapper'

// apps/web/src/modules/auth/features/forms/index.ts
export * from './contact-form'
export * from './login-form'
export * from './password-form'
export * from './create-account-form'
```

#### Backend Barrel Exports

```typescript
// apps/api/src/modules/auth/2fa/index.ts
export * from './2fa.module'
export * from './resolvers'
export * from './services'
export * from './dtos'
export * from './models'
export * from './guards'
export * from './types'
export * from './constants'
export * from './utils'

// apps/api/src/modules/auth/2fa/services/index.ts
export * from './2fa-method.service'
export * from './admin-2fa.service'
export * from './backup-code.service'
export * from './device-trust.service'
export * from './security-event.service'
export * from './webauthn.service'

// apps/api/src/modules/auth/2fa/dtos/index.ts
export * from './admin-2fa.dto'
export * from './setup-totp.dto'
export * from './setup-otp.dto'
export * from './verify-2fa.dto'
export * from './manage-methods.dto'

// apps/api/src/shared/decorators/index.ts
export * from './auth.decorator'
export * from './authorized.decorator'
export * from './current-user.decorator'

// apps/api/src/shared/utils/index.ts
export * from './errors'
export * from './hash.util'
export * from './ms.util'
export * from './parse-boolean.util'
```

### 5. Import Patterns

#### Path Aliases Configuration

**Frontend (apps/web/tsconfig.json)**:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/modules/*": ["./src/modules/*"],
      "@/packages/*": ["./src/packages/*"],

      // Module-specific aliases
      "@/auth/*": ["./src/modules/auth/*"],
      "@/dashboard/*": ["./src/modules/dashboard/*"],
      "@/settings/*": ["./src/modules/settings/*"]
    }
  }
}
```

**Backend (apps/api/tsconfig.json)**:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
      "@prisma/__generated__": ["prisma/__generated__"],
      "@prisma/__generated__/*": ["prisma/__generated__/*"]
    }
  }
}
```

#### Import Order and Grouping

**Organize imports in this order**:

1. **External libraries** (React, Next, Apollo, etc.)
2. **Internal absolute imports** (using @ alias)
3. **Relative imports** (./file)

**Separate groups with blank lines**.

#### Frontend Import Examples

```typescript
// apps/web/src/modules/auth/features/forms/login-form/login-form.tsx

// 1. External libraries
import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

// 2. Internal absolute imports - packages
import { LoginDocument } from '@/packages/api/graphql'
import { CardContent, Form, FormField } from '@/packages/components'
import { PATHS } from '@/packages/config'
import { useAutoValidateForm } from '@/packages/hooks'
import { useTranslations } from '@/packages/libs/i18n'
import { cn } from '@/packages/utils'

// 3. Internal absolute imports - module-specific
import { useAuthStore } from '@/auth/shared/libs/store'
import { TLoginFormSchema, makeLoginFormSchema } from '@/auth/shared/schemas'
import { TStatus } from '@/auth/shared/types'

// 4. Relative imports (same folder)
import { TwoFactorStep } from './2fa-step'
import { LoginStep } from './login-step'
```

```typescript
// apps/web/src/packages/components/features/appearence/change-theme.tsx

// 1. External libraries
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

// 2. Internal absolute imports
import { Button } from '@/packages/components'
import { cn } from '@/packages/utils'

// Component implementation
export function ChangeTheme({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  // ...
}
```

```typescript
// apps/web/src/modules/auth/widgets/auth-form.tsx

// 1. External libraries
import { useMutation } from '@apollo/client/react'
import { Loader } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ComponentProps, useEffect, useState } from 'react'
import { toast } from 'sonner'

// 2. Internal absolute imports - packages
import { VerificationEmailDocument } from '@/packages/api/graphql'
import { Card } from '@/packages/components'
import { PATHS } from '@/packages/config'
import { useTranslations } from '@/packages/libs/i18n'
import { cn } from '@/packages/utils'

// 3. Internal absolute imports - auth module
import {
  ChangePasswordForm,
  CreateAccountForm,
  LoginForm,
  ResetPasswordForm
} from '@/auth/features'
import { FormFooter, FormHeader } from '@/auth/shared/components'
import { useAuthStore } from '@/auth/shared/libs/store'
import type { TAuthFormType } from '@/auth/shared/types'
```

#### Backend Import Examples

```typescript
// apps/api/src/modules/auth/2fa/services/2fa-method.service.ts

// 1. External libraries
import { encode } from 'hi-base32'
import { randomBytes } from 'node:crypto'
import { TOTP } from 'otpauth'
import * as QRCode from 'qrcode'

// 2. NestJS and Prisma
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException
} from '@nestjs/common'
import {
  E2FAMethod,
  ESecurityEvent,
  Prisma,
  type User
} from '@prisma/__generated__'

// 3. Internal absolute imports - core
import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { MailService, SmsService } from '@/core/provider'
import { RedisService } from '@/core/redis'

// 4. Internal absolute imports - other modules
import { NotificationService } from '@/modules/notification'

// 5. Internal absolute imports - shared
import { HashUtil } from '@/shared/utils'

// 6. Relative imports (same module)
import { OTP_CONFIG, TOTP_CONFIG } from '../constants'
import type { CompleteTotpSetupInput, SetupOtpInput } from '../dtos'
import type { IOtpEmailMethodData, ITotpMethodData } from '../types'
import { EncryptionUtil } from '../utils'

// 7. Relative imports (same folder)
import { BackupCodeService } from './backup-code.service'
import { SecurityEventService } from './security-event.service'
```

```typescript
// apps/api/src/modules/user/user.resolver.ts

// 1. NestJS
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

// 2. Internal absolute imports - core
import { I18nService } from '@/core/i18n'

// 3. Internal absolute imports - shared
import { Authorization, CurrentUser } from '@/shared/decorators'

// 4. Relative imports (same module)
import { CreateUserInput, UpdateUserInput } from './dto'
import { UserModel } from './models'
import { UserService } from './user.service'
```

#### Import Rules Summary

| Rule | Example |
|------|---------|
| ✅ Use absolute imports for cross-module | `import { Button } from '@/packages/components'` |
| ✅ Use absolute imports for utilities | `import { cn } from '@/packages/utils'` |
| ✅ Use module aliases for features | `import { useAuthStore } from '@/auth/shared/libs/store'` |
| ✅ Use relative imports for same folder | `import { LoginStep } from './login-step'` |
| ✅ Use relative imports for same module | `import { UserService } from '../user.service'` |
| ❌ Never use default imports | `import Button from './button'` ❌ |
| ❌ Don't use relative imports for other modules | `import Button from '../../packages/components/button'` ❌ |

### 6. Folder Structure Patterns

#### Component Folder Patterns

**Single component** (no sub-components):
```
button.tsx          # Component implementation + exports
```

**Component with sub-components** (complex):
```
logo-icon/
├── logo-full.tsx   # Sub-component 1
├── logo-icon.tsx   # Sub-component 2
├── logo-mini.tsx   # Sub-component 3
├── logo-text.tsx   # Sub-component 4
└── index.ts        # Re-exports all sub-components
```

**Feature module** (with forms, components, etc.):
```
auth/
├── features/              # Feature-specific components
│   ├── forms/
│   │   ├── login-form/
│   │   │   ├── login-form.tsx
│   │   │   ├── login-step.tsx
│   │   │   ├── 2fa-step.tsx
│   │   │   └── index.ts
│   │   ├── contact-form.tsx
│   │   └── index.ts
│   ├── status-message.tsx
│   └── index.ts
├── shared/
│   ├── components/       # Shared components
│   │   ├── footer.tsx
│   │   ├── header.tsx
│   │   └── index.ts
│   ├── libs/            # Libraries (store, i18n)
│   │   ├── store/
│   │   │   ├── auth.store.ts
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   └── i18n/
│   │       ├── locales/
│   │       └── index.ts
│   └── index.ts
├── widgets/             # Complex composed components
│   ├── auth-form.tsx
│   └── index.ts
├── pages/              # Page components
│   ├── login.tsx
│   ├── register.tsx
│   └── index.ts
└── index.ts            # Re-exports public API
```

#### Backend Module Pattern

```
auth/
├── 2fa/                    # Sub-module
│   ├── constants/
│   │   ├── 2fa.constants.ts
│   │   └── index.ts
│   ├── dtos/
│   │   ├── setup-totp.dto.ts
│   │   └── index.ts
│   ├── guards/
│   │   ├── 2fa-verified.guard.ts
│   │   └── index.ts
│   ├── models/
│   │   ├── 2fa-method.model.ts
│   │   └── index.ts
│   ├── resolvers/
│   │   ├── 2fa.resolver.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── 2fa-method.service.ts
│   │   ├── backup-code.service.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── method-data.types.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── encryption.util.ts
│   │   └── index.ts
│   ├── 2fa.module.ts
│   └── index.ts
├── dto/
│   ├── login.dto.ts
│   └── index.ts
├── services/
│   ├── auth.service.ts
│   └── index.ts
├── resolvers/
│   ├── auth.resolver.ts
│   └── index.ts
├── auth.module.ts
└── index.ts
```

### 7. Quick Reference

#### Checklist for New Component/Module

- [ ] File name in `kebab-case`
- [ ] Component/Class name in `PascalCase`
- [ ] Use **only named exports**
- [ ] Create `index.ts` in folder for re-exports
- [ ] Use `export * from './file'` in index.ts
- [ ] Group imports: external → internal absolute → relative
- [ ] Use `@/` aliases for cross-module imports
- [ ] Types prefixed with `I` (interfaces) or `T` (types)
- [ ] Enums prefixed with `E`
- [ ] Constants in `UPPER_SNAKE_CASE`

#### Common Mistakes to Avoid

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| `export default Button` | `export const Button = ...` |
| `ButtonComponent.tsx` | `button.tsx` |
| `import Button from './button'` | `import { Button } from './button'` |
| `../../packages/components/button` | `@/packages/components` |
| `export { default } from './button'` | `export * from './button'` |
| `interface ButtonProps` | `interface IButtonProps` |
| `type AuthState` | `type TAuthState` |
| `enum UserRole` | `enum EUserRole` |

---

## Basic Template

The **Basic Template** provides everything you need to start building a simple fullstack application. It includes core infrastructure without authentication or advanced features.

### What's Included

#### Backend
- ✅ NestJS setup with GraphQL (Apollo Server)
- ✅ Prisma ORM with PostgreSQL
- ✅ Basic i18n configuration (i18next)
- ✅ Simple session management (memory store)
- ✅ CORS and security headers (Helmet)
- ✅ Basic User CRUD module
- ✅ GraphQL queries and mutations

#### Frontend
- ✅ Next.js 16 with App Router
- ✅ Tailwind CSS 4 with @theme inline
- ✅ Apollo Client for GraphQL
- ✅ i18n (next-intl)
- ✅ Theme system (light/dark mode)
- ✅ Type-safe routing
- ✅ Basic UI components (Button, Input, Card, Form)

### What's NOT Included

The Basic Template does NOT include:
- ❌ Redis (sessions use memory store)
- ❌ Authentication module
- ❌ Email service
- ❌ Protected routes
- ❌ Advanced utilities (password hashing, debounce, etc.)
- ❌ Advanced components (Toast, Avatar, etc.)
- ❌ Docker setup

### When to Use Basic Template

Use the Basic Template when:
- Building a simple application or MVP
- Learning the stack
- Don't need user authentication yet
- Want minimal setup complexity
- Building internal tools or prototypes

### How to Generate with Basic Template

To generate an application using the Basic Template, follow these sections **in order**:

1. **[Backend Setup](#backend-setup)** - Follow all steps, **SKIP** Redis Service section (use memory sessions instead)
2. **[Frontend Setup](#frontend-setup)** - Follow all steps
3. **[Internationalization (i18n)](#internationalization-i18n)** - Follow all steps
4. **[Theme System](#theme-system)** - Follow all steps
5. **[Routing Configuration](#routing-configuration)** - Follow all steps
6. **[GraphQL Integration](#graphql-integration)** - Follow all steps

**SKIP these sections completely**:
- ❌ Authentication Module
- ❌ Email Service
- ❌ Dashboard & Protected Routes
- ❌ Utilities & Helpers
- ❌ Docker Setup
- ❌ Advanced Features

### Session Configuration for Basic Template

When following the Backend Setup, use this session configuration instead of Redis-backed sessions:

```typescript
// In src/main.ts - Use memory store instead of Redis
app.use(
  session({
    secret: config.get<string>('SESSION_SECRET') || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: new session.MemoryStore(), // Memory store for Basic Template
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: config.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
    },
  })
)
```

---

## Advanced Template

The **Advanced Template** includes everything from the Basic Template plus production-ready features for real applications.

### What's Included (Additional to Basic)

#### Backend
- ✅ **Redis** for sessions and caching
- ✅ **Complete authentication module** (email + password)
- ✅ **Email verification** with SMTP
- ✅ **Email service** (Nodemailer)
- ✅ **Auth guards and decorators** (@CurrentUser, @Authorization)
- ✅ **Password hashing** (Argon2 with OWASP 2023 params)
- ✅ **Session management service** with Redis
- ✅ **Utility functions** (ms, hash, Prisma error handlers)

#### Frontend
- ✅ **Authentication pages** (login, register, verify email, reset password)
- ✅ **Protected routes** with middleware
- ✅ **Dashboard page** with user profile
- ✅ **Auth store** (Zustand)
- ✅ **Form validation** (React Hook Form + Zod)
- ✅ **Advanced hooks** (useDebouncedCallback, useAutoValidateForm)
- ✅ **Utility functions** (cn, generateAbbreviation)
- ✅ **Advanced components** (Toast notifications, Spinner, Avatar)

#### Development
- ✅ **Docker setup** (PostgreSQL + Redis)
- ✅ **Complete .env** configuration
- ✅ **Production-ready** utilities and security

### When to Use Advanced Template

Use the Advanced Template when:
- Building a production application
- Need user authentication out of the box
- Need email verification
- Want production-ready utilities
- Need Redis for sessions and caching
- Want to save development time

### How to Generate with Advanced Template

To generate an application using the Advanced Template, follow **ALL** sections in order:

1. **[Backend Setup](#backend-setup)** - All steps (including Redis)
2. **[Frontend Setup](#frontend-setup)** - All steps
3. **[Internationalization (i18n)](#internationalization-i18n)** - All steps
4. **[Theme System](#theme-system)** - All steps
5. **[Routing Configuration](#routing-configuration)** - All steps
6. **[GraphQL Integration](#graphql-integration)** - All steps
7. **[Authentication Module](#authentication-module)** - All steps
8. **[Email Service](#email-service)** - All steps
9. **[Dashboard & Protected Routes](#dashboard--protected-routes)** - All steps
10. **[Utilities & Helpers](#utilities--helpers)** - All steps
11. **[Docker Setup](#docker-setup)** - All steps
12. **[Advanced Features](#advanced-features)** - All steps

### Quick Start with Advanced Template

1. **Start Docker services**: `docker compose up -d`
2. **Install dependencies**: `npm install` (in both apps/api and apps/web)
3. **Run Prisma migrations**: `cd apps/api && npx prisma migrate dev`
4. **Start backend**: `cd apps/api && npm run start:dev`
5. **Start frontend**: `cd apps/web && npm run dev`
6. **Visit**: `http://localhost:3000` and register a new account

---

## Backend Setup

### 1. Initialize Backend

```bash
# Create backend directory
mkdir -p apps/api
cd apps/api

# Initialize NestJS project
npm i -g @nestjs/cli
nest new . --skip-git
```

### 2. Install Dependencies

```json
{
  "name": "backend",
  "version": "0.0.1",
  "description": "Your App Backend",
  "private": true,
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "npm run migrate:run && nest start --watch",
    "start:prod": "node dist/main",
    "migrate:run": "prisma migrate deploy",
    "migrate:add": "prisma migrate dev --name",
    "prisma:generate": "npx prisma generate",
    "prisma:studio": "npx prisma studio"
  },
  "dependencies": {
    "@apollo/server": "^4.12.2",
    "@nestjs/apollo": "^13.1.0",
    "@nestjs/common": "^11.1.5",
    "@nestjs/config": "^4.0.2",
    "@nestjs/core": "^11.1.5",
    "@nestjs/graphql": "^13.1.0",
    "@nestjs/platform-express": "^11.1.5",
    "@prisma/client": "^6.17.1",
    "argon2": "^0.41.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "express-session": "^1.18.1",
    "graphql": "^16.11.0",
    "helmet": "^8.0.0",
    "i18next": "^25.3.2",
    "i18next-fs-backend": "^2.4.0",
    "i18next-http-middleware": "^3.7.0",
    "ioredis": "^5.4.1",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^11.1.5",
    "@types/express": "^5.0.0",
    "@types/express-session": "^1.18.0",
    "@types/node": "^22.0.0",
    "prisma": "^6.17.1",
    "ts-node": "^10.9.2",
    "typescript": "^5.8.3"
  }
}
```

### 3. Folder Structure

Create the following directory structure:

```bash
mkdir -p src/{core,modules,shared}
mkdir -p src/core/{config,prisma,redis,i18n}
mkdir -p src/modules/user
mkdir -p src/shared/{decorators,guards,utils}
mkdir -p locales/{en,ru}
```

### 4. Main Application Bootstrap (`src/main.ts`)

```typescript
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
import * as session from 'express-session'
import i18nextMiddleware from 'i18next-http-middleware'
import { AppModule } from './app.module'
import { i18n } from './core/config/i18n.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  })

  const config = app.get(ConfigService)

  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }))

  // i18n Middleware
  app.use(i18nextMiddleware.handle(i18n))

  // CORS
  const clientUrl = config.get<string>('CLIENT_URL') || 'http://localhost:3000'
  app.enableCors({
    origin: [clientUrl],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  })

  // Session
  app.use(
    session({
      secret: config.get<string>('SESSION_SECRET') || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: config.get<string>('NODE_ENV') === 'production',
        sameSite: 'lax',
      },
    })
  )

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  const port = config.get<number>('PORT') || 8000
  await app.listen(port)
  console.log(`🚀 Server running on http://localhost:${port}`)
  console.log(`🚀 GraphQL Playground: http://localhost:${port}/graphql`)
}

bootstrap()
```

### 5. App Module (`src/app.module.ts`)

```typescript
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { PrismaModule } from './core/prisma/prisma.module'
import { RedisModule } from './core/redis/redis.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      sortSchema: true,
      context: ({ req, res }) => ({ req, res }),
    }),

    // Core modules
    PrismaModule,
    RedisModule,

    // Business modules
    UserModule,
  ],
})
export class AppModule {}
```

### 6. Prisma Setup

**`prisma/schema.prisma`**:

```prisma
generator client {
  provider      = "prisma-client-js"
  output        = "./__generated__"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}

datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_URL")
}

// ============================================================================
// USER MODEL
// ============================================================================

model User {
  id String @id @default(uuid())

  // Profile fields
  fullName  String  @map("full_name")
  firstName String? @map("first_name")
  lastName  String? @map("last_name")
  email     String  @unique
  phone     String? @unique

  password String

  // Verification
  isEmailVerified Boolean   @default(false) @map("is_email_verified")
  emailVerifiedAt DateTime? @map("email_verified_at")

  // Account security
  lastLoginAt DateTime? @map("last_login_at")
  lastLoginIp String?   @map("last_login_ip")

  // Soft delete
  deletedAt DateTime? @map("deleted_at")

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([email])
  @@index([deletedAt])
  @@map("users")
}
```

**Prisma Service (`src/core/prisma/prisma.service.ts`)**:

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
```

**Prisma Module (`src/core/prisma/prisma.module.ts`)**:

```typescript
import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### 7. Redis Setup

**Redis Service (`src/core/redis/redis.service.ts`)**:

```typescript
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis

  constructor(private config: ConfigService) {
    this.client = new Redis({
      host: this.config.get<string>('REDIS_HOST') || 'localhost',
      port: this.config.get<number>('REDIS_PORT') || 6379,
      password: this.config.get<string>('REDIS_PASSWORD'),
      db: this.config.get<number>('REDIS_DB') || 0,
    })
  }

  getClient(): Redis {
    return this.client
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl)
    } else {
      await this.client.set(key, value)
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key)
  }

  async del(key: string): Promise<void> {
    await this.client.del(key)
  }

  onModuleDestroy() {
    this.client.disconnect()
  }
}
```

**Redis Module (`src/core/redis/redis.module.ts`)**:

```typescript
import { Global, Module } from '@nestjs/common'
import { RedisService } from './redis.service'

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
```

### 8. Backend i18n Configuration

**i18n Config (`src/core/config/i18n.config.ts`)**:

```typescript
import i18next from 'i18next'
import Backend from 'i18next-fs-backend'
import { resolve } from 'path'

export const initI18n = async () => {
  await i18next.use(Backend).init({
    lng: 'en',
    fallbackLng: 'en',
    preload: ['en', 'ru'],
    backend: {
      loadPath: resolve(__dirname, '../../../locales/{{lng}}/{{ns}}.json'),
    },
    ns: ['common', 'errors'],
    defaultNS: 'common',
  })
}

export const i18n = i18next
```

**Translation Files**:

`locales/en/common.json`:
```json
{
  "welcome": "Welcome",
  "user": {
    "created": "User created successfully",
    "notFound": "User not found"
  }
}
```

`locales/ru/common.json`:
```json
{
  "welcome": "Добро пожаловать",
  "user": {
    "created": "Пользователь успешно создан",
    "notFound": "Пользователь не найден"
  }
}
```

### 9. Environment Variables

**`.env.example`**:

```env
# App
NODE_ENV=development
PORT=8000
CLIENT_URL=http://localhost:3000

# Database
POSTGRES_URL=postgresql://user:password@localhost:5432/yourapp

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Session
SESSION_SECRET=your-super-secret-session-key
```

---

## Frontend Setup

### 1. Initialize Frontend

```bash
# Create frontend directory
mkdir -p apps/web
cd apps/web

# Initialize Next.js project
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
```

### 2. Install Dependencies

```json
{
  "name": "frontend",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "codegen": "graphql-codegen --config ./graphql.config.ts"
  },
  "dependencies": {
    "@apollo/client": "^4.0.5",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "apollo-upload-client": "^19.0.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "graphql": "^16.11.0",
    "graphql-ws": "^6.0.6",
    "lucide-react": "^0.554.0",
    "next": "^16.0.0",
    "next-intl": "^4.3.9",
    "next-themes": "^0.4.6",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "zustand": "^5.0.8"
  },
  "devDependencies": {
    "@graphql-codegen/cli": "^5.0.4",
    "@graphql-codegen/client-preset": "^4.5.1",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.9.2"
  }
}
```

### 3. Folder Structure

```bash
mkdir -p src/{app,packages,modules}
mkdir -p src/packages/{components,libs,config,utils,hooks}
mkdir -p src/packages/components/shared/ui
mkdir -p src/packages/libs/{apollo,i18n,store}
mkdir -p src/packages/config/routes
mkdir -p src/modules/auth
mkdir -p messages
```

### 4. Next.js Configuration

**`next.config.ts`**:

```typescript
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/packages/libs/i18n/request.ts')

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    serverSourceMaps: false
  }
}

export default withNextIntl(nextConfig)
```

**`tsconfig.json`**:

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 5. Tailwind CSS 4 Configuration

**`src/app/styles/globals.css`**:

```css
@import './vars/colors.css';
@import 'tailwindcss';

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* Breakpoints */
  --breakpoint-xs: 480px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 976px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1440px;

  /* Colors */
  --color-white: var(--white);
  --color-dark: var(--dark);
  --color-primary: var(--primary-500);
  --color-primary-50: var(--primary-50);
  --color-primary-100: var(--primary-100);
  --color-primary-200: var(--primary-200);
  --color-primary-300: var(--primary-300);
  --color-primary-400: var(--primary-400);
  --color-primary-500: var(--primary-500);
  --color-primary-600: var(--primary-600);
  --color-primary-700: var(--primary-700);
  --color-primary-800: var(--primary-800);
  --color-primary-900: var(--primary-900);
  --color-primary-950: var(--primary-950);

  --color-secondary: var(--secondary-500);
  --color-positive: var(--positive-500);
  --color-negative: var(--negative-500);

  --color-background: var(--white);
  --color-foreground: var(--dark);

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  /* Border Radius */
  --radius-sm: 0.125rem;
  --radius: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
}

/* Dark mode overrides */
.dark {
  --color-background: var(--dark);
  --color-foreground: var(--white);
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**`src/app/styles/vars/colors.css`**:

```css
:root {
  /* Base colors */
  --white: #fff;
  --dark: #1e1e1e;

  /* Primary */
  --primary-50: #eff5ff;
  --primary-100: #dbe8fe;
  --primary-200: #bfd7fe;
  --primary-300: #93bbfd;
  --primary-400: #609afa;
  --primary-500: #3b82f6;
  --primary-600: #2570eb;
  --primary-700: #1d64d8;
  --primary-800: #1e55af;
  --primary-900: #1e478a;
  --primary-950: #172e54;

  /* Secondary */
  --secondary-50: #ecfdf7;
  --secondary-100: #d1faec;
  --secondary-200: #a7f3da;
  --secondary-300: #6ee7bf;
  --secondary-400: #34d39e;
  --secondary-500: #10b981;
  --secondary-600: #059666;
  --secondary-700: #047852;
  --secondary-800: #065f42;
  --secondary-900: #064e36;
  --secondary-950: #022c1e;

  /* Positive */
  --positive-50: #f0fdf5;
  --positive-100: #dcfce8;
  --positive-200: #bbf7d1;
  --positive-300: #86efad;
  --positive-400: #4ade80;
  --positive-500: #22c55e;
  --positive-600: #16a34a;
  --positive-700: #15803c;
  --positive-800: #166533;
  --positive-900: #14532b;
  --positive-950: #052e14;

  /* Negative */
  --negative-50: #fef2f2;
  --negative-100: #fee2e2;
  --negative-200: #fecaca;
  --negative-300: #fca5a5;
  --negative-400: #f87171;
  --negative-500: #ef4444;
  --negative-600: #dc2626;
  --negative-700: #b91c1c;
  --negative-800: #991b1b;
  --negative-900: #7f1d1d;
  --negative-950: #450a0a;

  /* Gray */
  --gray-50: #f6f6f6;
  --gray-100: #efefef;
  --gray-200: #dcdcdc;
  --gray-300: #bdbdbd;
  --gray-400: #989898;
  --gray-500: #7c7c7c;
  --gray-600: #656565;
  --gray-700: #525252;
  --gray-800: #464646;
  --gray-900: #3d3d3d;
  --gray-950: #1e1e1e;
}
```

### 6. Root Layout

**`src/app/layout.tsx`**:

```typescript
import type { Metadata } from 'next'
import { ThemeProvider } from '@/packages/components/shared/providers/theme-provider'
import { ApolloWrapper } from '@/packages/libs/apollo/apollo-wrapper'
import '@/app/styles/globals.css'

export const metadata: Metadata = {
  title: 'Your App',
  description: 'Your app description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ApolloWrapper>
            {children}
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 7. Apollo Client Configuration

**`src/packages/libs/apollo/apollo-client.config.ts`**:

```typescript
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'
import { ErrorLink } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs'
import { createClient as createWsClient } from 'graphql-ws'

const isBrowser = typeof window !== 'undefined'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000/graphql'
const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8000/graphql'

// HTTP link with upload support
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

// WebSocket link (browser only)
const wsLink = isBrowser
  ? new GraphQLWsLink(
      createWsClient({
        url: WEBSOCKET_URL,
        lazy: true,
        retryAttempts: 10,
        shouldRetry: () => true
      })
    )
  : null

// Use WS for subscriptions, HTTP for queries/mutations
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

// Error handling
const errorLink = new ErrorLink(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    )
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`)
  }
})

export const client = new ApolloClient({
  ssrMode: !isBrowser,
  link: ApolloLink.from([errorLink, link]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { errorPolicy: 'all' },
    query: { errorPolicy: 'all' },
    mutate: { errorPolicy: 'all' }
  }
})
```

**`src/packages/libs/apollo/apollo-wrapper.tsx`**:

```typescript
'use client'

import { ApolloProvider } from '@apollo/client'
import { client } from './apollo-client.config'

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
```

### 8. Base UI Components

**Button (`src/packages/components/shared/ui/button.tsx`)**:

```typescript
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-600',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
        ghost: 'hover:bg-gray-100',
        destructive: 'bg-negative text-white hover:bg-negative-600',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={clsx(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

**Input (`src/packages/components/shared/ui/input.tsx`)**:

```typescript
import * as React from 'react'
import { clsx } from 'clsx'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={clsx(
          'flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm',
          'placeholder:text-gray-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
```

**Card (`src/packages/components/shared/ui/card.tsx`)**:

```typescript
import * as React from 'react'
import { clsx } from 'clsx'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      'rounded-lg border border-gray-200 bg-white p-6 shadow-sm',
      'dark:border-gray-800 dark:bg-gray-950',
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('flex flex-col space-y-1.5 pb-4', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={clsx('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx('pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

export { Card, CardHeader, CardTitle, CardContent }
```

---

## Internationalization (i18n)

### Backend (i18next)

Already configured in the Backend Setup section. Key points:

1. **Installation**: `i18next`, `i18next-http-middleware`, `i18next-fs-backend`
2. **Config**: `src/core/config/i18n.config.ts`
3. **Middleware**: Added in `main.ts`
4. **Translation files**: `locales/en/`, `locales/ru/`

**Usage in resolvers**:

```typescript
@Mutation(() => String)
async createUser(@I18n() i18n: I18nContext) {
  return i18n.t('user.created')
}
```

### Frontend (next-intl)

**1. Install**:

```bash
npm install next-intl
```

**2. i18n Configuration**:

**`src/packages/libs/i18n/config.ts`**:

```typescript
export const COOKIE_NAME = 'language'
export const languages = ['ru', 'en'] as const
export const defaultLanguage = 'en'

export type TLanguage = (typeof languages)[number]
```

**`src/packages/libs/i18n/request.ts`**:

```typescript
import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import { defaultLanguage, languages, COOKIE_NAME } from './config'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const locale = cookieStore.get(COOKIE_NAME)?.value || defaultLanguage

  // Validate locale
  const validLocale = languages.includes(locale as any) ? locale : defaultLanguage

  return {
    locale: validLocale,
    messages: (await import(`../../../../messages/${validLocale}.json`)).default,
  }
})
```

**3. Message Files**:

**`messages/en.json`**:

```json
{
  "common": {
    "welcome": "Welcome",
    "home": "Home",
    "login": "Login",
    "logout": "Logout"
  },
  "auth": {
    "email": "Email",
    "password": "Password",
    "signIn": "Sign In",
    "signUp": "Sign Up"
  }
}
```

**`messages/ru.json`**:

```json
{
  "common": {
    "welcome": "Добро пожаловать",
    "home": "Главная",
    "login": "Войти",
    "logout": "Выйти"
  },
  "auth": {
    "email": "Электронная почта",
    "password": "Пароль",
    "signIn": "Войти",
    "signUp": "Регистрация"
  }
}
```

**4. Usage in Components**:

```typescript
'use client'

import { useTranslations } from 'next-intl'

export function WelcomeMessage() {
  const t = useTranslations('common')

  return <h1>{t('welcome')}</h1>
}
```

**5. Language Switcher Component**:

**`src/packages/components/shared/features/language-switcher.tsx`**:

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { languages, COOKIE_NAME } from '@/packages/libs/i18n/config'

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter()

  const switchLanguage = (locale: string) => {
    document.cookie = `${COOKIE_NAME}=${locale}; path=/; max-age=31536000`
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <Button
          key={lang}
          variant={currentLocale === lang ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchLanguage(lang)}
        >
          {lang.toUpperCase()}
        </Button>
      ))}
    </div>
  )
}
```

---

## Theme System

### 1. Theme Provider

**`src/packages/components/shared/providers/theme-provider.tsx`**:

```typescript
'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

### 2. Theme Toggle Component

**`src/packages/components/shared/features/theme-toggle.tsx`**:

```typescript
'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '../ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </Button>
  )
}
```

### 3. CSS Variables for Themes

The theme system uses CSS variables defined in `globals.css` with dark mode overrides:

```css
/* Light mode (default) */
:root {
  --color-background: var(--white);
  --color-foreground: var(--dark);
}

/* Dark mode */
.dark {
  --color-background: var(--dark);
  --color-foreground: var(--white);
}
```

All shadows are also defined as CSS variables:

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

Use them in components:

```typescript
<div className="bg-background text-foreground shadow-lg">
  Content with theme-aware colors and shadows
</div>
```

---

## Routing Configuration

### 1. Typed Routes Helper

**`src/packages/config/routes/paths.ts`**:

```typescript
export const PATHS = {
  home: '/',
  auth: (page: string = ''): string => `/auth${page ? `/${page}` : ''}`,
  dashboard: (page: string = ''): string => `/dashboard${page ? `/${page}` : ''}`,
  settings: '/settings',
} as const

// Type-safe route helper
export type TRoute = keyof typeof PATHS
```

### 2. App Router Structure

Create the following directory structure:

```
src/app/
├── (root)/
│   └── page.tsx           # Home page
├── auth/
│   └── login/
│       └── page.tsx       # Login page
├── dashboard/
│   └── page.tsx           # Dashboard (protected)
└── layout.tsx             # Root layout
```

**Home Page (`src/app/(root)/page.tsx`)**:

```typescript
import { Button } from '@/packages/components/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/packages/components/shared/ui/card'
import { ThemeToggle } from '@/packages/components/shared/features/theme-toggle'
import Link from 'next/link'
import { PATHS } from '@/packages/config/routes/paths'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Your App</h1>
          <ThemeToggle />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Fullstack App</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This is a starter template with NestJS + Next.js + GraphQL
            </p>
            <div className="flex gap-4">
              <Link href={PATHS.auth('login')}>
                <Button>Login</Button>
              </Link>
              <Link href={PATHS.dashboard()}>
                <Button variant="outline">Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### 3. Navigation Component

**`src/packages/components/shared/features/navigation.tsx`**:

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { PATHS } from '@/packages/config/routes/paths'

const navItems = [
  { label: 'Home', href: PATHS.home },
  { label: 'Dashboard', href: PATHS.dashboard() },
  { label: 'Settings', href: PATHS.settings },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={clsx(
            'px-4 py-2 rounded-md transition-colors',
            pathname === item.href
              ? 'bg-primary text-white'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
```

### 4. Route Protection Pattern

**Middleware approach (`src/middleware.ts`)**:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/settings']
const publicRoutes = ['/', '/auth/login', '/auth/signup']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if user is authenticated (e.g., check cookie)
  const isAuthenticated = request.cookies.get('session')?.value

  // Redirect to login if accessing protected route without authentication
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Redirect to dashboard if accessing public route while authenticated
  if (publicRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## GraphQL Integration

### Backend GraphQL Setup

**1. User Module Structure**:

```
src/modules/user/
├── dto/
│   ├── create-user.input.ts
│   └── update-user.input.ts
├── models/
│   └── user.model.ts
├── user.service.ts
├── user.resolver.ts
└── user.module.ts
```

**2. User Model (`src/modules/user/models/user.model.ts`)**:

```typescript
import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
export class User {
  @Field(() => ID)
  id: string

  @Field()
  fullName: string

  @Field({ nullable: true })
  firstName?: string

  @Field({ nullable: true })
  lastName?: string

  @Field()
  email: string

  @Field({ nullable: true })
  phone?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
```

**3. Create User Input (`src/modules/user/dto/create-user.input.ts`)**:

```typescript
import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  fullName: string

  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string

  @Field({ nullable: true })
  phone?: string
}
```

**4. User Service (`src/modules/user/user.service.ts`)**:

```typescript
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/core/prisma/prisma.service'
import { CreateUserInput } from './dto/create-user.input'
import * as argon2 from 'argon2'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
    })
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }

  async create(data: CreateUserInput) {
    const hashedPassword = await argon2.hash(data.password)

    return this.prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
      },
    })
  }

  async delete(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
```

**5. User Resolver (`src/modules/user/user.resolver.ts`)**:

```typescript
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UserService } from './user.service'
import { User } from './models/user.model'
import { CreateUserInput } from './dto/create-user.input'

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  async getUsers() {
    return this.userService.findAll()
  }

  @Query(() => User, { name: 'user', nullable: true })
  async getUser(@Args('id') id: string) {
    return this.userService.findOne(id)
  }

  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserInput) {
    return this.userService.create(data)
  }

  @Mutation(() => User)
  async deleteUser(@Args('id') id: string) {
    return this.userService.delete(id)
  }
}
```

**6. User Module (`src/modules/user/user.module.ts`)**:

```typescript
import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserResolver } from './user.resolver'

@Module({
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
```

### Frontend GraphQL Setup

**1. GraphQL CodeGen Configuration**:

**`graphql.config.ts`**:

```typescript
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'http://localhost:8000/graphql',
  documents: ['src/**/*.gql'],
  generates: {
    './src/__generated__/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      }
    }
  },
  ignoreNoDocuments: true,
}

export default config
```

**2. GraphQL Operations**:

Create folder: `src/modules/user/api/graphql/`

**Get Users Query (`src/modules/user/api/graphql/get-users.gql`)**:

```graphql
query GetUsers {
  users {
    id
    fullName
    email
    phone
    createdAt
    updatedAt
  }
}
```

**Create User Mutation (`src/modules/user/api/graphql/create-user.gql`)**:

```graphql
mutation CreateUser($data: CreateUserInput!) {
  createUser(data: $data) {
    id
    fullName
    email
    phone
    createdAt
  }
}
```

**3. Generate Types**:

```bash
npm run codegen
```

**4. Usage in Components**:

**`src/modules/user/components/user-list.tsx`**:

```typescript
'use client'

import { useQuery } from '@apollo/client'
import { gql } from '@/__generated__'
import { Card, CardContent, CardHeader, CardTitle } from '@/packages/components/shared/ui/card'

const GET_USERS = gql(`
  query GetUsers {
    users {
      id
      fullName
      email
      phone
    }
  }
`)

export function UserList() {
  const { data, loading, error } = useQuery(GET_USERS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data?.users.map((user) => (
            <div key={user.id} className="p-4 border rounded-md">
              <p className="font-semibold">{user.fullName}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              {user.phone && <p className="text-sm text-gray-600">{user.phone}</p>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

**Create User Form (`src/modules/user/components/create-user-form.tsx`)**:

```typescript
'use client'

import { useMutation } from '@apollo/client'
import { gql } from '@/__generated__'
import { Button } from '@/packages/components/shared/ui/button'
import { Input } from '@/packages/components/shared/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/packages/components/shared/ui/card'
import { useState } from 'react'

const CREATE_USER = gql(`
  mutation CreateUser($data: CreateUserInput!) {
    createUser(data: $data) {
      id
      fullName
      email
    }
  }
`)

export function CreateUserForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  })

  const [createUser, { loading }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      alert('User created successfully!')
      setFormData({ fullName: '', email: '', password: '', phone: '' })
    },
    onError: (error) => {
      alert(`Error: ${error.message}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createUser({
      variables: {
        data: formData,
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create User</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Input
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create User'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

---

## Authentication Module

This section covers a complete authentication system with:
- User registration (email + password)
- Email verification
- Login/Logout
- Session management with Redis
- Password hashing with Argon2
- Email service integration
- Protected routes (frontend & backend)

### Backend Authentication Setup

#### 1. Update Prisma Schema

Add Token model for email verification:

**`prisma/schema.prisma`** (add to existing schema):

```prisma
// ============================================================================
// TOKEN MODEL (for email verification, password reset, etc.)
// ============================================================================

enum ETokenType {
  EMAIL_VERIFY
  PASSWORD_RESET
}

model Token {
  id        String      @id @default(uuid())
  token     String      @unique
  type      ETokenType
  userId    String      @map("user_id")
  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresIn DateTime    @map("expires_in")
  createdAt DateTime    @default(now()) @map("created_at")

  @@index([userId])
  @@index([token])
  @@index([expiresIn])
  @@map("tokens")
}

// Update User model to include tokens relation
model User {
  // ... existing fields ...
  tokens Token[]

  // ... rest of model ...
}
```

Run migration:

```bash
npx prisma migrate dev --name add_auth_tokens
npx prisma generate
```

#### 2. Auth Module Structure

Create the following structure:

```bash
mkdir -p src/modules/auth/{account,session,verification}
mkdir -p src/modules/auth/{account,session,verification}/{dto,models}
```

#### 3. Account Service (Registration & Profile)

**`src/modules/auth/account/dto/create-account.input.ts`**:

```typescript
import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

@InputType()
export class CreateAccountInput {
  @Field()
  @IsNotEmpty()
  fullName: string

  @Field()
  @IsEmail()
  email: string

  @Field()
  @MinLength(8)
  @IsNotEmpty()
  password: string
}
```

**`src/modules/auth/account/models/user.model.ts`**:

```typescript
import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
export class User {
  @Field(() => ID)
  id: string

  @Field()
  fullName: string

  @Field()
  email: string

  @Field()
  isEmailVerified: boolean

  @Field({ nullable: true })
  emailVerifiedAt?: Date

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
```

**`src/modules/auth/account/account.service.ts`**:

```typescript
import { Injectable, ConflictException } from '@nestjs/common'
import { PrismaService } from '@/core/prisma/prisma.service'
import * as argon2 from 'argon2'
import { CreateAccountInput } from './dto/create-account.input'
import { User } from './models/user.model'
import { VerificationService } from '../verification/verification.service'

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private verification: VerificationService,
  ) {}

  async create(input: CreateAccountInput, lng: string = 'en'): Promise<User> {
    const email = input.email.trim().toLowerCase()

    // Check if user exists
    const existing = await this.prisma.user.findUnique({
      where: { email }
    })

    if (existing) {
      throw new ConflictException('Email already in use')
    }

    // Hash password
    const hashedPassword = await argon2.hash(input.password)

    // Create user
    const user = await this.prisma.user.create({
      data: {
        fullName: input.fullName,
        email,
        password: hashedPassword,
      },
    })

    // Send verification email (non-blocking)
    await this.verification.sendEmailVerificationToken(user, lng).catch((err) => {
      console.error('Failed to send verification email:', err)
    })

    return user as User
  }

  async me(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    }) as Promise<User | null>
  }
}
```

**`src/modules/auth/account/account.resolver.ts`**:

```typescript
import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { AccountService } from './account.service'
import { User } from './models/user.model'
import { CreateAccountInput } from './dto/create-account.input'
import { AuthGuard } from '@/shared/guards/auth.guard'
import { CurrentUser } from '@/shared/decorators/current-user.decorator'

@Resolver(() => User)
export class AccountResolver {
  constructor(private accountService: AccountService) {}

  @Mutation(() => User)
  async createAccount(
    @Args('data') data: CreateAccountInput,
    @Context('lng') lng: string,
  ) {
    return this.accountService.create(data, lng)
  }

  @Query(() => User, { nullable: true })
  @UseGuards(AuthGuard)
  async me(@CurrentUser('id') userId: string) {
    return this.accountService.me(userId)
  }
}
```

#### 4. Session Service (Login/Logout)

**`src/modules/auth/session/dto/login.input.ts`**:

```typescript
import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty } from 'class-validator'

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsNotEmpty()
  password: string
}
```

**`src/modules/auth/session/dto/login.response.ts`**:

```typescript
import { ObjectType, Field } from '@nestjs/graphql'
import { User } from '../../account/models/user.model'

@ObjectType()
export class LoginResponse {
  @Field(() => User)
  user: User
}
```

**`src/modules/auth/session/session.service.ts`**:

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '@/core/prisma/prisma.service'
import * as argon2 from 'argon2'
import { Request } from 'express'
import { LoginInput, LoginResponse } from './dto'

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async login(req: Request, data: LoginInput): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email.toLowerCase() }
    })

    if (!user) {
      throw new NotFoundException('Invalid email or password')
    }

    // Verify password
    const valid = await argon2.verify(user.password, data.password)
    if (!valid) {
      throw new NotFoundException('Invalid email or password')
    }

    // Check email verification
    if (!user.isEmailVerified) {
      throw new BadRequestException('Please verify your email before logging in')
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: req.ip,
      }
    })

    // Save session
    req.session.userId = user.id

    return { user }
  }

  async logout(req: Request): Promise<boolean> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }
}
```

**`src/modules/auth/session/session.resolver.ts`**:

```typescript
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { SessionService } from './session.service'
import { LoginInput, LoginResponse } from './dto'
import { AuthGuard } from '@/shared/guards/auth.guard'

@Resolver()
export class SessionResolver {
  constructor(private sessionService: SessionService) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args('data') data: LoginInput,
    @Context('req') req: any,
  ) {
    return this.sessionService.login(req, data)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async logout(@Context('req') req: any) {
    return this.sessionService.logout(req)
  }
}
```

#### 5. Verification Service (Email Verification)

**`src/modules/auth/verification/dto/verification.input.ts`**:

```typescript
import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@InputType()
export class VerificationInput {
  @Field()
  @IsNotEmpty()
  token: string
}
```

**`src/modules/auth/verification/verification.service.ts`**:

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '@/core/prisma/prisma.service'
import { MailService } from '@/core/provider/mail/mail.service'
import { randomBytes } from 'crypto'
import { User, ETokenType } from '@prisma/__generated__'
import { Request } from 'express'

@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  async sendEmailVerificationToken(user: User, lng: string = 'en') {
    // Generate token
    const token = randomBytes(32).toString('hex')
    const expiresIn = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Save token
    await this.prisma.token.create({
      data: {
        token,
        type: ETokenType.EMAIL_VERIFY,
        userId: user.id,
        expiresIn,
      }
    })

    // Send email
    await this.mail.sendVerificationEmail(user.email, token, lng)
  }

  async verifyEmail(req: Request, token: string): Promise<User> {
    // Find token
    const tokenRecord = await this.prisma.token.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!tokenRecord || tokenRecord.type !== ETokenType.EMAIL_VERIFY) {
      throw new NotFoundException('Invalid verification token')
    }

    // Check expiration
    if (new Date(tokenRecord.expiresIn) < new Date()) {
      throw new BadRequestException('Verification token expired')
    }

    // Update user and delete token
    const [user] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: tokenRecord.userId },
        data: {
          isEmailVerified: true,
          emailVerifiedAt: new Date(),
        }
      }),
      this.prisma.token.delete({
        where: { id: tokenRecord.id }
      })
    ])

    // Create session
    req.session.userId = user.id

    return user as User
  }
}
```

**`src/modules/auth/verification/verification.resolver.ts`**:

```typescript
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'
import { VerificationService } from './verification.service'
import { User } from '../account/models/user.model'
import { VerificationInput } from './dto/verification.input'

@Resolver()
export class VerificationResolver {
  constructor(private verification: VerificationService) {}

  @Mutation(() => User)
  async verifyEmail(
    @Args('data') data: VerificationInput,
    @Context('req') req: any,
  ) {
    return this.verification.verifyEmail(req, data.token)
  }
}
```

#### 6. Auth Guard

**`src/shared/guards/auth.guard.ts`**:

```typescript
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext().req

    if (!request.session?.userId) {
      throw new UnauthorizedException('Not authenticated')
    }

    return true
  }
}
```

#### 7. Current User Decorator

**`src/shared/decorators/current-user.decorator.ts`**:

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const CurrentUser = createParamDecorator(
  (field: string | undefined, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext().req
    const userId = request.session?.userId

    if (!userId) {
      return null
    }

    return field ? userId : { id: userId }
  },
)
```

#### 8. Auth Module

**`src/modules/auth/auth.module.ts`**:

```typescript
import { Module } from '@nestjs/common'
import { AccountService } from './account/account.service'
import { AccountResolver } from './account/account.resolver'
import { SessionService } from './session/session.service'
import { SessionResolver } from './session/session.resolver'
import { VerificationService } from './verification/verification.service'
import { VerificationResolver } from './verification/verification.resolver'

@Module({
  providers: [
    AccountService,
    AccountResolver,
    SessionService,
    SessionResolver,
    VerificationService,
    VerificationResolver,
  ],
  exports: [AccountService, SessionService, VerificationService],
})
export class AuthModule {}
```

Add to `app.module.ts`:

```typescript
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [
    // ... other imports
    AuthModule,
  ],
})
export class AppModule {}
```

---

## Email Service

### 1. Mail Service Setup

**Install dependencies**:

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

**`src/core/provider/mail/mail.service.ts`**:

```typescript
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private transporter: nodemailer.Transporter

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: this.config.get('SMTP_PORT'),
      secure: this.config.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    })
  }

  async sendVerificationEmail(email: string, token: string, lng: string = 'en') {
    const verifyUrl = `${this.config.get('CLIENT_URL')}/auth/verify?token=${token}`

    const subject = lng === 'ru' ? 'Подтвердите email' : 'Verify your email'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>${lng === 'ru' ? 'Подтверждение email' : 'Email Verification'}</h2>
        <p>${lng === 'ru' ? 'Спасибо за регистрацию! Пожалуйста, подтвердите ваш email адрес.' : 'Thank you for signing up! Please verify your email address.'}</p>
        <a href="${verifyUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          ${lng === 'ru' ? 'Подтвердить Email' : 'Verify Email'}
        </a>
        <p style="color: #666; font-size: 14px;">
          ${lng === 'ru' ? 'Если кнопка не работает, скопируйте эту ссылку:' : 'If the button doesn\'t work, copy this link:'}
        </p>
        <p style="color: #666; font-size: 12px; word-break: break-all;">${verifyUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          ${lng === 'ru' ? 'Эта ссылка действительна 24 часа.' : 'This link is valid for 24 hours.'}
        </p>
      </div>
    `

    await this.transporter.sendMail({
      from: this.config.get('SMTP_FROM'),
      to: email,
      subject,
      html,
    })

    this.logger.log(`Verification email sent to ${email}`)
  }
}
```

**`src/core/provider/mail/mail.module.ts`**:

```typescript
import { Global, Module } from '@nestjs/common'
import { MailService } from './mail.service'

@Global()
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
```

Add to `app.module.ts`:

```typescript
import { MailModule } from './core/provider/mail/mail.module'

@Module({
  imports: [
    // ... other imports
    MailModule,
  ],
})
export class AppModule {}
```

### 2. Environment Variables

Add to `.env`:

```env
# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Your App <noreply@yourapp.com>"
```

---

## Dashboard & Protected Routes

### Frontend Authentication

#### 1. Auth GraphQL Operations

**`src/modules/auth/api/graphql/create-account.gql`**:

```graphql
mutation CreateAccount($data: CreateAccountInput!) {
  createAccount(data: $data) {
    id
    fullName
    email
    isEmailVerified
    createdAt
  }
}
```

**`src/modules/auth/api/graphql/login.gql`**:

```graphql
mutation Login($data: LoginInput!) {
  login(data: $data) {
    user {
      id
      fullName
      email
      isEmailVerified
      createdAt
    }
  }
}
```

**`src/modules/auth/api/graphql/logout.gql`**:

```graphql
mutation Logout {
  logout
}
```

**`src/modules/auth/api/graphql/me.gql`**:

```graphql
query Me {
  me {
    id
    fullName
    email
    isEmailVerified
    createdAt
  }
}
```

**`src/modules/auth/api/graphql/verify-email.gql`**:

```graphql
mutation VerifyEmail($data: VerificationInput!) {
  verifyEmail(data: $data) {
    id
    fullName
    email
    isEmailVerified
  }
}
```

#### 2. Auth Store (Zustand)

**`src/packages/libs/store/auth.store.ts`**:

```typescript
import { create } from 'zustand'

interface User {
  id: string
  fullName: string
  email: string
  isEmailVerified: boolean
}

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null }),
}))
```

#### 3. Auth Provider

**`src/packages/components/shared/providers/auth-provider.tsx`**:

```typescript
'use client'

import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { gql } from '@/__generated__'
import { useAuthStore } from '@/packages/libs/store/auth.store'

const ME_QUERY = gql(`
  query Me {
    me {
      id
      fullName
      email
      isEmailVerified
    }
  }
`)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore()
  const { data, loading } = useQuery(ME_QUERY)

  useEffect(() => {
    if (!loading) {
      setUser(data?.me || null)
    }
  }, [data, loading, setUser])

  return <>{children}</>
}
```

Add to root layout:

```typescript
// src/app/layout.tsx
import { AuthProvider } from '@/packages/components/shared/providers/auth-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider {...}>
          <ApolloWrapper>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

#### 4. Login Form

**`src/modules/auth/components/login-form.tsx`**:

```typescript
'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { gql } from '@/__generated__'
import { Button } from '@/packages/components/shared/ui/button'
import { Input } from '@/packages/components/shared/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/packages/components/shared/ui/card'
import { useAuthStore } from '@/packages/libs/store/auth.store'
import { PATHS } from '@/packages/config/routes/paths'

const LOGIN_MUTATION = gql(`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      user {
        id
        fullName
        email
        isEmailVerified
      }
    }
  }
`)

export function LoginForm() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      setUser(data.login.user)
      router.push(PATHS.dashboard())
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ variables: { data: formData } })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-negative-50 text-negative-700 p-3 rounded-md text-sm">
              {error.message}
            </div>
          )}
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

#### 5. Register Form

**`src/modules/auth/components/register-form.tsx`**:

```typescript
'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { gql } from '@/__generated__'
import { Button } from '@/packages/components/shared/ui/button'
import { Input } from '@/packages/components/shared/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/packages/components/shared/ui/card'
import { PATHS } from '@/packages/config/routes/paths'

const CREATE_ACCOUNT_MUTATION = gql(`
  mutation CreateAccount($data: CreateAccountInput!) {
    createAccount(data: $data) {
      id
      email
    }
  }
`)

export function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' })
  const [createAccount, { loading, error }] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted: () => {
      alert('Account created! Please check your email to verify your account.')
      router.push(PATHS.auth('login'))
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createAccount({ variables: { data: formData } })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-negative-50 text-negative-700 p-3 rounded-md text-sm">
              {error.message}
            </div>
          )}
          <Input
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Password (min 8 characters)"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={8}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

#### 6. Dashboard Page

**`src/app/dashboard/page.tsx`**:

```typescript
'use client'

import { useAuthStore } from '@/packages/libs/store/auth.store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { gql } from '@/__generated__'
import { Card, CardContent, CardHeader, CardTitle } from '@/packages/components/shared/ui/card'
import { Button } from '@/packages/components/shared/ui/button'
import { PATHS } from '@/packages/config/routes/paths'

const LOGOUT_MUTATION = gql(`
  mutation Logout {
    logout
  }
`)

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, logout: clearUser } = useAuthStore()
  const [logout] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      clearUser()
      router.push(PATHS.auth('login'))
    },
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(PATHS.auth('login'))
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="text-2xl font-bold">{user.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p>{user.email}</p>
              {user.isEmailVerified ? (
                <span className="text-positive-600 text-sm">✓ Verified</span>
              ) : (
                <span className="text-negative-600 text-sm">⚠ Not verified</span>
              )}
            </div>
            <Button variant="outline" onClick={() => logout()}>
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

#### 7. Auth Pages

**`src/app/auth/login/page.tsx`**:

```typescript
import { LoginForm } from '@/modules/auth/components/login-form'
import Link from 'next/link'
import { PATHS } from '@/packages/config/routes/paths'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <LoginForm />
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href={PATHS.auth('register')} className="text-primary hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
```

**`src/app/auth/register/page.tsx`**:

```typescript
import { RegisterForm } from '@/modules/auth/components/register-form'
import Link from 'next/link'
import { PATHS } from '@/packages/config/routes/paths'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <RegisterForm />
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href={PATHS.auth('login')} className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
```

#### 8. Email Verification Page

**`src/app/auth/verify/page.tsx`**:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useMutation } from '@apollo/client'
import { gql } from '@/__generated__'
import { Card, CardContent, CardHeader, CardTitle } from '@/packages/components/shared/ui/card'
import { useAuthStore } from '@/packages/libs/store/auth.store'
import { PATHS } from '@/packages/config/routes/paths'

const VERIFY_EMAIL_MUTATION = gql(`
  mutation VerifyEmail($data: VerificationInput!) {
    verifyEmail(data: $data) {
      id
      fullName
      email
      isEmailVerified
    }
  }
`)

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const { setUser } = useAuthStore()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')

  const [verifyEmail] = useMutation(VERIFY_EMAIL_MUTATION, {
    onCompleted: (data) => {
      setUser(data.verifyEmail)
      setStatus('success')
      setTimeout(() => {
        router.push(PATHS.dashboard())
      }, 2000)
    },
    onError: () => {
      setStatus('error')
    },
  })

  useEffect(() => {
    if (token) {
      verifyEmail({ variables: { data: { token } } })
    } else {
      setStatus('error')
    }
  }, [token, verifyEmail])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'verifying' && <p>Verifying your email...</p>}
          {status === 'success' && (
            <div className="text-positive-600">
              <p className="font-semibold">Email verified successfully!</p>
              <p className="text-sm mt-2">Redirecting to dashboard...</p>
            </div>
          )}
          {status === 'error' && (
            <div className="text-negative-600">
              <p className="font-semibold">Verification failed</p>
              <p className="text-sm mt-2">Invalid or expired token</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

#### 9. Update Middleware for Route Protection

**`src/middleware.ts`**:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard']
const authRoutes = ['/auth/login', '/auth/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasSession = request.cookies.get('connect.sid')?.value

  // Redirect to login if accessing protected route without session
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !hasSession) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Redirect to dashboard if accessing auth routes with session
  if (authRoutes.some(route => pathname.startsWith(route)) && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## Utilities & Helpers

This section provides essential utility functions and custom hooks that will be used throughout your application.

### Backend Utilities

#### 1. Hash Utility (Argon2)

**`src/shared/utils/hash.util.ts`**:

```typescript
import { hash, verify } from 'argon2'

/**
 * Utility for hashing using Argon2id
 * Argon2id - recommended variant combining GPU and side-channel attack protection
 */
export class HashUtil {
  // Argon2id configuration (OWASP 2023 recommendations)
  private static readonly config = {
    memoryCost: 19456, // 19 MiB (in KiB)
    timeCost: 2, // 2 iterations
    parallelism: 1, // Number of threads
  }

  /**
   * Hash a string
   * @param plaintext - Original string
   * @returns Hashed string in Argon2 format
   */
  static async hash(plaintext: string): Promise<string> {
    return hash(plaintext, {
      memoryCost: this.config.memoryCost,
      timeCost: this.config.timeCost,
      parallelism: this.config.parallelism,
    })
  }

  /**
   * Verify a string against hash
   * @param hash - Hash to verify
   * @param plaintext - Original string
   * @returns true if matches
   */
  static async verify(hash: string, plaintext: string): Promise<boolean> {
    try {
      return verify(hash, plaintext)
    } catch {
      return false
    }
  }

  /**
   * Check if hash needs rehashing (if parameters are outdated)
   * @param hash - Current hash
   * @returns true if rehash needed
   */
  static needsRehash(hash: string): boolean {
    try {
      // Argon2 format: $argon2id$v=19$m=19456,t=2,p=1$...
      const params = hash.split('$')
      if (params.length < 5) return true

      const config = params[3]
      if (!config) return true

      const configParts = config.split(',')
      const m = parseInt(configParts[0]?.split('=')[1] ?? '0', 10)
      const t = parseInt(configParts[1]?.split('=')[1] ?? '0', 10)
      const p = parseInt(configParts[2]?.split('=')[1] ?? '0', 10)

      return (
        m !== this.config.memoryCost ||
        t !== this.config.timeCost ||
        p !== this.config.parallelism
      )
    } catch {
      return true
    }
  }
}
```

#### 2. Time Parsing Utility

**`src/shared/utils/ms.util.ts`**:

```typescript
const s = 1000
const m = s * 60
const h = m * 60
const d = h * 24
const w = d * 7
const y = d * 365.25

type Unit =
  | 'Years' | 'Year' | 'Yrs' | 'Yr' | 'Y'
  | 'Weeks' | 'Week' | 'W'
  | 'Days' | 'Day' | 'D'
  | 'Hours' | 'Hour' | 'Hrs' | 'Hr' | 'H'
  | 'Minutes' | 'Minute' | 'Mins' | 'Min' | 'M'
  | 'Seconds' | 'Second' | 'Secs' | 'Sec' | 's'
  | 'Milliseconds' | 'Millisecond' | 'Msecs' | 'Msec' | 'Ms'

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>

export type StringValue =
  | `${number}`
  | `${number}${UnitAnyCase}`
  | `${number} ${UnitAnyCase}`

/**
 * Convert string time value to milliseconds
 * @param str - String representing time, e.g., "1 hour", "60s", "500 milliseconds"
 * @returns Number of milliseconds
 * @example
 * ms('1 minute') // returns 60000
 * ms('2 hours')  // returns 7200000
 * ms('500 ms')   // returns 500
 */
export function ms(str: StringValue): number {
  if (typeof str !== 'string' || str.length === 0 || str.length > 100) {
    throw new Error('Value must be a string with length between 1 and 99')
  }

  const match = /^(?<value>-?(?:\d+)?\.?\d+) *(?<type>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str)

  const groups = match?.groups as { value: string; type?: string } | undefined
  if (!groups) return NaN

  const n = parseFloat(groups.value)
  const type = (groups.type || 'ms').toLowerCase() as Lowercase<Unit>

  switch (type) {
    case 'years': case 'year': case 'yrs': case 'yr': case 'y':
      return n * y
    case 'weeks': case 'week': case 'w':
      return n * w
    case 'days': case 'day': case 'd':
      return n * d
    case 'hours': case 'hour': case 'hrs': case 'hr': case 'h':
      return n * h
    case 'minutes': case 'minute': case 'mins': case 'min': case 'm':
      return n * m
    case 'seconds': case 'second': case 'secs': case 'sec': case 's':
      return n * s
    case 'milliseconds': case 'millisecond': case 'msecs': case 'msec': case 'ms':
      return n
    default:
      throw new Error(`Unrecognized time unit: ${type}`)
  }
}
```

#### 3. Prisma Error Handler

**`src/shared/utils/prisma-errors.ts`**:

```typescript
import { Prisma } from '@prisma/client'

/**
 * Check if error is a Prisma error with specific code
 * @param error - Error object
 * @param code - Prisma error code (e.g., 'P2002' for unique constraint)
 * @returns true if matches
 */
export function isPrismaError(
  error: unknown,
  code: string
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === code
  )
}

/**
 * Get field name from Prisma unique constraint error
 * @param error - Prisma error
 * @returns Field name or 'unknown'
 */
export function getUniqueConstraintField(
  error: Prisma.PrismaClientKnownRequestError
): string {
  if (error.code === 'P2002') {
    const target = error.meta?.target as string[] | undefined
    return target?.[0] ?? 'unknown'
  }
  return 'unknown'
}
```

### Frontend Utilities

#### 1. Classname Merge Utility

**`src/packages/utils/tw-merge.ts`**:

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with proper precedence
 * @param inputs - Class names to merge
 * @returns Merged class string
 * @example
 * cn('px-4', 'px-6') // returns 'px-6'
 * cn('text-red-500', someCondition && 'text-blue-500') // conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Install dependencies**:
```bash
npm install clsx tailwind-merge
```

#### 2. Generate Abbreviation

**`src/packages/utils/generate-abbreviation.ts`**:

```typescript
/**
 * Generate abbreviation from name for avatars
 * @param input - Full name string
 * @returns Two-letter abbreviation
 * @example
 * generateAbbreviation("John Doe") // returns "JD"
 * generateAbbreviation("Alice") // returns "AL"
 */
export function generateAbbreviation(input: string): string {
  const words = input.trim().split(' ')

  if (words.length === 1) {
    // Single word: return first two characters
    return words[0].slice(0, 2).toUpperCase()
  } else if (words.length >= 2) {
    // Two+ words: first character of first two words
    return (words[0][0] + words[1][0]).toUpperCase()
  }

  return ''
}
```

### Custom Hooks

#### 1. useDebouncedCallback

**`src/packages/hooks/use-debounce-callback.ts`**:

```typescript
import { useCallback, useEffect, useRef } from 'react'

type DebouncedFn<T extends any[]> = ((...args: T) => void) & {
  cancel: () => void
  flush: () => void
  pending: () => boolean
}

/**
 * Debounce callback hook
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function with cancel, flush, pending methods
 * @example
 * const debouncedSearch = useDebouncedCallback(
 *   (query: string) => fetchResults(query),
 *   300
 * )
 */
export function useDebouncedCallback<T extends any[]>(
  fn: (...args: T) => void,
  delay: number
): DebouncedFn<T> {
  const fnRef = useRef(fn)
  const delayRef = useRef(delay)

  useEffect(() => {
    fnRef.current = fn
    delayRef.current = delay
  }, [fn, delay])

  const timerRef = useRef<number | null>(null)
  const pendingRef = useRef(false)
  const lastArgsRef = useRef<T | null>(null)

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    pendingRef.current = false
    lastArgsRef.current = null
  }, [])

  const flush = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (lastArgsRef.current !== null) {
      fnRef.current(...lastArgsRef.current)
      lastArgsRef.current = null
      pendingRef.current = false
    }
  }, [])

  const pending = useCallback(() => pendingRef.current, [])

  useEffect(() => cancel, [cancel])

  const debounced = useCallback(
    (...args: T) => {
      lastArgsRef.current = args

      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }

      pendingRef.current = true

      timerRef.current = window.setTimeout(() => {
        if (lastArgsRef.current !== null) {
          fnRef.current(...lastArgsRef.current)
          lastArgsRef.current = null
        }
        pendingRef.current = false
        timerRef.current = null
      }, delayRef.current)
    },
    []
  ) as DebouncedFn<T>

  debounced.cancel = cancel
  debounced.flush = flush
  debounced.pending = pending

  return debounced
}
```

**Usage example**:

```typescript
'use client'

import { useState } from 'react'
import { useDebouncedCallback } from '@/packages/hooks/use-debounce-callback'
import { Input } from '@/packages/components/shared/ui/input'

export function SearchInput() {
  const [query, setQuery] = useState('')

  const debouncedSearch = useDebouncedCallback(
    (searchQuery: string) => {
      console.log('Searching for:', searchQuery)
      // Perform search API call
    },
    500
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    debouncedSearch(value)
  }

  return <Input value={query} onChange={handleChange} placeholder="Search..." />
}
```

#### 2. useAutoValidateForm

**`src/packages/hooks/use-auto-validation-form.ts`**:

```typescript
import { RefObject, useEffect, useRef } from 'react'
import { FieldValues, Path, UseFormReturn, useWatch } from 'react-hook-form'

/**
 * Automatically validate form fields as user types
 * @param form - React Hook Form instance
 * @param fieldNames - Fields to auto-validate
 * @param options - Configuration options
 * @example
 * const form = useForm<FormData>()
 * useAutoValidateForm(form, ['email', 'password'], { delay: 500 })
 */
export function useAutoValidateForm<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldNames: (keyof T)[],
  options?: {
    delay?: number
    suppressRef?: RefObject<boolean>
    validateEmpty?: boolean
  }
) {
  const { delay = 300, suppressRef, validateEmpty = false } = options || {}

  const watchedValues = useWatch({
    control: form.control,
    name: fieldNames as Path<T>[],
  }) as unknown as any[]

  const fieldNamesRef = useRef(fieldNames)
  fieldNamesRef.current = fieldNames

  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
    }

    if (suppressRef?.current) return

    timerRef.current = window.setTimeout(() => {
      if (suppressRef?.current) return

      const toValidate: (keyof T)[] = []

      fieldNamesRef.current.forEach((name, i) => {
        const val = watchedValues[i]
        const isEmpty =
          val === undefined ||
          val === null ||
          val === '' ||
          (typeof val === 'string' && val.trim() === '')

        if (validateEmpty || !isEmpty) {
          toValidate.push(name)
        }
      })

      if (toValidate.length > 0) {
        queueMicrotask(() => {
          form.trigger(toValidate as Path<T>[])
        })
      }
    }, delay)

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [watchedValues, delay, form])

  const cancel = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  return { cancel }
}
```

**Usage example**:

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAutoValidateForm } from '@/packages/hooks/use-auto-validation-form'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
})

type FormData = z.infer<typeof schema>

export function AutoValidatedForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  // Auto-validate email and password fields with 500ms delay
  useAutoValidateForm(form, ['email', 'password'], { delay: 500 })

  return (
    <form onSubmit={form.handleSubmit(console.log)}>
      {/* form fields */}
    </form>
  )
}
```

---

## Docker Setup

Complete Docker configuration for local development with PostgreSQL and Redis.

### 1. Docker Compose

**`docker-compose.yml`**:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:17-alpine
    container_name: yourapp-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_DB: ${DB_DATABASE:-yourapp}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-postgres} -d ${DB_DATABASE:-yourapp}"]
      interval: 5s
      timeout: 3s
      retries: 10
    networks:
      - app-network

  # Redis Cache
  redis:
    image: redis:8-alpine
    container_name: yourapp-redis
    restart: unless-stopped
    command: ["redis-server", "--appendonly", "yes"]
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 10
    networks:
      - app-network

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  app-network:
    driver: bridge
```

### 2. Environment Variables for Docker

Add to `.env`:

```env
# Database
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=yourapp
DB_HOST=localhost
DB_PORT=5432

# Full connection string
POSTGRES_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

### 3. Docker Commands

**Start services**:
```bash
docker-compose up -d
```

**Stop services**:
```bash
docker-compose down
```

**View logs**:
```bash
docker-compose logs -f
```

**Reset database** (caution: destroys all data):
```bash
docker-compose down -v
docker-compose up -d
```

### 4. Development Workflow

```bash
# 1. Start Docker services
docker-compose up -d

# 2. Run migrations
cd apps/api
npx prisma migrate dev

# 3. Start backend
npm run start:dev

# 4. Start frontend (in new terminal)
cd apps/web
npm run dev
```

---

## Advanced Features

### 1. Toast Notifications

**Install Sonner**:
```bash
npm install sonner
```

**`src/packages/components/shared/ui/sonner.tsx`**:

```typescript
'use client'

import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      richColors
      closeButton
      duration={4000}
    />
  )
}
```

Add to root layout:

```typescript
import { Toaster } from '@/packages/components/shared/ui/sonner'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

**Usage**:

```typescript
'use client'

import { toast } from 'sonner'

export function ExampleComponent() {
  const handleClick = () => {
    toast.success('Account created successfully!')
    toast.error('Failed to save changes')
    toast.info('Email sent to your inbox')
    toast.warning('Session will expire soon')
  }

  return <button onClick={handleClick}>Show Toast</button>
}
```

### 2. Loading Spinner Component

**`src/packages/components/shared/ui/spinner.tsx`**:

```typescript
import { cn } from '@/packages/utils/tw-merge'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-primary border-t-transparent',
        sizeClasses[size],
        className
      )}
    />
  )
}
```

**Usage**:

```typescript
import { Spinner } from '@/packages/components/shared/ui/spinner'

export function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}
```

### 3. Avatar Component

**`src/packages/components/shared/ui/avatar.tsx`**:

```typescript
import * as React from 'react'
import { cn } from '@/packages/utils/tw-merge'
import { generateAbbreviation } from '@/packages/utils/generate-abbreviation'

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  const showFallback = !src || imageError
  const abbreviation = fallback ? generateAbbreviation(fallback) : '??'

  return (
    <div
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full',
        sizeClasses[size],
        className
      )}
    >
      {showFallback ? (
        <div className="flex h-full w-full items-center justify-center bg-primary text-white font-semibold">
          {abbreviation}
        </div>
      ) : (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  )
}
```

**Usage**:

```typescript
<Avatar src="/avatar.jpg" fallback="John Doe" size="md" />
<Avatar fallback="Alice Smith" size="lg" />
```

### 4. Form with Validation

**Install dependencies**:
```bash
npm install react-hook-form @hookform/resolvers zod
```

**Example validated form**:

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/packages/components/shared/ui/button'
import { Input } from '@/packages/components/shared/ui/input'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export function ValidatedForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input {...register('email')} placeholder="Email" type="email" />
        {errors.email && (
          <p className="text-sm text-negative-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Input {...register('password')} placeholder="Password" type="password" />
        {errors.password && (
          <p className="text-sm text-negative-600 mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Input {...register('confirmPassword')} placeholder="Confirm Password" type="password" />
        {errors.confirmPassword && (
          <p className="text-sm text-negative-600 mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  )
}
```

---

## Architecture Guide

### Monorepo Structure

```
your-app/
├── apps/
│   ├── api/          # Backend (NestJS + GraphQL + Prisma)
│   └── web/          # Frontend (Next.js + Apollo Client)
├── docs/             # Documentation
├── docker-compose.yml
└── README.md
```

### Backend Organization (`apps/api/src/`)

```
src/
├── core/             # Infrastructure layer
│   ├── config/       # Configuration files (i18n, helmet, session)
│   ├── prisma/       # Prisma service
│   ├── redis/        # Redis service
│   └── i18n/         # Internationalization
│
├── modules/          # Business logic layer
│   ├── user/         # User module
│   │   ├── dto/      # Input types
│   │   ├── models/   # Output types (GraphQL objects)
│   │   ├── user.service.ts
│   │   ├── user.resolver.ts
│   │   └── user.module.ts
│   └── [feature]/    # Other feature modules
│
├── shared/           # Shared utilities
│   ├── decorators/   # Custom decorators
│   ├── guards/       # Auth guards, role guards
│   ├── pipes/        # Validation pipes
│   └── utils/        # Helper functions
│
├── app.module.ts     # Root module
└── main.ts           # Application entry point
```

**When to add code**:
- New feature → Create new module in `src/modules/[feature-name]/`
- Infrastructure service → Add to `src/core/`
- Shared utility → Add to `src/shared/utils/`
- Custom decorator → Add to `src/shared/decorators/`

### Frontend Organization (`apps/web/src/`)

```
src/
├── app/              # Next.js App Router
│   ├── (root)/       # Root route group
│   │   └── page.tsx  # Home page
│   ├── auth/         # Auth pages
│   ├── dashboard/    # Dashboard pages
│   ├── layout.tsx    # Root layout
│   └── styles/       # Global styles
│
├── packages/         # Shared code (internal packages)
│   ├── components/   # UI components
│   │   ├── shared/
│   │   │   ├── ui/         # Base UI components (Button, Input, Card)
│   │   │   ├── features/   # Feature components (Navigation, ThemeToggle)
│   │   │   └── providers/  # Context providers
│   │   └── widgets/  # Complex components
│   │
│   ├── libs/         # Libraries configuration
│   │   ├── apollo/   # Apollo Client setup
│   │   ├── i18n/     # Internationalization
│   │   └── store/    # Zustand stores
│   │
│   ├── config/       # Configuration
│   │   ├── routes/   # Route definitions
│   │   └── constants.ts
│   │
│   ├── utils/        # Helper functions
│   └── hooks/        # Custom React hooks
│
└── modules/          # Feature modules
    ├── auth/         # Authentication module
    │   ├── components/
    │   ├── api/
    │   │   └── graphql/  # .gql files
    │   └── hooks/
    └── user/         # User module
        ├── components/
        ├── api/
        └── hooks/
```

**When to add code**:
- New page → `src/app/[route]/page.tsx`
- New UI component → `src/packages/components/shared/ui/[component].tsx`
- New feature module → `src/modules/[feature-name]/`
- New GraphQL operation → `src/modules/[feature]/api/graphql/[operation].gql`
- New custom hook → `src/packages/hooks/` or `src/modules/[feature]/hooks/`
- New utility function → `src/packages/utils/`

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Button.tsx`, `UserList.tsx` |
| Files | kebab-case | `user.service.ts`, `create-user.input.ts` |
| Folders | kebab-case | `auth-module/`, `user-profile/` |
| Variables | camelCase | `userName`, `isLoading` |
| Constants | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRIES` |
| Types/Interfaces | PascalCase with prefix | `IUser`, `TUserRole` |
| GraphQL files | kebab-case.gql | `get-users.gql`, `create-user.gql` |

### File Organization Best Practices

1. **Colocation**: Keep related files close together (component + styles + tests)
2. **Index files**: Use `index.ts` for clean imports
3. **Separation of concerns**: Business logic in services, UI in components
4. **Shared code**: If used in 3+ places, move to `packages/` or `shared/`
5. **Feature modules**: Group related functionality in modules
6. **API layer**: Separate GraphQL operations from components

### Development Workflow

1. **Start backend**:
```bash
cd apps/api
npm run start:dev
```

2. **Start frontend**:
```bash
cd apps/web
npm run dev
```

3. **Run database migrations**:
```bash
cd apps/api
npx prisma migrate dev --name your_migration_name
```

4. **Generate GraphQL types**:
```bash
cd apps/web
npm run codegen
```

5. **Access tools**:
- Frontend: http://localhost:3000
- Backend GraphQL Playground: http://localhost:8000/graphql
- Prisma Studio: `npx prisma studio`

---

## Summary

You now have a **complete production-ready fullstack application** template with:

✅ **Backend**: NestJS + GraphQL + Prisma + Redis + i18next
✅ **Frontend**: Next.js 16 + Tailwind CSS 4 + Apollo Client
✅ **Authentication**: Complete auth module with registration, login, email verification
✅ **Email Service**: SMTP integration with verification emails
✅ **Session Management**: Redis-based sessions with cookie support
✅ **Security**: Argon2 password hashing, protected routes, auth guards
✅ **i18n**: Multi-language support (backend & frontend)
✅ **Theme**: Light/Dark mode with CSS variables and shadows
✅ **Routing**: Type-safe routing with protection middleware
✅ **GraphQL**: Complete setup with code generation
✅ **State Management**: Zustand for auth state
✅ **Dashboard**: Protected dashboard page with user profile
✅ **Architecture**: Clean, scalable folder structure

### What You Can Build Immediately

With this template, you can start building:
- SaaS applications
- E-commerce platforms
- Social networks
- Admin dashboards
- Internal tools
- Any web application requiring user authentication

### Next Steps

1. **Extend Authentication**: Add password reset, social auth (Google, GitHub)
2. **Add Form Validation**: Use React Hook Form + Zod for complex forms
3. **Add File Upload**: Implement avatar uploads with Cloudinary/S3
4. **Add Testing**: Jest + React Testing Library + Supertest
5. **Add Docker**: Containerize the application
6. **Add CI/CD**: GitHub Actions or similar
7. **Add Analytics**: Track user events and metrics
8. **Add Payments**: Integrate Stripe for subscriptions

### Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app)
- [next-themes Documentation](https://github.com/pacocoursey/next-themes)

---

**Happy Coding!** 🚀
