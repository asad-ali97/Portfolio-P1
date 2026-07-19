import PropTypes from 'prop-types'
import Reveal from '@/components/ui/Reveal'

/**
 * Consistent "eyebrow + heading + subtitle" pattern used at the top
 * of every section (About, Skills, Projects, Experience, Education,
 * Contact) so headings don't get re-styled ad hoc per section.
 */
function SectionHeading({ eyebrow, title, subtitle, align = 'left' }) {
  const alignClasses = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'

  return (
    <Reveal className={`mb-12 flex max-w-2xl flex-col gap-3 md:mb-16 ${alignClasses}`}>
      <span className="font-mono text-sm font-medium tracking-wide text-secondary">
        {eyebrow}
      </span>
      <h2 className="font-heading text-3xl font-semibold text-text md:text-4xl">{title}</h2>
      {subtitle && <p className="text-balance text-muted">{subtitle}</p>}
    </Reveal>
  )
}

SectionHeading.propTypes = {
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center']),
}

export default SectionHeading
