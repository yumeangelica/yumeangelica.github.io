import { mount } from '@vue/test-utils'
import TheHeaderPic from 'components/TheHeaderPic.vue'

describe('TheHeaderPic.vue', () => {
  const i18nMock = {
    $t: (key) => {
      if (key === 'header.bannerAriaLabel') {
        return 'Profile banner'
      }
      return key
    }
  }

  it('renders image role and aria label', () => {
    const wrapper = mount(TheHeaderPic, {
      global: {
        mocks: i18nMock
      }
    })

    const headerPic = wrapper.get('.header-pic')

    expect(headerPic.attributes('role')).toBe('img')
    expect(headerPic.attributes('aria-label')).toBe('Profile banner')
  })
})
