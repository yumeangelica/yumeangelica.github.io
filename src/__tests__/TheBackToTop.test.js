import { mount } from '@vue/test-utils'
import TheBackToTop from 'components/TheBackToTop.vue'

describe('TheBackToTop.vue', () => {
  const i18nMock = {
    $t: (key) => {
      const messages = {
        'backToTop.ariaLabel': 'Back to top',
        'backToTop.title': 'Back to top'
      }
      return messages[key] || key
    }
  }

  const setScrollY = (value) => {
    Object.defineProperty(window, 'scrollY', {
      value,
      configurable: true
    })
  }

  it('toggles visibility when scrolling past 300px', async () => {
    vi.useFakeTimers()
    const wrapper = mount(TheBackToTop, {
      global: {
        mocks: i18nMock
      }
    })

    expect(wrapper.find('button.back-to-top').exists()).toBe(false)

    setScrollY(350)
    window.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(16)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('button.back-to-top').exists()).toBe(true)

    setScrollY(0)
    window.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(16)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('button.back-to-top').exists()).toBe(false)

    wrapper.unmount()
    vi.useRealTimers()
  })

  it('scrolls to top on click', async () => {
    vi.useFakeTimers()
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => { })
    const wrapper = mount(TheBackToTop, {
      global: {
        mocks: i18nMock
      }
    })

    setScrollY(350)
    window.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(16)
    await wrapper.vm.$nextTick()

    const button = wrapper.find('button.back-to-top')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    })

    scrollToSpy.mockRestore()
    wrapper.unmount()
    vi.useRealTimers()
  })
})
