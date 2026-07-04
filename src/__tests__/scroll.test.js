import { prefersReducedMotion, scrollBehavior } from '../scroll'

describe('scroll helpers', () => {
  const originalMatchMedia = window.matchMedia

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('reports no reduced-motion preference when matchMedia is unavailable (e.g. jsdom)', () => {
    // jsdom does not implement matchMedia; the helper must guard against it.
    delete window.matchMedia
    expect(prefersReducedMotion()).toBe(false)
    expect(scrollBehavior()).toBe('smooth')
  })

  it('uses smooth scrolling when the user has not requested reduced motion', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false })
    expect(prefersReducedMotion()).toBe(false)
    expect(scrollBehavior()).toBe('smooth')
  })

  it('uses instant scrolling when the user prefers reduced motion', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true })
    expect(prefersReducedMotion()).toBe(true)
    expect(scrollBehavior()).toBe('auto')
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })
})
