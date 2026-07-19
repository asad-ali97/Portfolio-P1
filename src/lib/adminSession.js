const STORAGE_KEY = 'admin_session'

/**
 * Minimal session persistence for the admin area. Deliberately not
 * using Supabase's own client-side session management (which expects
 * signInWithPassword to be called directly from the browser) — our
 * login flow goes through /api/auth/login instead, so we own the
 * session storage ourselves.
 */
export const adminSession = {
  get() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  set(session, profile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ session, profile }))
  },
  clear() {
    localStorage.removeItem(STORAGE_KEY)
  },
  getAccessToken() {
    return adminSession.get()?.session?.access_token ?? null
  },
}
