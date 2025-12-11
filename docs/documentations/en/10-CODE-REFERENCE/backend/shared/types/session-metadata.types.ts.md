# File: shared\types\session-metadata.types.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/shared/types/session-metadata.types.ts`

## Category
Backend

## File Type
TS (session-metadata.types.ts)

## Size
294 characters, 19 lines

## Full Code

```typescript
export interface ILocationDTO {
	country: string
	city: string
	latitude: number
	longitude: number
}

export interface IDeviceDTO {
	browser: string
	os: string
	type: string
}

export interface ISessionMetadataDTO {
	location: ILocationDTO
	device: IDeviceDTO
	ip: string
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.684Z*
