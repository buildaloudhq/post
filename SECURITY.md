# Security Policy

## Supported versions

`post` is pre-1.0 and moves quickly. Security fixes land on the **latest
release** only — please upgrade to the newest version before reporting.

| Version | Supported |
| ------- | --------- |
| latest  | ✅        |
| older   | ❌        |

## Reporting a vulnerability

**Please don't open a public issue for security problems** — that discloses
the vulnerability before there's a fix.

Instead, report it privately via GitHub's
[**Report a vulnerability**](https://github.com/buildaloudhq/post/security/advisories/new)
button, which opens a private advisory visible only to the maintainers. If you
prefer email, contact [security@buildaloud.com](mailto:security@buildaloud.com).

What to expect:

- We aim to acknowledge your report within **3 business days**.
- We'll confirm the issue, work on a fix, and agree a coordinated disclosure
  timeline with you.
- With your permission, we'll credit you in the published advisory and the
  release notes.

## Scope

This policy covers the `post` CLI in this repository. Because `post` handles
your platform credentials locally, reports about **credential handling, token
storage, or the release / supply-chain pipeline** (signing, provenance,
dependencies) are especially welcome.
