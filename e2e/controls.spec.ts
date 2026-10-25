import { expect, test } from '@playwright/test';

// An object control on a ReactNode prop lets anyone "Set object" and pass `{}`,
// which crashes the story (React error #31). Only real data props may use it.
test('no story exposes an object control for a non-data prop', async ({ page }) => {
  await page.goto('iframe.html');
  await page.waitForFunction(() => (window as any).__STORYBOOK_PREVIEW__?.storyStoreValue);
  const offenders = await page.evaluate(async () => {
    const preview = (window as any).__STORYBOOK_PREVIEW__;
    const index = await (await fetch('index.json')).json();
    const found: string[] = [];
    for (const entry of Object.values<any>(index.entries)) {
      if (entry.type !== 'story') continue;
      const story = await preview.storyStoreValue.loadStory({ storyId: entry.id });
      for (const [name, argType] of Object.entries<any>(story.argTypes)) {
        const control = argType.control;
        if (control?.type === 'object' && !control.disable && argType.type?.name !== 'array') found.push(`${entry.title}: ${name}`);
      }
    }
    return [...new Set(found)];
  });
  expect(offenders).toEqual([]);
});
