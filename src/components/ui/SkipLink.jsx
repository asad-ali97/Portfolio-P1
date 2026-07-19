/**
 * "Skip to content" link — visually hidden until focused, lets
 * keyboard users bypass the navbar. Required for WCAG 2.4.1
 * (Bypass Blocks). Rendered once, at the very top of the DOM.
 */
function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]
        focus:rounded-md focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-medium
        focus:text-background"
    >
      Skip to content
    </a>
  )
}

export default SkipLink
