# File: shared\utils\url\url.module.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/shared/utils/url/url.module.ts`

## Category
Backend

## File Type
TS (url.module.ts)

## Size
405 characters, 15 lines

## Full Code

```typescript
import { Global, Module } from '@nestjs/common'

import { UrlService } from './url.service'

/**
 * Global module providing the UrlService.
 * By using @Global(), this module makes UrlService available for dependency injection
 * throughout the entire application without needing to import UrlModule everywhere.
 */
@Global()
@Module({
	providers: [UrlService],
})
export class UrlModule {}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.757Z*
