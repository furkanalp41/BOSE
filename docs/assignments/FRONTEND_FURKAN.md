# Frontend Documentation — Furkan Alp Gunay

## Responsibilities
Authentication UI, User Dashboard, Admin Panel, and application layout/routing.

## Pages

### LoginPage (`/login`)
- **File:** `frontend/src/pages/LoginPage.jsx`
- Login form with email and password fields.
- On success, stores JWT token in auth store and redirects to `/dashboard`.
- Uses `AuthLayout` wrapper with animated background.

### RegisterPage (`/register`)
- **File:** `frontend/src/pages/RegisterPage.jsx`
- Registration form with full name, email, and password.
- Client-side validation (min 8 char password).
- Redirects to `/dashboard` on success.

### DashboardPage (`/dashboard`)
- **File:** `frontend/src/pages/DashboardPage.jsx`
- Main hub after login. Contains a sidebar for navigation.
- Sections: Profile Card, Balance Hero, Portfolio Chart, AI Preferences, Danger Zone.
- Real-time balance display from the user profile API.

### AdminPanel
- **File:** `frontend/src/pages/AdminPanel.jsx`
- Admin-only interface for user management and system logs.
- Features: view activity logs, delete users, update user roles, post announcements.

## Key Components
| Component | File | Description |
|-----------|------|-------------|
| Sidebar | `components/layout/Sidebar.jsx` | Main navigation sidebar with links to all pages. |
| ProfileCard | `components/dashboard/ProfileCard.jsx` | Displays user info (name, email, role). |
| BalanceHero | `components/dashboard/BalanceHero.jsx` | Shows virtual balance with formatting. |
| AIPreferences | `components/dashboard/AIPreferences.jsx` | Risk level and investment term selector. |
| DangerZone | `components/dashboard/DangerZone.jsx` | Account deletion with confirmation modal. |
| AuthLayout | `components/auth/AuthLayout.jsx` | Layout wrapper for login/register pages. |
| LoginForm | `components/auth/LoginForm.jsx` | Reusable login form component. |
| RegisterForm | `components/auth/RegisterForm.jsx` | Reusable registration form component. |

## Routing
Uses React Router v6 with `PrivateRoute` and `PublicRoute` guards defined in `App.jsx`. Unauthenticated users are redirected to `/login`.
