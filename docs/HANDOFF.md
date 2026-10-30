# Handoff

_Updated 2026-10-30 · toolchain baseline_

## State
- Toolchain proven: Phaser 4.2.1 (exact pin), TypeScript strict, Vite, Vitest, Playwright.
- Placeholder slice: grid sim in `src/sim/` (seeded RNG, flat state, command log, pure `step`),
  Phaser view in `src/game/` (Boot/Preload/Menu/Play/GameOver), camera bloom + vignette (`fx.ts`),
  ZzFX pickup blip after first input (`audio.ts`).
- Tests: sim replay golden hash `f633ba81` (seed 1337 + 3 commands) plus determinism checks.
  Playwright smoke test: no console errors, correct asset content-types, and a missing asset returns 404 (not index.html).
- Pre-commit hook (`.githooks/pre-commit`, typecheck + sim tests) is activated by `npm ci`. Proven to block a type error and a failing sim test.
- CI (`ci.yml`) is green on push/PR. `deploy.yml` on main runs CI, then GitHub Pages and itch (butler).
  Proven: a failing smoke test turns CI red, and the deploy jobs are skipped.
- `.claude/`: settings (model, permissions, attribution off), path rules, 3 subagents, `verify` skill,
  10 Phaser 4 skills, `launch.json` (dev on :5173).

## Open items
1. Manual setup (owner): `BUTLER_API_KEY` secret, `ITCH_USER`/`ITCH_GAME` variables, Pages source = GitHub Actions,
   itch HTML project + "played in the browser" checkbox. Until then the itch job warns and skips, and Pages fails.
2. Local session: run `/context` before and after one small feature, plus `/usage` and `/doctor`, and record the numbers here.
   Confirm subagents run on their assigned models (explorer/test-runner = haiku, implementer = sonnet).
3. Local session: Desktop preview pane check and a feel playtest (`docs/PLAYTEST.md`).
4. Live URL check in a private window and on a phone (Pages + itch).
5. Template conversion: strip the placeholder slice (checklist in the baseline PR), then mark the repo as a template.

## Next session's first task
Complete open item 1, push any commit to main, and confirm both Deploy jobs go green, with the itch upload playable in the browser.

## Measurements
| Metric | Before feature | After feature | Notes |
| --- | --- | --- | --- |
| /context total | | | |
| /usage (session) | | | |
| Subagent models seen in /usage | | | |
| /doctor prompt-audit | | | |
