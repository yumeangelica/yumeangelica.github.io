import { readdirSync, readFileSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as ts from 'typescript'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

function collectFiles(dir: string, extensions: readonly string[]): string[] {
  return readdirSync(join(rootDir, dir), { withFileTypes: true }).flatMap(
    (entry) => {
      const entryPath = join(dir, entry.name)
      if (entry.isDirectory()) return collectFiles(entryPath, extensions)
      return extensions.includes(extname(entry.name))
        ? [join(rootDir, entryPath)]
        : []
    },
  )
}

function findAnyKeywords(sourceText: string, fileName: string): string[] {
  const sourceFile = ts.createSourceFile(
    fileName,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const violations: string[] = []

  function visit(node: ts.Node): void {
    if (node.kind === ts.SyntaxKind.AnyKeyword) {
      const position = sourceFile.getLineAndCharacterOfPosition(
        node.getStart(sourceFile),
      )
      violations.push(
        `${relative(rootDir, fileName)}:${position.line + 1}:${position.character + 1}`,
      )
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return violations
}

function extractVueScripts(source: string): string[] {
  const scriptPattern = /<script\b[^>]*>([\s\S]*?)<\/script>/gi
  return [...source.matchAll(scriptPattern)].flatMap((match) =>
    match[1] ? [match[1]] : [],
  )
}

describe('TypeScript safety gate', () => {
  it('contains no explicit any types in repository-owned TypeScript or Vue scripts', () => {
    const typescriptFiles = [
      resolve(rootDir, 'vite.config.ts'),
      ...collectFiles('scripts', ['.ts']),
      ...collectFiles('src', ['.ts']),
    ]
    const vueFiles = collectFiles('src', ['.vue'])

    const violations = typescriptFiles.flatMap((file) =>
      findAnyKeywords(readFileSync(file, 'utf8'), file),
    )

    for (const file of vueFiles) {
      const source = readFileSync(file, 'utf8')
      extractVueScripts(source).forEach((script, index) => {
        violations.push(
          ...findAnyKeywords(script, `${file}#script-${index + 1}.ts`),
        )
      })
    }

    expect(violations).toEqual([])
  })
})
