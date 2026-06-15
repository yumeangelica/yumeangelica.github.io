import { mount } from '@vue/test-utils'
import TheProjectCard from 'components/TheProjectCard.vue'

describe('TheProjectCard.vue', () => {
  const mockProject = {
    title: 'Vue Portfolio',
    imageURL: 'https://assets.example.dev/image.jpg',
    imageWidth: 1000,
    imageHeight: 515,
    technologyTitles: ['Vue', 'CSS Framework'],
    additionalInfo: ['Responsive design', 'Dark mode supported'],
    links: [
      { text: 'GitHub', url: 'https://example.dev/github' },
      { text: 'Live Demo', url: 'https://example.dev/live' }
    ]
  }

  const mockTechnologies = [
    { title: 'Vue', url: 'https://cdn.example.dev/vue.svg' },
    { title: 'CSS Framework', url: 'https://cdn.example.dev/css-framework.svg' }
  ]

  it('renders project title, image, technologies, additional info and links', () => {
    const wrapper = mount(TheProjectCard, {
      props: {
        project: mockProject,
        technologies: mockTechnologies
      },
      global: {
        mocks: {
          $t: (key, params = {}) => {
            const messages = {
              'projectCard.technologiesLabel': 'Technologies used',
              'projectCard.linkAriaLabel': `Visit ${params.linkText} for ${params.projectTitle} (opens in new tab)`
            };
            return messages[key] || key;
          },
          $tm: (key) => key
        }
      }
    })

    // Project title
    expect(wrapper.text()).toContain(mockProject.title)

    // Project image
    const img = wrapper.find(`img[alt="${mockProject.title}"]`)
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(mockProject.imageURL)
    // Intrinsic dimensions are bound so the browser can reserve space (CLS).
    expect(img.attributes('width')).toBe(String(mockProject.imageWidth))
    expect(img.attributes('height')).toBe(String(mockProject.imageHeight))

    // Technology icons
    mockProject.technologyTitles.forEach(techName => {
      expect(wrapper.find(`img[alt="${techName}"]`).exists()).toBe(true)
    })

    // Additional info
    mockProject.additionalInfo.forEach(info => {
      expect(wrapper.text()).toContain(info)
    })

    // Project links
    mockProject.links.forEach(link => {
      const linkElement = wrapper.find(`a[href="${link.url}"]`)
      expect(linkElement.exists()).toBe(true)
      expect(linkElement.text()).toBe(link.text)
      expect(linkElement.attributes('aria-label')).toMatch(
        new RegExp(`visit ${link.text} for ${mockProject.title}`, 'i')
      )
    })
  })

  it('does not render an icon for unknown technology titles', () => {
    const wrapper = mount(TheProjectCard, {
      props: {
        project: {
          ...mockProject,
          technologyTitles: ['Vue', 'Unknown Tech']
        },
        technologies: mockTechnologies
      },
      global: {
        mocks: {
          $t: (key, params = {}) => {
            const messages = {
              'projectCard.technologiesLabel': 'Technologies used',
              'projectCard.linkAriaLabel': `Visit ${params.linkText} for ${params.projectTitle} (opens in new tab)`
            };
            return messages[key] || key;
          },
          $tm: (key) => key
        }
      }
    })

    expect(wrapper.find('img[alt="Vue"]').exists()).toBe(true)
    expect(wrapper.find('img[alt="Unknown Tech"]').exists()).toBe(false)
  })

  it('renders no project links when links are missing', () => {
    const wrapper = mount(TheProjectCard, {
      props: {
        project: {
          ...mockProject,
          links: undefined
        },
        technologies: mockTechnologies
      },
      global: {
        mocks: {
          $t: (key, params = {}) => {
            const messages = {
              'projectCard.technologiesLabel': 'Technologies used',
              'projectCard.linkAriaLabel': `Visit ${params.linkText} for ${params.projectTitle} (opens in new tab)`
            };
            return messages[key] || key;
          },
          $tm: (key) => key
        }
      }
    })

    expect(wrapper.findAll('a.project-button')).toHaveLength(0)
  })

  it('handles missing technology and info arrays gracefully', () => {
    const wrapper = mount(TheProjectCard, {
      props: {
        project: {
          ...mockProject,
          technologyTitles: undefined,
          additionalInfo: undefined
        },
        technologies: mockTechnologies
      },
      global: {
        mocks: {
          $t: (key, params = {}) => {
            const messages = {
              'projectCard.technologiesLabel': 'Technologies used',
              'projectCard.linkAriaLabel': `Visit ${params.linkText} for ${params.projectTitle} (opens in new tab)`
            };
            return messages[key] || key;
          },
          $tm: (key) => key
        }
      }
    })

    expect(wrapper.findAll('.small-devicon')).toHaveLength(0)
    expect(wrapper.findAll('.additional-info')).toHaveLength(0)
  })
})
