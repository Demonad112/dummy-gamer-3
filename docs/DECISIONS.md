# Decisions

Settled. Don't re-litigate without new information. Add new entries at the bottom with a date.

| # | Date | Decision | Why |
| --- | --- | --- | --- |
| 1 | 2026-10-30 | Phaser 4.2.1, pinned exactly (`"phaser": "4.2.1"`), `import Phaser from 'phaser'`. Phaser 3.90.0 is the fallback only on explicit call. | Current stable, filters API; exact pin avoids drift mid-jam. |
| 2 | 2026-10-30 | TypeScript strict, Vite, Vitest, Playwright. | Fast build, typed sim, browser smoke test. |
| 3 | 2026-10-30 | Pure-TS deterministic sim in `src/sim/` (one seeded RNG, flat serializable state, serializable command log, no Phaser/DOM). Thin Phaser view in `src/game/`. | Replayable, unit-testable, view can be rewritten freely. |
| 4 | 2026-10-30 | All FX code in `src/game/fx.ts`. | One place to tune or disable effects. |
| 5 | 2026-10-30 | 960x540 logical resolution, Phaser Scale FIT. | 16:9, fits the itch embed and phones. |
| 6 | 2026-10-30 | Keyboard and mouse only. | Scope. |
| 7 | 2026-10-30 | Vite `base: './'`, `appType: 'mpa'`. | Works under any subpath (Pages, itch). No SPA fallback, so missing assets 404 in preview like in prod. |
| 8 | 2026-10-30 | Audio: ZzFX v1.3.x (21 params), lazy-loaded on first user input. | Zero binary assets, no autoplay warnings. |
| 9 | 2026-10-30 | Art: primitives with a fixed palette (`src/game/palette.ts`). No binary assets. | Speed, consistency, tiny build. |
| 10 | 2026-10-30 | MIT license. | Jam default. |
| 11 | 2026-10-30 | Deploy: GitHub Pages plus itch.io (butler `html5` channel) from main after CI passes. | Two public builds, identical artifact. |
| 12 | 2026-10-30 | Camera filters: bloom via `Phaser.Actions.AddEffectBloom(cam, { useInternal: true })`, vignette via `cam.filters.internal.addVignette()`. WebGL only. | Verified against the 4.2.1 types. Phaser 4 has no `addBloom`. |
| 13 | 2026-10-30 | Pre-commit hook in `.githooks/`, activated by the npm `prepare` script. | Active in every fresh clone without extra deps. |
| 14 | 2026-10-31 | This repo is the jam template. The placeholder grid slice is replaced by a minimal skeleton (one `act` command that rolls the seeded RNG, one block, HUD). Each game starts from "Use this template". | Keeps the toolchain, invariants and tests proven while leaving no game rules to delete. |
