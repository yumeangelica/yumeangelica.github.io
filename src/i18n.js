import { reactive } from 'vue';

const state = reactive({
  messages: {}
});

/** Locale loaded by default and used as the fallback source for other locales. */
const DEFAULT_LOCALE = 'en';

/**
 * Minimal English fallback used only when the primary message file cannot
 * be fetched, so the app renders readable text instead of raw dot-keys.
 * The full copy lives in /public/messages_en.json.
 */
const EN_FALLBACK = {
  app: { mainContentAriaLabel: 'Main site content' },
  common: {
    loading: 'Loading...',
    error: 'Something went wrong loading the content. Please try again later.'
  },
  seo: {
    home: { title: "Angelica's portfolio | Software development" },
    projects: { title: "Angelica's projects | Selected software development work" }
  },
  nav: {
    ariaLabel: 'Main navigation',
    skipToContent: 'Skip to main content',
    home: 'Home',
    projects: 'Projects',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    toggleAriaLabel: 'Toggle navigation'
  },
  footer: { copyright: '© 2020 - {year} yumeangelica.github.io. All Rights Reserved.' },
  intro: { title: 'Software Development Portfolio' }
};

/**
 * Resolve a dot-notation key from a nested object.
 */
function resolve(obj, path) {
  return path.split('.').reduce((o, k) => o?.[k], obj);
}

/**
 * Translate a message key with optional parameter interpolation.
 * @param {string} key - Dot-notation key (e.g. 'intro.title')
 * @param {Object} params - Variables to interpolate (e.g. { year: 2026 })
 * @returns {string} Translated string, or the key itself if not found
 */
function t(key, params = {}) {
  const value = resolve(state.messages, key);
  if (value === undefined) {
    console.warn(`[i18n] Missing translation key: "${key}"`);
    return key;
  }
  if (typeof value !== 'string') return value;
  return value.replace(/\{(\w+)\}/g, (_, name) =>
    params[name] !== undefined ? params[name] : `{${name}}`
  );
}

/**
 * Get raw message value (for arrays, objects, etc.).
 * @param {string} key - Dot-notation key
 * @returns {*} Raw message value
 */
function tm(key) {
  const value = resolve(state.messages, key);
  if (value === undefined) {
    console.warn(`[i18n] Missing translation key: "${key}"`);
    return key;
  }
  return value;
}

/**
 * Load messages from a locale JSON file in /public.
 * Falls back to the default locale if the requested locale fails.
 * @param {string} locale - Locale code (default: DEFAULT_LOCALE)
 */
async function loadMessages(locale = DEFAULT_LOCALE) {
  let loaded = false;

  try {
    const response = await fetch(`/messages_${locale}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.messages = await response.json();
    loaded = true;
  } catch (error) {
    console.error(`[i18n] Failed to load messages for locale "${locale}":`, error);
    // If a non-default locale failed, try the default locale file as fallback
    if (locale !== DEFAULT_LOCALE) {
      console.warn(`[i18n] Falling back to "${DEFAULT_LOCALE}"`);
      try {
        const fallback = await fetch(`/messages_${DEFAULT_LOCALE}.json`);
        if (fallback.ok) {
          state.messages = await fallback.json();
          loaded = true;
        }
      } catch {
        console.error(`[i18n] Fallback to "${DEFAULT_LOCALE}" also failed`);
      }
    }
  }

  // If no message file loaded (e.g. the default-locale file itself failed), seed a
  // minimal built-in fallback so the UI shows readable text instead of dot-keys.
  if (!loaded) {
    console.warn('[i18n] Using built-in English fallback messages');
    state.messages = EN_FALLBACK;
  }
}

/**
 * Vue plugin — registers $t() and $tm() globally.
 */
const i18nPlugin = {
  install(app) {
    app.config.globalProperties.$t = t;
    app.config.globalProperties.$tm = tm;
  }
};

export default i18nPlugin;
export { loadMessages, t, tm, EN_FALLBACK, DEFAULT_LOCALE };
