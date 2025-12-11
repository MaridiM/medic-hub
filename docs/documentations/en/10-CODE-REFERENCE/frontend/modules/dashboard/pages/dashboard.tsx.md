# File: modules\dashboard\pages\dashboard.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/dashboard/pages/dashboard.tsx`

## Category
Frontend

## File Type
TSX (dashboard.tsx)

## Size
327 characters, 14 lines

## Full Code

```typescript
import { mockUser } from '@/packages/api/mocks'
import { Header } from '@/packages/components'

export const Dashboard = () => {
    return (
        <div>
            <Header user={mockUser} />
            <main className='bg-background flex p-2'>
                <h1>DAHSBOARD</h1>
            </main>
        </div>
    )
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.112Z*
