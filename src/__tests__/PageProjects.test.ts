import { mount } from '@vue/test-utils'
import PageProjects from 'pages/PageProjects.vue'
import { nextTick } from 'vue'
import { fetchData as fetchDataImport } from '../dataCache'
import type { PortfolioData, PortfolioProject } from '../types/portfolio'

vi.mock('../dataCache', () => ({
  fetchData: vi.fn(),
}))

const fetchData = vi.mocked(fetchDataImport)

const identityI18n = (key: string): string => key

const i18nMocks = {
  $t: identityI18n,
  $tm: identityI18n,
}

const flushPromises = (): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, 0))

function makeProject(
  overrides: Partial<PortfolioProject> = {},
): PortfolioProject {
  return {
    title: 'Project',
    type: 'frontend',
    isMain: false,
    imageURL: '/assets/projects/project.webp',
    imageWidth: 1000,
    imageHeight: 515,
    technologyTitles: [],
    additionalInfo: [],
    links: [],
    ...overrides,
  }
}

describe('PageProjects.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetchData.mockResolvedValue({
      technologies: [],
      projects: [],
    })
  })

  it('resets selected filters when toggleTypeFilter(null) and toggleTechFilter(null) are called', async () => {
    const wrapper = mount(PageProjects, {
      global: {
        mocks: i18nMocks,
        stubs: {
          TheProjectCard: true,
        },
      },
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
          TheProjectCard: true,
        },
      },
    })

    await flushPromises()

    const projects = [
      makeProject({
        title: 'Frontend Match',
        type: 'frontend',
        technologyTitles: ['Vue.js', 'TypeScript'],
      }),
      makeProject({
        title: 'Frontend Partial',
        type: 'frontend',
        technologyTitles: ['Vue.js'],
      }),
      makeProject({
        title: 'Backend Match',
        type: 'backend',
        technologyTitles: ['Vue.js', 'TypeScript'],
      }),
    ]

    wrapper.vm.selectedTypes = ['frontend']
    wrapper.vm.selectedTech = ['Vue.js', 'TypeScript']

    const filtered = wrapper.vm.filterProjects(projects)

    expect(filtered).toHaveLength(1)
    expect(filtered[0]?.title).toBe('Frontend Match')
  })

  it('toggles the technology filter panel', async () => {
    const wrapper = mount(PageProjects, {
      global: {
        mocks: i18nMocks,
        stubs: {
          TheProjectCard: true,
        },
      },
    })

    await flushPromises()

    const toggle = wrapper.find('.filter-panel-toggle')

    expect(wrapper.vm.isTechFiltersOpen).toBe(false)

    await toggle.trigger('click')
    expect(wrapper.vm.isTechFiltersOpen).toBe(true)

    await toggle.trigger('click')
    expect(wrapper.vm.isTechFiltersOpen).toBe(false)
  })

  it('shows floating nav and closes menu after throttled scroll', async () => {
    Object.defineProperty(window, 'scrollY', {
      value: 250,
      writable: true,
      configurable: true,
    })

    const wrapper = mount(PageProjects, {
      global: {
        mocks: i18nMocks,
        stubs: {
          TheProjectCard: true,
        },
      },
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
    const scrollToSpy = vi
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => {})
    const wrapper = mount(PageProjects, {
      global: {
        mocks: i18nMocks,
        stubs: {
          TheProjectCard: true,
        },
      },
    })

    await flushPromises()

    wrapper.vm.isFloatingMenuOpen = true
    wrapper.vm.scrollToSection('back-to-top')

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    })
    expect(wrapper.vm.isFloatingMenuOpen).toBe(false)

    scrollToSpy.mockRestore()
  })

  it('scrolls to a section and closes floating menu when the section exists', async () => {
    const wrapper = mount(PageProjects, {
      global: {
        mocks: i18nMocks,
        stubs: {
          TheProjectCard: true,
        },
      },
    })

    await flushPromises()

    const section = document.createElement('div')
    section.id = 'frontend-projects'
    section.scrollIntoView = vi.fn()
    document.body.appendChild(section)

    wrapper.vm.isFloatingMenuOpen = true
    wrapper.vm.scrollToSection('frontend-projects')

    expect(section.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })
    expect(wrapper.vm.isFloatingMenuOpen).toBe(false)

    section.remove()
  })

  it('defaults to empty data when fetchData resolves with missing fields', async () => {
    fetchData.mockResolvedValueOnce({} as PortfolioData)
    const wrapper = mount(PageProjects, {
      global: {
        mocks: i18nMocks,
        stubs: {
          TheProjectCard: true,
        },
      },
    })

    await flushPromises()

    expect(wrapper.vm.allProjects).toEqual([])
    expect(wrapper.vm.technologies).toEqual([])
  })
})
