# REST API Documentation — Furkan Alp Gunay

## Responsibilities
Authentication system, User CRUD, AI Preferences, Admin panel, and system security middleware.

## Endpoints

### Authentication
| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register` | `{ "fullName": "string", "email": "string", "password": "string" }` | Register a new user account. Returns user object. |
| POST | `/api/v1/auth/login` | `{ "email": "string", "password": "string" }` | Authenticate and receive a JWT token. |

### User Profile
| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/v1/users/me` | — | Get the authenticated user's profile. |
| GET | `/api/v1/users/:userId` | — | Get a specific user's profile (self only). |
| PUT | `/api/v1/users/:userId` | `{ "full_name": "string", "risk_level": "LOW\|MEDIUM\|HIGH" }` | Update profile fields (partial update). |
| DELETE | `/api/v1/users/:userId` | — | Delete own account. |

### AI Preferences
| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/api/v1/users/:userId/ai-preferences` | `{ "riskLevel": "LOW\|MEDIUM\|HIGH", "investmentTerm": "SHORT_TERM\|MEDIUM_TERM\|LONG_TERM" }` | Update AI advisor preferences. |

### Admin
| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/v1/admin/logs` | — | Get system activity logs (admin only). |
| DELETE | `/api/v1/admin/users/:id` | — | Delete any user (admin only). |
| PUT | `/api/v1/admin/users/:id/role` | `{ "role": "user\|admin" }` | Update a user's role (admin only). |
| POST | `/api/v1/admin/announcements` | `{ "message": "string" }` | Create a system announcement (admin only). |

## Authentication
All protected endpoints require the `Authorization: Bearer <token>` header. Tokens are issued via `/auth/login` and expire after 24 hours.

## Security Middleware
- `middleware.Protected()` — Validates JWT, extracts claims, stores in `c.Locals("claims")`.
- `controllers.AdminRequired` — Checks `claims.Role == "admin"` before proceeding.
