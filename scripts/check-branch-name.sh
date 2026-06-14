#!/usr/bin/env bash
# Validate the current branch name follows <type>/<short-description>,
# mirroring the Conventional Commits types. Runs on pre-push.
set -euo pipefail

branch="$(git rev-parse --abbrev-ref HEAD)"

# Never block main, or a detached HEAD.
case "$branch" in
  main | HEAD) exit 0 ;;
esac

pattern='^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)/[a-z0-9._-]+$'

if ! printf '%s' "$branch" | grep -qE "$pattern"; then
  echo "✗ Branch name '$branch' doesn't follow the convention."
  echo
  echo "  Expected:  <type>/<short-description>   e.g. feat/bluesky-facets"
  echo "  Types:     feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert"
  echo
  echo "  Rename this branch, then push again:"
  echo "    git branch -m feat/your-description"
  echo
  echo "  (Bypass once in an emergency with: git push --no-verify)"
  exit 1
fi
