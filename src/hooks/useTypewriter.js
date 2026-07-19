import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

const TYPE_SPEED_MS = 55
const DELETE_SPEED_MS = 30
const HOLD_MS = 1400

/**
 * Cycles through `words`, typing and deleting each one. If the user
 * prefers reduced motion, skips the animation entirely and just shows
 * the first word statically.
 *
 * @param {string[]} words
 */
export function useTypewriter(words) {
  const prefersReducedMotion = useReducedMotion()
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState(prefersReducedMotion ? words[0] : '')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion) return undefined

    const currentWord = words[wordIndex % words.length]
    let timeoutId

    if (!isDeleting && text === currentWord) {
      timeoutId = setTimeout(() => setIsDeleting(true), HOLD_MS)
    } else if (isDeleting && text === '') {
      // Deferred (not called synchronously in the effect body) so this
      // doesn't trigger a same-tick cascading re-render.
      timeoutId = setTimeout(() => {
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % words.length)
      }, 0)
    } else {
      const nextLength = isDeleting ? text.length - 1 : text.length + 1
      timeoutId = setTimeout(
        () => setText(currentWord.slice(0, nextLength)),
        isDeleting ? DELETE_SPEED_MS : TYPE_SPEED_MS
      )
    }

    return () => clearTimeout(timeoutId)
  }, [text, isDeleting, wordIndex, words, prefersReducedMotion])

  return prefersReducedMotion ? words[0] : text
}
