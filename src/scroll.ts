/**
 * Programmatic-scroll helpers that respect the user's reduced-motion
 * preference (WCAG 2.3.3). The global CSS `prefers-reduced-motion` rule
 * cannot override JavaScript `scrollTo`/`scrollIntoView({ behavior: 'smooth' })`,
 * so scroll call sites must pick their behavior explicitly.
 */

/**
 * Whether the user has asked the OS/browser to reduce motion.
 * @returns {boolean}
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Scroll behavior to use for programmatic scrolling: instant when the user
 * prefers reduced motion, smooth otherwise.
 * @returns {'auto' | 'smooth'}
 */
export function scrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? 'auto' : 'smooth'
}
