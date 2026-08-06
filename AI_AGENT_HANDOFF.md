# 🤖 AI Coding Agent Handoff & Architecture Context
## MIMOS Academy Portal

Welcome, incoming AI Coding Agent! This document serves as your **definitive context map, architectural reference, and development guide** for the **MIMOS Academy Portal**.

This project was built from scratch using modern web engineering best practices. Read this document carefully before modifying or adding features to ensure complete continuity, security, and architectural integrity.

---

## 📑 Table of Contents
1. [Executive Summary & Tech Stack](#1-executive-summary--tech-stack)
2. [Directory Layout & Key File Map](#2-directory-layout--key-file-map)
3. [Database Architecture & Prisma Models](#3-database-architecture--prisma-models)
4. [Authentication & Security Architecture](#4-authentication--security-architecture)
5. [Server Actions & Data Fetching Patterns](#5-server-actions--data-fetching-patterns)
6. [Frontend Design System & Styling](#6-frontend-design-system--styling)
7. [⚠️ Critical Traps, Anti-Patterns & Rules](#7-critical-traps-anti-patterns--rules)
8. [🧪 Testing & Quality Assurance](#8-testing--quality-assurance)

---

## 1. Executive Summary & Tech Stack

The **MIMOS Academy Portal** is a production-grade web application and Content Management System (CMS) designed for **MIMOS Berhad** (Malaysia's National Applied R&D Centre). It serves public course catalogs, facility showcases, event schedules, and news updates while providing an administrative dashboard for content management.

### Tech Stack Blueprint
* **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
* **Library**: [React 19](https://react.dev/)
* **Language**: TypeScript 5 (`strict: true`)
* **Database & ORM**: PostgreSQL 14+ with [Prisma ORM 7](https://www.prisma.io/) (using `@prisma/adapter-pg`)
* **Object Storage**: Cloudflare R2 / S3 API via `@aws-sdk/client-s3`
* **Styling & UI**: [Tailwind CSS 4](https://tailwindcss.com/), Lucide Icons, Framer Motion
* **Authentication**: Custom HMAC-SHA256 Signed Session Cookie Auth (Stateless & Secure)
* **Testing**: [Vitest](https://vitest.dev/) (Unit & Integration tests for actions and auth)
* **Package Manager**: `npm`

---

## 2. Directory Layout & Key File Map

```text
MIMOS/
├── prisma/
│   ├── schema.prisma           # Complete PostgreSQL schema definition
│   ├── seed.ts                 # Database seed script for initial content & admin
│   └── migrations/             # Version-controlled SQL database migrations
├── src/
│   ├── app/
│   │   ├── (public)/           # Public-facing web pages (Layout, Home, Programs, About, Facilities, News, Contact)
│   │   ├── admin/
│   │   │   ├── login/          # Secured Admin Login page
│   │   │   └── (dashboard)/    # Secured Admin CMS Dashboard (Programs, Facilities, News, Events, etc.)
│   │   ├── actions/
│   │   │   ├── adminActions.ts # Primary Server Actions for CMS CRUD & R2 Uploads
│   │   │   ├── adminActions.test.ts # Vitest suite for admin server actions
│   │   │   ├── aboutActions.ts # Server Actions for About Us team & history management
│   │   │   └── aboutActions.test.ts # Vitest suite for about actions
│   │   ├── api/                # REST endpoints (contact form, file proxy)
│   │   ├── globals.css         # Tailwind 4 global styles & CSS variables
│   │   └── layout.tsx          # Root HTML/Font layout
│   ├── components/             # Reusable React components (Navbar, Footer, UI Cards, Modals, Forms)
│   └── lib/
│       ├── db.ts               # Prisma Client singleton with pg connection pool
│       ├── adminAuth.ts        # HMAC-SHA256 session signature & verification logic
│       ├── adminAuth.test.ts   # Vitest unit test for auth encryption
│       ├── r2.ts               # Cloudflare R2 S3 client initialization
│       └── utils.ts            # Classnames helper (clsx + tailwind-merge)
├── .env.example                # Blueprint for required environment variables
├── LOCAL_SETUP_GUIDE.md        # Beginner guide for local environment setup
└── package.json                # Dependencies & script declarations
```

---

## 3. Database Architecture & Prisma Models

The database uses PostgreSQL with Prisma ORM 7. Always inspect `prisma/schema.prisma` before modifying database schema.

### Core Data Models
1. **`User`**: Admin users (`email`, `hashedPassword`, `role: ADMIN | SUPERADMIN`).
2. **`Category`**: Program categories (e.g. Semiconductor, AI & Data Science, InfoSec).
3. **`Program`**: Training courses (`title`, `slug`, `description`, `syllabus`, `location`, `price`, `duration`, `dates`, `microsoftFormUrl`, `imageUrl`, `imageUrls`, `categoryId`).
4. **`Facility`**: Training facilities (`title`, `category`, `description`, `features`, `imageUrl`, `imageUrls`).
5. **`News`**: Announcements & news posts (`title`, `slug`, `excerpt`, `content`, `category`, `publishedAt`, `imageUrl`).
6. **`Event`**: Upcoming workshops & webinars (`title`, `description`, `eventDate`, `location`, `registrationUrl`).
7. **`Partner`**: Industry & university partner logos (`name`, `logoUrl`, `websiteUrl`).
8. **`Testimonial`**: Participant feedback (`name`, `role`, `company`, `quote`, `rating`).
9. **`Career`**: Job openings & internships (`title`, `department`, `type`, `description`, `requirements`).
10. **`AuditLog`**: System audit trailing (`action`, `entity`, `entityId`, `details`, `userId`).

### Database Workflow Command Rules
* **Schema Edit**: When editing `prisma/schema.prisma`, ALWAYS run `npx prisma generate` followed by `npx prisma migrate dev --name <description>`.
* **Database Access**: ALWAYS import `prisma` from `@/lib/db`. Never instantiate `new PrismaClient()` in actions or pages!

---

## 4. Authentication & Security Architecture

Admin authentication uses **stateless, cookie-based HMAC-SHA256 signatures** configured in `src/lib/adminAuth.ts`.

### How Auth Works
1. **Login**: User submits credentials to `adminLoginAction()` in `adminActions.ts`.
2. **Verification**: Checks hashed password against `User` table or `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `.env`.
3. **Token Creation**: Creates an HMAC-SHA256 signed payload containing `{ email, role, exp }` signed with `ADMIN_SESSION_SECRET`.
4. **Cookie**: Sets an `HTTPOnly`, `SameSite=Lax`, `Secure` cookie named `admin_session`.
5. **Session Verification**: Every protected Server Action MUST invoke:
   ```ts
   const session = await verifyAdminSession();
   if (!session) throw new Error("Unauthorized access");
   ```

---

## 5. Server Actions & Data Fetching Patterns

All CMS mutations (Create, Update, Delete, Reorder) use **Next.js Server Actions** located in `src/app/actions/`.

### Pattern Guidelines for Server Actions
1. **Directive**: Top of the file must have `'use server'`.
2. **Security Gate**: Always verify session first:
   ```ts
   const session = await verifyAdminSession();
   if (!session) return { success: false, error: 'Unauthorized' };
   ```
3. **Audit Logging**: Record significant mutations using `prisma.auditLog.create(...)`.
4. **Cache Revalidation**: Always revalidate affected routes so the public UI updates immediately:
   ```ts
   revalidatePath('/admin/programs');
   revalidatePath('/programs');
   revalidatePath('/');
   ```
5. **Error Handling**: Return clean objects `{ success: true, data }` or `{ success: false, error: string }`. Never leak unhandled database errors to the client.

### File & Image Upload Handling
* Image uploads are sent via `FormData` to Server Actions or API routes.
* Images are uploaded to **Cloudflare R2** via `src/lib/r2.ts` (`PutObjectCommand`).
* The public URL (`CLOUDFLARE_R2_PUBLIC_URL/filename.webp`) is saved in the database.
* Fallback: If R2 credentials are missing in local dev, graceful fallbacks or placeholder paths should be returned.

---

## 6. Frontend Design System & Styling

* **Styling**: Tailwind CSS 4 (`@tailwindcss/postcss`).
* **Icons**: `lucide-react`. Use clean, consistent icons throughout admin and public views.
* **Animations**: `framer-motion` for subtle page transitions, hover states, and modal popups.
* **Typography**: Inter / Outfit fonts defined in `src/app/layout.tsx`.
* **Component Architecture**:
  - Components are located in `src/components/`.
  - Prefer small, single-responsibility functional components.
  - Follow React 19 rules (use Server Components by default; add `'use client'` only when state/effects are required).

---

## 7. ⚠️ Critical Traps, Anti-Patterns & Rules

When acting as the AI agent on this codebase, **NEVER violate these rules**:

1. **🚫 NEVER mutate objects directly**: Always follow immutability (`[...items]`, `{ ...prev }`).
2. **🚫 NEVER hardcode API keys or secrets**: Always read from `process.env`.
3. **🚫 NEVER swallow errors silently**: Always log errors on the server and return user-friendly messages.
4. **🚫 NEVER skip `verifyAdminSession()`**: Every admin action MUST be authenticated.
5. **🚫 NEVER instantiate multiple `PrismaClient` instances**: Always reuse `import { prisma } from '@/lib/db'`.
6. **⚠️ Always revalidate cache**: After mutating database models, call `revalidatePath()` for both `/admin/...` and `/(public)/...`.
7. **⚠️ Keep tests passing**: Before declaring a task finished, run `npm test`, `npm run lint`, and `npm run build`.

---

## 8. 🧪 Testing & Quality Assurance

The codebase includes a Vitest suite covering server actions and auth logic.

### Commands
```bash
# Run Vitest unit tests
npm test

# Run Vitest in watch mode (during active development)
npx vitest

# Check ESLint rules
npm run lint

# Test production build & TypeScript types
npm run build
```

### Writing New Tests
When adding new server actions or utilities, create a corresponding `*.test.ts` file in the same directory (e.g., `src/app/actions/newFeatureActions.test.ts`).

---

## 💡 Quick Start Summary for Incoming AI Agent
1. Inspect `prisma/schema.prisma` to understand the database models.
2. Check `src/lib/db.ts` and `src/app/actions/adminActions.ts` for server data flow.
3. Check `AI_AGENT_HANDOFF.md` and `LOCAL_SETUP_GUIDE.md` for project context.
4. Run `npm test` before and after making changes to verify green build.

**Happy Coding! 🚀**
