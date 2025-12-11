# File: modules\auth\shared\components\footer.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/auth/shared/components/footer.tsx`

## Category
Frontend

## File Type
TSX (footer.tsx)

## Size
547 characters, 13 lines

## Full Code

```typescript
export const Footer = () => {
    return (
        <footer className='flex h-16 items-center justify-center p-4'>
            <div className='flex flex-col items-center px-2'>
                <span className='text-text text-p-xs tracking-wider'>Clinic Hub - Doctor Lab &copy; 2025</span>
                <span className='text-text-secondary text-label-md tracking-wider'>
                    {process.env.NEXT_PUBLIC_APP_NAME} v{process.env.NEXT_PUBLIC_APP_VERSION}
                </span>
            </div>
        </footer>
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.965Z*
