# APP_GENERATOR_PROMPT.md - Documentation

**Version**: 2.0.0
**Last Updated**: 2025-12-12

---

## Overview

This document provides comprehensive documentation for the APP_GENERATOR_PROMPT files - a universal prompt template system designed to generate complete fullstack applications from scratch based on the MedicHub architecture.

## Available Files

### 1. APP_GENERATOR_PROMPT.md (Main File)
The main prompt file with **modular structure** that includes:
- Complete documentation
- Two template options (Basic and Advanced)
- All implementation sections
- Naming conventions and code organization rules

### 2. APP_GENERATOR_PROMPT_FULL.md (Full Prompt)
A **single, complete prompt** file ready to copy-paste into AI assistants:
- Pre-configured for Advanced Template
- All features enabled
- No need to skip sections
- Ideal for quick project generation

### 3. APP_GENERATOR_PROMPT_DOCUMENTATION.md (This File)
Documentation explaining how to use the prompts effectively.

---

## Purpose

The APP_GENERATOR_PROMPT system serves as a **production-ready blueprint** that can be used to generate new fullstack applications with two template options:

### Basic Template
Minimal setup for simple applications, MVPs, and learning projects:
- Backend (NestJS + GraphQL + Prisma + PostgreSQL)
- Frontend (Next.js 16 + Tailwind CSS 4 + Apollo Client)
- i18n and theme system
- Basic UI components
- **No authentication or advanced features**

### Advanced Template
Complete setup for production applications:
- Everything in Basic Template, plus:
- Redis for sessions and caching
- Authentication module (email/password + verification)
- Email service (SMTP)
- Protected routes and dashboard
- Production-ready utilities
- Docker setup
- Advanced components

---

## When to Use Each Template

### Use Basic Template When:
- Building a simple application or MVP
- Learning the stack
- Don't need user authentication yet
- Want minimal setup complexity
- Building internal tools or prototypes
- Starting small and planning to add features later

### Use Advanced Template When:
- Building a production application
- Need user authentication out of the box
- Need email verification
- Want production-ready utilities
- Need Redis for sessions and caching
- Want to save development time
- Need all features immediately

---

## Quick Start Guide

### Option 1: Use the Full Prompt (Fastest)

1. Open [APP_GENERATOR_PROMPT_FULL.md](APP_GENERATOR_PROMPT_FULL.md)
2. Copy the **entire content**
3. Paste into your AI assistant (Claude, ChatGPT, etc.)
4. Add: "Generate a fullstack application following this specification"
5. The AI will generate all files with Advanced Template (all features)

### Option 2: Use the Main Prompt (Customizable)

1. Open [APP_GENERATOR_PROMPT.md](APP_GENERATOR_PROMPT.md)
2. Choose your template:
   - **Basic**: Follow only sections listed in "Basic Template"
   - **Advanced**: Follow all sections listed in "Advanced Template"
3. Copy sections as needed
4. Paste into your AI assistant
5. Specify which template you want to use

---

## What's New in Version 2.0

### Major Updates

1. **Template System**: Added Basic and Advanced template options
2. **Naming Conventions**: Complete section on file naming, exports, and imports
3. **Code Organization**: Detailed rules based on MedicHub patterns
4. **Full Prompt File**: New APP_GENERATOR_PROMPT_FULL.md for quick generation
5. **Improved Documentation**: This documentation file with clearer instructions

### New Section: Naming Conventions & Code Organization

This critical section includes:
- **File naming rules** for Frontend and Backend
- **Component and class naming** with examples
- **Export patterns** (CRITICAL: only named exports, no default exports)
- **Barrel export pattern** (index.ts files)
- **Import patterns** with path aliases
- **Folder structure patterns**
- **Quick reference** checklist and common mistakes

**Key Rules**:
- ✅ Files: `kebab-case` (e.g., `button.tsx`, `user.service.ts`)
- ✅ Components/Classes: `PascalCase` (e.g., `Button`, `UserService`)
- ✅ Exports: **Only named exports** (never default exports)
- ✅ Imports: Use `@/` path aliases for cross-module imports
- ✅ Barrel exports: Every folder has `index.ts` with `export * from './file'`

---

## When to Use This Prompt

Use this prompt template when:

1. **Starting a new fullstack project** that requires:
   - User authentication (Advanced only)
   - Multi-language support
   - Theme customization
   - GraphQL API
   - Modern React frontend

2. **Creating a new SaaS application** that needs:
   - Session management (Advanced only)
   - Email verification (Advanced only)
   - Protected routes (Advanced only)
   - Dashboard interface (Advanced only)

3. **Building an MVP** with production-ready architecture from day one

4. **Prototyping** a fullstack application with real-world features

5. **Learning** the MedicHub architecture and patterns (Basic)

## What's Included

### Core Infrastructure (Sections 1-5)

#### 1. Technology Stack
- **Backend**: NestJS 11+, Apollo Server 4+, Prisma 6+, PostgreSQL 17+, Redis 8+
- **Frontend**: Next.js 16, React 19+, Tailwind CSS 4, Apollo Client 4+
- **Key Libraries**: i18next, next-intl, next-themes, Zustand, React Hook Form, Zod

#### 2. Project Structure
```
project/
├── apps/
│   ├── api/              # Backend (NestJS)
│   │   └── src/
│   │       ├── core/     # Infrastructure (Prisma, Redis, i18n)
│   │       ├── modules/  # Business logic
│   │       └── shared/   # Utilities, guards, decorators
│   └── web/              # Frontend (Next.js)
│       └── src/
│           ├── app/      # Next.js App Router
│           ├── packages/ # Shared code (components, libs, utils)
│           └── modules/  # Feature modules
└── docs/
```

#### 3. Backend Setup (Section 4)
- **Complete NestJS bootstrap** with middleware chain:
  - Helmet security headers
  - CORS configuration
  - Express session with Redis
  - i18next internationalization
  - GraphQL Apollo Server

- **Prisma Schema** with base User model
- **GraphQL Configuration** (code-first approach)
- **Redis Service** for caching and sessions
- **Environment variables** (.env.example with all required vars)

**Key Files Generated**:
- `apps/api/src/main.ts` - Bootstrap with security middleware
- `apps/api/prisma/schema.prisma` - Database schema
- `apps/api/src/core/prisma/prisma.service.ts` - Prisma client
- `apps/api/src/core/redis/redis.service.ts` - Redis client
- `apps/api/src/core/config/i18n.config.ts` - Backend i18n

#### 4. Frontend Setup (Section 5)
- **Next.js 16 App Router** configuration
- **Tailwind CSS 4** with @theme inline
- **Apollo Client** setup with cache configuration
- **Root layout** with providers
- **Base UI components**: Button, Input, Card

**Key Files Generated**:
- `apps/web/next.config.ts` - Next.js + next-intl plugin
- `apps/web/src/app/layout.tsx` - Root layout with providers
- `apps/web/src/app/styles/globals.css` - Tailwind CSS 4 with CSS variables
- `apps/web/src/packages/libs/apollo/apollo-client.ts` - Apollo Client
- `apps/web/src/packages/components/shared/ui/` - UI components

### Internationalization (Section 6)

#### Backend i18n (i18next)
- **Installation**: `i18next`, `i18next-http-middleware`, `i18next-fs-backend`
- **Translation files**: `apps/api/locales/en/`, `apps/api/locales/ru/`
- **Middleware integration** in main.ts
- **Usage in services**: Access translations via `req.t()`

**Example Usage**:
```typescript
// In GraphQL resolvers
@Query(() => String)
example(@Context('req') req: Request) {
  return req.t('welcome.message')
}
```

#### Frontend i18n (next-intl)
- **Installation**: `next-intl`
- **Messages**: `apps/web/messages/en.json`, `apps/web/messages/ru.json`
- **Language switcher** component
- **Cookie-based** language persistence

**Example Usage**:
```typescript
// In React components
import { useTranslations } from 'next-intl'

export default function Page() {
  const t = useTranslations('common')
  return <h1>{t('welcome')}</h1>
}
```

### Theme System (Section 7)

Complete dark mode implementation with:

#### CSS Variables
```css
@theme inline {
  /* Colors */
  --color-primary: oklch(0.57 0.22 260);
  --color-background: oklch(1 0 0);

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

@custom-variant dark (&:is(.dark *));
```

#### Components
- **ThemeProvider** component wrapping the app
- **ThemeToggle** button component
- **Dark mode styling** examples

**Key Features**:
- Automatic system theme detection
- Cookie-based theme persistence
- Smooth theme transitions
- CSS variable-based theming

### Routing (Section 8)

#### Type-Safe Routes
```typescript
export const PATHS = {
  home: '/',
  auth: (page = '') => `/auth${page ? `/${page}` : ''}`,
  dashboard: '/dashboard',
} as const
```

#### Components Generated
- Navigation component with active state
- Route protection pattern (middleware)
- App Router structure with (root) and auth groups

**Benefits**:
- Type-safe route definitions
- Autocomplete for routes
- Centralized route management
- Easy refactoring

### GraphQL Integration (Section 9)

#### Backend (Resolvers + Services)
- **User Resolver** with queries and mutations
- **User Service** with business logic
- **DTOs** (CreateUserInput, UpdateUserInput)
- **GraphQL Models** (User output type)

**Example**:
```typescript
@Query(() => [User])
async users() {
  return this.userService.findAll()
}

@Mutation(() => User)
async createUser(@Args('data') data: CreateUserInput) {
  return this.userService.create(data)
}
```

#### Frontend (.gql files + hooks)
- **GraphQL files**: `getUsers.gql`, `createUser.gql`
- **Apollo Client usage** in components
- **GraphQL CodeGen** configuration
- **Type-safe hooks**: `useGetUsersQuery()`, `useCreateUserMutation()`

**Example**:
```typescript
// Auto-generated type-safe hook
const { data, loading } = useGetUsersQuery()
const [createUser] = useCreateUserMutation()
```

## Authentication System (Sections 10-12)

### Section 10: Authentication Module (Backend)

Complete authentication system with:

#### Prisma Token Model
```prisma
model Token {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  type      TokenType
  expiresAt DateTime
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum TokenType {
  EMAIL_VERIFICATION
  PASSWORD_RESET
}
```

#### Services

**AccountService** (`apps/api/src/modules/auth/services/account.service.ts`):
- User registration with email verification
- Profile management
- Password hashing with Argon2

**SessionService** (`apps/api/src/modules/auth/services/session.service.ts`):
- Login with email + password
- Session management with Redis
- Logout functionality

**VerificationService** (`apps/api/src/modules/auth/services/verification.service.ts`):
- Email verification token generation
- Token validation and expiration
- Email sending integration

#### Guards & Decorators

**AuthGuard** (`apps/api/src/modules/auth/guards/auth.guard.ts`):
```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context)
    const { req } = ctx.getContext()
    return req.session?.userId != null
  }
}
```

**@CurrentUser** decorator:
```typescript
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req.session.userId
  }
)
```

#### Auth Module Structure
```
apps/api/src/modules/auth/
├── guards/
│   └── auth.guard.ts
├── decorators/
│   └── current-user.decorator.ts
├── services/
│   ├── account.service.ts
│   ├── session.service.ts
│   └── verification.service.ts
├── resolvers/
│   └── auth.resolver.ts
├── dto/
│   ├── register.input.ts
│   ├── login.input.ts
│   └── verify-email.input.ts
└── auth.module.ts
```

### Section 11: Email Service

#### SMTP Configuration
Environment variables for email:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourapp.com
```

#### MailService
**Location**: `apps/api/src/core/mail/mail.service.ts`

**Features**:
- Nodemailer integration
- HTML email templates
- Multilingual email support
- Email verification emails

**Example Usage**:
```typescript
await this.mailService.sendVerificationEmail(
  user.email,
  user.name,
  token,
  req.language || 'en'
)
```

**Email Templates**:
- Verification email with CTA button
- Styled HTML emails
- Support for English and Russian

### Section 12: Dashboard & Protected Routes (Frontend)

#### Auth GraphQL Operations
**Files Generated**:
- `apps/web/src/modules/auth/graphql/register.gql`
- `apps/web/src/modules/auth/graphql/login.gql`
- `apps/web/src/modules/auth/graphql/verify-email.gql`
- `apps/web/src/modules/auth/graphql/logout.gql`
- `apps/web/src/modules/auth/graphql/me.gql`

#### Auth Store (Zustand)
**Location**: `apps/web/src/modules/auth/store/auth.store.ts`

```typescript
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void
}
```

#### Components Generated

**AuthProvider** (`apps/web/src/modules/auth/components/AuthProvider.tsx`):
- Fetches current user on mount
- Handles authentication state
- Provides loading states

**LoginForm** (`apps/web/src/modules/auth/components/LoginForm.tsx`):
- Email + password inputs
- Form validation
- Error handling
- Success redirect

**RegisterForm** (`apps/web/src/modules/auth/components/RegisterForm.tsx`):
- Name, email, password fields
- Password confirmation
- Email verification prompt

**VerifyEmailForm** (`apps/web/src/modules/auth/components/VerifyEmailForm.tsx`):
- Token input field
- Verification success/error handling

#### Pages

**Login** (`apps/web/src/app/auth/login/page.tsx`):
- Login form
- Link to registration
- Responsive layout

**Register** (`apps/web/src/app/auth/register/page.tsx`):
- Registration form
- Link to login
- Email verification notice

**Verify Email** (`apps/web/src/app/auth/verify/page.tsx`):
- Token verification
- Success/error states
- Redirect to login

**Dashboard** (`apps/web/src/app/dashboard/page.tsx`):
- Protected route
- User profile display
- Logout button

#### Middleware Protection
**Location**: `apps/web/src/middleware.ts`

```typescript
export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')

  if (isDashboard && !session) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
}
```

**Features**:
- Redirects unauthenticated users to login
- Redirects authenticated users away from auth pages
- Session-based protection

## Utilities & Helpers (Section 13)

### Backend Utilities

#### HashUtil
**Location**: `apps/api/src/shared/utils/hash.util.ts`

**Purpose**: Production-ready password hashing using Argon2

**Features**:
- OWASP 2023 recommended parameters:
  - Memory: 19456 KiB (~19 MiB)
  - Time: 2 iterations
  - Parallelism: 1 thread
- Automatic hash rehashing detection
- Type-safe interface

**Usage**:
```typescript
// Hash password
const hash = await HashUtil.hash('user-password')

// Verify password
const isValid = await HashUtil.verify(hash, 'user-password')

// Check if rehash needed (parameters changed)
if (HashUtil.needsRehash(hash)) {
  const newHash = await HashUtil.hash(plainPassword)
}
```

#### ms Utility
**Location**: `apps/api/src/shared/utils/ms.util.ts`

**Purpose**: Convert human-readable time strings to milliseconds

**Usage**:
```typescript
ms('1 hour')    // 3600000
ms('60s')       // 60000
ms('7 days')    // 604800000
ms('1h 30m')    // 5400000
```

**Common Use Cases**:
- Session TTL: `SESSION_MAX_AGE=7 days`
- Token expiration: `TOKEN_EXPIRES_IN=1 hour`
- Cache TTL: `CACHE_TTL=5 minutes`

#### Prisma Error Handler
**Location**: `apps/api/src/shared/utils/prisma-error.util.ts`

**Purpose**: Convert Prisma errors to user-friendly GraphQL errors

**Features**:
- Handles unique constraint violations
- Handles foreign key violations
- Handles record not found
- Provides meaningful error messages

**Usage**:
```typescript
try {
  await this.prisma.user.create({ data })
} catch (error) {
  throw handlePrismaError(error)
}
```

### Frontend Utilities

#### cn (Classname Merge)
**Location**: `apps/web/src/packages/utils/tw-merge.ts`

**Purpose**: Properly merge Tailwind CSS classes with precedence

**Usage**:
```typescript
// Later classes override earlier ones
cn('px-4 py-2', 'px-6') // Result: 'py-2 px-6'

// Conditional classes
cn('btn', isActive && 'btn-active')

// Complex merging
cn(
  'bg-primary text-white',
  disabled && 'opacity-50 cursor-not-allowed',
  className // Allow prop override
)
```

**Why It's Essential**:
- Prevents Tailwind class conflicts
- Proper precedence handling
- Cleaner conditional styling

#### generateAbbreviation
**Location**: `apps/web/src/packages/utils/generate-abbreviation.ts`

**Purpose**: Generate 2-letter abbreviations from names

**Usage**:
```typescript
generateAbbreviation('John Doe')      // 'JD'
generateAbbreviation('Alice')         // 'AL'
generateAbbreviation('Bob Smith Jr.') // 'BS'
```

**Common Use Cases**:
- Avatar fallback text
- User initials
- Placeholder graphics

### Custom Hooks

#### useDebouncedCallback
**Location**: `apps/web/src/packages/hooks/use-debounce-callback.ts`

**Purpose**: Debounce function calls with cancel and flush support

**Features**:
- Configurable delay
- Cancel pending calls
- Flush immediately
- Check pending status

**Usage**:
```typescript
const debouncedSearch = useDebouncedCallback(
  (query: string) => {
    fetchSearchResults(query)
  },
  500 // 500ms delay
)

// In component
<input onChange={(e) => debouncedSearch(e.target.value)} />

// Cancel pending
debouncedSearch.cancel()

// Execute immediately
debouncedSearch.flush()

// Check if pending
if (debouncedSearch.isPending()) {
  // Show loading indicator
}
```

**Common Use Cases**:
- Search inputs
- Resize handlers
- Scroll listeners
- Form auto-save

#### useAutoValidateForm
**Location**: `apps/web/src/packages/hooks/use-auto-validation-form.ts`

**Purpose**: Automatically validate form fields as user types

**Features**:
- Configurable delay (default 500ms)
- Optional validation suppression
- Empty value validation control
- Works with React Hook Form + Zod

**Usage**:
```typescript
const form = useForm<FormData>({
  resolver: zodResolver(schema)
})

// Auto-validate specific fields
useAutoValidateForm(form, ['email', 'password'], {
  delay: 500,
  validateEmpty: false
})

// Result: Fields validate 500ms after user stops typing
```

**Benefits**:
- Better UX (instant feedback)
- Reduces manual validation code
- Configurable behavior
- Works with any Zod schema

## Docker Setup (Section 14)

### docker-compose.yml
**Location**: `docker-compose.yml` (project root)

**Services Included**:

#### PostgreSQL 17
```yaml
postgres:
  image: postgres:17-alpine
  ports:
    - '5432:5432'
  environment:
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
    POSTGRES_DB: myapp_db
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

#### Redis 8
```yaml
redis:
  image: redis:8-alpine
  ports:
    - '6379:6379'
  volumes:
    - redis_data:/data
```

### Environment Variables
```env
# PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myapp_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Commands

**Start services**:
```bash
docker compose up -d
```

**Stop services**:
```bash
docker compose down
```

**View logs**:
```bash
docker compose logs -f
```

**Reset database**:
```bash
docker compose down -v
docker compose up -d
```

### Development Workflow

1. Start Docker services: `docker compose up -d`
2. Run Prisma migrations: `npm run prisma:migrate:dev`
3. Seed database (optional): `npm run prisma:seed`
4. Start backend: `npm run dev:api`
5. Start frontend: `npm run dev:web`

## Advanced Features (Section 15)

### Toast Notifications (Sonner)

**Installation**: `sonner`

**Setup**:
```typescript
// In root layout
import { Toaster } from 'sonner'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
```

**Usage**:
```typescript
import { toast } from 'sonner'

// Success
toast.success('User created successfully')

// Error
toast.error('Failed to create user')

// Loading
const toastId = toast.loading('Creating user...')
// Later...
toast.success('User created', { id: toastId })

// Promise
toast.promise(
  createUser(),
  {
    loading: 'Creating user...',
    success: 'User created',
    error: 'Failed to create user'
  }
)
```

### Loading Spinner

**Location**: `apps/web/src/packages/components/shared/ui/Spinner.tsx`

**Usage**:
```typescript
<Spinner size="sm" /> // 16px
<Spinner size="md" /> // 24px (default)
<Spinner size="lg" /> // 32px

// In button
<Button disabled={loading}>
  {loading && <Spinner size="sm" />}
  Submit
</Button>
```

**Features**:
- Three sizes
- Smooth animation
- Accessible (aria-label)
- Tailwind CSS styled

### Avatar Component

**Location**: `apps/web/src/packages/components/shared/ui/Avatar.tsx`

**Usage**:
```typescript
// With image
<Avatar name="John Doe" src="/avatar.jpg" />

// Fallback to abbreviation
<Avatar name="John Doe" />  // Shows "JD"

// Sizes
<Avatar name="John Doe" size="sm" />  // 32px
<Avatar name="John Doe" size="md" />  // 40px (default)
<Avatar name="John Doe" size="lg" />  // 48px
```

**Features**:
- Image with fallback
- Automatic abbreviation
- Multiple sizes
- Responsive
- Accessible

### Form Validation Example

**React Hook Form + Zod**:

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type FormData = z.infer<typeof schema>

export function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  // Auto-validate fields
  useAutoValidateForm(form, ['email', 'password'])

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('email')} />
      {form.formState.errors.email && (
        <p>{form.formState.errors.email.message}</p>
      )}

      <input type="password" {...form.register('password')} />
      {form.formState.errors.password && (
        <p>{form.formState.errors.password.message}</p>
      )}

      <button type="submit">Submit</button>
    </form>
  )
}
```

## Architecture Guide (Section 16)

### Monorepo Organization

```
project/
├── apps/
│   ├── api/              # Backend application
│   └── web/              # Frontend application
├── docs/                 # Documentation
├── docker-compose.yml    # Local dev environment
└── package.json          # Root workspace
```

### Backend Structure (`apps/api/src/`)

```
src/
├── core/                 # Infrastructure & configuration
│   ├── prisma/          # Database client
│   ├── redis/           # Cache client
│   ├── mail/            # Email service
│   └── config/          # App configuration
├── modules/             # Business logic modules
│   ├── auth/           # Authentication module
│   │   ├── guards/
│   │   ├── decorators/
│   │   ├── services/
│   │   ├── resolvers/
│   │   └── dto/
│   └── users/          # Users module
└── shared/              # Shared utilities
    ├── utils/          # Helper functions
    ├── decorators/     # Custom decorators
    └── guards/         # Shared guards
```

**Where to Add New Code**:

| What | Where |
|------|-------|
| New API feature | `apps/api/src/modules/[feature-name]/` |
| GraphQL resolver | `apps/api/src/modules/[module]/resolvers/` |
| Business logic | `apps/api/src/modules/[module]/services/` |
| Database model | `apps/api/prisma/schema.prisma` |
| Utility function | `apps/api/src/shared/utils/` |
| Guard/middleware | `apps/api/src/shared/guards/` |
| Configuration | `apps/api/src/core/config/` |

### Frontend Structure (`apps/web/src/`)

```
src/
├── app/                  # Next.js App Router
│   ├── (root)/          # Public routes
│   ├── auth/            # Auth pages (login, register)
│   ├── dashboard/       # Protected routes
│   └── styles/          # Global styles
├── packages/            # Shared code
│   ├── components/      # UI components
│   │   └── shared/
│   │       └── ui/      # Base UI components
│   ├── libs/           # Third-party integrations
│   │   ├── apollo/     # GraphQL client
│   │   └── i18n/       # Internationalization
│   ├── config/         # App configuration
│   │   └── routes/     # Route definitions
│   ├── utils/          # Utility functions
│   ├── hooks/          # Custom React hooks
│   └── schemas/        # Zod validation schemas
└── modules/            # Feature modules
    └── auth/           # Auth feature
        ├── components/ # Auth-specific components
        ├── graphql/    # GraphQL operations
        └── store/      # State management
```

**Where to Add New Code**:

| What | Where |
|------|-------|
| New page | `apps/web/src/app/[route]/page.tsx` |
| New UI component | `apps/web/src/packages/components/shared/ui/` |
| New feature module | `apps/web/src/modules/[feature-name]/` |
| GraphQL query | `apps/web/src/modules/[module]/graphql/[operation].gql` |
| Custom hook | `apps/web/src/packages/hooks/` |
| Utility function | `apps/web/src/packages/utils/` |
| Zustand store | `apps/web/src/modules/[module]/store/` |
| Validation schema | `apps/web/src/packages/schemas/` |

### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `Button.tsx`, `UserProfile.tsx` |
| Files | kebab-case | `user.service.ts`, `auth.guard.ts` |
| Folders | kebab-case | `auth-module/`, `user-profile/` |
| GraphQL operations | camelCase | `getUsers.gql`, `createUser.gql` |
| Environment variables | UPPER_SNAKE_CASE | `DATABASE_URL`, `SESSION_SECRET` |

### Module Structure Pattern

When creating a new module, follow this pattern:

**Backend Module**:
```
modules/my-feature/
├── dto/                  # Data Transfer Objects
│   ├── create-item.input.ts
│   └── update-item.input.ts
├── models/              # GraphQL output types
│   └── item.model.ts
├── services/            # Business logic
│   └── item.service.ts
├── resolvers/           # GraphQL resolvers
│   └── item.resolver.ts
└── my-feature.module.ts
```

**Frontend Module**:
```
modules/my-feature/
├── components/          # Feature-specific components
│   ├── ItemList.tsx
│   └── ItemForm.tsx
├── graphql/            # GraphQL operations
│   ├── getItems.gql
│   └── createItem.gql
├── store/              # State management
│   └── items.store.ts
└── types/              # TypeScript types
    └── index.ts
```

## How to Use This Prompt

### Step 1: Prepare Your LLM

1. Open your preferred AI assistant (Claude, ChatGPT, etc.)
2. Start a new conversation
3. Copy the **entire contents** of `APP_GENERATOR_PROMPT.md`

### Step 2: Customize the Prompt

Before sending, customize these sections:

**Project Name**:
- Replace `myapp` with your project name
- Update database name: `myapp_db` → `yourapp_db`

**Email Configuration**:
- Update `SMTP_FROM` email
- Update verification email URLs

**Domain**:
- Update `SESSION_DOMAIN` in environment variables
- Update CORS origin URLs

**Branding**:
- Update email templates with your branding
- Update app name in navigation

### Step 3: Send the Prompt

Send the entire prompt with this instruction:

```
Please generate a complete fullstack application based on this architecture specification. Create all files exactly as described, maintaining the folder structure and including all configurations, components, and utilities.
```

### Step 4: Verify Generated Files

After generation, verify these critical files exist:

**Backend**:
- [ ] `apps/api/src/main.ts`
- [ ] `apps/api/prisma/schema.prisma`
- [ ] `apps/api/src/modules/auth/auth.module.ts`
- [ ] `apps/api/.env.example`

**Frontend**:
- [ ] `apps/web/next.config.ts`
- [ ] `apps/web/src/app/layout.tsx`
- [ ] `apps/web/src/app/styles/globals.css`
- [ ] `apps/web/.env.local.example`

**Root**:
- [ ] `docker-compose.yml`
- [ ] `package.json`

### Step 5: Setup the Project

```bash
# 1. Install dependencies
npm install

# 2. Start Docker services
docker compose up -d

# 3. Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local

# 4. Configure environment variables
# Edit apps/api/.env and apps/web/.env.local with your values

# 5. Run database migrations
cd apps/api
npm run prisma:migrate:dev

# 6. Start backend
npm run dev

# 7. In another terminal, start frontend
cd apps/web
npm run dev
```

### Step 6: Test Core Features

1. **Visit** `http://localhost:3000`
2. **Register** a new account
3. **Check email** for verification token (or check console logs in development)
4. **Verify email** with token
5. **Login** with credentials
6. **Access dashboard** (should be protected)
7. **Test theme toggle** (light/dark mode)
8. **Test language switcher** (EN/RU)
9. **Test logout**

## Extending the Application

### Adding a New Feature Module

Let's say you want to add a "Tasks" feature:

#### Backend

1. **Create Prisma model** (`apps/api/prisma/schema.prisma`):
```prisma
model Task {
  id        String   @id @default(cuid())
  title     String
  completed Boolean  @default(false)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

2. **Create module** (`apps/api/src/modules/tasks/`):
```
tasks/
├── dto/
│   ├── create-task.input.ts
│   └── update-task.input.ts
├── models/
│   └── task.model.ts
├── services/
│   └── task.service.ts
├── resolvers/
│   └── task.resolver.ts
└── tasks.module.ts
```

3. **Implement service**:
```typescript
@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.task.findMany({ where: { userId } })
  }

  async create(userId: string, data: CreateTaskInput) {
    return this.prisma.task.create({
      data: { ...data, userId }
    })
  }
}
```

4. **Implement resolver**:
```typescript
@Resolver(() => Task)
@UseGuards(AuthGuard)
export class TaskResolver {
  constructor(private taskService: TaskService) {}

  @Query(() => [Task])
  async tasks(@CurrentUser() userId: string) {
    return this.taskService.findAll(userId)
  }

  @Mutation(() => Task)
  async createTask(
    @CurrentUser() userId: string,
    @Args('data') data: CreateTaskInput
  ) {
    return this.taskService.create(userId, data)
  }
}
```

#### Frontend

1. **Create GraphQL operations** (`apps/web/src/modules/tasks/graphql/`):

**getTasks.gql**:
```graphql
query GetTasks {
  tasks {
    id
    title
    completed
  }
}
```

**createTask.gql**:
```graphql
mutation CreateTask($data: CreateTaskInput!) {
  createTask(data: $data) {
    id
    title
    completed
  }
}
```

2. **Generate types**:
```bash
npm run graphql:codegen
```

3. **Create components** (`apps/web/src/modules/tasks/components/`):

**TaskList.tsx**:
```typescript
import { useGetTasksQuery } from '@/graphql/generated'

export function TaskList() {
  const { data, loading } = useGetTasksQuery()

  if (loading) return <Spinner />

  return (
    <div>
      {data?.tasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  )
}
```

4. **Create page** (`apps/web/src/app/dashboard/tasks/page.tsx`):
```typescript
import { TaskList } from '@/modules/tasks/components/TaskList'

export default function TasksPage() {
  return (
    <div>
      <h1>My Tasks</h1>
      <TaskList />
    </div>
  )
}
```

5. **Add to navigation**:
```typescript
// In paths.ts
export const PATHS = {
  // ... existing routes
  tasks: '/dashboard/tasks',
} as const

// In Navigation.tsx
<Link href={PATHS.tasks}>Tasks</Link>
```

## Best Practices

### Security

1. **Never commit secrets**:
   - Keep `.env` files in `.gitignore`
   - Use environment variables for sensitive data
   - Rotate secrets regularly

2. **Password security**:
   - Use provided HashUtil (Argon2 with OWASP params)
   - Never log passwords
   - Enforce strong password requirements

3. **Session security**:
   - Use httpOnly cookies
   - Set secure: true in production
   - Configure proper sameSite
   - Set reasonable maxAge

4. **Input validation**:
   - Validate all user input
   - Use Zod schemas
   - Sanitize data before database operations

5. **Rate limiting**:
   - Add rate limiting to auth endpoints
   - Protect against brute force attacks
   - Use Redis for distributed rate limiting

### Performance

1. **Database**:
   - Add indexes to frequently queried fields
   - Use `select` to fetch only needed fields
   - Implement pagination for large datasets
   - Use database transactions for related operations

2. **Caching**:
   - Cache frequently accessed data in Redis
   - Set appropriate TTL values
   - Invalidate cache on updates

3. **Frontend**:
   - Use Next.js App Router for automatic code splitting
   - Implement lazy loading for heavy components
   - Optimize images with next/image
   - Use Apollo Client cache effectively

### Code Quality

1. **Type safety**:
   - Use TypeScript strictly
   - Generate types from GraphQL schema
   - Avoid `any` type
   - Use Zod for runtime validation

2. **Component structure**:
   - Keep components small and focused
   - Extract reusable logic to hooks
   - Use composition over inheritance
   - Follow Single Responsibility Principle

3. **Error handling**:
   - Use provided Prisma error handler
   - Show user-friendly error messages
   - Log errors for debugging
   - Handle edge cases

4. **Testing**:
   - Write unit tests for business logic
   - Integration tests for API endpoints
   - E2E tests for critical user flows
   - Aim for >80% code coverage

## Troubleshooting

### Common Issues

#### "Port already in use"
**Problem**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

#### "Cannot connect to database"
**Problem**: `PrismaClientInitializationError`

**Solution**:
1. Check Docker is running: `docker ps`
2. Verify DATABASE_URL in .env
3. Restart PostgreSQL: `docker compose restart postgres`
4. Check PostgreSQL logs: `docker compose logs postgres`

#### "Redis connection failed"
**Problem**: `Error: connect ECONNREFUSED 127.0.0.1:6379`

**Solution**:
1. Check Docker is running: `docker ps`
2. Verify REDIS_HOST and REDIS_PORT in .env
3. Restart Redis: `docker compose restart redis`
4. Check Redis logs: `docker compose logs redis`

#### "GraphQL schema not found"
**Problem**: GraphQL CodeGen fails

**Solution**:
1. Ensure backend is running
2. Check GraphQL endpoint URL in `graphql.config.ts`
3. Regenerate schema: `npm run graphql:codegen`

#### "Session not persisting"
**Problem**: User logs out on page refresh

**Solution**:
1. Check `SESSION_SECURE` is false in development
2. Verify `SESSION_DOMAIN` matches your domain
3. Check browser cookies are enabled
4. Verify Redis is running and connected

#### "Email not sending"
**Problem**: Verification emails not received

**Solution**:
1. Check SMTP credentials in .env
2. For Gmail, use App Password (not regular password)
3. Check spam folder
4. In development, log emails to console instead
5. Verify firewall allows SMTP traffic

### Development Tips

1. **View logs**:
```bash
# Backend logs
docker compose logs -f api

# PostgreSQL logs
docker compose logs -f postgres

# Redis logs
docker compose logs -f redis
```

2. **Reset database**:
```bash
# Delete all data
docker compose down -v
docker compose up -d
npm run prisma:migrate:dev
```

3. **Inspect Redis**:
```bash
# Connect to Redis CLI
docker compose exec redis redis-cli

# View all keys
KEYS *

# View session data
GET "sessions:XXXXX"
```

4. **Inspect PostgreSQL**:
```bash
# Connect to PostgreSQL
docker compose exec postgres psql -U postgres -d myapp_db

# List tables
\dt

# View users
SELECT * FROM "User";
```

## Version History

### Version 1.0 (Initial Release)
- Core infrastructure (Backend + Frontend)
- i18n support (backend + frontend)
- Theme system (light/dark mode)
- Routing with type safety
- GraphQL integration
- Basic UI components
- Architecture documentation

### Version 2.0 (Authentication Update)
- Complete authentication module
- Email verification system
- Email service with SMTP
- Dashboard page
- Protected routes (frontend + backend)
- Auth guards and decorators
- Session management with Redis

### Version 3.0 (Utilities & Advanced Features)
- Production-ready utilities:
  - HashUtil (Argon2)
  - ms utility (time parsing)
  - Prisma error handler
  - cn (classname merge)
  - generateAbbreviation
- Custom hooks:
  - useDebouncedCallback
  - useAutoValidateForm
- Docker development setup
- Advanced UI components:
  - Toast notifications
  - Loading spinner
  - Avatar component
- Complete form validation example

## Additional Resources

### Documentation Links

- **NestJS**: https://docs.nestjs.com/
- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **Apollo GraphQL**: https://www.apollographql.com/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **next-intl**: https://next-intl-docs.vercel.app/
- **Argon2**: https://github.com/ranisalt/node-argon2
- **React Hook Form**: https://react-hook-form.com/
- **Zod**: https://zod.dev/

### Related Files

- **APP_GENERATOR_PROMPT.md**: The main prompt template
- **docker-compose.yml**: Docker configuration
- **.env.example**: Environment variables template
- **prisma/schema.prisma**: Database schema

## Contributing

To improve this prompt template:

1. Test the generated application thoroughly
2. Document any issues or missing features
3. Propose improvements with concrete examples
4. Update this documentation accordingly

## License

This prompt template is based on the MedicHub project architecture and is intended for educational and development purposes.

---

**Last Updated**: December 11, 2025
**Version**: 3.0
**Maintained By**: MedicHub Team
