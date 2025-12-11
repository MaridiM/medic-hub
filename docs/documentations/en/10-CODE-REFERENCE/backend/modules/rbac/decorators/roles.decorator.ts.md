# File: modules\rbac\decorators\roles.decorator.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/rbac/decorators/roles.decorator.ts`

## Category
Backend

## File Type
TS (roles.decorator.ts)

## Size
899 characters, 26 lines

## Full Code

```typescript
import { SetMetadata } from '@nestjs/common'

import { EUserRole, ROLES_KEY } from '../types/rbac.types'

/**
 * Decorator to assign required roles to a GraphQL resolver or REST endpoint.
 * Used in conjunction with RolesGuard to enforce role-based access control.
 *
 * @param {...EUserRole[]} roles - One or more roles that are allowed to access the resource.
 * @returns {MethodDecorator & ClassDecorator} A decorator function.
 *
 * @example
 * ```typescript
 * // Single role requirement
 * @Roles(EUserRole.SUPER_ADMIN)
 * @UseGuards(RolesGuard)
 * async deleteUser() { ... }
 *
 * // Multiple roles (user must have at least one)
 * @Roles(EUserRole.SUPER_ADMIN, EUserRole.MODERATOR)
 * @UseGuards(RolesGuard)
 * async moderateContent() { ... }
 * ```
 */
export const Roles = (...roles: EUserRole[]): MethodDecorator & ClassDecorator => SetMetadata(ROLES_KEY, roles)

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.517Z*
