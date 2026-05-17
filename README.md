# Device Manager for BleBox

A dev-only, desktop-class web app for defining and editing **action
configurations** (input trigger → HTTP action) on BleBox Switch / Light Switch
devices over the local network. macOS, single user, v1.

## Requirements

- Node.js 24 LTS, Corepack enabled (`corepack enable`)
- A JRE (used by `openapi-generator-cli` during codegen)
- BleBox devices reachable on the LAN

## Setup & running

```sh
yarn install
yarn dev
```

`yarn dev` is the single entry point. It:

1. runs codegen once (`yarn codegen` — companion OpenAPI spec → typed client,
   plus a `typescript-fetch` client per BleBox device spec);
2. starts the **companion** service on `127.0.0.1:3001`;
3. starts the **web** app on `:5173`, with Vite proxying `/api` to the companion.

Open `http://localhost:5173`. Companion API docs: `http://localhost:3001/docs`.

Configuration is optional — copy `.env.example` to `.env` to override defaults.

Other scripts: `yarn lint`, `yarn typecheck`, `yarn test`, `yarn codegen`.

## Architecture

Yarn Berry workspace monorepo:

```
apps/web         Vite + React SPA — TanStack Router (file-based) / Query / Form,
                 shadcn UI (dark-only), Monaco JSON editor, Zustand
apps/companion   Fastify service — mDNS + subnet discovery and a CORS proxy
packages/shared  Zod schemas + types, enums, env schemas, BleBox OpenAPI specs,
                 generated API clients
```

**Why a companion service?** Browsers cannot do mDNS discovery and cannot reach
LAN devices directly (CORS / mixed content). The companion handles both:

- `GET /api/health`, `POST /api/discovery/start|stop`, `GET /api/discovery/devices`
- `POST /api/devices/probe` — validates a manually entered IP, fetches `/info`
- `ALL /api/proxy/:ip/*` — CORS proxy to a device; refuses non-private IPv4

All device traffic from the SPA goes through `/api/proxy/:ip/*`.

**Actions.** The action CRUD surface is undocumented by BleBox. Its shape was
reverse-engineered from a live device — see [`docs/action-shape.md`](docs/action-shape.md).
Actions live at `GET /api/actions/state` and save via `POST /api/actions/set`.
The save payload shape is **inferred and unverified** (noted in the docs).

**Editing flow.** The device page loads actions into an in-memory draft
(Zustand). The wizard and the schema-validated Monaco JSON editor both edit that
draft; **Save** persists it to the device. Both wizard action kinds — "BleBox
device action" and "Invoke URL (GET)" — persist as `actionType: 50` (HTTP GET).

## Documentation

- [`docs/action-shape.md`](docs/action-shape.md) — observed action JSON shape
- [`docs/decisions.md`](docs/decisions.md) — architecture decision records
- [`docs/samples/`](docs/samples) — redacted live-device captures

## Scope (v1)

In: discovery, manual add, per-input action listing/editing, wizard + JSON
editor, save to device. Out: drafts/undo history, cloud sync, non-switch device
families, production builds.
