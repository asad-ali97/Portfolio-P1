/**
 * scripts/seed-admin.ts
 *
 * Creates the first (and only) Admin user: a Supabase Auth account
 * plus the linked `profiles` row with role=admin. Run this once,
 * locally, after your .env is filled in with real Supabase credentials.
 *
 * Usage:
 *   npm run seed:admin
 *
 * Reads from .env:
 *   SUPABASE_URL or VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   (Supabase project)
 *   ADMIN_SEED_NAME, ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD  (the account to create)
 *
 * Idempotent: if the admin user/profile already exists, it reports
 * that instead of erroring or creating a duplicate — safe to re-run.
 */
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ADMIN_NAME = process.env.ADMIN_SEED_NAME || 'Asad Ali'
const ADMIN_EMAIL = process.env.ADMIN_SEED_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD
const SEED_DATABASE_URL = process.env.DIRECT_URL || process.env.DATABASE_URL

async function main() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env — fill those in first.'
    )
  }
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      'Missing ADMIN_SEED_EMAIL or ADMIN_SEED_PASSWORD in .env — set the credentials ' +
        'you want to log into the admin dashboard with, then re-run.'
    )
  }
  if (!SEED_DATABASE_URL) {
    throw new Error('Missing DIRECT_URL or DATABASE_URL in .env — fill in the database connection string first.')
  }
  if (ADMIN_PASSWORD.length < 8) {
    throw new Error('ADMIN_SEED_PASSWORD should be at least 8 characters.')
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const prisma = new PrismaClient({
    datasources: {
      db: { url: SEED_DATABASE_URL },
    },
  })

  try {
    console.log(`Seeding admin user: ${ADMIN_EMAIL}`)

    // Reuse the auth user if it already exists (idempotent re-runs).
    let authUserId
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    })

    if (createError) {
      const alreadyExists = /already.*registered|already exists/i.test(createError.message || '')
      if (!alreadyExists) throw createError

      console.log('Auth user already exists — looking it up instead of creating a new one.')
      const { data: list, error: listError } = await supabase.auth.admin.listUsers()
      if (listError) throw listError
      const existing = list.users.find((u) => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase())
      if (!existing) throw new Error('Could not find the existing auth user by email.')
      authUserId = existing.id
    } else {
      authUserId = created.user.id
      console.log('Created new Supabase Auth user.')
    }

    const profile = await prisma.profile.upsert({
      where: { authUserId },
      update: { name: ADMIN_NAME, email: ADMIN_EMAIL, role: 'admin' },
      create: { authUserId, name: ADMIN_NAME, email: ADMIN_EMAIL, role: 'admin' },
    })

    console.log('\n✅ Admin seeded successfully.')
    console.log(`   Name:  ${profile.name}`)
    console.log(`   Email: ${profile.email}`)
    console.log('   Log in at /admin/login with this email and the password from .env.\n')
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((err) => {
  console.error('\n❌ Seeding failed:', err.message || err)
  process.exit(1)
})
