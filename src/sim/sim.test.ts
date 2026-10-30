import { describe, expect, it } from 'vitest';
import { createState, hashState, replay, step, type CommandLog } from './index';

const SEED = 1337;
const LOG: CommandLog = [
  { t: 'move', dx: 1, dy: 0 },
  { t: 'move', dx: 0, dy: -1 },
  { t: 'wait' },
];
// Golden hash: update deliberately (and note why in the commit) if sim rules change.
const EXPECTED_HASH = 'f633ba81';

describe('sim replay', () => {
  it('seed + 3 commands produces the expected state hash', () => {
    const s = replay(SEED, LOG);
    expect(s.tick).toBe(3);
    expect(hashState(s)).toBe(EXPECTED_HASH);
  });

  it('same seed and log twice gives an identical state', () => {
    expect(replay(SEED, LOG)).toEqual(replay(SEED, LOG));
  });

  it('state survives a JSON round-trip', () => {
    const s = replay(SEED, LOG);
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
  });

  it('step does not mutate its input', () => {
    const s = createState(SEED);
    const before = hashState(s);
    step(s, { t: 'move', dx: 1, dy: 1 });
    expect(hashState(s)).toBe(before);
  });
});
