# File: shared\decorators\auth.decorator.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/shared/decorators/auth.decorator.ts`

## Category
Backend

## File Type
TS (auth.decorator.ts)

## Size
195 characters, 8 lines

## Full Code

```typescript
import { applyDecorators, UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from '../guards'

export function Authorization() {
	return applyDecorators(UseGuards(GqlAuthGuard))
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.634Z*
