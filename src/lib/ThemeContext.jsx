import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const STORAGE_KEY = 'theme'
const THEME_META_COLORS = { dark: '#08121F', light: '#F6F4EF' }

const ThemeContext = createContext(null)

function readInitialTheme() {
  // The pre-paint script in index.html already resolved and applied the
  // theme to <html data-theme="...">, so trust it as the initial value.
  const applied = document.documentElement.getAttribute('data-theme')
  return applied === 'light' ? 'light' : 'dark'
}

/**
 * Light/dark theme state. The actual theming is pure CSS — tokens.css
 * defines dark values on :root and light overrides on
 * [data-theme='light'] — so all this provider does is manage the
 * data-theme attribute, persist explicit choices, and follow the OS
 * preference until the user picks a side.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', THEME_META_COLORS[theme])
  }, [theme])

  // Follow OS preference changes, but only while the user hasn't made
  // an explicit choice (nothing saved in localStorage).
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)')
    function handleChange(event) {
      if (localStorage.getItem(STORAGE_KEY)) return
      setTheme(event.matches ? 'light' : 'dark')
    }
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

// eslint-disable-next-line react-refresh/only-export-components -- context + its consumer hook are intentionally co-located
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used inside a <ThemeProvider>')
  }
  return context
}
