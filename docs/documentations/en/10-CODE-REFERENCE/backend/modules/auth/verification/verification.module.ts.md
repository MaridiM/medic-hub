# File: modules\auth\verification\verification.module.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/verification/verification.module.ts`

## Category
Backend

## File Type
TS (verification.module.ts)

## Size
280 characters, 10 lines

## Full Code

```typescript
import { Module } from '@nestjs/common'

import { VerificationResolver } from './verification.resolver'
import { VerificationService } from './verification.service'

@Module({
	providers: [VerificationResolver, VerificationService],
})
export class VerificationModule {}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.467Z*
