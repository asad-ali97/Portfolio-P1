const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'
const SCORE_THRESHOLD = 0.5 // Google's suggested default for v3

/**
 * Verifies a reCAPTCHA v3 token server-side, per task doc requirement:
 * "Verify reCAPTCHA on the server side before allowing login
 * processing." Never trust a client-reported pass/fail.
 *
 * @param {string} token - the token produced by grecaptcha.execute() on the client
 * @param {string} remoteIp - the caller's IP (optional but recommended)
 * @returns {Promise<{ success: boolean, score?: number, reason?: string }>}
 */
export async function verifyRecaptcha(token, remoteIp) {
  const secret = process.env.RECAPTCHA_SECRET_KEY

  if (!secret) {
    return { success: false, reason: 'RECAPTCHA_SECRET_KEY is not configured on the server.' }
  }
  if (!token) {
    return { success: false, reason: 'Missing reCAPTCHA token.' }
  }

  const params = new URLSearchParams({ secret, response: token })
  if (remoteIp) params.set('remoteip', remoteIp)

  const response = await fetch(VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  const data = await response.json()

  if (!data.success) {
    return { success: false, reason: 'reCAPTCHA verification failed.', errors: data['error-codes'] }
  }
  if (typeof data.score === 'number' && data.score < SCORE_THRESHOLD) {
    return { success: false, score: data.score, reason: 'reCAPTCHA score too low.' }
  }

  return { success: true, score: data.score }
}
