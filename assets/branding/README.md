# Branding assets

Master logo source files — kept for future reference. Do not edit the
generated favicons directly; regenerate them from these instead.

| File | What it is |
|---|---|
| `blebox-1600-1600-max.xcf` | GIMP source (editable master) |
| `blebox-dark-1600-1600-max.png` | Logo in a dark circle — used to generate the favicons |
| `blebox-light-1600-1600-max.png` | Logo mark on a transparent background |

## Regenerating the favicons

`generate-favicons.mjs` rebuilds the web favicon set into `apps/web/public/`
from `blebox-dark-1600-1600-max.png`. macOS only (uses the built-in `sips`).

```sh
node assets/branding/generate-favicons.mjs
```

It writes `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`,
`apple-touch-icon.png` (180×180), `icon-192.png`, `icon-512.png` and a
multi-size `favicon.ico`.
