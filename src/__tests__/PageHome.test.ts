import { mount } from '@vue/test-utils'
import PageHome from 'pages/PageHome.vue'
import { fetchData as fetchDataImport } from '../dataCache'

vi.mock('../dataCache', () => ({
  fetchData: vi.fn(),
}))

const fetchData = vi.mocked(fetchDataImport)

const i18nMocks = {
  $t: (key: string): string => {
    const messages: Record<string, string> = {
      'intro.title': 'Home',
      'common.loading': 'Loading...',
      'common.error': 'Failed to load data.',
      'common.externalLinkAriaLabel': '{label} (opens in new tab)',
      'techStack.title': 'Tech Stack',
      'intro.profileImageAlt': 'Profile picture',
      'journey.title': 'Journey',
      'certifications.title': 'Certifications',
      'yume.titleStart': 'Interesting',
      'yume.ariaLabel': 'Yume',
      'yume.word': 'Yume',
      'yume.tooltip': 'Dream',
      'yume.text': 'Fact',
      'drives.title': 'Drives',
      'contact.title': 'Contact',
      'contact.linkedinPrompt': 'email@example.dev',
      'contact.imageAlt': 'Contact image',
      'contact.githubPrompt': 'Social',
      'contact.visitLinkedin': 'Visit my LinkedIn profile',
      'contact.visitGithub': 'Visit my GitHub profile',
      'nav.github': 'GitHub',
      'nav.linkedin': 'LinkedIn',
    }
    return messages[key] || key
  },
  $tm: (key: string): Array<string | { text: string; url?: string }> => {
    if (key === 'journey.items') {
      return ['Milestone']
    }
    if (key === 'certifications.items') {
      return [{ text: 'Cert', url: 'https://example.dev/cert' }]
    }
    if (key === 'intro.segments') {
      return [{ text: 'Intro text' }]
    }
    if (key === 'drives.segments') {
      return [{ text: 'Drive text' }]
    }
    return []
  },
}

const flushPromises = (): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, 0))

describe('PageHome.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows error state when fetchData rejects and loading ends', async () => {
    fetchData.mockRejectedValueOnce(new Error('Network error'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = mount(PageHome, {
      global: {
        mocks: i18nMocks,
      },
    })

    await flushPromises()

    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    expect(wrapper.vm.loading).toBe(false)

    consoleSpy.mockRestore()
  })

  it('renders technology category headings and icons when fetchData resolves', async () => {
    fetchData.mockResolvedValueOnce({
      projects: [],
      technologies: [
        {
          category: 'Frontend',
          items: [
            { title: 'Vue.js', url: '/vue.svg' },
            { title: 'TypeScript', url: '/ts.svg' },
          ],
        },
        {
          category: 'Backend',
          items: [{ title: 'Node.js', url: '/node.svg' }],
        },
      ],
    })

    const wrapper = mount(PageHome, {
      global: {
        mocks: i18nMocks,
      },
    })

    await flushPromises()

    const headings = wrapper.findAll('h3').map((node) => node.text())
    expect(headings).toContain('Frontend')
    expect(headings).toContain('Backend')

    expect(wrapper.find('img[alt="Vue.js"]').exists()).toBe(true)
    expect(wrapper.find('img[alt="TypeScript"]').exists()).toBe(true)
    expect(wrapper.find('img[alt="Node.js"]').exists()).toBe(true)
  })

  it('renders contact social buttons as safe external links', async () => {
    fetchData.mockResolvedValueOnce({ projects: [], technologies: [] })

    const wrapper = mount(PageHome, {
      global: {
        mocks: i18nMocks,
      },
    })

    await flushPromises()

    const buttons = wrapper.findAll('.contact-button')
    expect(buttons.length).toBe(2)

    const linkedin = buttons.find((link) => link.text() === 'LinkedIn')
    expect(linkedin).toBeDefined()
    if (!linkedin) throw new Error('Expected the LinkedIn contact link')
    expect(linkedin.attributes('href')).toBe(
      'https://www.linkedin.com/in/yumeangelica/',
    )

    const github = buttons.find((link) => link.text() === 'GitHub')
    expect(github).toBeDefined()
    if (!github) throw new Error('Expected the GitHub contact link')
    expect(github.attributes('href')).toBe('https://github.com/yumeangelica')

    buttons.forEach((link) => {
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toBe('noopener')
    })
  })

  it("reserves layout space using the profile images' intrinsic dimensions", async () => {
    fetchData.mockResolvedValueOnce({ projects: [], technologies: [] })

    const wrapper = mount(PageHome, {
      global: {
        mocks: i18nMocks,
      },
    })

    await flushPromises()

    const profileImage = wrapper.find('.profilepic')
    expect(profileImage.attributes('width')).toBe('400')
    expect(profileImage.attributes('height')).toBe('500')

    const contactImage = wrapper.find('.contact-image')
    expect(contactImage.attributes('width')).toBe('8072')
    expect(contactImage.attributes('height')).toBe('767')
  })
})
