# 🎬 CineTube — Movie & Series Rating Portal (Frontend)

> A full-stack Movie and Series Rating & Streaming Portal built as a university course assignment (Batch-6, Assignment-5). Users can browse, rate, and review movies/series; admins manage the entire media library, moderate content, and view analytics.

---

## 🌐 Live URLs

| Service    | URL                                                          |
| ---------- | ------------------------------------------------------------ |
| Frontend   | https://cinetube-frontend-vert.vercel.app/                   |
| Backend    | https://cinetube-backend-wine.vercel.app/                    |

---

## 📦 GitHub Repositories

| Repository        | Link                                                    |
| ----------------- | ------------------------------------------------------- |
| Frontend (Next.js)| https://github.com/shuvo2011/cinetube-frontend          |
| Backend (Express) | https://github.com/shuvo2011/cinetube-backend           |

---

## 🔐 Test Credentials

| Role  | Email                        | Password    |
| ----- | ---------------------------- | ----------- |
| Admin | shuvombstu2013@gmail.com     | Pa$$w0rd!   |
| User  | samiha.tasnim@example.com    | Pa$$w0rd!   |

---

## ✨ Features

### 👤 User Features
- Register & login with email/password (JWT-based auth)
- Browse movies & series by genre, platform, release year, or rating
- Rate titles (1–10 stars) and write reviews with spoiler warnings & tags
- Like/unlike reviews and comment on them
- Add titles to personal watchlist
- Edit/delete own unpublished reviews
- Monthly subscription via payment gateway
- View payment/purchase history

### 🛡️ Admin Features
- Manage full media library (CRUD: movies, genres, platforms, cast members, tags)
- Approve or unpublish user reviews & comments
- View aggregated ratings and platform analytics
- Manage all users
- View revenue & sales dashboard

### 🔍 Search & Filter
- Search by title, genre, director, cast, or streaming platform
- Filter by release year, rating range, popularity
- Sort by highest-rated, most-reviewed, or latest releases

---

## 🛠️ Tech Stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Framework      | Next.js 16 (App Router, Server Actions)         |
| Styling        | Tailwind CSS v4                                 |
| UI Components  | shadcn/ui + Radix UI                            |
| Data Tables    | TanStack Table v8                               |
| Server State   | TanStack Query v5                               |
| Forms          | TanStack Form v1 + Zod v4                       |
| HTTP Client    | Axios (custom `httpClient` wrapper)             |
| Auth           | Cookie-based JWT (native `atob`, no extra lib)  |
| Image Upload   | Cloudinary                                      |
| Charts         | Recharts                                        |
| Notifications  | Sonner                                          |
| Language       | TypeScript                                      |
| Package Manager| Bun                                             |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Auth pages: login, register, forgot-password, reset-password, verify-email
│   ├── (dashboard)/
│   │   ├── admin/           # Admin panel: cast-members, comments, genres, movies, payments, platforms, reviews, tags, users, watchlists
│   │   ├── dashboard/       # User dashboard: my-payments, profile, reviews, watchlist
│   │   └── layout.tsx       # Shared dashboard layout (role-based sidebar)
│   ├── (main)/              # Public pages: home, movies, about, contact, how-it-works, payment, privacy, support, terms
│   └── api/                 # Next.js API routes (e.g., profile update)
├── components/
│   ├── dashboard/           # Dashboard-specific components
│   ├── modules/             # Feature modules (AdminComments, AdminMovies, AdminReviews, CastMembers, Genres, Home, MovieDetails, Platforms, Tags, etc.)
│   ├── shared/              # Reusable: DataTable, Navbar, Footer, AppField, Logo, cell components
│   └── ui/                  # shadcn/ui components
├── constants/               # App-wide constants (home.constants.ts)
├── hooks/                   # Custom hooks: useRowActionModalState, useServerManagedDataTable, useServerManagedDataTableSearch, useServerManagedDataTableFilters
├── lib/
│   ├── axios/               # httpClient axios wrapper
│   ├── authUtils.ts         # Auth helper functions
│   ├── cookieUtils.ts       # Cookie read/write helpers
│   ├── dashboardNavItems.ts # Role-based sidebar nav config
│   ├── jwtUtils.ts          # JWT decode via atob
│   ├── tokenUtils.ts        # Token management
│   └── uploadImageToCloudinary.ts
├── providers/
│   └── QueryProvider.tsx    # TanStack Query provider
├── services/                # API service files (auth, movie, review, genre, platform, cast, tag, comment, payment, watchlist, user, stats)
├── types/                   # TypeScript types per domain
├── utils/
│   └── cookie.constants.ts
└── zod/                     # Zod validation schemas per domain
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```dotenv
NEXT_PUBLIC_API_BASE_URL=your_api_base_url_here
NEXT_PUBLIC_BACKEND_URL=your_backend_url_here
ACCESS_TOKEN_SECRET=your_access_token_secret_here

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset_here
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- [Bun](https://bun.sh/) installed
- Backend server running (see backend repo)
- PostgreSQL database configured

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/shuvo2011/cinetube-frontend.git
cd cinetube-frontend

# 2. Install dependencies
bun install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in the values in .env.local

# 4. Start the development server
bun dev
```

The app will be available at `http://localhost:3000`.

---

## 📜 Key Pages

| Route                         | Description                              |
| ----------------------------- | ---------------------------------------- |
| `/`                           | Home — hero, top rated, new releases, pricing |
| `/movies`                     | All movies/series with search & filters  |
| `/movies/[id]`                | Movie/series detail page + reviews       |
| `/login` / `/register`        | Authentication pages                     |
| `/forgot-password`            | Password reset flow                      |
| `/dashboard`                  | User dashboard (reviews, watchlist, payments, profile) |
| `/admin/dashboard`            | Admin overview & analytics               |
| `/admin/movies`               | Admin movie management                   |
| `/admin/reviews`              | Admin review moderation                  |
| `/admin/users`                | Admin user management                    |
| `/about` / `/contact`         | Static info pages                        |
| `/payment/success`            | Post-payment confirmation page           |

---

## 🧪 Scripts

```bash
bun dev      # Start development server
bun build    # Production build
bun start    # Start production server
bun lint     # Run ESLint
```

---

## 🗂️ Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add watchlist functionality
fix: resolve login token expiry issue
style: improve homepage hero section
chore: update dependencies
refactor: extract httpClient to separate module
```

---

## 📋 Assignment Info

- **Assignment:** 5 — Batch 6
- **Project Type:** Movie & Series Rating & Streaming Portal

---

## 📄 License

This project is submitted as a university course assignment. All rights reserved.