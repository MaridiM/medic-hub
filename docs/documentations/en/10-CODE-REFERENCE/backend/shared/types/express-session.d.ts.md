# File: shared\types\express-session.d.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/shared/types/express-session.d.ts`

## Category
Backend

## File Type
TS (express-session.d.ts)

## Size
856 characters, 33 lines

## Full Code

```typescript
import 'express-session'

import type { ISessionMetadataDTO } from './session-metadata.types'

// Предполагается, что этот тип существует. Если нет, замените на `any` или создайте его.

/**
 * @fileoverview Extends the default express-session SessionData interface
 * to include custom properties for our application.
 * This uses TypeScript's declaration merging feature.
 */

declare module 'express-session' {
	interface SessionData {
		/** The unique identifier of the logged-in user */
		userId?: string

		/** The timestamp when the session was created */
		createdAt?: Date

		/** Additional metadata about the session */
		metadata?: ISessionMetadataDTO

		/** Flag indicating if 2FA has been verified for this session */
		is2FAVerified?: boolean

		/** When 2FA was verified */
		verified2FAAt?: Date
	}
}

export {}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.673Z*
