"use client";

import { useState, useEffect } from "react";
import { Company } from "@/types";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CompanyListItemComponent from "./CompanyListItemComponent";

interface CompanyListComponentProps {
  onEdit: (company: Company) => void;
  onCreate: () => void;
}

export default function CompanyListComponent({
  onEdit,
  onCreate,
}: CompanyListComponentProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const data = await api.getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error("Error in fetchCompanies:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to load companies",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this company?")) return;

    try {
      await api.deleteCompany(id);
      showToast("Company deleted successfully", "success");
      fetchCompanies();
    } catch (error) {
      showToast("Failed to delete company", "error");
    }
  };

  // Expose refresh method for parent component
  useEffect(() => {
    // Store fetchCompanies in a way the parent can call it
    (window as any).__refreshCompanies = fetchCompanies;
    return () => {
      delete (window as any).__refreshCompanies;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading companies...</p>
      </div>
    );
  }

  if (companies.length === 0) {
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No companies yet
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first company
          </p>
          <Button onClick={onCreate}>Create Company</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => (
        <CompanyListItemComponent
          key={company.id}
          company={company}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
