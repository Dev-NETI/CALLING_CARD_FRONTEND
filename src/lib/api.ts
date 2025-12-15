import {
  User,
  Company,
  Employee,
  VirtualCard,
  AuthResponse,
  LoginResponse,
  VerifyCodeRequest,
  ResendCodeRequest,
  LoginCredentials,
  RegisterData,
  CompanyFormData,
  EmployeeFormData,
  VirtualCardFormData,
  UserFormData,
  Role,
  PaginatedResponse,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const error = await response.json();

        // Handle Laravel validation errors
        if (error.errors) {
          // Get first error from validation errors object
          const firstErrorKey = Object.keys(error.errors)[0];
          const firstError = error.errors[firstErrorKey];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.detail) {
          errorMessage = error.detail;
        }

        // Log the full error for debugging
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          error: error,
        });
      } catch (e) {
        console.error("Failed to parse error response:", e);
      }

      throw new Error(errorMessage);
    }
    return response.json();
  }

  // Auth endpoints
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return this.handleResponse<LoginResponse>(response);
  }

  async verifyCode(data: VerifyCodeRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async resendCode(data: ResendCodeRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/resend-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async logout(): Promise<void> {
    const response = await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Logout failed");
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_URL}/user`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<User>(response);
  }

  // Company endpoints
  async getCompanies(): Promise<Company[]> {
    try {
      console.log("Fetching companies from:", `${API_URL}/companies`);
      const response = await fetch(`${API_URL}/companies`, {
        headers: this.getAuthHeaders(),
      });
      console.log("Get companies response status:", response.status);
      const data = await this.handleResponse<Company[]>(response);
      console.log("Companies data received:", data);
      return data;
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Cannot connect to backend server. Make sure it is running on " +
            API_URL
        );
      }
      throw error;
    }
  }

  async createCompany(data: CompanyFormData): Promise<Company> {
    try {
      console.log("Creating company with data:", data);
      console.log("API URL:", `${API_URL}/companies`);

      const response = await fetch(`${API_URL}/companies`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      console.log("Response status:", response.status);
      return this.handleResponse<Company>(response);
    } catch (error) {
      console.error("Failed to create company:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Cannot connect to backend server. Make sure it is running on " +
            API_URL
        );
      }
      throw error;
    }
  }

  async updateCompany(id: number, data: CompanyFormData): Promise<Company> {
    const response = await fetch(`${API_URL}/companies/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Company>(response);
  }

  async deleteCompany(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/companies/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Delete failed");
    }
  }

  // Employee endpoints
  async getEmployees(): Promise<Employee[]> {
    try {
      console.log("Fetching employees from:", `${API_URL}/employees`);
      const response = await fetch(`${API_URL}/employees`, {
        headers: this.getAuthHeaders(),
      });
      console.log("Get employees response status:", response.status);

      if (!response.ok) {
        console.error("Employee fetch failed with status:", response.status);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to fetch employees: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Parsed employees data:", data);
      console.log("Data type:", typeof data);
      console.log("Is array?:", Array.isArray(data));

      // Handle different response structures
      if (Array.isArray(data)) {
        console.log("✓ Response is direct array, length:", data.length);
        return data;
      } else if (data && Array.isArray(data.data)) {
        console.log(
          "✓ Response has data.data array, length:",
          data.data.length
        );
        return data.data;
      } else if (data && Array.isArray(data.employees)) {
        console.log(
          "✓ Response has data.employees array, length:",
          data.employees.length
        );
        return data.employees;
      } else if (data && data.results && Array.isArray(data.results)) {
        console.log(
          "✓ Response has data.results array (paginated), length:",
          data.results.length
        );
        return data.results;
      }

      console.warn("⚠ Unexpected employees response structure:", data);
      console.warn("Available keys:", data ? Object.keys(data) : "no keys");
      return [];
    } catch (error) {
      console.error("❌ Failed to fetch employees:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Cannot connect to backend server. Make sure it is running on " +
            API_URL
        );
      }
      throw error;
    }
  }

  async getEmployee(id: number): Promise<Employee> {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Employee>(response);
  }

  async createEmployee(data: EmployeeFormData): Promise<Employee> {
    const response = await fetch(`${API_URL}/employees`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Employee>(response);
  }

  async updateEmployee(id: number, data: EmployeeFormData): Promise<Employee> {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Employee>(response);
  }

  async deleteEmployee(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Delete failed");
    }
  }

  // Virtual Card endpoints
  async createVirtualCard(data: VirtualCardFormData): Promise<VirtualCard> {
    const response = await fetch(`${API_URL}/employees/virtual-card`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<VirtualCard>(response);
  }

  async getVirtualCard(employeeId: number): Promise<Employee> {
    const response = await fetch(`${API_URL}/cards/${employeeId}`, {
      headers: { "Content-Type": "application/json" },
    });
    return this.handleResponse<Employee>(response);
  }

  async getVirtualCardByEmployeeId(employeeId: number): Promise<VirtualCard> {
    const response = await fetch(
      `${API_URL}/employees/virtual-card/${employeeId}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse<VirtualCard>(response);
  }

  async updateVirtualCard(data: VirtualCardFormData): Promise<VirtualCard> {
    const response = await fetch(`${API_URL}/employees/virtual-card`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<VirtualCard>(response);
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<{ total_companies: number; total_employees: number }> {
    const response = await fetch(`${API_URL}/dashboard/stats`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ total_companies: number; total_employees: number }>(response);
  }

  // User Management endpoints
  async getUsers(page: number = 1): Promise<PaginatedResponse<User>> {
    const response = await fetch(`${API_URL}/users?page=${page}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PaginatedResponse<User>>(response);
  }

  async getUser(id: number): Promise<User> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<User>(response);
  }

  async createUser(data: UserFormData): Promise<{ message: string; user: User }> {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<{ message: string; user: User }>(response);
  }

  async updateUser(id: number, data: Partial<UserFormData>): Promise<{ message: string; user: User }> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<{ message: string; user: User }>(response);
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async getRoles(): Promise<Role[]> {
    const response = await fetch(`${API_URL}/roles`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Role[]>(response);
  }

  async assignRoles(userId: number, roleIds: number[]): Promise<{ message: string; user: User }> {
    const response = await fetch(`${API_URL}/users/${userId}/assign-roles`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ role_ids: roleIds }),
    });
    return this.handleResponse<{ message: string; user: User }>(response);
  }
}

export const api = new ApiClient();
