import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { updateSeo } from '../seo'

vi.mock('../seo', () => ({
  updateSeo: vi.fn()
}))

describe('App.vue', () => {
  const i18nMock = {
    $t: (key) => {
      const messages = {
        'app.mainContentLabel': 'Main content'
      }
      return messages[key] || key
    }
  }

  const stubs = {
    TheHeaderPic: {
      template: '<div data-test="header-pic" />'
    },
    TheNavBar: {
      template: '<nav data-test="nav-bar" />'
    },
    TheFooter: {
      template: '<footer data-test="footer" />'
    },
    TheBackToTop: {
      template: '<div data-test="back-to-top" />'
    },
    RouterView: {
      template: '<div data-test="router-view" />'
    }
  }

  it('renders main content label and layout components', () => {
    const wrapper = mount(App, {
      global: {
        mocks: {
          ...i18nMock,
          $route: { name: 'home' }
        },
        stubs
      }
    })

    const main = wrapper.find('main[role="main"]')
    expect(main.exists()).toBe(true)
    expect(main.attributes('aria-label')).toBe('Main content')

    expect(wrapper.find('[data-test="header-pic"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-bar"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="footer"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="back-to-top"]').exists()).toBe(true)
  })

  it('updates SEO on mount and when the route changes', async () => {
    const wrapper = mount(App, {
      global: {
        mocks: {
          ...i18nMock,
          $route: { name: 'home' }
        },
        stubs
      }
    })

    expect(updateSeo).toHaveBeenCalled()

    await wrapper.vm.$nextTick()
    updateSeo.mockClear()
    wrapper.vm.$options.watch.$route.call(wrapper.vm)

    expect(updateSeo).toHaveBeenCalledTimes(1)
  })
})
