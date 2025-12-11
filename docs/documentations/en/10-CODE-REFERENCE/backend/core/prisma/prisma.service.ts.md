# File: core\prisma\prisma.service.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/core/prisma/prisma.service.ts`

## Category
Backend

## File Type
TS (prisma.service.ts)

## Size
431 characters, 15 lines

## Full Code

```typescript
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/__generated__'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	// Connect with db
	async onModuleInit(): Promise<void> {
		await this.$connect()
	}
	// Disconnect with db
	async onModuleDestroy(): Promise<void> {
		await this.$disconnect()
	}
}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.061Z*
