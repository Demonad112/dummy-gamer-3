import { expect, test } from '@playwright/test';
import { checkReplay, type ReplayFile } from '../../src/sim';

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
  await expect(page.locator('canvas')).toHaveAttribute('data-scene', 'Play');
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

test('real-time sim ticks, and F8 exports a replay that re-simulates to the same hash', async ({ page }) => {
  await page.goto('./?seed=4242');
  const canvas = page.locator('canvas');
  await canvas.click();
  // Scene switches land on the next frame; a key pressed earlier would go to Menu.
  await expect(canvas).toHaveAttribute('data-scene', 'Play');
  await page.keyboard.press('Space');

  const exportReplay = async (): Promise<ReplayFile> => {
    const [download] = await Promise.all([page.waitForEvent('download'), page.keyboard.press('F8')]);
    let text = '';
    for await (const chunk of await download.createReadStream()) text += String(chunk);
    return JSON.parse(text) as ReplayFile;
  };

  // Headless frame rate varies widely, so poll for the condition instead of sleeping a fixed time.
  let file!: ReplayFile;
  await expect
    .poll(async () => {
      file = await exportReplay();
      const kinds = new Set(file.runs.map(([cmd]) => cmd.t));
      return kinds.has('act') && kinds.has('wait');
    }, { message: 'replay has the input and idle ticks logged as wait', timeout: 20_000 })
    .toBe(true);

  expect(file.v).toBe(1);
  expect(file.seed).toBe(4242);
  expect(checkReplay(file)).toEqual({ ok: true, hash: file.hash, ticks: file.ticks });
});

test('P pauses the sim: ticks freeze while paused and resume after P', async ({ page }) => {
  test.setTimeout(90_000); // several F8 round-trips at a low headless frame rate
  await page.goto('./?seed=7');
  const canvas = page.locator('canvas');
  await canvas.click();
  await expect(canvas).toHaveAttribute('data-scene', 'Play');
  await expect(canvas).toHaveAttribute('data-paused', 'false');

  const exportTicks = async (): Promise<number> => {
    const [download] = await Promise.all([page.waitForEvent('download'), page.keyboard.press('F8')]);
    let text = '';
    for await (const chunk of await download.createReadStream()) text += String(chunk);
    return (JSON.parse(text) as ReplayFile).ticks;
  };

  // Let some ticks accumulate first so a frozen count is distinguishable from "never started".
  await expect.poll(exportTicks, { timeout: 20_000 }).toBeGreaterThan(0);

  await page.keyboard.press('p');
  await expect(canvas).toHaveAttribute('data-paused', 'true');
  const first = await exportTicks(); // F8 still works while paused
  await page.waitForTimeout(500);
  const second = await exportTicks();
  expect(second).toBe(first);

  await page.keyboard.press('p');
  await expect(canvas).toHaveAttribute('data-paused', 'false');
  await expect
    .poll(async () => `${(await exportTicks()) > second}:${await canvas.getAttribute('data-paused')}`, {
      message: 'ticks resume after unpausing (value is "ticksIncreased:data-paused")',
      timeout: 40_000,
    })
    .toBe('true:false');
});

test('M mutes, and the setting survives a reload', async ({ page }) => {
  await page.goto('./');
  const canvas = page.locator('canvas');
  await expect(canvas).toHaveAttribute('data-scene', 'Menu');
  await expect(canvas).toHaveAttribute('data-muted', 'false');
  await page.keyboard.press('m');
  await expect(canvas).toHaveAttribute('data-muted', 'true');

  await page.reload();
  await expect(page.locator('canvas')).toHaveAttribute('data-scene', 'Menu');
  await expect(page.locator('canvas')).toHaveAttribute('data-muted', 'true');
});
