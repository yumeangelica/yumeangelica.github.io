import router from '../router'

describe('router', () => {
  it('includes home and projects routes', () => {
    const routes = router.getRoutes()

    const homeRoute = routes.find((route) => route.path === '/')
    const projectsRoute = routes.find((route) => route.path === '/projects')

    expect(homeRoute?.name).toBe('home')
    expect(projectsRoute?.name).toBe('projects')
  })
})
