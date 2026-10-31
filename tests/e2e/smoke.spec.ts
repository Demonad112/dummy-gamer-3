import { expect, test } from '@playwright/test';

const EXPECTED_TYPE: Record<string, RegExp> = {
  '.js': /javascript/,
  '.css': /text\/css/,
  '.json': /json/,
  '.png': /image\/png/,
  '.wasm': /application\/wasm/,
};

test('boots without console errors and serves assets with real content-types', async ({ page }) => {
  const errors: string[] = [];
  const badAssets: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('response', (res) => {
    const url = new URL(res.url());
    const ext = url.pathname.match(/\.[a-z0-9]+$/i)?.[0] ?? '';
    const want = EXPECTED_TYPE[ext];
    const type = res.headers()['content-type'] ?? '';
    if (want && (!want.test(type) || type.includes('text/html'))) badAssets.push(`${url.pathname} -> ${type}`);
  });

  await page.goto('./');
  await expect(page.locator('canvas')).toBeVisible();
  // Start a run so Play, the camera filters and the lazy audio chunk all execute.
  await page.locator('canvas').click();
  await page.keyboard.press('Space');
  await page.waitForTimeout(500);

  expect(badAssets, 'asset responses with wrong content-type (SPA fallback?)').toEqual([]);
  expect(errors, 'console errors').toEqual([]);
});

test('missing asset is a 404, not an index.html fallback', async ({ request }) => {
  const res = await request.get('./assets/does-not-exist.js');
  expect(res.status()).toBe(404);
  expect(res.headers()['content-type'] ?? '').not.toContain('text/html');
});
