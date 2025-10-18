# System Roles and Permissions

## Role Definitions

### USER
**Description**: Default role for all registered users  
**Assignment**: Automatic upon registration  
**Persistence**: Cannot be removed from user  

**Permissions**:
- View and edit own profile
- Set up and manage own 2FA methods
- Access general application features
- Create sessions and authenticate

**Restrictions**:
- Cannot access admin panels
- Cannot view other users' data
- Cannot modify system settings

---

### SUPER_ADMIN
**Description**: System administrator with full access  
**Assignment**: Manual via database or seed script  
**Prerequisites**: Must also have USER role  

**Permissions**:
- All USER permissions
- Disable any user's 2FA (emergency access)
- View all security events and audit logs
- Manage user accounts and sessions
- Access system configuration
- View system metrics and health

**Responsibilities**:
- Emergency user support
- Security monitoring
- System maintenance
- User management

---

## Role Assignment

### During Registration
```typescript
// Automatic assignment for new users
const newUser = await prisma.user.create({
  data: {
    email: 'user@example.com',
    roles: [EUserRole.USER], // Always assigned
    // ... other fields
  }
})
```

### Promoting to Admin
```typescript
// Must be done by existing admin or via database
await prisma.user.update({
  where: { id: userId },
  data: {
    roles: [EUserRole.USER, EUserRole.SUPER_ADMIN]
  }
})
```

## Future Roles (Planned)

### MODERATOR
- Content moderation
- User reports handling
- Limited admin capabilities

### SUPPORT
- View user issues
- Reset passwords
- Basic troubleshooting

### DEVELOPER
- API access
- Debug information
- System monitoring

## Security Considerations
1. **Role Immutability**: The USER role cannot be removed once assigned
2. **Admin Verification**: Consider requiring 2FA for all admin actions
3. **Audit Trail**: All role changes should be logged
4. **Principle of Least Privilege**: Only grant roles when necessary
