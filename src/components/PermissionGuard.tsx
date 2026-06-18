"use client";

import { useEffect, useMemo } from "react";
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

  const hasAccess = useMemo(() => {
    if (!user) return false;
    if (permission) return hasPermission(user, permission);
    if (permissions && permissions.length > 0) {
      return requireAll
        ? permissions.every((perm) => hasPermission(user, perm))
        : hasAnyPermission(user, permissions);
    }
    return true;
  }, [user, permission, permissions, requireAll]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (!hasAccess) {
      router.push("/forbidden");
    }
  }, [user, isLoading, hasAccess, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !hasAccess) {
    return null;
  }

  return <>{children}</>;
}
