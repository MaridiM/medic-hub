# MedicHub - Technical Documentation

![Version](https://img.shields.io/badge/version-v0.0.1-blue)
![Date](https://img.shields.io/badge/date-2025.12.11-green)
![Status](https://img.shields.io/badge/status-Complete-success)
![Language](https://img.shields.io/badge/language-EN%20%7C%20RU-orange)

---

## 📚 Overview

This is the **complete technical documentation** for the MedicHub medical platform. It includes comprehensive documentation for the entire application stack:

- 🏗️ **Full Architecture** - System design and technology stack
- 💻 **Backend API** - NestJS + GraphQL API documentation
- 🎨 **Frontend** - Next.js + React application documentation
- 🗄️ **Database** - Complete Prisma schema (545 lines)
- 🔒 **Security** - Authentication, 2FA, rate limiting
- 📊 **Diagrams** - 8 Mermaid architectural diagrams
- 📝 **Source Code** - All 400+ files with detailed comments
- 🌐 **Multilingual** - English and Russian versions

---

## 🎯 Quick Start

### For Developers
1. Start with **[English Index](./en/00-INDEX.md)** or **[Russian Index](./ru/README.md)**
2. Review **[Architecture Overview](./en/01-ARCHITECTURE.md)**
3. Explore **[Code Reference](./en/10-CODE-REFERENCE/)**

### For Designers
1. See **[Design System](./en/04-DESIGN-SYSTEM.md)** for UI specifications
2. Review **[Component Hierarchy](./diagrams/component-hierarchy.mmd)**
3. Check **[Frontend Structure](./diagrams/frontend-structure.mmd)**

### For DevOps
1. Check **[Deployment Guide](./en/08-DEPLOYMENT.md)**
2. Review **[Environment Variables](./en/09-ENVIRONMENT.md)** (166+ variables)
3. See **[Deployment Architecture](./diagrams/deployment-architecture.mmd)**

### For Security Auditors
1. Read **[Security Documentation](./en/07-SECURITY.md)**
2. Review **[Authentication Flow](./diagrams/auth-flow.mmd)**
3. Check **[Auth Module](./en/11-MODULES/auth.md)**

---

## 📂 Documentation Structure

```
documentations/
│
├── 📄 README.md                    # This file
│
├── 🇬🇧 en/                         # English Documentation
│   ├── 00-INDEX.md                # Complete navigation index
│   ├── 01-ARCHITECTURE.md         # System architecture
│   ├── 02-BACKEND-API.md          # Backend API docs
│   ├── 03-FRONTEND.md             # Frontend app docs
│   ├── 04-DESIGN-SYSTEM.md        # Design specifications
│   ├── 05-DATABASE-SCHEMA.md      # Database schema
│   ├── 06-GRAPHQL-API.md          # GraphQL API reference
│   ├── 07-SECURITY.md             # Security implementation
│   ├── 08-DEPLOYMENT.md           # Deployment guide
│   ├── 09-ENVIRONMENT.md          # Environment variables
│   ├── 10-CODE-REFERENCE/         # Complete source code (412 files)
│   │   ├── backend/               # Backend code reference
│   │   └── frontend/              # Frontend code reference
│   ├── 11-MODULES/                # Module documentation (6 modules)
│   │   ├── auth.md                # Authentication module
│   │   ├── dashboard.md           # Dashboard module
│   │   ├── organization.md        # Organization module
│   │   ├── settings.md            # Settings module
│   │   ├── security.md            # Security module
│   │   └── notification.md        # Notification module
│   └── FULL-DOCUMENTATION.md      # All docs in one file
│
├── 🇷🇺 ru/                         # Russian Documentation
│   └── README.md                  # Russian documentation index
│
├── 📊 diagrams/                    # Mermaid Diagrams (8 files)
│   ├── architecture-overview.mmd  # High-level architecture
│   ├── backend-structure.mmd      # Backend module structure
│   ├── frontend-structure.mmd     # Frontend structure
│   ├── database-schema.mmd        # Database ER diagram
│   ├── auth-flow.mmd              # Authentication flows
│   ├── graphql-flow.mmd           # GraphQL request flow
│   ├── component-hierarchy.mmd    # Component tree
│   └── deployment-architecture.mmd # Deployment setup
│
└── 🔧 Tools/                       # Documentation generators
    ├── generate-docs.js           # CODE-REFERENCE generator
    ├── complete-generation.js     # Core docs generator
    └── finalize-all.js            # Final assembly script
```

---

## 📊 Documentation Statistics

| Category | Count | Description |
|----------|-------|-------------|
| **Total Files** | 438+ | All documentation files |
| **Markdown Files** | 430+ | Documentation pages |
| **Mermaid Diagrams** | 8 | Architectural diagrams |
| **Backend Files** | 215 | Documented TypeScript files |
| **Frontend Files** | 196 | Documented TypeScript/TSX files |
| **Core Docs** | 10 | Main documentation files |
| **Module Docs** | 6 | Business module documentation |
| **Languages** | 2 | English & Russian |

---

## 🗺️ Navigation Guide

### By Technology

#### Backend (NestJS + GraphQL)
- 📘 [Backend API](./en/02-BACKEND-API.md)
- 🗄️ [Database Schema](./en/05-DATABASE-SCHEMA.md)
- 🔌 [GraphQL API](./en/06-GRAPHQL-API.md)
- 📊 [Backend Structure Diagram](./diagrams/backend-structure.mmd)

#### Frontend (Next.js + React)
- 📗 [Frontend App](./en/03-FRONTEND.md)
- 🎨 [Design System](./en/04-DESIGN-SYSTEM.md)
- 🧩 [Component Hierarchy](./diagrams/component-hierarchy.mmd)
- 📊 [Frontend Structure Diagram](./diagrams/frontend-structure.mmd)

#### Infrastructure
- 🚀 [Deployment Guide](./en/08-DEPLOYMENT.md)
- ⚙️ [Environment Variables](./en/09-ENVIRONMENT.md)
- 📊 [Deployment Architecture](./diagrams/deployment-architecture.mmd)

### By Feature

#### Authentication & Security
- 🔐 [Auth Module](./en/11-MODULES/auth.md)
- 🛡️ [Security Module](./en/11-MODULES/security.md)
- 🔒 [Security Documentation](./en/07-SECURITY.md)
- 📊 [Auth Flow Diagram](./diagrams/auth-flow.mmd)

#### User Interface
- 🎨 [Design System](./en/04-DESIGN-SYSTEM.md) - Pixel-perfect specs
- 🧩 [Component Reference](./en/10-CODE-REFERENCE/frontend/packages/components/)
- 📊 [Component Hierarchy](./diagrams/component-hierarchy.mmd)

#### Data Management
- 🗄️ [Database Schema](./en/05-DATABASE-SCHEMA.md)
- 🔌 [GraphQL API](./en/06-GRAPHQL-API.md)
- 📊 [Database ER Diagram](./diagrams/database-schema.mmd)

---

## 🚀 Technology Stack

### Backend
| Technology | Version | Documentation |
|-----------|---------|---------------|
| NestJS | 11.1.5 | [Backend API](./en/02-BACKEND-API.md) |
| Apollo Server | 4.12.2 | [GraphQL API](./en/06-GRAPHQL-API.md) |
| PostgreSQL | 17 | [Database Schema](./en/05-DATABASE-SCHEMA.md) |
| Prisma | 6.17.1 | [Database Schema](./en/05-DATABASE-SCHEMA.md) |
| Redis | 8 | [Architecture](./en/01-ARCHITECTURE.md) |
| TypeScript | 5.8.3 | [Code Reference](./en/10-CODE-REFERENCE/backend/) |

### Frontend
| Technology | Version | Documentation |
|-----------|---------|---------------|
| Next.js | 16.0.0 | [Frontend](./en/03-FRONTEND.md) |
| React | 19.1.1 | [Frontend](./en/03-FRONTEND.md) |
| Apollo Client | 4.0.5 | [Frontend](./en/03-FRONTEND.md) |
| Tailwind CSS | 4.x | [Design System](./en/04-DESIGN-SYSTEM.md) |
| Zustand | 5.0.8 | [Frontend](./en/03-FRONTEND.md) |
| TypeScript | 5.9.2 | [Code Reference](./en/10-CODE-REFERENCE/frontend/) |

---

## 📖 Key Features Documented

### ✅ Complete Coverage

- ✅ **Full Architecture** - Monorepo structure, technology stack, design patterns
- ✅ **Backend API** - All modules, services, resolvers, DTOs
- ✅ **Frontend App** - All pages, components, state management, forms
- ✅ **Design System** - CSS variables, 42+ components, responsive breakpoints
- ✅ **Database** - Complete Prisma schema (545 lines), all models and relationships
- ✅ **GraphQL** - All queries, mutations, input/output types
- ✅ **Security** - Authentication, 2FA (TOTP/OTP/WebAuthn), rate limiting
- ✅ **Deployment** - Docker, environment setup, scaling strategies
- ✅ **Source Code** - Every single file (400+) with detailed documentation

### 🎯 Special Features

- **Pixel-Perfect Design Specs** - Exact sizes, colors, spacing for all UI elements
- **Flow Diagrams** - Visual representation of all major processes
- **Code Examples** - Real code snippets for every feature
- **Security Audit** - Complete security implementation documentation
- **Multilingual** - English and Russian versions

---

## 🔍 Search & Find

### Quick Links

| What you need | Where to look |
|---------------|---------------|
| **Overall understanding** | [00-INDEX.md](./en/00-INDEX.md) |
| **System architecture** | [01-ARCHITECTURE.md](./en/01-ARCHITECTURE.md) |
| **Specific backend code** | [10-CODE-REFERENCE/backend/](./en/10-CODE-REFERENCE/backend/) |
| **Specific frontend code** | [10-CODE-REFERENCE/frontend/](./en/10-CODE-REFERENCE/frontend/) |
| **UI component specs** | [04-DESIGN-SYSTEM.md](./en/04-DESIGN-SYSTEM.md) |
| **Database tables** | [05-DATABASE-SCHEMA.md](./en/05-DATABASE-SCHEMA.md) |
| **API endpoints** | [06-GRAPHQL-API.md](./en/06-GRAPHQL-API.md) |
| **Security features** | [07-SECURITY.md](./en/07-SECURITY.md) |
| **Deployment setup** | [08-DEPLOYMENT.md](./en/08-DEPLOYMENT.md) |
| **Environment config** | [09-ENVIRONMENT.md](./en/09-ENVIRONMENT.md) |
| **Everything in one** | [FULL-DOCUMENTATION.md](./en/FULL-DOCUMENTATION.md) |

---

## 🌐 Language Versions

### 🇬🇧 English
Complete documentation available in **[en/](./en/)** directory.
- Start: [en/00-INDEX.md](./en/00-INDEX.md)

### 🇷🇺 Russian
Documentation structure created in **[ru/](./ru/)** directory.
- Start: [ru/README.md](./ru/README.md)
- Status: Structure ready, translation in progress

---

## 🛠️ Documentation Tools

### Automatic Generators

This documentation was generated using automated tools:

1. **generate-docs.js** - Generates CODE-REFERENCE from source files
   ```bash
   node generate-docs.js
   ```

2. **complete-generation.js** - Generates core documentation files
   ```bash
   node complete-generation.js
   ```

3. **finalize-all.js** - Assembles everything together
   ```bash
   node finalize-all.js
   ```

### Regenerate Documentation

To regenerate the documentation after code changes:

```bash
cd docs/documentations
node generate-docs.js    # Regenerate code reference
node finalize-all.js     # Update FULL-DOCUMENTATION.md
```

---

## 📝 Version Information

| Version Type | Version Number | Release Date |
|-------------|----------------|--------------|
| **Semantic Version** | v0.0.1 | 2025-12-11 |
| **Date-based Version** | 2025.12.11 | December 11, 2025 |
| **Status** | Initial Release | Complete |

### Changelog

**v0.0.1 (2025.12.11)**
- ✅ Initial complete documentation release
- ✅ Full architecture documentation
- ✅ Complete code reference (400+ files)
- ✅ All diagrams included (8 Mermaid diagrams)
- ✅ Design system specifications
- ✅ Module documentation (6 modules)
- ✅ English version complete
- ✅ Russian structure created

---

## 📞 Documentation Support

### How to Use This Documentation

1. **New to the project?**
   - Start with [00-INDEX.md](./en/00-INDEX.md)
   - Read [01-ARCHITECTURE.md](./en/01-ARCHITECTURE.md)
   - Browse [diagrams/](./diagrams/)

2. **Looking for specific code?**
   - Use [10-CODE-REFERENCE/](./en/10-CODE-REFERENCE/)
   - Search in [FULL-DOCUMENTATION.md](./en/FULL-DOCUMENTATION.md)

3. **Need to understand a feature?**
   - Check [11-MODULES/](./en/11-MODULES/)
   - Review relevant diagrams

4. **Setting up environment?**
   - Read [08-DEPLOYMENT.md](./en/08-DEPLOYMENT.md)
   - Configure [09-ENVIRONMENT.md](./en/09-ENVIRONMENT.md)

### Contributing to Documentation

To update this documentation:
1. Modify source files or documentation files
2. Run generators to update references
3. Update version numbers
4. Add changelog entry
5. Keep cross-references updated

---

## 📜 License

This documentation is proprietary and confidential.
**Unauthorized distribution is prohibited.**

---

## 🎯 Project Information

- **Project Name**: MedicHub
- **Type**: Medical Platform
- **Architecture**: Monorepo (Backend + Frontend)
- **Documentation Version**: v0.0.1
- **Documentation Date**: 2025-12-11
- **Documentation Status**: ✅ Complete

---

## 🔗 Related Resources

- **Project Root**: `../../`
- **Backend Source**: `../../apps/api/`
- **Frontend Source**: `../../apps/web/`
- **Docker Config**: `../../docker-compose.yml`

---

## ⭐ Documentation Highlights

### What Makes This Documentation Special

1. **🎯 Complete Coverage** - Every single file documented (400+ files)
2. **📊 Visual Diagrams** - 8 comprehensive Mermaid diagrams
3. **🎨 Pixel-Perfect** - Exact design specifications (sizes, colors, spacing)
4. **🔒 Security Focused** - Detailed security implementation docs
5. **🌐 Multilingual** - English and Russian versions
6. **🔄 Auto-Generated** - Automated generators keep it up-to-date
7. **📖 Easy Navigation** - Multiple indexes and cross-references
8. **💯 Production Ready** - Real production code documentation

---

## 🚀 Get Started Now!

**👉 [Start with the Index](./en/00-INDEX.md)**

or

**👉 [View Full Documentation](./en/FULL-DOCUMENTATION.md)**

---

*Last Updated: 2025-12-11 | Version: v0.0.1 | Status: ✅ Complete*
