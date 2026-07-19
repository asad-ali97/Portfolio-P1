import { createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import { ReactLenis, useLenis } from 'lenis/react'
import { NAV_HEIGHT } from '@/data/navigation'

const ScrollContext = createContext(null)

/**
 * Bridges the official `lenis/react` instance (from the surrounding
 * <ReactLenis root> below) into a simple `scrollToSection(id, opts)`
 * helper, so the rest of the app doesn't need to know about Lenis's
 * API directly.
 */
function ScrollBridge({ children }) {
  const lenis = useLenis()

  function scrollToSection(id, { offset = NAV_HEIGHT } = {}) {
    const target = document.getElementById(id)
    if (!target) return

    const top = target.getBoundingClientRect().top + window.scrollY - offset

    if (lenis) {
      lenis.scrollTo(top)
    } else {
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return <ScrollContext.Provider value={{ scrollToSection }}>{children}</ScrollContext.Provider>
}

ScrollBridge.propTypes = {
  children: PropTypes.node.isRequired,
}

/** Fallback used when the user prefers reduced motion — no Lenis at all. */
function NativeScrollProvider({ children }) {
  function scrollToSection(id, { offset = NAV_HEIGHT } = {}) {
    const target = document.getElementById(id)
    if (!target) return
    const top = target.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'auto' })
  }

  return <ScrollContext.Provider value={{ scrollToSection }}>{children}</ScrollContext.Provider>
}

NativeScrollProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

/**
 * Sets up Lenis smooth scrolling for the whole document (`root`) using
 * the library's own official React integration, and exposes
 * `scrollToSection` via context for nav clicks. Respects
 * prefers-reduced-motion by skipping Lenis entirely, per
 * 07_animation_rules.md.
 */
export function LenisProvider({ children }) {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    return <NativeScrollProvider>{children}</NativeScrollProvider>
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      }}
    >
      <ScrollBridge>{children}</ScrollBridge>
    </ReactLenis>
  )
}

LenisProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

// eslint-disable-next-line react-refresh/only-export-components -- context + its consumer hook are intentionally co-located
export function useLenisContext() {
  const ctx = useContext(ScrollContext)
  if (!ctx) {
    throw new Error('useLenisContext must be used within a LenisProvider')
  }
  return ctx
}
