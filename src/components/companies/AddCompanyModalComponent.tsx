"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { CompanyFormData } from "@/types";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCompanyModalComponent({
  isOpen,
  onClose,
  onSuccess,
}: AddCompanyModalProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    company_name: "",
    company_address: "",
    company_telephone: "",
    company_email: "",
    company_website: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const handleClose = () => {
    setFormData({
      company_name: "",
      company_address: "",
      company_telephone: "",
      company_email: "",
      company_website: "",
    });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await api.createCompany(formData);
      showToast("Company created successfully", "success");
      handleClose();
      onSuccess();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to create company",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Company"
      size="lg"
    >
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
          type="url"
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
            Create Company
          </Button>
        </div>
      </form>
    </Modal>
  );
}
