import { readdirSync, readFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { EN_FALLBACK } from '../i18n'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

function readJson(path) {
  return JSON.parse(readFileSync(join(rootDir, path), 'utf8'))
}

// Resolve a dot-notation key against a nested messages object.
function resolveKey(messages, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), messages)
}

// Collect [dotPath, value] pairs for every non-object leaf (strings and arrays) in an object.
function collectLeaves(value, path = []) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([key, item]) => collectLeaves(item, [...path, key]))
  }

  return [[path.join('.'), value]]
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
      // Intrinsic image dimensions are required so the card can reserve space and avoid CLS.
      expect(Number.isInteger(project.imageWidth) && project.imageWidth > 0, `${project.title} is missing a positive integer imageWidth`).toBe(true)
      expect(Number.isInteger(project.imageHeight) && project.imageHeight > 0, `${project.title} is missing a positive integer imageHeight`).toBe(true)
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

  it('has no unused logo assets in public/assets/logos', () => {
    // Every SVG under public/assets/logos/ must be referenced from public/data.json,
    // otherwise it is an orphaned asset shipped to visitors for no reason.
    const logoFiles = readdirSync(join(rootDir, 'public/assets/logos'), { withFileTypes: true })
      .filter((entry) => entry.isFile() && extname(entry.name) === '.svg')
      .map((entry) => entry.name)

    const dataRaw = readFileSync(join(rootDir, 'public/data.json'), 'utf8')
    const referenced = new Set((dataRaw.match(/\/assets\/logos\/[^"']+\.svg/g) ?? []).map((path) => path.split('/').pop()))

    const unused = logoFiles.filter((file) => !referenced.has(file))
    expect(unused, `unused logo assets in public/assets/logos: ${unused.join(', ')}`).toEqual([])
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

  it('resolves every static translation key used in Vue components', () => {
    const messages = readJson('public/messages_en.json')
    const keyPattern = /\$tm?\(\s*'([^']+)'/g

    const missing = collectFiles('src', ['.vue']).flatMap((file) => {
      const content = readFileSync(join(rootDir, file), 'utf8')
      return [...content.matchAll(keyPattern)]
        .map((match) => match[1])
        .filter((key) => {
          const value = resolveKey(messages, key)
          return typeof value !== 'string' && typeof value !== 'object'
        })
        .map((key) => ({ file, key }))
    })

    expect(missing).toEqual([])
  })

  it('keeps the built-in i18n fallback in sync with the message file', () => {
    const messages = readJson('public/messages_en.json')

    collectLeaves(EN_FALLBACK).forEach(([key, value]) => {
      expect(resolveKey(messages, key), `EN_FALLBACK key "${key}" is missing or differs from messages_en.json`).toEqual(value)
    })
  })

  it('defines the project section and type-filter keys built dynamically in the template', () => {
    const messages = readJson('public/messages_en.json')

    // Sections are keyed by `projects.sections.<type>.{title,navLabel}` via a template literal in PageProjects.vue.
    for (const type of ['main', 'frontend', 'backend', 'fullstack', 'cli']) {
      expect(typeof resolveKey(messages, `projects.sections.${type}.title`), `missing projects.sections.${type}.title`).toBe('string')
      expect(typeof resolveKey(messages, `projects.sections.${type}.navLabel`), `missing projects.sections.${type}.navLabel`).toBe('string')
    }

    // Type filters are keyed by `projects.filters.types.<type>.{label,ariaLabel}` the same way.
    for (const type of ['frontend', 'backend', 'fullstack', 'cli']) {
      expect(typeof resolveKey(messages, `projects.filters.types.${type}.label`), `missing projects.filters.types.${type}.label`).toBe('string')
      expect(typeof resolveKey(messages, `projects.filters.types.${type}.ariaLabel`), `missing projects.filters.types.${type}.ariaLabel`).toBe('string')
    }
  })
})
