"use client";

import { useState, useEffect, useMemo } from "react";
import { Employee, Company } from "@/types";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/app/context/AuthContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
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

  // Filter states
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

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

  const getCompany = (companyId: number) => {
    return companies.find((c) => c.id === companyId);
  };

  // Get unique positions for dropdown
  const uniquePositions = useMemo(() => {
    const positions = employees.map((emp) => emp.position).filter(Boolean);
    return [...new Set(positions)].sort();
  }, [employees]);

  // Filter employees based on search and filter criteria
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const fullName = `${employee.first_name} ${employee.middle_name || ""} ${
        employee.last_name
      }`.toLowerCase();
      const matchesName = searchName
        ? fullName.includes(searchName.toLowerCase())
        : true;
      const matchesEmail = searchEmail
        ? employee.email.toLowerCase().includes(searchEmail.toLowerCase())
        : true;
      const matchesPosition = filterPosition
        ? employee.position === filterPosition
        : true;
      const matchesCompany = filterCompany
        ? employee.company_id.toString() === filterCompany
        : true;
      const matchesStatus = filterStatus
        ? employee.status === filterStatus
        : true;

      return (
        matchesName &&
        matchesEmail &&
        matchesPosition &&
        matchesCompany &&
        matchesStatus
      );
    });
  }, [
    employees,
    searchName,
    searchEmail,
    filterPosition,
    filterCompany,
    filterStatus,
  ]);

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
    <div className="space-y-4">
      {/* Search and Filter Section */}
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Search & Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <Input
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
            <div>
              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all border-gray-300 text-black"
              >
                <option value="">All Positions</option>
                {uniquePositions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all border-gray-300 text-black"
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id.toString()}>
                    {company.company_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all border-gray-300 text-black"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          {(searchName ||
            searchEmail ||
            filterPosition ||
            filterCompany ||
            filterStatus) && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredEmployees.length} of {employees.length}{" "}
                employees
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchName("");
                  setSearchEmail("");
                  setFilterPosition("");
                  setFilterCompany("");
                  setFilterStatus("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Employee Table */}
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
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-gray-500">
                      No employees found matching your filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => {
                  const company = getCompany(employee.company_id);
                  return (
                    <EmployeeListItemComponent
                      key={employee.id}
                      employee={employee}
                      companyName={getCompanyName(employee.company_id)}
                      companyHasBcard={company?.has_bcard ?? true}
                      onEdit={onEdit}
                      onDelete={handleDelete}
                      onCreateCard={onCreateCard}
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
