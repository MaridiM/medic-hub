# ADR-0001 — Frontend Architecture (Next.js 15 + FSD)

## Context
- App Router + RSC, Tailwind v4, shadcn/ui, next-intl, Zustand, Zod/RHF.

## Decision
- Adopt FSD inside `src/modules/<domain>/{entities,features,pages,shared,widgets}` with shared libs in `src/packages/*`.
- Introduce TanStack Query + typed fetcher for data.

## Consequences
- Clear boundaries; scalable composition; predictable imports (TS aliases).

## Follow-up
- Provide example module `patients` and `schedules` with full flow.

