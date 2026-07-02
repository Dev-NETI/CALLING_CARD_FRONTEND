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
  x: number; // 0–100, % — meaning depends on align: left edge / center / right edge
  y: number; // 0–100, % from top edge of card
}

// Horizontal alignment anchor: which point of the element sits at x%.
// "left" (default) = element's left edge, "center" = element's horizontal
// center, "right" = element's right edge — lets an element stay visually
// aligned to that anchor regardless of its rendered width or text length.
export type HorizontalAlign = "left" | "center" | "right";

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
  width?: number;       // vw value — wraps text to a fixed box instead of
                         // auto-sizing to content, so long real data (e.g. a
                         // long department name) wraps predictably instead of
                         // growing past where it was positioned in the editor
}

export interface LogoCardElement extends BaseCardElement {
  type: "logo";
  width: number; // vw value
  src?: string;  // uploaded image as data URL; if absent, uses company logo
  align?: HorizontalAlign;
}

export interface QRCardElement extends BaseCardElement {
  type: "qr";
  url: string;
  label: string;
  size: number; // vw value
  align?: HorizontalAlign;
}

export interface CertLogoCardElement extends BaseCardElement {
  type: "cert_logo";
  filename: string; // fallback: /public/assets/certifications/<filename>
  src?: string;     // uploaded image as data URL (takes priority over filename)
  width: number;    // vw value
  align?: HorizontalAlign;
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
  align?: HorizontalAlign;
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

function templateVariableValues(employee: Employee): Record<string, string> {
  const middleInitial = employee.middle_name
    ? employee.middle_name.charAt(0) + "."
    : "";
  const fullName = [employee.first_name, middleInitial, employee.last_name]
    .filter(Boolean)
    .join(" ");

  return {
    first_name: employee.first_name,
    middle_name: employee.middle_name ?? "",
    middle_initial: middleInitial,
    last_name: employee.last_name,
    full_name: fullName,
    department: employee.department ?? "",
    position: employee.position,
    email: employee.email,
    mobile_number: employee.mobile_number ?? "",
    telephone: employee.telephone ?? "",
    company_name: employee.company?.company_name ?? "",
    company_address: employee.company?.company_address ?? "",
    company_telephone: employee.company?.company_telephone ?? "",
    company_website: employee.company?.company_website ?? "",
  };
}

export function resolveTemplate(
  template: string,
  employee: Employee,
): string {
  const values = templateVariableValues(employee);
  return template
    .replace(/\{\{(\w+)\}\}/g, (match, key) => values[key] ?? match)
    .trim();
}

// True if the template is static text, or at least one of its {{variable}}
// placeholders resolves to a non-empty value for this employee. Used to hide
// contact-info rows (e.g. "Tel. : {{telephone}}") when the underlying field
// is blank, instead of showing the label with nothing after it.
export function templateHasData(template: string, employee: Employee): boolean {
  const matches = [...template.matchAll(/\{\{(\w+)\}\}/g)];
  if (matches.length === 0) return true;
  const values = templateVariableValues(employee);
  return matches.some((m) => (values[m[1]] ?? "").trim() !== "");
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
