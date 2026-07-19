import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Container from '@/components/ui/Container'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import { NAV_HEIGHT, NAV_LINKS } from '@/data/navigation'
import { DURATION, EASE_PREMIUM } from '@/lib/motion'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useLenisContext } from '@/lib/LenisContext'

const SECTION_IDS = NAV_LINKS.map((link) => link.id)

/**
 * Sticky, glassmorphic single-page navigation. Every link smooth-
 * scrolls to its section (via Lenis) and highlights itself when that
 * section is in view, instead of routing between pages.
 */
function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const activeId = useActiveSection(SECTION_IDS, NAV_HEIGHT)
  const { scrollToSection } = useLenisContext()

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  function goTo(id) {
    setIsOpen(false)
    scrollToSection(id)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="glass-nav border-b border-border">
        <Container className="flex h-18 items-center justify-between py-4">
          <button type="button" onClick={() => goTo('hero')} className="cursor-pointer">
            <Logo />
          </button>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                const isActive = activeId === link.id
                return (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => goTo(link.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className={`relative py-2 text-sm font-medium transition-colors duration-200 ${
                        isActive ? 'text-text' : 'text-muted hover:text-text'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-indicator"
                          className="absolute -bottom-0.5 left-0 right-0 h-px bg-secondary"
                          transition={{ duration: DURATION.hover, ease: EASE_PREMIUM }}
                        />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="hidden md:block">
            <Button variant="primary" size="md" onClick={() => goTo('contact')}>
              Let&apos;s talk
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-text md:hidden"
          >
            {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </Container>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Primary"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: DURATION.fade, ease: EASE_PREMIUM }}
            className="glass-nav border-t border-border md:hidden overflow-hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => {
                const isActive = activeId === link.id
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => goTo(link.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`rounded-md px-3 py-3 text-left text-base font-medium transition-colors ${
                      isActive ? 'bg-surface text-text' : 'text-muted hover:text-text'
                    }`}
                  >
                    {link.label}
                  </button>
                )
              })}
              <div className="mt-2">
                <Button variant="primary" size="md" className="w-full" onClick={() => goTo('contact')}>
                  Let&apos;s talk
                </Button>
              </div>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
