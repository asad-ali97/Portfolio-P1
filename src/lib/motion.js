/**
 * Shared Framer Motion primitives.
 *
 * Values mirror src/styles/tokens.css exactly — if the Animation Rules
 * file ever changes durations/easing, update BOTH places together.
 * Never hardcode a duration or ease curve inline in a component;
 * import it from here instead.
 */

// cubic-bezier(0.16, 1, 0.3, 1) — smooth deceleration, no bounce
export const EASE_PREMIUM = [0.16, 1, 0.3, 1]

export const DURATION = {
  hover: 0.2, // 200ms
  fade: 0.3, // 300ms
  page: 0.5, // 500ms
}

export const CARD_LIFT_PX = 8
export const PARALLAX_MAX_PX = 15

/** Fade + rise on scroll into view. The default "reveal" for section content. */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.page, ease: EASE_PREMIUM },
  },
}

/** Plain fade, for elements where vertical motion would be distracting. */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.fade, ease: EASE_PREMIUM },
  },
}

/** Stagger container — pairs with fadeUp/fadeIn children. */
export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
})

/** Route-level page transition. */
export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.page, ease: EASE_PREMIUM },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: DURATION.fade, ease: EASE_PREMIUM },
  },
}

/** Card hover lift — use as `whileHover={cardHover}` on glass cards. */
export const cardHover = {
  y: -CARD_LIFT_PX,
  transition: { duration: DURATION.hover, ease: EASE_PREMIUM },
}

/** Standard viewport config so scroll-reveals don't re-trigger on every scroll. */
export const revealViewport = { once: true, margin: '-80px' }
