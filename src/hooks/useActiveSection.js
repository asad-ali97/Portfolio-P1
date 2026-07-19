import { useEffect, useState } from 'react'
import { NAV_HEIGHT } from '@/data/navigation'

/**
 * Tracks which section id is currently most in view, for nav
 * active-state highlighting. Uses IntersectionObserver (cheap, no
 * scroll-event math) with a rootMargin that biases toward the section
 * sitting just under the sticky navbar.
 *
 * @param {string[]} sectionIds
 * @param {number} navHeight - pixels of sticky navbar to offset for
 */
export function useActiveSection(sectionIds, navHeight = NAV_HEIGHT) {
  const [activeId, setActiveId] = useState(sectionIds[0])

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (elements.length === 0) return undefined

    function updateActiveSection() {
      let currentId = sectionIds[0]
      let currentTop = Number.NEGATIVE_INFINITY

      for (const element of elements) {
        const top = element.getBoundingClientRect().top
        if (top <= navHeight + 1 && top > currentTop) {
          currentId = element.id
          currentTop = top
        }
      }

      if (currentId !== activeId) {
        setActiveId(currentId)
      }
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [sectionIds, navHeight, activeId])

  return activeId
}
