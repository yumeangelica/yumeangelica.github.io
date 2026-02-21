
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18nPlugin, { loadMessages } from './i18n'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import './main.css'

loadMessages('en').then(() => {
  const app = createApp(App)

  app.use(router)
  app.use(i18nPlugin)

  app.mount('#app')

  // GitHub Pages redirect hack for crawler-friendly SPAs
  const { redirect } = window.sessionStorage;
  delete window.sessionStorage.redirect;
  if (redirect && redirect !== window.location.pathname) {
    router.replace(redirect);
  }
})
