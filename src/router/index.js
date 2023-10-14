import { createRouter, createWebHistory } from 'vue-router'
import PageHome from 'pages/PageHome.vue'
const PageProjects = () => import('pages/PageProjects.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PageHome
    },
    {
      path: '/projects',
      name: 'projects',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => PageProjects()
    }
  ]
})

export default router
