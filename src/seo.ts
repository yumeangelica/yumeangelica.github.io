const DEFAULT_TITLE = "Angelica's software development portfolio"
const DEFAULT_DESCRIPTION =
  'Early-career software developer portfolio featuring accessible Vue and Nuxt web applications, full-stack projects, Python automation, testing, delivery discipline, and security-aware development'
const SITE_ORIGIN = 'https://yumeangelica.github.io'

interface SeoMetaLike {
  title?: string
  description?: string
}

export interface SeoRouteLike {
  fullPath?: string
  meta?: {
    seo?: SeoMetaLike
  }
}

export type SeoTranslator = (key: string) => unknown

function getFallbackContent(): { title: string; description: string } {
  const descriptionTag = document.querySelector<HTMLMetaElement>(
    'meta[name="description"]',
  )

  return {
    title: document.title || DEFAULT_TITLE,
    description: descriptionTag?.getAttribute('content') || DEFAULT_DESCRIPTION,
  }
}

function resolveTranslatedValue(
  t: SeoTranslator | null | undefined,
  key: string | undefined,
  fallback: string,
): string {
  if (!key || typeof t !== 'function') return fallback

  const value = t(key)
  if (typeof value !== 'string' || !value.trim() || value === key) {
    return fallback
  }

  return value
}

function ensureMetaTag(
  selector: string,
  attributeName: 'name' | 'property',
  attributeValue: string,
): HTMLMetaElement {
  let element = document.head.querySelector<HTMLMetaElement>(selector)

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  element.setAttribute(attributeName, attributeValue)
  return element
}

function ensureLinkTag(rel: string): HTMLLinkElement {
  let element = document.head.querySelector<HTMLLinkElement>(
    `link[rel="${rel}"]`,
  )

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }

  return element
}

function resolveCanonicalUrl(route: SeoRouteLike | null | undefined): string {
  const path = route?.fullPath || '/'
  const normalized = path.startsWith('/') ? path : `/${path}`

  return `${SITE_ORIGIN}${normalized === '/' ? '/' : normalized}`
}

export function updateSeo(
  route: SeoRouteLike | null | undefined,
  t: SeoTranslator | null | undefined,
): void {
  const fallback = getFallbackContent()
  const seo = route?.meta?.seo

  const title = resolveTranslatedValue(t, seo?.title, fallback.title)
  const description = resolveTranslatedValue(
    t,
    seo?.description,
    fallback.description,
  )
  const canonicalUrl = resolveCanonicalUrl(route)

  document.title = title
  ensureMetaTag('meta[name="description"]', 'name', 'description').setAttribute(
    'content',
    description,
  )
  ensureMetaTag(
    'meta[property="og:title"]',
    'property',
    'og:title',
  ).setAttribute('content', title)
  ensureMetaTag(
    'meta[property="og:description"]',
    'property',
    'og:description',
  ).setAttribute('content', description)
  ensureMetaTag('meta[property="og:url"]', 'property', 'og:url').setAttribute(
    'content',
    canonicalUrl,
  )
  ensureMetaTag(
    'meta[name="twitter:title"]',
    'name',
    'twitter:title',
  ).setAttribute('content', title)
  ensureMetaTag(
    'meta[name="twitter:description"]',
    'name',
    'twitter:description',
  ).setAttribute('content', description)
  ensureLinkTag('canonical').setAttribute('href', canonicalUrl)
}
