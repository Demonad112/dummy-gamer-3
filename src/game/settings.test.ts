import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, parseSettings, serializeSettings } from './settings';

describe('parseSettings', () => {
  it('returns defaults for missing input', () => {
    expect(parseSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings(undefined)).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings('')).toEqual(DEFAULT_SETTINGS);
  });

  it('returns defaults for bad JSON or wrong shapes', () => {
    for (const raw of ['{', 'nope', 'null', '42', '"x"', '[]', '{"muted":"yes"}', '{"muted":1}', '{}']) {
      expect(parseSettings(raw)).toEqual(DEFAULT_SETTINGS);
    }
  });

  it('round-trips', () => {
    for (const muted of [true, false]) expect(parseSettings(serializeSettings({ muted }))).toEqual({ muted });
  });

  it('does not hand out the shared defaults object', () => {
    expect(parseSettings(null)).not.toBe(DEFAULT_SETTINGS);
  });
});
