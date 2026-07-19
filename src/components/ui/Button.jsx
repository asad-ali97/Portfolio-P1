import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { DURATION, EASE_PREMIUM } from '@/lib/motion'

const VARIANT_CLASSES = {
  // Primary: orange, reserved for the single most important action on
  // a given screen (design rule: "Orange is reserved for important actions").
  primary:
    'bg-primary text-background hover:bg-primary/90 shadow-[0_0_0_1px_var(--color-primary)]',
  // Secondary: outlined, turquoise focus ring on hover — for
  // supporting actions that shouldn't compete with primary.
  secondary:
    'bg-transparent text-text border border-border-strong hover:border-secondary hover:text-secondary',
  // Ghost: minimal, for tertiary/inline actions (e.g. "View case study").
  ghost: 'bg-transparent text-muted hover:text-text',
}

const SIZE_CLASSES = {
  md: 'h-12 px-6 text-sm', // 48px — 8px grid
  lg: 'h-14 px-8 text-base', // 56px — 8px grid
}

/**
 * Reusable, accessible, tactile button.
 *
 * Renders as:
 *  - an external <a>     when `href` is provided
 *  - a native <button>   otherwise (pass `onClick` for in-page smooth
 *    scroll via useLenisContext().scrollToSection, form submits, etc.)
 *
 * @param {{
 *   children: import('react').ReactNode,
 *   variant?: 'primary' | 'secondary' | 'ghost',
 *   size?: 'md' | 'lg',
 *   href?: string,
 *   icon?: import('react').ReactNode,
 *   iconPosition?: 'left' | 'right',
 *   className?: string,
 *   onClick?: () => void,
 *   type?: 'button' | 'submit' | 'reset',
 *   disabled?: boolean,
 * }} props
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    href,
    icon = null,
    iconPosition = 'right',
    className = '',
    onClick,
    type = 'button',
    disabled = false,
    ...rest
  },
  ref
) {
  // Focus ring color/offset comes from the global :focus-visible rule in
  // styles/index.css — intentionally not redeclared here so every
  // focusable element in the app shares one definition.
  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight
    transition-colors disabled:opacity-40 disabled:pointer-events-none
    ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </>
  )

  const motionProps = {
    whileHover: disabled ? undefined : { scale: 1.03 },
    whileTap: disabled ? undefined : { scale: 0.97 },
    transition: { duration: DURATION.hover, ease: EASE_PREMIUM },
  }

  if (href) {
    return (
      <motion.div className="inline-block" {...motionProps}>
        <a
          ref={ref}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
          {...rest}
        >
          {content}
        </a>
      </motion.div>
    )
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      {...motionProps}
      {...rest}
    >
      {content}
    </motion.button>
  )
})

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  size: PropTypes.oneOf(['md', 'lg']),
  href: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
}

export default Button
