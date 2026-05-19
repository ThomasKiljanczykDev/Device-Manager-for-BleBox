# Device Manager for BleBox

A dev-only **Tauri desktop app** for defining and editing **action
configurations** (input trigger → HTTP action) on BleBox Switch / Light Switch
devices over the local network. macOS, single user, v1.

## Requirements

- A Rust toolchain — install via [rustup](https://rustup.rs)
- The Tauri CLI: `cargo install tauri-cli --version "^2.0" --locked`
- Node.js 24 LTS, with Corepack enabled (`corepack enable`)
- BleBox devices reachable on the LAN

## Setup & running

```sh
yarn --cwd js install   # install the React app's dependencies
yarn dev                # launch the desktop app
```

`yarn dev` runs `cargo tauri dev`, which builds the Rust backend, starts Vite
for the React frontend, and opens the app window. The first run compiles the
Rust dependency tree and takes a few minutes; later runs are fast.

Build a distributable `.app` / `.dmg` with `yarn build` (output under
`rust/target/release/bundle/macos/`).

Configuration is optional — see `.env.example` for the two timeout overrides;
export them in your shell before launching if you want non-default values.

Other scripts (run from `js/`): `yarn --cwd js lint`, `… typecheck`, `… test`.
Rust checks: `cargo test`, `cargo clippy` (run inside `rust/`).

## Architecture

A single Tauri 2.x desktop app with two top-level directories:

```
js/    Vite + React SPA — TanStack Router (file-based) / Query / Form,
       shadcn UI (dark-only), Monaco JSON editor, Zustand
rust/  Tauri 2.x crate — mDNS + subnet discovery, a typed HTTP client to
       BleBox devices, and the commands the frontend invokes
```

**Why a Rust backend?** Browsers cannot do mDNS discovery and cannot reach LAN
devices directly (CORS / mixed content). The Rust side handles both, exposing
[Tauri commands](https://v2.tauri.app/develop/calling-rust/) the React app calls
via `invoke()`:

- `start_discovery` / `stop_discovery` / `get_discovered_devices`
- `probe_device` — validates a manually entered IP, fetches `/info`
- `device_info`, `device_state_extended`, `device_actions_state`,
  `device_save_action`, `device_network`, `device_set_network` — one typed
  command per BleBox operation; each refuses non-private IPv4

`tauri-specta` generates `js/src/bindings.ts` from the Rust command signatures
on every debug run; it is committed so the frontend type-checks without a Rust
build. Device JSON crosses the boundary as strings and is validated on the
frontend with Zod (see [`docs/decisions.md`](docs/decisions.md)).

**Actions.** The action CRUD surface is undocumented by BleBox. Its shape was
reverse-engineered from a live device — see [`docs/action-shape.md`](docs/action-shape.md).
Actions live at `device_actions_state` and save via `device_save_action`. The
save payload shape is **inferred and unverified** (noted in the docs).

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
families.
