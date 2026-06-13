# About this project

`post` is a command-line tool for drafting and cross-posting to social platforms — Twitter/X, Mastodon, and Bluesky — from one place. It handles per-platform formatting, threading, and character limits, so a single draft goes out everywhere correctly. Local-first: your credentials stay on your own machine.

## Install

**Homebrew** (macOS):

```sh
brew install buildaloudhq/tap/post
```

**npm** (macOS, Linux, Windows):

```sh
npm install -g @buildaloudhq/post
# or run it without installing:
npx @buildaloudhq/post
```

**Go** (any platform with Go 1.24+):

```sh
go install github.com/buildaloudhq/post@latest
```

**Prebuilt binaries:** download the archive for your platform from the [latest release](https://github.com/buildaloudhq/post/releases/latest).

Then check it's working:

```sh
post status
```

---

Work in progress.
