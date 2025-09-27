# API Contracts (GraphQL)

> Source: NestJS + GraphQL (Apollo), Prisma
> This doc tracks key types, queries, mutations and rules.

## Conventions
- All mutations require an authenticated session and tenant scope.
- Error format hides internals; validation messages localized (ru/uk/en).

## Core Types (sketch)
- User { id, fullName, email }
- Patient { id, globalId, phone, email, ... }
- PatientProfile { id, tenantId, patientId, customFields, ... }
- Schedule { id, tenantId, doctorId, resourceId, status, ... }
- Invoice { id, status, amount, currency, paidAt, ... }

## Key Mutations
- createPatient(data)
- createSchedule(data) / changeScheduleStatus(id, status)
- issueInvoice(data) / payInvoice(id, payload)

