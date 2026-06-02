import { createRouter, createWebHistory } from 'vue-router'
import PageHome from 'pages/PageHome.vue'
const PageProjects = () => import('pages/PageProjects.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        seo: {
          title: 'seo.home.title',
          description: 'seo.home.description'
        }
      },
      component: PageHome
    },
    {
      path: '/projects',
      name: 'projects',
      meta: {
        seo: {
          title: 'seo.projects.title',
          description: 'seo.projects.description'
        }
      },
      /*
       Route-level code-splitting.
       This generates a separate chunk (About.[hash].js) for this route,
       which is lazy-loaded when the route is visited.
      */
      component: PageProjects
    }
  ]
})

export default router
