import { mount } from '@vue/test-utils'
import PageHome from 'pages/PageHome.vue'
import { fetchData } from '../dataCache.js'

vi.mock('../dataCache.js', () => ({
  fetchData: vi.fn()
}))

const i18nMocks = {
  $t: (key) => {
    const messages = {
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
      'contact.visitGithub': 'Visit my GitHub profile'
    }
    return messages[key] || key
  },
  $tm: (key) => {
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
  }
}

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0))

describe('PageHome.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows error state when fetchData rejects and loading ends', async () => {
    fetchData.mockRejectedValueOnce(new Error('Network error'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

    const wrapper = mount(PageHome, {
      global: {
        mocks: i18nMocks
      }
    })

    await flushPromises()

    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    expect(wrapper.vm.loading).toBe(false)

    consoleSpy.mockRestore()
  })

  it('renders technology category headings and icons when fetchData resolves', async () => {
    fetchData.mockResolvedValueOnce({
      technologies: [
        {
          category: 'Frontend',
          items: [
            { title: 'Vue.js', url: '/vue.svg' },
            { title: 'TypeScript', url: '/ts.svg' }
          ]
        },
        {
          category: 'Backend',
          items: [
            { title: 'Node.js', url: '/node.svg' }
          ]
        }
      ]
    })

    const wrapper = mount(PageHome, {
      global: {
        mocks: i18nMocks
      }
    })

    await flushPromises()

    const headings = wrapper.findAll('h3').map(node => node.text())
    expect(headings).toContain('Frontend')
    expect(headings).toContain('Backend')

    expect(wrapper.find('img[alt="Vue.js"]').exists()).toBe(true)
    expect(wrapper.find('img[alt="TypeScript"]').exists()).toBe(true)
    expect(wrapper.find('img[alt="Node.js"]').exists()).toBe(true)
  })
})
