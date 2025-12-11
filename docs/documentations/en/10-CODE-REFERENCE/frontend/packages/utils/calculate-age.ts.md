# File: packages\utils\calculate-age.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/utils/calculate-age.ts`

## Category
Frontend

## File Type
TS (calculate-age.ts)

## Size
457 characters, 18 lines

## Full Code

```typescript
import { differenceInYears, format } from 'date-fns'

export function calculateAge(dob: string) {
    // Convert the birth date string to a Date object
    const birthDate = new Date(dob)

    // Current date
    const currentDate = new Date()

    // Calculate the age
    const age = differenceInYears(currentDate, birthDate)

    // Format the current date
    const formattedDate = format(currentDate, 'yyyy-MM-dd')

    return { age, formattedDate }
}

```

## Description

This file is part of the MedicHub Frontend (Next.js) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.837Z*
