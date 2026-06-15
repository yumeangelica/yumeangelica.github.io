import { mount } from '@vue/test-utils'
import TheHeaderPic from 'components/TheHeaderPic.vue'

describe('TheHeaderPic.vue', () => {
  it('renders a decorative banner hidden from assistive tech', () => {
    const wrapper = mount(TheHeaderPic)

    const headerPic = wrapper.get('.header-pic')

    // The banner is purely decorative, so it should be hidden from screen
    // readers and expose no img role or label.
    expect(headerPic.attributes('aria-hidden')).toBe('true')
    expect(headerPic.attributes('role')).toBeUndefined()
    expect(headerPic.attributes('aria-label')).toBeUndefined()
  })
})
