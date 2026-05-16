# Decisions

Architecture decision records, newest first. This is a dev-only v1 for a single
user on macOS — choices favour pragmatism over generality.

## Actions live at their own endpoint, not in settings

The brief assumed actions live in `/api/settings/state`. On the live device they
do not — `/api/settings/state` has an empty `switch` object. Actions are at
`GET /api/actions/state` and saved via `POST /api/actions/set`. The device wins;
the app targets the actions endpoints. See [`action-shape.md`](./action-shape.md).

## `POST /api/actions/set` payload is inferred and unverified

Re-posting `{ actions: [...] }` returned HTTP 400; a follow-up single-slot probe
was blocked by the environment's device-write guard. The app assumes a
single-slot upsert `{ action: {...} }` (mirroring `/api/settings/set`). This is
the one piece of behaviour not verified end-to-end against hardware.

## Discovery: mDNS browse + active subnet sweep

BleBox publishes no mDNS service name. Discovery therefore combines an mDNS
`_http._tcp` browse (best-effort) with an active sweep of every local /24,
confirming each candidate with `GET /info`. The sweep is the reliable path; the
mDNS browse catches devices outside the swept subnets. Only switch/light device
types are surfaced. Room is left to swap in a specific service name later.

## Input count comes from `fieldsPreferences`, not `state/extended`

The live `switchBox` exposes no `inputs[]` in `/state/extended` (only `relays[]`).
Input count is derived from the distinct non-null `input` values in the
`triggerType` constraints (`deriveInputCount`). buttonBox still uses `inputs[]`.

## OpenAPI client codegen via a script, with post-processing

`@openapitools/openapi-generator-cli` (pinned via `openapitools.json`) generates
one `typescript-fetch` client per spec. A single config file cannot drive five
specs (companion + four device types), so `scripts/codegen.mjs` loops instead.
Generated output is post-processed: `// @ts-nocheck` is prepended (vendored code
is excluded from strict checks) and a `mapValues` helper is appended to each
`runtime.ts` (generator 7.22 omits it though the models import it). Generated
clients are committed so the SPA builds without re-running codegen.
Requires a JRE.

## BleBox device clients are committed, but the wizard uses a command catalog

The four device clients are generated and committed per the brief. However the
wizard's "BleBox device action" mode uses a small hand-curated `/s/...` command
catalog (`features/actions/blebox-commands.ts`) instead: the action endpoints
are undocumented (codegen cannot cover them) and the wizard needs only a handful
of relay/colour commands, for which a catalog is clearer than driving generated
fetch clients through a proxy base path.

## Companion routes mounted under `/api`

All companion routes live under `/api` (`/api/health`, `/api/discovery/*`,
`/api/devices/probe`, `/api/proxy/:ip/*`); OpenAPI UI at `/docs`. Vite proxies
`/api` to the companion so the SPA is same-origin in dev. This reconciles the
brief's endpoint table with its "Vite proxies /api" requirement.

## Yarn Berry with `node-modules` linker, Corepack-managed

`nodeLinker: node-modules` (Monaco, openapi-generator wrapper and various tools
prefer it). Yarn is run via Corepack (`packageManager` field) so there is no
committed `.yarn/releases` file.

## Tailwind v4 + shadcn (new-york, zinc), dark-only

Tailwind v4 with `@tailwindcss/vite`. shadcn components are hand-vendored
(no interactive CLI run). `class="dark"` is hardcoded on `<html>`; light-theme
CSS variables are kept so a future toggle is a one-line change.

## Monaco is bundled, not CDN-loaded

`@monaco-editor/react`'s loader is pointed at the bundled `monaco-editor` with
Vite `?worker` imports, so the JSON editor works without a network round-trip.
This makes the web build's main chunk large (~3.6 MB) — acceptable for a
dev-only tool; not optimised further.

## Gitignored generated metadata

`.openapi-generator/` directories inside the committed clients are ignored
(generator bookkeeping, not needed to build). `companion.openapi.json` and the
generated client source are committed.
