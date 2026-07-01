export interface Permission {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description?: string;
  permissions?: Permission[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles?: Role[];
  created_at: string;
  updated_at: string;
}

// ── Card element types ────────────────────────────────────────────────────────

export type CardElementType = "text" | "logo" | "qr" | "cert_logo" | "shape";

interface BaseCardElement {
  id: string;
  type: CardElementType;
  x: number; // 0–100, % from left edge of card
  y: number; // 0–100, % from top edge of card
}

export interface TextCardElement extends BaseCardElement {
  type: "text";
  label: string;       // editor display name, e.g. "Fullname"
  template: string;    // e.g. "{{first_name}} {{last_name}}"
  font_size: number;   // vw value
  font_weight: "normal" | "bold";
  color: string;
  font_family: string;
  text_align: "left" | "center" | "right";
  uppercase: boolean;
}

export interface LogoCardElement extends BaseCardElement {
  type: "logo";
  width: number; // vw value
  src?: string;  // uploaded image as data URL; if absent, uses company logo
}

export interface QRCardElement extends BaseCardElement {
  type: "qr";
  url: string;
  label: string;
  size: number; // vw value
}

export interface CertLogoCardElement extends BaseCardElement {
  type: "cert_logo";
  filename: string; // fallback: /public/assets/certifications/<filename>
  src?: string;     // uploaded image as data URL (takes priority over filename)
  width: number;    // vw value
}

export interface ShapeCardElement extends BaseCardElement {
  type: "shape";
  shape: "rectangle" | "circle" | "rounded_rectangle";
  width: number;        // vw
  height: number;       // vw
  fill_color: string;
  border_color: string;
  border_width: number; // px
  opacity: number;      // 0–100
}

export type CardElement =
  | TextCardElement
  | LogoCardElement
  | QRCardElement
  | CertLogoCardElement
  | ShapeCardElement;

export interface CardDesign {
  id: number;
  company_id: number;
  background_color: string;
  font_family: string;
  front_elements: CardElement[];
  back_elements: CardElement[];
  created_at: string;
  updated_at: string;
}

export interface CardDesignFormData {
  background_color: string;
  font_family: string;
  front_elements: CardElement[];
  back_elements: CardElement[];
}

// Available template variables and their meanings
export const CARD_VARIABLES: { key: string; label: string }[] = [
  { key: "{{first_name}}", label: "First Name" },
  { key: "{{middle_name}}", label: "Middle Name" },
  { key: "{{middle_initial}}", label: "Middle Initial" },
  { key: "{{last_name}}", label: "Last Name" },
  { key: "{{full_name}}", label: "Full Name" },
  { key: "{{department}}", label: "Department" },
  { key: "{{position}}", label: "Position / Title" },
  { key: "{{email}}", label: "Email" },
  { key: "{{mobile_number}}", label: "Mobile Number" },
  { key: "{{telephone}}", label: "Telephone" },
  { key: "{{company_name}}", label: "Company Name" },
  { key: "{{company_address}}", label: "Company Address" },
  { key: "{{company_telephone}}", label: "Company Telephone" },
  { key: "{{company_website}}", label: "Company Website" },
];

export function resolveTemplate(
  template: string,
  employee: Employee,
): string {
  const middleInitial = employee.middle_name
    ? employee.middle_name.charAt(0) + "."
    : "";
  const fullName = [employee.first_name, middleInitial, employee.last_name]
    .filter(Boolean)
    .join(" ");

  return template
    .replace(/\{\{first_name\}\}/g, employee.first_name)
    .replace(/\{\{middle_name\}\}/g, employee.middle_name ?? "")
    .replace(/\{\{middle_initial\}\}/g, middleInitial)
    .replace(/\{\{last_name\}\}/g, employee.last_name)
    .replace(/\{\{full_name\}\}/g, fullName)
    .replace(/\{\{department\}\}/g, employee.department ?? "")
    .replace(/\{\{position\}\}/g, employee.position)
    .replace(/\{\{email\}\}/g, employee.email)
    .replace(/\{\{mobile_number\}\}/g, employee.mobile_number ?? "")
    .replace(/\{\{telephone\}\}/g, employee.telephone ?? "")
    .replace(/\{\{company_name\}\}/g, employee.company?.company_name ?? "")
    .replace(/\{\{company_address\}\}/g, employee.company?.company_address ?? "")
    .replace(/\{\{company_telephone\}\}/g, employee.company?.company_telephone ?? "")
    .replace(/\{\{company_website\}\}/g, employee.company?.company_website ?? "")
    .trim();
}

// ── Company / Employee types ──────────────────────────────────────────────────

export interface Company {
  id: number;
  company_name: string;
  company_address?: string;
  company_telephone?: string;
  company_email?: string;
  company_website?: string;
  company_logo?: string;
  logo_url?: string;
  has_bcard?: boolean;
  card_design?: CardDesign;
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
  image_path?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  company?: Company;
  virtual_card?: VirtualCard;
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

export interface LoginResponse {
  message: string;
  requires_2fa?: boolean;
  requires_2fa_setup?: boolean;
  challenge_token?: string;
  user?: User;
  token?: string;
}

export interface TwoFactorSetupResponse {
  qr_code: string;
  secret: string;
}

export interface TwoFactorVerifyRequest {
  challenge_token: string;
  code: string;
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
  has_bcard?: boolean;
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

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role_ids?: number[];
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}
