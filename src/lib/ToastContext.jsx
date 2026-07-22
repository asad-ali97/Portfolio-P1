import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { DURATION, EASE_PREMIUM } from '@/lib/motion'

const ToastContext = createContext(null)

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const STYLES = {
  success: 'border-secondary/40 bg-surface text-text',
  error: 'border-primary/40 bg-surface text-text',
  info: 'border-border-strong bg-surface text-text',
}

const ICON_STYLES = {
  success: 'text-secondary',
  error: 'text-primary',
  info: 'text-muted',
}

/**
 * Lightweight toast system — no extra dependency. Matches the portfolio
 * glass/surface look and respects reduced-motion via MotionConfig.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message, { type = 'info', duration = 3500 } = {}) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      setToasts((prev) => [...prev, { id, message, type }])
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss]
  )

  const value = useMemo(
    () => ({
      toast,
      success: (message, opts) => toast(message, { ...opts, type: 'success' }),
      error: (message, opts) => toast(message, { ...opts, type: 'error' }),
      info: (message, opts) => toast(message, { ...opts, type: 'info' }),
    }),
    [toast]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-relevant="additions"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:items-end"
      >
        <AnimatePresence>
          {toasts.map(({ id, message, type }) => {
            const Icon = ICONS[type] || ICONS.info
            return (
              <motion.div
                key={id}
                role="status"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: DURATION.fade, ease: EASE_PREMIUM }}
                className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-md border px-4 py-3 shadow-[var(--shadow-card)] ${STYLES[type] || STYLES.info}`}
              >
                <Icon size={18} className={`mt-0.5 shrink-0 ${ICON_STYLES[type] || ICON_STYLES.info}`} aria-hidden="true" />
                <p className="flex-1 text-sm leading-snug">{message}</p>
                <button
                  type="button"
                  onClick={() => dismiss(id)}
                  aria-label="Dismiss notification"
                  className="shrink-0 text-muted transition-colors hover:text-text"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

// eslint-disable-next-line react-refresh/only-export-components -- context + hook co-located
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used inside a <ToastProvider>')
  }
  return context
}
