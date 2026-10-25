import { colorTokens, scaleTokens, shadowTokens } from './tokens.ts';

type Theme = keyof typeof colorTokens;

const declarations = (entries: [string, string][], indent = '  ') => entries.map(([k, v]) => `${indent}--nova-${k}: ${v};`).join('\n');

function themeEntries(theme: Theme): [string, string][] {
  return [
    ...Object.entries(colorTokens[theme]).map(([k, v]): [string, string] => [`color-${k}`, v]),
    ...Object.entries(shadowTokens[theme]).map(([k, v]): [string, string] => [`shadow-${k}`, v]),
  ];
}

function scaleEntries(): [string, string][] {
  return Object.entries(scaleTokens).flatMap(([group, values]) =>
    Object.entries(values).map(([k, v]): [string, string] => [`${group}-${k}`, String(v)]),
  );
}

export function renderTokensCss(): string {
  return `:root {
${declarations(scaleEntries())}
}

:root,
[data-nova-theme='light'] {
  color-scheme: light;
${declarations(themeEntries('light'))}
}

[data-nova-theme='dark'] {
  color-scheme: dark;
${declarations(themeEntries('dark'))}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-nova-theme='light']) {
    color-scheme: dark;
${declarations(themeEntries('dark'), '    ')}
  }
}
`;
}
