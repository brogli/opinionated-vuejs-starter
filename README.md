# vuejs-scaffold

This project serves as an opinionated baseline for Vue.js projects. The idea: It orients itself on the scaffolding from
Vuejs itself, using the features I need from that. On top of that I add even more:

- TypeScript
- Vue Router
- Pinia
- ESLint + Oxlint
- Oxfmt
- Vitest
- Playwright
- pnpm
- PrimeVue
- PrimeIcons
- Tailwind CSS
- Renovate

## Prerequisites

- **Node.js** — version pinned in `.nvmrc` (and enforced via `engines` in `package.json`). Use a version manager (`nvm`
  or `fnm`) so it picks up automatically:
  ```sh
  nvm install && nvm use   # reads .nvmrc
  # or
  fnm use                  # reads .nvmrc (fnm auto-switches on cd if configured)
  ```
- **pnpm** — version pinned via `packageManager` in `package.json`. Easiest path
  is [Corepack](https://nodejs.org/api/corepack.html), which ships with Node and will use the exact pinned version
  automatically:
  ```sh
  corepack enable
  ```
  Alternatively: `npm install -g pnpm` or follow the [pnpm install docs](https://pnpm.io/installation).

## Getting started

```sh
git clone <this-repo>
cd vuejs-scaffold
pnpm install
pnpm dev          # http://localhost:5173
```

## Scripts

| Command           | What it does                                         |
|-------------------|------------------------------------------------------|
| `pnpm dev`        | Vite dev server with HMR (`http://localhost:5173`)   |
| `pnpm build`      | Type-check + production build (runs in parallel)     |
| `pnpm preview`    | Serve the production build (`http://localhost:4173`) |
| `pnpm type-check` | `vue-tsc --build` only                               |
| `pnpm test:unit`  | Unit tests with Vitest (jsdom)                       |
| `pnpm test:e2e`   | End-to-end tests with Playwright                     |
| `pnpm lint`       | Runs oxlint then ESLint (both with `--fix`)          |
| `pnpm format`     | Formats `src/` with oxfmt                            |

### End-to-end tests

Playwright's test runner is installed by `pnpm install`. Browser binaries, however, live in a per-machine cache (`~/.cache/ms-playwright/`) and are shared across projects. Install them per [Playwright's docs](https://playwright.dev/docs/intro#installing-playwright) — once per machine, and again after any `@playwright/test` version bump:

```sh
pnpm exec playwright install --with-deps
```

Then:

```sh
# Run all e2e tests (will boot `pnpm dev` automatically)
pnpm test:e2e

# Common flags
pnpm test:e2e --project=chromium
pnpm test:e2e e2e/counter.spec.ts
pnpm test:e2e --debug
```

On CI, Playwright runs against the production preview (`pnpm preview` on port 4173), so `pnpm build` must run first.
