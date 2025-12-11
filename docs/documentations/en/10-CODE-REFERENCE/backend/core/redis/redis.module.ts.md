# File: core\redis\redis.module.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/core/redis/redis.module.ts`

## Category
Backend

## File Type
TS (redis.module.ts)

## Size
212 characters, 11 lines

## Full Code

```typescript
import { Global, Module } from '@nestjs/common'

import { RedisService } from './redis.service'

@Global()
@Module({
	providers: [RedisService],
	exports: [RedisService],
})
export class RedisModule {}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.104Z*
