import { adminSession } from '@/lib/adminSession'

/**
 * Thin fetch wrapper for /api/* calls. Attaches the admin bearer token
 * automatically when one is stored, parses JSON, and throws a
 * plain Error with the server's message on non-2xx responses so
 * callers can just try/catch.
 */
export async function apiFetch(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  if (auth) {
    const token = adminSession.getAccessToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status}).`)
  }

  return data
}
