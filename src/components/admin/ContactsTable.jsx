import PropTypes from 'prop-types'
import StatusBadge from '@/components/admin/StatusBadge'

const STATUS_OPTIONS = ['pending', 'done', 'completed', 'resolved']

function ContactsTable({ contacts, editable = false, onStatusChange }) {
  if (contacts.length === 0) {
    return <p className="py-8 text-center text-sm text-muted">No contact queries yet.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <th className="py-3 pr-4 font-medium">Name</th>
            <th className="py-3 pr-4 font-medium">Email</th>
            <th className="py-3 pr-4 font-medium">Subject</th>
            <th className="py-3 pr-4 font-medium">Received</th>
            <th className="py-3 pr-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id} className="border-b border-border/60 align-top">
              <td className="max-w-[160px] truncate py-3 pr-4 font-medium text-text">{contact.name}</td>
              <td className="max-w-[200px] truncate py-3 pr-4 text-muted">{contact.email}</td>
              <td className="max-w-[240px] truncate py-3 pr-4 text-text/90">{contact.subject}</td>
              <td className="whitespace-nowrap py-3 pr-4 text-muted">
                {new Date(contact.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>
              <td className="py-3 pr-4">
                {editable ? (
                  <select
                    value={contact.status}
                    onChange={(event) => onStatusChange(contact.id, event.target.value)}
                    aria-label={`Update status for query from ${contact.name}`}
                    className="rounded-md border border-border-strong bg-surface px-2 py-1.5 text-xs capitalize text-text focus:border-secondary focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : (
                  <StatusBadge status={contact.status} />
                )}
              </td>
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
}

export default ContactsTable
