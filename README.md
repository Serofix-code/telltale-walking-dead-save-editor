# Telltale Walking Dead Save Editor

A local-only HTML save editor for **The Walking Dead: The Telltale Definitive Series**.

The app runs in your browser and does not upload saves anywhere. It can inspect save slots across the series, show detected scenes/checkpoints, edit known choice strings, and export modified copies.

## Supported Games

- The Walking Dead Season 1 (`wd1_*`)
- The Walking Dead Season 2 (`wd2_*`)
- The Walking Dead: Michonne (`wdm_*`)
- The Walking Dead: A New Frontier (`wd3_*`)
- The Walking Dead: The Final Season (`wd4_*`)

## Current Status

This is an early, conservative editor. It avoids risky binary rewrites where the file format is not fully mapped yet.

Working now:

- Load save files or a full save folder
- Detect game/slot/checkpoint files by filename
- Scan readable choice/progress strings
- Edit known text choices when the replacement can be safely encoded
- Export edited files
- Generate a backup manifest

Planned:

- Full per-season choice database
- Safer structured `.prop` editing
- One-click checkpoint reset packs
- Import/export choice presets

## Save Folder

Default Definitive Series save folder on Windows:

```text
Documents\Telltale Games\The Walking Dead Definitive
```

## Use

Open `index.html` in a modern browser, then select your save folder or drag files into the page.

Always back up your saves before replacing anything. The app can export edited copies, but browser apps cannot safely patch files in place on every browser.

## Development

This repo is static HTML/CSS/JS. No build step is required.

To test with a local server:

```powershell
npx serve .
```

Or just open `index.html`.

