export type ProjectType = 'frontend' | 'backend' | 'fullstack' | 'cli'

export type ProjectSectionType = 'main' | ProjectType

export interface Technology {
  title: string
  url: string
}

export interface TechnologyGroup {
  category: string
  items: Technology[]
}

export interface ProjectLink {
  text: string
  url: string
}

export interface PortfolioProject {
  type: ProjectType
  isMain: boolean
  title: string
  imageURL: string
  imageWidth: number
  imageHeight: number
  technologyTitles: string[]
  additionalInfo: string[]
  links: ProjectLink[]
}

export interface PortfolioData {
  projects: PortfolioProject[]
  technologies: TechnologyGroup[]
}

export interface ProjectCardProject {
  title?: string | undefined
  imageURL?: string | undefined
  imageWidth?: number | undefined
  imageHeight?: number | undefined
  type?: ProjectType | undefined
  additionalInfo?: readonly string[] | undefined
  technologyTitles?: readonly string[] | undefined
  links?: readonly ProjectLink[] | undefined
}
