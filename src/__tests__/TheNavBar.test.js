import { mount } from '@vue/test-utils'
import TheNavBar from 'components/TheNavBar.vue'

describe('TheNavBar.vue', () => {
  const i18nMock = {
    $t: (key) => {
      const messages = {
        'nav.mainNavigation': 'Main navigation',
        'nav.skipToContent': 'Skip to content',
        'nav.toggleNavigation': 'Toggle navigation',
        'nav.home': 'Home',
        'nav.projects': 'Projects',
        'nav.github': 'GitHub',
        'nav.linkedin': 'LinkedIn',
        'nav.githubAriaLabel': 'Visit GitHub profile',
        'nav.linkedinAriaLabel': 'Visit LinkedIn profile'
      }
      return messages[key] || key
    },
    $tm: (key) => key
  }

  const routerStubs = {
    'router-link': {
      template: '<a @click="$emit(\'click\')"><slot /></a>',
      props: ['to']
    }
  }

  function createWrapper() {
    return mount(TheNavBar, {
      global: {
        mocks: i18nMock,
        stubs: routerStubs
      }
    })
  }

  it('renders all navigation links', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('Projects')
    expect(wrapper.text()).toContain('GitHub')
    expect(wrapper.text()).toContain('LinkedIn')
  })

  it('renders skip to content link for accessibility', () => {
    const wrapper = createWrapper()
    const skipLink = wrapper.find('a[href="#main-content"]')
    expect(skipLink.exists()).toBe(true)
    expect(skipLink.text()).toBe('Skip to content')
  })

  it('toggles mobile navigation on button click', async () => {
    const wrapper = createWrapper()
    const toggler = wrapper.find('.navbar-toggler')

    expect(wrapper.find('.navbar-collapse').classes()).not.toContain('show')

    await toggler.trigger('click')
    expect(wrapper.find('.navbar-collapse').classes()).toContain('show')

    await toggler.trigger('click')
    expect(wrapper.find('.navbar-collapse').classes()).not.toContain('show')
  })

  it('closes navigation when a link is clicked', async () => {
    const wrapper = createWrapper()
    const toggler = wrapper.find('.navbar-toggler')

    // Open nav
    await toggler.trigger('click')
    expect(wrapper.find('.navbar-collapse').classes()).toContain('show')

    // Click a nav link
    const homeLink = wrapper.findAll('a').find(a => a.text() === 'Home')
    await homeLink.trigger('click')

    expect(wrapper.find('.navbar-collapse').classes()).not.toContain('show')
  })

  it('has correct aria-expanded attribute on toggler', async () => {
    const wrapper = createWrapper()
    const toggler = wrapper.find('.navbar-toggler')

    expect(toggler.attributes('aria-expanded')).toBe('false')

    await toggler.trigger('click')
    expect(toggler.attributes('aria-expanded')).toBe('true')
  })

  it('external links open in new tab with noopener', () => {
    const wrapper = createWrapper()
    const externalLinks = wrapper.findAll('a[target="_blank"]')

    expect(externalLinks.length).toBe(2)
    externalLinks.forEach(link => {
      expect(link.attributes('rel')).toBe('noopener')
    })
  })
})
