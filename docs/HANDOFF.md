# Handoff

_Updated 2026-10-31 · template conversion_

## State
- Toolchain proven and deployed: Phaser 4.2.1 (exact pin), TypeScript strict, Vite, Vitest, Playwright.
  CI is green, and Deploy on main is green (Pages + itch).
- Template skeleton replaces the placeholder grid slice:
  - `src/sim/`: `SimState { seed, rng, tick, roll, status }`, `Command = act | wait`. `act` rolls a d6 from the seeded RNG. Pure `step` and `replay`.
  - `src/game/`: Boot/Preload/Menu/Play/GameOver. Play shows one block and a HUD. Space/Click sends `act` (blip + pulse), Esc ends the run.
    Camera bloom + vignette (`fx.ts`), lazy ZzFX (`audio.ts`).
- Tests: replay golden hash `3560e748` (seed 1337, log act/wait/act), determinism, JSON round-trip, RNG advance, no input mutation (5 total).
  The smoke test drives `act`, checks for zero console errors and correct content-types, and checks that a missing asset returns 404.
- The pre-commit hook (typecheck + sim tests) is active after `npm ci`.
- README has the "starting a game from this template" checklist. DECISIONS #14 records the template decision.

## Open items (closed by owner 2026-10-31)
1. Manual setup: secrets/variables, Pages source, itch HTML project. Done.
2. Local `/context`, `/usage`, `/doctor` and the subagent model check. Done. Numbers are not recorded here.
3. Desktop preview pane check and feel playtest. Done.
4. Live URL check in a private window and on a phone. Done.
5. Template conversion. Slice stripped in this branch. Mark the repo as a template in Settings after merge.

## Next session's first task
Nov 1: once the theme is announced, create the game repo from this template (README checklist), then fill in `docs/GDD.md`
(pitch, core loop, verbs, Must/Should/Could). After that, replace `act` with the first real verb and get the core loop playable by Nov 7.

## Measurements
| Metric | Before feature | After feature | Notes |
| --- | --- | --- | --- |
| /context total | | | not recorded |
| /usage (session) | | | not recorded |
| Subagent models seen in /usage | | | not recorded |
| /doctor prompt-audit | | | not recorded |
