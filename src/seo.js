const DEFAULT_TITLE = "Angelica's fullstack web development portfolio"
const DEFAULT_DESCRIPTION = "Angelica's fullstack web development portfolio - Vue.js, React, Python projects"

function getFallbackContent() {
  const descriptionTag = document.querySelector('meta[name="description"]')

  return {
    title: document.title || DEFAULT_TITLE,
    description: descriptionTag?.getAttribute('content') || DEFAULT_DESCRIPTION
  }
}

function resolveTranslatedValue(t, key, fallback) {
  if (!key || typeof t !== 'function') {
    return fallback
  }

  const value = t(key)

  if (typeof value !== 'string' || !value.trim() || value === key) {
    return fallback
  }

  return value
}

function ensureMetaTag(selector, attributeName, attributeValue) {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  element.setAttribute(attributeName, attributeValue)

  return element
}

export function updateSeo(route, t) {
  const fallback = getFallbackContent()
  const seo = route?.meta?.seo || {}

  const title = resolveTranslatedValue(t, seo.title, fallback.title)
  const description = resolveTranslatedValue(t, seo.description, fallback.description)

  document.title = title
  ensureMetaTag('meta[name="description"]', 'name', 'description').setAttribute('content', description)
  ensureMetaTag('meta[property="og:title"]', 'property', 'og:title').setAttribute('content', title)
  ensureMetaTag('meta[property="og:description"]', 'property', 'og:description').setAttribute('content', description)
}
