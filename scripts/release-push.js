#!/usr/bin/env bun
import { $ } from 'bun'

const releaseTypes = {
  patch: { message: 'Patch update' },
  minor: { message: 'Minor update' },
  major: { message: 'Major update' },
}

const type = Bun.argv[2]
const release = releaseTypes[type]

function usage() {
  console.error('Usage: bun run scripts/release-push.js <patch|minor|major>')
}

function fail(message) {
  console.error(`\n${message}`)
  process.exit(1)
}

function bumpVersion(version, releaseType) {
  const parts = version.split('.').map((part) => Number(part))

  if (parts.length !== 3 || parts.some((part) => !Number.isInteger(part) || part < 0)) {
    throw new Error(`Invalid package version: ${version}`)
  }

  if (releaseType === 'patch') {
    parts[2] += 1
  }

  if (releaseType === 'minor') {
    parts[1] += 1
    parts[2] = 0
  }

  if (releaseType === 'major') {
    parts[0] += 1
    parts[1] = 0
    parts[2] = 0
  }

  return parts.join('.')
}

function getCompareUrl(remoteUrl, branch) {
  let repo = null

  if (remoteUrl.startsWith('https://github.com/')) {
    repo = remoteUrl.replace('https://github.com/', '')
  }

  if (remoteUrl.startsWith('git@github.com:')) {
    repo = remoteUrl.replace('git@github.com:', '')
  }

  if (remoteUrl.startsWith('ssh://git@github.com/')) {
    repo = remoteUrl.replace('ssh://git@github.com/', '')
  }

  if (!repo) {
    return null
  }

  repo = repo.replace(/\.git$/, '')
  return `https://github.com/${repo}/compare/main...${branch}?expand=1`
}

async function runStep(label, command) {
  console.log(`\n> ${label}`)
  await command
}

async function main() {
  if (!release) {
    usage()
    process.exit(1)
  }

  const branch = (await $`git branch --show-current`.text()).trim()

  if (!branch || branch === 'HEAD') {
    fail('Release push requires a normal branch, not a detached HEAD.')
  }

  if (branch === 'main') {
    fail('Create or switch to a feature/release branch before running a release push.')
  }

  const status = (await $`git status --porcelain=v1`.text()).trim()

  if (status) {
    fail('Commit or stash local changes before running a release push.')
  }

  const packagePath = 'package.json'
  const originalPackageJson = await Bun.file(packagePath).text()
  const packageJson = JSON.parse(originalPackageJson)
  const previousVersion = packageJson.version
  const nextVersion = bumpVersion(previousVersion, type)

  packageJson.version = nextVersion
  await Bun.write(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`)

  console.log(`\nVersion: ${previousVersion} -> ${nextVersion}`)

  try {
    await runStep('Lint', $`bun run lint`)
    await runStep('Test', $`bun run test`)
    await runStep('Build', $`bun run build`)
  } catch (error) {
    await Bun.write(packagePath, originalPackageJson)
    console.error('\nLocal quality gate failed. Version bump was restored and nothing was pushed.')
    process.exit(error.exitCode || 1)
  }

  await runStep('Commit version bump', $`git add package.json`)
  await $`git commit -m ${release.message}`

  await runStep('Push branch', $`git push --set-upstream origin ${branch}`)

  const remoteUrl = (await $`git remote get-url origin`.text()).trim()
  const compareUrl = getCompareUrl(remoteUrl, branch)

  console.log(`\nPushed ${branch}.`)

  if (compareUrl) {
    console.log(`Open PR: ${compareUrl}`)
  } else {
    console.log('Open a PR from this branch on GitHub.')
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(error.exitCode || 1)
})
