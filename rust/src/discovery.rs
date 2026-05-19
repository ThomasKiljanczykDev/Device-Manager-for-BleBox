//! Hybrid LAN discovery — ports the companion's `discovery.ts`.
//!
//! BleBox publishes no mDNS service name, so discovery combines two strategies:
//! an active sweep of every local /24 (the reliable path) and a best-effort
//! mDNS `_http._tcp` browse (catches devices outside the swept subnets).
//!
//! Every candidate host is confirmed by probing `GET /info`; only the
//! switch / light device families are surfaced.

use std::collections::{HashMap, HashSet};
use std::net::IpAddr;
use std::sync::{Arc, Mutex};
use std::time::Duration;

use serde::Serialize;
use serde_json::Value;

use crate::config::Config;
use crate::http;
use crate::net;

/// Device families this app surfaces — ported from `constants.ts`.
const SUPPORTED_TYPES: [&str; 4] = ["switchBox", "switchBoxD", "buttonBox", "wLightBox"];

/// Concurrent in-flight probes during a subnet sweep.
const SWEEP_CONCURRENCY: usize = 64;

/// A BleBox device found on the LAN. Serialized to a JSON string at the command
/// boundary, then Zod-validated by the frontend.
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DiscoveredDevice {
    pub ip: String,
    /// The `device` object from the host's `/info` response.
    pub device: Value,
    pub discovered_at: String,
}

/// `get_discovered_devices` response.
#[derive(Debug, Clone, Serialize)]
pub struct DiscoveryDevicesResponse {
    pub scanning: bool,
    pub devices: Vec<DiscoveredDevice>,
}

struct Inner {
    scanning: bool,
    /// Bumped on every start/stop; running tasks bail when it changes.
    epoch: u64,
    devices: HashMap<String, DiscoveredDevice>,
    probed: HashSet<String>,
}

/// Discovery state, shared as Tauri managed state and cloned into scan tasks.
#[derive(Clone)]
pub struct DiscoveryService {
    inner: Arc<Mutex<Inner>>,
}

impl DiscoveryService {
    pub fn new() -> Self {
        Self {
            inner: Arc::new(Mutex::new(Inner {
                scanning: false,
                epoch: 0,
                devices: HashMap::new(),
                probed: HashSet::new(),
            })),
        }
    }

    /// Snapshot of the current scan state and discovered devices.
    pub fn snapshot(&self) -> DiscoveryDevicesResponse {
        let inner = self.inner.lock().unwrap();
        DiscoveryDevicesResponse {
            scanning: inner.scanning,
            devices: inner.devices.values().cloned().collect(),
        }
    }

    /// Starts a scan. No-op if one is already running. Discovered devices from
    /// previous scans are retained.
    pub fn start(&self, config: Config) {
        let epoch = {
            let mut inner = self.inner.lock().unwrap();
            if inner.scanning {
                return;
            }
            inner.scanning = true;
            inner.epoch += 1;
            inner.probed.clear();
            inner.epoch
        };

        let svc = self.clone();
        tauri::async_runtime::spawn(async move { svc.run_sweep(epoch, config).await });

        let svc = self.clone();
        tauri::async_runtime::spawn(async move { svc.run_mdns(epoch, config).await });

        let svc = self.clone();
        tauri::async_runtime::spawn(async move {
            tokio::time::sleep(Duration::from_millis(config.discovery_timeout_ms)).await;
            svc.stop_if(epoch);
        });
    }

    /// Stops the active scan; discovered devices are kept.
    pub fn stop(&self) {
        let mut inner = self.inner.lock().unwrap();
        if inner.scanning {
            inner.scanning = false;
            inner.epoch += 1;
        }
    }

    fn stop_if(&self, epoch: u64) {
        let mut inner = self.inner.lock().unwrap();
        if inner.scanning && inner.epoch == epoch {
            inner.scanning = false;
            inner.epoch += 1;
        }
    }

    /// Whether `epoch` is still the current scan.
    fn current(&self, epoch: u64) -> bool {
        let inner = self.inner.lock().unwrap();
        inner.scanning && inner.epoch == epoch
    }

    /// Claims `ip` for probing this epoch; returns `false` if already claimed
    /// or the epoch is stale.
    fn claim(&self, epoch: u64, ip: &str) -> bool {
        let mut inner = self.inner.lock().unwrap();
        if !inner.scanning || inner.epoch != epoch {
            return false;
        }
        inner.probed.insert(ip.to_string())
    }

    /// Active sweep of every local /24 (hosts `.1`–`.254`).
    async fn run_sweep(&self, epoch: u64, config: Config) {
        let sem = Arc::new(tokio::sync::Semaphore::new(SWEEP_CONCURRENCY));
        for prefix in local_subnets() {
            for host in 1u8..=254 {
                if !self.current(epoch) {
                    return;
                }
                let ip = format!("{prefix}.{host}");
                if !self.claim(epoch, &ip) {
                    continue;
                }
                let Ok(permit) = sem.clone().acquire_owned().await else {
                    return;
                };
                let svc = self.clone();
                tauri::async_runtime::spawn(async move {
                    let _permit = permit;
                    svc.probe(&ip, epoch, config).await;
                });
            }
        }
    }

    /// Best-effort mDNS `_http._tcp` browse. Failures are non-fatal — the
    /// subnet sweep is the reliable path.
    async fn run_mdns(&self, epoch: u64, config: Config) {
        let daemon = match mdns_sd::ServiceDaemon::new() {
            Ok(d) => d,
            Err(e) => {
                log::warn!("mDNS unavailable, relying on the subnet sweep: {e}");
                return;
            }
        };
        let receiver = match daemon.browse("_http._tcp.local.") {
            Ok(r) => r,
            Err(e) => {
                log::warn!("mDNS browse failed: {e}");
                return;
            }
        };
        while self.current(epoch) {
            match tokio::time::timeout(Duration::from_millis(500), receiver.recv_async()).await {
                Ok(Ok(mdns_sd::ServiceEvent::ServiceResolved(info))) => {
                    for v4 in info.get_addresses_v4() {
                        let ip = v4.to_string();
                        if self.claim(epoch, &ip) {
                            let svc = self.clone();
                            tauri::async_runtime::spawn(async move {
                                svc.probe(&ip, epoch, config).await;
                            });
                        }
                    }
                }
                Ok(Ok(_)) => {}        // other mDNS events — ignored
                Ok(Err(_)) => break,   // browse channel closed
                Err(_) => continue,    // poll timeout — re-check the epoch
            }
        }
        let _ = daemon.shutdown();
    }

    /// Probes one host's `/info` and records it if it is a supported BleBox.
    async fn probe(&self, ip: &str, epoch: u64, config: Config) {
        let Ok(body) = http::get_info(ip, config.probe_timeout_ms).await else {
            return;
        };
        let Some(device) = body.get("device") else {
            return;
        };
        let supported = device
            .get("type")
            .and_then(Value::as_str)
            .is_some_and(|t| SUPPORTED_TYPES.contains(&t));
        if !supported {
            return;
        }
        let Some(id) = device.get("id").and_then(Value::as_str) else {
            return;
        };
        let entry = DiscoveredDevice {
            ip: ip.to_string(),
            device: device.clone(),
            discovered_at: chrono::Utc::now().to_rfc3339(),
        };
        let mut inner = self.inner.lock().unwrap();
        if inner.scanning && inner.epoch == epoch {
            inner.devices.insert(id.to_string(), entry);
        }
    }
}

/// Local /24 prefixes (e.g. `192.168.88`) for every private IPv4 interface.
fn local_subnets() -> Vec<String> {
    let mut prefixes = HashSet::new();
    if let Ok(ifaces) = if_addrs::get_if_addrs() {
        for iface in ifaces {
            if iface.is_loopback() {
                continue;
            }
            if let IpAddr::V4(v4) = iface.ip() {
                if net::is_private_ipv4(&v4.to_string()) {
                    let o = v4.octets();
                    prefixes.insert(format!("{}.{}.{}", o[0], o[1], o[2]));
                }
            }
        }
    }
    prefixes.into_iter().collect()
}

#[cfg(test)]
mod live_tests {
    //! Integration check against the known live device. Excluded from normal
    //! runs; run with `cargo test -- --ignored`.
    use super::*;

    #[tokio::test]
    #[ignore = "requires the live BleBox device on the LAN"]
    async fn discovers_the_live_device() {
        let service = DiscoveryService::new();
        service.start(Config {
            discovery_timeout_ms: 8_000,
            probe_timeout_ms: 1_500,
        });
        // Poll until the sweep reaches 192.168.88.200, or the scan ends.
        for _ in 0..24 {
            tokio::time::sleep(Duration::from_millis(500)).await;
            let snapshot = service.snapshot();
            if snapshot.devices.iter().any(|d| d.ip == "192.168.88.200") {
                return;
            }
        }
        panic!("the subnet sweep did not discover 192.168.88.200");
    }
}
