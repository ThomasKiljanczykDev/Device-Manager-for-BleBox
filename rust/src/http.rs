//! HTTP access to BleBox devices.
//!
//! Ports the companion's `blebox.ts` probe and its `routes/proxy.ts` retry
//! policy: GET is idempotent, so transient connection resets (BleBox firmware
//! sends `Connection: close` and resets reused sockets) are retried; timeouts
//! and non-idempotent requests are not.

use std::time::Duration;

use serde_json::Value;

use crate::error::CommandError;

/// Why probing a host's `/info` endpoint failed.
#[derive(Debug)]
pub enum ProbeError {
    /// The request exceeded its time budget.
    Timeout,
    /// The host could not be reached.
    Unreachable,
    /// The host answered but is not a recognisable BleBox device.
    Invalid,
}

/// A fresh, non-pooled client. BleBox embedded servers reset reused sockets,
/// so a new connection per call is the reliable path.
fn client() -> reqwest::Client {
    reqwest::Client::builder()
        .pool_max_idle_per_host(0)
        .build()
        .expect("failed to build HTTP client")
}

/// `GET http://{ip}/info` — the canonical BleBox identification endpoint.
///
/// Returns the full `/info` body. Single attempt, classifying the failure so
/// callers can surface a precise message (mirrors the companion's `probeDevice`).
pub async fn get_info(ip: &str, timeout_ms: u64) -> Result<Value, ProbeError> {
    let url = format!("http://{ip}/info");
    match client()
        .get(&url)
        .timeout(Duration::from_millis(timeout_ms))
        .send()
        .await
    {
        Ok(res) => {
            if !res.status().is_success() {
                return Err(ProbeError::Invalid);
            }
            match res.json::<Value>().await {
                Ok(body) if body.get("device").and_then(|d| d.get("id")).is_some() => Ok(body),
                _ => Err(ProbeError::Invalid),
            }
        }
        Err(e) if e.is_timeout() => Err(ProbeError::Timeout),
        Err(_) => Err(ProbeError::Unreachable),
    }
}

/// `GET http://{ip}/{path}` — idempotent, so transient connection errors are
/// retried up to three times with an `80ms * attempt` backoff. Timeouts are
/// never retried.
pub async fn device_get(ip: &str, path: &str, timeout_ms: u64) -> Result<Value, CommandError> {
    let url = format!("http://{ip}/{}", path.trim_start_matches('/'));
    let max_attempts = 3u32;
    for attempt in 1..=max_attempts {
        match client()
            .get(&url)
            .timeout(Duration::from_millis(timeout_ms))
            .send()
            .await
        {
            Ok(res) => {
                let status = res.status();
                let body = res.json::<Value>().await.unwrap_or(Value::Null);
                return if status.is_success() {
                    Ok(body)
                } else {
                    Err(CommandError::device_status(status.as_u16()))
                };
            }
            Err(e) if e.is_timeout() => return Err(CommandError::device_timeout()),
            Err(_) if attempt < max_attempts => {
                tokio::time::sleep(Duration::from_millis(80 * attempt as u64)).await;
            }
            Err(_) => return Err(CommandError::proxy_failed()),
        }
    }
    Err(CommandError::proxy_failed())
}

/// `POST http://{ip}/{path}` with a JSON body. Non-idempotent — never retried.
pub async fn device_post(
    ip: &str,
    path: &str,
    body: Value,
    timeout_ms: u64,
) -> Result<(), CommandError> {
    let url = format!("http://{ip}/{}", path.trim_start_matches('/'));
    match client()
        .post(&url)
        .timeout(Duration::from_millis(timeout_ms))
        .json(&body)
        .send()
        .await
    {
        Ok(res) => {
            if res.status().is_success() {
                Ok(())
            } else {
                Err(CommandError::device_status(res.status().as_u16()))
            }
        }
        Err(e) if e.is_timeout() => Err(CommandError::device_timeout()),
        Err(_) => Err(CommandError::proxy_failed()),
    }
}

#[cfg(test)]
mod live_tests {
    //! Integration checks against the known live device. Excluded from normal
    //! runs (they need the device on the LAN); run with `cargo test -- --ignored`.
    use super::*;

    const LIVE_IP: &str = "192.168.88.200";

    #[tokio::test]
    #[ignore = "requires the live BleBox device on the LAN"]
    async fn probes_live_device_info() {
        let body = get_info(LIVE_IP, 1_500).await.expect("probe /info");
        assert_eq!(body["device"]["type"], "switchBox");
        assert!(body["device"]["id"].is_string());
    }

    #[tokio::test]
    #[ignore = "requires the live BleBox device on the LAN"]
    async fn fetches_every_proxied_get_endpoint() {
        for path in [
            "info",
            "state/extended",
            "api/actions/state",
            "api/device/network",
            "api/settings/state",
        ] {
            device_get(LIVE_IP, path, 6_000)
                .await
                .unwrap_or_else(|e| panic!("GET /{path} failed: {e}"));
        }
    }

    /// Round-trip the cloud-tunnel toggle: read, flip, assert sibling settings
    /// are preserved (partial update), then restore the original value.
    #[tokio::test]
    #[ignore = "requires the live BleBox device on the LAN"]
    async fn tunnel_round_trip_preserves_sibling_settings() {
        let before = device_get(LIVE_IP, "api/settings/state", 6_000)
            .await
            .expect("read settings");
        let original = before["settings"]["tunnel"]["enabled"]
            .as_i64()
            .expect("tunnel.enabled is an integer");
        let flipped = 1 - original;

        let restore = serde_json::json!({
            "settings": { "tunnel": { "enabled": original } }
        });

        let result: Result<(), String> = async {
            device_post(
                LIVE_IP,
                "api/settings/set",
                serde_json::json!({ "settings": { "tunnel": { "enabled": flipped } } }),
                6_000,
            )
            .await
            .map_err(|e| format!("flip POST: {e}"))?;

            let mid = device_get(LIVE_IP, "api/settings/state", 6_000)
                .await
                .map_err(|e| format!("re-read: {e}"))?;
            if mid["settings"]["tunnel"]["enabled"].as_i64() != Some(flipped) {
                return Err("flip did not take".into());
            }
            for key in [
                "deviceName",
                "statusLed",
                "buttonsBacklight",
                "relays",
                "switch",
                "powerMeasuring",
            ] {
                if mid["settings"][key] != before["settings"][key] {
                    return Err(format!("sibling setting `{key}` changed across a partial update"));
                }
            }
            Ok(())
        }
        .await;

        // Always try to restore, even if the assertions above failed.
        let _ = device_post(LIVE_IP, "api/settings/set", restore, 6_000).await;
        let after = device_get(LIVE_IP, "api/settings/state", 6_000)
            .await
            .expect("read settings after restore");
        assert_eq!(
            after["settings"]["tunnel"]["enabled"].as_i64(),
            Some(original),
            "tunnel.enabled was not restored to its original value"
        );

        if let Err(msg) = result {
            panic!("{msg}");
        }
    }

    /// Toggle relay 0, assert the flip, restore. Briefly switches the load.
    #[tokio::test]
    #[ignore = "requires the live BleBox device on the LAN"]
    async fn relay_round_trip() {
        let before = device_get(LIVE_IP, "state/extended", 6_000)
            .await
            .expect("read state");
        let original = before["relays"][0]["state"]
            .as_i64()
            .expect("relays[0].state is an integer");
        let flipped = 1 - original;

        let restore = serde_json::json!({ "relays": [{ "relay": 0, "state": original }] });

        let result: Result<(), String> = async {
            device_post(
                LIVE_IP,
                "state",
                serde_json::json!({ "relays": [{ "relay": 0, "state": flipped }] }),
                6_000,
            )
            .await
            .map_err(|e| format!("flip POST: {e}"))?;

            let mid = device_get(LIVE_IP, "state/extended", 6_000)
                .await
                .map_err(|e| format!("re-read: {e}"))?;
            if mid["relays"][0]["state"].as_i64() != Some(flipped) {
                return Err("flip did not take".into());
            }
            Ok(())
        }
        .await;

        let _ = device_post(LIVE_IP, "state", restore, 6_000).await;
        let after = device_get(LIVE_IP, "state/extended", 6_000)
            .await
            .expect("read after restore");
        assert_eq!(
            after["relays"][0]["state"].as_i64(),
            Some(original),
            "relays[0].state was not restored",
        );

        if let Err(msg) = result {
            panic!("{msg}");
        }
    }

    /// Rename the device to a probe name, assert, restore the original.
    #[tokio::test]
    #[ignore = "requires the live BleBox device on the LAN"]
    async fn device_name_round_trip() {
        let before = device_get(LIVE_IP, "api/settings/state", 6_000)
            .await
            .expect("read settings");
        let original = before["settings"]["deviceName"]
            .as_str()
            .expect("deviceName is a string")
            .to_string();
        let probe_name = format!("{}_t", &original[..original.len().min(29)]);

        let restore = serde_json::json!({
            "settings": { "deviceName": original.clone() }
        });

        let result: Result<(), String> = async {
            device_post(
                LIVE_IP,
                "api/settings/set",
                serde_json::json!({ "settings": { "deviceName": probe_name.clone() } }),
                6_000,
            )
            .await
            .map_err(|e| format!("rename POST: {e}"))?;

            let mid = device_get(LIVE_IP, "api/settings/state", 6_000)
                .await
                .map_err(|e| format!("re-read: {e}"))?;
            if mid["settings"]["deviceName"].as_str() != Some(probe_name.as_str()) {
                return Err("rename did not take".into());
            }
            Ok(())
        }
        .await;

        let _ = device_post(LIVE_IP, "api/settings/set", restore, 6_000).await;
        let after = device_get(LIVE_IP, "api/settings/state", 6_000)
            .await
            .expect("read after restore");
        assert_eq!(
            after["settings"]["deviceName"].as_str(),
            Some(original.as_str()),
            "deviceName was not restored",
        );

        if let Err(msg) = result {
            panic!("{msg}");
        }
    }

    /// Flip `powerMeasuring.enabled` via a *nested* partial body and assert
    /// the sibling sub-fields (`safetyValue`, `factoryCalibration`) are
    /// preserved byte-identical. Proves the assumption the DeviceSettings
    /// panel makes when it sends `{powerMeasuring:{enabled:N}}`.
    #[tokio::test]
    #[ignore = "requires the live BleBox device on the LAN"]
    async fn power_measuring_nested_partial_preserves() {
        let before = device_get(LIVE_IP, "api/settings/state", 6_000)
            .await
            .expect("read settings");
        let pm_before = before["settings"]["powerMeasuring"].clone();
        let original = pm_before["enabled"]
            .as_i64()
            .expect("powerMeasuring.enabled is an integer");
        let flipped = 1 - original;

        let restore = serde_json::json!({
            "settings": { "powerMeasuring": { "enabled": original } }
        });

        let result: Result<(), String> = async {
            device_post(
                LIVE_IP,
                "api/settings/set",
                serde_json::json!({
                    "settings": { "powerMeasuring": { "enabled": flipped } }
                }),
                6_000,
            )
            .await
            .map_err(|e| format!("flip POST: {e}"))?;

            let mid = device_get(LIVE_IP, "api/settings/state", 6_000)
                .await
                .map_err(|e| format!("re-read: {e}"))?;
            let pm_mid = &mid["settings"]["powerMeasuring"];
            if pm_mid["enabled"].as_i64() != Some(flipped) {
                return Err("flip did not take".into());
            }
            for key in ["safetyValue", "factoryCalibration"] {
                if pm_mid[key] != pm_before[key] {
                    return Err(format!(
                        "powerMeasuring.{key} changed across a nested partial update"
                    ));
                }
            }
            Ok(())
        }
        .await;

        let _ = device_post(LIVE_IP, "api/settings/set", restore, 6_000).await;
        let after = device_get(LIVE_IP, "api/settings/state", 6_000)
            .await
            .expect("read after restore");
        assert_eq!(
            after["settings"]["powerMeasuring"]["enabled"].as_i64(),
            Some(original),
            "powerMeasuring.enabled was not restored",
        );

        if let Err(msg) = result {
            panic!("{msg}");
        }
    }
}
