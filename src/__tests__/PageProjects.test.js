import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import PageProjects from 'pages/PageProjects.vue'
import { fetchData } from '../dataCache.js'

vi.mock('../dataCache.js', () => ({
  fetchData: vi.fn()
}))

const i18nMocks = {
  $t: (key) => key,
  $tm: (key) => key
}

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0))

describe('PageProjects.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetchData.mockResolvedValue({
      technologies: [],
      projects: []
    })
  })

  it('resets selected filters when toggleTypeFilter(null) and toggleTechFilter(null) are called', async () => {
    const wrapper = mount(PageProjects, {
      global: {
        mocks: i18nMocks,
        stubs: {
          TheProjectCard: true
        }
      }
    })

    await flushPromises()

    wrapper.vm.selectedTypes = ['frontend']
    wrapper.vm.selectedTech = ['Vue.js']

    wrapper.vm.toggleTypeFilter(null)
    wrapper.vm.toggleTechFilter(null)

    expect(wrapper.vm.selectedTypes).toEqual([])
    expect(wrapper.vm.selectedTech).toEqual([])
  })

  it('filters projects by selected type and technology', async () => {
    const wrapper = mount(PageProjects, {
      global: {
        mocks: i18nMocks,
        stubs: {
          TheProjectCard: true
        }
      }
    })

    await flushPromises()

    const projects = [
      { title: 'Frontend Match', type: 'frontend', technologyTitles: ['Vue.js', 'TypeScript'] },
      { title: 'Frontend Partial', type: 'frontend', technologyTitles: ['Vue.js'] },
      { title: 'Backend Match', type: 'backend', technologyTitles: ['Vue.js', 'TypeScript'] }
    ]

    wrapper.vm.selectedTypes = ['frontend']
    wrapper.vm.selectedTech = ['Vue.js', 'TypeScript']

    const filtered = wrapper.vm.filterProjects(projects)

    expect(filtered).toHaveLength(1)
    expect(filtered[0].title).toBe('Frontend Match')
  })

  it('shows floating nav and closes menu after throttled scroll', async () => {
    Object.defineProperty(window, 'scrollY', {
      value: 250,
      writable: true,
      configurable: true
    })

    const wrapper = mount(PageProjects, {
      global: {
        mocks: i18nMocks,
        stubs: {
          TheProjectCard: true
        }
      }
    })

    await flushPromises()

    vi.useFakeTimers()
    wrapper.vm.isFloatingMenuOpen = true
    window.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(16)
    await nextTick()

    expect(wrapper.vm.showFloatingNav).toBe(true)
    expect(wrapper.vm.isFloatingMenuOpen).toBe(false)

    vi.useRealTimers()
  })

  it('scrolls to top and closes floating menu for back-to-top', async () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => { })
    const wrapper = mount(PageProjects, {
      global: {
        mocks: i18nMocks,
        stubs: {
          TheProjectCard: true
        }
      }
    })

    await flushPromises()

    wrapper.vm.isFloatingMenuOpen = true
    wrapper.vm.scrollToSection('back-to-top')

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    })
    expect(wrapper.vm.isFloatingMenuOpen).toBe(false)

    scrollToSpy.mockRestore()
  })

  it('scrolls to a section and closes floating menu when the section exists', async () => {
    const wrapper = mount(PageProjects, {
      global: {
        mocks: i18nMocks,
        stubs: {
          TheProjectCard: true
        }
      }
    })

    await flushPromises()

    const section = document.createElement('div')
    section.id = 'frontend-projects'
    section.scrollIntoView = vi.fn()
    document.body.appendChild(section)

    wrapper.vm.isFloatingMenuOpen = true
    wrapper.vm.scrollToSection('frontend-projects')

    expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    expect(wrapper.vm.isFloatingMenuOpen).toBe(false)

    section.remove()
  })

  it('defaults to empty data when fetchData resolves with missing fields', async () => {
    fetchData.mockResolvedValueOnce({})
    const wrapper = mount(PageProjects, {
      global: {
        mocks: i18nMocks,
        stubs: {
          TheProjectCard: true
        }
      }
    })

    await flushPromises()

    expect(wrapper.vm.allProjects).toEqual([])
    expect(wrapper.vm.technologies).toEqual([])
  })
})
