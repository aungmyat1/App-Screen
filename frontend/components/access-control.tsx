'use client';

import { useAuth } from '@/contexts/auth-context';
import { Role, Permission, hasRole, hasAllPermissions, hasAnyPermission } from '@/lib/rbac';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AccessControlProps {
  children: React.ReactNode;
  roles?: Role[];
  permissions?: Permission[];
  requireAllPermissions?: boolean;
  fallback?: React.ReactNode;
}

export function AccessControl({
  children,
  roles = [],
  permissions = [],
  requireAllPermissions = false,
  fallback = null
}: AccessControlProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect unauthenticated users to login
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  // Check role requirements
  if (roles.length > 0 && user && !hasRole(user.role as Role, roles)) {
    return <>{fallback}</>;
  }

  // Check permission requirements
  if (permissions.length > 0 && user) {
    const hasRequiredPermissions = requireAllPermissions
      ? hasAllPermissions(user.role as Role, permissions)
      : hasAnyPermission(user.role as Role, permissions);
    
    if (!hasRequiredPermissions) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

export function WithRole({
  children,
  roles,
  fallback
}: {
  children: React.ReactNode;
  roles: Role[];
  fallback?: React.ReactNode;
}) {
  return (
    <AccessControl roles={roles} fallback={fallback}>
      {children}
    </AccessControl>
  );
}

export function WithPermission({
  children,
  permissions,
  requireAllPermissions,
  fallback
}: {
  children: React.ReactNode;
  permissions: Permission[];
  requireAllPermissions?: boolean;
  fallback?: React.ReactNode;
}) {
  return (
    <AccessControl 
      permissions={permissions} 
      requireAllPermissions={requireAllPermissions}
      fallback={fallback}
    >
      {children}
    </AccessControl>
  );
}