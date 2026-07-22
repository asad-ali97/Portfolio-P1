# Asad Ali — Portfolio + Contact System + Admin Dashboard

A personal portfolio with a working Contact Us backend (Supabase + Prisma + Resend) and a protected admin dashboard (Supabase Auth + reCAPTCHA v3 + IP rate limiting).

Built for the **Dafi Labs × EmpRadar.ai MERN Stack Internship — Week 1 Practical Task**.

**Live demo:** deployed on [Vercel](https://vercel.com) · Project plan: [`PROJECT_PLAN.md`](./PROJECT_PLAN.md) · Design reference: [`docs/design-reference.png`](./docs/design-reference.png)

## Features

- Responsive single-page portfolio (Hero, About, Skills, Projects, Experience, Education, Contact, Footer)
- **Light / dark mode** with OS preference detection and persisted choice
- Contact form with client + server validation, Supabase persistence, and Resend email alerts
- Admin login with Google reCAPTCHA v3 and IP-based rate limiting (blocks after 5 failed attempts)
- Protected dashboard (stats + recent contacts) and queries page with status updates
- Smooth scroll (Lenis), Framer Motion reveals, and a lazy-loaded React Three Fiber hero scene

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 · Vite · Tailwind CSS v4 · React Router · Framer Motion · React Three Fiber · Lenis |
| Backend | Vercel Serverless Functions (`/api`) · Prisma · Supabase (Postgres + Auth) · Resend · reCAPTCHA v3 |

## Project structure

```
src/
  PortfolioSite.jsx          Public single-page portfolio
  App.jsx                    Router: "/" → portfolio, "/admin/*" → admin app
  components/sections/       Hero, About, Skills, Projects, Experience, Education, Contact
  components/layout/         Navbar (with theme toggle), Footer, Layout
  components/ui/             Button, Card, FormField, ThemeToggle, …
  components/admin/          AdminLayout, ProtectedRoute, StatCard, StatusBadge, ContactsTable
  components/three/          HeroScene (lazy-loaded 3D)
  pages/admin/               Login, Dashboard, Queries
  lib/                       ThemeContext, AdminAuthContext, LenisContext, api.js
  hooks/                     useContactForm, useRecaptcha, useActiveSection, useTypewriter
  data/                      projects, skills, experience, education, social, navigation
  styles/                    tokens.css (light + dark), index.css
api/
  contact.js                 POST — validate, save via Prisma, send Resend alert
  auth/login.js              POST — reCAPTCHA + rate limit + Supabase Auth sign-in
  admin/me.js                GET  — verify session
  admin/stats.js             GET  — dashboard stats
  admin/contacts.js          GET list / PATCH status
  _lib/                      prisma, supabaseAdmin, verifyAdmin, recaptcha, getClientIp
prisma/schema.prisma         Profile, Contact, LoginAttempt models
scripts/seed-admin.ts        Seeds the one admin account (run locally)
```

## Setup

### 1. Install dependencies

```bash
npm install
```

`postinstall` runs `prisma generate` automatically.

> **Prisma is pinned to `6.19.3`** (not 7.x). Prisma 7 changed connection config significantly; stay on 6.x unless you intentionally migrate.

### 2. Create accounts & collect credentials

| Service | Sign up | What you need |
|---|---|---|
| [Supabase](https://supabase.com) | New Project | Project URL, anon key, service_role key, DB connection strings |
| [Resend](https://resend.com) | API Keys | API key |
| [Google reCAPTCHA v3](https://www.google.com/recaptcha/admin/create) | Create (v3) | Site key + Secret key |

### 3. Configure environment

```bash
cp .env.example .env
```

Fill in every variable — each field in `.env.example` has a comment pointing to where the value lives in that service’s dashboard.

### 4. Create database tables

```bash
npx prisma migrate dev --name init
```

Creates `contacts`, `profiles`, and `login_attempts` from `prisma/schema.prisma`.

### 5. Seed the Admin account

In `.env`:

```
ADMIN_SEED_EMAIL=you@example.com
ADMIN_SEED_PASSWORD=choose-a-real-password-8-chars-plus
```

Then:

```bash
npm run seed:admin
```

Creates the Supabase Auth user **and** the linked `profiles` row with `role=admin`. Safe to re-run.

### 6. Run locally

Frontend only:

```bash
npm run dev
```

Full stack (frontend + `/api` functions) — needs the [Vercel CLI](https://vercel.com/docs/cli):

```bash
npm install -g vercel
vercel dev
```

`vercel dev` reads `.env` and serves both Vite and serverless functions on one port.

If contact submissions save but no email arrives, confirm these server-only vars:

```env
RESEND_API_KEY=your_resend_api_key
CONTACT_ALERT_EMAIL=your_inbox_email@example.com
RESEND_FROM_EMAIL="Portfolio Contact <onboarding@resend.dev>"
```

### 7. Deploy on Vercel

1. Push to GitHub; add collaborator **`empradar`** (Settings → Collaborators).
2. Import the repo on [vercel.com/new](https://vercel.com/new).
3. Add **every** variable from `.env.example` under Project Settings → Environment Variables (Production + Preview).
4. Deploy. Vercel picks up the Vite app and `/api` functions automatically.
5. Use a `production` branch for the final submission deploy if required.
6. Smoke-test the live URL: portfolio → Contact form → Supabase row + email → `/admin/login` → dashboard + queries status update → 6 failed logins (rate limit) → logout.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite frontend only |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run seed:admin` | Seed the admin user |
| `npm run prisma:migrate` | Prisma migrate (dev) |
| `npm run prisma:studio` | Prisma Studio |

## Featured project — CharmChime

Family engagement platform (parent + child experiences, journals, achievements, calendars, story mode).

- **GitHub:** [CharmChime/.github](https://github.com/CharmChime/.github)
- **Live:** [charmchime.vercel.app](https://charmchime.vercel.app/)

## License

Private internship submission — all rights reserved unless otherwise noted.
