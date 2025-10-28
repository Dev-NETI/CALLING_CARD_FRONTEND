"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Company } from "@/types";
import Button from "@/components/ui/Button";
import Link from "next/link";
import AddCompanyModalComponent from "@/components/companies/AddCompanyModalComponent";
import EditCompanyModalComponent from "@/components/companies/EditCompanyModalComponent";
import CompanyListComponent from "@/components/companies/CompanyListComponents";

export default function CompaniesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const { logout } = useAuth();

  const handleOpenCreateModal = () => {
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (company: Company) => {
    setEditingCompany(company);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCompany(null);
  };

  const handleSuccess = () => {
    // Refresh the company list
    if ((window as any).__refreshCompanies) {
      (window as any).__refreshCompanies();
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
                  <Button variant="primary" size="sm">
                    Companies
                  </Button>
                </Link>
                <Link href="/employees">
                  <Button variant="outline" size="sm">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Companies</h2>
            <p className="text-gray-600">Manage your company information</p>
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
            Create Company
          </Button>
        </div>

        <CompanyListComponent
          onEdit={handleOpenEditModal}
          onCreate={handleOpenCreateModal}
        />
      </div>

      <AddCompanyModalComponent
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
      />

      <EditCompanyModalComponent
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleSuccess}
        company={editingCompany}
      />
    </div>
  );
}
