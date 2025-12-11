# File: modules\auth\2fa\utils\risk-mapper.util.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/utils/risk-mapper.util.ts`

## Category
Backend

## File Type
TS (risk-mapper.util.ts)

## Size
702 characters, 26 lines

## Full Code

```typescript
import { ESecuritySeverity } from '@prisma/__generated__'

import { ERiskLevel } from '../types'

export class RiskMapperUtil {
	/**
	 * Maps a risk level to a security event severity.
	 * @param level - The risk level from the assessment.
	 * @returns The corresponding security severity.
	 */
	static mapLevelToSeverity(level: ERiskLevel): ESecuritySeverity {
		switch (level) {
			case ERiskLevel.CRITICAL:
				return ESecuritySeverity.CRITICAL
			case ERiskLevel.HIGH:
				return ESecuritySeverity.HIGH
			case ERiskLevel.MEDIUM:
				return ESecuritySeverity.MEDIUM
			case ERiskLevel.LOW:
			case ERiskLevel.VERY_LOW:
			default:
				return ESecuritySeverity.LOW
		}
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.234Z*
