import { Link } from 'react-router-dom'
import { Mail, Shield } from 'lucide-react'
import Container from '@/components/ui/Container'
import Logo from '@/components/ui/Logo'
import { GithubIcon, LinkedinIcon } from '@/components/ui/icons'
import { NAV_LINKS } from '@/data/navigation'
import { SOCIAL_LINKS } from '@/data/social'
import { useLenisContext } from '@/lib/LenisContext'

const SOCIAL_ITEMS = [
  { label: 'GitHub', href: SOCIAL_LINKS.github, Icon: GithubIcon },
  { label: 'LinkedIn', href: SOCIAL_LINKS.linkedin, Icon: LinkedinIcon },
  { label: 'Email', href: `mailto:${SOCIAL_LINKS.email}`, Icon: Mail },
]

function Footer() {
  const year = new Date().getFullYear()
  const { scrollToSection } = useLenisContext()

  return (
    <footer className="glass-nav border-t border-border">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-3">
          <button type="button" onClick={() => scrollToSection('hero')}>
            <Logo />
          </button>
          <p className="max-w-xs text-sm text-muted">
            Engineering ideas into intelligent solutions.
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-4">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollToSection(link.id)}
              className="text-left text-sm text-muted transition-colors duration-200 hover:text-text"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {SOCIAL_ITEMS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={label === 'Email' ? undefined : '_blank'}
              rel={label === 'Email' ? undefined : 'noopener noreferrer'}
              aria-label={label}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-strong
                text-muted transition-colors duration-200 hover:border-secondary hover:text-secondary"
            >
              <Icon size={18} aria-hidden="true" />
            </a>
          ))}
        </div>
      </Container>

      <Container className="flex flex-col items-center justify-between gap-3 border-t border-border py-6 sm:flex-row">
        <p className="text-center text-xs text-muted sm:text-left">
          © {year} Asad Ali. All rights reserved.
        </p>
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-1.5 text-xs text-muted/70 transition-colors duration-200 hover:text-muted"
          aria-label="Admin login"
        >
          <Shield size={12} aria-hidden="true" />
          Admin
        </Link>
      </Container>
    </footer>
  )
}

export default Footer
