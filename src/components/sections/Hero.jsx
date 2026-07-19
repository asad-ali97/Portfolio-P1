import { lazy, Suspense } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, Download, Mail } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import { useTypewriter } from '@/hooks/useTypewriter'
import { useLenisContext } from '@/lib/LenisContext'
import { fadeUp, staggerContainer, EASE_PREMIUM } from '@/lib/motion'
import { SOCIAL_LINKS, PROFILE_PHOTO_SRC } from '@/data/social'

// three.js is the heaviest dependency in the project — load it only
// when the Hero actually mounts, in its own chunk, per
// 11_performance.md ("Optimize 3D", "Lazy load heavy assets").
const HeroScene = lazy(() => import('@/components/three/HeroScene'))

const ROLES = [
  'Software Engineer',
  'Full-Stack Developer',
  'QA Automation Engineer',
  'DevOps & AI Automation Enthusiast',
]

function Hero() {
  const typedRole = useTypewriter(ROLES)
  const prefersReducedMotion = useReducedMotion()
  const { scrollToSection } = useLenisContext()

  return (
    <section
      id="hero"
      className="relative flex min-h-screen scroll-mt-20 items-center overflow-hidden pt-24 pb-16"
    >
      {/* Ambient background glow — decorative, purely CSS */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-secondary/15 blur-[120px]"
      />

      <Container className="relative grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.12, 0.1)}
          className="order-2 flex flex-col items-start gap-6 md:order-1"
        >
          <motion.span
            variants={fadeUp}
            className="rounded-full border border-border-strong px-4 py-1.5 font-mono text-xs text-secondary"
          >
            Available for opportunities
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="font-heading text-4xl font-semibold leading-tight text-text sm:text-5xl lg:text-6xl"
          >
            Hi, I&apos;m Asad Ali
          </motion.h1>

          <motion.div
            variants={fadeUp}
            className="flex h-9 items-center font-mono text-lg text-primary sm:text-xl"
          >
            <span>{typedRole}</span>
            <span aria-hidden="true" className="ml-1 inline-block h-6 w-[2px] animate-pulse bg-primary" />
          </motion.div>

          <motion.p variants={fadeUp} className="max-w-lg text-balance text-muted">
            I engineer ideas into intelligent solutions — building full-stack web
            products, automating quality with test frameworks, and exploring
            where DevOps meets agentic AI.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowDown size={18} />}
              onClick={() => scrollToSection('projects')}
            >
              View Projects
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={<Mail size={18} />}
              onClick={() => scrollToSection('contact')}
            >
              Contact Me
            </Button>
            <Button variant="ghost" size="lg" href={SOCIAL_LINKS.resumeUrl} icon={<Download size={16} />}>
              Resume
            </Button>
          </motion.div>
        </motion.div>

        <div className="order-1 flex items-center justify-center md:order-2">
          <div className="relative flex h-[320px] w-[320px] items-center justify-center sm:h-[400px] sm:w-[400px]">
            <div className="absolute inset-0">
              <Suspense fallback={null}>
                <HeroScene reducedMotion={Boolean(prefersReducedMotion)} />
              </Suspense>
            </div>
            <Avatar
              src={PROFILE_PHOTO_SRC}
              alt="Asad Ali"
              initials="AA"
              size="lg"
            />
          </div>
        </div>
      </Container>

      <motion.button
        type="button"
        onClick={() => scrollToSection('about')}
        aria-label="Scroll to About section"
        animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: EASE_PREMIUM }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-muted transition-colors hover:text-text sm:block"
      >
        <ArrowDown size={22} aria-hidden="true" />
      </motion.button>
    </section>
  )
}

export default Hero
