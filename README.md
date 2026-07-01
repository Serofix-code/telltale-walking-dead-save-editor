# Telltale Walking Dead Save Editor

A local-only HTML save editor for **The Walking Dead: The Telltale Definitive Series**.

The app runs in your browser and does not upload saves anywhere. It can inspect save slots across the series, show detected scenes/checkpoints, edit known choice strings, and export modified copies.

## Supported Games

- The Walking Dead Season 1 (`wd1_*`)
- The Walking Dead Season 2 (`wd2_*`)
- The Walking Dead: Michonne (`wdm_*`)
- The Walking Dead: A New Frontier (`wd3_*`)
- The Walking Dead: The Final Season (`wd4_*`)

## Quick Start

1. Open the web app.
2. Click **Add save folder**.
3. Choose `Documents\Telltale Games\The Walking Dead Definitive`.
4. Pick a slot file from the left side.
5. Review **Known Choices**, **Detected Strings**, and **Presets**.
6. Download edited files and manually replace the originals after making a backup.

Do not edit saves while the game is running. If Steam Cloud asks which files to keep, choose local files when you want to keep your edits.

## Save Editing Warning

Back up your entire save folder before changing anything. Telltale saves are binary files, and editing them can corrupt saves, break checkpoints, or make the game fail to load a slot. The web app locks editing until the user clicks the risk acknowledgement button. By enabling save editing, the user accepts the risk and responsibility for their own saves. The authors are not responsible for lost progress, corrupted files, or broken saves.

## Current Status

This is an early, conservative editor. It avoids risky binary rewrites where the file format is not fully mapped yet.

Working now:

- Load save files or a full save folder
- Detect game/slot/checkpoint files by filename
- Scan readable choice/progress strings
- Edit known text choices when the replacement can be safely encoded
- Apply Good / Evil / Natural preset targets where safe
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

Common files:

- `wd1_saveslot1.bundle`, `wd1_saveslot2.bundle`, `wd1_saveslot3.bundle`: Season 1 slots
- `_wd1_saveslot1_autosave.bundle`: Season 1 slot autosave/checkpoint
- `wd2_saveSlot1.bundle`: Season 2 slot
- `wdm_saveSlot1.bundle`: Michonne slot
- `wd3_saveslot1...`: A New Frontier slot/state files
- `wd4_saveslot1.bundle`: The Final Season slot
- `prefs.prop`: selected save/menu preferences

## Use

Open `index.html` in a modern browser, then select your save folder or drag files into the page.

Always back up your saves before replacing anything. The app can export edited copies, but browser apps cannot safely patch files in place on every browser.

## License

This project uses the Serofix Non-Commercial Source License. You can read, copy, edit, and publish meaningfully changed versions, but you cannot sell this project or modified versions of it.

## Development

This repo is static HTML/CSS/JS. No build step is required.

To test with a local server:

```powershell
npx serve .
```

Or just open `index.html`.
