#!/usr/bin/env node
"use strict"

const { spawnSync } = require("node:child_process")

function resolveBinary() {
  const pkg = `@buildaloudhq/post-${process.platform}-${process.arch}`
  const exe = process.platform === "win32" ? "post.exe" : "post"
  try {
    return require.resolve(`${pkg}/bin/${exe}`)
  } catch {
    return null
  }
}

const bin = resolveBinary()
if (!bin) {
  console.error(
    `post: no prebuilt binary found for ${process.platform}-${process.arch}.\n` +
      `Either your platform is unsupported, or the optional dependency failed to install.\n` +
      `See https://github.com/buildaloudhq/post for other install methods.`,
  )
  process.exit(1)
}

const result = spawnSync(bin, process.argv.slice(2), { stdio: "inherit" })
if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}
process.exit(result.status === null ? 1 : result.status)
