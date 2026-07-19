import { CalendarDays, GraduationCap, MapPin } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import Card from '@/components/ui/Card'
import { EDUCATION } from '@/data/education'

function Education() {
  return (
    <section id="education" className="scroll-mt-20 bg-surface/30 py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow="Education" title="Academic background" />

        <div className="flex flex-col gap-6">
          {EDUCATION.map((entry, index) => (
            <Reveal key={entry.id} delay={index * 0.08}>
              <Card hoverable className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-secondary/10 text-secondary">
                  <GraduationCap size={24} aria-hidden="true" />
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-text">
                      {entry.degree}
                    </h3>
                    <p className="text-primary">{entry.institution}</p>
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

                  <ul className="flex flex-col gap-1.5">
                    {entry.highlights.map((point) => (
                      <li key={point} className="flex gap-2 text-sm leading-relaxed text-text/90">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Education
