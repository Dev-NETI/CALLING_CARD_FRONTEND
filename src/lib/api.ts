import {
  User,
  Company,
  Employee,
  VirtualCard,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  CompanyFormData,
  EmployeeFormData,
  VirtualCardFormData,
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
        errorMessage = error.message || error.detail || errorMessage;

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

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return this.handleResponse<AuthResponse>(response);
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
    const response = await fetch(`${API_URL}/employees`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Employee[]>(response);
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
  async createVirtualCard(
    employeeId: number,
    data: VirtualCardFormData
  ): Promise<VirtualCard> {
    const response = await fetch(
      `${API_URL}/employees/${employeeId}/virtual-card`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );
    return this.handleResponse<VirtualCard>(response);
  }

  async getVirtualCard(slug: string): Promise<VirtualCard> {
    const response = await fetch(`${API_URL}/cards/${slug}`, {
      headers: { "Content-Type": "application/json" },
    });
    return this.handleResponse<VirtualCard>(response);
  }

  async updateVirtualCard(
    employeeId: number,
    data: VirtualCardFormData
  ): Promise<VirtualCard> {
    const response = await fetch(
      `${API_URL}/employees/${employeeId}/virtual-card`,
      {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );
    return this.handleResponse<VirtualCard>(response);
  }
}

export const api = new ApiClient();
