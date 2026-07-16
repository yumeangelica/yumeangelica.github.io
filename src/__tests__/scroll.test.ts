import { prefersReducedMotion, scrollBehavior } from '../scroll'

function createMatchMedia(matches: boolean): typeof window.matchMedia {
  return vi.fn(
    (query: string): MediaQueryList => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn<MediaQueryList['addListener']>(),
      removeListener: vi.fn<MediaQueryList['removeListener']>(),
      addEventListener: vi.fn<MediaQueryList['addEventListener']>(),
      removeEventListener: vi.fn<MediaQueryList['removeEventListener']>(),
      dispatchEvent: vi.fn<MediaQueryList['dispatchEvent']>(() => true),
    }),
  )
}

describe('scroll helpers', () => {
  const originalMatchMedia = window.matchMedia

  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: originalMatchMedia,
    })
  })

  it('reports no reduced-motion preference when matchMedia is unavailable (e.g. jsdom)', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: undefined,
    })
    expect(prefersReducedMotion()).toBe(false)
    expect(scrollBehavior()).toBe('smooth')
  })

  it('uses smooth scrolling when the user has not requested reduced motion', () => {
    window.matchMedia = createMatchMedia(false)
    expect(prefersReducedMotion()).toBe(false)
    expect(scrollBehavior()).toBe('smooth')
  })

  it('uses instant scrolling when the user prefers reduced motion', () => {
    window.matchMedia = createMatchMedia(true)
    expect(prefersReducedMotion()).toBe(true)
    expect(scrollBehavior()).toBe('auto')
    expect(window.matchMedia).toHaveBeenCalledWith(
      '(prefers-reduced-motion: reduce)',
    )
  })
})
