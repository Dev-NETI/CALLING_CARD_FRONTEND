"use client";

import { useState, useEffect } from "react";
import { Employee, Company } from "@/types";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/app/context/AuthContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmployeeListItemComponent from "./EmployeeListItemComponent";

interface EmployeeListComponentProps {
  onEdit: (employee: Employee) => void;
  onCreate: () => void;
  onCreateCard: (employeeId: number) => void;
}

export default function EmployeeListComponent({
  onEdit,
  onCreate,
  onCreateCard,
}: EmployeeListComponentProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const { token, logout } = useAuth();

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    // Verify token exists before making requests
    if (!token) {
      console.error("No authentication token found");
      showToast("Authentication required. Please login again.", "error");
      return;
    }

    try {
      setIsLoading(true);
      console.log(
        "Fetching employees with token:",
        token ? "Token exists" : "No token"
      );

      const [employeesData, companiesData] = await Promise.all([
        api.getEmployees(),
        api.getCompanies(),
      ]);

      console.log("=== EMPLOYEES DATA DEBUG ===");
      console.log("Raw employeesData:", employeesData);
      console.log("Is Array?", Array.isArray(employeesData));
      console.log("Type:", typeof employeesData);
      console.log("Length:", employeesData?.length);
      console.log("===========================");

      // Ensure we always have arrays
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
      setCompanies(Array.isArray(companiesData) ? companiesData : []);

      console.log(
        "Employees set to state:",
        Array.isArray(employeesData) ? employeesData : []
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load data";

      // Check if it's an authentication error
      if (
        errorMessage.includes("401") ||
        errorMessage.includes("Unauthorized") ||
        errorMessage.includes("authentication")
      ) {
        showToast("Session expired. Please login again.", "error");
        setTimeout(() => logout(), 2000);
      } else {
        showToast(errorMessage, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      await api.deleteEmployee(id);
      showToast("Employee deleted successfully", "success");
      fetchData();
    } catch (error) {
      showToast("Failed to delete employee", "error");
    }
  };

  const getCompanyName = (companyId: number) => {
    const company = companies.find((c) => c.id === companyId);
    return company?.company_name || "Unknown";
  };

  // Expose refresh method for parent component
  useEffect(() => {
    // Store fetchData in a way the parent can call it
    (window as any).__refreshEmployees = fetchData;
    return () => {
      delete (window as any).__refreshEmployees;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading employees...</p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No employees yet
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by adding your first employee
          </p>
          <Button onClick={onCreate}>Create Employee</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <EmployeeListItemComponent
                key={employee.id}
                employee={employee}
                companyName={getCompanyName(employee.company_id)}
                onEdit={onEdit}
                onDelete={handleDelete}
                onCreateCard={onCreateCard}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
