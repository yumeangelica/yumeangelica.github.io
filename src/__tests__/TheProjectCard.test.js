import { render, screen } from '@testing-library/vue'
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
    render(TheProjectCard, {
      props: {
        project: mockProject,
        technologies: mockTechnologies
      }
    })

    // Project title
    expect(screen.getByText(mockProject.title)).toBeTruthy()

    // Project image
    const img = screen.getByAltText(mockProject.title)
    expect(img).toBeTruthy()
    expect(img.getAttribute('src')).toBe(mockProject.imageURL)

    // Technology icons
    mockProject.technologyTitles.forEach(techName => {
      expect(screen.getByAltText(techName)).toBeTruthy()
    })

    // Additional info
    mockProject.additionalInfo.forEach(info => {
      expect(screen.getByText(info)).toBeTruthy()
    })

    // Project links
    mockProject.links.forEach(link => {
      const linkElement = screen.getByRole('link', {
        name: new RegExp(`visit ${link.text} for ${mockProject.title}`, 'i')
      })
      expect(linkElement).toBeTruthy()
      expect(linkElement.getAttribute('href')).toBe(link.url)
    })
  })
})
