import PropTypes from 'prop-types'
import { ExternalLink } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import Card from '@/components/ui/Card'
import Icon from '@/components/ui/Icon'
import { GithubIcon } from '@/components/ui/icons'
import { PROJECTS } from '@/data/projects'

function ProjectCard({ project, delay }) {
  const { title, description, tech, githubUrl, demoUrl, icon } = project

  return (
    <Reveal delay={delay} className="h-full">
      <Card hoverable className="flex h-full flex-col gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-md bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
          <Icon name={icon} size={26} />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <h3 className="font-heading text-lg font-semibold text-text">{title}</h3>
          <p className="text-sm leading-relaxed text-muted">{description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tech.map((item) => (
            <span
              key={item}
              className="rounded-full border border-border-strong px-3 py-1 font-mono text-xs text-secondary"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-2">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-text transition-colors duration-200 hover:text-primary"
            >
              <GithubIcon size={16} />
              Code
            </a>
          )}
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-text transition-colors duration-200 hover:text-secondary"
            >
              <ExternalLink size={16} aria-hidden="true" />
              Live Demo
            </a>
          )}
        </div>
      </Card>
    </Reveal>
  )
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    tech: PropTypes.arrayOf(PropTypes.string).isRequired,
    githubUrl: PropTypes.string,
    demoUrl: PropTypes.string,
    icon: PropTypes.string.isRequired,
  }).isRequired,
  delay: PropTypes.number,
}

function Projects() {
  return (
    <section id="projects" className="scroll-mt-20 py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Projects"
          title="Selected work"
          subtitle="A mix of full-stack products, mobile apps, and the test automation / DevOps tooling I build alongside them."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} delay={(index % 3) * 0.08} />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Projects
