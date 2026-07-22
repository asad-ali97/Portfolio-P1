import PropTypes from 'prop-types'
import { Eye } from 'lucide-react'
import StatusBadge from '@/components/admin/StatusBadge'
import { formatContactDate, PRIMARY_STATUS_OPTIONS } from '@/lib/contactStatus'

/**
 * Responsive contacts table. Extends the original with an Actions column
 * (open detail) and optional inline Pending/Resolved select.
 */
function ContactsTable({
  contacts,
  editable = false,
  onStatusChange,
  onView,
  emptyMessage = 'No contact queries yet.',
}) {
  if (contacts.length === 0) {
    return <p className="py-10 text-center text-sm text-muted">{emptyMessage}</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <th className="py-3 pr-4 font-medium">Name</th>
            <th className="py-3 pr-4 font-medium">Email</th>
            <th className="py-3 pr-4 font-medium">Subject</th>
            <th className="py-3 pr-4 font-medium">Status</th>
            <th className="py-3 pr-4 font-medium">Date</th>
            {(editable || onView) && <th className="py-3 pr-4 font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              className="border-b border-border/60 align-middle transition-colors hover:bg-surface/40"
            >
              <td className="max-w-[140px] truncate py-3 pr-4 font-medium text-text">{contact.name}</td>
              <td className="max-w-[180px] truncate py-3 pr-4 text-muted">{contact.email}</td>
              <td className="max-w-[220px] truncate py-3 pr-4 text-text/90">{contact.subject}</td>
              <td className="py-3 pr-4">
                {editable && onStatusChange ? (
                  <select
                    value={
                      contact.status === 'pending'
                        ? 'pending'
                        : ['done', 'completed', 'resolved'].includes(contact.status)
                          ? 'resolved'
                          : contact.status
                    }
                    onChange={(event) => onStatusChange(contact.id, event.target.value)}
                    aria-label={`Update status for query from ${contact.name}`}
                    className="rounded-md border border-border-strong bg-surface px-2 py-1.5 text-xs capitalize text-text focus:border-secondary focus:outline-none"
                  >
                    {PRIMARY_STATUS_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <StatusBadge status={contact.status} />
                )}
              </td>
              <td className="whitespace-nowrap py-3 pr-4 text-muted">
                {formatContactDate(contact.createdAt)}
              </td>
              {(editable || onView) && (
                <td className="py-3 pr-4">
                  {onView && (
                    <button
                      type="button"
                      onClick={() => onView(contact)}
                      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-secondary/10 hover:text-text"
                    >
                      <Eye size={14} aria-hidden="true" />
                      View
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

ContactsTable.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      subject: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  editable: PropTypes.bool,
  onStatusChange: PropTypes.func,
  onView: PropTypes.func,
  emptyMessage: PropTypes.string,
}

export default ContactsTable
