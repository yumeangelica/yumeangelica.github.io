import { reactive } from 'vue';

const state = reactive({
  messages: {}
});

/**
 * Resolve a dot-notation key from a nested object.
 */
function resolve(obj, path) {
  return path.split('.').reduce((o, k) => o?.[k], obj);
}

/**
 * Translate a message key with optional parameter interpolation.
 * @param {string} key - Dot-notation key (e.g. 'home.title')
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
 * Falls back to English if the requested locale fails.
 * @param {string} locale - Locale code (default: 'en')
 */
async function loadMessages(locale = 'en') {
  try {
    const response = await fetch(`/messages_${locale}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.messages = await response.json();
  } catch (error) {
    console.error(`[i18n] Failed to load messages for locale "${locale}":`, error);
    // If a non-English locale failed, try English as fallback
    if (locale !== 'en') {
      console.warn('[i18n] Falling back to English');
      try {
        const fallback = await fetch('/messages_en.json');
        if (fallback.ok) {
          state.messages = await fallback.json();
        }
      } catch {
        console.error('[i18n] Fallback to English also failed');
      }
    }
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
export { loadMessages, t, tm };
