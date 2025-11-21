// Role-Based Access Control (RBAC) system

// Define roles
export type Role = 'admin' | 'user' | 'support' | 'billing';

// Define permissions
export type Permission = 
  | 'read:users'
  | 'write:users'
  | 'delete:users'
  | 'read:apps'
  | 'write:apps'
  | 'delete:apps'
  | 'read:screenshots'
  | 'write:screenshots'
  | 'delete:screenshots'
  | 'read:subscriptions'
  | 'write:subscriptions'
  | 'manage:billing'
  | 'manage:roles'
  | 'manage:permissions'
  | 'access:support'
  | 'access:admin';

// Define role to permissions mapping
const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    'read:users',
    'write:users',
    'delete:users',
    'read:apps',
    'write:apps',
    'delete:apps',
    'read:screenshots',
    'write:screenshots',
    'delete:screenshots',
    'read:subscriptions',
    'write:subscriptions',
    'manage:billing',
    'manage:roles',
    'manage:permissions',
    'access:support',
    'access:admin'
  ],
  user: [
    'read:apps',
    'write:apps',
    'read:screenshots',
    'write:screenshots',
    'read:subscriptions'
  ],
  support: [
    'read:users',
    'read:apps',
    'read:screenshots',
    'access:support'
  ],
  billing: [
    'read:users',
    'read:subscriptions',
    'manage:billing'
  ]
};

// Check if a role has a specific permission
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = rolePermissions[role] || [];
  return permissions.includes(permission);
}

// Check if a user has a specific permission
export function userHasPermission(userRole: Role, permission: Permission): boolean {
  return hasPermission(userRole, permission);
}

// Check if a user has any of the required roles
export function hasRole(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.includes(userRole);
}

// Check if user has all required permissions
export function hasAllPermissions(userRole: Role, requiredPermissions: Permission[]): boolean {
  return requiredPermissions.every(permission => hasPermission(userRole, permission));
}

// Check if user has at least one of the required permissions
export function hasAnyPermission(userRole: Role, requiredPermissions: Permission[]): boolean {
  return requiredPermissions.some(permission => hasPermission(userRole, permission));
}

export default {
  roles: Object.keys(rolePermissions) as Role[],
  permissions: rolePermissions,
  hasPermission,
  userHasPermission,
  hasRole,
  hasAllPermissions,
  hasAnyPermission
};