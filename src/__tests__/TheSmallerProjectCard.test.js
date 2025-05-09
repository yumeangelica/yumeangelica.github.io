import { render, screen } from '@testing-library/vue'
import TheSmallerProjectCard from 'components/TheSmallerProjectCard.vue'

describe('TheSmallerProjectCard.vue', () => {
  const mockProject = {
    title: 'Mini App',
    additionalInfo: ['Built with Vue', 'Fast and lightweight'],
    links: [
      { text: 'Code', url: 'https://example.dev/code' },
      { text: 'Live', url: 'https://app.example.dev/live' }
    ]
  }

  it('renders title, additional info, and links', () => {
    render(TheSmallerProjectCard, {
      props: {
        project: mockProject
      }
    })

    // Check title is shown
    expect(screen.getByText(mockProject.title)).toBeTruthy()

    // Check additionalInfo is rendered
    mockProject.additionalInfo.forEach(info => {
      expect(screen.getByText(info)).toBeTruthy()
    })

    // Check links
    mockProject.links.forEach(link => {
      const linkElement = screen.getByRole('link', {
        name: new RegExp(`visit ${link.text} for ${mockProject.title}`, 'i')
      })
      expect(linkElement).toBeTruthy()
      expect(linkElement.getAttribute('href')).toBe(link.url)
    })
  })
})
