# Virtual Calling Card System - Frontend

A modern Next.js frontend application for managing virtual business cards with a beautiful, professional UI.

## Features

- User authentication (login/register)
- Company management (create, edit, delete companies)
- Employee management (create, edit, delete employees)
- Virtual card creation with customizable themes and social links
- Public virtual card viewing (no authentication required)
- Responsive design for mobile, tablet, and desktop
- Toast notifications for user feedback
- Protected routes with authentication

## Tech Stack

- **Next.js 16.0.0** - React framework
- **React 19.2.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Context API** - State management

## Project Structure

```
src/
├── app/
│   ├── (protected)/          # Protected routes
│   │   ├── dashboard/        # Dashboard page
│   │   ├── companies/        # Company management
│   │   ├── employees/        # Employee management
│   │   └── layout.tsx        # Protected layout wrapper
│   ├── card/[slug]/          # Public virtual card view
│   ├── context/              # React context providers
│   │   └── AuthContext.tsx   # Authentication context
│   ├── login/                # Login page
│   ├── register/             # Register page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page (redirects)
├── components/
│   ├── ui/                   # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── TextArea.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── Toast.tsx
│   └── ProtectedRoute.tsx    # Protected route wrapper
├── lib/
│   └── api.ts                # API client
└── types/
    └── index.ts              # TypeScript type definitions
```

## Environment Variables

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## API Endpoints

The application connects to the backend API with the following endpoints:

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /user` - Get current user

### Companies
- `GET /companies` - Get all companies
- `POST /companies` - Create company
- `PUT /companies/{id}` - Update company
- `DELETE /companies/{id}` - Delete company

### Employees
- `GET /employees` - Get all employees
- `GET /employees/{id}` - Get employee by ID
- `POST /employees` - Create employee
- `PUT /employees/{id}` - Update employee
- `DELETE /employees/{id}` - Delete employee

### Virtual Cards
- `POST /employees/{id}/virtual-card` - Create virtual card
- `PUT /employees/{id}/virtual-card` - Update virtual card
- `GET /cards/{slug}` - Get public virtual card (no auth)

## Pages

### Authentication Pages
- `/login` - Login page with demo credentials
- `/register` - Registration page

### Protected Pages
- `/dashboard` - Main dashboard with overview
- `/companies` - Company management
- `/employees` - Employee management
- `/employees/[id]/card` - Virtual card creation

### Public Pages
- `/card/[slug]` - Public virtual card view

## UI Components

### Button
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

Variants: `primary`, `secondary`, `danger`, `outline`
Sizes: `sm`, `md`, `lg`

### Input
```tsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
/>
```

### Select
```tsx
<Select
  label="Company"
  value={companyId}
  onChange={handleChange}
  options={companies.map(c => ({ value: c.id, label: c.company_name }))}
/>
```

### Modal
```tsx
<Modal
  isOpen={isModalOpen}
  onClose={handleClose}
  title="Create Company"
  size="lg"
>
  {/* Modal content */}
</Modal>
```

### Toast Notifications
```tsx
const { showToast } = useToast();
showToast('Success message', 'success');
showToast('Error message', 'error');
```

## Authentication

The application uses token-based authentication:

1. User logs in with email/password
2. Backend returns a JWT token
3. Token is stored in localStorage
4. Token is included in all authenticated requests
5. Protected routes check for token presence

### Demo Credentials
```
Email: sean@gmail.com
Password: password123
```

## Styling

The application uses Tailwind CSS v4 with:
- Gradient backgrounds
- Modern shadow effects
- Smooth transitions
- Responsive design
- Custom animations

### Color Scheme
- Primary: Blue to Purple gradient
- Background: Soft gradient from blue-50 to pink-50
- Text: Gray scale for readability
- Accents: Various colors for different sections

## Building for Production

```bash
npm run build
npm start
```

## Development Tips

1. **Hot Reload**: Changes are automatically reflected in the browser
2. **TypeScript**: Use proper types for all data structures
3. **Error Handling**: All API calls include try-catch blocks
4. **Loading States**: Show loading indicators during async operations
5. **Toast Notifications**: Provide user feedback for all actions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues or questions, please contact the development team.
