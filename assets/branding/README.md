# Branding assets

| File | What it is |
|---|---|
| `app-icon.png` | Master app icon (1024×1024) — source for the web favicons |

## Regenerating the favicons

`generate-favicons.mjs` rebuilds the web favicon set into `apps/web/public/`
from `app-icon.png`. macOS only (uses the built-in `sips`).

```sh
node assets/branding/generate-favicons.mjs
```

It writes `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`,
`apple-touch-icon.png` (180×180), `icon-192.png`, `icon-512.png` and a
multi-size `favicon.ico`.
