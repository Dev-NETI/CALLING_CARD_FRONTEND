export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Company {
  id: number;
  company_name: string;
  company_address?: string;
  company_telephone?: string;
  company_email?: string;
  company_website?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number;
  company_id: number;
  employee_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  department?: string;
  position: string;
  email: string;
  mobile_number?: string;
  telephone?: string;
  date_hired?: string;
  status: "active" | "inactive";
  photo_url?: string;
  created_at: string;
  updated_at: string;
  company?: Company;
}

export interface VirtualCard {
  id: number;
  employee_id: number;
  slug: string;
  bio?: string;
  theme_color?: string;
  facebook_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  created_at: string;
  updated_at: string;
  employee?: Employee;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface CompanyFormData {
  company_name: string;
  company_address?: string;
  company_telephone?: string;
  company_email?: string;
  company_website?: string;
}

export interface EmployeeFormData {
  company_id: number;
  employee_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  department?: string;
  position: string;
  email: string;
  mobile_number?: string;
  telephone?: string;
  date_hired?: string;
  status: "active" | "inactive";
}

export interface VirtualCardFormData {
  bio?: string;
  theme_color?: string;
  facebook_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  instagram_url?: string;
}
