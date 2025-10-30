"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Employee, Company } from "@/types";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import AddEmployeeModalComponent from "@/components/employees/AddEmployeeModalComponent";
import EditEmployeeModalComponent from "@/components/employees/EditEmployeeModalComponent";
import EmployeeListComponent from "@/components/employees/EmployeeListComponent";

export default function EmployeesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const companiesData = await api.getCompanies();
      setCompanies(Array.isArray(companiesData) ? companiesData : []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleOpenCreateModal = () => {
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingEmployee(null);
  };

  const handleCreateCard = (employeeId: number) => {
    router.push(`/employees/${employeeId}/card`);
  };

  const handleSuccess = () => {
    // Refresh the employee list
    if ((window as any).__refreshEmployees) {
      (window as any).__refreshEmployees();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
                  Virtual Cards
                </h1>
              </Link>
              <div className="hidden md:flex gap-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/companies">
                  <Button variant="outline" size="sm">
                    Companies
                  </Button>
                </Link>
                <Link href="/employees">
                  <Button variant="primary" size="sm">
                    Employees
                  </Button>
                </Link>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Employees</h2>
            <p className="text-gray-600">
              Manage employee records and virtual cards
            </p>
          </div>
          <Button onClick={handleOpenCreateModal}>
            <svg
              className="w-5 h-5 mr-2 inline-block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Employee
          </Button>
        </div>

        <EmployeeListComponent
          onEdit={handleOpenEditModal}
          onCreate={handleOpenCreateModal}
          onCreateCard={handleCreateCard}
        />
      </div>

      <AddEmployeeModalComponent
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
        companies={companies}
      />

      <EditEmployeeModalComponent
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleSuccess}
        employee={editingEmployee}
        companies={companies}
      />
    </div>
  );
}
