"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Dropdown from "@/components/ui/Dropdown";
import { useToast } from "@/components/ui/Toast";
import { Employee } from "@/types";

interface EmployeeListItemProps {
  employee: Employee;
  companyName: string;
  companyHasBcard: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
  onCreateCard: (employeeId: number) => void;
  onGenerateIDCard: (employee: Employee) => void;
  index: number;
}

export default function EmployeeListItemComponent({
  employee,
  companyName,
  companyHasBcard,
  onEdit,
  onDelete,
  onCreateCard,
  onGenerateIDCard,
  index,
}: EmployeeListItemProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const handleCardClick = () => {
    router.push(`/card/${employee.id}`);
  };

  const handleCopyLink = async () => {
    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
    const cardUrl = `${frontendUrl}card/${employee.id}`;

    try {
      await navigator.clipboard.writeText(cardUrl);
      showToast("Card URL copied to clipboard!", "success");
    } catch (err) {
      console.error("Failed to copy link:", err);
      showToast("Failed to copy URL. Please try again.", "error");
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group"
      layout
    >
      {/* Employee Name & ID */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 h-12 w-12"
          >
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-base">
                {employee.first_name.charAt(0)}
                {employee.last_name.charAt(0)}
              </span>
            </div>
          </motion.div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-gray-900 tracking-tight">
              {employee.first_name}{" "}
              {employee.middle_name && employee.middle_name + " "}
              {employee.last_name}
            </div>
            <div className="text-sm font-medium text-gray-900">
              {employee.position}
            </div>
            <div className="text-xs font-medium text-gray-500 mt-0.5">
              ID: <span className="font-mono">{employee.employee_id}</span>
            </div>
          </div>
        </div>
      </td>

      {/* Company & Department */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="text-sm font-semibold text-gray-900">{companyName}</div>
        {employee.department && (
          <div className="text-xs font-medium text-gray-500 mt-1 px-2 py-1 bg-gray-100 rounded-md inline-block">
            {employee.department}
          </div>
        )}
      </td>

      {/* Contact */}
      <td className="px-6 py-5">
        <div className="text-sm font-medium text-gray-900">
          {employee.email}
        </div>
        {employee.mobile_number && (
          <div className="text-xs font-medium text-gray-500 mt-1 font-mono">
            {employee.mobile_number}
          </div>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end">
          <Dropdown
            trigger={
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            }
            items={[
              ...(companyHasBcard
                ? [
                    {
                      label: "View Card",
                      onClick: handleCardClick,
                      variant: "primary" as const,
                      icon: (
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
                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                          />
                        </svg>
                      ),
                    },
                    {
                      label: "Copy Link",
                      onClick: handleCopyLink,
                      variant: "default" as const,
                      icon: (
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
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      ),
                    },
                  ]
                : []),
              {
                label: "Generate ID Card",
                onClick: () => onGenerateIDCard(employee),
                variant: "primary" as const,
                icon: (
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
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                ),
              },
              {
                label: "Edit",
                onClick: () => onEdit(employee),
                variant: "default" as const,
                icon: (
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                ),
              },
              {
                label: "Delete",
                onClick: () => onDelete(employee.id),
                variant: "danger" as const,
                icon: (
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                ),
              },
            ]}
          />
        </div>
      </td>
    </motion.tr>
  );
}
