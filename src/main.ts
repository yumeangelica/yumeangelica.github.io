import { createApp } from 'vue'
import App from './App.vue'
import i18nPlugin, { loadMessages } from './i18n'
import router from './router'

import './main.css'

loadMessages().then(() => {
  const app = createApp(App)

  app.use(router)
  app.use(i18nPlugin)

  app.mount('#app')

  // GitHub Pages redirect hack for crawler-friendly SPAs
  const redirect = window.sessionStorage.getItem('redirect')
  window.sessionStorage.removeItem('redirect')
  if (redirect && redirect !== window.location.pathname) {
    router.isReady().then(() => router.replace(redirect))
  }
})
