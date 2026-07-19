import { prisma } from '../_lib/prisma.js'
import { requireAdmin } from '../_lib/verifyAdmin.js'

/**
 * GET /api/admin/stats
 * Returns: total contacts, pending count, resolved/completed count,
 * and the 5 most recent contacts — exactly the stat set Task 6 asks
 * for.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const auth = await requireAdmin(req)
  if (!auth.ok) return res.status(auth.status).json({ error: auth.message })

  try {
    const [total, pending, resolvedFamily, recent] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({ where: { status: 'pending' } }),
      prisma.contact.count({ where: { status: { in: ['done', 'completed', 'resolved'] } } }),
      prisma.contact.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    ])

    return res.status(200).json({
      totalContacts: total,
      pendingContacts: pending,
      resolvedContacts: resolvedFamily,
      recentContacts: recent,
    })
  } catch (err) {
    console.error('[api/admin/stats] Error:', err)
    return res.status(500).json({ error: 'Could not load dashboard stats.' })
  }
}
