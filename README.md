# dummy-gamer-3

Phaser 4 browser game template, 960x540, keyboard and mouse.

## Controls

| Input | Action |
| --- | --- |
| Enter / Space / Click | Start, restart |
| Space / Click | Act (placeholder command) |
| Esc | End run |

## Dev commands

```bash
npm ci            # install (also activates the pre-commit hook)
npm run dev       # dev server on http://localhost:5173
npm run typecheck # tsc, strict
npm test          # vitest (sim)
npm run build     # production build to dist/
npm run preview   # serve dist/ on http://localhost:4173
npm run e2e       # Playwright smoke test against preview (build first)
```

License: MIT
