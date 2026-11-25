# Odisha Aspirants (odishaaspirants.com) - Full-Stack Node.js Platform

A modern, high-performance, pixel-accurate government recruitment alerts portal built with **Node.js**, **Express**, **EJS**, **SQLite / Cloudflare D1 Database**, and **Cloudflare R2 Object Storage**.

Designed with strict attention to recruitment exam information architecture, dense categorization, high-contrast readability, **100% fluid mobile responsiveness**, **sticky header navigation**, **candidate utility tools**, and a **4-tier role-based access management system**.

---

## 🌟 Key Features

### 1. Authentic Government Recruitment Portal UI
- **Official Header**: Crimson/Maroon `#ab183d` banner with custom SVG logo emblem and subtitle `WWW.ODISHAASPIRANTS.COM`.
- **Sticky Header & Menu**: Fixed header navigation with smooth scrolling, dropdown menus, and zero content jumping.
- **Marquee Tickers**: Scrolling alert tickers with alternate bounce direction for urgent exam updates.
- **Iconic Color Badges**: 2x4 responsive highlight grid for high-priority exams (SSC, UPSC, UP Police, Railway RRB, Banking, etc.).
- **3-Column Live Grid**: Result, Admit Card, and Latest Jobs with classic bordered layout and high readability.
- **Secondary Sections**: Answer Key, Syllabus, Admission, Certificate Verification, and Important.
- **Live Debounced Search**: Real-time auto-complete search with zero layout shifting.
- **Full Job Detail Page**:
  - Two-column grid for **Important Dates** & **Application Fee**
  - **Age Limit** specifications
  - **Vacancy Details** table with eligibility criteria
  - **Category-wise Vacancy Distribution** table
  - **How to Apply** step-by-step instructions
  - **Useful Important Links** table with bold **Click Here** action buttons
  - Official Telegram & WhatsApp channel join buttons

### 2. Candidate Utility Tools
- **Government Exam Age Calculator** (`/tools/age-calculator`): Accurate age computation in Years, Months, Days, and Total Days based on exam cutoff date.
- **Interactive Photo Resizer & Name Maker** (`/tools/image-resizer`): Client-side Canvas utility allowing candidates to resize passport photos, signatures, compress file size under 50KB/20KB, and stamp candidate name + Date of Photo (DOP).
- **Photo & Signature Resizer Guide** (`/tools/photo-resizer`): Detailed guidelines and specifications for SSC, UPSC, State PSCs, Police, and Banking recruitment exams.

### 3. 4-Tier Role Architecture
1. **Public User / Candidate**: Public website access to jobs, results, notifications, and calculators. Zero backend/internal access.
2. **Super Admin** (`/admin`): Master control over site settings, ads code injection, marquee notices, banners, SEO meta, and author account management.
3. **Senior Editor Lead** (`/editor-portal`): Platform-wide review desk. Has authority to review, edit, approve, and publish notifications submitted by all authors/contributors.
4. **Author / Contributor** (`/author-portal`): Dedicated content creator workspace. Strictly scoped to drafting and editing their own articles only (`403 Access Denied` on other authors' posts).

### 4. SEO & AdSense Ready
- **Dynamic XML Sitemap** (`/sitemap.xml`): Auto-generated sitemap listing all active exam posts, categories, and utilities.
- **Dynamic RSS Feed** (`/feed`): RSS 2.0 syndication feed for Google News and search crawlers.
- **Auto-Updating Copyright Year**: Footer year dynamically synchronizes with current calendar year (`new Date().getFullYear()`) automatically without manual updates.
- **AdSense Friendly Clean Schema**: Clean Schema.org `NewsArticle` / `JobPosting` / `Organization` JSON-LD markup.

### 5. Cloudflare D1 & R2 Storage Ready
- **Universal D1 Client** (`src/db/d1Client.js`): Uses local SQLite (`sql.js`) in development/VPS mode, and seamlessly connects to Cloudflare D1 via REST API in serverless mode.
- **Universal R2 Client** (`src/storage/r2Client.js`): Uses AWS S3 SDK for Cloudflare R2 object storage with fallback to `/uploads`.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default credentials:
- **Port**: `3000`
- **Super Admin**: `admin` / `odishaaspirants@2026` (`/admin/login`)
- **Senior Editor**: `editor@odishaaspirants.com` / `editor@2026` (`/editor-portal/login`)
- **Author**: `amit.sharma@odishaaspirants.com` / `author@2026` (`/author-portal/login`)

### 3. Start the Server
```bash
npm start
```
The server will start at:
- **Public Website**: `http://localhost:3000`
- **Super Admin Desk**: `http://localhost:3000/admin`
- **Editor Desk**: `http://localhost:3000/editor-portal`
- **Author Desk**: `http://localhost:3000/author-portal`

---

## 📱 Mobile Responsiveness
- Collapsible fluid layout: Desktop 3-column grid → Tablet 2-column → Smartphone 1-column layout.
- Horizontal scroll wrappers (`.table-responsive`) with touch momentum for large recruitment tables.
- Fixed header with slide-down mobile hamburger menu.

---

## 📂 Project Structure
```
├── server.js              # Express server entry point
├── package.json           # Dependencies and scripts
├── schema.sql             # SQL database schema
├── wrangler.toml          # Cloudflare deployment config
├── data/                  # SQLite database storage (sarkariresult.db)
├── uploads/               # Uploaded files and attachments fallback
├── src/
│   ├── config/env.js      # Environment configuration loader
│   ├── db/
│   │   ├── d1Client.js    # D1 SQLite database engine
│   │   └── seed.js        # Seed initial realistic exam notifications
│   ├── storage/r2Client.js# Cloudflare R2 object storage client
│   ├── routes/
│   │   ├── webRoutes.js   # Public routes (Home, Posts, Tools, Sitemap)
│   │   ├── adminRoutes.js # Super Admin routes
│   │   ├── authorRoutes.js# Senior Editor & Author routes
│   │   └── apiRoutes.js   # Instant Search & Status APIs
│   ├── middleware/
│   │   ├── auth.js        # Super Admin session middleware
│   │   └── authorAuth.js  # Editor & Author role authentication middleware
│   └── utils/helpers.js   # Utility helpers
├── views/
│   ├── partials/          # Header, Subheader, Footer, Author Nav, Admin Nav
│   ├── pages/             # Home, Detail, Category, Search, Age Calc, Resizer
│   ├── admin/             # Admin Dashboard, Posts, Badges, Marquees, Authors
│   └── author/            # Author/Editor Dashboard, Post Form, Posts List, Profile
└── public/
    ├── css/               # Responsive styles & Admin/Author Portal styles
    ├── js/                # Main interactive JS, Search debouncer, Image resizer
    └── images/            # Logo SVGs, Icons, and default assets
```
