/**
 * Framework-free Zod schemas, derived types, enums and helpers for the app.
 *
 * Formerly the `@blebox/shared` package; folded into the web app when the
 * companion service was replaced by the Tauri Rust backend.
 */
export * from './constants';
export * from './schemas/device';
export * from './schemas/actions';
export * from './schemas/companion';
export * from './schemas/wifi';
export * from './schemas/settings';
export * from './net/ip';
export * from './json-schema';
