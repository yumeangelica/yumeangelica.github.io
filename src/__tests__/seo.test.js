import { updateSeo } from '../seo'

describe('seo helper', () => {
  const originalTitle = document.title
  const originalHead = document.head.innerHTML

  beforeEach(() => {
    document.title = originalTitle
    document.head.innerHTML = ''
    document.head.innerHTML = originalHead
  })

  afterEach(() => {
    document.title = originalTitle
    document.head.innerHTML = originalHead
    vi.restoreAllMocks()
  })

  it('updates document title and SEO meta tags from translated route metadata', () => {
    const t = vi.fn((key) => {
      const messages = {
        'seo.home.title': 'Home title',
        'seo.home.description': 'Home description'
      }

      return messages[key]
    })

    updateSeo(
      {
        meta: {
          seo: {
            title: 'seo.home.title',
            description: 'seo.home.description'
          }
        }
      },
      t
    )

    expect(document.title).toBe('Home title')
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Home description')
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe('Home title')
    expect(document.querySelector('meta[property="og:description"]')?.getAttribute('content')).toBe('Home description')
  })

  it('falls back to existing defaults when SEO metadata or translations are missing', () => {
    document.title = 'Current default title'
    const descriptionTag = document.createElement('meta')
    descriptionTag.setAttribute('name', 'description')
    descriptionTag.setAttribute('content', 'Current default description')
    document.head.appendChild(descriptionTag)

    const t = vi.fn((key) => key)

    updateSeo({}, t)

    expect(document.title).toBe('Current default title')
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Current default description')
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe('Current default title')
    expect(document.querySelector('meta[property="og:description"]')?.getAttribute('content')).toBe('Current default description')
  })
})