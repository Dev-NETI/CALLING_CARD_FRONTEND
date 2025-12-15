"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { hasPermission, hasAnyPermission } from "@/lib/utils/permissions";

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
}

/**
 * Permission Guard Component
 * Protects routes by checking user permissions
 * Redirects to /forbidden if user doesn't have required permissions
 */
export default function PermissionGuard({
  children,
  permission,
  permissions,
  requireAll = false,
}: PermissionGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    let hasAccess = true;

    // Check single permission
    if (permission) {
      hasAccess = hasPermission(user, permission);
    }

    // Check multiple permissions
    if (permissions && permissions.length > 0) {
      if (requireAll) {
        // User must have ALL permissions
        hasAccess = permissions.every((perm) => hasPermission(user, perm));
      } else {
        // User must have AT LEAST ONE permission
        hasAccess = hasAnyPermission(user, permissions);
      }
    }

    if (!hasAccess) {
      router.push("/forbidden");
    }
  }, [user, isLoading, permission, permissions, requireAll, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show nothing while checking permissions
  if (!user) {
    return null;
  }

  // Check permissions before rendering
  let hasAccess = true;

  if (permission) {
    hasAccess = hasPermission(user, permission);
  }

  if (permissions && permissions.length > 0) {
    if (requireAll) {
      hasAccess = permissions.every((perm) => hasPermission(user, perm));
    } else {
      hasAccess = hasAnyPermission(user, permissions);
    }
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
