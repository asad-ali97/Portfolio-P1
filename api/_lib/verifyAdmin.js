import { supabaseAdmin } from './supabaseAdmin.js'
import { prisma } from './prisma.js'

/**
 * Verifies the caller is a logged-in Supabase user AND has an admin
 * Profile row. Every /api/admin/* route calls this first.
 *
 * Expects an `Authorization: Bearer <access_token>` header, where the
 * token is the Supabase session access_token the client got back from
 * supabase.auth.signInWithPassword() / getSession().
 *
 * @param {import('http').IncomingMessage} req
 * @returns {Promise<{ ok: true, profile: object } | { ok: false, status: number, message: string }>}
 */
export async function requireAdmin(req) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return { ok: false, status: 401, message: 'Missing Authorization header.' }
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data?.user) {
    return { ok: false, status: 401, message: 'Invalid or expired session.' }
  }

  const profile = await prisma.profile.findUnique({
    where: { authUserId: data.user.id },
  })

  if (!profile || profile.role !== 'admin') {
    return { ok: false, status: 403, message: 'Not authorized.' }
  }

  return { ok: true, profile }
}
