import { expect, test } from '@playwright/test';

// Deliberately failing: proves CI goes red and deploy is skipped. Reverted in the next commit.
test('ci proof: deliberate failure', () => {
  expect(1).toBe(2);
});
