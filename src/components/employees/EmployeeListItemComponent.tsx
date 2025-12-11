"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Employee } from "@/types";

interface EmployeeListItemProps {
  employee: Employee;
  companyName: string;
  companyHasBcard: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
  onCreateCard: (employeeId: number) => void;
}

export default function EmployeeListItemComponent({
  employee,
  companyName,
  companyHasBcard,
  onEdit,
  onDelete,
  onCreateCard,
}: EmployeeListItemProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/card/${employee.id}`);
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-medium">
                {employee.first_name.charAt(0)}
                {employee.last_name.charAt(0)}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {employee.first_name}{" "}
              {employee.middle_name && employee.middle_name + " "}
              {employee.last_name}
            </div>
            <div className="text-sm text-gray-500">
              ID: {employee.employee_id}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{employee.position}</div>
        {employee.department && (
          <div className="text-sm text-gray-500">{employee.department}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{companyName}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{employee.email}</div>
        {employee.mobile_number && (
          <div className="text-sm text-gray-500">{employee.mobile_number}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            employee.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {employee.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end gap-2">
          {companyHasBcard && (
            <Button variant="primary" size="sm" onClick={handleCardClick}>
              Card
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => onEdit(employee)}>
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(employee.id)}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
