# 🚀 Complete Zero-to-Hero Local Machine Setup Guide
## MIMOS Academy Portal

This is a **complete, beginner-friendly, step-by-step guide** for setting up and running the **MIMOS Academy Portal** from scratch (from zero). Even if you have never installed Node.js or PostgreSQL before, following these exact steps will get the project running on your local machine.

---

## 📑 Table of Contents
1. [Phase 1: Installing Required Software](#phase-1-installing-required-software-the-absolute-beginning)
2. [Phase 2: Cloning the Repository](#phase-2-cloning-the-repository)
3. [Phase 3: Installing Project Dependencies](#phase-3-installing-project-dependencies)
4. [Phase 4: Setting Up PostgreSQL Database](#phase-4-setting-up-postgresql-database)
5. [Phase 5: Configuring Environment Variables (`.env`)](#phase-5-configuring-environment-variables-env)
6. [Phase 6: Database Migration & Data Seeding](#phase-6-database-migration--data-seeding)
7. [Phase 7: Launching the Application](#phase-7-launching-the-application)
8. [Phase 8: Testing & Verification](#phase-8-testing--verification)
9. [Phase 9: Troubleshooting & Solutions](#phase-9-troubleshooting--solutions)

---

## Phase 1: Installing Required Software (The Absolute Beginning)

Before you can run the application, you need 3 main software tools installed on your computer: **Git**, **Node.js**, and **PostgreSQL**.

### 1.1 Install Git
Git allows you to clone the project repository from GitHub.

* **Download**: [https://git-scm.com/downloads](https://git-scm.com/downloads)
* **Installation**: Download the installer for your OS (Windows / macOS / Linux) and follow the wizard (keep default settings).
* **Verify Installation**: Open your Command Prompt (Windows) or Terminal (macOS/Linux) and run:
  ```bash
  git --version
  ```
  *(You should see something like `git version 2.4x.x`)*

---

### 1.2 Install Node.js & npm
Node.js is the runtime engine that powers Next.js, React, and server execution. `npm` is included automatically with Node.js.

* **Download**: [https://nodejs.org/](https://nodejs.org/) (Select **v20 LTS** or **v22 LTS**)
* **Installation**: Run the installer and keep all default options checked (including "Add to PATH").
* **Verify Installation**: Open a new terminal window and run:
  ```bash
  node -v
  npm -v
  ```
  *(Expected output: `v20.x.x` or higher for Node, and `v10.x.x` or higher for npm)*

---

### 1.3 Install PostgreSQL (Database Engine)
PostgreSQL is the relational database used to store course programs, user accounts, news announcements, and facilities.

#### 💡 Option A: Standard Desktop Installer (Recommended for Beginners)
1. **Download**: Go to [PostgreSQL Official Downloads](https://www.postgresql.org/download/) and select your OS.
2. **Run Installer**:
   - Keep default components selected (**PostgreSQL Server**, **pgAdmin 4**, **Command Line Tools**).
   - Set a master password for the default `postgres` user (e.g., `postgres` or `admin123`). **IMPORTANT: Remember this password!**
   - Keep default Port as `5432`.
   - Complete setup.

#### 💡 Option B: Docker (For Developers using Docker)
If you already have Docker Desktop installed, you can launch PostgreSQL instantly with one command:
```bash
docker run --name mimos-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=mimos_db -p 5432:5432 -d postgres
```

---

## Phase 2: Cloning the Repository

Now that your tools are installed, copy the code to your local machine.

1. Open **Command Prompt** (Windows), **PowerShell**, or **Terminal** (macOS/Linux).
2. Navigate to the folder where you want to store your project (e.g., `Documents` or `Projects`):
   ```bash
   cd Documents
   ```
3. Clone the repository from GitHub:
   ```bash
   git clone https://github.com/your-username/MIMOS.git
   ```
4. Move into the project directory:
   ```bash
   cd MIMOS
   ```

---

## Phase 3: Installing Project Dependencies

Run the package manager command to download all required frameworks and libraries (Next.js 16, React 19, Prisma 7, Tailwind CSS, Vitest, etc.):

```bash
npm install
```

> ⏳ **What this does**: Reads `package.json` and creates a `node_modules` folder containing all project dependencies. Wait until the progress bar completes.

---

## Phase 4: Setting Up PostgreSQL Database

Before running the application, you must create an empty database named `mimos_db` inside PostgreSQL.

Choose **ONE** of the following methods to create the database:

### Method 4.1: Using pgAdmin 4 (Visual UI - Easiest)
1. Open **pgAdmin 4** from your computer's Start Menu / Applications.
2. Enter your master PostgreSQL password when prompted to connect to `Servers` -> `PostgreSQL`.
3. Right-click on **Databases** -> Click **Create** -> **Database...**
4. Set **Database Name**: `mimos_db`
5. Click **Save**.

---

### Method 4.2: Using SQL Command Line (`psql`)
1. Open terminal and run:
   - **Windows**:
     ```cmd
     psql -U postgres
     ```
   - **macOS / Linux**:
     ```bash
     sudo -u postgres psql
     ```
2. Type your postgres password when prompted.
3. In the SQL prompt (`postgres=#`), enter:
   ```sql
   CREATE DATABASE mimos_db;
   ```
4. Exit `psql`:
   ```sql
   \q
   ```

---

## Phase 5: Configuring Environment Variables (`.env`)

Environment variables store secret credentials (database connection string, admin password, secret keys) locally without hardcoding them in git.

### Step 5.1: Create the `.env` file
Copy the template `.env.example` file to create your local `.env` file:

* **Windows (Command Prompt or PowerShell)**:
  ```powershell
  copy .env.example .env
  ```
* **macOS / Linux / Git Bash**:
  ```bash
  cp .env.example .env
  ```

### 🔑 Is the content of `.env` important?
**YES!** Next.js and Prisma require the `.env` file to know how to connect to PostgreSQL and authenticate users. Without it, the app will crash on startup.

Here is what **MUST be changed** vs. what can be **left as default**:

| Variable | Must Change? | Why & What to put? |
| :--- | :---: | :--- |
| `DATABASE_URL` | **🔴 YES (CRITICAL)** | Must match **their local PostgreSQL password & database name**. E.g., `postgresql://postgres:YOUR_PASSWORD@localhost:5432/mimos_db?schema=public`. If the password in this line is wrong, Prisma cannot connect. |
| `ADMIN_EMAIL` | 🟢 Optional | Default (`admin@mimos.my`) works fine for local dev login. |
| `ADMIN_PASSWORD` | 🟢 Optional | Default (`mimos2026_secure_password_change_me`) works fine for local dev login. |
| `ADMIN_SESSION_SECRET` | 🟢 Optional | Default string works for local testing. |
| `CLOUDFLARE_R2_*` | ⚪ Optional | Dummy values work fine unless testing real image uploads to Cloudflare R2 cloud storage. |
| `RESEND_API_KEY` | ⚪ Optional | Dummy values work fine unless testing real contact form emails. |

---

### Step 5.2: Edit `.env` Values
Open the newly created `.env` file in VS Code or Notepad. Configure the fields as follows:

```env
# =============================================================
# 1. DATABASE CONNECTION URL
# Format: postgresql://<USER>:<PASSWORD>@localhost:5432/<DATABASE_NAME>?schema=public
# =============================================================
# Example (if your postgres password is "postgres"):
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mimos_db?schema=public"

# Example (if your postgres password is "admin123"):
# DATABASE_URL="postgresql://postgres:admin123@localhost:5432/mimos_db?schema=public"

# =============================================================
# 2. ADMIN DASHBOARD AUTHENTICATION
# =============================================================
# Email and Password used to log into http://localhost:3000/admin/login
ADMIN_EMAIL="admin@mimos.my"
ADMIN_PASSWORD="mimos2026_secure_password_change_me"

# Secret string used to encrypt admin session cookies (Can be any random 64-char string)
ADMIN_SESSION_SECRET="e9a8f7c6b5a43210fe9876543210abcdef1234567890abcdef1234567890abcd"

# =============================================================
# 3. OPTIONAL SERVICES (Can leave defaults for local UI dev)
# =============================================================
CLOUDFLARE_R2_ACCOUNT_ID="your_cloudflare_r2_account_id"
CLOUDFLARE_R2_ACCESS_KEY_ID="your_cloudflare_r2_access_key_id"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your_cloudflare_r2_secret_access_key"
CLOUDFLARE_R2_BUCKET_NAME="mimos-website"
CLOUDFLARE_R2_PUBLIC_URL="https://pub-yourbucketpublicurl.r2.dev"

RESEND_API_KEY="re_your_api_key_here"
CONTACT_FORM_TO_EMAIL="academy@mimos.my"
RESEND_FROM_EMAIL="Website Inquiry Notification <noreply@mimos-academy.my>"
```

---

## Phase 6: Database Migration & Data Seeding

Now you will create the database tables and populate them with sample data (courses, announcements, facilities, admin account).

Run these three commands step-by-step in your terminal inside the `MIMOS` directory:

### 6.1 Generate Prisma Client
Generates TypeScript types based on `prisma/schema.prisma`:
```bash
npx prisma generate
```

### 6.2 Run Database Migrations
Applies schema migrations to create tables (`User`, `Program`, `Category`, `Facility`, `News`, `AuditLog`, etc.) inside `mimos_db`:
```bash
npx prisma migrate dev
```
*(If prompted for a migration name, press Enter or type `init`)*

### 6.3 Seed Database with Initial Data
Populates the database with initial course programs, categories, facility images, news announcements, and admin user credentials:
```bash
npx prisma db seed
```

> ✅ **Success check**: You should see output in terminal saying:
> `Seeding completed successfully!`

---

## Phase 7: Launching the Application

Start the Next.js local development server:

```bash
npm run dev
```

You will see terminal output indicating:
```text
  ▲ Next.js 16.x.x
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000
```

### 7.1 View Public Website
Open your browser and navigate to:
👉 **`http://localhost:3000`**

Explore the homepage, course catalog, facilities showcase, news updates, and contact form.

### 7.2 Access Admin Dashboard
Navigate to:
👉 **`http://localhost:3000/admin/login`**

Enter the default credentials specified in your `.env` file:
* **Email**: `admin@mimos.my`
* **Password**: `mimos2026_secure_password_change_me`

*(You can now create, edit, and delete courses, upload facility images, and manage news posts!)*

---

## Phase 8: Testing & Verification

To verify that all code compilation, type checking, and unit tests pass cleanly on your machine:

```bash
# 1. Run unit test suite (Vitest)
npm test

# 2. Run ESLint code checks
npm run lint

# 3. Test production build & TypeScript compilation
npm run build
```

---

## Phase 9: Troubleshooting & Solutions

| Error Message / Problem | Cause | How to Fix |
| :--- | :--- | :--- |
| **`'node' or 'npm' is not recognized as an internal command`** | Node.js was installed without adding to system PATH or terminal wasn't restarted. | Close your Command Prompt / Terminal completely, re-open it, and try again. If it still fails, reinstall Node.js with "Add to PATH" checked. |
| **`PrismaClientInitializationError: Can't reach database server at localhost:5432 (P1001)`** | PostgreSQL service is stopped, or port `5432` is blocked, or username/password in `.env` is incorrect. | 1. Ensure PostgreSQL service is running in Windows Services / macOS System Control.<br>2. Check your `.env` file `DATABASE_URL` password. |
| **`PrismaClientKnownRequestError: Database 'mimos_db' does not exist (P1003)`** | You haven't created the `mimos_db` database in PostgreSQL yet. | Follow **Phase 4** to create the `mimos_db` database using pgAdmin or `psql`, then re-run `npx prisma migrate dev`. |
| **`Port 3000 is already in use`** | Another application (or background Node process) is using port 3000. | Run dev server on port 3001 instead:<br>`npm run dev -- -p 3001`<br>Then open `http://localhost:3001`. |
| **`Invalid credentials` when logging into Admin Dashboard** | Database wasn't seeded or credentials in `.env` differ. | Run `npx prisma db seed` to insert default admin user, then log in using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`. |
| **`Prisma Client has not been generated yet`** | Prisma bindings are missing in `node_modules`. | Run `npx prisma generate` then `npm run dev`. |

---

## 🎯 Quick Cheat Sheet (All-in-One Command Sequence)

If someone just wants to copy-paste the whole setup pipeline in one go:

```bash
# 1. Clone & enter folder
git clone https://github.com/your-username/MIMOS.git
cd MIMOS

# 2. Install dependencies
npm install

# 3. Create .env file
copy .env.example .env

# (EDIT .env file with your PostgreSQL password)

# 4. Generate Prisma & Migrate DB & Seed
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# 5. Start App!
npm run dev
```

🎉 **Congratulations! The MIMOS Academy Portal is now running locally on your machine.**
