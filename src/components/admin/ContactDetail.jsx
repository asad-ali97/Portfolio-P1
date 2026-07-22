import PropTypes from 'prop-types'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, X } from 'lucide-react'
import StatusBadge from '@/components/admin/StatusBadge'
import Button from '@/components/ui/Button'
import {
  formatContactDateTime,
  isResolvedStatus,
  PRIMARY_STATUS_OPTIONS,
} from '@/lib/contactStatus'
import { DURATION, EASE_PREMIUM } from '@/lib/motion'

/**
 * Slide-over contact detail panel. Shows the full message (previously
 * missing from the admin table) and a Pending ↔ Resolved toggle.
 */
function ContactDetail({ contact, open, onClose, onStatusChange, isUpdating = false }) {
  return (
    <AnimatePresence>
      {open && contact && (
        <>
          <motion.button
            type="button"
            aria-label="Close contact details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fade, ease: EASE_PREMIUM }}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-detail-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: DURATION.page, ease: EASE_PREMIUM }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-surface shadow-[var(--shadow-card-hover)]"
          >
            <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Contact query</p>
                <h2 id="contact-detail-title" className="mt-1 font-heading text-xl font-semibold text-text">
                  {contact.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-background hover:text-text"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={contact.status} />
                <span className="text-xs text-muted">{formatContactDateTime(contact.createdAt)}</span>
              </div>

              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted">Email</dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-flex items-center gap-2 text-secondary transition-colors hover:text-text"
                    >
                      <Mail size={14} aria-hidden="true" />
                      {contact.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted">Subject</dt>
                  <dd className="mt-1 font-medium text-text">{contact.subject}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted">Message</dt>
                  <dd className="mt-2 whitespace-pre-wrap rounded-md border border-border bg-background/50 p-4 leading-relaxed text-text/90">
                    {contact.message || '—'}
                  </dd>
                </div>
              </dl>
            </div>

            <footer className="space-y-3 border-t border-border px-6 py-5">
              <p className="text-xs text-muted">Update status</p>
              <div className="flex gap-2">
                {PRIMARY_STATUS_OPTIONS.map(({ value, label }) => {
                  const active =
                    value === 'pending'
                      ? contact.status === 'pending'
                      : isResolvedStatus(contact.status)
                  return (
                    <Button
                      key={value}
                      type="button"
                      variant={active ? 'primary' : 'secondary'}
                      size="md"
                      disabled={isUpdating || active}
                      className="flex-1"
                      onClick={() => onStatusChange(contact.id, value)}
                    >
                      {label}
                    </Button>
                  )
                })}
              </div>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

ContactDetail.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    message: PropTypes.string,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool,
}

export default ContactDetail
