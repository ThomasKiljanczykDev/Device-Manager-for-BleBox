//! Tauri entry point for the BleBox Device Manager.
//!
//! Commands replace the former Fastify companion service; `tauri-specta`
//! exports their signatures to `js/src/bindings.ts` so the React app calls
//! them with full type safety via `invoke()`.

/// Liveness probe — a placeholder command so the bindings pipeline has
/// something to export. Replaced by the real device commands in a later step.
#[tauri::command]
#[specta::specta]
fn get_health() -> String {
    "ok".to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder =
        tauri_specta::Builder::<tauri::Wry>::new().commands(tauri_specta::collect_commands![
            get_health
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
