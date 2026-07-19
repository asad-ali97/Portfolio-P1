import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { cardHover } from '@/lib/motion'

/**
 * Base glassmorphism card. One definition for the blur/border/shadow
 * recipe and hover lift so every card-like section looks consistent
 * (06_ui_ux_rules.md: "Glassmorphism for cards").
 */
function Card({ children, className = '', hoverable = true, as: Tag = 'div' }) {
  const MotionTag = motion[Tag] ?? motion.div

  return (
    <MotionTag
      whileHover={hoverable ? cardHover : undefined}
      className={`glass-surface rounded-lg p-6 md:p-8 ${className}`}
    >
      {children}
    </MotionTag>
  )
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hoverable: PropTypes.bool,
  as: PropTypes.string,
}

export default Card
