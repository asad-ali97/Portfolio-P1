import PropTypes from 'prop-types'

const STATUS_STYLES = {
  pending: 'bg-primary/10 text-primary border-primary/30',
  done: 'bg-secondary/10 text-secondary border-secondary/30',
  completed: 'bg-secondary/10 text-secondary border-secondary/30',
  resolved: 'bg-secondary/10 text-secondary border-secondary/30',
}

const STATUS_LABELS = {
  pending: 'Pending',
  done: 'Done',
  completed: 'Completed',
  resolved: 'Resolved',
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-xs capitalize ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  )
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
}

export default StatusBadge
