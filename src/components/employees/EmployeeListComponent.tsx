"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterCompany, setFilterCompany] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    // Verify token exists before making requests
    if (!token) {
      showToast("Authentication required. Please login again.", "error");
      return;
    }

    try {
      setIsLoading(true);

      const [employeesData, companiesData] = await Promise.all([
        api.getEmployees(),
        api.getCompanies(),
      ]);

      // Ensure we always have arrays
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
      setCompanies(Array.isArray(companiesData) ? companiesData : []);
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

  // Get unique departments for dropdown
  const uniqueDepartments = useMemo(() => {
    const departments = employees.map((emp) => emp.department).filter(Boolean);
    return [...new Set(departments)].sort();
  }, [employees]);

  // Filter employees based on search and filter criteria
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const fullName = `${employee.first_name} ${employee.middle_name || ""} ${
        employee.last_name
      }`.toLowerCase();
      const email = employee.email.toLowerCase();
      const mobile = employee.mobile_number || "";

      const matchesSearch = searchQuery
        ? fullName.includes(searchQuery.toLowerCase()) ||
          email.includes(searchQuery.toLowerCase()) ||
          mobile.includes(searchQuery)
        : true;

      const matchesDepartment = filterDepartment
        ? employee.department === filterDepartment
        : true;

      const matchesCompany = filterCompany
        ? employee.company_id.toString() === filterCompany
        : true;

      return matchesSearch && matchesDepartment && matchesCompany;
    });
  }, [employees, searchQuery, filterDepartment, filterCompany]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterDepartment, filterCompany]);

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
    <div className="space-y-6">
      {/* Modern Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  type="text"
                  placeholder="Search by name, email, or mobile number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium placeholder:text-gray-400 placeholder:font-normal"
                />
                {searchQuery && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-gray-700">
                Filters:
              </span>

              {/* Department Filter */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="px-4 py-2.5 text-sm font-medium border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white hover:border-purple-300 cursor-pointer appearance-none pr-10 bg-no-repeat bg-right"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundSize: "1.25rem",
                    backgroundPosition: "right 0.5rem center",
                  }}
                >
                  <option value="">All Departments</option>
                  {uniqueDepartments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Company Filter */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <select
                  value={filterCompany}
                  onChange={(e) => setFilterCompany(e.target.value)}
                  className="px-4 py-2.5 text-sm font-medium border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-blue-300 cursor-pointer appearance-none pr-10 bg-no-repeat bg-right"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundSize: "1.25rem",
                    backgroundPosition: "right 0.5rem center",
                  }}
                >
                  <option value="">All Companies</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id.toString()}>
                      {company.company_name}
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Clear Filters */}
              {(searchQuery || filterDepartment || filterCompany) && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery("");
                    setFilterDepartment("");
                    setFilterCompany("");
                  }}
                  className="ml-auto px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Clear All
                </motion.button>
              )}
            </div>

            {/* Results Count */}
            {(searchQuery || filterDepartment || filterCompany) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <p className="text-sm font-medium text-gray-600">
                  Showing{" "}
                  <span className="text-blue-600 font-bold">
                    {filteredEmployees.length}
                  </span>{" "}
                  of <span className="font-semibold">{employees.length}</span>{" "}
                  employees
                </p>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Employee Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide whitespace-nowrap">
                  Employee
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide whitespace-nowrap">
                  Company & Department
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide whitespace-nowrap">
                  Contact
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wide whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              <AnimatePresence mode="popLayout">
                {filteredEmployees.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-300 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <p className="text-base font-medium text-gray-500">
                        No employees found matching your filters.
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting your search or filter criteria
                      </p>
                    </td>
                  </motion.tr>
                ) : (
                  paginatedEmployees.map((employee, index) => {
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
                        index={index}
                      />
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredEmployees.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredEmployees.length)} of{" "}
                <span className="font-bold text-gray-900">{filteredEmployees.length}</span> employees
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </motion.button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                      currentPage === page
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </motion.button>
                ))}
              </div>

              {/* Next Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm"
                }`}
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
