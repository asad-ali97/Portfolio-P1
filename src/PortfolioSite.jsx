import Layout from '@/components/layout/Layout'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Experience from '@/components/sections/Experience'
import Education from '@/components/sections/Education'
import Contact from '@/components/sections/Contact'

/**
 * The public, single-page portfolio (Hero → About → Skills → Projects
 * → Experience → Education → Contact → Footer). Everything under
 * /admin/* is a separate, routed application — see App.jsx.
 */
function PortfolioSite() {
  return (
    <Layout>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Contact />
    </Layout>
  )
}

export default PortfolioSite
