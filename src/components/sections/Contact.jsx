import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Download, Loader2, Mail, MapPin, Send } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import { GithubIcon, LinkedinIcon } from '@/components/ui/icons'
import { useContactForm } from '@/hooks/useContactForm'
import { SOCIAL_LINKS } from '@/data/social'
import { DURATION, EASE_PREMIUM } from '@/lib/motion'

const CONTACT_LINKS = [
  { label: 'Email', value: SOCIAL_LINKS.email, href: `mailto:${SOCIAL_LINKS.email}`, Icon: Mail },
  { label: 'GitHub', value: 'asad-ali-dev', href: SOCIAL_LINKS.github, Icon: GithubIcon },
  { label: 'LinkedIn', value: 'asad-ali-dev', href: SOCIAL_LINKS.linkedin, Icon: LinkedinIcon },
]

function Contact() {
  const { values, errors, status, serverError, handleChange, handleSubmit, reset } = useContactForm()
  const isSubmitting = status === 'submitting'

  return (
    <section id="contact" className="scroll-mt-20 py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something together"
          subtitle="Have a role, a project, or just want to talk shop? My inbox is open."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[320px_minmax(0,1fr)]">
          <Reveal className="flex flex-col gap-4">
            <Card hoverable={false} className="flex flex-col gap-5">
              <div className="flex items-center gap-2 text-sm text-muted">
                <MapPin size={16} className="text-secondary" aria-hidden="true" />
                Based in Lahore, Pakistan &middot; open to remote
              </div>

              <div className="flex flex-col gap-3">
                {CONTACT_LINKS.map(({ label, value, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={label === 'Email' ? undefined : '_blank'}
                    rel={label === 'Email' ? undefined : 'noopener noreferrer'}
                    className="flex items-center gap-3 rounded-md border border-border p-3 text-sm transition-colors duration-200 hover:border-secondary hover:text-secondary"
                  >
                    <Icon size={18} aria-hidden="true" />
                    <span className="flex flex-col">
                      <span className="text-xs text-muted">{label}</span>
                      <span className="font-medium text-text">{value}</span>
                    </span>
                  </a>
                ))}
              </div>

              <Button
                variant="secondary"
                href={SOCIAL_LINKS.resumeUrl}
                icon={<Download size={16} />}
                className="w-full"
              >
                Download Resume
              </Button>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <Card hoverable={false} className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DURATION.fade, ease: EASE_PREMIUM }}
                    className="flex flex-col items-center gap-4 py-12 text-center"
                  >
                    <CheckCircle2 size={40} className="text-secondary" aria-hidden="true" />
                    <div>
                      <p className="font-heading text-lg font-semibold text-text">
                        Message sent
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        Thanks for reaching out — I&apos;ll get back to you soon.
                      </p>
                    </div>
                    <Button variant="ghost" onClick={reset}>
                      Send another message
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DURATION.fade, ease: EASE_PREMIUM }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col gap-5"
                  >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <FormField
                        id="contact-name"
                        name="name"
                        label="Name"
                        value={values.name}
                        onChange={handleChange}
                        error={errors.name}
                        autoComplete="name"
                        placeholder="Jane Doe"
                      />
                      <FormField
                        id="contact-email"
                        name="email"
                        type="email"
                        label="Email"
                        value={values.email}
                        onChange={handleChange}
                        error={errors.email}
                        autoComplete="email"
                        placeholder="jane@company.com"
                      />
                    </div>

                    <FormField
                      id="contact-subject"
                      name="subject"
                      label="Subject"
                      value={values.subject}
                      onChange={handleChange}
                      error={errors.subject}
                      placeholder="Let's talk about..."
                    />

                    <FormField
                      as="textarea"
                      id="contact-message"
                      name="message"
                      label="Message"
                      value={values.message}
                      onChange={handleChange}
                      error={errors.message}
                      placeholder="Tell me a bit about what you have in mind."
                    />

                    {status === 'error' && (
                      <p role="alert" className="flex items-center gap-2 text-sm text-primary">
                        <AlertCircle size={16} aria-hidden="true" />
                        {serverError || 'Something went wrong sending that — please try again, or email me directly.'}
                      </p>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                      icon={
                        isSubmitting ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Send size={16} />
                        )
                      }
                      className="self-start"
                    >
                      {isSubmitting ? 'Sending…' : 'Send Message'}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

export default Contact
