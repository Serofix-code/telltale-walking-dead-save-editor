# Research Notes

The first choice list is based on three sources:

- Live Definitive Series saves from local testing.
- Downloaded original Season 1 save packs used only for comparison.
- The Reddit Season 1 save thread, which asks uploaders to label the major Season 1 carryover decisions: Kenny/Doug-Carley, Larry, St. Johns, food, Lilly, Duck, Crawford, Ben, Lee's arm, and Lee's ending.

Source thread:

https://www.reddit.com/r/TheWalkingDeadGame/comments/1tzfzl/season_1_save_thread_a_place_to_download_saves/

## Confirmed Definitive Series Tokens

These tokens were observed as readable strings in local Definitive Series slot bundles:

- `shawnduck_choice - duck`
- `sided_with_kenny - true`
- `lied_to_hershel - false`
- `gave_irene_gun - true`
- `dougcarley_saved - doug`
- `helped_kill_larry - true`
- `left_lilly - false`
- `shot_jolene - false`
- `shot_beatrice - false`
- `chopped_leg - true`

## Caution

The editor currently applies only same-length binary text patches. Many Telltale values are length-prefixed inside binary containers, so changing `true` to `false`, `doug` to `carley`, or `duck` to `shawn` needs a proper structured writer before it can be considered safe.

