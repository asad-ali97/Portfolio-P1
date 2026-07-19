import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { adminSession } from '@/lib/adminSession'
import { apiFetch } from '@/lib/api'

const AdminAuthContext = createContext(null)

/**
 * Owns admin auth state for the whole /admin area: current profile
 * (or null), loading state while the session is being verified, plus
 * login/logout actions. Session itself is a token issued by
 * /api/auth/login (see src/lib/adminSession.js) — not Supabase's own
 * client-side session management, since login is server-mediated for
 * proper rate-limit enforcement (see api/auth/login.js).
 */
export function AdminAuthProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const verifySession = useCallback(async () => {
    const stored = adminSession.get()
    if (!stored?.session?.access_token) {
      setProfile(null)
      setIsLoading(false)
      return
    }

    try {
      const data = await apiFetch('/api/admin/me', { auth: true })
      setProfile(data.profile)
    } catch {
      // Token invalid/expired — clear it so the login page shows again.
      adminSession.clear()
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Deferred to a microtask so the early-return branch inside
    // verifySession() (which can call setState before any await)
    // never runs synchronously within the effect body itself.
    queueMicrotask(() => {
      verifySession()
    })
  }, [verifySession])

  async function login(email, password, recaptchaToken) {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: { email, password, recaptchaToken },
    })
    adminSession.set(data.session, data.profile)
    setProfile(data.profile)
    return data.profile
  }

  function logout() {
    adminSession.clear()
    setProfile(null)
  }

  return (
    <AdminAuthContext.Provider value={{ profile, isLoading, isAuthenticated: Boolean(profile), login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

AdminAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

// eslint-disable-next-line react-refresh/only-export-components -- context + its consumer hook are intentionally co-located
export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  return ctx
}
