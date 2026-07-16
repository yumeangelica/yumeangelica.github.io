#!/usr/bin/env bun
import { $ } from 'bun'

type ReleaseType = 'patch' | 'minor' | 'major'

interface ReleaseConfig {
  message: string
}

interface PackageJson {
  version: string
  [key: string]: unknown
}

const releaseTypes = {
  patch: { message: 'Patch update' },
  minor: { message: 'Minor update' },
  major: { message: 'Major update' },
} satisfies Record<ReleaseType, ReleaseConfig>

const type = Bun.argv[2]

function isReleaseType(value: string | undefined): value is ReleaseType {
  return value === 'patch' || value === 'minor' || value === 'major'
}

function usage(): void {
  console.error('Usage: bun run scripts/release-push.ts <patch|minor|major>')
}

function fail(message: string): never {
  console.error(`\n${message}`)
  process.exit(1)
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

function getExitCode(error: unknown): number {
  if (typeof error !== 'object' || error === null || !('exitCode' in error))
    return 1
  const exitCode = error.exitCode
  return typeof exitCode === 'number' ? exitCode : 1
}

function bumpVersion(version: string, releaseType: ReleaseType): string {
  const parts = version.split('.').map((part) => Number(part))
  const [major, minor, patch] = parts

  if (
    parts.length !== 3 ||
    major === undefined ||
    minor === undefined ||
    patch === undefined ||
    parts.some((part) => !Number.isInteger(part) || part < 0)
  ) {
    throw new Error(`Invalid package version: ${version}`)
  }

  if (releaseType === 'patch') return `${major}.${minor}.${patch + 1}`
  if (releaseType === 'minor') return `${major}.${minor + 1}.0`
  return `${major + 1}.0.0`
}

function getCompareUrl(remoteUrl: string, branch: string): string | null {
  let repo: string | null = null

  if (remoteUrl.startsWith('https://github.com/')) {
    repo = remoteUrl.replace('https://github.com/', '')
  }

  if (remoteUrl.startsWith('git@github.com:')) {
    repo = remoteUrl.replace('git@github.com:', '')
  }

  if (remoteUrl.startsWith('ssh://git@github.com/')) {
    repo = remoteUrl.replace('ssh://git@github.com/', '')
  }

  if (!repo) return null

  repo = repo.replace(/\.git$/, '')
  return `https://github.com/${repo}/compare/main...${branch}?expand=1`
}

async function runStep(label: string, command: $.ShellPromise): Promise<void> {
  console.log(`\n> ${label}`)
  await command
}

async function main(): Promise<void> {
  if (!isReleaseType(type)) {
    usage()
    process.exit(1)
  }

  const release = releaseTypes[type]
  const branch = (await $`git branch --show-current`.text()).trim()

  if (!branch || branch === 'HEAD') {
    fail('Release push requires a normal branch, not a detached HEAD.')
  }

  if (branch === 'main') {
    fail(
      'Create or switch to a feature/release branch before running a release push.',
    )
  }

  const status = (await $`git status --porcelain=v1`.text()).trim()
  if (status) {
    fail('Commit or stash local changes before running a release push.')
  }

  const packagePath = 'package.json'
  const originalPackageJson = await Bun.file(packagePath).text()
  const parsedPackageJson: unknown = JSON.parse(originalPackageJson)

  if (!isPackageJson(parsedPackageJson)) {
    fail(
      'package.json must include a string version before running a release push.',
    )
  }

  const packageJson = parsedPackageJson
  const previousVersion = packageJson.version
  const nextVersion = bumpVersion(previousVersion, type)

  packageJson.version = nextVersion
  await Bun.write(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`)

  console.log(`\nVersion: ${previousVersion} -> ${nextVersion}`)

  try {
    await runStep('Lint', $`bun run lint`)
    await runStep('Typecheck', $`bun run typecheck`)
    await runStep('Test', $`bun run test`)
    await runStep('Build', $`bun run build`)
  } catch (error: unknown) {
    await Bun.write(packagePath, originalPackageJson)
    console.error(
      '\nLocal quality gate failed. Version bump was restored and nothing was pushed.',
    )
    process.exit(getExitCode(error))
  }

  await runStep('Commit version bump', $`git add package.json`)
  await $`git commit -m ${release.message}`

  await runStep('Push branch', $`git push --set-upstream origin ${branch}`)

  const remoteUrl = (await $`git remote get-url origin`.text()).trim()
  const compareUrl = getCompareUrl(remoteUrl, branch)
  const prDescriptionPath = '.pr-description.md'
  let prDescription: string | null = null

  try {
    prDescription =
      await $`bun run scripts/pr-description.ts --validated --write ${prDescriptionPath}`.text()
  } catch {
    console.error(
      '\nCould not generate the PR description, but the branch was pushed successfully.',
    )
  }

  console.log(`\nPushed ${branch}.`)

  if (compareUrl) {
    console.log(`Open PR: ${compareUrl}`)
  } else {
    console.log('Open a PR from this branch on GitHub.')
  }

  if (prDescription) {
    console.log(`\nPR description saved to ${prDescriptionPath}:`)
    console.log(prDescription)
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(getExitCode(error))
})
