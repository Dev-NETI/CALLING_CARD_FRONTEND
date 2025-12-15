"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api";
import { Employee, VirtualCard, VirtualCardFormData } from "@/types";
import Button from "@/components/ui/Button";
import FlippableCard from "@/components/virtualcard/FlippableCard";
import Link from "next/link";

export default function VirtualCardPage() {
  const params = useParams();
  const employeeId = Number(params.id);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [card, setCard] = useState<VirtualCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState<VirtualCardFormData>({
    bio: "",
    theme_color: "#6366f1",
    facebook_url: "",
    linkedin_url: "",
    twitter_url: "",
    instagram_url: "",
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchEmployeeAndCard();
  }, [employeeId]);

  const fetchEmployeeAndCard = async () => {
    try {
      setIsLoading(true);
      // Fetch employee data
      const employeeData = await api.getEmployee(employeeId);
      setEmployee(employeeData);

      // Try to fetch existing virtual card
      try {
        const cardData = await api.getVirtualCardByEmployeeId(employeeId);
        setCard(cardData);
        // Populate form with existing card data
        setFormData({
          bio: cardData.bio || "",
          theme_color: cardData.theme_color || "#6366f1",
          facebook_url: cardData.facebook_url || "",
          linkedin_url: cardData.linkedin_url || "",
          twitter_url: cardData.twitter_url || "",
          instagram_url: cardData.instagram_url || "",
        });
      } catch (error) {
        // Card doesn't exist yet, that's okay
      }
    } catch (error) {
      showToast("Failed to load employee data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let result;
      const dataToSubmit = {
        ...formData,
        employee_id: employeeId,
      };

      if (card) {
        // Update existing card
        result = await api.updateVirtualCard(dataToSubmit);
        showToast("Virtual card updated successfully!", "success");
      } else {
        // Create new card
        result = await api.createVirtualCard(dataToSubmit);
        showToast("Virtual card created successfully!", "success");
      }
      setCard(result);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to save virtual card",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyUrl = () => {
    if (card?.slug) {
      const url = `${window.location.origin}/card/${card.slug}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast("URL copied to clipboard!", "success");
    }
  };

  // Create preview card from employee + form data
  const previewCard = useMemo(() => {
    if (!employee) return null;

    // If card exists, use it, otherwise create preview from employee + form data
    if (card) return card;

    // Create a preview VirtualCard object
    return {
      id: 0,
      slug: "preview",
      employee_id: employee.id,
      employee: employee,
      bio: formData.bio,
      theme_color: formData.theme_color,
      facebook_url: formData.facebook_url,
      linkedin_url: formData.linkedin_url,
      twitter_url: formData.twitter_url,
      instagram_url: formData.instagram_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as VirtualCard;
  }, [employee, card, formData]);

  const handleDownloadContact = () => {
    if (!card?.employee) return;

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${card.employee.first_name} ${card.employee.middle_name || ""} ${
      card.employee.last_name
    }
N:${card.employee.last_name};${card.employee.first_name};${
      card.employee.middle_name || ""
    };;
TITLE:${card.employee.position}
ORG:${card.employee.company?.company_name || ""}
EMAIL:${card.employee.email}
TEL:${card.employee.mobile_number || ""}
${card.facebook_url ? `URL;type=Facebook:${card.facebook_url}` : ""}
${card.linkedin_url ? `URL;type=LinkedIn:${card.linkedin_url}` : ""}
${card.twitter_url ? `URL;type=Twitter:${card.twitter_url}` : ""}
${card.instagram_url ? `URL;type=Instagram:${card.instagram_url}` : ""}
NOTE:${card.bio || ""}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${card.employee.first_name}_${card.employee.last_name}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Employee not found
          </h2>
          <Link href="/employees">
            <Button>Back to Employees</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {card ? "Manage Virtual Card" : "Create Virtual Card"}
              </h2>
              <p className="text-gray-600">
                {card ? "Update" : "Design a"} virtual calling card for{" "}
                <span className="font-semibold">
                  {employee.first_name} {employee.last_name}
                </span>
              </p>
            </div>
            <Link href="/employees">
              <Button variant="outline" size="sm">
                Back to Employees
              </Button>
            </Link>
          </div>

          {/* Card URL and Actions - Only show if card exists */}
          {card && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 mb-1">Card URL:</p>
                  <p className="text-blue-600 font-mono text-sm break-all">
                    {window.location.origin}/card/{card.slug}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                    {copied ? (
                      <>
                        <svg
                          className="w-4 h-4 mr-2 inline-block"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-2 inline-block"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                        Share
                      </>
                    )}
                  </Button>
                  <Link href={`/card/${card.slug}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <svg
                        className="w-4 h-4 mr-2 inline-block"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      View Public Card
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDownloadContact}
                  >
                    <svg
                      className="w-4 h-4 mr-2 inline-block"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Save Contact
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form and Preview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Card Details
            </h3>

            {/* Employee Information Display */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Employee Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium text-gray-900">
                    {employee.first_name} {employee.middle_name}{" "}
                    {employee.last_name}
                  </span>
                </div>
                {employee.department && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department:</span>
                    <span className="font-medium text-gray-900">
                      {employee.department}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Position:</span>
                  <span className="font-medium text-gray-900">
                    {employee.position}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">
                    {employee.email}
                  </span>
                </div>
                {employee.mobile_number && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mobile:</span>
                    <span className="font-medium text-gray-900">
                      {employee.mobile_number}
                    </span>
                  </div>
                )}
                {employee.telephone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Telephone:</span>
                    <span className="font-medium text-gray-900">
                      {employee.telephone}
                    </span>
                  </div>
                )}
                {employee.company && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Company:</span>
                    <span className="font-medium text-gray-900">
                      {employee.company.company_name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="pt-4">
                <Button type="submit" className="w-full" isLoading={isSaving}>
                  {card ? "Update Virtual Card" : "Generate Virtual Card"}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Side - Preview */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Card Preview
              </h3>
              {!card && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                  Live Preview
                </span>
              )}
            </div>
            {previewCard && previewCard.employee && (
              <FlippableCard employee={previewCard.employee} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
