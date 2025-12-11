# File: packages\config\routes\paths.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/config/routes/paths.ts`

## Category
Frontend

## File Type
TS (paths.ts)

## Size
746 characters, 25 lines

## Full Code

```typescript
import { TAuthRoutes, TOrganizationRoutes } from './types'

export const PATHS = {
    home: '/',

    // Auth routes
    auth: (page: TAuthRoutes = ''): string => `/auth${page.length ? `/${page}` : ''}`,
    organization: (page: TOrganizationRoutes = ''): string => `/organization${page.length ? `/${page}` : ''}`,
    dashboard: (page: string = ''): string => `/dashboard${page.length ? `/${page}` : ''}`,
    settings: '/settings',

    // Guest dashboard routes

    patients: '/patients',
    appointments: '/appointments',
    tasks: '/tasks',
    support: '/support',
    feedback: '/feedback',
    staff: '/staff',
    messenger: '/messenger',
    news: '/news'
} as const

export type TPaths = keyof typeof PATHS

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.555Z*
