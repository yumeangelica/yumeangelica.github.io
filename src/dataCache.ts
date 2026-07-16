import type { PortfolioData } from './types/portfolio'

/**
 * Shared data cache — fetches data.json once and serves
 * the same promise to every caller (PageHome, PageProjects, etc.).
 */
let cached: Promise<PortfolioData> | null = null

export function fetchData(): Promise<PortfolioData> {
  if (!cached) {
    cached = fetch('/data.json')
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`)

        const dataPromise: Promise<unknown> = response.json()
        return dataPromise as Promise<PortfolioData>
      })
      .catch((error: unknown) => {
        cached = null // Allow retry on failure
        throw error
      })
  }

  return cached
}
