"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Company, CardDesign, CardDesignFormData } from "@/types";
import { api } from "@/lib/api";
import Navigation from "@/components/layout/Navigation";
import PermissionGuard from "@/components/PermissionGuard";
import { PERMISSIONS } from "@/lib/utils/permissions";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import CardDesignEditorComponent from "@/components/companies/CardDesignEditorComponent";

export default function CardDesignPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = parseInt(params.id as string);
  const { showToast } = useToast();

  const [company, setCompany] = useState<Company | null>(null);
  const [cardDesign, setCardDesign] = useState<CardDesign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [companyId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [companiesData, design] = await Promise.all([
        api.getCompanies(),
        api.getCardDesign(companyId),
      ]);
      const found = companiesData.find((c) => c.id === companyId) ?? null;
      setCompany(found);
      setCardDesign(design);
    } catch {
      showToast("Failed to load company data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: CardDesignFormData) => {
    setIsSaving(true);
    try {
      const saved = await api.saveCardDesign(companyId, data, cardDesign?.id);
      setCardDesign(saved);
      showToast("Card design saved successfully", "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to save design",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PermissionGuard permission={PERMISSIONS.MANAGE_COMPANIES}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Navigation />

        {isLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        ) : !company ? (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <p className="text-gray-600 mb-4">Company not found.</p>
            <Button onClick={() => router.push("/companies")}>
              Back to Companies
            </Button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => router.push("/companies")}
                className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Companies
              </button>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Card Design</h2>
              <p className="text-gray-600 mt-1">{company.company_name}</p>
              {!cardDesign && (
                <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3 inline-block">
                  No design saved yet — defaults will be used until you save.
                </p>
              )}
            </div>

            <CardDesignEditorComponent
              company={company}
              initialDesign={cardDesign}
              onSave={handleSave}
              isSaving={isSaving}
            />
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}
