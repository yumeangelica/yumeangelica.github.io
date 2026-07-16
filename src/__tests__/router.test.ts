import router from '../router'

describe('router', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('includes home and projects routes', () => {
    const routes = router.getRoutes()

    const homeRoute = routes.find((route) => route.path === '/')
    const projectsRoute = routes.find((route) => route.path === '/projects')

    expect(homeRoute?.name).toBe('home')
    expect(projectsRoute?.name).toBe('projects')
    expect(homeRoute?.meta).toMatchObject({
      seo: {
        title: 'seo.home.title',
        description: 'seo.home.description',
      },
    })
    expect(projectsRoute?.meta).toMatchObject({
      seo: {
        title: 'seo.projects.title',
        description: 'seo.projects.description',
      },
    })
  })

  it('redirects unknown paths to home', async () => {
    await router.push('/this-route-does-not-exist')

    expect(router.currentRoute.value.name).toBe('home')
    expect(router.currentRoute.value.path).toBe('/')
  })
})
