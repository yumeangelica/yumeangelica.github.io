import { loadMessages, t, tm } from '../i18n'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

beforeEach(() => {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
    jsonResponse({
      nav: { home: 'Home', projects: 'Projects' },
      footer: { copyright: '© {year} Angelica' },
      home: {
        title: 'Welcome',
        journeyItems: ['University', 'Self-study'],
      },
    }),
  )
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
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

    it('returns non-string values unchanged', async () => {
      await loadMessages('en')
      expect(t('home')).toEqual({
        title: 'Welcome',
        journeyItems: ['University', 'Self-study'],
      })
    })
  })

  describe('tm()', () => {
    it('returns raw array values', async () => {
      await loadMessages('en')
      const items = tm('home.journeyItems')
      expect(Array.isArray(items)).toBe(true)
      if (!Array.isArray(items)) throw new Error('Expected an array message')
      expect(items).toHaveLength(2)
      expect(items[0]).toBe('University')
    })

    it('returns the key for missing translations', async () => {
      await loadMessages('en')
      expect(tm('missing.key')).toBe('missing.key')
    })
  })

  describe('loadMessages fallback', () => {
    it('uses built-in English fallback when the primary load fails', async () => {
      vi.stubGlobal(
        'fetch',
        vi
          .fn<typeof fetch>()
          .mockResolvedValue(new Response(null, { status: 500 })),
      )

      await loadMessages('en')
      expect(t('intro.title')).toBe('Software Development Portfolio')
      expect(t('nav.home')).toBe('Home')
    })

    it('falls back to English when non-English locale fails', async () => {
      const fetchMock = vi
        .fn<typeof fetch>()
        .mockResolvedValueOnce(new Response(null, { status: 404 }))
        .mockResolvedValueOnce(jsonResponse({ nav: { home: 'Home' } }))
      vi.stubGlobal('fetch', fetchMock)

      await loadMessages('fi')
      expect(t('nav.home')).toBe('Home')
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })
  })
})
