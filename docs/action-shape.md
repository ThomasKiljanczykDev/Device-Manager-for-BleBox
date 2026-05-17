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
| `POST` | `/api/actions/set` | Save. Takes one action at a time, `{ "action": {...} }` — see below. |

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
| `actionType` | observed | `0` = unconfigured. See action-types table below. |
| `triggerParam` | observed | Numeric parameter; meaningful for power triggers (`42`/`43`). |
| `intervalS`, `throttleS` | observed | Seconds; apply to power triggers (`42`/`43`). |
| `param` | observed | For `actionType 50` the HTTP GET URL (placeholders `{s_state.0}`, `{power_w.0}`); empty string for native switch actions (`1/2/3`). |
| `relay`, `forTime`, `ns` | observed | Present on some switchBox hardware (e.g. `192.168.88.188`, `hv …1.5…`), absent on others (`192.168.88.200`, `hv …1.4…`). Not edited by this app. |
| `lastCall` | observed | Server-managed runtime telemetry (`timeElapsedS`, optional `response`). **Read-only — stripped before save.** `timeElapsedS: -1` = never called. |

> **The action field set varies by device/firmware.** The app models the action
> as a *loose* object (`actionSchema` in `@blebox/shared`) and round-trips every
> field: a save sends the device's own object back with only the edited fields
> changed. Dropping device-specific fields (`relay`/`forTime`/`ns`) makes
> `/api/actions/set` reject the save with HTTP 400.

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

### Action types

| Value | Label | `param` | Source |
|---|---|---|---|
| 0 | Unconfigured | `""` | observed (empty slot) |
| 1 | Switch ON | `""` | observed on a live switchBox |
| 2 | Switch OFF | `""` | observed on a live switchBox |
| 3 | Toggle | `""` | observed on a live switchBox |
| 50 | HTTP GET | the URL | observed |

`1/2/3` are native actions on the device's own relay; `param` is empty (the
relay is implicit on single-relay switchBox). `fieldsPreferences` additionally
lists `7,8,9,10,51,52,53`, which this app does not yet handle.

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

## `POST /api/actions/set` payload — verified

`/api/actions/set` is **not** in any public BleBox OpenAPI spec, but the shape
was confirmed from the device's own built-in wBox UI bundle (`settings.js`
served at `http://<device>/settings.js`), which sends:

```js
payload: { action: n }   // n = one action object
```

So the endpoint takes **one action at a time**, wrapped as `{ "action": {...} }`:

```jsonc
POST /api/actions/set
{ "action": { "id": 0, "name": "...", "input": 0, "triggerType": 1,
              "actionType": 1, "relay": 0, "forTime": 0, "triggerParam": 0,
              "intervalS": 0, "throttleS": 0, "ns": 0, "param": "" } }
```

The action object must be **round-tripped** — sent back with the same fields the
device returned (including device-specific `relay`/`forTime`/`ns`), changing
only what the user edited. Posting the full `{ "actions": [ ... ] }` array, or a
single action missing device-specific fields, returns **HTTP 400**.

`saveAction` (`apps/web/src/lib/blebox.ts`) posts one request per changed slot;
`actionSetPayloadSchema` / `actionSchema` (`@blebox/shared`) model the payload.
