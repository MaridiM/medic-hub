# UI Guidelines

## General
- Use shadcn wrappers for all controls. Keep variants minimal and consistent.
- Spacing scale: 4/8/12/16/24. Typography via CSS variables.
- Forms: RHF + Zod; errors inline near fields; disable submit until valid.

## Tables & Lists
- Paginate server-side; keep sticky header; responsive columns.
- Actions in row with sensible tooltips.

## Theming & i18n
- next-themes for dark/light. All copy via next-intl keys. No hardcoded strings.
