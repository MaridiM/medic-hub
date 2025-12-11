# File: packages\libs\apollo\apollo-client.config.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/libs/apollo/apollo-client.config.ts`

## Category
Frontend

## File Type
TS (apollo-client.config.ts)

## Size
2704 characters, 74 lines

## Full Code

```typescript
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'
import { CombinedGraphQLErrors, CombinedProtocolErrors } from '@apollo/client/errors'
import { ErrorLink } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs'
import { createClient as createWsClient } from 'graphql-ws'

import { SERVER_URL, WEBSOCKET_URL } from '@/packages/constants'

const isBrowser = typeof window !== 'undefined'

/** HTTP link with upload (multipart) support */
const httpUploadLink = new UploadHttpLink({
    uri: SERVER_URL,
    credentials: 'include',
    headers: {
        'apollo-require-preflight': 'true'
    },
    fetchOptions: {
        credentials: 'include'
    }
}) as unknown as ApolloLink

/** WS link (browser only). On the server — null. */
const wsLink = isBrowser
    ? new GraphQLWsLink(
          createWsClient({
              url: WEBSOCKET_URL,
              // pass token/cookies if needed:
              // connectionParams: async () => ({ authorization: `Bearer ${token}` }),
              lazy: true,
              retryAttempts: 10,
              shouldRetry: () => true
          })
      )
    : null

/** Use WS for subscriptions, otherwise rely on HTTP only */
const link: ApolloLink = wsLink
    ? ApolloLink.split(
          ({ query }) => {
              const def = getMainDefinition(query)
              return def.kind === 'OperationDefinition' && def.operation === 'subscription'
          },
          wsLink,
          httpUploadLink
      )
    : httpUploadLink

const errorLink = new ErrorLink(({ error, operation }) => {
    if (CombinedGraphQLErrors.is(error)) {
        error.errors.forEach(({ message, locations, path }) =>
            console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        )
    } else if (CombinedProtocolErrors.is(error)) {
        error.errors.forEach(({ message, extensions }) =>
            console.log(`[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(extensions)}`)
        )
    } else {
        console.error(`[Network error]: ${error}`)
    }
})
export const client = new ApolloClient({
    ssrMode: !isBrowser, // important for Next
    link: ApolloLink.from([errorLink, link]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: { errorPolicy: 'all' },
        query: { errorPolicy: 'all' },
        mutate: { errorPolicy: 'all' } // do not throw; errors are returned in result.errors
    }
})

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.623Z*
