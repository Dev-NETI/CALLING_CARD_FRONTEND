'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';
import { Employee, Company, EmployeeFormData } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<EmployeeFormData>({
    company_id: 0,
    employee_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    department: '',
    position: '',
    email: '',
    mobile_number: '',
    telephone: '',
    date_hired: '',
    status: 'active',
  });
  const [isSaving, setIsSaving] = useState(false);
  const { logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [employeesData, companiesData] = await Promise.all([
        api.getEmployees(),
        api.getCompanies(),
      ]);
      setEmployees(employeesData);
      setCompanies(companiesData);
    } catch (error) {
      showToast('Failed to load data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        company_id: employee.company_id,
        employee_id: employee.employee_id,
        first_name: employee.first_name,
        middle_name: employee.middle_name || '',
        last_name: employee.last_name,
        department: employee.department || '',
        position: employee.position,
        email: employee.email,
        mobile_number: employee.mobile_number || '',
        telephone: employee.telephone || '',
        date_hired: employee.date_hired || '',
        status: employee.status,
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        company_id: 0,
        employee_id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        department: '',
        position: '',
        email: '',
        mobile_number: '',
        telephone: '',
        date_hired: '',
        status: 'active',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingEmployee) {
        await api.updateEmployee(editingEmployee.id, formData);
        showToast('Employee updated successfully', 'success');
      } else {
        await api.createEmployee(formData);
        showToast('Employee created successfully', 'success');
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to save employee',
        'error'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      await api.deleteEmployee(id);
      showToast('Employee deleted successfully', 'success');
      fetchData();
    } catch (error) {
      showToast('Failed to delete employee', 'error');
    }
  };

  const handleCreateCard = (employeeId: number) => {
    router.push(`/employees/${employeeId}/card`);
  };

  const getCompanyName = (companyId: number) => {
    const company = companies.find((c) => c.id === companyId);
    return company?.company_name || 'Unknown';
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
                  <Button variant="outline" size="sm">
                    Companies
                  </Button>
                </Link>
                <Link href="/employees">
                  <Button variant="primary" size="sm">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Employees</h2>
            <p className="text-gray-600">Manage employee records and virtual cards</p>
          </div>
          <Button onClick={() => handleOpenModal()}>
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
            Create Employee
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading employees...</p>
          </div>
        ) : employees.length === 0 ? (
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No employees yet
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by adding your first employee
              </p>
              <Button onClick={() => handleOpenModal()}>Create Employee</Button>
            </div>
          </Card>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
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
                            {employee.first_name}{' '}
                            {employee.middle_name && employee.middle_name + ' '}
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
                        <div className="text-sm text-gray-500">
                          {employee.department}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getCompanyName(employee.company_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.email}</div>
                      {employee.mobile_number && (
                        <div className="text-sm text-gray-500">
                          {employee.mobile_number}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          employee.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleCreateCard(employee.id)}
                        >
                          Card
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenModal(employee)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(employee.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEmployee ? 'Edit Employee' : 'Create Employee'}
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
              label="Employee ID"
              value={formData.employee_id}
              onChange={(e) =>
                setFormData({ ...formData, employee_id: e.target.value })
              }
              required
              placeholder="EMP001"
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
              placeholder="IT Department"
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
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                status: e.target.value as 'active' | 'inactive',
              })
            }
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            required
          />
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isSaving}>
              {editingEmployee ? 'Update' : 'Create'} Employee
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
