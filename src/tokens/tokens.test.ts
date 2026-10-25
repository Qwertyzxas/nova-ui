import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrast } from './contrast.ts';
import { renderTokensCss } from './css.ts';
import { colorTokens, type ColorToken } from './tokens.ts';

const PAIRS: [ColorToken, ColorToken, number][] = [
  ['text', 'bg', 4.5],
  ['text', 'surface-raised', 4.5],
  ['text-muted', 'bg', 4.5],
  ['text-muted', 'surface', 4.5],
  ['text-muted', 'bg-subtle', 4.5],
  ['accent-fg', 'surface', 4.5],
  ['accent-fg', 'accent-soft', 4.5],
  ['on-accent', 'accent', 4.5],
  ['on-accent', 'accent-hover', 4.5],
  ['on-danger', 'danger', 4.5],
  ['danger-fg', 'surface', 4.5],
  ['danger-fg', 'danger-soft', 4.5],
  ['success-fg', 'success-soft', 4.5],
  ['warning-fg', 'warning-soft', 4.5],
  ['border-strong', 'surface', 3],
  ['border-strong', 'bg-subtle', 3],
  ['focus-ring', 'bg', 3],
  ['accent', 'bg', 3],
];

describe('colour tokens', () => {
  for (const theme of ['light', 'dark'] as const) {
    it.each(PAIRS)(`${theme}: %s on %s ≥ %s:1`, (fg, bg, min) => {
      expect(contrast(colorTokens[theme][fg], colorTokens[theme][bg])).toBeGreaterThanOrEqual(min);
    });
  }

  it('defines the same tokens in both themes', () => {
    expect(Object.keys(colorTokens.dark).sort()).toEqual(Object.keys(colorTokens.light).sort());
  });

  it('calculates contrast like the WCAG reference', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21);
    expect(contrast('#777777', '#ffffff')).toBeCloseTo(4.48, 2);
  });
});

describe('generated CSS', () => {
  it('is up to date with tokens.ts (run `npm run tokens` after editing tokens)', () => {
    const file = readFileSync(resolve(import.meta.dirname, '../styles/tokens.css'), 'utf8');
    expect(file.replace(/\r\n/g, '\n')).toBe(renderTokensCss());
  });

  it('exposes every token as a custom property', () => {
    const css = renderTokensCss();
    expect(css).toContain('--nova-color-accent: #4b5cf0;');
    expect(css).toContain('--nova-space-4: 16px;');
    expect(css).toContain("[data-nova-theme='dark']");
  });
});
