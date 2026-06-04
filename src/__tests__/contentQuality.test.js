import { readdirSync, readFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

function readJson(path) {
  return JSON.parse(readFileSync(join(rootDir, path), 'utf8'))
}

function collectFiles(dir, extensions) {
  return readdirSync(join(rootDir, dir), { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      return collectFiles(entryPath, extensions)
    }

    return extensions.includes(extname(entry.name)) ? [entryPath] : []
  })
}

function collectHtmlStrings(value, path = []) {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectHtmlStrings(item, [...path, String(index)]))
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => collectHtmlStrings(item, [...path, key]))
  }

  if (typeof value === 'string' && /<\/?[a-z][\s\S]*>/i.test(value)) {
    return [{ path: path.join('.'), value }]
  }

  return []
}

describe('content quality gates', () => {
  it('keeps project data shape valid and every project technology mapped to an icon', () => {
    const data = readJson('public/data.json')
    const technologyTitles = new Set(data.technologies.flatMap((group) => group.items.map((tech) => tech.title)))

    expect(Array.isArray(data.projects)).toBe(true)
    expect(data.projects.length).toBeGreaterThan(0)

    data.projects.forEach((project) => {
      expect(project.title).toEqual(expect.any(String))
      expect(['frontend', 'backend', 'fullstack', 'cli']).toContain(project.type)
      expect(project.imageURL).toMatch(/^\/assets\/projects\/.+\.webp$/)
      expect(Array.isArray(project.technologyTitles)).toBe(true)
      expect(project.technologyTitles.length).toBeGreaterThan(0)
      expect(Array.isArray(project.additionalInfo)).toBe(true)
      expect(Array.isArray(project.links)).toBe(true)

      project.technologyTitles.forEach((techTitle) => {
        expect(technologyTitles.has(techTitle), `${project.title} references unknown technology "${techTitle}"`).toBe(true)
      })

      project.links.forEach((link) => {
        expect(link.text).toEqual(expect.any(String))
        expect(link.url).toMatch(/^https:\/\//)
      })
    })
  })

  it('keeps public messages free of embedded HTML strings', () => {
    const messages = readJson('public/messages_en.json')
    expect(collectHtmlStrings(messages)).toEqual([])
  })

  it('does not use v-html in Vue components', () => {
    const vueFiles = collectFiles('src', ['.vue'])
    const filesWithVHtml = vueFiles.filter((file) => readFileSync(join(rootDir, file), 'utf8').includes('v-html'))

    expect(filesWithVHtml).toEqual([])
  })
})
