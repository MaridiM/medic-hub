# File: packages\components\shared\ui\avatar.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/components/shared/ui/avatar.tsx`

## Category
Frontend

## File Type
TSX (avatar.tsx)

## Size
1512 characters, 42 lines

## Full Code

```typescript
'use client'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react'

import { cn } from '@/packages/utils'

const Avatar = forwardRef<
    ComponentRef<typeof AvatarPrimitive.Root>,
    ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
        ref={ref}
        className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
        style={{ aspectRatio: '1' }}
        {...props}
    />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = forwardRef<
    ComponentRef<typeof AvatarPrimitive.Image>,
    ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image ref={ref} className={cn('aspect-square h-full w-full object-cover', className)} {...props} />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = forwardRef<
    ComponentRef<typeof AvatarPrimitive.Fallback>,
    ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn('bg-background flex h-full w-full items-center justify-center rounded-full', className)}
        {...props}
    />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.262Z*
