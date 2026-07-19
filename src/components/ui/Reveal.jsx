import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { fadeUp, revealViewport, DURATION, EASE_PREMIUM } from '@/lib/motion'

/**
 * Wraps children in a scroll-triggered reveal (fade + rise). Every
 * section uses this instead of hand-rolling `whileInView` +
 * `variants` each time — one definition, consistent easing/timing
 * everywhere (07_animation_rules.md: "smooth only, never excessive").
 *
 * @param {{
 *   children: import('react').ReactNode,
 *   as?: keyof JSX.IntrinsicElements,
 *   delay?: number,
 *   className?: string,
 * }} props
 */
function Reveal({ children, as = 'div', delay = 0, className = '' }) {
  const MotionTag = motion[as] ?? motion.div

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={fadeUp}
      // Passing the full transition (not just { delay }) — Framer Motion
      // uses a component-level `transition` prop as-is rather than
      // merging it into the variant's own, so a partial object here
      // would silently drop our token duration/ease.
      transition={{ duration: DURATION.page, ease: EASE_PREMIUM, delay }}
    >
      {children}
    </MotionTag>
  )
}

Reveal.propTypes = {
  children: PropTypes.node.isRequired,
  as: PropTypes.string,
  delay: PropTypes.number,
  className: PropTypes.string,
}

export default Reveal
