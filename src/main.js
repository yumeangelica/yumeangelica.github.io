import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';

const app = createApp(App)

app.use(router)

app.mount('#app')

// GitHub Pages redirect hack for crawler-friendly SPAs
const { redirect } = window.sessionStorage;
delete window.sessionStorage.redirect;
if (redirect && redirect !== window.location.pathname) {
  router.replace(redirect);
}
