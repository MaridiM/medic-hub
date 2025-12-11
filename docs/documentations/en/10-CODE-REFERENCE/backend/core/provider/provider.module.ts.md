# File: core\provider\provider.module.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/core/provider/provider.module.ts`

## Category
Backend

## File Type
TS (provider.module.ts)

## Size
660 characters, 20 lines

## Full Code

```typescript
import { Global, Module } from '@nestjs/common'

import { MailModule } from './mail'
import { SmsModule } from './sms'

/**
 * Global Communication Module
 *
 * This module bundles all external communication channels, such as email and SMS.
 * By making it global, services like MailService and SmsService are available
 * for dependency injection throughout the application without needing to import
 * this module in feature modules.
 */
@Global()
@Module({
	imports: [MailModule, SmsModule],
	exports: [MailModule, SmsModule], // Export modules to make their services (MailService, SmsService) available
})
export class ProviderModule {}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.095Z*
