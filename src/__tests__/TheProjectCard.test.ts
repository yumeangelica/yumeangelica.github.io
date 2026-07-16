import { mount } from '@vue/test-utils'
import TheProjectCard from 'components/TheProjectCard.vue'
import { describe, expect, it } from 'vitest'
import type { TranslationParams } from '../i18n'
import type { ProjectCardProject, Technology } from '../types/portfolio'

describe('TheProjectCard.vue', () => {
  const mockProject = {
    title: 'Vue Portfolio',
    type: 'frontend',
    imageURL: 'https://assets.example.dev/image.jpg',
    imageWidth: 1000,
    imageHeight: 515,
    technologyTitles: ['Vue', 'CSS Framework'],
    additionalInfo: ['Responsive design', 'Dark mode supported'],
    links: [
      { text: 'GitHub', url: 'https://example.dev/github' },
      { text: 'Live Demo', url: 'https://example.dev/live' },
    ],
  } satisfies ProjectCardProject

  const mockTechnologies = [
    { title: 'Vue', url: 'https://cdn.example.dev/vue.svg' },
    {
      title: 'CSS Framework',
      url: 'https://cdn.example.dev/css-framework.svg',
    },
  ] satisfies Technology[]

  const projectCardT = (
    key: string,
    params: TranslationParams = {},
  ): string => {
    const messages: Record<string, string> = {
      'projectCard.technologiesLabel': 'Technologies used',
      'projectCard.linkAriaLabel': `Visit ${params.linkText} for ${params.projectTitle} (opens in new tab)`,
      'projects.filters.types.frontend.label': 'Frontend',
    }
    return messages[key] || key
  }

  const identityI18n = (key: string): string => key

  it('renders project title, image, technologies, additional info and links', () => {
    const wrapper = mount(TheProjectCard, {
      props: {
        project: mockProject,
        technologies: mockTechnologies,
      },
      global: {
        mocks: {
          $t: projectCardT,
          $tm: identityI18n,
        },
      },
    })

    // Project title
    expect(wrapper.text()).toContain(mockProject.title)

    // Project type badge over the image
    const badge = wrapper.find('.project-type-badge')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('Frontend')

    // First additionalInfo item renders as the lead summary, the rest as list items
    expect(wrapper.find('.project-summary').text()).toBe(
      mockProject.additionalInfo[0],
    )
    expect(
      wrapper.findAll('.project-highlights .additional-info'),
    ).toHaveLength(mockProject.additionalInfo.length - 1)

    // Project image
    const img = wrapper.find(`img[alt="${mockProject.title}"]`)
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(mockProject.imageURL)
    // Intrinsic dimensions are bound so the browser can reserve space (CLS).
    expect(img.attributes('width')).toBe(String(mockProject.imageWidth))
    expect(img.attributes('height')).toBe(String(mockProject.imageHeight))

    // Technology icons
    mockProject.technologyTitles.forEach((techName) => {
      expect(wrapper.find(`img[alt="${techName}"]`).exists()).toBe(true)
    })

    // Additional info
    mockProject.additionalInfo.forEach((info) => {
      expect(wrapper.text()).toContain(info)
    })

    // Project links
    mockProject.links.forEach((link) => {
      const linkElement = wrapper.find(`a[href="${link.url}"]`)
      expect(linkElement.exists()).toBe(true)
      expect(linkElement.text()).toBe(link.text)
      expect(linkElement.attributes('aria-label')).toMatch(
        new RegExp(`visit ${link.text} for ${mockProject.title}`, 'i'),
      )
    })
  })

  it('collapses technology icons beyond eight into a +N chip', () => {
    const manyTechs = Array.from({ length: 10 }, (_, i) => `Tech ${i + 1}`)
    const wrapper = mount(TheProjectCard, {
      props: {
        project: { ...mockProject, technologyTitles: manyTechs },
        technologies: manyTechs.map((title) => ({
          title,
          url: `https://cdn.example.dev/${title}.svg`,
        })),
      },
      global: {
        mocks: {
          $t: identityI18n,
          $tm: identityI18n,
        },
      },
    })

    expect(wrapper.findAll('.small-devicon')).toHaveLength(8)
    const moreChip = wrapper.find('.tech-chip-more')
    expect(moreChip.exists()).toBe(true)
    expect(moreChip.text()).toContain('+2')
    // Hidden technologies stay available to assistive tech
    expect(moreChip.text()).toContain('Tech 9, Tech 10')
  })

  it('does not render an icon for unknown technology titles', () => {
    const wrapper = mount(TheProjectCard, {
      props: {
        project: {
          ...mockProject,
          technologyTitles: ['Vue', 'Unknown Tech'],
        },
        technologies: mockTechnologies,
      },
      global: {
        mocks: {
          $t: projectCardT,
          $tm: identityI18n,
        },
      },
    })

    expect(wrapper.find('img[alt="Vue"]').exists()).toBe(true)
    expect(wrapper.find('img[alt="Unknown Tech"]').exists()).toBe(false)
  })

  it('renders no project links when links are missing', () => {
    const wrapper = mount(TheProjectCard, {
      props: {
        project: {
          ...mockProject,
          links: undefined,
        },
        technologies: mockTechnologies,
      },
      global: {
        mocks: {
          $t: projectCardT,
          $tm: identityI18n,
        },
      },
    })

    expect(wrapper.findAll('a.project-button')).toHaveLength(0)
  })

  it('handles missing technology and info arrays gracefully', () => {
    const wrapper = mount(TheProjectCard, {
      props: {
        project: {
          ...mockProject,
          technologyTitles: undefined,
          additionalInfo: undefined,
        },
        technologies: mockTechnologies,
      },
      global: {
        mocks: {
          $t: projectCardT,
          $tm: identityI18n,
        },
      },
    })

    expect(wrapper.findAll('.small-devicon')).toHaveLength(0)
    expect(wrapper.findAll('.additional-info')).toHaveLength(0)
  })
})
