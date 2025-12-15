"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Company } from "@/types";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Navigation from "@/components/layout/Navigation";
import { hasPermission, PERMISSIONS } from "@/lib/utils/permissions";
import AddCompanyModalComponent from "@/components/companies/AddCompanyModalComponent";
import EditCompanyModalComponent from "@/components/companies/EditCompanyModalComponent";
import CompanyListComponent from "@/components/companies/CompanyListComponents";

export default function CompaniesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Check permission
  useEffect(() => {
    if (user && !hasPermission(user, PERMISSIONS.MANAGE_COMPANIES)) {
      router.push("/forbidden");
    }
  }, [user, router]);

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
      <Navigation />

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
