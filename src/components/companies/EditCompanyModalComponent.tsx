"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { Company, CompanyFormData } from "@/types";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  company: Company | null;
}

export default function EditCompanyModalComponent({
  isOpen,
  onClose,
  onSuccess,
  company,
}: EditCompanyModalProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    company_name: "",
    company_address: "",
    company_telephone: "",
    company_email: "",
    company_website: "",
    has_bcard: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (company) {
      setFormData({
        company_name: company.company_name,
        company_address: company.company_address || "",
        company_telephone: company.company_telephone || "",
        company_email: company.company_email || "",
        company_website: company.company_website || "",
        has_bcard: company.has_bcard || false,
      });
    }
  }, [company]);

  const handleClose = () => {
    setFormData({
      company_name: "",
      company_address: "",
      company_telephone: "",
      company_email: "",
      company_website: "",
      has_bcard: false,
    });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    setIsSaving(true);

    try {
      await api.updateCompany(company.id, formData);
      showToast("Company updated successfully", "success");
      handleClose();
      onSuccess();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to update company",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Company" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Company Name"
          value={formData.company_name}
          onChange={(e) =>
            setFormData({ ...formData, company_name: e.target.value })
          }
          required
          placeholder="Enter company name"
        />
        <Input
          label="Email"
          type="email"
          value={formData.company_email}
          onChange={(e) =>
            setFormData({ ...formData, company_email: e.target.value })
          }
          placeholder="company@example.com"
        />
        <Input
          label="Telephone"
          value={formData.company_telephone}
          onChange={(e) =>
            setFormData({ ...formData, company_telephone: e.target.value })
          }
          placeholder="+1 234 567 8900"
        />
        <Input
          label="Website"
          value={formData.company_website}
          onChange={(e) =>
            setFormData({ ...formData, company_website: e.target.value })
          }
          placeholder="https://example.com"
        />
        <Input
          label="Address"
          value={formData.company_address}
          onChange={(e) =>
            setFormData({ ...formData, company_address: e.target.value })
          }
          placeholder="Company address"
        />
        <Checkbox
          label="Has Business Card"
          description="Check if this company has a business card"
          checked={formData.has_bcard}
          onChange={(e) =>
            setFormData({ ...formData, has_bcard: e.target.checked })
          }
        />
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" isLoading={isSaving}>
            Update Company
          </Button>
        </div>
      </form>
    </Modal>
  );
}
