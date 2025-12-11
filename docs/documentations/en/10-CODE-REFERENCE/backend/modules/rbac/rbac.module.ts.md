# File: modules\rbac\rbac.module.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/rbac/rbac.module.ts`

## Category
Backend

## File Type
TS (rbac.module.ts)

## Size
397 characters, 17 lines

## Full Code

```typescript
import { Global, Module } from '@nestjs/common'

import { RolesGuard } from './guards'

/**
 * Global module providing Role-Based Access Control (RBAC) functionality.
 * Exports guards and utilities for role-based authorization across the application.
 *
 * @module RbacModule
 */
@Global()
@Module({
	providers: [RolesGuard],
	exports: [RolesGuard],
})
export class RbacModule {}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.526Z*
