# File: modules\auth\pages\change-password.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/pages/change-password.tsx`

## Category
Frontend

## File Type
TSX (change-password.tsx)

## Size
280 characters, 11 lines

## Full Code

```typescript
import { Wrapper } from '@/auth/features'
import { AuthForm } from '@/auth/widgets'

export const ChangePassword = ({ token }: { token: string }) => {
    return (
        <Wrapper>
            <AuthForm type='changePassword' token={token} />
        </Wrapper>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.945Z*
