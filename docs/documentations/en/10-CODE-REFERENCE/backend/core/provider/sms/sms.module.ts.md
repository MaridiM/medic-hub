# File: core\provider\sms\sms.module.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/core/provider/sms/sms.module.ts`

## Category
Backend

## File Type
TS (sms.module.ts)

## Size
192 characters, 11 lines

## Full Code

```typescript
import { Global, Module } from '@nestjs/common'

import { SmsService } from './sms.service'

@Global()
@Module({
	providers: [SmsService],
	exports: [SmsService],
})
export class SmsModule {}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.098Z*
