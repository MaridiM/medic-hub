# MedicHub - System Architecture

## Version: v0.0.1 (2025.12.11)

---

## Table of Contents
- [Executive Summary](#executive-summary)
- [Technology Stack](#technology-stack)
- [Monorepo Structure](#monorepo-structure)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Data Layer](#data-layer)
- [Infrastructure](#infrastructure)
- [Security Architecture](#security-architecture)
- [Deployment Architecture](#deployment-architecture)
- [Architectural Decisions](#architectural-decisions)

---

## Executive Summary

MedicHub is a comprehensive medical platform built with a **modern monorepo architecture** combining:
- **Backend**: NestJS-based GraphQL API
- **Frontend**: Next.js 16 with React 19
- **Database**: PostgreSQL 17 with Prisma ORM
- **Cache**: Redis 8 for sessions and rate limiting
- **Infrastructure**: Docker containerization

### Key Characteristics
- **Type Safety**: Full TypeScript across frontend and backend
- **API-First**: GraphQL with code-first schema generation
- **Security-Focused**: Multi-layer security (2FA, rate limiting, session management)
- **Scalable**: Horizontal scaling support
- **Modern**: Latest versions of all frameworks (2025)

---

## Technology Stack

### Backend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Framework** | NestJS 11.1.5 | Backend framework with DI |
| **API Layer** | Apollo Server 4.12.2 | GraphQL server |
| **Runtime** | Node.js 20+ | JavaScript runtime |
| **Language** | TypeScript 5.8.3 | Type-safe language |
| **Database** | PostgreSQL 17 | Relational database |
| **ORM** | Prisma 6.17.1 | Type-safe database access |
| **Cache** | Redis 5.6.1 | In-memory data store |
| **Session** | express-session + Redis | Session management |
| **Authentication** | Argon2, JWT, WebAuthn | Multi-method auth |
| **2FA** | OTPAuth, SimpleWebAuthn | TOTP, WebAuthn support |
| **Email** | React Email, Brevo, SendGrid | Email service |
| **SMS** | Twilio 5.10.2 | SMS notifications |
| **File Storage** | Cloudinary, Sharp | Image processing |
| **Payment** | Stripe 18.3.0 | Payment processing |
| **Testing** | Jest 30.0.5 | Unit & E2E testing |
| **i18n** | i18next 25.3.2 | Internationalization |

### Frontend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Framework** | Next.js 16.0.0 | React meta-framework |
| **React** | React 19.1.1 | UI library |
| **Language** | TypeScript 5.9.2 | Type-safe language |
| **GraphQL Client** | Apollo Client 4.0.5 | Data fetching |
| **State Management** | Zustand 5.0.8 | Client state |
| **Form Handling** | React Hook Form 7.62.0 | Form management |
| **Validation** | Zod 4.1.9 | Schema validation |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **UI Components** | Radix UI + shadcn/ui | Accessible components |
| **Animations** | Framer Motion 12.23.24 | Motion library |
| **Icons** | Lucide React 0.554.0 | Icon library |
| **i18n** | next-intl 4.3.9 | Internationalization |
| **Theme** | next-themes 0.4.6 | Dark/Light mode |

---

## Monorepo Structure

```
medic_hub_gemini/
├── apps/
│   ├── api/                           # Backend application
│   │   ├── src/
│   │   │   ├── main.ts               # Entry point
│   │   │   ├── core/                 # Core infrastructure
│   │   │   │   ├── config/          # Configuration modules
│   │   │   │   ├── prisma/          # Prisma service
│   │   │   │   ├── redis/           # Redis service
│   │   │   │   ├── i18n/            # i18n service
│   │   │   │   └── provider/        # External providers
│   │   │   ├── modules/             # Business modules
│   │   │   │   ├── auth/           # Authentication
│   │   │   │   ├── security/       # Security features
│   │   │   │   ├── security-event/ # Audit logging
│   │   │   │   ├── notification/   # Notifications
│   │   │   │   └── rbac/           # Access control
│   │   │   └── shared/              # Shared utilities
│   │   │       ├── decorators/     # Custom decorators
│   │   │       ├── guards/         # Auth guards
│   │   │       ├── pipes/          # Validation pipes
│   │   │       └── utils/          # Utility functions
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # Database schema (545 lines)
│   │   │   └── migrations/         # Migration files
│   │   ├── emails/                  # Email templates
│   │   ├── docker/                  # Dockerfiles
│   │   └── package.json
│   │
│   └── web/                          # Frontend application
│       ├── src/
│       │   ├── app/                 # Next.js App Router
│       │   │   ├── (root)/         # Public routes
│       │   │   ├── (protected)/    # Protected routes
│       │   │   └── styles/         # Global styles
│       │   ├── modules/             # Feature modules
│       │   │   ├── auth/           # Auth module
│       │   │   ├── dashboard/      # Dashboard module
│       │   │   ├── organization/   # Organization module
│       │   │   └── settings/       # Settings module
│       │   └── packages/            # Shared packages
│       │       ├── api/            # GraphQL client
│       │       ├── components/     # UI components
│       │       ├── config/         # Configuration
│       │       ├── hooks/          # Custom hooks
│       │       ├── libs/           # Libraries
│       │       ├── schemas/        # Validation schemas
│       │       └── utils/          # Utilities
│       ├── public/                  # Static assets
│       ├── configs/                 # GraphQL codegen config
│       └── package.json
│
├── docs/                            # Documentation
│   └── documentations/             # This documentation
│
├── docker-compose.yml              # Infrastructure orchestration
└── .env                           # Environment variables
```

### Architecture Principles
1. **Separation of Concerns**: Clear boundaries between layers
2. **Dependency Injection**: NestJS DI container
3. **Single Responsibility**: Each module has one purpose
4. **DRY (Don't Repeat Yourself)**: Shared utilities
5. **Type Safety**: TypeScript everywhere
6. **Security by Default**: Auth guards, rate limiting

---

## Backend Architecture

### Layered Architecture

```
┌─────────────────────────────────────┐
│         GraphQL Layer               │
│  (Resolvers, DTOs, GraphQL Types)   │
└─────────────────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│       Business Logic Layer          │
│      (Services, Use Cases)          │
└─────────────────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│        Data Access Layer            │
│   (Prisma ORM, Redis Client)        │
└─────────────────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│         Database Layer              │
│   (PostgreSQL, Redis)                │
└─────────────────────────────────────┘
```

### Module Structure

Each business module follows this pattern:

```
module/
├── dtos/             # Data Transfer Objects (GraphQL inputs)
├── models/           # GraphQL types (output)
├── resolvers/        # GraphQL resolvers
├── services/         # Business logic
├── guards/           # Authorization guards
├── constants/        # Module constants
├── types/            # TypeScript types
├── __tests__/        # Unit tests
└── index.ts          # Public exports
```

### Core Services

**CoreService** (Base Service):
- Provides access to Prisma, Redis, Config, i18n
- Helper methods for common operations
- Inherited by all business services

**PrismaService**:
- Database connection management
- Transaction support
- Query logging

**RedisService**:
- Session storage
- Cache management
- Rate limit counters
- Pub/Sub for subscriptions

**I18nService**:
- Multi-language support (en, ru)
- Translation loading
- Message formatting

---

[See full documentation for complete architecture details]

---

*This is an auto-generated documentation. For full details, see individual module documentation.*
