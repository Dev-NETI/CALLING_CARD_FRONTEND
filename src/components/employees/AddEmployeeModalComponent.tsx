"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Company, EmployeeFormData } from "@/types";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  companies: Company[];
}

export default function AddEmployeeModalComponent({
  isOpen,
  onClose,
  onSuccess,
  companies,
}: AddEmployeeModalProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    company_id: 0,
    employee_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    department: "",
    position: "",
    email: "",
    mobile_number: "",
    telephone: "",
    date_hired: "",
    status: "active",
  });
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const handleClose = () => {
    setFormData({
      company_id: 0,
      employee_id: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      department: "",
      position: "",
      email: "",
      mobile_number: "",
      telephone: "",
      date_hired: "",
      status: "active",
    });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await api.createEmployee(formData);
      showToast("Employee created successfully", "success");
      handleClose();
      onSuccess();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to create employee",
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
      title="Create Employee"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Company"
            value={formData.company_id}
            onChange={(e) =>
              setFormData({ ...formData, company_id: Number(e.target.value) })
            }
            options={companies.map((c) => ({
              value: c.id,
              label: c.company_name,
            }))}
            required
          />
          <Input
            label="Thread ID / Employee ID"
            value={formData.employee_id}
            onChange={(e) =>
              setFormData({ ...formData, employee_id: e.target.value })
            }
            required
            placeholder="526"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="First Name"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            required
            placeholder="John"
          />
          <Input
            label="Middle Name"
            value={formData.middle_name}
            onChange={(e) =>
              setFormData({ ...formData, middle_name: e.target.value })
            }
            placeholder="M."
          />
          <Input
            label="Last Name"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            required
            placeholder="Doe"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Department"
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            placeholder="Network Operation Department"
          />
          <Input
            label="Position"
            value={formData.position}
            onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            }
            required
            placeholder="Software Engineer"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            placeholder="john.doe@example.com"
          />
          <Input
            label="Mobile Number"
            value={formData.mobile_number}
            onChange={(e) =>
              setFormData({ ...formData, mobile_number: e.target.value })
            }
            placeholder="+1 234 567 8900"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Telephone"
            value={formData.telephone}
            onChange={(e) =>
              setFormData({ ...formData, telephone: e.target.value })
            }
            placeholder="+1 234 567 8900"
          />
          <Input
            label="Date Hired"
            type="date"
            value={formData.date_hired}
            onChange={(e) =>
              setFormData({ ...formData, date_hired: e.target.value })
            }
          />
        </div>
        <Select
          label="Status"
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value as "active" | "inactive",
            })
          }
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
          required
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
            Create Employee
          </Button>
        </div>
      </form>
    </Modal>
  );
}
