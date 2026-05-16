import { mount } from '@vue/test-utils'
import PageHome from 'pages/PageHome.vue'
import { fetchData } from '../dataCache.js'

vi.mock('../dataCache.js', () => ({
  fetchData: vi.fn()
}))

const i18nMocks = {
  $t: (key) => {
    const messages = {
      'home.title': 'Home',
      'home.loading': 'Loading...',
      'home.error': 'Failed to load data.',
      'home.techStackTitle': 'Tech Stack',
      'home.profilePicAlt': 'Profile picture',
      'home.introHtml': 'Intro text',
      'home.journeyTitle': 'Journey',
      'home.certificationsTitle': 'Certifications',
      'home.interestingFactTitleStart': 'Interesting',
      'home.yumeAriaLabel': 'Yume',
      'home.yumeWord': 'Yume',
      'home.yumeTooltip': 'Dream',
      'home.interestingFactText': 'Fact',
      'home.drivesTitle': 'Drives',
      'home.drivesTextHtml': 'Drive text',
      'home.contactTitle': 'Contact',
      'home.contactEmail': 'email@example.dev',
      'home.contactImageAlt': 'Contact image',
      'home.contactSocial': 'Social',
      'home.linkedinAriaLabel': 'LinkedIn',
      'home.linkedinAlt': 'LinkedIn logo',
      'home.githubAriaLabel': 'GitHub',
      'home.githubAlt': 'GitHub logo'
    }
    return messages[key] || key
  },
  $tm: (key) => {
    if (key === 'home.journeyItems') {
      return ['Milestone']
    }
    if (key === 'home.certifications') {
      return [{ text: 'Cert', url: 'https://example.dev/cert' }]
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
