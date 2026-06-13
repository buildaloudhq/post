#!/usr/bin/env node
// Publish `post` to npm using the esbuild-style optional-dependencies model.
//
// Reads GoReleaser's dist/artifacts.json, then for each prebuilt binary creates
// a per-platform package (@buildaloudhq/post-<platform>-<arch>) gated by os/cpu
// so npm only installs the matching one. Finally publishes the main package
// (@buildaloudhq/post) whose bin shim resolves and execs the right binary, with
// every platform package listed as an optionalDependency.
//
// Usage:
//   VERSION=1.2.3 NODE_AUTH_TOKEN=... node npm/publish.mjs
//   VERSION=1.2.3 node npm/publish.mjs --dry-run   # pack only, no publish/auth
"use strict"

import { execFileSync } from "node:child_process"
import {
  chmodSync,
  copyFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const SCOPE = "@buildaloudhq"
const NAME = "post"

const HERE = dirname(fileURLToPath(import.meta.url)) // npm/
const REPO = join(HERE, "..")
const DIST = join(REPO, "dist")
const OUT = join(HERE, ".out") // staging for generated packages (gitignored)

const dryRun = process.argv.includes("--dry-run")
const version = (process.env.VERSION || "").replace(/^v/, "")
if (!version) {
  console.error("VERSION env var is required (e.g. VERSION=1.2.3)")
  process.exit(1)
}

// GoReleaser GOOS/GOARCH -> Node process.platform/process.arch
const OS = { darwin: "darwin", linux: "linux", windows: "win32" }
const ARCH = { amd64: "x64", arm64: "arm64" }

const artifacts = JSON.parse(readFileSync(join(DIST, "artifacts.json"), "utf8"))
const binaries = artifacts.filter((a) => a.type === "Binary")
if (binaries.length === 0) {
  console.error(
    "no Binary artifacts in dist/artifacts.json — run goreleaser first",
  )
  process.exit(1)
}

rmSync(OUT, { recursive: true, force: true })

const platformPackages = []

for (const b of binaries) {
  const nodeOS = OS[b.goos]
  const nodeArch = ARCH[b.goarch]
  if (!nodeOS || !nodeArch) continue // skip anything Node can't name

  const pkgName = `${SCOPE}/${NAME}-${nodeOS}-${nodeArch}`
  const pkgDir = join(OUT, `${NAME}-${nodeOS}-${nodeArch}`)
  const exe = nodeOS === "win32" ? "post.exe" : "post"

  mkdirSync(join(pkgDir, "bin"), { recursive: true })
  copyFileSync(join(REPO, b.path), join(pkgDir, "bin", exe))
  chmodSync(join(pkgDir, "bin", exe), 0o755)

  writePackageJson(pkgDir, {
    name: pkgName,
    version,
    description: `post prebuilt binary for ${nodeOS}-${nodeArch}`,
    license: "Apache-2.0",
    homepage: "https://buildaloud.com",
    repository: {
      type: "git",
      url: "https://github.com/buildaloudhq/post.git",
    },
    os: [nodeOS],
    cpu: [nodeArch],
    files: ["bin"],
  })

  platformPackages.push(pkgName)
  publish(pkgDir)
}

// Main package: the bin shim + every platform package as an optionalDependency.
const mainDir = join(OUT, NAME)
mkdirSync(join(mainDir, "bin"), { recursive: true })
copyFileSync(
  join(HERE, "post", "bin", "post.js"),
  join(mainDir, "bin", "post.js"),
)
copyFileSync(join(REPO, "README.md"), join(mainDir, "README.md"))
copyFileSync(join(REPO, "LICENSE"), join(mainDir, "LICENSE"))

writePackageJson(mainDir, {
  name: `${SCOPE}/${NAME}`,
  version,
  description: "Draft and cross-post to social media platforms",
  license: "Apache-2.0",
  homepage: "https://buildaloud.com",
  repository: { type: "git", url: "https://github.com/buildaloudhq/post.git" },
  bin: { post: "bin/post.js" },
  files: ["bin"],
  // Sorted for a stable diff across releases.
  optionalDependencies: Object.fromEntries(
    platformPackages.sort().map((n) => [n, version]),
  ),
})

publish(mainDir)

console.log(
  `\n${dryRun ? "[dry-run] " : ""}published ${platformPackages.length} platform packages + ${SCOPE}/${NAME}@${version}`,
)

function writePackageJson(dir, obj) {
  writeFileSync(join(dir, "package.json"), JSON.stringify(obj, null, 2) + "\n")
}

function publish(dir) {
  const args = ["publish", "--access", "public"]
  if (dryRun) args.push("--dry-run")
  console.log(`${dryRun ? "[dry-run] " : ""}npm publish ${dir}`)
  execFileSync("npm", args, { cwd: dir, stdio: "inherit" })
}
