import PropTypes from 'prop-types'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/ThemeContext'
import { DURATION, EASE_PREMIUM } from '@/lib/motion'

/**
 * Light/dark mode switch. Shows the icon of the theme you would switch
 * TO (sun while dark, moon while light), with a small cross-fade+spin
 * between them.
 */
function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-strong
        text-muted transition-colors duration-200 hover:border-secondary hover:text-secondary ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
          transition={{ duration: DURATION.hover, ease: EASE_PREMIUM }}
          className="inline-flex"
        >
          {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

ThemeToggle.propTypes = {
  className: PropTypes.string,
}

export default ThemeToggle
