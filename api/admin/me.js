import { requireAdmin } from '../_lib/verifyAdmin.js'

/** GET /api/admin/me — verifies the bearer token and admin role. */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const auth = await requireAdmin(req)
  if (!auth.ok) return res.status(auth.status).json({ error: auth.message })

  return res.status(200).json({
    profile: { name: auth.profile.name, email: auth.profile.email, role: auth.profile.role },
  })
}
