import PropTypes from 'prop-types'

/**
 * GitHub / LinkedIn glyphs, drawn to match lucide-react's icon style
 * (24x24 viewBox, currentColor, 2px round stroke) so they sit
 * consistently next to lucide's <Mail>, <Menu>, <X>, etc.
 *
 * lucide-react removed brand/social icons in recent major versions,
 * so these two are hand-drawn locally rather than pulled from a
 * (now-nonexistent) lucide export.
 */

const commonProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function GithubIcon({ size = 18, ...rest }) {
  return (
    <svg width={size} height={size} {...commonProps} {...rest}>
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 1.7 5.4 2 5.4 2a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 8.4c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V20" />
    </svg>
  )
}

GithubIcon.propTypes = { size: PropTypes.number }

export function LinkedinIcon({ size = 18, ...rest }) {
  return (
    <svg width={size} height={size} {...commonProps} {...rest}>
      <path d="M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-6a6 6 0 0 1 6-6Z" />
      <rect x="2" y="9" width="4" height="11" rx="0.5" />
      <circle cx="4" cy="4" r="1.8" />
    </svg>
  )
}

LinkedinIcon.propTypes = { size: PropTypes.number }
