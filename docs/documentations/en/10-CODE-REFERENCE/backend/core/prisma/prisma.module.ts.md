# File: core\prisma\prisma.module.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/core/prisma/prisma.module.ts`

## Category
Backend

## File Type
TS (prisma.module.ts)

## Size
217 characters, 11 lines

## Full Code

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

## Description

This file is part of the MedicHub API (NestJS) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.055Z*
