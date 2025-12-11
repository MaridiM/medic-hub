# File: modules\rbac\types\rbac.types.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/rbac/types/rbac.types.ts`

## Category
Backend

## File Type
TS (rbac.types.ts)

## Size
637 characters, 25 lines

## Full Code

```typescript
import { EUserRole } from '@prisma/__generated__'

/**
 * @fileoverview Type definitions for the RBAC (Role-Based Access Control) system.
 * @module rbac/types
 */

/**
 * Metadata key used to store required roles on a resolver or controller method.
 * This key is used by the @Roles decorator and RolesGuard.
 * @constant
 */
export const ROLES_KEY = 'roles'

/**
 * Re-export the user roles enum from Prisma for convenience.
 * This ensures consistency across the application.
 */
export { EUserRole }

/**
 * Type representing an array of roles required for access.
 */
export type RequiredRoles = EUserRole[]

```

## Description

This file is part of the MedicHub API (NestJS) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.538Z*
