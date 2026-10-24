import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Every story from the built Storybook, checked by axe in a real browser (jsdom
// can't compute rendered colour contrast) in both themes.
interface IndexEntry {
  id: string;
  title: string;
  name: string;
  type: 'story' | 'docs';
}

const index = JSON.parse(readFileSync(resolve(import.meta.dirname, '../storybook-static/index.json'), 'utf8')) as {
  entries: Record<string, IndexEntry>;
};
const stories = Object.values(index.entries).filter((e) => e.type === 'story');

test('the catalogue is not empty', () => {
  expect(stories.length).toBeGreaterThan(20);
});

for (const theme of ['light', 'dark'] as const) {
  for (const story of stories) {
    test(`${theme} · ${story.title} · ${story.name}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(`iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`);
      await expect(page.locator('#storybook-root > *').first()).toBeVisible();
      // let entrance animations finish so colours are final
      await page.waitForTimeout(400);
      const results = await new AxeBuilder({ page }).include('#storybook-root').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      const violations = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
      expect(violations).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}
