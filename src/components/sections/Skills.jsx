import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import Card from '@/components/ui/Card'
import Icon from '@/components/ui/Icon'
import { SKILL_CATEGORIES } from '@/data/skills'
import { DURATION, EASE_PREMIUM, revealViewport } from '@/lib/motion'

/** Single skill row: icon, name, and an animated proficiency bar. */
function SkillBar({
  name,
  level,
  icon,
  barClassName = 'from-primary to-secondary',
  glowClassName = 'from-primary/60 to-secondary/60',
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon name={icon} size={16} className="text-secondary" />
          <span className="text-sm font-medium text-text">{name}</span>
        </div>
        <span className="font-mono text-xs text-muted">{level}%</span>
      </div>
      <div className="relative h-1.5 w-full rounded-full bg-surface overflow-visible">
        <motion.div
          className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r blur-[8px] opacity-60 ${glowClassName}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={revealViewport}
          transition={{ duration: DURATION.page, ease: EASE_PREMIUM }}
        />
        <motion.div
          className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${barClassName}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={revealViewport}
          transition={{ duration: DURATION.page, ease: EASE_PREMIUM }}
        />
      </div>
    </div>
  )
}

SkillBar.propTypes = {
  name: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
  barClassName: PropTypes.string,
  glowClassName: PropTypes.string,
}

function Skills() {
  return (
    <section id="skills" className="scroll-mt-20 bg-surface/30 py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Skills"
          title="Technical toolbox"
          subtitle="Languages, frameworks, and tools I use to design, build, test, and ship software."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SKILL_CATEGORIES.map((category, index) => (
            <Reveal key={category.id} delay={(index % 3) * 0.08}>
              <Card hoverable className="flex h-full flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-md ${category.accentIconClass ?? 'bg-primary/10 text-primary'}`}
                  >
                    <Icon name={category.icon} size={20} />
                  </div>
                  <h3 className="font-heading text-base font-semibold text-text">
                    {category.label}
                  </h3>
                </div>

                <div className="flex flex-col gap-4">
                  {category.skills.map((skill) => (
                    <SkillBar
                      key={skill.name}
                      {...skill}
                      barClassName={category.accentBarClass}
                      glowClassName={category.accentGlowClass}
                    />
                  ))}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Skills
