import { mount } from '@vue/test-utils'
import TheProjectCard from 'components/TheProjectCard.vue'

describe('TheProjectCard.vue', () => {
  const mockProject = {
    title: 'Vue Portfolio',
    imageURL: 'https://assets.example.dev/image.jpg',
    technologyTitles: ['Vue', 'Bootstrap'],
    additionalInfo: ['Responsive design', 'Dark mode supported'],
    links: [
      { text: 'GitHub', url: 'https://example.dev/github' },
      { text: 'Live Demo', url: 'https://example.dev/live' }
    ]
  }

  const mockTechnologies = [
    { title: 'Vue', url: 'https://cdn.example.dev/vue.svg' },
    { title: 'Bootstrap', url: 'https://cdn.example.dev/bootstrap.svg' }
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
              'projectCard.linkAriaLabel': `Visit ${params.linkText} for ${params.projectTitle}`
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
})
