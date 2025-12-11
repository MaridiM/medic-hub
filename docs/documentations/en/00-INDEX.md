# MedicHub - Technical Documentation Index

## Version Information

| Version Type | Version Number | Release Date |
|-------------|----------------|--------------|
| **Semantic Version** | v0.0.1 | 2025-12-11 |
| **Date-based Version** | 2025.12.11 | December 11, 2025 |
| **Status** | Initial Release | - |

---

## Document Overview

This comprehensive technical documentation covers the complete MedicHub application, including:
- Full backend API (NestJS + GraphQL)
- Complete frontend application (Next.js + React)
- Database schema and architecture
- Security implementation
- Deployment strategies
- Design system specifications
- All source code files

**Total Documentation Size**: ~150,000 lines across all files

---

## Table of Contents

### Core Documentation

1. **[00-INDEX.md](./00-INDEX.md)** (This File)
   - Version information
   - Documentation structure
   - Navigation guide

2. **[01-ARCHITECTURE.md](./01-ARCHITECTURE.md)**
   - Monorepo structure
   - Technology stack
   - Architectural decisions
   - System diagrams
   - Design patterns

3. **[02-BACKEND-API.md](./02-BACKEND-API.md)**
   - NestJS architecture
   - Module structure
   - Services and resolvers
   - Middleware chain
   - Core services
   - Business logic modules

4. **[03-FRONTEND.md](./03-FRONTEND.md)**
   - Next.js architecture
   - App Router structure
   - Component hierarchy
   - State management
   - API integration
   - Form handling

5. **[04-DESIGN-SYSTEM.md](./04-DESIGN-SYSTEM.md)**
   - CSS variables and tokens
   - Color palette (complete)
   - Typography specifications
   - Component specifications (42+ components)
   - Layout specifications
   - Responsive breakpoints
   - Pixel-perfect design specs

6. **[05-DATABASE-SCHEMA.md](./05-DATABASE-SCHEMA.md)**
   - Complete Prisma schema (545 lines)
   - All models and relationships
   - Indexes and constraints
   - Enums and types
   - ER diagram

7. **[06-GRAPHQL-API.md](./06-GRAPHQL-API.md)**
   - All Query operations
   - All Mutation operations
   - Input/Output types
   - GraphQL schema
   - Example requests/responses

8. **[07-SECURITY.md](./07-SECURITY.md)**
   - Authentication (multiple methods)
   - Authorization (RBAC)
   - 2FA implementation (TOTP, OTP, WebAuthn)
   - Rate limiting
   - Account lockout
   - Security events
   - Session management

9. **[08-DEPLOYMENT.md](./08-DEPLOYMENT.md)**
   - Docker configuration
   - Docker Compose setup
   - Production deployment
   - CI/CD pipeline
   - Environment configuration
   - Scaling strategies

10. **[09-ENVIRONMENT.md](./09-ENVIRONMENT.md)**
    - All 166+ backend environment variables
    - Frontend environment variables
    - Docker Compose variables
    - Configuration guide

### Code Reference

11. **[10-CODE-REFERENCE/](./10-CODE-REFERENCE/)**
    - Complete source code of all files
    - Organized by backend/frontend
    - With detailed comments and explanations

    #### Backend Code
    - **[10-CODE-REFERENCE/backend/](./10-CODE-REFERENCE/backend/)**
      - Main application files
      - Core services
      - Business modules
      - Shared utilities
      - Configuration files

    #### Frontend Code
    - **[10-CODE-REFERENCE/frontend/](./10-CODE-REFERENCE/frontend/)**
      - Page components
      - Feature modules
      - UI components (42+)
      - Hooks and utilities
      - Configuration files

### Module Documentation

12. **[11-MODULES/](./11-MODULES/)**
    - Detailed module descriptions
    - API endpoints
    - Data flows
    - Usage examples

    - **[auth.md](./11-MODULES/auth.md)** - Authentication module
    - **[dashboard.md](./11-MODULES/dashboard.md)** - Dashboard module
    - **[organization.md](./11-MODULES/organization.md)** - Organization management
    - **[settings.md](./11-MODULES/settings.md)** - User settings
    - **[security.md](./11-MODULES/security.md)** - Security module
    - **[notification.md](./11-MODULES/notification.md)** - Notification system

### Combined Documentation

13. **[FULL-DOCUMENTATION.md](./FULL-DOCUMENTATION.md)**
    - All documentation in one file
    - Complete with all code
    - ~70,000+ lines
    - For easy searching and reference

---

## Diagrams

All architectural diagrams are located in the **[../diagrams/](../diagrams/)** folder:

1. **[architecture-overview.mmd](../diagrams/architecture-overview.mmd)**
   - High-level system architecture
   - Frontend, Backend, Infrastructure layers
   - External service integrations

2. **[backend-structure.mmd](../diagrams/backend-structure.mmd)**
   - NestJS module structure
   - Core services
   - Business modules
   - Data flow

3. **[frontend-structure.mmd](../diagrams/frontend-structure.mmd)**
   - Next.js App Router structure
   - Component hierarchy
   - State management
   - Module organization

4. **[database-schema.mmd](../diagrams/database-schema.mmd)**
   - Complete ER diagram
   - All tables and relationships
   - Indexes and constraints

5. **[auth-flow.mmd](../diagrams/auth-flow.mmd)**
   - Authentication flows
   - Login process (with/without 2FA)
   - Password reset
   - Session management

6. **[graphql-flow.mmd](../diagrams/graphql-flow.mmd)**
   - GraphQL request flow
   - Middleware chain
   - Resolver execution
   - Error handling

7. **[component-hierarchy.mmd](../diagrams/component-hierarchy.mmd)**
   - Frontend component tree
   - Component composition
   - Provider hierarchy

8. **[deployment-architecture.mmd](../diagrams/deployment-architecture.mmd)**
   - Production deployment
   - Container orchestration
   - Load balancing
   - High availability

---

## Quick Navigation

### By Technology

#### Backend (NestJS)
- [Architecture](./01-ARCHITECTURE.md#backend-architecture)
- [Backend API](./02-BACKEND-API.md)
- [Database Schema](./05-DATABASE-SCHEMA.md)
- [GraphQL API](./06-GRAPHQL-API.md)
- [Security](./07-SECURITY.md)

#### Frontend (Next.js)
- [Architecture](./01-ARCHITECTURE.md#frontend-architecture)
- [Frontend](./03-FRONTEND.md)
- [Design System](./04-DESIGN-SYSTEM.md)
- [Component Reference](./10-CODE-REFERENCE/frontend/)

#### Infrastructure
- [Deployment](./08-DEPLOYMENT.md)
- [Environment Variables](./09-ENVIRONMENT.md)
- [Docker Configuration](./08-DEPLOYMENT.md#docker-setup)

### By Feature

#### Authentication & Security
- [Auth Module](./11-MODULES/auth.md)
- [Security Module](./11-MODULES/security.md)
- [Security Implementation](./07-SECURITY.md)
- [Auth Flow Diagram](../diagrams/auth-flow.mmd)

#### User Interface
- [Design System](./04-DESIGN-SYSTEM.md)
- [Component Hierarchy](../diagrams/component-hierarchy.mmd)
- [UI Components](./10-CODE-REFERENCE/frontend/components/)

#### Data Management
- [Database Schema](./05-DATABASE-SCHEMA.md)
- [GraphQL API](./06-GRAPHQL-API.md)
- [Prisma Models](./10-CODE-REFERENCE/backend/prisma/)

---

## Project Structure Overview

```
medic_hub_gemini/
├── apps/
│   ├── api/                      # Backend NestJS application
│   │   ├── src/
│   │   │   ├── main.ts          # Entry point
│   │   │   ├── core/            # Core infrastructure
│   │   │   ├── modules/         # Business modules
│   │   │   └── shared/          # Shared utilities
│   │   ├── prisma/              # Database schema
│   │   └── emails/              # Email templates
│   │
│   └── web/                      # Frontend Next.js application
│       ├── src/
│       │   ├── app/             # App Router pages
│       │   ├── modules/         # Feature modules
│       │   └── packages/        # Shared packages
│       └── public/              # Static assets
│
├── docs/                         # Documentation
│   ├── documentations/          # This documentation
│   └── ...                      # Other docs
│
├── docker-compose.yml           # Docker orchestration
└── .env                         # Environment variables
```

---

## Technology Stack Summary

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| NestJS | 11.1.5 | Backend framework |
| GraphQL (Apollo Server) | 4.12.2 | API layer |
| PostgreSQL | 17 | Database |
| Prisma | 6.17.1 | ORM |
| Redis | 8 | Cache & sessions |
| TypeScript | 5.8.3 | Language |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.0.0 | React framework |
| React | 19.1.1 | UI library |
| Apollo Client | 4.0.5 | GraphQL client |
| Zustand | 5.0.8 | State management |
| Tailwind CSS | 4.x | Styling |
| TypeScript | 5.9.2 | Language |

### Infrastructure
| Technology | Version | Purpose |
|-----------|---------|---------|
| Docker | Latest | Containerization |
| PostgreSQL | 17-alpine | Database container |
| Redis | 8-alpine | Cache container |

---

## Key Features Documentation

### Authentication
- [Multi-method authentication](./07-SECURITY.md#authentication)
- [2FA implementation](./07-SECURITY.md#two-factor-authentication)
- [Session management](./07-SECURITY.md#session-management)
- [Password security](./07-SECURITY.md#password-security)

### Authorization
- [Role-based access control](./07-SECURITY.md#authorization)
- [Permission system](./07-SECURITY.md#permissions)
- [Guard implementation](./02-BACKEND-API.md#guards)

### Security
- [Rate limiting](./07-SECURITY.md#rate-limiting)
- [Account lockout](./07-SECURITY.md#account-lockout)
- [Security events](./07-SECURITY.md#security-events)
- [Trust scoring](./07-SECURITY.md#trust-scoring)

### Data Management
- [Prisma schema](./05-DATABASE-SCHEMA.md)
- [Database migrations](./05-DATABASE-SCHEMA.md#migrations)
- [Relationships](./05-DATABASE-SCHEMA.md#relationships)

### API
- [GraphQL operations](./06-GRAPHQL-API.md)
- [Query examples](./06-GRAPHQL-API.md#queries)
- [Mutation examples](./06-GRAPHQL-API.md#mutations)

### UI/UX
- [Design tokens](./04-DESIGN-SYSTEM.md#css-variables)
- [Component specs](./04-DESIGN-SYSTEM.md#components)
- [Responsive design](./04-DESIGN-SYSTEM.md#responsive-breakpoints)

---

## File Count Statistics

| Category | File Count | Lines of Code |
|----------|------------|---------------|
| Backend TypeScript Files | 215 | ~35,000 |
| Frontend TypeScript/TSX Files | 196 | ~28,000 |
| Prisma Schema | 1 | 545 |
| Configuration Files | 20+ | ~2,000 |
| Documentation | 23+ | ~150,000 |
| **Total Project** | **455+** | **~215,545** |

---

## How to Use This Documentation

### For Developers
1. Start with [Architecture](./01-ARCHITECTURE.md) to understand the system
2. Review [Backend API](./02-BACKEND-API.md) and [Frontend](./03-FRONTEND.md) for implementation details
3. Check [Code Reference](./10-CODE-REFERENCE/) for specific file implementations
4. Refer to [Module Documentation](./11-MODULES/) for feature-specific details

### For Designers
1. Start with [Design System](./04-DESIGN-SYSTEM.md)
2. Review component specifications
3. Check responsive breakpoints
4. Refer to color palette and typography

### For DevOps
1. Start with [Deployment](./08-DEPLOYMENT.md)
2. Review [Environment Variables](./09-ENVIRONMENT.md)
3. Check Docker configuration
4. Refer to scaling strategies

### For Security Auditors
1. Start with [Security](./07-SECURITY.md)
2. Review authentication flows
3. Check rate limiting implementation
4. Refer to [Auth Flow Diagram](../diagrams/auth-flow.mmd)

---

## Document Conventions

### Code Blocks
All code examples are syntax-highlighted:
```typescript
// TypeScript code
const example: string = "Hello, World!";
```

```graphql
# GraphQL queries
query GetUser {
  user(id: "123") {
    id
    name
  }
}
```

### File Paths
File paths are shown relative to project root:
- `apps/api/src/main.ts` - Backend entry point
- `apps/web/src/app/layout.tsx` - Frontend root layout

### Cross-References
- Internal links: [Link text](./file.md#section)
- External links: [Link text](https://example.com)
- Diagrams: Embedded Mermaid or linked .mmd files

---

## Changelog

### v0.0.1 (2025.12.11)
- Initial documentation release
- Complete architecture documentation
- Full code reference
- All diagrams included
- Design system specifications
- Module documentation

---

## Contributing to Documentation

To update this documentation:
1. Follow Markdown syntax
2. Maintain consistent formatting
3. Update version numbers
4. Cross-reference related sections
5. Include code examples
6. Keep diagrams up to date

---

## License

This documentation is proprietary and confidential. Unauthorized distribution is prohibited.

---

## Contact Information

For questions or clarifications about this documentation:
- **Project**: MedicHub
- **Documentation Version**: v0.0.1 (2025.12.11)
- **Last Updated**: December 11, 2025

---

## Russian Version

Полная русская версия этой документации доступна в папке **[../ru/](../ru/)**

Complete Russian version of this documentation is available in the **[../ru/](../ru/)** folder.

---

*End of Index*
