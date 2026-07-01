# Save Format Notes

These notes are intentionally cautious. Telltale save data is binary and differs between games and file roles.

## Common File Roles

- `wd1_saveslotN.bundle`: Season 1 slot metadata and choice/progress strings.
- `_wd1_saveslotN_autosave.bundle`: Season 1 autosave checkpoint.
- `wd2_saveSlotN.bundle`: Season 2 slot metadata.
- `_wd2_saveSlotN_checkpointN.bundle`: Season 2 checkpoint bundles.
- `_wd2_saveSlotN_id.estore` and `_Page*.epage`: Season 2 episode/page state.
- `wdm_*`: Michonne save slot, autosave, and checkpoint data.
- `wd3_*`: A New Frontier save data.
- `wd4_*`: The Final Season save data.

## Editing Strategy

The first version uses same-length binary text patches for known strings. This is intentionally limited because it avoids shifting binary offsets in partially unknown structures.

Examples:

- `shawnduck_choice - duck` can be detected.
- `sided_with_kenny - true` can be detected.
- Replacing `true` with `false` is not applied yet unless the structured prop writer supports that field.

## Safer Future Work

- Map `6VSM` bundle container sections.
- Decode `.prop` entries as typed key/value pairs.
- Rebuild sections with corrected lengths and checksums if present.
- Add per-game choice definitions from clean before/after save comparisons.

