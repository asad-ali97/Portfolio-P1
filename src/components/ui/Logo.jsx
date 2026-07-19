import PropTypes from 'prop-types'

/**
 * Wordmark: "Asad Ali" in the heading face, with a mono-font cursor
 * accent — a small nod to the engineering identity without leaning
 * on the angle-bracket-logo cliché.
 *
 * Renders as a plain span, not a link/button — callers (Navbar,
 * Footer) already wrap it in their own <button onClick={scrollToTop}>,
 * and nesting an interactive element inside another is invalid
 * HTML/ARIA.
 */
function Logo({ className = '' }) {
  return (
    <span className={`font-heading text-lg font-semibold tracking-tight text-text ${className}`}>
      Asad Ali
      <span className="font-mono text-primary" aria-hidden="true">
        _
      </span>
    </span>
  )
}

Logo.propTypes = {
  className: PropTypes.string,
}

export default Logo
