# Opinionated Vue.js Starter

This project serves as an opinionated baseline for Vue.js projects. The idea: It orients itself on the scaffolding from
VueJs itself, using the features I need from that. On top of that I add even more:

## Features

### From VueJs Scaffolding

- TypeScript
- Vue Router
- Pinia
- ESLint + Oxlint
- Oxfmt
- Vitest
- Playwright

### Package Manager

- pnpm

### Component Library

- OpenVue (MIT fork of PrimeVue 4)
- OpenIcons

### CSS

- Tailwind CSS
- Stylelint

### Repo wide linting and formatting

- treefmt

### Dependency management

- Renovate

### Dev-Env and CI Env

- direnv
- Nix shell

## Prerequisites

- [Nix package manager](https://nixos.org/download/) (runs on any Linux, macOS or WSL; NixOS is not needed) with
  flakes enabled
- [direnv](https://direnv.net/) hooked into your shell
- Optional: [nix-direnv](https://github.com/nix-community/nix-direnv), which caches the dev shell (instant `cd` instead
  of a re-evaluation) and protects it from `nix-collect-garbage`

Node.js and pnpm come from the dev shell in `flake.nix`, pinned via `flake.lock`. On first `cd` into the repo run
`direnv allow`; afterwards the shell loads automatically. Without direnv: `nix develop`.

## Getting started

```sh
git clone <this-repo>
cd opinionated-vuejs-starter
direnv allow
pnpm install
pnpm dev          # http://localhost:5173
```

## Scripts

| Command           | What it does                                         |
| ----------------- | ---------------------------------------------------- |
| `pnpm dev`        | Vite dev server with HMR (`http://localhost:5173`)   |
| `pnpm build`      | Type-check + production build (runs in parallel)     |
| `pnpm preview`    | Serve the production build (`http://localhost:4173`) |
| `pnpm type-check` | `vue-tsc --build` only                               |
| `pnpm test:unit`  | Unit tests with Vitest (jsdom)                       |
| `pnpm test:e2e`   | End-to-end tests with Playwright                     |
| `pnpm lint`       | oxlint, ESLint, Stylelint in sequence (`--fix`)      |
| `pnpm format`     | Formats `src/` with oxfmt                            |
| `treefmt`         | Repo-wide: lint fixes + oxfmt (incl. `.md`), nixfmt  |

### End-to-end tests

Playwright's test runner is installed by `pnpm install`. Browser binaries, however, live in a per-machine cache (`~/.cache/ms-playwright/`) and are shared across projects. Install them per [Playwright's docs](https://playwright.dev/docs/intro#installing-playwright) — once per machine, and again after any `@playwright/test` version bump:

```sh
pnpm exec playwright install --with-deps chromium
```

This doesn't work on NixOS hosts (no apt, and the downloaded browsers aren't built for NixOS); there, provide
the browsers via nixpkgs' `playwright-driver.browsers` matching the `@playwright/test` version.

Then:

```sh
# Run all e2e tests (will boot `pnpm dev` automatically)
pnpm test:e2e

# Common flags
pnpm test:e2e e2e/counter.spec.ts
pnpm test:e2e --debug
```

On CI, Playwright runs against the production preview (`pnpm preview` on port 4173), so `pnpm build` must run first.
