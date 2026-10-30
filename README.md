# dummy-gamer-3

Browser game, 960x540, keyboard and mouse.

## Controls

| Input | Action |
| --- | --- |
| Arrow keys / WASD | Move |
| Enter / Space / Click | Start, restart |
| Esc | Back to menu |

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
