import { prisma } from './_lib/prisma.js'
import { Resend } from 'resend'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function parseBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return req.body
}

function validate(body) {
  const errors = {}
  const name = String(body?.name || '').trim()
  const email = String(body?.email || '').trim()
  const subject = String(body?.subject || '').trim()
  const message = String(body?.message || '').trim()

  if (!name) errors.name = 'Name is required.'
  if (!email) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!subject) errors.subject = 'Subject is required.'
  if (!message) {
    errors.message = 'Message is required.'
  } else if (message.length < 10) {
    errors.message = 'Message should be at least 10 characters.'
  } else if (message.length > 5000) {
    errors.message = 'Message is too long (max 5000 characters).'
  }

  return { errors, values: { name, email, subject, message } }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function sendContactAlert(values) {
  const resendApiKey = process.env.RESEND_API_KEY
  const alertTo = process.env.CONTACT_ALERT_EMAIL

  if (!resendApiKey || !alertTo) {
    const missing = [
      !resendApiKey && 'RESEND_API_KEY',
      !alertTo && 'CONTACT_ALERT_EMAIL',
    ]
      .filter(Boolean)
      .join(', ')
    throw new Error(
      `Email is not configured on the server (missing ${missing}). Check Vercel Environment Variables.`
    )
  }

  const resend = new Resend(resendApiKey)
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>',
    to: alertTo,
    replyTo: values.email,
    subject: `New contact query: ${values.subject}`,
    html: `
      <h2>New Contact Us submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(values.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(values.email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(values.subject)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(values.message).replace(/\n/g, '<br/>')}</p>
      <hr />
      <p style="color:#94A3B8;font-size:12px;">Submitted ${new Date().toLocaleString()}</p>
    `,
  })

  // Resend v6 returns { data, error } instead of always throwing.
  if (error) {
    console.error('[api/contact] Resend returned an error:', error)
    throw new Error(
      error.message ||
        'Could not send the notification email. Check RESEND_API_KEY, RESEND_FROM_EMAIL, and CONTACT_ALERT_EMAIL.'
    )
  }

  return data
}

/**
 * POST /api/contact
 * Body: { name, email, subject, message }
 *
 * Order: email alert first (so admins are notified even if DB is down),
 * then persist to Supabase via Prisma with status default "pending".
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!process.env.DATABASE_URL) {
    console.error('[api/contact] DATABASE_URL is not set')
    return res.status(500).json({
      error:
        'Database is not configured on the server (missing DATABASE_URL). Add it in Vercel → Settings → Environment Variables.',
    })
  }

  const { errors, values } = validate(parseBody(req))
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Validation failed.', fieldErrors: errors })
  }

  // 1) Email first — this is the primary notification path.
  try {
    await sendContactAlert(values)
  } catch (err) {
    console.error('[api/contact] Email alert failed:', err)
    return res.status(500).json({
      error: err.message || 'Could not send your message. Please try again.',
    })
  }

  // 2) Then save to the database. Email already succeeded, so a DB
  // failure must not undo the user's successful send — return 201 and
  // log the persistence error for the admin to fix env/migrations.
  let contactId = null
  try {
    const contact = await prisma.contact.create({ data: values })
    contactId = contact.id
  } catch (err) {
    console.error('[api/contact] Email sent, but failed to save contact:', err)
    return res.status(201).json({
      success: true,
      id: null,
      warning:
        'Message emailed successfully, but could not be saved to the database. Check DATABASE_URL / DIRECT_URL and that migrations have been applied.',
    })
  }

  return res.status(201).json({ success: true, id: contactId })
}
