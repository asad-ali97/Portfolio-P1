import { prisma } from '../_lib/prisma.js'
import { requireAdmin } from '../_lib/verifyAdmin.js'

const VALID_STATUSES = ['pending', 'done', 'completed', 'resolved']

/**
 * GET  /api/admin/contacts            -> list all contact queries (newest first)
 * PATCH /api/admin/contacts?id=<uuid>  -> body: { status } -> update one query's status
 *
 * Task 6: "Admin should be able to change it to Done, Completed, or
 * Resolved."
 */
export default async function handler(req, res) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return res.status(auth.status).json({ error: auth.message })

  if (req.method === 'GET') {
    try {
      const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } })
      return res.status(200).json({ contacts })
    } catch (err) {
      console.error('[api/admin/contacts] GET error:', err)
      return res.status(500).json({ error: 'Could not load contact queries.' })
    }
  }

  if (req.method === 'PATCH') {
    const id = req.query?.id
    const { status } = req.body || {}

    if (!id) return res.status(400).json({ error: 'Missing contact id.' })
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}.` })
    }

    try {
      const updated = await prisma.contact.update({ where: { id }, data: { status } })
      return res.status(200).json({ contact: updated })
    } catch (err) {
      console.error('[api/admin/contacts] PATCH error:', err)
      return res.status(500).json({ error: 'Could not update that query.' })
    }
  }

  res.setHeader('Allow', 'GET, PATCH')
  return res.status(405).json({ error: 'Method not allowed.' })
}
