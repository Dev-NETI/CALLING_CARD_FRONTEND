"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ total_companies: 0, total_employees: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Virtual Cards
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">
            Manage your companies and employees
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/companies">
            <Card hover className="cursor-pointer h-full">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Companies
                </h3>
                <p className="text-gray-600 text-sm">
                  Manage your company information and details
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/employees">
            <Card hover className="cursor-pointer h-full">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Employees
                </h3>
                <p className="text-gray-600 text-sm">
                  Manage employee records and information
                </p>
              </div>
            </Card>
          </Link>
        </div>

        <div className="mt-12">
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Stats
            </h3>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading stats...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <p className="text-4xl font-bold text-blue-600">{stats.total_companies}</p>
                  <p className="text-gray-600 mt-2">Total Companies</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <p className="text-4xl font-bold text-purple-600">{stats.total_employees}</p>
                  <p className="text-gray-600 mt-2">Total Employees</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
