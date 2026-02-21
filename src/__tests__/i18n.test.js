import { t, tm, loadMessages } from '../i18n'

// Inject test messages directly via loadMessages mock
beforeEach(() => {
  // Mock fetch to return test messages
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        nav: { home: 'Home', projects: 'Projects' },
        footer: { copyright: '© {year} Angelica' },
        home: {
          title: 'Welcome',
          journeyItems: ['University', 'Self-study']
        }
      })
    })
  )
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('i18n', () => {
  describe('loadMessages and t()', () => {
    it('loads messages and translates a simple key', async () => {
      await loadMessages('en')
      expect(t('nav.home')).toBe('Home')
    })

    it('returns the key itself for missing translations', async () => {
      await loadMessages('en')
      expect(t('nonexistent.key')).toBe('nonexistent.key')
    })

    it('interpolates parameters in translation strings', async () => {
      await loadMessages('en')
      expect(t('footer.copyright', { year: 2026 })).toBe('© 2026 Angelica')
    })

    it('keeps placeholder when parameter is not provided', async () => {
      await loadMessages('en')
      expect(t('footer.copyright')).toBe('© {year} Angelica')
    })
  })

  describe('tm()', () => {
    it('returns raw array values', async () => {
      await loadMessages('en')
      const items = tm('home.journeyItems')
      expect(Array.isArray(items)).toBe(true)
      expect(items).toHaveLength(2)
      expect(items[0]).toBe('University')
    })

    it('returns the key for missing translations', async () => {
      await loadMessages('en')
      expect(tm('missing.key')).toBe('missing.key')
    })
  })

  describe('loadMessages fallback', () => {
    it('falls back to English when non-English locale fails', async () => {
      let callCount = 0
      global.fetch = vi.fn(() => {
        callCount++
        if (callCount === 1) {
          // First call (non-English) fails
          return Promise.resolve({ ok: false, status: 404 })
        }
        // Second call (English fallback) succeeds
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ nav: { home: 'Home' } })
        })
      })

      await loadMessages('fi')
      expect(t('nav.home')).toBe('Home')
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })
  })
})
