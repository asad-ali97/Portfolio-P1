import { createClient } from '@supabase/supabase-js'
import { prisma } from '../_lib/prisma.js'
import { verifyRecaptcha } from '../_lib/recaptcha.js'
import { getClientIp } from '../_lib/getClientIp.js'

const MAX_ATTEMPTS = 5
const BLOCK_DURATION_MS = 15 * 60 * 1000 // 15 minutes
const ATTEMPT_WINDOW_MS = 30 * 60 * 1000 // stale attempts older than this don't count

// Auth (sign-in) uses the anon key, same as a browser client would —
// least privilege, no service-role usage for a plain credential check.
const supabaseAuthClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

/**
 * POST /api/auth/login
 * Body: { email, password, recaptchaToken }
 *
 * Order of checks (Task 7):
 *  1. Is this IP currently blocked? -> 429 immediately, no credential check.
 *  2. Verify reCAPTCHA v3 server-side.
 *  3. Record this attempt; if it pushes the IP over 5, block it -> 429.
 *  4. Attempt Supabase Auth sign-in server-side.
 *  5. On success, reset the IP's attempt counter and return the session.
 *
 * Sensitive details (why exactly a login failed at the Supabase layer,
 * internal error messages, etc.) are never forwarded to the client —
 * only generic, friendly messages are.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const { email, password, recaptchaToken } = req.body || {}
  const ip = getClientIp(req)

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  try {
    // 1. Check current block status first — cheapest check, and we
    // don't want to burn a reCAPTCHA verification on an IP that's
    // already locked out.
    let attemptRow = await prisma.loginAttempt.findUnique({ where: { ipAddress: ip } })

    if (attemptRow?.blockedUntil && attemptRow.blockedUntil > new Date()) {
      const minutesLeft = Math.ceil((attemptRow.blockedUntil - new Date()) / 60000)
      return res.status(429).json({
        error: `Too many login attempts. Please try again in about ${minutesLeft} minute${minutesLeft === 1 ? '' : 's'}.`,
      })
    }

    // 2. Server-side reCAPTCHA verification.
    const recaptchaResult = await verifyRecaptcha(recaptchaToken, ip)
    if (!recaptchaResult.success) {
      return res.status(400).json({
        error: 'We couldn\u2019t verify you\u2019re human. Please refresh and try again.',
      })
    }

    // 3. Record this attempt.
    const now = new Date()
    const windowExpired =
      attemptRow && now.getTime() - new Date(attemptRow.lastAttemptAt).getTime() > ATTEMPT_WINDOW_MS
    const nextAttempts = !attemptRow || windowExpired ? 1 : attemptRow.attempts + 1

    if (nextAttempts > MAX_ATTEMPTS) {
      attemptRow = await prisma.loginAttempt.upsert({
        where: { ipAddress: ip },
        update: { attempts: nextAttempts, lastAttemptAt: now, blockedUntil: new Date(now.getTime() + BLOCK_DURATION_MS) },
        create: { ipAddress: ip, attempts: nextAttempts, lastAttemptAt: now, blockedUntil: new Date(now.getTime() + BLOCK_DURATION_MS) },
      })
      return res.status(429).json({
        error: 'Too many login attempts. Please try again in about 15 minutes.',
      })
    }

    attemptRow = await prisma.loginAttempt.upsert({
      where: { ipAddress: ip },
      update: { attempts: nextAttempts, lastAttemptAt: now, blockedUntil: null },
      create: { ipAddress: ip, attempts: nextAttempts, lastAttemptAt: now },
    })

    // 4. Attempt the actual sign-in.
    const { data, error } = await supabaseAuthClient.auth.signInWithPassword({ email, password })

    if (error || !data?.session) {
      // Generic message — never reveal whether the email exists.
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    // Confirm this user actually has an admin Profile row — a valid
    // Supabase account alone isn't enough to reach the dashboard.
    const profile = await prisma.profile.findUnique({ where: { authUserId: data.user.id } })
    if (!profile || profile.role !== 'admin') {
      return res.status(403).json({ error: 'This account is not authorized for admin access.' })
    }

    // 5. Success — reset the rate limit for this IP.
    await prisma.loginAttempt.update({
      where: { ipAddress: ip },
      data: { attempts: 0, blockedUntil: null },
    })

    return res.status(200).json({
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
      profile: { name: profile.name, email: profile.email, role: profile.role },
    })
  } catch (err) {
    console.error('[api/auth/login] Unexpected error:', err)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}
