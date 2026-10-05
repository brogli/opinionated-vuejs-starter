# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

Template / scaffolding for Vue 3 SPAs. Intended to be cloned as a starting point, not developed as an application. When
extending it, prefer minimal, idiomatic additions that stay useful across future projects.

## Package manager

Use **pnpm** exclusively. Do not introduce `npm`/`yarn` lockfiles. Node and pnpm come from the Nix dev shell in
`flake.nix` (`nodejs_24`, `pnpm_11` from `nixos-unstable`), loaded via direnv (`.envrc`) locally and via
`nix develop` in CI. Do not add `.nvmrc`, `engines` or `packageManager` — `flake.lock` is the single source of truth.
When bumping the Node major, update `nodejs_*` and `@tsconfig/node*` in one change.

## Commands

- `pnpm dev` — Vite dev server on `http://localhost:5173`
- `pnpm build` — runs `type-check` and `build-only` in parallel (`vue-tsc --build` + `vite build`)
- `pnpm preview` — serve the production build on `http://localhost:4173`
- `pnpm type-check` — `vue-tsc --build` only
- `pnpm test:unit` — Vitest (jsdom). Append a path/pattern to run a subset, e.g. `pnpm test:unit HelloWorld`
- `pnpm test:e2e` — Playwright. Chromium comes from the Nix dev shell (`playwright-driver.browsers` via `PLAYWRIGHT_BROWSERS_PATH` in `flake.nix`); do not run `playwright install`. Its version must equal `@playwright/test`, so bump both in one change. Only the Chromium project is configured. Useful flags: `--debug`, or pass a spec path.
- `pnpm lint` — runs `lint:oxlint`, `lint:eslint`, `lint:stylelint` sequentially (all with `--fix`)
- `pnpm format` — `oxfmt src/`
- `treefmt` — repo-wide lint fixes + formatting (see below); `treefmt --ci` is the CI check (fails on unformatted files
  or lint errors)

## Linting & formatting

This project uses the **oxc toolchain (oxlint + oxfmt), not Prettier**. Do not add Prettier or a Prettier config;
`eslint-config-prettier` is only pulled in via `skipFormatting` to disable ESLint's stylistic rules so oxfmt owns
formatting.

Lint pipeline (see `eslint.config.ts`):

1. `oxlint` runs first as a fast pass driven by `.oxlintrc.json` (correctness category as error, plugins:
   eslint/typescript/unicorn/oxc/vue/vitest).
2. `eslint` runs second with Vue + TS configs, plus Playwright rules scoped to `e2e/**` and Vitest rules scoped to
   `src/**/__tests__/*`. `eslint-plugin-oxlint` disables ESLint rules that oxlint already covers to avoid
   double-reporting.
3. `stylelint` lints CSS and `.vue` `<style>` blocks (`stylelint.config.mjs`: standard + standard-vue + Tailwind v4
   at-rules). Linting only — oxfmt owns formatting. It does not read `.gitignore` itself, hence `--ignore-path`.

`treefmt.toml` is the repo-wide alternative to the pnpm scripts, which stay as create-vue ships them:
oxlint/eslint/stylelint → oxfmt (lower `priority` runs first) over `*.vue`/`*.ts`/`*.css`, oxfmt over `*.md`, nixfmt
over `*.nix`. JS tools run via `pnpm exec` so versions stay in `pnpm-lock.yaml`; `treefmt` and `nixfmt` come from the nix
shell. Keep treefmt's oxfmt includes a superset of the file types under `src/`, so it covers everything `pnpm format`
does.

Formatting config lives in `.oxfmtrc.json` (no semicolons, single quotes). Keep this in sync with any editor settings.

## Architecture

Standard Vite + Vue 3 SFC setup. Entry point `src/main.ts` wires up Pinia, Vue Router, and OpenVue into the root
`App.vue` before mounting to `#app`.

**OpenVue** (MIT fork of PrimeVue 4.5.5, same API; styled mode) with a **project preset in `src/theme/preset.ts`** that
extends Aura from `@openuxkit/themes` via `definePreset`. Do not add `primevue`, `@primeuix/*` or `primeicons` — they
are no longer MIT. Icons come from `@openvue/openicons` (`oi oi-*` classes).
All OpenVue design-token overrides live in that file — do not inline theme tweaks in `main.ts` or in component styles.
Components are **imported explicitly per-file**, not registered globally.
Services like `ToastService`, `ConfirmationService`, `DialogService` must be registered in `main.ts` with `app.use(...)`
before their components/composables work.

**Tailwind CSS v4** is the styling layer (no hand-written CSS for features). Setup:

- `@tailwindcss/vite` plugin in `vite.config.ts` — CSS-first config, no `tailwind.config.js`.
- `src/assets/main.css` is the only stylesheet: it declares the CSS layer order and imports Tailwind plus
  `tailwindcss-primeui` (MIT; OpenVue keeps the `p` token prefix, so it exposes OpenVue theme tokens as Tailwind
  utilities like `bg-primary`, `text-surface-500`).
- CSS layer order is `theme, base, openvue, components, utilities`, mirrored in `main.ts` via `cssLayer` in OpenVue
  options. This guarantees Tailwind utilities override OpenVue component styles when both apply.
- Prefer Tailwind utilities over scoped `<style>` blocks. Reserve `<style>` only for things Tailwind can't express
  cleanly (keyframes, complex selectors).

- **Routing** (`src/router/index.ts`): `createWebHistory` with `import.meta.env.BASE_URL`. The home route is statically
  imported; other views should be lazy-loaded with dynamic `import()` to preserve route-level code splitting. Every
  route needs `meta.title`; `App.vue` feeds it to VueUse's `useTitle` for the document title.
- **VueUse** (`@vueuse/core`): prefer its composables over hand-rolled browser/state utilities.
- **State** (`src/stores/`): Pinia setup stores (composition-API style with `ref`/`computed`), one store per file, named
  `useXxxStore`.
- **Views vs components**: `src/views/` holds route targets; `src/components/` holds reusable pieces. Component unit
  tests live next to the component in `src/components/__tests__/*.spec.ts`.
- **Path alias**: `@` resolves to `src/` (configured in `vite.config.ts` and the TS configs).

## TypeScript conventions

**Type everything strictly. No `any`, no implicit `any`, no escape hatches without a comment explaining why.**

Concretely:

- **No `any`** — reach for `unknown` and narrow, or model the actual shape. If `any` is genuinely unavoidable (
  third-party typing gap, etc.), annotate with a `// why:` comment.
- **No non-null assertions (`!`) or `as` casts** unless justified by a short comment. Prefer refactoring to make the
  type flow correct.
- **Exported APIs** (functions, composables, store actions) must have explicit parameter and return types. Local
  variables and small internal helpers can rely on inference.
- **Vue SFCs**: use the type-based forms — `defineProps<Props>()`, `defineEmits<{ change: [value: string] }>()`,
  `withDefaults(defineProps<Props>(), { ... })`. Do not use the runtime object form.
- **Pinia stores**: explicitly type `ref<T>(...)`, getter return types, and action signatures. Don't rely on `any`
  leaking in through untyped initial values.
- **Router**: type `RouteMeta` via module augmentation (`declare module 'vue-router'`) when adding meta fields, so
  `to.meta.*` stays typed end-to-end.
- **Event handlers and template refs**: type them (`Ref<HTMLInputElement | null>`, `(e: MouseEvent) => void`). No
  inferred `any` from DOM callbacks.
- **External data** (fetch responses, `JSON.parse`, `localStorage`): treat as `unknown` at the boundary and
  validate/narrow before use.

`pnpm type-check` must pass with zero errors or warnings before any commit.

## TypeScript project references

`tsconfig.json` is a solution file referencing three sub-projects:

- `tsconfig.app.json` — app sources under `src/`
- `tsconfig.node.json` — Vite/tooling config files
- `tsconfig.vitest.json` — Vitest-specific overlay

`vue-tsc --build` walks all references. When adding new top-level TS files (config, scripts), make sure they're covered
by one of the sub-projects or type-check will ignore them.

## E2E specifics

`playwright.config.ts` switches behavior on `process.env.CI`:

- Local: runs against `pnpm dev` on port 5173, headed, no retries.
- CI: runs against `pnpm preview` on port 4173 (so `pnpm build` must run first), headless, 2 retries, 1 worker,
  `forbidOnly` enforced.

Playwright's `webServer` reuses an already-running dev server locally, so `pnpm dev` in another terminal is fine.

## Renovate

`renovate.json` extends `config:best-practices` (digest pinning, abandonment detection, weekly lockfile maintenance). Policy:

- **Auto-merge**: minor/patch/pin/digest on ≥1.0.0; lockfile maintenance.
- **Manual**: majors; any 0.x minor/patch (semver treats 0.minor as potentially breaking). The 0.x exclusion rule must come **last** in `packageRules` to override the general automerge rule — Renovate applies later rules with higher priority.
- `minimumReleaseAge: 7 days` as supply-chain buffer.
- `nix` manager enabled: `flake.lock` refreshes via lockfile maintenance, gated by CI. The majors stay fixed by the
  attribute names (`nodejs_24`, `pnpm_11`); bumping them is manual.
- `@playwright/test` is manual: it must match nixpkgs' `playwright-driver` (see Commands).
- `platformAutomerge: false` is deliberate — GitHub's native auto-merge has not worked reliably here. Do not remove it.

Requires the Mend GitHub App on the consuming repo; cloning the scaffold does not enable it.
