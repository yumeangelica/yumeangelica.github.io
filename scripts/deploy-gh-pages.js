#!/usr/bin/env bun
import { $ } from 'bun'

const buildDir = 'dist'
const releaseBranch = 'gh-pages'
const packageJson = JSON.parse(await Bun.file('package.json').text())
const version = packageJson.version

function fail(message) {
  console.error(`\n${message}`)
  process.exit(1)
}

async function runStep(label, command) {
  console.log(`\n> ${label}`)
  await command
}

async function tagExists(tagName) {
  try {
    await $`git rev-parse ${tagName}`.quiet()
    return true
  } catch {
    // Fall through to the remote check.
  }

  try {
    await $`git ls-remote --exit-code --tags origin ${`refs/tags/${tagName}`}`.quiet()
    return true
  } catch {
    return false
  }
}

if (!version) {
  fail('package.json must include a version before deploying.')
}

if (!(await Bun.file(`${buildDir}/index.html`).exists())) {
  fail(`Build output not found. Run "bun run build" before deploying ${buildDir}.`)
}

if (process.env.GITHUB_ACTIONS === 'true') {
  await $`git config user.name github-actions[bot]`
  await $`git config user.email 41898282+github-actions[bot]@users.noreply.github.com`
}

await runStep('Fetch release branch', $`git fetch origin ${releaseBranch}`)
await runStep('Create deploy tree', $`git add -f ${buildDir}`)

const tree = (await $`git write-tree --prefix=${buildDir}`.text()).trim()
await $`git reset -- ${buildDir}`
await $`git update-index --refresh`

const shortSha = (await $`git rev-parse --short HEAD`.text()).trim()
const parentRef = `refs/remotes/origin/${releaseBranch}`
const message = `Deploy ${shortSha} as version ${version}`
const commit = (await $`git commit-tree -p ${parentRef} -m ${message} ${tree}`.text()).trim()
const localRef = `refs/heads/${releaseBranch}`

await runStep('Update gh-pages ref', $`git update-ref ${localRef} ${commit}`)
await runStep('Push gh-pages', $`git push origin ${localRef}`)

const tagName = `v${version}`

if (await tagExists(tagName)) {
  console.log(`\nTag ${tagName} already exists.`)
} else {
  await runStep('Create release tag', $`git tag -a ${tagName} -m ${`Release tag for version ${version}`} ${commit}`)
  await runStep('Push release tag', $`git push origin ${tagName}`)
}

console.log(`\nDeployed ${shortSha} as version ${version}.`)
