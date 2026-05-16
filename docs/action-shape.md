# BleBox action JSON shape

The action / trigger CRUD surface is **not** in any public BleBox OpenAPI spec.
This document records the shape observed on a live device and notes, per field,
whether it is documented publicly or inferred from the device.

- **Device:** `192.168.88.200` — `switchBox` "SimonGO Kitchen", `apiLevel`
  `20220505`, `product` `SimonGOSwitch` (5 physical inputs, 1 relay).
- **Full capture:** [`samples/actions-state.json`](./samples/actions-state.json)
  (webhook IDs in `param` redacted).

## Endpoints

| Method | Path | Notes |
|---|---|---|
| `GET` | `/api/actions/state` | Returns the actions array + `fieldsPreferences`. Confirmed on device. |
| `POST` | `/api/actions/set` | Save. `GET` returns `405`, so `POST` is the write verb. **Payload shape inferred — see below.** |

Actions do **not** appear in `/api/settings/state` (that endpoint's `switch`
object is empty) — they have their own endpoint.

## `GET /api/actions/state` response

```jsonc
{
  "actions": [ /* fixed array of `itemsLimit` slots */ ],
  "itemsLimit": 30,
  "fieldsPreferences": [ /* constraint engine, see below */ ]
}
```

### Action object

A configured slot (from the live capture):

```json
{
  "id": 0,
  "name": "IN1 - OUT OFF",
  "input": 0,
  "triggerType": 1,
  "actionType": 50,
  "triggerParam": 0,
  "intervalS": 0,
  "throttleS": 0,
  "param": "http://192.168.88.217:8123/api/webhook/REDACTED?action=off",
  "lastCall": { "timeElapsedS": -1 }
}
```

An empty slot omits `triggerParam`/`intervalS`/`throttleS`:

```json
{ "id": 4, "name": "", "input": 0, "triggerType": 0, "actionType": 0, "param": "", "lastCall": { "timeElapsedS": -1 } }
```

| Field | Source | Meaning |
|---|---|---|
| `id` | observed | Slot index `0…itemsLimit-1`. The array is fixed-length. |
| `name` | observed | User label. Empty on unconfigured slots. |
| `input` | observed | Physical input index the trigger is bound to. |
| `triggerType` | `1–5` documented (buttonBox `/t/{inputId}/{triggerType}`); `0`, `19`, `42`, `43` observed | `0` = unconfigured. See table below. |
| `actionType` | observed | `50` = HTTP GET (the only type this app writes). `0` = unconfigured. |
| `triggerParam` | observed | Numeric parameter; meaningful for power triggers (`42`/`43`). |
| `intervalS`, `throttleS` | observed | Seconds; apply to power triggers (`42`/`43`). |
| `param` | observed | The HTTP GET URL. Supports placeholders `{s_state.0}`, `{power_w.0}`. |
| `lastCall` | observed | Server-managed runtime telemetry (`timeElapsedS`, optional `response`). **Read-only — stripped before save.** `timeElapsedS: -1` = never called. |

### Trigger types

| Value | Label | Source |
|---|---|---|
| 0 | Unconfigured | observed (empty slot) |
| 1 | Short click | documented |
| 2 | Long click | documented |
| 3 | Falling edge | documented |
| 4 | Rising edge | documented |
| 5 | Any edge | documented |
| 19 | Device event | observed/inferred (device-level trigger, `input: null`) |
| 42 | Power above threshold | observed/inferred (`triggerParam` = watts, `0–3680`) |
| 43 | Power below threshold | observed/inferred |

### `fieldsPreferences` — the constraint engine

A polymorphic, `name`-keyed array. It drives the wizard so nothing is
hardcoded. Observed entries:

- `triggerType` — `values` + per-`input` `constraints` (e.g. `input: 0 →
  [1,2,3,4,5]`, `input: null → [19,42,43]`). Distinct non-null `input` values
  give the **physical input count** (here `0–4` ⇒ 5 inputs) — `switchBox`
  `/state/extended` has no `inputs[]`, so this is the reliable source.
- `actionType` — allowed values per `triggerType`.
- `triggerParam` — numeric range per `triggerType` (`42`/`43` → `0–3680`).
- `param` — `placeholders` (`{s_state.0}`, `{power_w.0}`).
- `intervalS` / `throttleS` — `dependsOnValues: [42, 43]`.

The shared helpers `allowedTriggerTypes`, `allowedActionTypes`,
`triggerParamRange`, `triggerUsesInterval`, `deriveInputCount` interpret it.

## `POST /api/actions/set` payload — INFERRED, UNVERIFIED

This shape could not be confirmed on hardware:

- Re-posting the full `{ "actions": [ ... ] }` array returned **HTTP 400**.
- A second probe (`{ "action": { ... } }`, a single-slot upsert) was blocked by
  the environment's write-safety guard before it could run.

The app therefore assumes a **single-slot upsert**, mirroring the documented
`/api/settings/set` convention (`{ "settings": {...} }` → `{ "action": {...} }`):

```jsonc
POST /api/actions/set
{ "action": { "id": 0, "name": "...", "input": 0, "triggerType": 1,
              "actionType": 50, "triggerParam": 0, "intervalS": 0,
              "throttleS": 0, "param": "http://..." } }
```

`saveActions` posts one such request per changed slot. **Confirm this against a
real device** — `actionSetPayloadSchema` in `@blebox/shared` and `saveAction`
in `apps/web/src/lib/blebox.ts` are the two places to adjust if it differs.
