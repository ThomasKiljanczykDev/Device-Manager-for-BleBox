//! Private-IPv4 allowlist — ported from the companion's `net/ip.ts`.

/// Parses a strict IPv4 literal into its four octets, or `None` if invalid.
///
/// Matches the JS `parseIpv4`: exactly four dot-separated groups of 1–3 ASCII
/// digits, each `<= 255`. Hostnames are rejected.
pub fn parse_ipv4(value: &str) -> Option<[u8; 4]> {
    let parts: Vec<&str> = value.trim().split('.').collect();
    if parts.len() != 4 {
        return None;
    }
    let mut octets = [0u8; 4];
    for (i, part) in parts.iter().enumerate() {
        if part.is_empty() || part.len() > 3 || !part.bytes().all(|b| b.is_ascii_digit()) {
            return None;
        }
        let n: u32 = part.parse().ok()?;
        if n > 255 {
            return None;
        }
        octets[i] = n as u8;
    }
    Some(octets)
}

/// Whether an IPv4 literal is in private / link-local / loopback space:
/// `10/8`, `172.16/12`, `192.168/16`, `169.254/16`, `127/8`.
pub fn is_private_ipv4(value: &str) -> bool {
    let Some([a, b, _, _]) = parse_ipv4(value) else {
        return false;
    };
    match a {
        10 => true,
        172 => (16..=31).contains(&b),
        192 => b == 168,
        169 => b == 254,
        127 => true,
        _ => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn accepts_private_link_local_and_loopback() {
        assert!(is_private_ipv4("10.0.0.1"));
        assert!(is_private_ipv4("10.255.255.255"));
        assert!(is_private_ipv4("172.16.0.1"));
        assert!(is_private_ipv4("172.31.255.255"));
        assert!(is_private_ipv4("192.168.88.200"));
        assert!(is_private_ipv4("169.254.1.1"));
        assert!(is_private_ipv4("127.0.0.1"));
    }

    #[test]
    fn rejects_public_addresses() {
        assert!(!is_private_ipv4("8.8.8.8"));
        assert!(!is_private_ipv4("1.1.1.1"));
        assert!(!is_private_ipv4("172.15.0.1"));
        assert!(!is_private_ipv4("172.32.0.1"));
        assert!(!is_private_ipv4("192.169.0.1"));
        assert!(!is_private_ipv4("169.253.0.1"));
    }

    #[test]
    fn rejects_malformed_input() {
        assert!(!is_private_ipv4(""));
        assert!(!is_private_ipv4("example.com"));
        assert!(!is_private_ipv4("10.0.0"));
        assert!(!is_private_ipv4("10.0.0.1.2"));
        assert!(!is_private_ipv4("10.0.0.256"));
        assert!(!is_private_ipv4("10.0.0.x"));
        assert!(!is_private_ipv4("10.0..1"));
    }
}
