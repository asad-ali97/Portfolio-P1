import { createClient } from '@supabase/supabase-js'

// SERVICE ROLE KEY — server-only. Never prefix this env var with
// VITE_ (that would bundle it into client-side JS). It must only ever
// be read here, inside a serverless function, via process.env.
const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.warn(
    '[supabaseAdmin] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — ' +
      'admin-privileged Supabase calls will fail until these are set.'
  )
}

/**
 * Service-role Supabase client — bypasses Row Level Security. Used
 * for: creating the seeded admin auth user (scripts/seed-admin.ts)
 * and verifying a caller's access token server-side
 * (api/_lib/verifyAdmin.js). Never import this file from src/.
 */
export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})
