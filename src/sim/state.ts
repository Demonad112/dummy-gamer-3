import { randomInt } from './rng';

export const WORLD_W = 960;
export const WORLD_H = 540;
export const GRID = 30;
export const COLS = WORLD_W / GRID;
export const ROWS = WORLD_H / GRID;
export const ITEM_COUNT = 5;

// Flat, JSON-serializable. No classes, no references, no functions.
export interface SimState {
  seed: number;
  rng: number;
  tick: number;
  playerX: number;
  playerY: number;
  itemsX: number[];
  itemsY: number[];
  score: number;
  status: 'playing' | 'won';
}

export function createState(seed: number): SimState {
  const state: SimState = {
    seed,
    rng: seed >>> 0,
    tick: 0,
    playerX: Math.floor(COLS / 2),
    playerY: Math.floor(ROWS / 2),
    itemsX: [],
    itemsY: [],
    score: 0,
    status: 'playing',
  };
  for (let i = 0; i < ITEM_COUNT; i++) spawnItem(state);
  return state;
}

export function spawnItem(state: SimState): void {
  for (;;) {
    const [x, r1] = randomInt(state.rng, COLS);
    const [y, r2] = randomInt(r1, ROWS);
    state.rng = r2;
    const onPlayer = x === state.playerX && y === state.playerY;
    const onItem = state.itemsX.some((ix, i) => ix === x && state.itemsY[i] === y);
    if (!onPlayer && !onItem) {
      state.itemsX.push(x);
      state.itemsY.push(y);
      return;
    }
  }
}
