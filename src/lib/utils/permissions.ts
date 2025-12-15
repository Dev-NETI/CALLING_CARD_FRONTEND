import { User, Role, Permission } from "@/types";

/**
 * Check if user has a specific role
 */
export const hasRole = (user: User | null, roleSlug: string): boolean => {
  if (!user || !user.roles) return false;
  return user.roles.some((role) => role.slug === roleSlug);
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (user: User | null, roleSlugs: string[]): boolean => {
  if (!user || !user.roles) return false;
  return user.roles.some((role) => roleSlugs.includes(role.slug));
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (
  user: User | null,
  permissionSlug: string
): boolean => {
  if (!user || !user.roles) return false;

  return user.roles.some((role) =>
    role.permissions?.some((permission) => permission.slug === permissionSlug)
  );
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (
  user: User | null,
  permissionSlugs: string[]
): boolean => {
  if (!user || !user.roles) return false;

  return user.roles.some((role) =>
    role.permissions?.some((permission) =>
      permissionSlugs.includes(permission.slug)
    )
  );
};

/**
 * Get all permissions for a user
 */
export const getAllPermissions = (user: User | null): Permission[] => {
  if (!user || !user.roles) return [];

  const permissions: Permission[] = [];
  user.roles.forEach((role) => {
    if (role.permissions) {
      permissions.push(...role.permissions);
    }
  });

  // Remove duplicates based on permission ID
  return permissions.filter(
    (permission, index, self) =>
      index === self.findIndex((p) => p.id === permission.id)
  );
};

/**
 * Check if user is an administrator
 */
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, "administrator");
};

/**
 * Permission slugs constants
 */
export const PERMISSIONS = {
  VIEW_DASHBOARD: "view-dashboard",
  MANAGE_COMPANIES: "manage-companies",
  MANAGE_EMPLOYEES: "manage-employees",
  MANAGE_USERS: "manage-users",
} as const;

/**
 * Role slugs constants
 */
export const ROLES = {
  ADMINISTRATOR: "administrator",
  DASHBOARD: "dashboard",
  COMPANY_MANAGEMENT: "company-management",
  EMPLOYEE_MANAGEMENT: "employee-management",
  USER_MANAGEMENT: "user-management",
} as const;
