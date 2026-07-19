# Asad Ali — Portfolio + Contact System + Admin Dashboard

A single-page portfolio with a full Contact Us backend (Supabase +
Prisma + Resend) and a protected admin dashboard (Supabase Auth +
reCAPTCHA v3 + IP rate limiting) — built for the *Dafi Labs x
EmpRadar.ai MERN Stack Internship, Week 1 Practical Task*.

See `PROJECT_PLAN.md` for the Task 1 project plan and
`docs/design-reference.png` for the layout reference.

## Stack

**Frontend:** React 19 (Vite, Rolldown) · Tailwind CSS v4 · React
Router (portfolio is single-page; router is scoped to `/admin/*`) ·
Framer Motion · GSAP · React Three Fiber + Drei · Lenis

**Backend:** Vercel Serverless Functions (Node.js, in `/api`) · Prisma
· Supabase (Postgres + Auth) · Resend (email) · Google reCAPTCHA v3

## Project structure

```
src/
  PortfolioSite.jsx       the public single-page site (unchanged from
                           the earlier phase of this project)
  App.jsx                  router: "/" → PortfolioSite, "/admin/*" → admin app
  components/admin/        AdminLayout, ProtectedRoute, StatCard,
                            StatusBadge, ContactsTable
  pages/admin/              Login, Dashboard, Queries
  lib/AdminAuthContext.jsx  admin session state (login/logout/verify)
  lib/adminSession.js        localStorage session persistence
  lib/api.js                  fetch wrapper for /api/* (attaches Bearer token)
  hooks/useContactForm.js      now posts to /api/contact (was EmailJS)
  hooks/useRecaptcha.js         loads reCAPTCHA v3 on demand (login page only)
api/
  contact.js                POST — validates, saves via Prisma, sends Resend alert
  auth/login.js              POST — recaptcha + rate limit + Supabase Auth sign-in
  admin/me.js                 GET — verify session, return profile
  admin/stats.js                GET — dashboard stats
  admin/contacts.js              GET list / PATCH status update
  _lib/                        prisma.js, supabaseAdmin.js, verifyAdmin.js,
                                recaptcha.js, getClientIp.js
prisma/schema.prisma        Profile, Contact, LoginAttempt models
scripts/seed-admin.ts       creates the one admin account (run locally)
```

## Setup — from zero to running

### 1. Install dependencies

```bash
npm install
```

(`postinstall` runs `prisma generate` automatically. This needs
network access to Prisma's engine binaries — it will fail in fully
offline/sandboxed environments, but works normally on a real machine
or on Vercel's build servers.)

> **Prisma is pinned to `6.19.3`, not the newer `7.x`.** Prisma 7
> (current `npm install prisma@latest`) moved all connection config
> out of `schema.prisma` into a new `prisma.config.ts` + driver-adapter
> pattern, is very new, and is still rough around the edges. This
> project intentionally stays on the stable, well-documented 6.x line
> — don't `npm update` Prisma without re-checking this.

### 2. Create your accounts and collect credentials

| Service | Where to sign up | What you need |
|---|---|---|
| Supabase | https://supabase.com → New Project | Project URL, anon key, service_role key, DB connection strings |
| Resend | https://resend.com → API Keys | API key |
| Google reCAPTCHA v3 | https://www.google.com/recaptcha/admin/create (choose **v3**) | Site key + Secret key |

### 3. Fill in `.env`

```bash
cp .env.example .env
```

Open `.env` and paste in every value — **each field has a comment
telling you exactly where in that service's dashboard to find it.**
Nothing in this codebase has real credentials baked in; every
integration reads from these variables.

### 4. Create the database tables

```bash
npx prisma migrate dev --name init
```

This connects to your Supabase Postgres (via `DIRECT_URL`) and
creates the `contacts`, `profiles`, and `login_attempts` tables from
`prisma/schema.prisma`.

### 5. Seed the one Admin account

Add your desired admin login to `.env` first:

```
ADMIN_SEED_EMAIL=you@example.com
ADMIN_SEED_PASSWORD=choose-a-real-password-8-chars-plus
```

Then run:

```bash
npm run seed:admin
```

This creates the Supabase Auth user **and** the linked `profiles` row
with `role=admin`. Re-running it is safe (it detects an existing
account instead of erroring).

### 6. Run it locally

```bash
npm run dev
```

This serves the frontend, but **`npm run dev` / `npm run preview`
do NOT run the `/api/*` serverless functions** — those only execute
under Vercel's runtime. To test the full stack locally (Contact form,
admin login, dashboard) install the Vercel CLI and run:

```bash
npm install -g vercel
vercel dev
```

`vercel dev` reads the same `.env` file and runs both the Vite
frontend and the `/api` functions together on one local port.

### 7. Deploy (Tasks 3 & 8 — you do this part yourself)

1. Push this repo to GitHub; add collaborator **`empradar`** under
   Settings → Collaborators.
2. Import the repo on https://vercel.com/new.
3. In Vercel → Project Settings → Environment Variables, add **every
   variable from `.env.example`** (Production and Preview).
4. Deploy. Vercel auto-detects the Vite frontend and the `/api`
   functions.
5. Create/switch to a `production` branch for the final submission
   (Task 8) and confirm Vercel deploys it.
6. Manually test on the **live URL**: portfolio loads → submit the
   Contact form → confirm a row appears in Supabase (Table Editor →
   `contacts`) and the alert email arrives → log into `/admin/login`
   → confirm dashboard stats and `/admin/queries` status updates work
   → try 6 wrong login attempts to confirm the rate limit message
   appears → log out.

## What's already handled vs. what's still yours to do

**Built and working (pending your real credentials):** the entire
contact-to-database-to-email pipeline, the seeded-admin auth flow,
the protected dashboard and queries page, reCAPTCHA v3 verification,
IP rate limiting, status updates, logout.

**Requires your own action** (can't be done from inside this
environment — needs your accounts/voice):
- Creating the Supabase/Resend/reCAPTCHA accounts and pasting real
  keys into `.env` / Vercel
- `git push` to your own GitHub repo + granting `empradar` access
- Connecting the repo to Vercel and deploying
- Recording the Loom walkthrough (this is meant to demonstrate *your*
  understanding — see the task doc: "Do not submit a project that you
  cannot explain in the Loom video")
- Filling out and submitting the Google Form

## Content that still needs your real details

(Carried over from the portfolio build — see `src/data/*.js`):
`social.js` (GitHub/LinkedIn/email handle), `projects.js` (repo URLs),
`experience.js` (real employer names), `education.js` (confirm dates),
and `public/images/profile.jpg` (your actual photo — currently a
graceful initials fallback).
