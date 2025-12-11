# File: shared\utils\is-dev.util.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/shared/utils/is-dev.util.ts`

## Category
Backend

## File Type
TS (is-dev.util.ts)

## Size
292 characters, 10 lines

## Full Code

```typescript
import * as dotenv from 'dotenv'

import { ConfigService } from '@nestjs/config'

dotenv.config()

export const isDev = (configService: ConfigService) => configService.getOrThrow<string>('NODE_ENV') === 'development'

export const IS_DEV_ENV = process.env.NODE_ENV === 'development'

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.739Z*
