import type { Plugin } from 'vue'
import { reactive } from 'vue'

export type MessageValue = string | MessageRecord | MessageValue[]

export interface MessageRecord {
  [key: string]: MessageValue
}

export type TranslationParams = Readonly<Record<string, string | number>>

export type TextTranslator = (key: string, params?: TranslationParams) => string

export interface MessageSegment {
  text: string
  type?: 'highlight' | 'emphasis'
}

export interface CertificationMessage {
  text: string
  url: string
}

export interface RawTranslator {
  (key: 'intro.segments' | 'drives.segments'): MessageSegment[]
  (key: 'journey.items'): string[]
  (key: 'certifications.items'): CertificationMessage[]
  (key: string): MessageValue
}

const state = reactive<{ messages: MessageRecord }>({
  messages: {},
})

/** Locale loaded by default and used as the fallback source for other locales. */
const DEFAULT_LOCALE = 'en'

/**
 * Minimal English fallback used only when the primary message file cannot
 * be fetched, so the app renders readable text instead of raw dot-keys.
 * The full copy lives in /public/messages_en.json.
 */
const EN_FALLBACK = {
  app: { mainContentAriaLabel: 'Main site content' },
  common: {
    loading: 'Loading...',
    error: 'Something went wrong loading the content. Please try again later.',
  },
  seo: {
    home: { title: "Angelica's portfolio | Software development" },
    projects: {
      title: "Angelica's projects | Selected software development work",
    },
  },
  nav: {
    ariaLabel: 'Main navigation',
    skipToContent: 'Skip to main content',
    home: 'Home',
    projects: 'Projects',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    toggleAriaLabel: 'Toggle navigation',
  },
  footer: {
    copyright: '© 2020 - {year} yumeangelica.github.io. All Rights Reserved.',
  },
  intro: { title: 'Software Development Portfolio' },
} satisfies MessageRecord

function isMessageRecord(
  value: MessageValue | undefined,
): value is MessageRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Resolve a dot-notation key from a nested object. */
function resolve(
  messages: MessageRecord,
  path: string,
): MessageValue | undefined {
  let current: MessageValue | undefined = messages

  for (const key of path.split('.')) {
    if (Array.isArray(current)) {
      const index = Number(key)
      if (!Number.isInteger(index) || index < 0) return undefined
      current = current[index]
      continue
    }
    if (!isMessageRecord(current)) return undefined
    current = current[key]
  }

  return current
}

/** Translate a message key with optional parameter interpolation. */
function t(key: string, params: TranslationParams = {}): MessageValue {
  const value = resolve(state.messages, key)
  if (value === undefined) {
    console.warn(`[i18n] Missing translation key: "${key}"`)
    return key
  }
  if (typeof value !== 'string') return value

  return value.replace(/\{(\w+)\}/g, (_match, name: string) => {
    const replacement = params[name]
    return replacement === undefined ? `{${name}}` : String(replacement)
  })
}

/** Get a raw message value (for arrays, objects, etc.). */
function tm(key: string): MessageValue {
  const value = resolve(state.messages, key)
  if (value === undefined) {
    console.warn(`[i18n] Missing translation key: "${key}"`)
    return key
  }
  return value
}

const translateText: TextTranslator = (key, params) => {
  const value = t(key, params)
  return typeof value === 'string' ? value : key
}

function translateRaw(
  key: 'intro.segments' | 'drives.segments',
): MessageSegment[]
function translateRaw(key: 'journey.items'): string[]
function translateRaw(key: 'certifications.items'): CertificationMessage[]
function translateRaw(key: string): MessageValue
function translateRaw(key: string): unknown {
  return tm(key)
}

function parseMessages(response: Response): Promise<MessageRecord> {
  const messagesPromise: Promise<unknown> = response.json()
  return messagesPromise as Promise<MessageRecord>
}

/** Load messages from a locale JSON file in /public. */
async function loadMessages(locale = DEFAULT_LOCALE): Promise<void> {
  let loaded = false

  try {
    const response = await fetch(`/messages_${locale}.json`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    state.messages = await parseMessages(response)
    loaded = true
  } catch (error: unknown) {
    console.error(
      `[i18n] Failed to load messages for locale "${locale}":`,
      error,
    )
    if (locale !== DEFAULT_LOCALE) {
      console.warn(`[i18n] Falling back to "${DEFAULT_LOCALE}"`)
      try {
        const fallback = await fetch(`/messages_${DEFAULT_LOCALE}.json`)
        if (fallback.ok) {
          state.messages = await parseMessages(fallback)
          loaded = true
        }
      } catch {
        console.error(`[i18n] Fallback to "${DEFAULT_LOCALE}" also failed`)
      }
    }
  }

  if (!loaded) {
    console.warn('[i18n] Using built-in English fallback messages')
    state.messages = EN_FALLBACK
  }
}

/** Vue plugin — registers $t() and $tm() globally. */
const i18nPlugin = {
  install(app) {
    app.config.globalProperties.$t = translateText
    app.config.globalProperties.$tm = translateRaw
  },
} satisfies Plugin

export default i18nPlugin
export { DEFAULT_LOCALE, EN_FALLBACK, loadMessages, t, tm }
