import { GraduationCap, MapPin, Sparkles, Code2 } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { PROFILE_PHOTO_SRC } from '@/data/social'

const QUICK_FACTS = [
  { icon: GraduationCap, label: 'Education', value: 'BS Software Engineering' },
  { icon: MapPin, label: 'Based in', value: 'Lahore, Pakistan' },
  { icon: Code2, label: 'Focus', value: 'Full-stack & QA automation' },
  { icon: Sparkles, label: 'Exploring', value: 'DevOps & Agentic AI' },
]

function About() {
  return (
    <section id="about" className="scroll-mt-20 py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="About Me"
          title="Engineering ideas into intelligent solutions"
          subtitle="A quick introduction to who I am and what I care about as an engineer."
        />

        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[minmax(0,1fr)_320px]">
          <Reveal className="flex flex-col gap-6" delay={0.05}>
            <p className="text-lg leading-relaxed text-text/90">
              I&apos;m a Software Engineering graduate from the University of
              Central Punjab with a builder&apos;s instinct for the full stack and
              a tester&apos;s instinct for what breaks it. I like shipping products
              end-to-end — from a React interface down to the API and database
              underneath — and I care just as much about proving the thing works
              as I do about building it.
            </p>
            <p className="text-lg leading-relaxed text-text/90">
              That combination pulled me into software testing and automation:
              writing Selenium and TestNG suites that catch regressions before
              users do. Lately I&apos;m extending that same instinct toward DevOps
              and agentic AI — automating the parts of the workflow, from CI/CD
              pipelines to AI-assisted tooling, that shouldn&apos;t need a human
              in the loop every time.
            </p>
            <p className="text-lg leading-relaxed text-text/90">
              Off the clock, I&apos;m usually deep in a side project, chasing down
              a flaky test, or reading up on whatever DevOps or AI tooling just
              shipped.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {QUICK_FACTS.map(({ icon: FactIcon, label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 rounded-md border border-border bg-surface/40 p-4"
                >
                  <FactIcon size={20} className="mt-0.5 shrink-0 text-secondary" aria-hidden="true" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
                    <p className="text-sm font-medium text-text">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15} className="flex justify-center md:justify-end">
            <Card hoverable={false} className="flex flex-col items-center gap-4 text-center">
              <Avatar
                src={PROFILE_PHOTO_SRC}
                alt="Asad Ali"
                initials="AA"
                size="md"
                float={false}
              />
              <div>
                <p className="font-heading font-semibold text-text">Asad Ali</p>
                <p className="text-sm text-muted">Software Engineer</p>
              </div>
            </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

export default About
