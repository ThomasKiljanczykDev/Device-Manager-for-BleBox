//! Tauri commands — the IPC surface that replaces the Fastify companion's HTTP
//! routes. See `docs/decisions.md` → "Companion → Tauri command mapping".
//!
//! Device payloads cross the boundary as JSON **strings**: the BleBox shapes
//! are deliberately loose (actions must round-trip unknown fields intact), and
//! `serde_json::Value` has no `specta::Type` impl. The frontend `JSON.parse`s
//! and re-validates every payload with its Zod schemas.

use serde_json::{json, Value};
use tauri::State;

use crate::config::Config;
use crate::discovery::DiscoveryService;
use crate::error::CommandError;
use crate::{http, net};

fn guard_ip(ip: &str) -> Result<(), CommandError> {
    if net::is_private_ipv4(ip) {
        Ok(())
    } else {
        Err(CommandError::invalid_ip())
    }
}

fn to_json(value: &impl serde::Serialize) -> Result<String, CommandError> {
    serde_json::to_string(value)
        .map_err(|e| CommandError::new("SERIALIZE", format!("Could not serialize payload: {e}")))
}

fn parse_json(raw: &str) -> Result<Value, CommandError> {
    serde_json::from_str(raw)
        .map_err(|e| CommandError::new("INVALID_JSON", format!("Malformed JSON payload: {e}")))
}

// --- discovery -------------------------------------------------------------
// Replaces POST /discovery/start|stop and GET /discovery/devices.

#[tauri::command]
#[specta::specta]
pub fn start_discovery(service: State<'_, DiscoveryService>, config: State<'_, Config>) {
    service.start(*config.inner());
}

#[tauri::command]
#[specta::specta]
pub fn stop_discovery(service: State<'_, DiscoveryService>) {
    service.stop();
}

/// Current scan state and discovered devices, as a JSON-encoded
/// `{ scanning, devices }` document.
#[tauri::command]
#[specta::specta]
pub fn get_discovered_devices(
    service: State<'_, DiscoveryService>,
) -> Result<String, CommandError> {
    to_json(&service.snapshot())
}

// --- manual add ------------------------------------------------------------
// Replaces POST /devices/probe.

/// Validates an IP and probes it for a BleBox `/info` payload. Returns the
/// `device` object as a JSON string on success.
#[tauri::command]
#[specta::specta]
pub async fn probe_device(ip: String, config: State<'_, Config>) -> Result<String, CommandError> {
    guard_ip(&ip)?;
    match http::get_info(&ip, config.probe_timeout_ms).await {
        Ok(body) => to_json(&body.get("device").cloned().unwrap_or(Value::Null)),
        Err(http::ProbeError::Timeout) => Err(CommandError::new(
            "DEVICE_TIMEOUT",
            "No response from the device in time",
        )),
        Err(http::ProbeError::Invalid) => Err(CommandError::new(
            "NOT_BLEBOX",
            "Host responded but is not a BleBox device",
        )),
        Err(http::ProbeError::Unreachable) => Err(CommandError::new(
            "DEVICE_UNREACHABLE",
            "Could not reach a host at this address",
        )),
    }
}

// --- device data -----------------------------------------------------------
// Replaces the wildcard /proxy/:ip/* route with one typed command per call.
// Each returns the device's raw JSON response as a string.

#[tauri::command]
#[specta::specta]
pub async fn device_info(ip: String, config: State<'_, Config>) -> Result<String, CommandError> {
    guard_ip(&ip)?;
    let body = http::device_get(&ip, "info", config.proxy_timeout_ms()).await?;
    to_json(&body)
}

#[tauri::command]
#[specta::specta]
pub async fn device_state_extended(
    ip: String,
    config: State<'_, Config>,
) -> Result<String, CommandError> {
    guard_ip(&ip)?;
    let body = http::device_get(&ip, "state/extended", config.proxy_timeout_ms()).await?;
    to_json(&body)
}

#[tauri::command]
#[specta::specta]
pub async fn device_actions_state(
    ip: String,
    config: State<'_, Config>,
) -> Result<String, CommandError> {
    guard_ip(&ip)?;
    let body = http::device_get(&ip, "api/actions/state", config.proxy_timeout_ms()).await?;
    to_json(&body)
}

/// Persists one action via `POST /api/actions/set` (single-action upsert).
/// `action` is the JSON-encoded action object.
#[tauri::command]
#[specta::specta]
pub async fn device_save_action(
    ip: String,
    action: String,
    config: State<'_, Config>,
) -> Result<(), CommandError> {
    guard_ip(&ip)?;
    let action = parse_json(&action)?;
    http::device_post(
        &ip,
        "api/actions/set",
        json!({ "action": action }),
        config.proxy_timeout_ms(),
    )
    .await
}

// --- service connection ----------------------------------------------------
// The device's internal access point (the "Service Connection" panel).

#[tauri::command]
#[specta::specta]
pub async fn device_network(
    ip: String,
    config: State<'_, Config>,
) -> Result<String, CommandError> {
    guard_ip(&ip)?;
    let body = http::device_get(&ip, "api/device/network", config.proxy_timeout_ms()).await?;
    to_json(&body)
}

/// Updates the device's internal access point. `settings` is the JSON-encoded
/// `network` object.
#[tauri::command]
#[specta::specta]
pub async fn device_set_network(
    ip: String,
    settings: String,
    config: State<'_, Config>,
) -> Result<(), CommandError> {
    guard_ip(&ip)?;
    let settings = parse_json(&settings)?;
    http::device_post(
        &ip,
        "api/device/set",
        json!({ "network": settings }),
        config.proxy_timeout_ms(),
    )
    .await
}

// --- device settings -------------------------------------------------------
// The /api/settings/* surface — currently used for the cloud-tunnel toggle.
// Writes are partial: the device merges the sub-object you send with the rest.

#[tauri::command]
#[specta::specta]
pub async fn device_settings_state(
    ip: String,
    config: State<'_, Config>,
) -> Result<String, CommandError> {
    guard_ip(&ip)?;
    let body = http::device_get(&ip, "api/settings/state", config.proxy_timeout_ms()).await?;
    to_json(&body)
}

/// Updates device settings. `settings` is the JSON-encoded inner object —
/// e.g. `{"tunnel":{"enabled":1}}` — and is sent wrapped as
/// `{"settings": <settings>}` to `POST /api/settings/set`.
#[tauri::command]
#[specta::specta]
pub async fn device_settings_set(
    ip: String,
    settings: String,
    config: State<'_, Config>,
) -> Result<(), CommandError> {
    guard_ip(&ip)?;
    let settings = parse_json(&settings)?;
    http::device_post(
        &ip,
        "api/settings/set",
        json!({ "settings": settings }),
        config.proxy_timeout_ms(),
    )
    .await
}
