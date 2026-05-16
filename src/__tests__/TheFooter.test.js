import { mount } from '@vue/test-utils'
import TheFooter from 'components/TheFooter.vue'

describe('TheFooter.vue', () => {
  const i18nMock = {
    $t: (key, params) => {
      if (key === 'footer.ariaLabel') {
        return 'Site footer'
      }
      if (key === 'footer.copyright') {
        return `Copyright ${params.year}`
      }
      return key
    }
  }

  it('renders footer role, aria label, and current year', () => {
    const wrapper = mount(TheFooter, {
      global: {
        mocks: i18nMock
      }
    })

    const footer = wrapper.get('footer')
    const currentYear = new Date().getFullYear()

    expect(footer.attributes('role')).toBe('contentinfo')
    expect(footer.attributes('aria-label')).toBe('Site footer')
    expect(footer.text()).toContain(String(currentYear))
  })
})
