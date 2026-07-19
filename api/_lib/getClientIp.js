/**
 * Vercel sits behind a proxy, so the real client IP is in
 * x-forwarded-for (first entry), not the raw socket address.
 */
export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) {
    return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim()
  }
  return req.socket?.remoteAddress || 'unknown'
}
