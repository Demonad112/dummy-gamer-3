import type { Command, CommandLog } from './commands';
import { COLS, ROWS, createState, spawnItem, type SimState } from './state';

export const WIN_SCORE = 10;

// Pure: returns a new state, never mutates the input.
export function step(prev: SimState, cmd: Command): SimState {
  const state: SimState = structuredClone(prev);
  if (state.status !== 'playing') return state;
  state.tick++;

  if (cmd.t === 'move') {
    state.playerX = clamp(state.playerX + cmd.dx, 0, COLS - 1);
    state.playerY = clamp(state.playerY + cmd.dy, 0, ROWS - 1);
  }

  const hit = state.itemsX.findIndex((x, i) => x === state.playerX && state.itemsY[i] === state.playerY);
  if (hit >= 0) {
    state.itemsX.splice(hit, 1);
    state.itemsY.splice(hit, 1);
    state.score++;
    if (state.score >= WIN_SCORE) state.status = 'won';
    else spawnItem(state);
  }
  return state;
}

export function replay(seed: number, log: CommandLog): SimState {
  return log.reduce(step, createState(seed));
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}
