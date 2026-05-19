//! Runtime configuration, read from environment variables at startup.
//!
//! Ported subset of the companion's env schema — only the timeouts still
//! apply; the companion's host/port are obsolete under Tauri.

/// Discovery and device-probe timeouts, in milliseconds.
#[derive(Debug, Clone, Copy)]
pub struct Config {
    /// How long a discovery scan runs before auto-stopping.
    pub discovery_timeout_ms: u64,
    /// Per-host `/info` probe budget.
    pub probe_timeout_ms: u64,
}

impl Config {
    pub fn from_env() -> Self {
        Self {
            discovery_timeout_ms: env_u64("DISCOVERY_TIMEOUT_MS", 8_000),
            probe_timeout_ms: env_u64("DEVICE_PROBE_TIMEOUT_MS", 1_500),
        }
    }

    /// Device proxy calls get 4x the probe budget — ported from the companion.
    pub fn proxy_timeout_ms(&self) -> u64 {
        self.probe_timeout_ms * 4
    }
}

fn env_u64(key: &str, default: u64) -> u64 {
    std::env::var(key)
        .ok()
        .and_then(|v| v.parse::<u64>().ok())
        .filter(|&n| n > 0)
        .unwrap_or(default)
}
