import { Briefcase, CalendarDays, MapPin } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import Card from '@/components/ui/Card'
import { EXPERIENCE } from '@/data/experience'

function Experience() {
  return (
    <section id="experience" className="scroll-mt-20 py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Experience"
          title="Where I've worked"
          subtitle="Internship, freelance, and on-campus experience that shaped how I build and test software."
        />

        <div className="relative flex flex-col gap-8">
          {/* Timeline spine — desktop only */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[19px] top-2 hidden w-px bg-border md:block"
          />

          {EXPERIENCE.map((entry, index) => (
            <Reveal key={entry.id} delay={(index % 3) * 0.08} className="relative md:pl-14">
              <div
                aria-hidden="true"
                className="absolute left-2.5 top-2 hidden h-4 w-4 -translate-x-1/2 rounded-full border-2 border-secondary bg-background md:block"
              />

              <Card hoverable={false} className="flex flex-col gap-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-text">
                      {entry.role}
                    </h3>
                    <p className="flex items-center gap-1.5 text-sm text-primary">
                      <Briefcase size={14} aria-hidden="true" />
                      {entry.company}
                    </p>
                  </div>
                  <span className="rounded-full border border-border-strong px-3 py-1 font-mono text-xs text-muted">
                    {entry.type}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} aria-hidden="true" />
                    {entry.period}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} aria-hidden="true" />
                    {entry.location}
                  </span>
                </div>

                <ul className="flex flex-col gap-2">
                  {entry.points.map((point) => (
                    <li key={point} className="flex gap-2 text-sm leading-relaxed text-text/90">
                      <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-secondary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Experience
