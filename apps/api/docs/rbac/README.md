# RBAC (Role-Based Access Control) System

## Overview
The RBAC system provides secure, role-based authorization for GraphQL resolvers and REST endpoints. It ensures that only users with appropriate roles can access protected resources.

## Architecture

### Core Components
1. **`EUserRole` Enum**
   - Defined in `prisma/schema.prisma`
   - Available roles: `USER`, `SUPER_ADMIN`
   - Stored as an array to support multiple roles per user

2. **`RolesGuard`**
   - NestJS guard that intercepts requests
   - Fetches fresh role data from database on each request
   - Ensures users have required roles before allowing access

3. **`@Roles()` Decorator**
   - Metadata decorator to specify required roles
   - Supports single or multiple role requirements

## Security Model

### Key Principles
1. **Fresh Data**: Roles are fetched from the database on each protected request to ensure current permissions
2. **Fail-Safe**: Access is denied by default if requirements aren't met
3. **Multiple Roles**: Users can have multiple roles, providing flexible permission models
4. **Audit Trail**: All role checks are logged for security auditing

### Role Hierarchy
- `USER`: Base role for all registered users
- `SUPER_ADMIN`: Full system access, includes all `USER` permissions

## Usage

### Protecting a GraphQL Resolver
```typescript
import { UseGuards } from '@nestjs/common'
import { Mutation, Resolver } from '@nestjs/graphql'
import { Roles, RolesGuard, EUserRole } from '@/modules/rbac'
import { Authorization } from '@/shared/decorators'

@Resolver()
export class AdminResolver {
  @Mutation(() => Boolean)
  @Authorization() // First: Check if user is authenticated
  @Roles(EUserRole.SUPER_ADMIN) // Second: Check if user has admin role
  @UseGuards(RolesGuard) // Apply the role check
  async deleteUser(userId: string): Promise<boolean> {
    // This code only runs for super admins
    return true
  }
}
```

### Checking Multiple Roles
```typescript
// User needs at least ONE of the specified roles
@Roles(EUserRole.SUPER_ADMIN, EUserRole.MODERATOR)
@UseGuards(RolesGuard)
async moderateContent() {
  // Accessible by both admins and moderators
}
```

## Best Practices
1. **Always authenticate first**: Use `@Authorization()` before `@Roles()`
2. **Use specific roles**: Don't check for `USER` role unless specifically needed
3. **Log important actions**: Audit all admin actions
4. **Principle of least privilege**: Grant minimum necessary roles

## Testing

### Creating Test Users with Roles
```typescript
const testAdmin = await prisma.user.create({
  data: {
    email: 'test-admin@example.com',
    roles: [EUserRole.USER, EUserRole.SUPER_ADMIN],
    // ... other fields
  }
})
```

## Migration Guide

### For Existing Users
When the migration runs, all existing users will receive the `[USER]` role by default.

### Adding Admin Role to Existing User
```sql
-- Via Prisma Studio or direct SQL
UPDATE users 
SET roles = '{USER,SUPER_ADMIN}'::user_roles[] 
WHERE email = 'admin@example.com';
```

## Troubleshooting

### Common Issues
1. **"Insufficient permissions" error**
   - Check user's roles in database
   - Verify `@Roles()` decorator is correctly applied
   - Ensure `RolesGuard` is included with `@UseGuards()`

2. **"User not found" error**
   - Verify authentication middleware runs before RolesGuard
   - Check that user object is attached to request

3. **Roles not updating**
   - Remember: roles are fetched fresh from DB
   - Check database connection
   - Verify migration was applied
