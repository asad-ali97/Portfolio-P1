/**
 * Shared contact-status helpers. Keep UI, badges, and filters in sync
 * with Prisma `ContactStatus` / api/admin/contacts VALID_STATUSES.
 */
export const CONTACT_STATUSES = ['pending', 'done', 'completed', 'resolved']

export const RESOLVED_STATUSES = ['done', 'completed', 'resolved']

export function isResolvedStatus(status) {
  return RESOLVED_STATUSES.includes(status)
}

/** Primary UI toggle values from the admin prompt: Pending ↔ Resolved */
export const PRIMARY_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
]

export function formatContactDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatContactDateTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
