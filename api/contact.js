import { prisma } from './_lib/prisma.js'
import { Resend } from 'resend'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

/**
 * POST /api/contact
 * Body: { name, email, subject, message }
 *
 * Task 4: saves the submission to Supabase (via Prisma), status
 * defaults to "pending".
 * Task 5: sends a Resend email alert to the admin on every new query,
 * with server-side validation and safe error handling (a Resend
 * failure never blocks the submission from being saved).
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const { errors, values } = validate(req.body)
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Validation failed.', fieldErrors: errors })
  }

  let contact
  try {
    contact = await prisma.contact.create({ data: values })
  } catch (err) {
    console.error('[api/contact] Failed to save contact:', err)
    return res.status(500).json({ error: 'Could not save your message. Please try again.' })
  }

  // Email alert — failures here must NOT fail the request; the
  // submission is already safely saved in the database.
  const resendApiKey = process.env.RESEND_API_KEY
  const alertTo = process.env.CONTACT_ALERT_EMAIL

  if (resendApiKey && alertTo) {
    try {
      const resend = new Resend(resendApiKey)
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>',
        to: alertTo,
        subject: `New contact query: ${values.subject}`,
        html: `
          <h2>New Contact Us submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(values.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(values.email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(values.subject)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(values.message).replace(/\n/g, '<br/>')}</p>
          <hr />
          <p style="color:#94A3B8;font-size:12px;">Submitted ${new Date(contact.createdAt).toLocaleString()}</p>
        `,
      })
    } catch (err) {
      console.error('[api/contact] Resend email failed (submission still saved):', err)
    }
  } else {
    console.warn('[api/contact] RESEND_API_KEY / CONTACT_ALERT_EMAIL not set — skipping email alert.')
  }

  return res.status(201).json({ success: true, id: contact.id })
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
