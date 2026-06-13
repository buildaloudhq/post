#!/usr/bin/env bash
# Validate that a commit message follows Conventional Commits.
# https://www.conventionalcommits.org
#
# Usage: check-commit-msg.sh <path-to-commit-msg-file>
set -euo pipefail

msg_file="${1:?commit message file path required}"
header="$(head -n1 "$msg_file")"

# Let git's own machinery (merges, reverts, fixup/squash) through untouched.
if printf '%s' "$header" | grep -qE '^(Merge |Revert |fixup!|squash!)'; then
  exit 0
fi

# <type>(<optional scope>)<optional !>: <description>
pattern='^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^)]+\))?!?: .+'

if ! printf '%s' "$header" | grep -qE "$pattern"; then
  echo "✗ Commit message does not follow Conventional Commits."
  echo
  echo "  Got:     $header"
  echo "  Expect:  <type>(<optional scope>): <description>"
  echo "  Types:   feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert"
  echo "  Example: feat(bluesky): add link facets"
  echo
  echo "  (Bypass in emergencies with: git commit --no-verify)"
  exit 1
fi
