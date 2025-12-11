# File: packages\libs\apollo\apollo-client.provider.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/libs/apollo/apollo-client.provider.tsx`

## Category
Frontend

## File Type
TSX (apollo-client.provider.tsx)

## Size
332 characters, 11 lines

## Full Code

```typescript
'use client'

import { ApolloProvider } from '@apollo/client/react'
import type { PropsWithChildren } from 'react'

import { client } from './apollo-client.config'

export function ApolloClientProvider({ children }: PropsWithChildren<unknown>) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>
}
// 
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.695Z*
