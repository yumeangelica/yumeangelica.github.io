#!/usr/bin/env bun
import { $ } from 'bun'

interface CliOptions {
  baseRef: string | null
  outputPath: string | null
  validated: boolean
}

interface FileChange {
  status: string
  file: string
}

interface VersionChange {
  from: string
  to: string
}

interface PackageJson {
  version: string
}

interface MarkdownInput {
  branch: string
  changes: FileChange[]
  commits: string[]
  versionChange: VersionChange | null
  validated: boolean
}

type SummaryInput = Pick<MarkdownInput, 'changes' | 'commits' | 'versionChange'>

const defaultOutputPath = '.pr-description.md'
const defaultBaseRef = 'origin/main'
const validationCommands = [
  'bun run lint',
  'bun run typecheck',
  'bun run test',
  'bun run build',
]

const options = parseArgs(Bun.argv.slice(2))
const baseRef = options.baseRef || (await getDefaultBaseRef())
const branch = await getCurrentBranch()
const changes = mergeChanges(
  parseNameStatus(
    await textOrEmpty($`git diff --name-status ${`${baseRef}...HEAD`}`),
  ),
  parseNameStatus(await textOrEmpty($`git diff --cached --name-status`)),
  parseNameStatus(await textOrEmpty($`git diff --name-status`)),
  parseUntrackedFiles(
    await textOrEmpty($`git ls-files --others --exclude-standard`),
  ),
)
const commits = parseLines(
  await textOrEmpty($`git log --format=%s ${`${baseRef}..HEAD`}`),
)
const versionChange = await getVersionChange(baseRef)
const markdown = buildMarkdown({
  branch,
  changes,
  commits,
  versionChange,
  validated: options.validated,
})

if (options.outputPath || defaultOutputPath) {
  const outputPath = options.outputPath || defaultOutputPath
  await Bun.write(outputPath, markdown)
}

console.log(markdown)

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    baseRef: null,
    outputPath: null,
    validated: false,
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === undefined) continue

    if (arg === '--validated') {
      parsed.validated = true
      continue
    }

    if (arg === '--base') {
      parsed.baseRef = args[index + 1] ?? null
      index += 1
      continue
    }

    if (arg === '--write') {
      const nextArg = args[index + 1]
      parsed.outputPath =
        nextArg && !nextArg.startsWith('--') ? nextArg : '.pr-description.md'

      if (parsed.outputPath === nextArg) {
        index += 1
      }

      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: bun run scripts/pr-description.ts [--validated] [--base <ref>] [--write [path]]',
      )
      process.exit(0)
    }

    throw new Error(`Unknown option: ${arg}`)
  }

  return parsed
}

async function getDefaultBaseRef(): Promise<string> {
  if (await canResolve(defaultBaseRef)) return defaultBaseRef
  return 'main'
}

async function canResolve(ref: string): Promise<boolean> {
  try {
    await $`git rev-parse --verify ${ref}`.quiet()
    return true
  } catch {
    return false
  }
}

async function getCurrentBranch(): Promise<string> {
  return (await textOrEmpty($`git branch --show-current`)) || 'current branch'
}

async function textOrEmpty(command: $.ShellPromise): Promise<string> {
  try {
    return (await command.text()).trim()
  } catch {
    return ''
  }
}

function parseLines(output: string): string[] {
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function parseNameStatus(output: string): FileChange[] {
  return parseLines(output).flatMap((line) => {
    const parts = line.split('\t')
    const status = parts[0]
    const file = parts.at(-1)
    return status && file ? [{ status, file }] : []
  })
}

function parseUntrackedFiles(output: string): FileChange[] {
  return parseLines(output).map((file) => ({ status: 'A', file }))
}

function isPackageJson(value: unknown): value is PackageJson {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'version' in value &&
    typeof value.version === 'string'
  )
}

function parsePackageJson(text: string, source: string): PackageJson {
  const parsed: unknown = JSON.parse(text)

  if (!isPackageJson(parsed)) {
    throw new Error(`${source} must include a string version.`)
  }

  return parsed
}

function mergeChanges(
  ...changeSets: ReadonlyArray<readonly FileChange[]>
): FileChange[] {
  const changesByFile = new Map<string, FileChange>()

  for (const changeSet of changeSets) {
    for (const change of changeSet) {
      changesByFile.set(change.file, change)
    }
  }

  return [...changesByFile.values()].sort((left, right) =>
    left.file.localeCompare(right.file),
  )
}

async function getVersionChange(
  baseRef: string,
): Promise<VersionChange | null> {
  const currentPackageJson = parsePackageJson(
    await Bun.file('package.json').text(),
    'package.json',
  )
  const basePackageJsonText = await textOrEmpty(
    $`git show ${`${baseRef}:package.json`}`,
  )

  if (!basePackageJsonText) return null

  const basePackageJson = parsePackageJson(
    basePackageJsonText,
    `${baseRef}:package.json`,
  )
  if (basePackageJson.version === currentPackageJson.version) return null

  return {
    from: basePackageJson.version,
    to: currentPackageJson.version,
  }
}

function buildMarkdown({
  branch,
  changes,
  commits,
  versionChange,
  validated,
}: MarkdownInput): string {
  const summary = buildSummary({ changes, commits, versionChange })
  const validationPrefix = validated ? 'Passed' : 'Run'

  return [
    '## Summary',
    ...summary.map((item) => `- ${item}`),
    '',
    '## Validation',
    ...validationCommands.map(
      (command) => `- ${validationPrefix} \`${command}\`.`,
    ),
    '',
    '## Notes',
    `- Branch: \`${branch}\`.`,
    '- Target branch: `main`.',
    '',
  ].join('\n')
}

function buildSummary({
  changes,
  commits,
  versionChange,
}: SummaryInput): string[] {
  const files = changes.map((change) => change.file)
  const summary: string[] = []

  if (hasFile(files, '.github/workflows/deploy.yml')) {
    addUnique(
      summary,
      'Opt into the Node 24 JavaScript actions runtime for the deploy workflow.',
    )
  } else if (files.some((file) => file.startsWith('.github/workflows/'))) {
    addUnique(summary, 'Update the GitHub Actions workflow configuration.')
  }

  if (hasFile(files, 'scripts/pr-description.ts')) {
    addUnique(
      summary,
      'Add a local PR description generator for release branches.',
    )
  }

  if (hasFile(files, 'scripts/release-push.ts')) {
    addUnique(
      summary,
      'Print and save a ready-to-copy PR description after local release pushes.',
    )
  }

  if (hasFile(files, 'scripts/deploy-gh-pages.ts')) {
    addUnique(summary, 'Update the Bun-based GitHub Pages deployment helper.')
  }

  if (hasFile(files, 'package.json')) {
    if (versionChange) {
      addUnique(
        summary,
        `Bump the package version from ${versionChange.from} to ${versionChange.to}.`,
      )
    } else {
      addUnique(
        summary,
        'Update package scripts for the local release workflow.',
      )
    }
  }

  if (hasFile(files, 'README.md')) {
    addUnique(
      summary,
      'Document the local release and PR description workflow.',
    )
  }

  for (const commit of commits) {
    const item = commitToSummary(commit)
    if (item) addUnique(summary, item)
  }

  if (summary.length === 0) {
    addUnique(summary, 'Update project files for this branch.')
  }

  return summary.slice(0, 5)
}

function hasFile(files: readonly string[], fileName: string): boolean {
  return files.includes(fileName)
}

function addUnique(items: string[], item: string): void {
  if (!items.includes(item)) items.push(item)
}

function commitToSummary(commit: string): string | null {
  const cleaned = commit
    .replace(/^[a-f0-9]{7,}\s+/i, '')
    .replace(/^(feat|fix|chore|ci|docs|test|style|refactor)(\(.+\))?:\s*/i, '')
    .trim()

  if (!cleaned || /^(patch|minor|major|version) update$/i.test(cleaned))
    return null

  return `${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1).replace(/[.!?]$/, '')}.`
}
