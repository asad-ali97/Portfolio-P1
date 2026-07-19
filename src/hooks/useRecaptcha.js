import { useCallback, useEffect, useRef, useState } from 'react'

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY

/**
 * Loads the Google reCAPTCHA v3 script on demand (only the admin
 * login page uses this — no reason to ship it site-wide) and exposes
 * `getToken(action)` to run an invisible check before a form submits.
 */
export function useRecaptcha() {
  const [isReady, setIsReady] = useState(false)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    if (!SITE_KEY || scriptLoadedRef.current) return undefined
    scriptLoadedRef.current = true

    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
    script.async = true
    script.onload = () => {
      window.grecaptcha?.ready(() => setIsReady(true))
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const getToken = useCallback(
    async (action = 'login') => {
      if (!SITE_KEY) {
        console.warn('[useRecaptcha] VITE_RECAPTCHA_SITE_KEY is not set — skipping.')
        return null
      }
      if (!window.grecaptcha) return null
      return window.grecaptcha.execute(SITE_KEY, { action })
    },
    []
  )

  return { isReady: isReady || !SITE_KEY, getToken }
}
