//! Tauri entry point for the BleBox Device Manager.
//!
//! Commands replace the former Fastify companion service; `tauri-specta`
//! exports their signatures to `js/src/bindings.ts` so the React app calls
//! them with full type safety via `invoke()`.

mod commands;
mod config;
mod discovery;
mod error;
mod http;
mod keychain;
mod net;

use config::Config;
use discovery::DiscoveryService;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri_specta::Builder::<tauri::Wry>::new().commands(tauri_specta::collect_commands![
        commands::start_discovery,
        commands::stop_discovery,
        commands::get_discovered_devices,
        commands::probe_device,
        commands::device_info,
        commands::device_state_extended,
        commands::device_actions_state,
        commands::device_save_action,
        commands::device_set_state,
        commands::device_ota_update,
        commands::device_wifi_scan,
        commands::device_wifi_connect,
        commands::device_network,
        commands::device_set_network,
        commands::device_settings_state,
        commands::device_settings_set,
    ]);

    // Regenerate the TypeScript bindings on every debug run so the frontend
    // contract never drifts from the Rust command signatures.
    #[cfg(debug_assertions)]
    builder
        .export(
            specta_typescript::Typescript::default(),
            "../js/src/bindings.ts",
        )
        .expect("failed to export TypeScript bindings");

    tauri::Builder::default()
        .invoke_handler(builder.invoke_handler())
        .manage(Config::from_env())
        .manage(DiscoveryService::new())
        .setup(move |app| {
            builder.mount_events(app);
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running the Tauri application");
}
