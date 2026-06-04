#!/usr/bin/env bun
import { $ } from 'bun'

const defaultOutputPath = null
const defaultBaseRef = 'origin/main'
const validationCommands = ['bun run lint', 'bun run test', 'bun run build']

const options = parseArgs(Bun.argv.slice(2))
const baseRef = options.baseRef || (await getDefaultBaseRef())
const branch = await getCurrentBranch()
const changes = mergeChanges(
  parseNameStatus(await textOrEmpty($`git diff --name-status ${`${baseRef}...HEAD`}`)),
  parseNameStatus(await textOrEmpty($`git diff --cached --name-status`)),
  parseNameStatus(await textOrEmpty($`git diff --name-status`)),
  parseUntrackedFiles(await textOrEmpty($`git ls-files --others --exclude-standard`)),
)
const commits = parseLines(await textOrEmpty($`git log --format=%s ${`${baseRef}..HEAD`}`))
const versionChange = await getVersionChange(baseRef)
const markdown = buildMarkdown({ branch, changes, commits, versionChange, validated: options.validated })

if (options.outputPath || defaultOutputPath) {
  const outputPath = options.outputPath || defaultOutputPath
  await Bun.write(outputPath, markdown)
}

console.log(markdown)

function parseArgs(args) {
  const parsed = {
    baseRef: null,
    outputPath: null,
    validated: false,
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === '--validated') {
      parsed.validated = true
      continue
    }

    if (arg === '--base') {
      parsed.baseRef = args[index + 1]
      index += 1
      continue
    }

    if (arg === '--write') {
      const nextArg = args[index + 1]
      parsed.outputPath = nextArg && !nextArg.startsWith('--') ? nextArg : '.pr-description.md'

      if (parsed.outputPath === nextArg) {
        index += 1
      }

      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log('Usage: bun run scripts/pr-description.js [--validated] [--base <ref>] [--write [path]]')
      process.exit(0)
    }

    throw new Error(`Unknown option: ${arg}`)
  }

  return parsed
}

async function getDefaultBaseRef() {
  if (await canResolve(defaultBaseRef)) {
    return defaultBaseRef
  }

  return 'main'
}

async function canResolve(ref) {
  try {
    await $`git rev-parse --verify ${ref}`.quiet()
    return true
  } catch {
    return false
  }
}

async function getCurrentBranch() {
  return (await textOrEmpty($`git branch --show-current`)) || 'current branch'
}

async function textOrEmpty(command) {
  try {
    return (await command.text()).trim()
  } catch {
    return ''
  }
}

function parseLines(output) {
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function parseNameStatus(output) {
  return parseLines(output).map((line) => {
    const parts = line.split('\t')
    const status = parts[0]
    const file = parts.at(-1)

    return { status, file }
  })
}

function parseUntrackedFiles(output) {
  return parseLines(output).map((file) => ({ status: 'A', file }))
}

function mergeChanges(...changeSets) {
  const changesByFile = new Map()

  for (const changeSet of changeSets) {
    for (const change of changeSet) {
      if (change.file) {
        changesByFile.set(change.file, change)
      }
    }
  }

  return [...changesByFile.values()].sort((left, right) => left.file.localeCompare(right.file))
}

async function getVersionChange(baseRef) {
  const currentPackageJson = JSON.parse(await Bun.file('package.json').text())
  const basePackageJsonText = await textOrEmpty($`git show ${`${baseRef}:package.json`}`)

  if (!basePackageJsonText) {
    return null
  }

  const basePackageJson = JSON.parse(basePackageJsonText)

  if (basePackageJson.version === currentPackageJson.version) {
    return null
  }

  return {
    from: basePackageJson.version,
    to: currentPackageJson.version,
  }
}

function buildMarkdown({ branch, changes, commits, versionChange, validated }) {
  const summary = buildSummary({ changes, commits, versionChange })
  const validationPrefix = validated ? 'Passed' : 'Run'

  return [
    '## Summary',
    ...summary.map((item) => `- ${item}`),
    '',
    '## Validation',
    ...validationCommands.map((command) => `- ${validationPrefix} \`${command}\`.`),
    '',
    '## Notes',
    `- Branch: \`${branch}\`.`,
    '- Target branch: `main`.',
    '',
  ].join('\n')
}

function buildSummary({ changes, commits, versionChange }) {
  const files = changes.map((change) => change.file)
  const summary = []

  if (hasFile(files, '.github/workflows/deploy.yml')) {
    addUnique(summary, 'Opt into the Node 24 JavaScript actions runtime for the deploy workflow.')
  } else if (files.some((file) => file.startsWith('.github/workflows/'))) {
    addUnique(summary, 'Update the GitHub Actions workflow configuration.')
  }

  if (hasFile(files, 'scripts/pr-description.js')) {
    addUnique(summary, 'Add a local PR description generator for release branches.')
  }

  if (hasFile(files, 'scripts/release-push.js')) {
    addUnique(summary, 'Print and save a ready-to-copy PR description after local release pushes.')
  }

  if (hasFile(files, 'scripts/deploy-gh-pages.js')) {
    addUnique(summary, 'Update the Bun-based GitHub Pages deployment helper.')
  }

  if (hasFile(files, 'package.json')) {
    if (versionChange) {
      addUnique(summary, `Bump the package version from ${versionChange.from} to ${versionChange.to}.`)
    } else {
      addUnique(summary, 'Update package scripts for the local release workflow.')
    }
  }

  if (hasFile(files, 'README.md')) {
    addUnique(summary, 'Document the local release and PR description workflow.')
  }

  for (const commit of commits) {
    const item = commitToSummary(commit)

    if (item) {
      addUnique(summary, item)
    }
  }

  if (summary.length === 0) {
    addUnique(summary, 'Update project files for this branch.')
  }

  return summary.slice(0, 5)
}

function hasFile(files, fileName) {
  return files.includes(fileName)
}

function addUnique(items, item) {
  if (!items.includes(item)) {
    items.push(item)
  }
}

function commitToSummary(commit) {
  const cleaned = commit
    .replace(/^[a-f0-9]{7,}\s+/i, '')
    .replace(/^(feat|fix|chore|ci|docs|test|style|refactor)(\(.+\))?:\s*/i, '')
    .trim()

  if (!cleaned || /^(patch|minor|major|version) update$/i.test(cleaned)) {
    return null
  }

  return `${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1).replace(/[.!?]$/, '')}.`
}
