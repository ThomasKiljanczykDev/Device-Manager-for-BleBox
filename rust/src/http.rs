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
        ] {
            device_get(LIVE_IP, path, 6_000)
                .await
                .unwrap_or_else(|e| panic!("GET /{path} failed: {e}"));
        }
    }
}
