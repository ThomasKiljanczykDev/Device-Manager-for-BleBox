//! Error type returned by Tauri commands.
//!
//! Mirrors the `{ code, message }` body the former Fastify companion sent, so
//! the frontend's existing error handling carries over unchanged.

use serde::Serialize;
use specta::Type;

/// A structured command failure. `code` is a stable machine-readable tag;
/// `message` is human-readable.
#[derive(Debug, Clone, Serialize, Type)]
pub struct CommandError {
    pub code: String,
    pub message: String,
}

impl CommandError {
    pub fn new(code: &str, message: impl Into<String>) -> Self {
        Self {
            code: code.to_string(),
            message: message.into(),
        }
    }

    pub fn invalid_ip() -> Self {
        Self::new(
            "INVALID_IP",
            "Address must be a private or link-local IPv4 literal",
        )
    }

    pub fn device_timeout() -> Self {
        Self::new("DEVICE_TIMEOUT", "The device did not respond in time")
    }

    pub fn proxy_failed() -> Self {
        Self::new("PROXY_FAILED", "Could not reach the device")
    }

    pub fn device_status(status: u16) -> Self {
        Self::new("DEVICE_ERROR", format!("The device returned HTTP {status}"))
    }
}

impl std::fmt::Display for CommandError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}: {}", self.code, self.message)
    }
}

impl std::error::Error for CommandError {}
