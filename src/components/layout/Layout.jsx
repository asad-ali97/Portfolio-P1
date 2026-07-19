import PropTypes from 'prop-types'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SkipLink from '@/components/ui/SkipLink'

/**
 * App shell for the single-page layout: skip link, sticky Navbar,
 * the section content passed in as children, then Footer.
 */
function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background text-text">
      <SkipLink />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
