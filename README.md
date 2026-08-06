# MIMOS Academy Portal

A modern web application and Content Management System (CMS) for **MIMOS Academy**, powering public course catalogs, upcoming events, facility showcases, news announcements, and an administration dashboard.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
* **Library**: [React 19](https://react.dev/)
* **Database & ORM**: PostgreSQL with [Prisma ORM 7](https://www.prisma.io/)
* **Object Storage**: Cloudflare R2 (S3-Compatible API via `@aws-sdk/client-s3`)
* **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & Lucide Icons
* **Testing**: [Vitest](https://vitest.dev/)
* **Authentication**: Cookie-based HMAC-SHA256 Signed Admin Session Auth
* **Email Service**: Nodemailer (Gmail SMTP integration)

---

## 🚀 Getting Started

> 📖 **Cloning this repo for local machine setup?** Follow our step-by-step [Local Setup Guide](LOCAL_SETUP_GUIDE.md)!  
> 🤖 **AI Coding Agent handoff & context?** Read our comprehensive [AI Agent Handoff & Architecture Context](AI_AGENT_HANDOFF.md)!

### 1. Prerequisites

Ensure you have the following installed on your local development machine:

* **Node.js**: `v24.x` or higher
* **npm**: `v10.x` or higher
* **PostgreSQL**: PostgreSQL 14+ local instance or database container

---

### 2. Environment Setup

Copy the sample environment file to create your local `.env` configuration:

```bash
cp .env.example .env
```

Open `.env` and configure your credentials:

```env
# Database Connection URL
DATABASE_URL="postgresql://postgres:password@localhost:5432/mimos_db?schema=public"

# Admin Authentication
ADMIN_EMAIL="admin@mimos.my"
ADMIN_PASSWORD="your_secure_dev_password"
ADMIN_SESSION_SECRET="64_character_hex_string_for_cookie_signing"

# Cloudflare R2 Storage (Optional for local UI testing)
CLOUDFLARE_R2_ACCOUNT_ID="your_r2_account_id"
CLOUDFLARE_R2_ACCESS_KEY_ID="your_r2_access_key"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your_r2_secret_key"
CLOUDFLARE_R2_BUCKET_NAME="mimos-website"
CLOUDFLARE_R2_PUBLIC_URL="https://pub-yourbucket.r2.dev"

# SMTP Contact Form Setup
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-char-app-password"
CONTACT_FORM_TO_EMAIL="academy@mimos.my"
```

---

### 3. Database Initialization & Seeding

Run Prisma migrations and seed initial data:

```bash
# Generate Prisma Client
npx prisma generate

# Apply Database Migrations
npx prisma migrate dev

# Seed Database with Initial Data
npx tsx prisma/seed.ts
```

---

### 4. Running Development Server

Start the Next.js local development server:

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.  
To access the Admin Dashboard, navigate to `http://localhost:3000/admin/login`.

---

## 🧪 Testing & Code Quality

Run the test suite, linter, and type checks before committing code:

```bash
# Run Vitest Unit Tests
npm test

# Run ESLint Code Analysis
npm run lint

# Build Production Bundle (Includes TypeScript Typecheck)
npm run build
```

---

## 📁 Project Architecture

```
MIMOS/
├── prisma/               # Database Schema, Migrations, and Seeds
├── public/               # Static assets & brand logos
├── src/
│   ├── app/
│   │   ├── (public)/     # Public marketing & course pages
│   │   ├── admin/        # Secured Admin Dashboard & Login
│   │   ├── actions/      # Next.js Server Actions (CMS & DB operations)
│   │   └── api/          # REST Endpoints (Contact form, uploads)
│   ├── components/       # Reusable React UI Components
│   └── lib/              # Database, R2 Client, Auth & Utility Helpers
├── .github/
│   └── workflows/        # GitHub Actions CI/CD workflows
└── package.json
```

---

## 🛡️ Security & Environment Guidelines

* **Never commit `.env` or secrets** to Git history. `.env` is ignored by default in `.gitignore`.
* Keep `.env.example` updated whenever new environment variables are added.
* All Pull Requests must pass automated CI checks (`npm test`, `npm run lint`, `npm run build`) before being merged into `main`.
