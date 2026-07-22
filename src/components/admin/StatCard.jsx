import PropTypes from 'prop-types'
import Card from '@/components/ui/Card'

function StatCard({ label, value, icon: Icon, accent = 'primary', description }) {
  return (
    <Card hoverable={false} className="flex items-center gap-4">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${
          accent === 'secondary' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
        }`}
      >
        <Icon size={22} aria-hidden="true" />
      </div>
      <div>
        <p className="font-heading text-2xl font-semibold text-text">{value}</p>
        <p className="text-sm text-muted">{label}</p>
        {description && <p className="mt-0.5 text-xs text-muted/80">{description}</p>}
      </div>
    </Card>
  )
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  accent: PropTypes.oneOf(['primary', 'secondary']),
  description: PropTypes.string,
}

export default StatCard
