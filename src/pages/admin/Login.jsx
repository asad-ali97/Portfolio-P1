import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, Loader2, Lock } from 'lucide-react'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import { useAdminAuth } from '@/lib/AdminAuthContext'
import { useRecaptcha } from '@/hooks/useRecaptcha'
import { fadeUp } from '@/lib/motion'

function AdminLogin() {
  const [values, setValues] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAdminAuth()
  const { getToken } = useRecaptcha()
  const navigate = useNavigate()

  function handleChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!values.email.trim() || !values.password) {
      setError('Please enter both email and password.')
      return
    }

    setIsSubmitting(true)
    try {
      const recaptchaToken = await getToken('login')
      await login(values.email.trim(), values.password, recaptchaToken)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <Container className="flex max-w-md justify-center px-0">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="w-full">
          <Card hoverable={false} className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Lock size={22} aria-hidden="true" />
              </div>
              <h1 className="font-heading text-xl font-semibold text-text">Admin Login</h1>
              <p className="text-sm text-muted">Sign in to manage contact queries.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <FormField
                id="admin-email"
                name="email"
                type="email"
                label="Email"
                value={values.email}
                onChange={handleChange}
                autoComplete="username"
                placeholder="admin@example.com"
              />
              <FormField
                id="admin-password"
                name="password"
                type="password"
                label="Password"
                value={values.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="••••••••"
              />

              {error && (
                <p role="alert" className="flex items-center gap-2 text-sm text-primary">
                  <AlertCircle size={16} aria-hidden="true" />
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                icon={isSubmitting ? <Loader2 size={18} className="animate-spin" /> : undefined}
                className="w-full"
              >
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </Button>

              <p className="text-center text-xs text-muted">
                Protected by reCAPTCHA v3. Access is limited to a single seeded admin account.
              </p>
            </form>
          </Card>
        </motion.div>
      </Container>
    </div>
  )
}

export default AdminLogin
