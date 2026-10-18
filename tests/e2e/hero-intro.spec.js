import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';

/**
 * The Hero's opening locks scroll and hides the page until it finishes. These
 * tests pin the rule that no animation failure may leave RELAT blank or
 * scroll-locked, and that the normal opening still plays.
 *
 * Run against the production build (`npm run build`), in Chromium and WebKit.
 * Google Tag Manager is blocked throughout: the tests must not depend on a
 * third party, and its only effect — shifting load timing — is reproduced
 * explicitly by the ordering tests.
 */

const ASSETS = new URL('../../build/client/assets/', import.meta.url);
const chunk = (test) =>
  readdirSync(ASSETS).find((f) => f.endsWith('.js') && test(f, readFileSync(new URL(f, ASSETS), 'utf8')));
const GSAP_CORE = chunk((f, src) => f.startsWith('index-') && src.includes('ticker'));
const SCROLLTRIGGER = chunk((f) => f.startsWith('ScrollTrigger-'));

// Recovery limits from src/hooks/useHeroIntro.js and src/root.jsx, plus margin.
const INIT_LIMIT_MS = 4000;
const SEQUENCE_LIMIT_MS = 10000;
const HYDRATE_LIMIT_MS = 8000;

// Records whether the opening actually played (the first letter becomes
// visible while the overlay is up), as opposed to being skipped by recovery.
const TRACK_PLAYED = `
  window.__played = false;
  document.addEventListener('DOMContentLoaded', () => {
    (function loop() {
      const overlay = document.querySelector('.hero-intro-overlay');
      const letter = overlay && overlay.querySelector('.hero-intro-letter');
      if (overlay && letter && +getComputedStyle(overlay).opacity > 0.9 && +getComputedStyle(letter).opacity > 0.9) window.__played = true;
      if (!window.__played) requestAnimationFrame(loop);
    })();
  });
`;

const DELAY_FONTS_READY = (ms) => `
  (() => { const ready = document.fonts.ready;
    Object.defineProperty(document.fonts, 'ready', { get() { return ready.then(() => new Promise((r) => setTimeout(r, ${ms}))); } }); })();
`;

async function open(page, { init = '', abort = [], delay = [], url = '/' } = {}) {
  await page.addInitScript(TRACK_PLAYED);
  if (init) await page.addInitScript(init);
  await page.route('**/*', async (route) => {
    const u = route.request().url();
    if (/googletagmanager\.com/.test(u)) return route.abort();
    if (abort.some((re) => re.test(u))) return route.abort();
    const d = delay.find((x) => x.re.test(u));
    if (d) await new Promise((r) => setTimeout(r, d.ms));
    return route.continue().catch(() => {});
  });
  await page.goto(url, { waitUntil: 'commit' });
}

const snapshot = (page) =>
  page.evaluate(() => {
    const nav = document.querySelector('[data-hero-intro-pending]');
    const hold = document.querySelector('[data-intro-hold]');
    const sig = document.querySelector('.signature-wordmark');
    return {
      navOpacity: nav ? +getComputedStyle(nav).opacity : null,
      hold: hold ? hold.dataset.introHold : null,
      signatureOpacity: sig ? +getComputedStyle(sig).opacity : null,
      locked: document.documentElement.style.overflow === 'hidden' || document.body?.style.overflow === 'hidden',
      played: window.__played,
      motionOff: !document.documentElement.classList.contains('js-motion'),
      failsafe: document.documentElement.hasAttribute('data-motion-failsafe'),
    };
  });

/** The page is visible, settled and unlocked. */
async function expectReadable(page, withinMs) {
  await expect
    .poll(async () => {
      const s = await snapshot(page);
      return s.navOpacity === 1 && s.hold === 'false' && !s.locked;
    }, { timeout: withinMs, intervals: [200] })
    .toBe(true);
}

/** Scrolling really works (a locked page snaps straight back to 0). */
async function expectScrollable(page) {
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY)), { timeout: 3000 }).toBeGreaterThan(300);
}

/** Nothing the page reveals is left hidden (allowing the reveal's own ~1s fade). */
async function expectNothingHidden(page) {
  await expect
    .poll(
      () => page.evaluate(() => [...document.querySelectorAll('.reveal')].filter((e) => +getComputedStyle(e).opacity < 1).length),
      { timeout: 3500, intervals: [250] }
    )
    .toBe(0);
}

test.describe('Hero opening', () => {
  test('1. Hero initialises before the Statement — the opening plays and settles', async ({ page }) => {
    await open(page, { delay: [{ re: new RegExp(SCROLLTRIGGER), ms: 2500 }] });
    await expectReadable(page, SEQUENCE_LIMIT_MS + 5000);
    expect((await snapshot(page)).played).toBe(true);
    await expectScrollable(page);
  });

  test('2. Statement initialises before the Hero (fonts.ready late) — the opening still plays', async ({ page }) => {
    // The ordering that used to hand the Hero's letter tween to the Statement's
    // paused timeline and deadlock the page.
    await open(page, { init: DELAY_FONTS_READY(2500) });
    await expectReadable(page, SEQUENCE_LIMIT_MS + 5000);
    const s = await snapshot(page);
    expect(s.played).toBe(true);
    expect(s.failsafe).toBe(false);
    await expectScrollable(page);
  });

  test('3. fonts.ready never resolves — recovers within the init limit', async ({ page }) => {
    await open(page, { init: `Object.defineProperty(document.fonts, 'ready', { get() { return new Promise(() => {}); } });` });
    await expectReadable(page, INIT_LIMIT_MS + 3000);
    await expectScrollable(page);
  });

  test('4. GSAP dynamic import fails — readable, scrollable and unhidden at once', async ({ page }) => {
    await open(page, { abort: [new RegExp(GSAP_CORE)] });
    await expectReadable(page, 3000);
    const s = await snapshot(page);
    expect(s.motionOff).toBe(true);
    expect(s.failsafe).toBe(true);
    await expectNothingHidden(page);
    await expectScrollable(page);
  });

  test('5. the opening throws mid-sequence — recovers without waiting for a timer', async ({ page }) => {
    const warnings = [];
    page.on('console', (m) => m.type() === 'warning' && warnings.push(m.text()));
    await open(page, {
      init: `
        const real = HTMLElement.prototype.getBoundingClientRect;
        HTMLElement.prototype.getBoundingClientRect = function () {
          if (this.classList.contains('hero-intro-wordmark')) throw new Error('boom');
          return real.call(this);
        };`,
    });
    await expectReadable(page, 8000);
    expect(warnings.some((w) => w.includes('[hero] opening skipped'))).toBe(true);
    await expectScrollable(page);
  });

  test('6. the opening hangs — the watchdog recovers within the sequence limit', async ({ page }) => {
    // The 1s hold between the letter reveal and the split never fires.
    await open(page, {
      init: `const st = window.setTimeout; window.setTimeout = (f, ms, ...a) => (ms === 1000 ? 0 : st(f, ms, ...a));`,
    });
    // Still locked while it waits…
    await page.waitForTimeout(3000);
    expect((await snapshot(page)).locked).toBe(true);
    // …and released by the watchdog.
    await expectReadable(page, SEQUENCE_LIMIT_MS + 4000);
    await expectScrollable(page);
  });

  test('6b. the opening hangs at its last beat — the signature is brought back into view', async ({ page }) => {
    // By then the persistent wordmark has been parked below the viewport; the
    // 500ms wait before its rise never fires.
    await open(page, {
      init: `const st = window.setTimeout; window.setTimeout = (f, ms, ...a) => (ms === 500 ? 0 : st(f, ms, ...a));`,
    });
    await expectReadable(page, SEQUENCE_LIMIT_MS + 4000);
    const sig = await page.evaluate(() => {
      const el = document.querySelector('.signature-wordmark');
      return { opacity: +getComputedStyle(el).opacity, top: el.getBoundingClientRect().top, viewport: window.innerHeight };
    });
    expect(sig.opacity).toBe(1);
    expect(sig.top).toBeLessThan(sig.viewport - 20);
    await expectScrollable(page);
  });

  test('7. scroll is locked during the opening and released after it', async ({ page }) => {
    await open(page);
    await expect.poll(async () => (await snapshot(page)).locked, { timeout: 4000 }).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => Math.round(window.scrollY))).toBe(0);
    await expectReadable(page, SEQUENCE_LIMIT_MS + 5000);
    await expectScrollable(page);
  });

  test('8. leaving the page mid-opening releases the lock and does not replay it', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await open(page);
    await expect.poll(async () => (await snapshot(page)).locked, { timeout: 4000 }).toBe(true);
    // Client-side navigation while the opening is running.
    await page.evaluate(() => document.querySelector('a[href="/work/"]').click());
    await expect(page).toHaveURL(/\/work\/$/);
    expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe('hidden');
    expect(await page.locator('.hero-intro-split-half').count()).toBe(0);
    await expectScrollable(page);
    // Coming back: settled immediately, no second opening.
    await page.evaluate(() => document.querySelector('a[href="/"]').click());
    await expect(page).toHaveURL(/\/$/);
    await expectReadable(page, 2500);
    await page.waitForTimeout(8000); // past every timer the first mount could have left behind
    expect(errors).toEqual([]);
    await expectReadable(page, 500);
  });

  test('9. normal load — the opening plays in full and ends in the settled pose', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const t0 = Date.now();
    await open(page);
    await expectReadable(page, SEQUENCE_LIMIT_MS + 5000);
    const took = Date.now() - t0;
    const s = await snapshot(page);
    expect(s.played).toBe(true);
    expect(s.failsafe).toBe(false);
    expect(s.signatureOpacity).toBe(1);
    // Nominally ~5s; far from instant (not skipped) and well inside the limit.
    expect(took).toBeGreaterThan(3000);
    expect(took).toBeLessThan(SEQUENCE_LIMIT_MS);
    await expectScrollable(page);
    expect(errors).toEqual([]);
  });
});

test.describe('Failsafes stay quiet after success', () => {
  test('after a normal load, neither the 8s failsafe nor the 10s watchdog ever acts', async ({ page }) => {
    const warnings = [];
    page.on('console', (m) => m.type() === 'warning' && warnings.push(m.text()));
    await open(page);
    await expectReadable(page, SEQUENCE_LIMIT_MS + 5000);
    // Well past both limits, counted from the start of the load.
    await page.waitForTimeout(8000);
    const s = await snapshot(page);
    expect(s.failsafe).toBe(false);
    expect(s.motionOff).toBe(false);
    expect(s.played).toBe(true);
    expect(s.navOpacity).toBe(1);
    expect(s.signatureOpacity).toBe(1);
    expect(s.locked).toBe(false);
    expect(warnings.filter((w) => w.includes('opening skipped'))).toEqual([]);
  });
});

test.describe('Blank-page failsafe', () => {
  test('the app never loads — content is revealed once the hydration limit passes', async ({ page }) => {
    await open(page, { abort: [/\/assets\/.*\.js/] });
    // Hidden by `js-motion` while it waits…
    await page.waitForTimeout(1500);
    expect((await snapshot(page)).navOpacity).toBe(0);
    // …then restored by the failsafe in the pre-paint script.
    await expect
      .poll(async () => (await snapshot(page)).failsafe, { timeout: HYDRATE_LIMIT_MS + 3000, intervals: [250] })
      .toBe(true);
    const s = await snapshot(page);
    expect(s.motionOff).toBe(true);
    expect(s.navOpacity).toBe(1);
    await expectNothingHidden(page);
  });
});
