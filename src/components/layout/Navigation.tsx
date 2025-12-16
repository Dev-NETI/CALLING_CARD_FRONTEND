"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Button from "@/components/ui/Button";
import { hasPermission, PERMISSIONS } from "@/lib/utils/permissions";

export default function Navigation() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40 backdrop-blur-sm bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
                NETI Business Card App
              </h1>
            </Link>
            <div className="hidden md:flex gap-4">
              {hasPermission(user, PERMISSIONS.VIEW_DASHBOARD) && (
                <Link href="/dashboard">
                  <Button
                    variant={isActive("/dashboard") ? "primary" : "outline"}
                    size="sm"
                  >
                    Dashboard
                  </Button>
                </Link>
              )}
              {hasPermission(user, PERMISSIONS.MANAGE_COMPANIES) && (
                <Link href="/companies">
                  <Button
                    variant={isActive("/companies") ? "primary" : "outline"}
                    size="sm"
                  >
                    Companies
                  </Button>
                </Link>
              )}
              {hasPermission(user, PERMISSIONS.MANAGE_EMPLOYEES) && (
                <Link href="/employees">
                  <Button
                    variant={isActive("/employees") ? "primary" : "outline"}
                    size="sm"
                  >
                    Employees
                  </Button>
                </Link>
              )}
              {hasPermission(user, PERMISSIONS.MANAGE_USERS) && (
                <Link href="/users">
                  <Button
                    variant={isActive("/users") ? "primary" : "outline"}
                    size="sm"
                  >
                    Users
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 text-sm">Welcome, {user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
