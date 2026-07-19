import { useState } from 'react'
import { apiFetch } from '@/lib/api'

const EMPTY_FORM = { name: '', email: '', subject: '', message: '' }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  if (!values.email.trim()) {
    errors.email = 'Please enter your email.'
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = 'That email address doesn\u2019t look right.'
  }
  if (!values.subject.trim()) errors.subject = 'Please add a subject.'
  if (!values.message.trim()) {
    errors.message = 'Please write a message.'
  } else if (values.message.trim().length < 10) {
    errors.message = 'Message should be at least 10 characters.'
  }
  return errors
}

/**
 * Owns Contact form state, client-side validation, and submission —
 * kept separate from Contact.jsx's markup per
 * 05_project_architecture.md ("Keep business logic separate from UI").
 *
 * Submits to /api/contact, which does its own server-side validation,
 * saves to Supabase via Prisma, and sends a Resend email alert
 * (Task 4 & 5 of the internship task doc). Client-side validation
 * here is purely for UX — the server never trusts it.
 *
 * Status values: 'idle' | 'submitting' | 'success' | 'error'.
 */
export function useContactForm() {
  const [values, setValues] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [serverError, setServerError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('submitting')
    setServerError('')

    try {
      await apiFetch('/api/contact', { method: 'POST', body: values })
      setStatus('success')
      setValues(EMPTY_FORM)
    } catch (error) {
      console.error('Contact form submission failed:', error)
      setServerError(error.message)
      setStatus('error')
    }
  }

  function reset() {
    setStatus('idle')
  }

  return { values, errors, status, serverError, handleChange, handleSubmit, reset }
}
