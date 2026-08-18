# File Management System

A full-stack file management application with role-based access control, cloud storage, document parsing, and email notifications. Users can upload, organize, preview, and manage files in folders, while admins have system-wide oversight of all users and files.

## Technologies Used

### Client

| Category | Technology |
|---|---|
| Framework | Next.js 16.3.1 (App Router) |
| UI Library | React 19.2.8 |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS 4.x |
| Component System | shadcn/ui (Radix UI primitives) |
| State Management | Zustand 5.x (auth state) |
| Server-State | TanStack React Query 5.x |
| HTTP Client | Axios |
| Form Handling | React Hook Form + Zod 4.x |
| Charts | Recharts 3.x |
| Animations | Framer Motion 13.x |
| File Upload | React Dropzone |
| Toasts | Sonner |
| Theming | next-themes (light/dark/system) |

### Server

| Category | Technology |
|---|---|
| Runtime | Node.js |
| HTTP Framework | Express 5.2 |
| Language | TypeScript 7.x |
| ORM | Prisma 7.9 (driver-adapter pattern) |
| Database | PostgreSQL |
| Authentication | JWT (access + refresh tokens) |
| Password Hashing | bcrypt |
| File Storage | Cloudinary |
| File Upload | Multer (memoryStorage) |
| Text Extraction | pdf-parse, mammoth |
| Email | Mailjet |
| Validation | Zod 4.x |
| Dependency Injection | tsyringe |
| Security | Helmet, CORS, express-rate-limit |

## Folder Structure

```
file-management-system/
├── client/                          # Frontend (Next.js)
│   ├── app/                         # App Router pages and layouts
│   │   ├── (auth)/                  # Unauthenticated routes (login, register, verify-email)
│   │   ├── (dashboard)/             # Authenticated routes (files, statistics, profile)
│   │   │   ├── files/               # File browser (root + folder navigation)
│   │   │   ├── statistics/          # User statistics dashboard
│   │   │   ├── profile/             # User profile
│   │   │   └── admin/               # Admin-only (dashboard, files, users)
│   │   ├── layout.tsx               # Root layout (fonts, theme, providers)
│   │   └── page.tsx                 # Root redirect logic
│   ├── components/                  # React components
│   │   ├── auth/                    # Login, register, verify-email forms
│   │   ├── layout/                  # Sidebar, mobile nav, theme toggle
│   │   ├── files/                   # File browser, cards, upload, dialogs
│   │   ├── statistics/              # Stat cards, charts
│   │   ├── admin/                   # Admin dialogs (role, delete)
│   │   └── ui/                      # shadcn/ui primitives (22 components)
│   ├── hooks/                       # React Query hooks (auth, files, users, statistics)
│   ├── services/                    # API service layer (auth, files, folders, users, statistics)
│   ├── stores/                      # Zustand stores (auth-store)
│   ├── lib/                         # Axios client, API types, validations, utilities
│   └── utils/                       # File helpers (icons, colors, format size/date, download)
│
├── server/                          # Backend (Express)
│   ├── prisma/                      # Database schema, migrations, seed
│   │   ├── schema.prisma            # 4 models: User, VerificationCode, Folder, File
│   │   ├── seed.ts                  # Seeds admin user
│   │   └── migrations/              # Migration history
│   ├── src/
│   │   ├── server.ts                # Entry point (HTTP server, graceful shutdown)
│   │   ├── app.ts                   # Express app factory (middleware, routes, error handling)
│   │   ├── routes.ts                # Central router (/api/v1/*)
│   │   ├── app/                     # Feature modules
│   │   │   ├── auth/                # Auth (register, login, verify, refresh, logout)
│   │   │   ├── files/               # Files + folders (upload, CRUD, admin operations)
│   │   │   ├── users/               # User admin management (list, role, delete)
│   │   │   ├── statistics/          # Statistics (user + admin)
│   │   │   └── health/              # Health check endpoint
│   │   ├── common/                  # Shared infrastructure
│   │   │   ├── errors/              # AppError class
│   │   │   ├── middlewares/         # Auth, error handler, rate limiters
│   │   │   ├── validation/          # Zod validation wrapper
│   │   │   ├── http/                # Standardized response helper
│   │   │   ├── logger/              # Structured JSON logger
│   │   │   └── constants/           # Message constants
│   │   ├── lib/                     # External integrations
│   │   │   ├── di/                  # tsyringe DI container + tokens
│   │   │   ├── db/                  # Prisma client singleton
│   │   │   ├── cloudinary.ts        # Cloudinary upload/delete
│   │   │   └── email/               # Mailjet email provider
│   │   └── utils/                   # Environment variable helpers
│   └── dist/                        # Compiled JavaScript output
```

## Setup Instructions

### Prerequisites

- **Node.js** (v18 or later)
- **PostgreSQL** database
- **Cloudinary** account (for file storage)
- **Mailjet** account (for email verification)
- **npm** package manager

### 1. Clone the repository

```bash
git clone <repository-url>
cd file-management-system
```

### 2. Set up the server

```bash
cd server
npm install
```

### 3. Set up the client

```bash
cd ../client
npm install
```

## Environment Variables

### Server (`server/.env`)

Copy `server/.env.example` to `server/.env` and fill in the values:

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port (default: 8080) | `8080` |
| `NODE_ENV` | Environment mode | `development` |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `JWT_ACCESS_SECRET` | Secret for access tokens | (any strong random string) |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | (any strong random string) |
| `JWT_ACCESS_EXPIRES_IN` | Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | `7d` |
| `MAILJET_API_KEY` | Mailjet API key | (from Mailjet dashboard) |
| `MAILJET_SECRET_KEY` | Mailjet secret key | (from Mailjet dashboard) |
| `MAILJET_FROM_EMAIL` | Sender email address | `noreply@yourdomain.com` |
| `MAILJET_FROM_NAME` | Sender display name | `File Manager` |
| `ADMIN_EMAIL` | Admin email for seed | `admin@example.com` |
| `ADMIN_NAME` | Admin display name | `System Admin` |
| `ADMIN_PASSWORD` | Admin password for seed | (strong password) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | (from Cloudinary dashboard) |
| `CLOUDINARY_API_KEY` | Cloudinary API key | (from Cloudinary dashboard) |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | (from Cloudinary dashboard) |

### Client (`client/.env`)

Copy `client/.env.example` to `client/.env` and fill in the values:

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8080/api/v1` |

## Database Migration Steps

From the `server/` directory:

```bash
# Generate the Prisma client
npx prisma generate

# Run all pending migrations
npx prisma migrate dev

# Seed the database with an admin user
npx prisma db seed
```

> **Note:** The seed script creates an admin user using the `ADMIN_EMAIL`, `ADMIN_NAME`, and `ADMIN_PASSWORD` environment variables. If the admin email already exists, the seed is skipped.

## Running Locally

Start both the server and client in separate terminals:

**Terminal 1 — Server:**

```bash
cd server
npm run dev
```

The server starts at `http://localhost:8080` (or the port specified in `PORT`).

**Terminal 2 — Client:**

```bash
cd client
npm run dev
```

The client starts at `http://localhost:3000`.


### General Notes

- The server handles graceful shutdown on `SIGINT` and `SIGTERM` signals.
- Ensure all environment variables are set in the production environment.
- The PostgreSQL database must be accessible from the server environment.
- Cloudinary and Mailjet credentials must be valid for file uploads and email verification to work.

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Health

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | No | Database health check |

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login with email/password |
| POST | `/auth/verify-email` | No | Verify email with 6-digit code |
| POST | `/auth/resend-code` | No | Resend verification code |
| GET | `/auth/profile` | Bearer JWT | Get current user profile |
| POST | `/auth/refresh` | Refresh token cookie | Refresh access token |
| POST | `/auth/logout` | No | Clear refresh token |

### Files

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/files` | Bearer JWT | List files in a folder (paginated) |
| GET | `/files/:id` | Bearer JWT | Get file details |
| POST | `/files/upload` | Bearer JWT | Upload up to 20 files |
| DELETE | `/files/:id` | Bearer JWT | Delete a file |
| GET | `/files/admin/all` | Bearer JWT + ADMIN | List all files across users |
| DELETE | `/files/admin/:id` | Bearer JWT + ADMIN | Delete any user's file |

### Folders

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/folders` | Bearer JWT | Create a folder |
| DELETE | `/folders/:id` | Bearer JWT | Delete a folder and its contents |

### Users (Admin)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users` | Bearer JWT + ADMIN | List all users (paginated) |
| PATCH | `/users/:id/role` | Bearer JWT + ADMIN | Update a user's role |
| DELETE | `/users/:id` | Bearer JWT + ADMIN | Delete a user |

### Statistics

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/statistics/me` | Bearer JWT | Current user's statistics |
| GET | `/statistics/admin` | Bearer JWT + ADMIN | System-wide statistics |

## Assumptions
- **Email Verification:** Verification emails sent via Mailjet might land in your **Spam** . Please check your spam folder if you do not see the email in your inbox.
- **Cloudinary** is used for all file storage — files are not stored on the local filesystem.
- **Mailjet** is configured and the sender email is verified for email verification to work.
- File uploads are limited to **25 MB per file** and **20 files per request**.
- Access tokens expire in **15 minutes**; refresh tokens expire in **7 days** and are stored in httpOnly cookies.
- The seed script creates a single admin user. Additional admins can be promoted through the admin panel or database.
- The client expects the API at the URL defined by `NEXT_PUBLIC_API_URL` — this must be set correctly for the app to function.
