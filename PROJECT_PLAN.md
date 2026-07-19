# Project Plan — Asad Ali Portfolio + Contact System + Admin Dashboard

**MERN Stack Internship — Week 1 Practical Task**
**Author:** Asad Ali
**Stack chosen:** React (Vite) frontend, Vercel Serverless Functions
(Node.js) as the backend, Prisma ORM, Supabase (Postgres + Auth),
Resend (email), Google reCAPTCHA v3.

This is the Task 1 deliverable: a plan written before implementation,
covering pages/sections, features, database flow, auth flow, and the
deployment plan.

---

## 1. Pages & Sections

The **public site** is a single page (`/`) with anchor-nav sections, in
this order:

| Section | Purpose |
|---|---|
| Hero | Name, role, 3D visual, CTA buttons |
| About | Bio, education, quick facts |
| Skills | Categorized technical skills |
| Projects | Project cards (tech stack, GitHub/demo links) |
| Experience | Work history timeline |
| Education | Degree/institution |
| Contact | Contact Us form (name, email, subject, message) |
| Footer | Social links, copyright |

The **admin area** is a separate, routed section of the same app:

| Route | Purpose | Access |
|---|---|---|
| `/admin/login` | Admin sign-in (reCAPTCHA v3 protected) | Public |
| `/admin` | Dashboard: stats + recent contacts | Admin only |
| `/admin/queries` | Full contact list + status updates | Admin only |

## 2. Features

- Responsive, animated single-page portfolio (existing — built in a
  prior phase of this project).
- Contact Us form with client-side **and** server-side validation.
- Every submission is saved to Postgres (via Supabase, through
  Prisma) with a default status of `pending`.
- An email alert is sent (via Resend) to the admin's inbox on every
  new submission — failures here never block the user-facing
  submission from succeeding.
- A single seeded Admin account (created once via
  `scripts/seed-admin.ts`, not through a public sign-up form — there
  is intentionally no registration flow).
- Admin login is protected by Google reCAPTCHA v3 (verified
  server-side) and IP-based rate limiting (block after 5 failed
  attempts within a rolling window).
- Protected dashboard: total / pending / resolved contact counts,
  recent contacts.
- Protected contact-queries page: full list, inline status changes
  (`pending` → `done` / `completed` / `resolved`).
- Logout clears the session client-side.

## 3. Database Flow

Three tables (see `prisma/schema.prisma` for the authoritative
definitions — this mirrors the task doc's suggested structure):

```
contacts                          profiles                         login_attempts
─────────                         ────────                         ──────────────
id            uuid PK             id            uuid PK            id             uuid PK
name          text                auth_user_id  text UNIQUE  ─┐    ip_address     text UNIQUE
email         text                name          text          │    attempts       int
subject       text                email         text UNIQUE   │    last_attempt_at timestamp
message       text                role          enum(admin)   │    blocked_until  timestamp?
status        enum(pending/       created_at    timestamp     │
              done/completed/                                  │
              resolved)                                        │
created_at    timestamp                                        │
updated_at    timestamp                          Supabase Auth ◄┘
                                                  (auth.users)
```

**Write path (Contact Us):**
`Contact.jsx` form → client-side validation (UX only) → `POST
/api/contact` → server-side validation → `prisma.contact.create()`
(status defaults to `pending`) → Resend email fired (best-effort,
non-blocking) → `201` returned to the client → success state shown.

**Read/update path (Admin):**
`/admin/queries` on mount → `GET /api/admin/contacts` (Bearer token)
→ `requireAdmin()` verifies the token against Supabase Auth *and*
confirms an admin `profiles` row exists → full list returned →
admin changes a dropdown → `PATCH /api/admin/contacts?id=...` →
`prisma.contact.update()`.

## 4. Authentication Flow

Deliberately **not** the default "call `supabase.auth.signInWithPassword`
straight from the browser" pattern — login is server-mediated through
`POST /api/auth/login` so rate limiting and reCAPTCHA can actually gate
the attempt before Supabase is touched:

1. Admin submits email + password on `/admin/login`.
2. Browser silently runs `grecaptcha.execute()` (v3 — no visible
   challenge) and gets a token.
3. `POST /api/auth/login { email, password, recaptchaToken }`.
4. Server checks: is this IP currently blocked? → if yes, `429`
   immediately, credentials never even looked at.
5. Server verifies the reCAPTCHA token with Google (server-side).
6. Server increments the IP's attempt counter; if that pushes it over
   5, block the IP for 15 minutes and return `429`.
7. Server calls Supabase Auth (`signInWithPassword`) itself.
8. On success, server checks the `profiles` table for an `admin` role
   row linked to that auth user — a bare Supabase account isn't
   enough.
9. Server resets the IP's attempt counter and returns a session
   (`access_token`/`refresh_token`) + profile.
10. Client stores the session (`localStorage`) and attaches
    `Authorization: Bearer <access_token>` on every subsequent
    `/api/admin/*` call. Each of those routes independently
    re-verifies the token server-side — the frontend route guard
    (`ProtectedRoute`) is a UX convenience, not the actual security
    boundary.

Secrets (`SUPABASE_SERVICE_ROLE_KEY`, `RECAPTCHA_SECRET_KEY`,
`RESEND_API_KEY`) only ever exist in serverless-function environment
variables — never shipped to the browser bundle.

## 5. Deployment Plan

1. Push to a GitHub repository; add collaborator `empradar`.
2. Import the repo into Vercel.
3. Add every variable from `.env.example` to Vercel → Project
   Settings → Environment Variables (Production + Preview).
4. Vercel's build runs `npm install` → `postinstall` triggers `prisma
   generate` → `vite build` for the frontend; `/api/*.js` files are
   auto-detected as serverless functions.
5. Run `npx prisma migrate deploy` (or `migrate dev` once locally
   against the Supabase DB) to create the tables before first use.
6. Run `npm run seed:admin` **locally** (against the real Supabase
   project) to create the one admin account — this is a one-time
   local script, not something that runs on Vercel.
7. Merge to a `production` branch for the final deploy, per Task 8.
8. Smoke-test on the live URL: portfolio loads, Contact Us saves +
   emails, `/admin/login` works, dashboard/queries load, status
   updates persist, reCAPTCHA/rate-limit trigger correctly, logout
   works.

---

*Design direction (colors, typography, section order, component
style) was established using the project's existing `ai-context`
brand/design-system files from an earlier phase of this project — see
`docs/design-reference.png` for a generated visual reference.*
