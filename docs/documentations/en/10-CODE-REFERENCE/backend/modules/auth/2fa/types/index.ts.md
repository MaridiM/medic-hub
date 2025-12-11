# File: modules\auth\2fa\types\index.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/types/index.ts`

## Category
Backend

## File Type
TS (index.ts)

## Size
716 characters, 40 lines

## Full Code

```typescript
export * from './method-data.types'
export * from './device.types'
export * from './risk.types'
export * from './security-event.types'

/**
 * Common response types
 */

export interface ISuccessResponse {
	success: true
	message?: string
}

export interface IErrorResponse {
	success: false
	error: string
	code?: string
}

export type TApiResponse<T = void> = T extends void
	? ISuccessResponse | IErrorResponse
	: (ISuccessResponse & { data: T }) | IErrorResponse

/**
 * Pagination
 */
export interface IPaginationParams {
	page: number
	limit: number
}

export interface IPaginatedResponse<T> {
	data: T[]
	total: number
	page: number
	limit: number
	totalPages: number
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.207Z*
