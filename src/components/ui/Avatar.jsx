import { useState } from 'react'
import PropTypes from 'prop-types'
import { motion, useReducedMotion } from 'framer-motion'

const SIZE_CLASSES = {
  md: 'h-32 w-32 md:h-40 md:w-40',
  lg: 'h-56 w-56 md:h-72 md:w-72',
}

/**
 * Circular profile photo with a gradient (primary → secondary) ring
 * and subtle shadow, per 06_ui_ux_rules.md ("Professional photo
 * featured on Home and About") and the request for a modern
 * circular/gradient-border treatment.
 *
 * Falls back to an initials monogram if `src` is missing or fails to
 * load, so the layout never shows a broken image icon.
 */
function Avatar({ src, alt, initials = 'AA', size = 'lg', float = true }) {
  const [imgFailed, setImgFailed] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const showImage = Boolean(src) && !imgFailed

  const floatAnimation =
    float && !prefersReducedMotion
      ? { y: [0, -10, 0] }
      : undefined

  return (
    <motion.div
      animate={floatAnimation}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className={`relative ${SIZE_CLASSES[size]} shrink-0`}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary/60 to-secondary opacity-80 blur-xl" />
      <div className="relative h-full w-full rounded-full bg-gradient-to-br from-primary to-secondary p-[3px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
        <div className="h-full w-full overflow-hidden rounded-full bg-surface">
          {showImage ? (
            <img
              src={src}
              alt={alt}
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface">
              <span className="font-heading text-4xl font-semibold text-muted md:text-5xl">
                {initials}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  initials: PropTypes.string,
  size: PropTypes.oneOf(['md', 'lg']),
  float: PropTypes.bool,
}

export default Avatar
